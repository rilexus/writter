import {Injectable} from '@angular/core';
import {Subject} from "rxjs/index";
import {Text} from "./components/text-area/interfaces/Text";
import {TextPreview} from "./components/text-area/interfaces/TextPreview";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HttpOptionsService} from "../../providers/http-options.service";
import {AuthService} from "../../providers/auth.service";
import {HttpService} from "../../providers/http.service";

@Injectable({
	providedIn: 'root'
})

export class EditorService {
	
	textareaFontSizeChange = new Subject<number>();
	textAreaCharacterCountChange = new Subject<number>();
	wordCountChange = new Subject<number>();
	paragraphCountChange = new Subject<number>();
	previewChanges = new Subject<TextPreview[]>();
	textsChange = new Subject<Text[]>();
	
	currentTextChange = new Subject<string>();
	
	selectedTextChange = new Subject<Text>();
	characterCount = 0;
	wordsCount = 0;
	selectedTextIndex = 0;
	paragraphCount = 0;
	
	currentText = '';
	
	fontfamilys = [
		'Lucida Sans Typewriter',
		'Special Elite',
		'Helvetica Neue',
		'Helvetica',
		'Athelas',
		'Charter',
		'Georgia',
		'Iowan',
		'Palatino',
		'Seravek',
		'Times New Roman'
	];
	texts = [];
	selectedText: Text = null;
	
	constructor(
		private http: HttpClient,
		private httpService: HttpService,
		private httpOptionsService: HttpOptionsService,
		private authService: AuthService) {}
	
	
	getTexts(): Text[] {
		if (this.texts) {
			return this.texts;
		}
		return [];
	}
	
	async loginWithToken() {
		 await this.authService.loginWithToken().catch((err) => {console.log(err)});
	}
	
	createUser() {
		const httpOptions = this.httpOptionsService.getHttpOptions();
		this.http.post(environment.apiUrl + 'users/create', {}, httpOptions)
			.subscribe(
				response => {
					console.log(response);
				},
				error => {
					console.error(error);
				});
	}
	
	get standartFontFamily(): string {
		return this.fontfamilys[0];
	}
	
	fetchTexts() {
		this.texts = [];
		this.httpService.get(environment.apiUrl + 'users/texts')
			.then(texts => {
				this.texts = texts as Text[];
				console.log('texts from server', texts);
				this.setSelectedText(this.texts[0]);
			})
			.catch( error => {
				if (error.status === 401) {
					const text = this.createDummyText();
					this.setSelectedText(text);
				}
				console.error(error);
			});
	}
	
	private createDummyText() {
		return {
			confData: {
				creationData: new Date().toDateString(),
				editData: new Date().toDateString(),
				id: new Date().getTime(),
				fontFamily: 'Lucida Sans Typewriter',
				fontSize: 18
			},
			_id: '-1',
			value: '<p>You are not logged in! Therefore you cant save texts.</p>'
		};
	}
	
	
	postText(text: Text) {
		this.httpService.post(environment.apiUrl + 'users/texts/update', text)
			.then((response) => {
				console.log('saved text' , response);
			})
			.catch(error => {
				console.error('error while saved text' , error);
			});
	}
	
	deleteTextAtServer(withId: number) {
		this.httpService.delete(environment.apiUrl + 'users/texts/delete/' + withId)
		.then(response => {
			console.log('text deletet response', response);
		}).catch( error => {
			console.error(error);
		});
		// this.http.get(environment.apiUrl + 'texts/delete/' + withId)
		// .subscribe(
		// 	succes => {
		// 			console.log(succes);
		// 	},
		// 	error => {
		// 		console.error(error);
		// 	}
		// );
	}
	
	selectText(withId: number): void {
		const index = this.texts.findIndex(text => {
			return text._id === withId;
		});
		if (index > -1) {
			this.setSelectedText(this.texts[index]);
		}
	}
	
	calcStats(text: string) {
		const wordsCount = this.countWords(text);
		this.setWordsCount(wordsCount); // emites word count
		this.setCharactersCount(text.length); // emites the number
		
		const paragraphCount = this.countParagraphs(text);
		this.setParagraphCount(paragraphCount);
		// this.previewChanges.next(this.getTextPreview());
	}
	
	setSelectedText(text: Text) {
		if (text) {
			this.selectedText = text;
			this.selectedTextChange.next(this.selectedText);
			this.textsChange.next(this.texts);
		}
	}
	
	addText() {
		this.httpService.get(environment.apiUrl + 'users/texts/create')
			.then( text => {
				console.log('created text', text);
				this.texts.push(text);
				this.textsChange.next(this.texts);
			})
			.catch( error => {
				console.log(error);
			});
	}
	
	removeText(withId: number): void {
		const index = this.texts.findIndex(text => text._id === withId);
		
		if (index > -1) {
			// the text to delete is the current displayed text and should be removed
			if (this.selectedText.confData.id === withId && this.texts[index].confData.id) {
				if (this.texts[index + 1]) { // if more text exist display the next one
					this.setSelectedText(this.texts[index + 1]);
				} else { // no more texts exist
					// this.setSelectedText(this.createNewText()); // overwrite
				}
			}
			this.deleteText(index);
			this.deleteTextAtServer(withId);
		}
	}
	
	private deleteText(index: number) {
		if (index > -1) {
			this.texts.splice(index, 1);
			this.textsChange.next(this.texts);
		}
	}
	
	search(forText: string): Text[] {
		const res = [];
		if (forText) {
			this.texts.forEach(text => {
				if (text.value) {
					if (text.value.includes(forText)) {
						res.push(text);
					}
				}
			});
		}
		return res;
	}
	
	selectFontFamily(fontName: string) {
		this.selectedText.confData.fontFamily = fontName;
		this.selectedTextChange.next(this.selectedText);
		this.postText(this.selectedText);
		// this.previewChanges.next(this.getTextPreview());
	}
	
	private setWordsCount(count: number) {
		this.wordsCount = count;
		this.wordCountChange.next(count);
	}
	
	
	getFontFamilies() {
		return this.fontfamilys.slice();
	}
	
	private setCharactersCount(count: number) {
		this.characterCount = count;
		this.textAreaCharacterCountChange.next(count);
	}
	
	private countWords(text: string): number {
		if (text) {
			const wordArray = text.match(/\S+/g)
			if (wordArray) {
				return wordArray.length;
			}
		}
		return 0;
	}
	
	private countParagraphs(text: string): number {
		if (text) {
			return text.replace(/\n$/gm, '').split(/\n/).length;
			;
		}
		return 0;
	}
	
	setParagraphCount(count: number) {
		this.paragraphCount = count;
		this.paragraphCountChange.next(this.paragraphCount);
	}
	
	setDefaultTextareaFontSize() {
		this.setTextAreaFontSize(14);
	}
	
	private setTextAreaFontSize(size: number): void {
		this.selectedText.confData.fontSize = size;
		this.textareaFontSizeChange.next(this.selectedText.confData.fontSize);
		
		this.postText(this.selectedText);
	}
	
	decreaseFontSize() {
		const size = this.selectedText.confData.fontSize;
		if (size > 10) {
			this.setTextAreaFontSize(size - 2);
		}
	}
	
	increaseFontSize() {
		const size = this.selectedText.confData.fontSize;
		if (size < 24) {
			this.setTextAreaFontSize(size + 2);
		}
	}
	
}
