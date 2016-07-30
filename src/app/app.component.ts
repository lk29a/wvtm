import {Component} from "@angular/core";

import {MenuComponent} from "./menu/menu.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {EditorComponent} from "./editor/editor.component";
import {InfobarComponent} from "./infobar/infobar.component";
import { LoggerService } from "./shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm",
  moduleId: __moduleName || module.id,
  templateUrl: "app.html",
  styleUrls: ["app.css"],
  // providers: [],
  directives: [MenuComponent, ToolbarComponent, EditorComponent, InfobarComponent],
})

export class WVTMComponent {
  constructor(private logger: LoggerService) {
    this.logger.log("... WVTM STARTED ...");
  }
};