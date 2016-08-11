import { List, Map, Record } from "immutable";

export const TaskRecord = Record({
  taskId: undefined,
  taskType: undefined,
  taskName: undefined,
  taskDescription: undefined,
  taskRelation: undefined,
  parent: undefined,
  children: List<string>(),
  coord: {
    x: 0,
    y: 0
  }
});

export interface ITask extends Map<string, any> {
  taskId: string; /* id of task */
  taskType: string; /* type of task */
  taskName: string; /* name of task */
  taskDescription: string; /* description of task */
  taskRelation: string; /* relation assigned to task */
  parent: string; /* id of parent task */
  children: List<string>; /* list of child tasks ids */
  coord: {
    x: number;
    y: number;
  }; /* x & y coordniate for layout */
}

export const TaskModelRecord = Record({
  name: "",
  description: "",
  treeRoot: undefined,
  tasks: Map<string, ITask>()
});

export interface ITaskModel extends Map<string, any> {
  name: string, /* name of model */
  description: string, /* description of model */
  treeRoot: string, /* id of root task */
  tasks: Map<string, ITask> /* map of tasks in model */
};

