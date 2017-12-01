import {List, Map} from "immutable";
import {ITask} from "../taskmodel/taskmodel.types";
import {TreeLayout} from "../taskmodel/treelayout";

export function getModuleTasks(tasks, taskId): Map<string, ITask> {
  const taskList: List<string> = tasks.getIn([taskId, 'children']);

  let modTasks: Map<string, ITask> = tasks.filter((val, key) => {
    return taskList.includes(key) || key === taskId;
  }).toMap();

  modTasks = modTasks.setIn([taskId, 'parent'], null);
  modTasks = modTasks.setIn([taskId, 'parent'], null);


  modTasks = modTasks.withMutations((data) => {
    data.updateIn([taskId, 'parent'], () => {return null})
      .updateIn([taskId, 'relation'], () => {return null})
  });
  const treeLayout = new TreeLayout();
  modTasks = treeLayout.calculate(taskId, modTasks, 300);

  return modTasks
}
