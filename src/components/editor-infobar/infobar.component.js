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
// import {TaskType, TaskRelation} from '../../lib/taskmodel/taskmodel'
var editor_service_1 = require('../editor/editor.service');
var EditorInfobar = (function () {
    function EditorInfobar(editorService) {
        this.editorService = editorService;
        this.currentTask = {
            data: {}
        };
        this.infoModel = {};
        this.taskTypes = editorService.getTaskTypes();
        this.taskRelations = editorService.getTaskRelations();
        this.relations = Object.keys(this.taskRelations);
    }
    EditorInfobar.prototype.getRelationSym = function (relation) {
        return this.taskRelations[relation];
    };
    EditorInfobar = __decorate([
        core_1.Component({
            selector: 'editor-infobar',
            templateUrl: 'src/components/editor-infobar/infobar.html',
            styleUrls: ['src/components/editor-infobar/infobar.css'],
        }), 
        __metadata('design:paramtypes', [editor_service_1.EditorService])
    ], EditorInfobar);
    return EditorInfobar;
}());
exports.EditorInfobar = EditorInfobar;
;
//# sourceMappingURL=infobar.component.js.map