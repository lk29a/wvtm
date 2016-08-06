import {Component, ElementRef, AfterViewInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {Task, TaskModel} from "../taskmodel";
import {EditorService, SVGHelper, TreeLayout} from "./shared";
import {TaskStore} from "../store";
import {Simulator} from "../simulator";
import {TaskTreeComponent} from "./task-tree";
import { WVTMService, LoggerService } from "../shared";

interface Dim {
  height: number,
  width: number
}

@Component({
  selector: "wvtm-editor",
  moduleId: module.id,
  templateUrl: "editor.html",
  styleUrls: ["editor.css"],
  providers: [EditorService, TreeLayout, SVGHelper, Simulator],
  directives: [TaskTreeComponent],
})
export class EditorComponent implements AfterViewInit {
  taskModel: TaskModel = null;
  svgElm: HTMLElement;
  taskTree: Task = null;
  canvasDim: Dim = {
    height: null,
    width: null
  };

  constructor(private el: ElementRef,
    private editor: EditorService,
    private wvtm: WVTMService,
    private taskStore: TaskStore,
    private treeLayout: TreeLayout,
    private logger: LoggerService) {
    Observable.fromEvent(window, "resize")
      .debounceTime(300)
      .subscribe((event) => {
        this.resizeCanvas(event);
      }
    );
    // this.editor.createNew();
    // this.taskModel = editor.getTaskModel();
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
    this.taskStore.taskTree.subscribe(root => {
      this.treeLayout.calculate(root, width / 2)
      this.taskTree = root;
    });
    this.createTestModel();
    // this.treeLayout.calculate(this.taskModel.root, width / 2);
  }


  createTestModel() {

    setTimeout(() => {
      this.taskStore.addTask("Abstract", "TASK_0");
    }, 2000)
    setTimeout(() => {
      this.taskStore.addTask("Abstract", "TASK_0");
    }, 3000)
    setTimeout(() => {
      this.taskStore.addTask("Abstract", "TASK_0");
    }, 4000)
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