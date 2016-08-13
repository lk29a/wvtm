import {Map, List} from "immutable";
import {ITask, ITaskModel, ICoord, TaskRecord, TaskModelRecord} from "./taskmodel.types";
import {TreeLayout} from "./treelayout";
import {TaskType} from "../shared";

let taskCounter = 0;

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

export function calculateLayout(rootTask: string, tasks: Map<string, ITask>): Map<string, ICoord> {
  // get current canvas size
  let treeLayout = new TreeLayout();
  return treeLayout.calculate(rootTask, tasks)
}
