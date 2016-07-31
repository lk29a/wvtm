import {bootstrap} from "@angular/platform-browser-dynamic";
import {LoggerService, WVTMService} from "./app/shared/index";
// import {Constants} from './components/common/constants;
import {WVTMComponent} from "./app/app.component";

bootstrap(WVTMComponent, [LoggerService, WVTMService]);
