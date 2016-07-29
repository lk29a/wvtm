import {Component} from "@angular/core";
import {TaskType, TaskRelation} from "../taskmodel/task";
import {EditorService} from "../editor/shared/editor.service";
import {LoggerService} from "../shared";

@Component({
  selector: "wvtm-toolbar",
  templateUrl: "./toolbar/toolbar.html",
  styleUrls: ["./toolbar/toolbar.css"],
  host: {
    "(click)": "onClick($event)"
  }
})
export class ToolbarComponent {
  taskTypes = Object.keys(TaskType);
  relations = Object.keys(TaskRelation);
  taskRelations = null;

  constructor(private editorService: EditorService, private logger: LoggerService) {
    this.taskRelations = TaskRelation;
  }

  onClick(event) {
    let elm = event.target;
    if (elm.classList.contains("toolbar-btn") || elm.parentNode.classList.contains("toolbar-btn")) {
      let action: string = elm.getAttribute("action") || elm.parentNode.getAttribute("action");
      let type: string = elm.getAttribute(action) || elm.parentNode.getAttribute(action);
      if (action.toLowerCase() === "task") {
        this.editorService.addTask(type);
      }
      if (action.toLowerCase() === "relation") {
        this.editorService.updateTask("relation", type);
      }
    }

  }
};