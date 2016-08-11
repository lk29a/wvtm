import { ReflectiveInjector } from "@angular/core";
import { TaskModel } from "./taskmodel";
import { ITask, ITaskModel, TaskRecord } from "./taskmodel.types";
import { Map } from "immutable";

// get instance of taskmodel service
let providers = ReflectiveInjector.resolve([TaskModel]);
let injector = ReflectiveInjector.fromResolvedProviders(providers);
let taskModel: TaskModel = injector.get(TaskModel);
let t = taskModel.root;

console.log(taskModel);

let rootTask: ITask = new TaskRecord({
  taskId: t.id,
  taskType: t.type,
  taskName: t.name,
  taskDescription: t.description,
}) as ITask;

console.log(rootTask);

let tobj = {};
tobj[t.id] = rootTask

export const INITIAL_STATE: ITaskModel = {
  name: "",
  description: "",
  treeRoot: "",
  tasks: Map<string, ITask>(tobj)
} as ITaskModel;
