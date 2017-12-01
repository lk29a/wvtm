import {List, Map} from 'immutable';
import {ITaskModel, ITask, TreeUtils} from '../taskmodel';
import {TaskRelation} from '../shared';
import {TaskType} from "../shared/constants";

export class Simulator {

  // ets = List<string>();
  ets = Map<string, List<ITask>>();
  tasksExecuted = List<string>();
  treeUtils: TreeUtils;

  constructor(private nodeList: Map<string, ITask>, private root: string) {
    this.treeUtils = new TreeUtils(nodeList, root);
  }

  start() {
    const child = this.treeUtils.getFirstChild(this.root);
    this.enableTask(child);
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
        // this.ets = this.ets.push(curTask);
        this.addEnabledTask(curTask);
      }

      // if relation is non blocking
      if (this.checkRelation(curTask)) {
        this.enableTask(this.treeUtils.getRightSibling(curTask));
      }

      curTask = this.treeUtils.getParent(curTask);
    }
  }

  disableTask(task: string) {
    // const idx = this.ets.indexOf(task);
    // if (idx > -1) {
    //   this.ets = this.ets.delete(idx);
    // }
  }

  addEnabledTask(taskId: string) {
    let path = this.get2LevelPathString(taskId);
    let taskNode = this.treeUtils.getRealNode(taskId);
    let tasks: List<ITask>;

    if (this.ets.has(path)) {
      tasks = this.ets.get(path);
    } else {
      tasks = List<ITask>();
    }
    tasks = tasks.push(taskNode);
    this.ets = this.ets.set(path, tasks);
  }

  removeEnabledTask(taskId: string) {
    let path = this.get2LevelPathString(taskId);
    let taskNode = this.treeUtils.getRealNode(taskId);
    if (!this.ets.has(path)) {
      return;
    }
    let tasks = this.ets.get(path);
    if (tasks.contains(taskNode)) {
      tasks = tasks.delete(tasks.indexOf(taskNode))
    }
    if (tasks.isEmpty()) {
      this.ets = this.ets.delete(path);
    } else {
      this.ets = this.ets.set(path, tasks);
    }
  }

  get2LevelPathString(taskId: string): string {
    let path = '';
    let parentLvl1 = this.treeUtils.getParent(taskId, true);
    path = parentLvl1.name;
    let parentLvl2 = this.treeUtils.getParent(parentLvl1.id, true);
    if (parentLvl2) {
      path = `${parentLvl2.name} <i class="fa fa-angle-double-right"></i> ${path}`;
    }
    return path;
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

  getTaskType(task: string) {
    return this.nodeList.getIn([task, 'type']);
  }

  getTaskAttr(task, attr) {
    return this.nodeList.getIn([task, attr]);
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

    // const idx = this.ets.indexOf(aTask);
    // if (idx < 0) {
    if (!this.isTaskInETS(aTask)) {
      console.warn('Task not enabled', aTask);
      return;
    }

    // remove task from enabled set
    // this.ets = this.ets.delete(idx);
    this.removeEnabledTask(aTask);

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

    const rSibling = this.treeUtils.getRightSibling(aTask);
    const lSibling = this.treeUtils.getLeftSibling(aTask);
    if (lSibling) {
      let lsRel = this.getTaskRelation(lSibling);
      if (TaskRelation[lsRel] === TaskRelation.DEACT) {
        this.ets = this.ets.clear();
      }
    }


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
    if (!this.isTaskActive(parent)) {
      // this.ets = this.ets.push(parent);
      if(!(parent == this.root)) {
        this.addEnabledTask(parent);
        this.executeTask(parent);
      }
    }
    return this.ets;
  }

  /**
   * returns true if any task including aTask is enabled in the subtree rooted at aTask
   *
   * @param  {[type]}  aTask [description]
   * @return {Boolean}       [description]
   */
  isTaskActive(aTask) {
    let enabled: boolean;
    const _this = this;
    // a task is enabled is any of its children is enabled
    enabled = (function isTaskEnabled(parent) {
      if (_this.isTaskInETS(parent)) {
        // if (_this.ets.indexOf(parent) > -1) {
        return true;
      } else {
        let tmp = false;
        let children = _this.treeUtils.getChildren(parent);
        for (let i = 0; i < children.size; i++) {
          tmp = isTaskEnabled(children.get(i));
          if (tmp === true) {
            return tmp;
          }
        }
        return tmp;
      }
    })(aTask);
    return enabled;
  }

  isTaskInETS(taskId: string): boolean {
    let node = this.treeUtils.getRealNode(taskId);
    let contains = false;
    this.ets.forEach((val, key) => {

      if (val.contains(node)) {
        contains = true;
        return false;
      }
    });

    return contains;
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
      'UNRESTRICTED': function () {
        return 'noop';
      },
      // Choice
      'CHOICE': function () {
        return 'execute';
      },
      // Concurrency with information exchange
      'CONCURRENTINFO': function () {
        return true;
      },
      // Order Independence
      'RANDOM': function () {
        return true;
      },
      // Deactivating
      'DEACT': function () {
        return true;
      },
      // Enabling
      'ENABLE': function () {
        return 'enable';
      },
      /**
       * Enabling with information passing
       * Will pass provided data to right sibling
       *
       */
      'ENABLEINFO': function () {

        return 'enable';
      },
      // Suspend - resume
      'RESUME': function () {
        return true;
      },
    };

    return relations[this.getTaskRelation(task)]();
  }

}
