import {Component} from "@angular/core";
import {EditorService} from "../editor/shared/editor.service";
import {LoggerService} from "../shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm-menu",
  moduleId: __moduleName || module.id,
  templateUrl: "./menu.html",
  styleUrls: ["./menu.css"],
})
export class MenuComponent {
  constructor(private editorService: EditorService, private logger: LoggerService) {
  }

  newProject() {
    this.editorService.createNew();
  }

  saveProject() {

  }

  validate() {
    this.editorService.validateModel();
  }

  simulate() {
    this.editorService.startSimulation();
  }

  zoom(action: string) {
    this.logger.debug("zoom - " + action);
  }

};