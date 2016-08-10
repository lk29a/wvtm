// import { TaskModel } from "../../taskmodel";
import { ITask, ITaskModel, TaskRecord } from "./taskmodel.types";
import { Map } from "immutable";

// create new taskmodel

// let t = TaskModel.createNew()

// let rootTask: ITask = new TaskRecord({
//   taskId: t.id,
//   taskType: t.type,

//   taskName: t.name,
//   taskDescription: t.description,
// })
// let tobj = {};
// tobj[t.id] = rootTask
// initial state of task model should be 
export const INITIAL_STATE: ITaskModel = {
  name: "",
  description: "",
  root: "",
  tasks: Map<string, ITask>()
};
