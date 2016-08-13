import {Component} from "@angular/core";
import {
  LoggerService,
  TaskType,
  TaskRelation
} from "../shared";
import {TaskModelActions} from "../taskmodel"

@Component({
  selector: "wvtm-toolbar",
  moduleId: module.id,
  templateUrl: "toolbar.html",
  styleUrls: ["toolbar.css"]
})
export class ToolbarComponent {
  taskTypes = Object.keys(TaskType);
  relations = Object.keys(TaskRelation);
  taskRelations = null;

  constructor(private tmActions: TaskModelActions, private logger: LoggerService) {
    this.logger.debug("Toolbar initialized");
    this.taskRelations = TaskRelation;
  }


  addTask(type: string) {
    this.tmActions.addTask(type);
  }

  addRelation(type: string) {
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

};