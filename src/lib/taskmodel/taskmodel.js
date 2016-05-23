"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var task_1 = require('./task');
var generic_tree_1 = require('../generic-tree/generic-tree');
exports.TaskType = {
    Abstract: 0,
    User: 1,
    Interaction: 2,
    System: 3,
};
exports.TaskRelation = {
    'UNRESTRICTED': '|||',
    'CHOICE': '[]',
    'CONCURRENTINFO': '|[]|',
    'RANDOM': '|=|',
    'DEACT': '[>',
    'ENABLE': '>>',
    'CHOICEINFO': '[]>>',
    'RESUME': '|>',
    'ITERATION': 'T*',
    'OPTIONAL': '[T]',
};
var TaskModel = (function (_super) {
    __extends(TaskModel, _super);
    function TaskModel() {
        var data = {
            type: exports.TaskType.Abstract,
            name: 'Default',
            id: 'TASK_0',
            relation: null,
            description: 'Default abstract node'
        };
        var tmp = new task_1.Task(data);
        _super.call(this, tmp);
        this.root = tmp;
        this.taskCounter = 1;
    }
    TaskModel.prototype.addTask = function (options) {
        if (!options.parentTaskId) {
            throw new Error('`parentId` must be provided');
        }
        if (!options.taskType) {
            throw new Error('`type` of task must be provided');
        }
        var parentNode = this.searchNode(options.parentTaskId);
        var newTaskId = 'TASK_' + (this.taskCounter++); //@lk comeup with some naming convention
        var data = {
            type: parseInt(exports.TaskType[options.taskType]) || exports.TaskType.Abstract,
            name: (options.name) || (options.taskType + '_' + this.taskCounter),
            id: newTaskId,
            relation: options.relation || '',
            description: '',
        };
        this.addNode(parentNode, new task_1.Task(data));
        return newTaskId;
    };
    TaskModel.prototype.addUpdateRelation = function (taskId, relation) {
        if (!taskId) {
            throw new Error('`taskId` must be provided');
        }
        if (!exports.TaskRelation[relation.toUpperCase()]) {
            throw new Error('Please provide a valid relation');
        }
        if (taskId instanceof task_1.Task) {
            taskId.addRelation(exports.TaskRelation[relation.toUpperCase()]);
        }
        else {
            taskId = this.searchNode(taskId);
            taskId.addRelation(exports.TaskRelation[relation.toUpperCase()]);
        }
    };
    ;
    TaskModel.prototype.changeTaskType = function (taskId, taskType) {
        if (!taskId) {
            throw new Error('`taskId` must be provided');
        }
        if (!taskType) {
            throw new Error('`taskType` of task must be provided');
        }
        console.log(taskId, taskType);
        if (!(taskId instanceof task_1.Task)) {
            taskId = this.searchNode(taskId);
        }
        taskId.data.type = taskType;
    };
    ;
    /**
     * Check correctness of the model
     * 1. Abstract task should have atleast one child
     * 2. Every sibling pair should have a relation
     */
    TaskModel.prototype.validateStructure = function () {
        var validationObj = {
            messages: [],
            valid: true,
            warnCount: 0,
            errorCount: 0
        };
        function validateTask(task) {
            if (task.isLeaf() && (task.data.type === exports.TaskType.Abstract)) {
                // console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
                validationObj.messages.push('Warning: Task "' + task.data.name + '" is abstract type. Task should have subtasks.');
                validationObj.warnCount++;
            }
            if (!task.data.relation && (task.getRightSibling() !== null)) {
                // if(task.parent && (task.parent.getLastChild() !== task)) {
                validationObj.valid = false;
                // console.log('Error: "' + task.data.name + '" must have a relation with its right sibling.');
                validationObj.messages.push('Error: Task "' + task.data.name + '" must have a relation with its right sibling.');
                validationObj.errorCount++;
            }
        }
        this.traverseDF(validateTask);
        return validationObj;
    };
    ;
    return TaskModel;
}(generic_tree_1.GenericTree));
exports.TaskModel = TaskModel;
//# sourceMappingURL=taskmodel.js.map