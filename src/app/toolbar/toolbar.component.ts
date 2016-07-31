import {Component} from "@angular/core";
import {
  LoggerService,
  WVTMService,
  TaskType,
  TaskRelation
} from "../shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm-toolbar",
  moduleId: __moduleName || module.id,
  templateUrl: "toolbar.html",
  styleUrls: ["toolbar.css"],
  host: {
    "(click)": "onClick($event)"
  }
})
export class ToolbarComponent {
  taskTypes = Object.keys(TaskType);
  relations = Object.keys(TaskRelation);
  taskRelations = null;

  constructor(private wvtm: WVTMService, private logger: LoggerService) {
    this.taskRelations = TaskRelation;
  }


  addTask(type: string) {
    this.wvtm.toolAction(type);
  }

  addRelation(type: string) {
    this.wvtm.toolAction(type);
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