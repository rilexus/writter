import { Injectable } from '@nestjs/common';
import {Text} from "../../writer/src/app/components/editor/components/text-area/interfaces/Text";
import {UsersService} from "../users/users.service";

@Injectable()
export class TextsService {
	
	constructor() {}
	
	texts = [
		{
			confData: {
				creationData: new Date().toDateString(),
				editData: new Date().toDateString(),
				id: new Date().getTime() + 1,
				fontFamily: 'Lucida Sans Typewriter',
				fontSize: 18,
			},
			value: '<p>' +
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rhoncus, neque at aliquet aliquet, ipsum justo eleifend mi, at blandit tortor dolor quis felis. Nunc dignissim velit vitae diam tincidunt sagittis. Pellentesque mauris arcu, volutpat id tellus ac, cursus venenatis urna. Nullam purus dolor, consequat sit amet dolor in, mollis feugiat erat. Nullam eget vehicula ex. Praesent eget dui urna. Nunc interdum massa nec lorem maximus, a finibus metus rutrum. Praesent ante velit, rutrum sed tristique a, vulputate eu ipsum. Proin id vulputate justo. Sed nec ullamcorper libero. Ut aliquam nibh vel est dictum luctus.\n' +
			'\n' +
			'Vivamus venenatis sagittis turpis, vel sodales felis. Aenean id eleifend orci, eget mattis nisi. Curabitur eget sapien commodo, elementum enim at, consequat nulla. Phasellus eu maximus enim. Sed varius fermentum diam sit amet sagittis. Praesent facilisis sem interdum, ultricies erat eu, tincidunt ante. Quisque sodales laoreet ipsum, et dignissim enim bibendum a. Fusce ultricies felis sit amet ipsum rhoncus condimentum. Mauris facilisis ultrices est, quis congue massa. Quisque euismod ante et eleifend imperdiet. Ut efficitur posuere semper. Pellentesque luctus justo vitae sem gravida, ut pellentesque nunc maximus. Mauris ut nisl non nibh posuere vehicula.\n' +
			'\n' +
			'Maecenas et auctor felis. Mauris tincidunt lorem nec metus commodo, vel fermentum neque egestas. Phasellus arcu ipsum, dignissim in nisi porta, blandit maximus lacus. Praesent suscipit purus et pharetra aliquam. In rhoncus, est id interdum tempor, quam magna suscipit libero, ac porttitor dolor urna sed dolor. Morbi elementum sem efficitur ante dictum efficitur. Vestibulum ut vestibulum eros. Sed id cursus lacus. Duis volutpat ut augue eget vestibulum. Praesent luctus elit lacus, sodales convallis nibh imperdiet eu.\n' +
			'\n' +
			'Curabitur ut bibendum sem, ac congue turpis. Suspendisse vitae posuere neque. Nullam nec sapien sed urna sollicitudin tincidunt mattis ut lorem. Fusce condimentum at lorem eget ullamcorper. Proin feugiat purus at elit pharetra, id feugiat velit auctor. In maximus scelerisque quam, eget cursus dui lacinia at. Sed quis consectetur quam. Integer maximus enim sed nisi mattis vestibulum. Praesent non scelerisque tortor. Aliquam sollicitudin vestibulum efficitur. Donec interdum mauris commodo, fermentum odio eget, eleifend lacus. Nunc urna orci, placerat sed pulvinar nec, mollis in est. Donec mauris augue, egestas maximus felis ut, porttitor pharetra elit.\n' +
			'\n' +
			'Suspendisse diam dolor, lacinia eu nunc ut, suscipit aliquam enim. Morbi pellentesque felis ac turpis hendrerit luctus. Aenean in metus auctor, feugiat libero ac, feugiat justo. Sed lacinia justo vestibulum, iaculis diam eu, efficitur ex. Cras finibus dictum purus eget fringilla. Praesent ullamcorper bibendum urna quis accumsan. Cras finibus ipsum ut dolor dapibus, et tincidunt felis ullamcorper. Proin vel magna est. Phasellus vestibulum diam aliquam feugiat tempor. Donec sapien lectus, laoreet vel pharetra quis, vestibulum nec turpis. Cras id gravida ligula. Quisque mollis et augue eget ullamcorper. Vivamus quis sollicitudin turpis. Suspendisse laoreet urna id odio ornare, non accumsan lorem blandit. Nam tristique dui ut sapien mattis, nec aliquam libero sodales. Nullam et justo dictum, elementum libero vitae, varius nunc.'
			+
			'</p>',
		},
		{
			confData: {
				creationData: new Date().toDateString(),
				id: new Date().getTime() + 2,
				editData: new Date().toDateString(),
				fontFamily: 'Lucida Sans Typewriter',
				fontSize: 18,
			},
			value: '<p>Samo sun <b>thick</p>',
		},
		{
			confData: {
				creationData: new Date().toDateString(),
				id: new Date().getTime() + 3,
				editData: new Date().toDateString(),
				fontFamily: 'Lucida Sans Typewriter',
				fontSize: 18,
			},
			value: '<p>Ipsum</p>',
		},
	];
	
	async getTexts(): Promise<Text[]> {
		return new Promise<Text[]>((res, rej) => {
			// res(this.texts);
		});
	}
	
	deleteText(withId: number): Promise<boolean> {
		return new Promise<boolean>((res, rej) => {
			const index = this.texts.findIndex(text => {
				return text.confData.id == withId; // want accept ===
			});
			if (index > -1) {
				this.texts.splice(index, 1);
				res(true);
			} else {
				rej(false);
			}
		});
	}
	async save(text: Text) {
		return new Promise((res, rej) => {
			// this.userService.saveText(text, userId)
			// try {
			// 	const index = this.texts.findIndex(_text => {
			// 		return _text.confData.id === text.confData.id;
			// 	});
			// 	if (index > -1) {
			// 		this.texts[index] = text;
			// 		res({type: 'update'});
			// 	} else {
			// 		this.texts.push(text);
			// 		res({type: 'added'});
			// 	}
			// }catch (e){
			// 	rej(e);
			// }
		});
	}
	
	root(): string {
		return 'as';
	}
}
