import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { NgRedux, select } from "ng2-redux";
import {SVGHelper} from "../shared";
import {ITask} from "../../taskmodel";
import {List} from 'immutable';
// import {TaskStore, EditorStateStore} from "../../store";

@Component({
  moduleId: module.id,
  selector: "g[task-tree]",
  templateUrl: "task-tree.component.html",
  styleUrls: ["task-tree.component.css"],
  directives: [TaskTreeComponent]
})
export class TaskTreeComponent implements OnInit, OnDestroy {

  @Input() taskId: string;
  // @select([])
  taskNode: ITask;
  subTasks: List<string> = List<string>();
  subscription;
  // subscription;
  constructor(private svgHelper: SVGHelper) {
  }

  ngOnInit() {
    console.log(this.taskId);
    // this.subTasks = this.task.children;
    // this.subscription = this.taskStore.getTask(this.task).subscribe(task => {
    //   this.taskNode = task;
    //   if (this.subTasks !== task.children) {
    //     console.log("new children");
    //     this.subTasks = task.children;
    //   }
    // });
  }


  onTaskNodeClick() {
    // this.taskStore.selectTask(this.task);
  }

  getLinkPath(): string {
    // return this.svgHelper.getLinkPath(this.taskNode);
    return "";
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
