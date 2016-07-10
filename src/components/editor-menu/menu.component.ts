import {Component} from "@angular/core";
import {EditorService} from "../editor/editor.service";
import {LoggerService} from "../common/logger.service";

@Component({
  selector: "editor-menu",
  templateUrl: "components/editor-menu/menu.html",
  styleUrls: ["components/editor-menu/menu.css"],
  host: {
    "(click)": "onClick($event)"
  }
})
export class EditorMenu {
  constructor(private editorService: EditorService, private logger: LoggerService) {
  }

  newProject() {

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

  onClick(event) {
    let elm = event.target;
    if (elm.classList.contains("menu-btn") || elm.parentNode.classList.contains("menu-btn")) {
      let action: string = elm.getAttribute("action") || elm.parentNode.getAttribute("action");

      switch (action) {
        case "new":
          this.newProject();
          break;
        case "save":
          this.saveProject();
          break;
        case "validate":
          this.validate();
          break;
        case "simulate":
          this.simulate();
          break;
        case "zoom-fit":
          this.zoom("fit");
          break;
        case "zoom-minus":
          this.zoom("minus");
          break;
        case "zoom-plus":
          this.zoom("plus");
          break;
      }
    }

  }

};