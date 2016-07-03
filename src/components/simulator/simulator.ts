import {Injectable, Inject} from '@angular/core';
import { Task, TaskType, TaskRelation } from '../taskmodel/task';
import { TaskModel } from '../taskmodel/taskmodel';

@Injectable()
export class Simulator {
  ets: Array < Task > ;
  tasksExecuted: Array < Task > ;

  start(model: TaskModel) {
    this.ets = [];
    this.tasksExecuted = [];

    // first validate structure of the model
    if (!model.validateStructure()) {
      throw new Error('Model has errors please fix them first.');
    }

    this.enableTask(model.root);

    return this.ets;    

  }

  /**
  * Enabling a task requires:
  * 1. Directly enable if its leaf else,
  * 2. Check entire subtree rooted at current task then,
  * 3. Check relationship with right sibling, enable right sibling if required
  * 
  * @param  {[type]} aTask [description]
  */
  enableTask(aTask) {
    console.log('enabling: ' + aTask.name);
    var curTask = aTask,
      lPath = [];

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
  }


  /**
   * Checks for the relation with its right sibling(if any). 
   * Depending on the relation returns right sibling or null.
   * 
   * @param  {[type]} aTask [description]
   */
  checkRelation(aTask) {
    //can add more relations to check here
    if (
      aTask.relation === TaskRelation.UNRESTRICTED ||
      aTask.relation === TaskRelation.CHOICE ||
      aTask.relation === TaskRelation.RANDOM ||
      aTask.relation === TaskRelation.CONCURRENTINFO ||
      aTask.relation === TaskRelation.DEACT ||
      aTask.relation === TaskRelation.RESUME
    ) {
      return true;
    }

    return false;
  }  

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
  executeTask(aTask, silent?) {
    silent = silent || false;
    var idx = this.ets.indexOf(aTask);
    if (idx < 0) {
      console.log('Task not enabled');
      return;
    } else {
      //remove task from enabled set
      this.ets.splice(idx, 1);

      //check if parent has choice relation, if yes then disable those tasks
      var parent = aTask.parent;
//qilJaQyvGY;o4]3u|sa+T?J+6K-Yts/11D+||)z,sm9+N:fqj_b@!GI|g0$skq+:

      if(parent.relation === TaskRelation.CHOICE) {
        this.executeTask(parent);
      }


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
      // }
    }
    console.log(this.ets);
    return this.ets;
  }

  /**
   * returns true if any task including aTask is enabled in the subtree rooted at aTask
   * 
   * @param  {[type]}  aTask [description]
   * @return {Boolean}       [description]
   */
  isTaskActive(aTask) {
    var enabled = false;

    var _this = this;
    //a task is enabled is any of its children is enabled
    enabled = (function isTaskEnabled(parent) {
      if (_this.ets.indexOf(parent) > -1) {
        return true;
      } else {
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
  }

  /**
   * [performRelation description]
   * @param  {[type]} realtion [description]
   * @return {[type]}          [description]
   */
  simulateRelation(task, rSibling) {
    var relations = {
      //Independent Concurrency
      '|||': function() {
        return 'noop';
      },
      //choice
      '[]': function() {
        return 'execute';
      },
      //Concurrency with information exchange
      '|[]|': function() {
        return true;
      },
      //Order Independence
      '|=|': function() {
        return true;
      },
      //Deactivating
      '[>': function() {
        return true;
      },
      //Enabling
      '>>': function() {
        return 'enable';
      },
      /**
       * Enabling with information passing
       * Will pass provided data to right sibling
       * 
       * @return {[type]} [description]
       */
      '[]>>': function() {

        return 'enable';
      },
      //Suspend - resume
      '|>': function() {
        return true;
      },
    };

    return relations[task.relation]();
  }

}
