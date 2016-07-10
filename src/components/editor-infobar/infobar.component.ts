import {Component} from "@angular/core";
import {EditorService} from "../editor/editor.service";

enum InfoTypes {
  None = 0,
  Task = 1,
  Validation = 2,
  Simulation = 3
}

@Component({
  selector: "editor-infobar",
  templateUrl: "components/editor-infobar/infobar.html",
  styleUrls: ["components/editor-infobar/infobar.css"],
})
export class EditorInfobar {
  currentTask: any;
  infobar: any;
  taskTypes;
  taskRelations;
  relations;
  types;
  infoType;

  constructor(private editorService: EditorService) {
    this.taskTypes = editorService.getTaskTypes();
    this.types = Object.keys(this.taskTypes);
    this.taskRelations = editorService.getTaskRelations();
    this.relations = Object.keys(this.taskRelations);
    this.infobar = {
      type: InfoTypes,
      title: "Information"
    };
    this.infoType = InfoTypes;
    this.editorService.userAction$.subscribe(
      userAction => {
        let reset = false;
        switch (userAction.type) {
          case "task":
            if (userAction.action === "select")
              this.showTaskInfo(userAction.data.taskId);
            else
              reset = true;
            break;

          case "simulation":
            if (userAction.action === "start")
              this.showSimulationInfo();
            else
              reset = true;
            break;

          case "validation":
            if (userAction.action === "start")
              this.showValidationInfo();
            else
              reset = true;
            break;

          default:
            reset = true;
            break;
        }

        if (reset) {
          this.resetInfoBar();
        }
      }
    );
  }

  showTaskInfo(taskId) {
    this.infobar.type = InfoTypes.Task;
    // this.currentTask.data = this.editorService.getTaskData(taskId);
    let task = this.editorService.getSelectedTask();

    this.currentTask = {
      id: task.id,
      type: task.type,
      relation: task.relation,
      name: task.name,
      description: task.description,
      isRoot: task.parent ? false : true,
      isLast: task.getRightSibling() ? false : true,
    };
    this.infobar.title = "Task: " + this.currentTask.name;
  }

  resetInfoBar() {
    this.infobar.type = null;
  }

  showSimulationInfo() {
    this.infobar.type = InfoTypes.Simulation;
  }

  showValidationInfo() {
    this.infobar.type = InfoTypes.Validation;
  }

  updateTask(type, value) {
    if (type && value) {
      if (this.editorService.updateTask(type, value, this.currentTask.id)) {
        this.currentTask[type] = value;
      }
    }
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

};