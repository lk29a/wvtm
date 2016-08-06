import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {List, Map} from 'immutable';
import {Task, TaskModel} from "../../taskmodel";
import {EditorService, TreeLayout} from "../shared";
import {LoggerService} from "../../shared";

@Injectable()
export class TaskStore {

  private _tasks: BehaviorSubject<List<Task>> = new BehaviorSubject(List([]));
  private taskModel: TaskModel;
  private taskMap: Map<string, BehaviorSubject<List<Task>>> = Map({});
  // public task

  constructor(private logger: LoggerService,
    private treeLayout: TreeLayout,
    private editor: EditorService) {
    this.loadInitialData();
  }

  get tasks(): Observable<List<Task>> {
    return this._tasks.asObservable();
  }

  loadInitialData() {
    this.taskModel = new TaskModel();
    this.calculateLayout();
    let tasks = this.treeToList(this.taskModel.root);
    this._tasks.next(List(tasks));
  }

  getSubTasks(taskId: string): Observable<List<Task>> {
    if (!this.taskMap.has(taskId)) {
      // let currentTask = new Subject<List<Task>>();
      // currentTask.
      // let tmp = this.taskMap.set(taskId, );
      // console.log(tmp);
    }
    return this.taskMap.get(taskId);
  }

  addTask(type: string, parentId: string) {
    let task = this.taskModel.addTask({ parentTaskId: parentId, taskType: type });

    this._tasks.next(this._tasks.getValue().push(task));
  }

  updateTask(taskId: string, type: string, value: string) {
    try {
      let updatedTask = this.taskModel.updateTask(taskId, type, value);
      let tasks = this._tasks.getValue();
      let index = tasks.findIndex((task: Task) => task.id === updatedTask.id);
      this._tasks.next(tasks.set(index, updatedTask));
    } catch (ex) {
      console.log(ex);
    }
  }

  deleteTask(taskId: string) {
    try {
      let deletedTask = this.taskModel.removeTask(taskId);
      let tasks: List<Task> = this._tasks.getValue();
      let index = tasks.findIndex((task) => task.id === deletedTask.id);
      this._tasks.next(tasks.delete(index));
    } catch (ex) {
      console.log(ex);
    }
  }

  private calculateLayout() {
    this.treeLayout.calculate(this.taskModel.root, 500);

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
