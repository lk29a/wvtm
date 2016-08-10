import {Component} from "@angular/core";
import {
  WVTMService,
  LoggerService,
  TaskType,
  TaskRelation
} from "../shared/index";

enum InfoTypes {
  None = 0,
  Task = 1,
  Validation = 2,
  Simulation = 3
}

@Component({
  selector: "wvtm-infobar",
  moduleId: module.id,
  templateUrl: "infobar.html",
  styleUrls: ["infobar.css"],
})
export class InfobarComponent {
  currentTask: any;
  infobar: any;
  taskTypes;
  taskRelations;
  relations;
  types;
  infoType;
  vInfo: any = {};
  simData: any = {};

  constructor(private logger: LoggerService,
              private wvtm: WVTMService) {

    this.logger.debug("Infobar initialized");

    this.taskTypes = TaskType;
    this.types = Object.keys(this.taskTypes);
    this.taskRelations = TaskRelation;
    this.relations = Object.keys(this.taskRelations);
    this.infobar = {
      type: InfoTypes,
      title: "Information",
      error: false,
      errMsg: ""
    };
    this.infoType = InfoTypes;



    // this.wvtm.userAction$.subscribe(
    //   userAction => {
    //     let reset = false;
    //     switch (userAction.type) {
    //       case "task":
    //         if (userAction.action === "select")
    //           this.showTaskInfo(userAction.data.taskId);
    //         else
    //           reset = true;
    //         break;

    //       case "simulation":
    //         if (userAction.action === "start")
    //           this.showSimulationInfo(userAction.data);
    //         else if (userAction.action === "error") {
    //           this.infobar.error = true;
    //           this.infobar.errMsg = userAction.data;
    //         } else if (userAction.action === "stop")
    //           reset = true;
    //         break;

    //       case "validation":
    //         if (userAction.action === "start")
    //           this.showValidationInfo(userAction.data);
    //         else if (userAction.action === "stop")
    //           reset = true;
    //         break;

    //       default:
    //         reset = true;
    //         break;
    //     }

    //     if (reset) {
    //       this.resetInfoBar();
    //     }
    //   }
    // );
  }

  showTaskInfo(taskId) {
    this.infobar.type = InfoTypes.Task;
    
    // this.currentTask.data = this.wvtm.getTaskData(taskId);
    // let task = this.wvtm.getSelectedTask();

    // this.currentTask = {
    //   id: task.id,
    //   type: task.type,
    //   relation: task.relation,
    //   name: task.name,
    //   description: task.description,
    //   isRoot: task.parent ? false : true,
    //   isLast: task.getRightSibling() ? false : true,
    // };
    // this.infobar.title = "Task: " + this.currentTask.name;
  }

  resetInfoBar() {
    this.infobar.type = null;
  }

  simulationAction(action: string, data: any) {
    switch (action) {
      case "start":
        this.showSimulationInfo(data);
        break;

      case "update":
        this.updateSimulationInfo(data);
        break;

      case "stop":
        this.resetInfoBar();
        break;
    }
  }

  showSimulationInfo(data) {
    this.infobar.type = InfoTypes.Simulation;
    this.infobar.title = "Simulation";
    this.simData.ets = data;
  }

  updateSimulationInfo(data) {
    this.simData.ets = data;
  }

  showValidationInfo(data) {
    this.infobar.type = InfoTypes.Validation;
    this.infobar.title = "Validation Information";
    this.vInfo = data;
  }

  deleteTask() {
    // this.wvtm.removeTask(this.currentTask.id);
  }

  updateTask(type, value) {
    // if (type && value) {
    //   if (this.wvtm.updateTask(type, value, this.currentTask.id)) {
    //     this.currentTask[type] = value;
    //   }
    // }
  }

  getRelationSym(relation) {
    return this.taskRelations[relation];
  }

};