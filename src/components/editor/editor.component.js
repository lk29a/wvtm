"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var menu_component_1 = require("../editor-menu/menu.component");
var toolbar_component_1 = require("../editor-toolbar/toolbar.component");
var canvas_component_1 = require("../editor-canvas/canvas.component");
var infobar_component_1 = require("../editor-infobar/infobar.component");
var editor_service_1 = require('./editor.service');
var renderer_service_1 = require('../renderer/renderer.service');
var treelayout_1 = require('../renderer/treelayout');
var logger_service_1 = require('../common/logger.service');
var WVTMEditor = (function () {
    function WVTMEditor(editorService, loggerService) {
        this.taskModel = null;
        this.taskModel = editorService.getTaskModel();
    }
    WVTMEditor = __decorate([
        core_1.Component({
            selector: 'wvtm-editor',
            templateUrl: 'src/components/editor/editor.html',
            styleUrls: ['src/components/editor/editor.css'],
            providers: [editor_service_1.EditorService, renderer_service_1.Renderer, treelayout_1.TreeLayout],
            directives: [menu_component_1.EditorMenu, toolbar_component_1.EditorToolbar, canvas_component_1.EditorCanvas, infobar_component_1.EditorInfobar],
        }), 
        __metadata('design:paramtypes', [editor_service_1.EditorService, logger_service_1.LoggerService])
    ], WVTMEditor);
    return WVTMEditor;
}());
exports.WVTMEditor = WVTMEditor;
;
//# sourceMappingURL=editor.component.js.map