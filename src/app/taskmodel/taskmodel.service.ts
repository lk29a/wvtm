import {Map, List} from 'immutable';
import * as Immutable from 'immutable';
import {ITask, ITaskModel, ICoord, TaskRecord, TaskModelRecord, ModuleRecord, IModule} from './taskmodel.types';
import {TreeLayout} from './treelayout';
import {TreeUtils} from './treeutils';
import {TaskType} from '../shared';
import {atmDemo} from './atmdemo'
import {applySourceSpanToExpressionIfNeeded} from "@angular/compiler/src/output/output_ast";

let taskCounter = 0;
let moduleCounter = 1;

export function createNew(): ITaskModel {
  const rootTask: ITask = createRootTask();

  let tasks = Map<string, ITask>().set(rootTask.id, rootTask);
  // let coords = calculateLayout(rootTask.id, tasks);
  tasks = calculateLayout(rootTask.id, tasks);

  const statusData = Map<string, any>().set('validation', {});

  return new TaskModelRecord({
    'name': '',
    'description': '',
    'treeRoot': rootTask.id,
    'selectedTask': '',
    'statusData': statusData,
    // "treeLayout": coords,
    'tasks': tasks
  }) as ITaskModel;
}

function createRootTask(): ITask {
  return new TaskRecord({
    type: TaskType.ABSTRACT,
    name: 'Default',
    id: 'TASK_' + (taskCounter++), // @lk comeup with some naming convention
    relation: null,
    description: 'Default abstract node'
  }) as ITask;
}


export function createTask(parentId: string, taskType: string): ITask {
  return new TaskRecord({
    type: TaskType[taskType.toUpperCase()] || TaskType.ABSTRACT,
    name: taskType + '_' + taskCounter,
    id: 'TASK_' + (taskCounter++), // @lk comeup with some naming convention
    relation: null,
    description: '',
    parent: parentId
  }) as ITask;
}

export function addTask(taskModel: ITaskModel, subTask): ITaskModel {
  let tasks = taskModel.tasks;
  tasks = tasks.withMutations(function(data) {
    data.set(subTask.id, subTask)
      .updateIn([subTask.parent, 'children'], function(childList) {
        return childList.push(subTask.id);
      });
  });
  tasks = calculateLayout(taskModel.treeRoot, tasks);
  return taskModel.withMutations(model => {
    model.set('tasks', tasks);
  }) as ITaskModel;
}

export function addModule(taskModel: ITaskModel, parentId: string, moduleId: string): ITaskModel {
  const subTree = makeSubTreeFromModue(parentId, moduleId);

  return taskModel;
}


export function removeTask(taskModel: ITaskModel, taskId: string): ITaskModel {
  let tasks = taskModel.tasks;
  const selected = tasks.get(taskId);
  tasks = tasks.withMutations(function(data) {
    data.delete(taskId)
      .updateIn([selected.parent, 'children'], function(childList) {
        return childList.delete(childList.indexOf(taskId));
      });
  });

  tasks = calculateLayout(taskModel.treeRoot, tasks);

  return taskModel.set('tasks', tasks) as ITaskModel;
}

export function updateTask(task: ITask, type, value): ITask {
  const isRoot = task.parent ? false : true;
  const isLast = false;

  // @lk make it proper
  switch (type) {
    case 'relation':
      if (isLast) {
        return task;
      }
      break;

    case 'type':
      if (isRoot) {
        return task;
      }
      break;
  }

  return task.set(type, value) as ITask;
}

export function newModule(taskModel: ITaskModel, taskId: string) {
  const tasks = taskModel.tasks;
  let modules = taskModel.modules;
  const taskList: List<string> = tasks.getIn([taskId, 'children']);

  const modTasks: Map<string, ITask> = tasks.filter((val, key) => {
    return taskList.includes(key) || key === taskId;
  }).toMap();

  let modId = moduleCounter++;
  const newMod = new ModuleRecord({
    'id': 'mod_' + modId,
    'name': 'Module ' + modId,
    'description': '',
    'tasks': modTasks,
    'root': taskId
  }) as IModule;

  modules = modules.push(newMod);

  console.log(modules.toJS());
  return taskModel.set('modules', modules);
}


export function calculateLayout(rootTask: string, tasks: Map<string, ITask>): Map<string, ITask> {
  // get current canvas size
  const treeLayout = new TreeLayout();
  return treeLayout.calculate(rootTask, tasks);
}

export function makeSubTreeFromModue(parentId: string, module: string) {

}

export function validateStructure(taskModel: ITaskModel): ITaskModel {
  const validationObj = {
    data: [],
    valid: true,
    warnCount: 0,
    errorCount: 0
  };
  const treeUtils = new TreeUtils(taskModel.tasks, taskModel.treeRoot);

  function validateTask(taskId) {

    const task = taskModel.tasks.get(taskId);

    if (treeUtils.isLeaf(taskId) && (task.type === TaskType.ABSTRACT)) {
      // console.log('Warning: "' + task.data.name + '" is abstract type. Task should have subtasks.');
      validationObj.data.push({ taskId: task.id, msg: 'Warning: Task \'' + task.name + '\' is abstract type. Task should have subtasks.' });
      validationObj.warnCount++;
    }

    if (!task.relation && (treeUtils.getRightSibling(taskId) !== null)) {
      // if(task.parent && (task.parent.getLastChild() !== task)) {
      validationObj.valid = false;
      // console.log('Error: "' + task.data.name + '" must have a relation with its right sibling.');
      validationObj.data.push({ taskId: task.id, msg: 'Error: Task \'' + task.name + '\' must have a relation with its right sibling.' });
      validationObj.errorCount++;
      // }
    }
  }
  treeUtils.traverseDF(validateTask);

  return taskModel.setIn(['statusData', 'validation'], validationObj) as ITaskModel;
}

export function createTestModel(): ITaskModel {

  let iTaskModel = createNew();
  let tasks = Map<string, ITask>();
  for (let key in atmDemo) {
    let task = new TaskRecord({
      id: atmDemo[key].id,
      type: atmDemo[key].type,
      name: atmDemo[key].name,
      description: atmDemo[key].description,
      relation: atmDemo[key].relation,
      parent: atmDemo[key].parent,
      children: List<string>(atmDemo[key].children),
      coords: atmDemo[key].coords
    }) as ITask;
    tasks = tasks.set(key, task);
  }

  tasks = calculateLayout(iTaskModel.treeRoot, tasks);
  return iTaskModel.withMutations(model => {
    model.set('tasks', tasks);
  }) as ITaskModel;


}
