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
    function WVTMEditor(editorService, logger) {
        this.editorService = editorService;
        this.logger = logger;
        this.taskModel = null;
        this.editorService.createNew();
        this.taskModel = editorService.getTaskModel();
        this.createTestModel();
    }
    WVTMEditor.prototype.createTestModel = function () {
        this.taskModel.addTask({ parentTaskId: 'TASK_0', taskType: 'Abstract', name: 'Enable access', relation: '>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_0', taskType: 'Abstract', name: 'Access', relation: '[>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_0', taskType: 'INTERACTION', name: 'Close access' });
        // this.taskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});
        this.taskModel.addTask({ parentTaskId: 'TASK_1', taskType: 'INTERACTION', name: 'Insert card', relation: '>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_1', taskType: 'System', name: 'Require password', relation: '>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_1', taskType: 'INTERACTION', name: 'Insert Password' });
        this.taskModel.addTask({ parentTaskId: 'TASK_2', taskType: 'Abstract', name: 'Withdraw cash', relation: '[]' });
        this.taskModel.addTask({ parentTaskId: 'TASK_2', taskType: 'Abstract', name: 'Deposit cash', relation: '[]' });
        this.taskModel.addTask({ parentTaskId: 'TASK_2', taskType: 'Abstract', name: 'Get information' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'INTERACTION', name: 'Select withdraw', relation: '>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'System', name: 'Show possible amounts', relation: '[]>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'User', name: 'Decide amount', relation: '[]>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'INTERACTION', name: 'Select account', relation: '[]>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'System', name: 'Provide cash', relation: '[]>>' });
        this.taskModel.addTask({ parentTaskId: 'TASK_7', taskType: 'INTERACTION', name: 'Check cash' });
    };
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