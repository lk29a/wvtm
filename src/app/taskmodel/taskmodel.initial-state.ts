// import { ReflectiveInjector } from "@angular/core";
// import { TaskModel } from "./taskmodel";
// import { List, Map } from "immutable";
import { ITaskModel } from "./taskmodel.types";
import {createNew} from "./taskmodel.service";


export const INITIAL_STATE: ITaskModel = createNew();



// get instance of taskmodel service
// let providers = ReflectiveInjector.resolve([TaskModel]);
// let injector = ReflectiveInjector.fromResolvedProviders(providers);
// let taskModel: TaskModel = injector.get(TaskModel);
// let t = taskModel.root;

// new TaskRecord({
//   taskId: t.id,
//   taskType: t.type,
//   taskName: t.name,
//   taskDescription: t.description,
//   children: List<string>()
// }) as ITask;


// let coordobj = {};
// coordobj[rootTask.id] = {x: 300, y: 100};

// let tasks = Map<string, ITask>();
// tasks = tasks.set(t.id, rootTask);


// export const INITIAL_STATE: ITaskModel = new TaskModelRecord({
//   "name": "",
//   "description": "",
//   "treeRoot": rootTask.id,
//   "selectedTask": "",
//   "treeLayout": Map<string, ICoord>(coordobj),
//   "tasks": Map<string, ITask>(tobj)
// }) as ITaskModel;
