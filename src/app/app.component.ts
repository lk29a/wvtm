import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { LoggerService } from './shared';
import { EditorActions } from './editor';

@Component({
  selector: 'wvtm-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private logger: LoggerService,
              private actions: EditorActions) {
    this.logger.info('...WVTM STARTED...');
  }

  ngOnInit() {
    this.actions.startNew();
  }
}
