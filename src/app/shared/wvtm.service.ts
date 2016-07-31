import {Injectable, Inject} from "@angular/core";
import { Subject }  from "rxjs/Subject";
import {LoggerService, EDITOR_MODES} from "./index";

interface ModelUpdateInfo {
  action: string,
  type: string,
  taskId: string
}
interface UserAction {
  type: string,
  action: string,
  data: any
}

@Injectable()
export class WVTMService {
  constructor(private logger: LoggerService) {
    this.logger.info("wvtm service started");
  }

  menuAction(action) {
    console.log(action);
  }

  toolAction(action) {
    console.log(action);
  }

}