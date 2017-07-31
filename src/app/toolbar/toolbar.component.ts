import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {
  LoggerService,
  TaskType,
  TaskRelation
} from '../shared';
import {IWVTMState} from '../store';
import {TaskModelActions} from '../taskmodel';

@Component({
  selector: 'wvtm-toolbar',
  // moduleId: module.id,
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  taskTypes = Object.keys(TaskType);
  relations = Object.keys(TaskRelation);
  taskRelations = null;
  rxSubs: any = {};
  types = null;

  constructor(private tmActions: TaskModelActions,
              private logger: LoggerService,
              private redux: NgRedux<IWVTMState>) {

    this.logger.debug('Toolbar initialized');
    this.taskRelations = TaskRelation;
    this.types = TaskType
  }

  ngOnInit() {
    this.rxSubs.library = this.redux.select((state) => {
      return state.taskModel.modules;
    }).subscribe((data) => {
      // console.log(data);
    });
  }

  addTask(type: string) {
    this.tmActions.addTask(type);
  }

  addRelation(rel: string) {
    this.tmActions.updateTask('relation', rel);
    // this.wvtm.toolAction(type);
  }

  // onClick(event) {
  //   let elm = event.target;
  //   if (elm.classList.contains("toolbar-btn") || elm.parentNode.classList.contains("toolbar-btn")) {
  //     let action: string = elm.getAttribute("action") || elm.parentNode.getAttribute("action");
  //     let type: string = elm.getAttribute(action) || elm.parentNode.getAttribute(action);
  //     if (action.toLowerCase() === "task") {
  //       this.editorService.addTask(type);
  //     }
  //     if (action.toLowerCase() === "relation") {
  //       this.editorService.updateTask("relation", type);
  //     }
  //   }
  // }

  ngOnDestroy() {
    for (const key in this.rxSubs) {
      if (this.rxSubs.hasOwnProperty(key)) {
        // console.log(key);
        this.rxSubs[key].unsubscribe();
      }
    }
  }

}

