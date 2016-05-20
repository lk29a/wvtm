"use strict";
var taskmodel_1 = require('./taskmodel');
var TaskModelSimulator = (function () {
    function TaskModelSimulator() {
    }
    /**
     * Will simulate the given model
     * setup for simulator
     * 1. Validate model structure
     * 2. Remove event handlers (hover, click and others if exists)
     * 3. ...
     *
     * @param  {[type]} taskModel [description]
     * @return {[type]}           [description]
     */
    TaskModelSimulator.prototype.start = function (taskModel) {
        //reset prev
        this.ets.length = 0;
        this.ets = [];
        // first validate structure of the model
        // var valid = taskModel.validateStructure();
        // if(!valid) {
        //  console.log('Model has errors please fix them first.');
        //  return;
        // }
        // start with the root
        this.enableTask(taskModel.root);
        for (var i = 0; i < this.ets.length; i++) {
            console.log(this.ets[i].data);
        }
        return this.ets;
    };
    /**
     * Enabling a task requires:
     * 1. Directly enable if its leaf else,
     * 2. Check entire subtree rooted at current task then,
     * 3. Check relationship with right sibling, enable right sibling if required
     *
     * @param  {[type]} aTask [description]
     */
    TaskModelSimulator.prototype.enableTask = function (aTask) {
        console.log('enabling: ' + aTask.data.name);
        var curTask = aTask, lPath = [];
        //find left most decendent of this task
        lPath.push(curTask);
        while (curTask.children.length) {
            curTask = curTask.children[0];
            lPath.push(curTask);
        }
        while (lPath.length > 0) {
            curTask = lPath.pop();
            if (curTask.isLeaf()) {
                this.ets.push(curTask);
            }
            //if relation is non blocking
            if (this.checkRelation(curTask)) {
                this.enableTask(curTask.getRightSibling());
            }
            curTask = curTask.parent;
        }
    };
    /**
     * Checks for the relation with its right sibling(if any).
     * Depending on the relation returns right sibling or null.
     *
     * @param  {[type]} aTask [description]
     */
    TaskModelSimulator.prototype.checkRelation = function (aTask) {
        //can add more relations to check here
        if (aTask.data.relation === taskmodel_1.TaskRelation.UNRESTRICTED ||
            aTask.data.relation === taskmodel_1.TaskRelation.CHOICE ||
            aTask.data.relation === taskmodel_1.TaskRelation.RANDOM ||
            aTask.data.relation === taskmodel_1.TaskRelation.CONCURRENTINFO) {
            return true;
        }
        return false;
    };
    /**
     * We need to check both right and left sibling for relations.
     * next/prev task wil be enabled or disabled based on these relations
     * Eg. if left sibling had choice relation then left sibling(it must be enabled) should be disabled.
     *
     * //@lk IF ALL CHILD TASKS ARE PERFORMED THEN PARENT TASK IS PERFORMED AS WELL??//
     * @param  {[type]} aTask [description]
     * @param  {[type]} silent ??
     * @return {[type]} [description]
     */
    TaskModelSimulator.prototype.executeTask = function (aTask, silent) {
        silent = silent || false;
        var idx = this.ets.indexOf(aTask);
        if (idx < 0) {
            console.log('Task not enabled');
            return;
        }
        else {
            //remove task from enabled set
            this.ets.splice(idx, 1);
            // if (!silent) {
            //check if left task also needs to be performed in case of choice, unrestricted, etc
            // var lSibling = aTask.getLeftSibling();
            // if (lSibling && checkRelation(lSibling)) {
            //   executeTask(lSibling);
            // }
            var rSibling = aTask.getRightSibling();
            if (rSibling) {
                //some *relation* with right sibling
                var action = this.simulateRelation(aTask, rSibling);
                switch (action) {
                    case 'enable':
                        this.enableTask(rSibling);
                        break;
                    case 'perform':
                        this.executeTask(rSibling);
                        break;
                }
            }
            //check if parent is still active else execute parent task
            if (!this.isTaskActive(aTask.parent)) {
                this.ets.push(aTask.parent);
                this.executeTask(aTask.parent);
            }
        }
        console.log(this.ets);
        return this.ets;
    };
    /**
     * returns true if any task including aTask is enabled in the subtree rooted at aTask
     *
     * @param  {[type]}  aTask [description]
     * @return {Boolean}       [description]
     */
    TaskModelSimulator.prototype.isTaskActive = function (aTask) {
        var enabled = false;
        //a task is enabled is any of its children is enabled
        enabled = (function isTaskEnabled(parent) {
            if (this.ets.indexOf(parent) > -1) {
                return true;
            }
            else {
                var tmp = false;
                for (var i = 0; i < parent.children.length; i++) {
                    tmp = isTaskEnabled(parent.children[i]);
                    if (tmp === true) {
                        return tmp;
                    }
                }
                return tmp;
            }
        })(aTask);
        return enabled;
    };
    /**
     * [performRelation description]
     * @param  {[type]} realtion [description]
     * @return {[type]}          [description]
     */
    TaskModelSimulator.prototype.simulateRelation = function (task, rSibling) {
        var relations = {
            //Independent Concurrency
            '|||': function () {
                return 'noop';
            },
            //choice
            '[]': function () {
                return 'execute';
            },
            //Concurrency with information exchange
            '|[]|': function () {
                return true;
            },
            //Order Independence
            '|=|': function () {
                return true;
            },
            //Deactivating
            '[>': function () {
                return true;
            },
            //Enabling
            '>>': function () {
                return 'enable';
            },
            /**
             * Enabling with information passing
             * Will pass provided data to right sibling
             *
             * @return {[type]} [description]
             */
            '[]>>': function () {
                return 'enable';
            },
            //Suspend - resume
            '|>': function () {
                return true;
            },
        };
        return relations[task.data.relation]();
    };
    return TaskModelSimulator;
}());
exports.TaskModelSimulator = TaskModelSimulator;
//# sourceMappingURL=simulator.js.map