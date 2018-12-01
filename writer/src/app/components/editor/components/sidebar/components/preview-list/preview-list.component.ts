import {Component, OnInit} from '@angular/core';
import {TextPreview} from '../../../text-area/interfaces/TextPreview';
import {Subscription} from 'rxjs/index';
import {EditorService} from '../../../../editor.service';
import {Text} from '../../../text-area/interfaces/Text';

@Component({
	selector: 'app-preview-list',
	templateUrl: './preview-list.component.html',
	styleUrls: ['./preview-list.component.scss']
})
export class PreviewListComponent implements OnInit {
	textsPreviews: TextPreview[] = [];
	subcriptionToTextChange: Subscription;
	isSearching = false;
	
	
	constructor(private editorService: EditorService) {}
	
	ngOnInit() {
		this.getTexts();
		this.subcriptionToTextChange = this.editorService.textsChange.subscribe(texts => {
			this.generatePreview(texts);
		});
	}
	
	getTexts() {
		const _texts = this.editorService.getTexts();
		this.generatePreview(_texts);
	}
	
	search(value: string) {
		if(value === '') {
			this.getTexts();
		} else {
			const foundText = this.editorService.search(value);
			this.generatePreview(foundText);
		}
	}
	
	getTextSlice(text: string, start: number, end: number): string {
		const wordsArray = text.match(/\S+/g);
		if (wordsArray) {
			const arraySlice = wordsArray.slice(start, end);
			let result = '';
			arraySlice.forEach(word => {
				result = result + ' ' + word;
			});
			return result.trim();
		}
		return '';
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
	
	generatePreview(texts: Text[]) {
		const previews = [];
		texts.forEach(text => {
			const titleHtml = this.getTextSlice(text.value, 0 , 4); // 4 words
			let title = this.stripHTML(titleHtml).trim(); // remove html tags
			if (title === '') {
				title = '<p>No Text<br></p>';
			}
			const bodyHTML = this.getTextSlice(text.value, 0 , 10);
			let body = this.stripHTML(bodyHTML).trim();
			if (body === '') {
				body = '<p>document is empty<br></p>';
			}
			const id = text._id;
			const fontFamily = text.confData.fontFamily;
			const createdDate = new Date(text.confData.creationData).toDateString();
			const wordsCount = this.countWords(text.value);
			previews.push({
				id: id,
				title: title,
				body: body,
				fontFamily: fontFamily,
				createdDate: createdDate,
				wordsCount: wordsCount
			});
		});
		this.textsPreviews = previews;
	}
	
	stripHTML(html: string) {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		const text = tmp.textContent || tmp.innerText || '';
		return text;
	}
	
	inceptHTML(listElementId: string, htmlAsString: string) {
		const elem = document.getElementById(listElementId);
		elem.innerHTML = htmlAsString;
	}
	
	removeText(withId: number): void {
		this.editorService.removeText(withId);
	}
	
	addText() {
		this.editorService.addText();
	}
	
	selectText(withId: number): void {
		this.editorService.selectText(withId);
	}
	
}
