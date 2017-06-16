import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {NgRedux, select} from '@angular-redux/store';
import {LoggerService, EDITOR_MODES} from '../shared';
import {IWVTMState} from '../store';
import {EditorActions} from '../editor';


@Component({
  selector: 'wvtm-menu',
  // moduleId: module.id,
  templateUrl: 'menu.html',
  styleUrls: ['menu.css'],
})
export class MenuComponent implements OnInit {

  @select(['editorState', 'mode']) editorMode: Observable<EDITOR_MODES>;

  isSimulationMode = false;

  constructor(private logger: LoggerService,
              private redux: NgRedux<IWVTMState>,
              private editorActions: EditorActions) {
  }


  ngOnInit() {
    this.redux.select(['editorState', 'mode'])
      .subscribe(mode => {
        this.isSimulationMode = mode === EDITOR_MODES.SIMULATION;
      });
  }

  newProject() {
    this.logger.debug('Menu click - New Project');
    // this.wvtmService.menuAction("new");
  }

  saveProject() {
    this.logger.debug('Menu click - Save Project');
    // this.wvtmService.menuAction("save");
  }

  validate() {
    this.logger.debug('Menu click - Validate');
    // this.wvtmService.menuAction("validate");
  }

  simulate() {
    if (this.isSimulationMode) {
      this.editorActions.simulateModel('stop');
    } else {
      this.editorActions.simulateModel('start');
    }
  }

  zoom(action: string) {
    this.logger.debug('Menu click - Zoom ' + action);
    // this.wvtmService.menuAction("zoom" + action);
  }
}
