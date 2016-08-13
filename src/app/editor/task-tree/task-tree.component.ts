import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs/Rx";
import {List} from "immutable";
import { NgRedux, select } from "ng2-redux";
import {SVGHelper} from "../shared";
import { IWVTMState } from "../../store";
import {ITask, ICoord, TaskModelActions} from "../../taskmodel";
// import {TaskStore, EditorStateStore} from "../../store";

@Component({
  moduleId: module.id,
  selector: "g[task-tree]",
  templateUrl: "task-tree.component.html",
  styleUrls: ["task-tree.component.css"],
  pipes: [AsyncPipe],
  providers: [SVGHelper],
  directives: [TaskTreeComponent],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskTreeComponent implements OnInit, OnDestroy {

  @Input() taskId: string;

  // @select(state => state.) treeRoot: Observable<string>;

  // taskNode: Observable<ITask>;
  private subscriptions: any = {};
  taskNode: ITask;
  isSelecetd: Observable<boolean>;
  taskCoords: ICoord;
  subTasks: string[];
  parentCoords: ICoord;
  // subscription;
  constructor(private redux: NgRedux<IWVTMState>,
    private taskModelActions: TaskModelActions,
    private svgHelper: SVGHelper) {
  }

  ngOnInit() {
    // subscribe to task data
    this.subscriptions.task = this.redux.select(state => state.taskModel.tasks.get(this.taskId))
              .subscribe(data => this.taskNode = data);

    // subscribe to selected task
    this.subscriptions.selected = this.isSelecetd = this.redux.select(state => state.taskModel.selectedTask)
              .map(taskId => this.taskId === taskId);

    // subscribe to task layout coords
    this.subscriptions.coords = this.redux.select(state => state.taskModel.treeLayout.get(this.taskId))
              .subscribe(data => this.taskCoords = data);

    // subscribe to parent task layout coords
    this.subscriptions.coords = this.redux.select(state => {
      let parent = state.taskModel.tasks.getIn([this.taskId, "parent"]);
      return state.taskModel.treeLayout.get(parent)
    })
    .subscribe(data => this.parentCoords = data);
    // // subscribe to tasks child list
    // this.subscriptions.task = this.redux.select(state => state.taskModel.tasks.get(this.taskId).children)
    //           .subscribe(data => {
    //             console.log(data);
    //             this.subTasks = data});

  }

  onTaskNodeClick() {
    this.taskModelActions.selectTask(this.taskId);
    // this.taskStore.selectTask(this.task);
  }

  getTaskTypeLink() {
    console.log("lklklk");
    console.log(this.taskNode.type);
    return `#def-${this.taskNode.type.toLowerCase()}`;
  }

  getLinkPath(): string {
    if (this.parentCoords)
      return this.svgHelper.getLinkPath(this.taskCoords, this.parentCoords);
    else
      return "";
  }



  ngOnDestroy() {
    for (let key in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(key))
        this.subscriptions[key].unsubscribe();
    }
    // this.subscriptions.unsubscribe();
  }

}
