declare var require: any;
import {Component, ElementRef, OnInit, AfterViewInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import { NgRedux, select } from "ng2-redux";
import { Map } from "immutable";
import { EditorActions }      from "./editor.actions";
import {LoggerService } from "../shared";
import { IWVTMState } from "../store";
import {ITask, ITaskModel} from "../taskmodel";

const Immutable  = require("immutable");

interface Dim {
  height: number,
  width: number
}

@Component({
  selector: "wvtm-editor",
  moduleId: module.id,
  templateUrl: "editor.html",
  styleUrls: ["editor.css"],
  // directives: [TaskNodeComponent],
})
export class EditorComponent implements OnInit, AfterViewInit {


  // @select(["taskModel", "treeRoot"]) treeRoot: Observable<string>;
  // @select(["taskModel", "tasks"]) tasks: Observable<Map<string, ITask>>;
  tasks: Map<string, ITask>;
  svgElm: HTMLElement;
  canvasDim: Dim = {
    height: null,
    width: null
  };

  constructor(private el: ElementRef,
    private editorActions: EditorActions,
    private redux: NgRedux<IWVTMState>,
    private logger: LoggerService) {
    this.logger.debug("Editor component initialized")
    Observable.fromEvent(window, "resize")
      .debounceTime(300)
      .subscribe((event) => {
        this.resizeCanvas(event);
      }
    );

    this.redux.select("taskModel")
      .subscribe((taskModel: ITaskModel) => {
        console.log(taskModel);
      });

    this.redux.select(["taskModel", "tasks"])
      .subscribe((tasks: Map<string, ITask>) => {
        console.log(tasks);
        if (!Immutable.is(this.tasks, tasks))
          this.tasks = tasks;
      });
  }

  ngOnInit() {
  }

  resizeCanvas(event) {
    this.canvasDim.height = this.el.nativeElement.firstChild.clientHeight;
    this.canvasDim.width = this.el.nativeElement.firstChild.clientWidth;
  }

  ngAfterViewInit() {
    let dim = {
      height: this.el.nativeElement.firstChild.clientHeight,
      width: this.el.nativeElement.firstChild.clientWidth,
    };
    // set initial dimensions
    this.svgElm = this.el.nativeElement.querySelector("svg");
    this.svgElm.setAttribute("height", dim.height);
    this.svgElm.setAttribute("width", dim.width);
    this.createTestModel();

    // this.render();
  }

  render() {
    let width = this.canvasDim.width || this.el.nativeElement.firstChild.clientWidth;

    this.createTestModel();
    // this.treeLayout.calculate(this.taskModel.root, width / 2);
  }


  createTestModel() {

    // setTimeout(() => {
    //   this.taskModelActions.addTask("Abstract", "TASK_0");
    // }, 2000)
    // setTimeout(() => {
    //   this.taskStore.addTask("Abstract", "TASK_0");
    // }, 3000)
    // setTimeout(() => {
    //   this.taskStore.addTask("Abstract", "TASK_0");
    // }, 4000)
    // this.taskStore.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Enable access", relation: ">>" });
    // this.taskStore.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Access", relation: "[>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_0", taskType: "INTERACTION", name: "Close access" });
    // this.taskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});

    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert card", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "System", name: "Require password", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert Password" });


    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Withdraw cash", relation: "[]" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Deposit cash", relation: "[]" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Get information" });
    // this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "System", name: "Test" });

    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select withdraw", relation: ">>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Show possible amounts", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "User", name: "Decide amount", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select account", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Provide cash", relation: "[]>>" });
    // this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Check cash" });
  }
};
