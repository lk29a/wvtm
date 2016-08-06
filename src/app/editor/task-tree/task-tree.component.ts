import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {SVGHelper} from "../shared";
import {Task} from "../../taskmodel";
import {List} from 'immutable';
import {TaskStore} from "../../store";

@Component({
  moduleId: module.id,
  selector: "g[task-tree]",
  templateUrl: "task-tree.component.html",
  styleUrls: ["task-tree.component.css"],
  directives: [TaskTreeComponent]
})
export class TaskTreeComponent implements OnInit, OnDestroy {

  @Input() task: Task;
  subTasks: List<Task>;
  // subscription;
  constructor(private taskStore: TaskStore,
              private svgHelper: SVGHelper) {
    console.log("new task");
  }

  ngOnInit() {}


  onTaskNodeClick() {
    this.taskStore.selectTask(this.task.id);
    // this.task.state.selected = !this.task.state.selected;
  }

  getSubTasks() {
    return this.task ? this.task.children : [];
  }


  getLinkPath(): string {
    return this.svgHelper.getLinkPath(this.task);
  }



  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

}
