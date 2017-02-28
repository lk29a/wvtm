import {Component} from "@angular/core";
import { LoggerService } from "./shared";

@Component({
  selector: "wvtm-root",
  // moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
})
export class AppComponent {
  constructor(private logger: LoggerService) {
    this.logger.info("...WVTM STARTED...");
  }
}
