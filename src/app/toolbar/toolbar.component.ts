import {Component, OnInit, OnDestroy} from "@angular/core";
import {NgRedux, select} from "ng2-redux";
import {List, Map } from "immutable";
import {
  LoggerService,
  TaskType,
  TaskRelation
} from "../shared";
import { IWVTMState } from "../store";
import {TaskModelActions} from "../taskmodel"

@Component({
  selector: "wvtm-toolbar",
  // moduleId: module.id,
  templateUrl: "toolbar.html",
  styleUrls: ["toolbar.css"]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  taskTypes = Object.keys(TaskType);
  relations = Object.keys(TaskRelation);
  taskRelations = null;
  rxSubs: any = {};

  constructor(private tmActions: TaskModelActions,
    private logger: LoggerService,
    private redux: NgRedux<IWVTMState>) {

    this.logger.debug("Toolbar initialized");
    this.taskRelations = TaskRelation;
  }

  ngOnInit() {
    this.rxSubs.library = this.redux.select((state) => {
      let lib = state.taskModel.modules;
      return lib;
    }).subscribe((data) => {
      // console.log(data);
    });
  }


  addTask(type: string) {
    this.tmActions.addTask(type);
  }

  addRelation(rel: string) {
    this.tmActions.updateTask("relation", rel);
    // this.wvtm.toolAction(type);
  }

  // onClick(event) {
  //   let elm = event.target;
  //   if (elm.classList.contains("toolbar-btn") || elm.parentNode.classList.contains("toolbar-btn")) {
  //     let action: string = elm.getAttribute("action") || elm.parentNode.getAttribute("action");
  //     let type: string = elm.getAttribute(action) || elm.parentNode.getAttribute(action);
  //     if (action.toLowerCase() === "task") {
  //       this.editorService.addTask(type);
  //     }
  //     if (action.toLowerCase() === "relation") {
  //       this.editorService.updateTask("relation", type);
  //     }
  //   }
  // }

  ngOnDestroy() {

  }

}

