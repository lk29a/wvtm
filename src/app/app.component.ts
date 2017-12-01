import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { LoggerService } from './shared';
import { EditorActions } from './editor';
import {TaskModelActions} from "./taskmodel/taskmodel.actions";

@Component({
  selector: 'wvtm-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private logger: LoggerService,
              private actions: TaskModelActions) {
    this.logger.info('...WVTM STARTED...');
  }

  ngOnInit() {
    // this.actions.startNew();
  }
}
