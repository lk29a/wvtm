import {Component} from "@angular/core";

import {EditorService} from "./shared/index";
import {TaskModel} from "../taskmodel/index";
import {Renderer} from "./renderer/renderer.service";
import {TreeLayout} from "./renderer/treelayout";
import {Simulator} from "../simulator/simulator";
import { LoggerService } from "../shared/index";

declare var __moduleName: string;

@Component({
  selector: "wvtm-editor",
  moduleId: __moduleName || module.id,
  templateUrl: "editor.html",
  styleUrls: ["editor.css"],
  providers: [EditorService, Renderer, TreeLayout, Simulator],
  // directives: [],
})
export class EditorComponent {
  taskModel: TaskModel = null;
  constructor(private editorService: EditorService, private logger: LoggerService) {
    this.logger.log("... WVTM STARTED ...");
    this.editorService.createNew();
    this.taskModel = editorService.getTaskModel();
    this.createTestModel();
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