import {Component} from "@angular/core";

import {MenuComponent} from "./menu";
import {ToolbarComponent} from "./toolbar";
import {EditorComponent} from "./editor";
import {InfobarComponent} from "./infobar";
import { LoggerService, WVTMService } from "./shared";
import { TaskStore } from "./store";

@Component({
  selector: "app-root",
  moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  providers: [WVTMService, TaskStore],
  directives: [MenuComponent, ToolbarComponent, InfobarComponent, EditorComponent],
})

export class AppComponent {
  constructor(private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");
  }
}
