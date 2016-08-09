import { TaskModel } from "../../taskmodel";
import { ITaskModel, TaskRecord } from "./taskmodel.types";
import { Map } from "immutable";

// create new taskmodel
let t = TaskModel.createNew()

let rootTask = new TaskRecord({
  taskId: t.id,
  taskType: t.type,
  taskName: t.name,
  taskDescription: t.description,
})

// initial state of task model should be 
export const INITIAL_STATE: ITaskModel = {
  name: "",
  description: "",
  root: t.id,
  tasks: Map({t.id: rootTask});
}
