import {Component} from "@angular/core";
import {LoggerService, WVTMService} from "../shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm-menu",
  moduleId: __moduleName || module.id,
  templateUrl: "menu.html",
  styleUrls: ["menu.css"],
})
export class MenuComponent {
  constructor(private wvtmService: WVTMService, private logger: LoggerService) {
    this.logger.info("Menu initialised");
  }

  newProject() {
    this.logger.debug("Menu click - New Project" );
    this.wvtmService.menuAction("new");
  }

  saveProject() {
    this.logger.debug("Menu click - Save Project" );
    this.wvtmService.menuAction("save");
  }

  validate() {
    this.logger.debug("Menu click - Validate" );
    this.wvtmService.menuAction("validate");
  }

  simulate() {
    this.logger.debug("Menu click - Simulate" );
    this.wvtmService.menuAction("simulate");
  }

  zoom(action: string) {
    this.logger.debug("Menu click - Zoom " + action );
    this.wvtmService.menuAction("zoom" + action);
  }

};