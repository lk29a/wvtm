import {Injectable} from '@angular/core';
import { List, Map } from 'immutable';
import { ITaskModel, ITask, TreeUtils} from '../taskmodel';
import { TaskRelation } from '../shared';

export class Simulator {

  ets = List<string>();
  tasksExecuted = List<string>();
  treeUtils: TreeUtils;


  constructor(private nodeList: Map<string, ITask>, private root: string) {
    this.treeUtils = new TreeUtils(nodeList, root);
  }

  start() {
    this.enableTask(this.root);
    console.log(this.ets.toJS());
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
  enableTask(task: string) {
    // console.log("enabling: " + aTask.name);

    let curTask = task;
    const leftmostPath = [];

    // find left most decendent of this task
    while (curTask) {
      leftmostPath.push(curTask);
      curTask = this.treeUtils.getFirstChild(curTask);
    }

    while (leftmostPath.length > 0) {
      curTask = leftmostPath.pop();
      if (this.treeUtils.isLeaf(curTask)) {
        this.ets = this.ets.push(curTask);
      }

      // if relation is non blocking
      if (this.checkRelation(curTask)) {
        this.enableTask(this.treeUtils.getRightSibling(curTask));
      }

      curTask = this.treeUtils.getParent(curTask);
    }
  }


  /**
   * Checks for the relation with its right sibling(if any).
   * Depending on the relation returns right sibling or null.
   *
   * @param task
   */
  checkRelation(task: string) {
    const relation = this.getTaskRelation(task);

    // can add more relations to check here
    return TaskRelation[relation] === TaskRelation.UNRESTRICTED ||
      TaskRelation[relation] === TaskRelation.CHOICE ||
      TaskRelation[relation] === TaskRelation.RANDOM ||
      TaskRelation[relation] === TaskRelation.CONCURRENTINFO ||
      TaskRelation[relation] === TaskRelation.DEACT ||
      TaskRelation[relation] === TaskRelation.RESUME;
  }

  getTaskRelation(task: string) {
    return this.nodeList.getIn([task, 'relation']);
  }

  /**
   * We need to check both right and left sibling for relations.
   * next/prev task wil be enabled or disabled based on these relations
   * Eg. if left sibling had choice relation then left sibling(it must be enabled) should be disabled.
   *
   * @param  {[type]} aTask [description]
   * @param  {[type]} silent ??
   * @return {[type]} [description]
   */
  executeTask(aTask, silent?) {
    silent = silent || false;
    debugger;

    const idx = this.ets.indexOf(aTask);
    if (idx < 0) {
      console.log('Task not enabled');
      return;
    } else {
      // remove task from enabled set
      this.ets = this.ets.delete(idx);

      // check if parent has choice relation, if yes then disable those tasks
      const parent = this.treeUtils.getParent(aTask);
      const parentRelation = this.getTaskRelation(parent);
      if (TaskRelation[parentRelation] === TaskRelation.CHOICE) {
        this.executeTask(parent);
      }
      // if (!silent) {
      // check if left task also needs to be performed in case of choice, unrestricted, etc
      // var lSibling = aTask.getLeftSibling();
      // if (lSibling && checkRelation(lSibling)) {
      //   executeTask(lSibling);
      // }

      const rSibling = aTask.getRightSibling();
      if (rSibling) {
        // some *relation* with right sibling
        const action = this.simulateRelation(aTask, rSibling);
        switch (action) {
          case 'enable':
            this.enableTask(rSibling);
            break;

          case 'perform':
            this.executeTask(rSibling);
            break;
        }
      }

      // check if parent is still active else execute parent task
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
    let enabled = false;

    const _this = this;
    // a task is enabled is any of its children is enabled
    enabled = (function isTaskEnabled(parent) {
      if (_this.ets.indexOf(parent) > -1) {
        return true;
      } else {
        let tmp = false;
        for (let i = 0; i < parent.children.length; i++) {
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
   * @param task
   * @param rSibling
   *
   * @return {[type]}          [description]
   */
  simulateRelation(task, rSibling) {
    const relations = {
      // Independent Concurrency
      '|||': function() {
        return 'noop';
      },
      // Choice
      '[]': function() {
        return 'execute';
      },
      // Concurrency with information exchange
      '|[]|': function() {
        return true;
      },
      // Order Independence
      '|=|': function() {
        return true;
      },
      // Deactivating
      '[>': function() {
        return true;
      },
      // Enabling
      '>>': function() {
        return 'enable';
      },
      /**
       * Enabling with information passing
       * Will pass provided data to right sibling
       *
       */
      '[]>>': function() {

        return 'enable';
      },
      // Suspend - resume
      '|>': function() {
        return true;
      },
    };

    return relations[task.relation]();
  }

}
