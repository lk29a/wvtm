import { List, Map, Record, Seq } from "immutable";
import {TaskType} from "../shared";

export const TaskRecord = Record({
  id: undefined,
  type: TaskType.ABSTRACT,
  name: undefined,
  description: undefined,
  relation: undefined,
  parent: undefined,
  children: List<string>(),
  coords: {
    x: 0,
    y: 0
  }
});

export interface ITask extends Map<string, any> {
  id: string; /* id of task */
  type: string; /* type of task */
  name: string; /* name of task */
  description: string; /* description of task */
  relation: string; /* relation assigned to task */
  parent: string; /* id of parent task */
  children: Array<string>; /* list of child tasks ids */
  coords: {
    x: number;
    y: number;
  }
}

export interface ICoord extends Map<string, any> {
  x: number;
  y: number;
}

export interface ITaskModel extends Map<string, any> {
  name: string, /* name of model */
  id: string
  description: string, /* description of model */
  selectedTask: string, /* id of selected task */
  treeRoot: string, /* id of root task */
  statusData: Map<string, any>,
  modules: List<Map<string, ITaskModel>>,
  // treeLayout: Map<string, ICoord>,
  tasks: Map<string, ITask> /* map of tasks in model */
};

export const TaskModelRecord = Record({
  id: "",
  name: "",
  description: "",
  selectedTask: undefined,
  treeRoot: undefined,
  statusData: Map<string, any>(),
  modules: List<Map<string, ITaskModel>>(),
  // treeLayout: Map<string, ICoord>(),
  tasks: Map<string, ITask>()
});
export function deimmutifyTaskModel(state: ITaskModel): Object[] {
  return state.toJS();
}

export function reimmutifyTaskModel(plain): ITaskModel {
  if (plain) {
    return Seq(plain).map(TaskModelRecord) as ITaskModel;
  } else {
    return new TaskModelRecord() as ITaskModel;
  }
}

