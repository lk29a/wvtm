"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tree_node_1 = require('../generic-tree/tree-node');
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(data) {
        _super.call(this);
        this.data = data;
    }
    Task.prototype.addRelation = function (rel) {
        if (rel && this.parent && (this.parent.getLastChild() !== this)) {
            this.data.relation = rel;
        }
        else {
            throw new Error('Cannot add/edit relation no right sibling');
        }
    };
    Task.prototype.editData = function (data) {
        // this.data = angular.extend({}, this.data, data);
    };
    ;
    return Task;
}(tree_node_1.TreeNode));
exports.Task = Task;
//# sourceMappingURL=task.js.map