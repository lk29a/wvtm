import {bootstrap} from "@angular/platform-browser-dynamic";
import {LoggerService} from "./app/shared";
// import {Constants} from './components/common/constants;
import {WVTMComponent} from "./app/app.component";

bootstrap(WVTMComponent, [LoggerService]);
