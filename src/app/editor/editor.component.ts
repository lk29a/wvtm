import {Component, ElementRef, AfterViewInit, Renderer} from "@angular/core";
import {Observable} from "rxjs/Rx";
// import {EditorService} from "./shared/index";
import {TaskModel} from "../taskmodel/index";
// import {Renderer, TreeLayout} from "./renderer/index";
// import {Simulator} from "../simulator/index";
import { WVTMService, LoggerService } from "../shared/index";

declare var __moduleName: string;

interface Dim {
  height: number,
  width: number
}

@Component({
  selector: "wvtm-editor",
  moduleId: __moduleName || module.id,
  templateUrl: "editor.html",
  styleUrls: ["editor.css"],
  // providers: [EditorService, Renderer, TreeLayout, Simulator],
  // directives: [],
})
export class EditorComponent {
  taskModel: TaskModel = null;
  svgElm: HTMLElement;
  canvasDim: Dim = {
    height: null,
    width: null
  };

  constructor(private el: ElementRef,
    private logger: LoggerService) {
    this.logger.log("... WVTM STARTED ...");
    Observable.fromEvent(window, "resize")
      .debounceTime(500)
      .subscribe((event) => {
        this.resizeCanvas(event);
      }
    );
    // this.editorService.createNew();
    // this.taskModel = editorService.getTaskModel();
    // this.createTestModel();
  }

  resizeCanvas(event) {
    console.log(event);
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


    // this.setCanvasDimensions(dim.width, dim.height);
    // bind hover event to svg node
    // this.renderer.listen(this.svgElm, "mouseenter", (evt) => {
    //   console.log("mouseover" , evt);
    // });

    // this.renderer.listen(this.svgElm, "mouseleave", (evt) => {
    //   console.log("mouseleave", evt);
    // });
  }


  createTestModel() {
    this.taskModel.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Enable access", relation: ">>" });
    this.taskModel.addTask({ parentTaskId: "TASK_0", taskType: "Abstract", name: "Access", relation: "[>" });
    this.taskModel.addTask({ parentTaskId: "TASK_0", taskType: "INTERACTION", name: "Close access" });
    // this.taskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});

    this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert card", relation: ">>" });
    this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "System", name: "Require password", relation: ">>" });
    this.taskModel.addTask({ parentTaskId: "TASK_1", taskType: "INTERACTION", name: "Insert Password" });


    this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Withdraw cash", relation: "[]" });
    this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Deposit cash", relation: "[]" });
    this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "Abstract", name: "Get information" });
    this.taskModel.addTask({ parentTaskId: "TASK_2", taskType: "System", name: "Test" });

    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select withdraw", relation: ">>" });
    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Show possible amounts", relation: "[]>>" });
    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "User", name: "Decide amount", relation: "[]>>" });
    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Select account", relation: "[]>>" });
    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "System", name: "Provide cash", relation: "[]>>" });
    this.taskModel.addTask({ parentTaskId: "TASK_7", taskType: "INTERACTION", name: "Check cash" });
  }
};