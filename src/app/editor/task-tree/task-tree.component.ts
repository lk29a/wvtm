import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {SVGHelper} from "../shared";
import {Task} from "../../taskmodel";
import {List} from 'immutable';
import {TaskStore, EditorStateStore} from "../../store";

@Component({
  moduleId: module.id,
  selector: "g[task-tree]",
  templateUrl: "task-tree.component.html",
  styleUrls: ["task-tree.component.css"],
  directives: [TaskTreeComponent]
})
export class TaskTreeComponent implements OnInit, OnDestroy {

  @Input() task: string;
  taskNode: Task;
  subTasks: Task[] = [];
  subscription;
  // subscription;
  constructor(private taskStore: TaskStore,
              private editorStateStore: EditorStateStore,
              private svgHelper: SVGHelper) {
  }

  ngOnInit() {
    // this.subTasks = this.task.children;
    this.subscription = this.taskStore.getTask(this.task).subscribe(task => {
      this.taskNode = task;
      if (this.subTasks !== task.children) {
        console.log("new children");
        this.subTasks = task.children;
      }
    });
  }


  onTaskNodeClick() {
    this.taskStore.selectTask(this.task);
    this.editorState.
  }

  getLinkPath(): string {
    return this.svgHelper.getLinkPath(this.taskNode);
  }



  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
