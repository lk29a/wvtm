import {Injectable} from "@angular/core";
import { List, Map } from "immutable";
import { ITaskModel, ITask, TreeUtils} from "../taskmodel";
import { TaskRelation } from "../shared";

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

    let curTask = task,
      leftmostPath = [];

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
   * @param  {[type]} aTask [description]
   */
  checkRelation(task: string) {
    // can add more relations to check here
    if (
      this.getTaskRelation(task) === TaskRelation.UNRESTRICTED ||
      this.getTaskRelation(task) === TaskRelation.CHOICE ||
      this.getTaskRelation(task) === TaskRelation.RANDOM ||
      this.getTaskRelation(task) === TaskRelation.CONCURRENTINFO ||
      this.getTaskRelation(task) === TaskRelation.DEACT ||
      this.getTaskRelation(task) === TaskRelation.RESUME
    ) {
      return true;
    }
    return false;
  }

  getTaskRelation(task: string) {
    return this.nodeList.getIn([task, "relation"]);
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
    let idx = this.ets.indexOf(aTask);
    if (idx < 0) {
      console.log("Task not enabled");
      return;
    } else {
      // remove task from enabled set
      this.ets.splice(idx, 1);

      // check if parent has choice relation, if yes then disable those tasks
      let parent = aTask.parent;

      if (parent.relation === TaskRelation.CHOICE) {
        this.executeTask(parent);
      }


      // if (!silent) {
      // check if left task also needs to be performed in case of choice, unrestricted, etc
      // var lSibling = aTask.getLeftSibling();
      // if (lSibling && checkRelation(lSibling)) {
      //   executeTask(lSibling);
      // }

      let rSibling = aTask.getRightSibling();
      if (rSibling) {
        // some *relation* with right sibling
        let action = this.simulateRelation(aTask, rSibling);
        switch (action) {
          case "enable":
            this.enableTask(rSibling);
            break;

          case "perform":
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

    let _this = this;
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
   * @param  {[type]} realtion [description]
   * @return {[type]}          [description]
   */
  simulateRelation(task, rSibling) {
    let relations = {
      // Independent Concurrency
      "|||": function() {
        return "noop";
      },
      // Choice
      "[]": function() {
        return "execute";
      },
      // Concurrency with information exchange
      "|[]|": function() {
        return true;
      },
      // Order Independence
      "|=|": function() {
        return true;
      },
      // Deactivating
      "[>": function() {
        return true;
      },
      // Enabling
      ">>": function() {
        return "enable";
      },
      /**
       * Enabling with information passing
       * Will pass provided data to right sibling
       *
       * @return {[type]} [description]
       */
      "[]>>": function() {

        return "enable";
      },
      // Suspend - resume
      "|>": function() {
        return true;
      },
    };

    return relations[task.relation]();
  }

}
