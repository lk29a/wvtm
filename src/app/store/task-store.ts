import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs/Rx";
import {List, Map} from 'immutable';
import {Task, TaskModel} from "../taskmodel";
import {LoggerService} from "../shared";
import {TreeLayout} from "../editor/shared";

@Injectable()
export class TaskStore {
  private _tm: TaskModel;
  private _taskModel: BehaviorSubject<TaskModel>;
  private _taskTree: BehaviorSubject<Task>;
  private taskMap: Map<string, Task> = Map({});
  private treeLayout = new TreeLayout();
  private taskMapSource: Map<string, Subject<Task>> = Map({});
  // 
  rootTask: string;

  constructor(private logger: LoggerService) {
    this._tm = new TaskModel();
    this.treeLayout.calculate(this._tm.root, 500);
    this.rootTask = this._tm.root.id;
    this.taskMap.set(this.rootTask, this._tm.root)
    // this._taskModel = new TaskModel();
    this._taskModel =  new BehaviorSubject(this._tm);
    this._taskTree = new BehaviorSubject(this._tm.root);
    // let tasks = this.treeToList(this.taskModel.root);
    // this._tasks.next(List(tasks));
  }

  get taskModel(): Observable<TaskModel> {
    return this._taskModel.asObservable();
  }

  get taskTree(): Observable<Task> {
    return this._taskTree.asObservable();
  }

  getTask(taskId: string): Observable<Task> {
    if (!this.taskMap.has(taskId))
      return;

    if (!this.taskMapSource.has(taskId)) {
      this.taskMapSource.set(taskId, new Subject<Task>());
    }
    return this.taskMapSource.get(taskId).asObservable();
  }

  addTask(type: string, parentId: string) {
    // add the task to tree
    let task = this._tm.addTask({ parentTaskId: parentId, taskType: type });
    // calculate layout again
    this.treeLayout.calculate(this._tm.root, 500)
    // save it in flat map
    this.taskMap.set(task.id, task);
    // re-emitt all tasks
    
    // this.taskMapSource.get(taskId).asObservable();
    // this._taskTree.next(this._tm.root);
  }

  selectTask(taskId: string) {
  }

  updateTask(taskId: string, type: string, value: string) {
    try {
      this._tm.updateTask(taskId, type, value);
      this.treeLayout.calculate(this._tm.root, 500)
      // let tasks = this._tasks.getValue();
      // let index = tasks.findIndex((task: Task) => task.id === updatedTask.id);
      // this._tasks.next(tasks.set(index, updatedTask));
      this._taskTree.next(this._tm.root);
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteTask(taskId: string) {
    try {
      this._tm.removeTask(taskId);
      this.treeLayout.calculate(this._tm.root, 500)
      // let tasks: List<Task> = this._tasks.getValue();
      // let index = tasks.findIndex((task) => task.id === deletedTask.id);
      this._taskTree.next(this._tm.root);
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
