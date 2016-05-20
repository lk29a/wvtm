import {bootstrap} from '@angular/platform-browser-dynamic';
import {LoggerService} from './components/common/logger.service';
// import {Constants} from './components/common/constants;
import {WVTMEditor} from './components/editor/editor.component';

bootstrap(WVTMEditor, [LoggerService]);
