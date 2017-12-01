import {Map, List} from "immutable";
import {IEditorState, EditorStateRecord} from "../editor.types";
import {EDITOR_MODES} from "../../shared"

export function createNew(): IEditorState {
  return new EditorStateRecord({}) as IEditorState;
}
  // getEditorMode() {
  //   return this.editorMode;
  // }

  // setEditorMode(mode: EDITOR_MODES) {
  //   this.editorMode = mode;
  // }

  // getTaskModel() {
  //   return this.taskModel;
  // }

  // selectTask(taskId: string) {
  //   this.selectedTaskId = taskId;
  //   this.userActionSource.next({ type: "task", action: "select", data: { taskId: taskId } });
  // }

  // getSelectedTask() {
  //   if (!this.selectedTaskId) return null;

  //   return this.getTaskNode(this.selectedTaskId);
  // }

  // unSelectTask() {
  //   this.selectedTaskId = this.selectedTaskNode = null;
  //   this.userActionSource.next({ type: "task", action: "unselect", data: null});
  // }

  // validateModel() {
  //   this.validataionInfo = this.taskModel.validateStructure();
  //   this.userActionSource.next({ type: "validation", action: "start", data: this.validataionInfo});
  //   console.log(this.validataionInfo);
  // }

  // startSimulation() {
  //   if (this.editorMode === EDITOR_MODES.DRAWING) {
  //     try {
  //       let ets = this.simulator.start(this.taskModel);
  //       this.userActionSource.next({ type: "simulation", action: "start", data: ets });
  //       this.editorMode = EDITOR_MODES.SIMULATION;
  //     } catch (ex) {
  //       this.userActionSource.next({ type: "simulation", action: "error", data: ex.message });
  //     }
  //   } else {
  //     this.userActionSource.next({ type: "simulation", action: "stop", data: null });
  //     this.editorMode = EDITOR_MODES.DRAWING;
  //   }
  // }

  // simPerformTask(taskId: string) {
  //   let ets = this.simulator.executeTask(this.getTaskNode(taskId));
  //   this.userActionSource.next({ type: "simulation", action: "update", data: ets });
  // }

  // getTaskNode(taskId: string) {
  //   this.selectedTaskNode = this.taskModel.searchTask(taskId);
  //   return this.selectedTaskNode;
  // }

  // addTask(type: string) {
  //   if (!this.selectedTaskId) {
  //     this.logger.error("Cannot add new task, select a task first");
  //     return;
  //   }
  //   let newTask = this.taskModel.addTask({ parentTaskId: this.selectedTaskId, taskType: type });
  //   this.logger.debug(this.taskModel);
  //   let updateInfo = {
  //     action: "add",
  //     type: "task",
  //     taskId: newTask.id
  //   };
  //   this.modelUpdatedSource.next(updateInfo);
  // }

  // removeTask(taskId: string) {
  //   if (!this.selectedTaskId) {
  //     this.logger.error("Cannot remove task, select a task first");
  //     return;
  //   }
  //   let result = this.taskModel.removeTask(taskId);
  //   if (result) {
  //     let updateInfo = {
  //       action: "update",
  //       type: "task",
  //       taskId: taskId
  //     };
  //     this.modelUpdatedSource.next(updateInfo);
  //   }
  //   return result;
  // }

  // // if taskId is not provided operate on selected task??
  // updateTask(type, value, taskId?) {

  //   taskId = taskId || this.selectedTaskId;
  //   if (!type || !taskId) {
  //     this.logger.error("Cannot update task - Invalid input");
  //     return;
  //   }

  //   let result = this.taskModel.updateTask(taskId, type, value);
  //   if (result) {
  //     let updateInfo = {
  //       action: "update",
  //       type: type,
  //       taskId: taskId
  //     };
  //     this.modelUpdatedSource.next(updateInfo);
  //   }

  //   return result;
  // }

  // getTaskTypes() {
  //   return TaskType;
  // }

  // getTaskRelations() {
  //   return TaskRelation;
  // }
