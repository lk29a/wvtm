import {Component} from '@angular/core';
// import {TaskType, TaskRelation} from '../../lib/taskmodel/taskmodel'
import {EditorService} from '../editor/editor.service'

enum InfoTypes {
  Task = 1,
  Validation,
  Simulation
}

@Component({
	selector: 'editor-infobar',
	templateUrl: 'src/components/editor-infobar/infobar.html',
	styleUrls: ['src/components/editor-infobar/infobar.css'],
})
export class EditorInfobar {
	currentTask = {
    data: {}
  };
  infoType: InfoTypes;
  infoModel = {};
  taskTypes;
  taskRelations;
  relations;
  _types;

  constructor(private editorService: EditorService) {
    this.taskTypes = editorService.getTaskTypes();
    this.taskRelations = editorService.getTaskRelations();
    this.relations = Object.keys(this.taskRelations);

    this._types = InfoTypes;
    this.editorService.userAction$.subscribe(
      userAction => {
        let reset = false;
        switch (userAction.type) {
          case "task":
            if (userAction.action == 'select')
              this.showTaskInfo(userAction.data.taskId);
            else
              reset = true;
            break;

          case "simulation":
            if (userAction.action == 'start')
              this.showTaskInfo(userAction.data.taskId);
            else
              reset = true;
            break;

          case "validation":
            if (userAction.action == 'start')
              this.showTaskInfo(userAction.data.taskId);
            else
              reset = true;
            break;
          
          default:
            reset = true;
            break;
        }

        if(reset) {
          this.resetInfoBar();
        }
      } 
    );
  }

  showTaskInfo(taskId) {
    this.infoType = InfoTypes.Task;
    this.currentTask.data = this.editorService.getTaskData(taskId);

  }

  resetInfoBar() {

  }

  showSimulationInfo() {
    this.infoType = InfoTypes.Simulation;
  }

  showValidationInfo() {
    this.infoType = InfoTypes.Validation;
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

};