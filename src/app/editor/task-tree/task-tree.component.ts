import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {Task} from "../../taskmodel";
import {List} from 'immutable';
import {TaskStore} from "../shared";

@Component({
  moduleId: module.id,
  selector: "task-tree",
  templateUrl: "task-tree.component.html",
  styleUrls: ["task-tree.component.css"],
  directives: [TaskTreeComponent]
})
export class TaskTreeComponent implements OnInit, OnDestroy {

  @Input() task: Task;
  subTasks: List<Task>;
  subscription;
  constructor(private taskStore: TaskStore) { }

  ngOnInit() {
    this.subscription = this.taskStore.getSubTasks(this.task.id)
                                      .subscribe(res => {
                                        this.subTasks = res;
                                      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
