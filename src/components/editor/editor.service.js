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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var taskmodel_1 = require('../../lib/taskmodel/taskmodel');
var constants_1 = require('../common/constants');
var logger_service_1 = require('../common/logger.service');
var EditorService = (function () {
    function EditorService(logger) {
        this.logger = logger;
        this.modelUpdatedSource = new Subject_1.Subject();
        this.taskSelectedSource = new Subject_1.Subject();
        this.userActionSource = new Subject_1.Subject();
        this.modelUpdated$ = this.modelUpdatedSource.asObservable();
        this.taskSelected$ = this.taskSelectedSource.asObservable();
        this.userAction$ = this.userActionSource.asObservable();
        // this.createNew();
    }
    EditorService.prototype.createNew = function () {
        this.taskModel = new taskmodel_1.TaskModel();
        this.selectedTaskId = this.taskModel.root.data.id;
        this.editorMode = constants_1.EDITOR_MODES.DRAWING;
    };
    EditorService.prototype.getEditorMode = function () {
        return this.editorMode;
    };
    EditorService.prototype.setEditorMode = function (mode) {
        this.editorMode = mode;
    };
    EditorService.prototype.getTaskModel = function () {
        return this.taskModel;
    };
    EditorService.prototype.selectTask = function (taskId) {
        this.selectedTaskId = taskId;
    };
    EditorService.prototype.validateModel = function () {
        this.validataionInfo = this.taskModel.validateStructure();
        console.log(this.validataionInfo);
    };
    EditorService.prototype.simulateModel = function () {
        if (this.editorMode === constants_1.EDITOR_MODES.DRAWING) {
            this.userActionSource.next('simulation:start');
            this.editorMode = constants_1.EDITOR_MODES.SIMULATION;
        }
        else {
            this.editorMode = constants_1.EDITOR_MODES.DRAWING;
        }
    };
    EditorService.prototype.addUpdateTaskRelation = function (relation) {
        if (!this.selectedTaskId) {
            this.logger.error('Cannot add/update relation, select a task first');
            return;
        }
        this.taskModel.addUpdateRelation(this.selectedTaskId, relation);
        var updateInfo = {
            action: 'update',
            type: 'relation',
            taskId: this.selectedTaskId
        };
        this.modelUpdatedSource.next(updateInfo);
    };
    EditorService.prototype.addTask = function (type) {
        if (!this.selectedTaskId) {
            this.logger.error('Cannot add new task, select a task first');
            return;
        }
        var newTaskId = this.taskModel.addTask({ parentTaskId: this.selectedTaskId, taskType: type });
        this.logger.debug(this.taskModel);
        var updateInfo = {
            action: 'add',
            type: 'task',
            taskId: newTaskId
        };
        this.modelUpdatedSource.next(updateInfo);
    };
    EditorService.prototype.getTaskTypes = function () {
        return Object.keys(taskmodel_1.TaskType);
    };
    EditorService.prototype.getTaskRelations = function () {
        return taskmodel_1.TaskRelation;
    };
    EditorService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(logger_service_1.LoggerService)), 
        __metadata('design:paramtypes', [logger_service_1.LoggerService])
    ], EditorService);
    return EditorService;
}());
exports.EditorService = EditorService;
//# sourceMappingURL=editor.service.js.map