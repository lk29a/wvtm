import { List, Map, Record } from "immutable";
import { TaskType } from "../../shared";

export interface ITask {
  taskId: string; /* id of task */
  taskType: string; /* type of task */
  taskName: string; /* name of task */
  taskDescription: string; /* description of task */
  taskRelation: string; /* relation assigned to task */
  parent: string; /* id of parent task */
  children: List<ITask>; /* list of child tasks */
  coord: {
    x: number;
    y: number;
  }; /* x & y coordniate for layout */
}

export type ITaskModel = {
  name: string, /* name of model */
  description: string, /* description of model */
  root: string, /* id of root task */
  tasks: Map<string, ITask> /* map of tasks in model */
};

export const TaskRecord = Record({
  taskId: "",
  taskType: TaskType.ABSTRACT,
  taskName: "",
  taskDescription: "",
  taskRelation: "",
  parent: null,
  children: List<ITask>(),
  coord: {
    x: 0,
    y: 0
  }
});
