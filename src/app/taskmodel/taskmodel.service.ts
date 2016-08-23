import {Map, List} from "immutable";
import {ITask, ITaskModel, ICoord, TaskRecord, TaskModelRecord} from "./taskmodel.types";
import {TreeLayout} from "./treelayout";
import {TaskType} from "../shared";

let taskCounter = 0;
let moduleCounter = 1;

export function createNew(): ITaskModel {
  let rootTask: ITask = createRootTask();

  let tasks = Map<string, ITask>().set(rootTask.id, rootTask);
  let coords = calculateLayout(rootTask.id, tasks);

  return new TaskModelRecord({
    "name": "",
    "description": "",
    "treeRoot": rootTask.id,
    "selectedTask": "",
    "treeLayout": coords,
    "tasks": tasks
  }) as ITaskModel;
}

function createRootTask(): ITask {
  return new TaskRecord({
    type: TaskType.ABSTRACT,
    name: "Default",
    id: "TASK_" + (taskCounter++), // @lk comeup with some naming convention
    relation: null,
    description: "Default abstract node"
  }) as ITask;
}


export function createTask(parentId: string, taskType: string): ITask {
  return new TaskRecord({
    type: TaskType[taskType.toUpperCase()] || TaskType.ABSTRACT,
    name: taskType + "_" + taskCounter,
    id: "TASK_" + (taskCounter++), // @lk comeup with some naming convention
    relation: null,
    description: "",
    parent: parentId
  }) as ITask;
}

export function addTask(taskModel: ITaskModel, subTask): ITaskModel {
  let tasks = taskModel.tasks;
  tasks = tasks.withMutations(function(data) {
    data.set(subTask.id, subTask)
      .updateIn([subTask.parent, "children"], function(childList) {
        return childList.push(subTask.id);
      })
  });

  let coords = calculateLayout(taskModel.treeRoot, tasks);

  return taskModel.withMutations(model => {
    model.set("tasks", tasks).set("treeLayout", coords);
  }) as ITaskModel;
}

export function addModule(taskModel: ITaskModel, parentId: string, moduleId: string): ITaskModel {
  let subTree = makeSubTreeFromModue(parentId, moduleId);

  return taskModel;
}


export function removeTask(taskModel: ITaskModel, taskId: string): ITaskModel {
  let tasks = taskModel.tasks;
  let selected = tasks.get(taskId);
  tasks = tasks.withMutations(function(data) {
    data.delete(taskId)
      .updateIn([selected.parent, "children" ], function(childList) {
        return childList.delete(childList.indexOf(taskId));
      })
  });

  let coords = calculateLayout(taskModel.treeRoot, tasks);

  return taskModel.withMutations(model => {
    model.set("tasks", tasks).set("treeLayout", coords);
  }) as ITaskModel;
}

export function updateTask(task: ITask, type, value): ITask {
  return task.set(type, value) as ITask;
}

export function newModule(taskModel: ITaskModel, taskId: string) {
  let tasks = taskModel.tasks;
  let modules = taskModel.modules;
  let taskList: List<string> = tasks.getIn([taskId, "children"]);

  let modTasks: Map<string, ITask> = tasks.filter((val, key) => {
    return taskList.includes(key) || key === taskId;
  }).toMap();

  let newMod = new TaskModelRecord({
    "name": "Module " + moduleCounter++,
    "description": "",
    "tasks": modTasks
  }) as ITaskModel;

  modules = modules.push(newMod);

  return taskModel.set("modules", modules);
}


export function calculateLayout(rootTask: string, tasks: Map<string, ITask>): Map<string, ICoord> {
  // get current canvas size
  let treeLayout = new TreeLayout();
  return treeLayout.calculate(rootTask, tasks)
}

export function makeSubTreeFromModue(parentId: string, module: string) {
  
}



  createTestModel() {

    // setTimeout(() => {
    //   this.taskModelActions.addTask("Abstract", "TASK_0");
    // }, 2000)
    // setTimeout(() => {
    //   this.taskStore.addTask("Abstract", "TASK_0");
    // }, 3000)
    // setTimeout(() => {
    //   this.taskStore.addTask("Abstract", "TASK_0");
    // }, 4000)
    // this.taskStore.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Enable access", relation: ">>" });
    // this.taskStore.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Access", relation: "[>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_0", taskType: "INTERACTION", name: "Close access" });
    // this.taskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});

    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert card", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "System", name: "Require password", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert Password" });


    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Withdraw cash", relation: "[]" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Deposit cash", relation: "[]" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Get information" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "System", name: "Test" });

    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select withdraw", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Show possible amounts", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "User", name: "Decide amount", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select account", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Provide cash", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Check cash" });
  }
