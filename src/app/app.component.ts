import {Component} from "@angular/core";
import {NgRedux } from "ng2-redux";
import { IWVTMState, rootReducer, middlewares } from "./store";
import { LoggerService } from "./shared";

@Component({
  selector: "app-root",
  // moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
})

export class AppComponent {
  constructor(private ngRedux: NgRedux<IWVTMState>,
    private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");

    this.ngRedux.configureStore(rootReducer, {}, middlewares);
  }
}
