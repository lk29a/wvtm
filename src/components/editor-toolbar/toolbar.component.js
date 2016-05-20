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
var core_1 = require('@angular/core');
var editor_service_1 = require('../editor/editor.service');
var taskmodel_1 = require('../../lib/taskmodel/taskmodel');
var logger_service_1 = require('../common/logger.service');
var EditorToolbar = (function () {
    function EditorToolbar(editorService, logger) {
        this.editorService = editorService;
        this.logger = logger;
        this.taskTypes = Object.keys(taskmodel_1.TaskType);
        this.relations = Object.keys(taskmodel_1.TaskRelation);
        this.taskRelations = null;
        this.taskRelations = taskmodel_1.TaskRelation;
    }
    EditorToolbar.prototype.onClick = function (event) {
        var elm = event.target;
        if (elm.classList.contains('toolbar-btn') || elm.parentNode.classList.contains('toolbar-btn')) {
            var action = elm.getAttribute('action') || elm.parentNode.getAttribute('action');
            var type = elm.getAttribute(action) || elm.parentNode.getAttribute(action);
            if (action.toLowerCase() == 'task') {
                this.editorService.addTask(type);
            }
            if (action.toLowerCase() == 'relation') {
                this.editorService.addUpdateTaskRelation(type);
            }
        }
    };
    EditorToolbar = __decorate([
        core_1.Component({
            selector: 'editor-toolbar',
            templateUrl: 'src/components/editor-toolbar/toolbar.html',
            styleUrls: ['src/components/editor-toolbar/toolbar.css'],
            host: {
                '(click)': 'onClick($event)'
            }
        }), 
        __metadata('design:paramtypes', [editor_service_1.EditorService, logger_service_1.LoggerService])
    ], EditorToolbar);
    return EditorToolbar;
}());
exports.EditorToolbar = EditorToolbar;
;
//# sourceMappingURL=toolbar.component.js.map