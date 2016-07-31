import {Component} from "@angular/core";

import {MenuComponent} from "./menu/index";
import {ToolbarComponent} from "./toolbar/index";
import {EditorComponent} from "./editor/index";
import {InfobarComponent} from "./infobar/index";
import { LoggerService } from "./shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm",
  moduleId: __moduleName || module.id,
  templateUrl: "app.html",
  styleUrls: ["app.css"],
  // providers: [],
  directives: [MenuComponent, ToolbarComponent, InfobarComponent, EditorComponent],
})

export class WVTMComponent {
  constructor(private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");
  }
};