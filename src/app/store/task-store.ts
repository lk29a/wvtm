import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {Map} from 'immutable';
import {Task, TaskModel} from "../taskmodel";
import {LoggerService} from "../shared";
import {TreeLayout} from "../editor/shared";

@Injectable()
export class TaskStore {
  private _tm: TaskModel;
  private currentTask: string;
  private _rootTask: string;
  private taskMap: Map<string, Task> = Map({});
  private treeLayout = new TreeLayout();
  private taskMapSource = {};


  constructor(private logger: LoggerService) {
    this._tm = new TaskModel();
    this.currentTask = this._rootTask = this._tm.root.id;
    // set root as selected task
    this._tm.root.state.selected = true;
    this.treeLayout.calculate(this._tm.root, 500);
    this.taskMap = this.taskMap.set(this._rootTask, this._tm.root);
  }

  get rootTask(): string {
    return this._rootTask;
  }

  get taskModel(): TaskModel {
    return this._tm;
  }

  getTask(taskId: string): Observable<Task> {
    this.logger.debug("get task: ", taskId);
    if (!this.taskMap.has(taskId))
      return;

    if (!this.taskMapSource.hasOwnProperty(taskId)) {
      this.taskMapSource[taskId] = new BehaviorSubject(this.taskMap.get(taskId));
    }
    // return this.taskMapSource.get(taskId).asObservable();
    return this.taskMapSource[taskId];
  }

  addTask(type: string, parentId: string) {
    try {
      // add the task to tree
      let task = this._tm.addTask({ parentTaskId: parentId, taskType: type });
      // calculate layout again
      this.treeLayout.calculate(this._tm.root, 500)
      // save it in flat map
      this.taskMap = this.taskMap.set(task.id, task);
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  selectTask(taskId: string) {
    // unset previous 
    let prevTask = this.taskMap.get(this.currentTask);
    prevTask.state.selected = false;
    this.taskMap = this.taskMap.set(this.currentTask, prevTask);

    if (this.taskMap.has(taskId)) {
      let curTask = this.taskMap.get(taskId);
      curTask.state.selected = true;
      this.taskMap = this.taskMap.set(taskId, curTask);
      this.currentTask = taskId;
      // this.taskMap = this.taskMap.setIn([this.currentTask, "state", "selected"], false);
    }


  }

  updateTask(taskId: string, type: string, value: string) {
    try {
      let task = this._tm.updateTask(taskId, type, value);
      this.treeLayout.calculate(this._tm.root, 500)
      this.taskMap = this.taskMap.set(task.id, task);
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  deleteTask(taskId: string) {
    try {
      this._tm.removeTask(taskId);
      this.treeLayout.calculate(this._tm.root, 500)
      // let tasks: List<Task> = this._tasks.getValue();
      // let index = tasks.findIndex((task) => task.id === deletedTask.id);
      // this._taskTree.next(this._tm.root);
      // this._tasks.next(tasks.delete(index));
    } catch (ex) {
      console.log(ex);
    }
  }

  private treeToList(root: Task): Task[] {
    let tasks = [];

    (function recursiveDF(currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        recursiveDF(currentNode.children[i]);
      }
      tasks.push(currentNode);
      // console.log(currentNode.layout);
    })(root);

    return tasks;
  }
}
