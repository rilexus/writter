import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditorService} from "../../editor.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

  subscriptionToWordCount: Subscription;
  subscriptionToParagraphCount: Subscription;
  wordCount = 0;
  paragraphCount = 0;
  
  constructor(private editorService: EditorService) { }

  ngOnDestroy() {
    this.subscriptionToParagraphCount.unsubscribe();
    this.subscriptionToWordCount.unsubscribe();
  }
  
  ngOnInit() {
    this.subscriptionToWordCount = this.editorService.wordCountChange.subscribe( count => {
      this.wordCount = count;
    });
    this.subscriptionToParagraphCount = this.editorService.paragraphCountChange.subscribe( count => {
      this.paragraphCount = count;
    });
  }

}
