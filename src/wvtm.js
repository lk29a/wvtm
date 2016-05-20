"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var logger_service_1 = require('./components/common/logger.service');
// import {Constants} from './components/common/constants;
var editor_component_1 = require('./components/editor/editor.component');
platform_browser_dynamic_1.bootstrap(editor_component_1.WVTMEditor, [logger_service_1.LoggerService]);
//# sourceMappingURL=wvtm.js.map