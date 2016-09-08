import {Component} from "@angular/core";
import {LoggerService} from "../shared";
import {EditorActions} from "../editor";
@Component({
  selector: "wvtm-menu",
  // moduleId: module.id,
  templateUrl: "menu.html",
  styleUrls: ["menu.css"],
})
export class MenuComponent {

  constructor(private logger: LoggerService,
    private editorActions: EditorActions) {
    this.logger.debug("Menu initialised");
  }

  newProject() {
    this.logger.debug("Menu click - New Project" );
    // this.wvtmService.menuAction("new");
  }

  saveProject() {
    this.logger.debug("Menu click - Save Project" );
    // this.wvtmService.menuAction("save");
  }

  validate() {
    this.logger.debug("Menu click - Validate" );
    // this.wvtmService.menuAction("validate");
  }

  simulate() {
    this.logger.debug("Menu click - Simulate" );
    this.editorActions.startSimulation();
    // this.wvtmService.menuAction("simulate");
  }

  zoom(action: string) {
    this.logger.debug("Menu click - Zoom " + action );
    // this.wvtmService.menuAction("zoom" + action);
  }

};
