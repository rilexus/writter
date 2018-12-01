import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EditorService} from "../../../../../editor.service";
import {Text} from "../../../../text-area/interfaces/Text";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {
  @Output() isOpen = new EventEmitter();
  
  textSuggestionList = [];
  searchString = '';
	
	
	constructor(private editorService: EditorService) { }
 
	clearSugestionsList() {
	    this.textSuggestionList  = [];
	    this.searchString = '';
	    this.open(false);
  }
	
	
	search(withValue: string) {
	    const res = [];
	    const foundTexts: Text[] = this.editorService.search(withValue);
	    
	    if (foundTexts.length > 0) {
	        foundTexts.forEach( text => {
	            const preview = this.buildPreview(text, withValue);
	            res.push({confData: {id: text.confData.id}, preview: preview});
          });
      }
      this.textSuggestionList = res;
	    if (this.textSuggestionList.length > 0) {
		    this.open(true);
	    }
	    
  }
	
	getTextSlice(text: string, start: number, end: number): string {
		const wordsArray = this.wordsToArray(text);
		
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
	
	private wordsToArray(text: string) {
		return text.match(/\S+/g);
	}
	
	stripHTML(html: string) {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		const text = tmp.textContent || tmp.innerText || '';
		return text;
	}
  
  selectText(withId: number) {
	  this.editorService.selectText(withId);
	  this.open(false);
	  this.searchString = '';
	  this.textSuggestionList = [];
  }
  
  buildPreview(fromText: Text, word: string) {
	  // cut of html tags
	  const noneHTMLText = this.stripHTML(fromText.value);
	  
	  // find saerching word in text
	  const wordIndex = noneHTMLText.indexOf(word);
	  
	  // cut text around the searching word
	  let textAroundWord = '';
	  if (wordIndex >= 100) {
		  textAroundWord =  noneHTMLText.slice(wordIndex - 100, wordIndex + 100);
	  } else {
		  textAroundWord = noneHTMLText.slice(0, wordIndex + 100);
	  }
	  // build array of words around the searching word
	  const textAroundWordArray = this.wordsToArray(textAroundWord); // is array
	  
	  // find position of the searching word in array
	  if (textAroundWordArray) {
		  const wordIndexInArray = textAroundWordArray.indexOf(word); // position in array
		  
		  let wordsArray: string[] = [];
		  // get 3 words before and 3 behind the searching word
		  if (wordIndexInArray >= 3) {
			  wordsArray =  textAroundWordArray.slice(wordIndexInArray - 3, wordIndexInArray + 5); // array
		  } else {
			  wordsArray =  textAroundWordArray.slice(0, wordIndexInArray + 10); // array
		  }
		  
		  return {
			  title: this.getTextSlice(noneHTMLText, 0, 5), // get first 5 words of text
			  preview: wordsArray.join(' ')}; // 3 words before and after the searching word
	  }
	  return {title: '', preview: ''};
  }
  
	open(isOpen: boolean) {
    this.isOpen.next(isOpen);
  }
	
  
  ngOnInit() {
	  
  }

}
