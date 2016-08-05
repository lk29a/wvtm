import {Component} from "@angular/core";

import {MenuComponent} from "./menu/index";
import {ToolbarComponent} from "./toolbar/index";
import {EditorComponent} from "./editor/index";
import {InfobarComponent} from "./infobar/index";
import { LoggerService } from "./shared/index";

@Component({
  selector: "app-root",
  moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  // providers: [],
  directives: [MenuComponent, ToolbarComponent, InfobarComponent, EditorComponent],
})

export class AppComponent {
  constructor(private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");
  }
}
