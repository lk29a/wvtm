import { Component, Input, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import {AsyncPipe} from "@angular/common";
import {Observable} from "rxjs/Rx";
import {List} from "immutable";
import { NgRedux, select } from "ng2-redux";
import {SVGHelper} from "../shared";
import { IWVTMState } from "../../store";
import {ITask, ICoord, TaskModelActions} from "../../taskmodel";
// import {TaskStore, EditorStateStore} from "../../store";

@Component({
  // moduleId: module.id,
  selector: "g[task-node]",
  templateUrl: "task-node.component.html",
  styleUrls: ["task-node.component.css"],
  pipes: [AsyncPipe],
  providers: [SVGHelper],
  // directives: [TaskTreeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskNodeComponent implements OnInit, OnDestroy, OnChanges {

  // @Input() taskId: string;
  @Input() taskNode: ITask;

  private rxSubs: any = {};
  // taskNode: ITask;
  isSelecetd: Observable<boolean>;
  taskCoords: ICoord;
  subTasks: string[];
  parentCoords: ICoord;
  // subscription;
  constructor(private redux: NgRedux<IWVTMState>,
    private taskModelActions: TaskModelActions,
    private svgHelper: SVGHelper) {

    this.taskCoords = {
      x: 0,
      y: 0
    } as ICoord;
  }

  ngOnInit() {

    // subscribe to task data
    // this.rxSubs.task = this.redux.select(state => state.taskModel.tasks.get(this.taskId))
    //           .subscribe(data => this.taskNode = data);

    // // subscribe to selected task
    this.rxSubs.selected = this.isSelecetd = this.redux.select(state => state.taskModel.selectedTask)
      .map(taskId => this.taskNode.id === taskId);

    // // subscribe to task layout coords
    // this.rxSubs.coords = this.redux.select(state => state.taskModel.treeLayout.get(this.taskNode.id))
    //   .subscribe(data => {
    //     console.log("new coords", this.taskNode.id);
    //     if (this.taskCoords.x !== data.x || this.taskCoords.y !== data.y) {
    //       this.taskCoords = data;
    //     }
    //   });

    // // subscribe to parent task layout coords
    // this.rxSubs.coords = this.redux.select(state => {
    //   let parent = state.taskModel.tasks.getIn([this.taskNode.id, "parent"]);
    //   return state.taskModel.treeLayout.get(parent)
    // })
    // .subscribe(data => this.parentCoords = data);
  }

  onTaskNodeClick() {
    this.taskModelActions.selectTask(this.taskNode.id);
  }

  getTaskTypeLink() {
    return `#def-${this.taskNode.type.toLowerCase()}`;
  }

  getLinkPath(): string {
    console.log("parent link", this.taskNode.id, this.parentCoords);
    if (this.taskNode.parent)
      return this.svgHelper.getLinkPath(this.taskCoords, this.parentCoords);
    else
      return "";
  }

  ngOnChanges(changes) {
    console.log("changed", this.taskNode.id);
  }

  ngOnDestroy() {
    for (let key in this.rxSubs) {
      if (this.rxSubs.hasOwnProperty(key))
        this.rxSubs[key].unsubscribe();
    }
    // this.rxSubs.unsubscribe();
  }

}
