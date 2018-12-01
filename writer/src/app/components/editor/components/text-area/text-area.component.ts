import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditorService} from "../../editor.service";
import {Subscription} from "rxjs/index";
import {Text} from "./interfaces/Text";
import {AuthService} from "../../../../providers/auth.service";

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit, OnDestroy {
  
  subscriptionToTextChange: Subscription;
	subscriptionToUserLogin: Subscription;
  text: Text = null;
  selectionRange: {start: number, end: number} = {start: null, end: null};
  clickPoint: {x: number, y: number} = {x: null, y: null};
  wasSelected = false;
  
  
  textBackup = '';
	
	constructor(private editorServise: EditorService, private authService: AuthService) { }
	
	ngOnInit() {
		// document.execCommand('styleWithCSS', false, false);
		// add <p> tag instead on <div> when enter is pressed on the textarea
		document.execCommand('defaultParagraphSeparator', true, 'p');
		this.subscriptionToTextChange = this.editorServise.selectedTextChange.subscribe( text => {
			this.inseartText(text);
			const textArea = document.getElementById('textareaDiv');
			this.editorServise.calcStats(textArea.innerText);
			this.wasSelected = false;
			// this.text = text;
		});
		this.subscriptionToUserLogin = this.authService.userAuthenticationChanges.subscribe( isAuth => {
		  if (isAuth === false) {
		    this.inseartText(this.createDummyText());
		    // this.text = this.createDummyText();
      }
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
  
  get fontSizeOfText(): number {
    if (this.text) {
      return this.text.confData.fontSize;
    }
    return 14;
  }
  
  get fontFamilyOfText(): string {
    if (this.text) {
      return this.text.confData.fontFamily;
    }
    return this.editorServise.standartFontFamily;
  }
  
  onKeyPress($event, textDiv) {
    this.editorServise.calcStats(textDiv.innerText);
    this.text.value = $event.target.innerHTML;
    // save text to server
    if ($event.key === 'Enter') {
	    console.log('press');
      this.editorServise.postText(this.text);
    }
  }
  
  onMouseDown($event) {
    if (this.wasSelected) {
      this.wasSelected = false; // hide hover menue
      this.saveText();
    }
  }
  
  saveText() {
    const textArea = document.getElementById('textareaDiv');
    if (textArea ) {
      this.text.value = textArea.innerHTML;
      if (this.text._id !== '-1') { // dummy text
        this.editorServise.postText(this.text);
      }
    }
  }
  
  onMouseLeave($event) {
    if (this.text) {
      this.saveText();
    }
  }
  
  onMouseUp($event) {
    this.clickPoint.x = $event.clientX;
    this.clickPoint.y = $event.clientY;
    
    // open hover menue
    setTimeout(() => {
      const selection = $event.view.getSelection();
      if (selection.isCollapsed === false && selection.anchorOffset !== selection.focusOffset) {
        this.wasSelected = true;
      }
    }, 5);
  }
  
  doubleClick($event) {
	  this.wasSelected = true;
  }
  
  onClick($event) {
    this.selectionRange = {start: null, end: null};
  }

  ngOnDestroy() {
    this.subscriptionToTextChange.unsubscribe();
  }
  private _placeCaret(toNode: Node, charPosition: number) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(
      toNode, // place caret to the last node in textarea
      charPosition// at position (last)
    );
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  private getLastNode(textAreaNode: any) {
    let tempNode = textAreaNode.childNodes[textAreaNode.childNodes.length - 1]; // last node in text
    
      if (tempNode ) {
        while (tempNode.childNodes.length !== 0) {
            tempNode = tempNode.childNodes[tempNode.childNodes.length - 1];
        }
        return tempNode;
    }
  }
  
  private placeCaret() { // find the last node in the text and place caret symbol there
    const textArea = document.getElementById('textareaDiv');
    const lastNode = this.getLastNode(textArea);
    if (lastNode) {
        if (lastNode.nodeValue) {
          this._placeCaret(lastNode, lastNode.nodeValue.length);
        } else {
	        this._placeCaret(lastNode, 0);
        }
    } else {
      this._placeCaret(textArea, 0);
    }
  }
  
  
  private inseartText(text: Text) {
    const textArea = document.getElementById('textareaDiv');
    if (text) {
      textArea.innerHTML = text.value; // set new text in the div
      this.placeCaret();
      this.text = text;
    } else {
	    textArea.innerHTML = '<p>Start typing here</p>'; // set new text in the div
	    this.placeCaret();
    }
  }
  
  styleSelection($event) {
    document.execCommand($event.buttonName, true, $event.value);
    if (this.wasSelected) {
	    this.wasSelected = false;
    }
    this.saveText();
  }
  
  onPaste($event) {
    // prevent default paste event
    $event.preventDefault();
    // get text representation of clipboard
    const text = $event.clipboardData.getData('text/plain');
    // insert text manually
    document.execCommand('insertHTML', false, text);
  }

}
