import {Component} from "@angular/core";
import {NgRedux } from "ng2-redux";
import { IWVTMState, rootReducer } from "./store";
import {MenuComponent} from "./menu";
import {ToolbarComponent} from "./toolbar";
import {EditorComponent} from "./editor";
import {InfobarComponent} from "./infobar";
import { LoggerService, WVTMService } from "./shared";
import { TaskModel } from "./taskmodel";

@Component({
  selector: "app-root",
  moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
  providers: [WVTMService, TaskModel],
  directives: [MenuComponent, ToolbarComponent, InfobarComponent, EditorComponent],
})

export class AppComponent {
  constructor(private ngRedux: NgRedux<IWVTMState>,
    private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");

    this.ngRedux.configureStore(rootReducer, {});
  }
}
