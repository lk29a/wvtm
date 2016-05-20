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
var taskmodel_1 = require('../../lib/taskmodel/taskmodel');
var Simulator = (function () {
    function Simulator() {
    }
    Simulator.prototype.start = function (model) {
        this.ets = [];
        this.tasksExecuted = [];
        // first validate structure of the model
        if (!model.validateStructure()) {
            throw new Error('Model has errors please fix them first.');
        }
        var lpath = [], node = model.root;
        //push leftmost path to a stack
        lpath.push(node);
        while (node.children.length) {
            node = node.children[0];
            lpath.push(node);
        }
    };
    /**
     * Checks for the relation with its right sibling(if any).
     * Depending on the relation returns right sibling or null.
     *
     * @param  {[type]} aTask [description]
     */
    Simulator.prototype.checkRelation = function (aTask) {
        //can add more relations to check here
        if (aTask.relation === taskmodel_1.TaskRelation.UNRESTRICTED ||
            aTask.relation === taskmodel_1.TaskRelation.CHOICE ||
            aTask.relation === taskmodel_1.TaskRelation.RANDOM) {
            return aTask.getRightSibling();
        }
        return null;
    };
    Simulator = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Simulator);
    return Simulator;
}());
exports.Simulator = Simulator;
//# sourceMappingURL=simulator.js.map