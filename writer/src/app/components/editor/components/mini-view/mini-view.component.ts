import {Component, Input, OnInit} from '@angular/core';
import {EditorService} from "../../editor.service";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'app-mini-view',
  templateUrl: './mini-view.component.html',
  styleUrls: ['./mini-view.component.scss']
})
export class MiniViewComponent implements OnInit {
  subscriptionToTextChange: Subscription;
  constructor(private editorService: EditorService) { }
  
  @Input() text: string;
  @Input() scrollingPos: number;

  ngOnInit() {
    this.subscriptionToTextChange = this.editorService.currentTextChange.subscribe(innerHTML => {
      const view = document.getElementById('mini-view');
      view.innerHTML = innerHTML;
    });
  
  }

}
