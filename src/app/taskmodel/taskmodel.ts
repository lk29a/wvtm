import {Task, TaskType, TaskRelation} from "./task";
import {GenericTree} from "../generic-tree/generic-tree";

interface TaskBase {
  parentTaskId: string,
  taskType: string,
  name?: string,
  relation?: string
}

export class TaskModel extends GenericTree {

  private taskCounter: number;
  name: string;
  description: string;
  taskTree: any;
  simulation: any;
  root: Task;

  constructor() {
    let data = {
      type: TaskType.ABSTRACT,
      name: "Default",
      id: "TASK_0",
      relation: null,
      description: "Default abstract node"
    };
    let tmp = new Task(data);
    super(tmp);
    this.root = tmp;
    this.taskCounter = 1;
  }

  addTask(options: TaskBase) {
    if (!options.parentTaskId) {
      throw new Error("`parentId` must be provided");
    }

    if (!options.taskType) {
      throw new Error("`type` of task must be provided");
    }

    let parentNode = this.searchTask(options.parentTaskId);
    let newTaskId = "TASK_" + (this.taskCounter++); // @lk comeup with some naming convention

    let data = {
      type: TaskType[options.taskType.toUpperCase()] || TaskType.ABSTRACT,
      name: (options.name) || (options.taskType + "_" + this.taskCounter),
      id: newTaskId,
      relation: options.relation || "",
      description: "",
    };
    this.addNode(parentNode, new Task(data));

    return newTaskId;
  }

  removeTask(taskId: string) {
    let selectedTask: Task = this.searchTask(taskId);
    let leftSibling = selectedTask.getLeftSibling();
    // if left sibling exists then remove its relation
    if (leftSibling)
      leftSibling.relation = "";

    let parent: Task  = selectedTask.parent;
    console.log(parent);
    let idx = parent.children.indexOf(selectedTask);
    parent.removeChild(idx);
    // @lk proper error checking

    console.log(this.root);
    return true;
  }

  updateTask(taskId, type, value) {
    console.log(type, value);
    if (!taskId) {
      throw new Error("`taskId` must be provided");
    }
    let task = this.searchTask(taskId);

    switch (type) {
      case "relation":
        this.updateTaskRelation(task, value);
        break;

      case "type":
        this.updateTaskType(task, value);
        break;

      case "name":
        this.updateTaskName(task, value);
        break;

      case "description":
        this.updateTaskDescription(task, value);
        break;

      default:
        throw new Error("Cannot update specified property.");
    }

    // update successfull
    return true;
  }

  searchTask(taskId: String): Task {
    let foundNode = (function recursiveDF(currentNode: Task): Task {
      if (currentNode.id === taskId) {
        return currentNode;
      } else {
        let tmp = null;
        for (let i = 0; i < currentNode.children.length; i++) {
          tmp = recursiveDF(currentNode.children[i]);
          if (tmp !== null) {
            return tmp;
          }
        }
        return null;
      }
    })(this.root);

    return foundNode;
  };


  updateTaskRelation(task: Task, relation) {
    if (!TaskRelation[relation.toUpperCase()]) {
      throw new Error("Please provide a valid relation");
    }
    task.relation = TaskRelation[relation.toUpperCase()];
  };


  updateTaskType(task: Task, taskType) {
    if (!taskType) {
      throw new Error("`taskType` of task must be provided");
    }
    task.type = taskType;
  };

  updateTaskName(task: Task, name) {
    if (!name) {
      throw new Error("`name` of task must be provided");
    }
    task.name = name;

  }

  updateTaskDescription(task: Task, description) {
    if (!task) {
      throw new Error("`taskId` must be provided");
    }
    task.description = description;
  }

	/**
	 * Check correctness of the model
	 * 1. Abstract task should have atleast one child
	 * 2. Every sibling pair should have a relation
	 */
  validateStructure() {
    let validationObj = {
      data: [],
      valid: true,
      warnCount: 0,
      errorCount: 0
    };
    function validateTask(task) {
      if (task.isLeaf() && (task.type === TaskType.ABSTRACT)) {
        // console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
        validationObj.data.push({taskId: task.id, msg: "Warning: Task '" + task.name + "' is abstract type. Task should have subtasks."});
        validationObj.warnCount++;
      }

      if (!task.relation && (task.getRightSibling() !== null)) {
        // if(task.parent && (task.parent.getLastChild() !== task)) {
        validationObj.valid = false;
        // console.log('Error: "' + task.data.name + '" must have a relation with its right sibling.');
        validationObj.data.push({taskId: task.id, msg: "Error: Task '" + task.name + "' must have a relation with its right sibling."});
        validationObj.errorCount++;
        // }
      }
    }
    this.traverseDF(validateTask);
    return validationObj;
  };

	/*
	 * Calculates relation precedence of children
	 *
	 * returns ???
	 */
  calculateRelationPrecedence(aTask: Task) {
    let tasks = aTask.children;
    if (tasks.length < 3) {
      return;
    } else {

    }
  }


}
