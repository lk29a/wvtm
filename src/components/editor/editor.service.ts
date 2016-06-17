import {Injectable, Inject} from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {TaskModel} from '../taskmodel/taskmodel';
import {Task, TaskType, TaskRelation} from '../taskmodel/task';
import {Simulator} from '../simulator/simulator';
import {EDITOR_MODES} from '../common/constants'
import {LoggerService} from '../common/logger.service'

interface ModelUpdateInfo {
  action: string,
  type: string,
  taskId: string
}
interface UserAction {
  type: string,
  action: string,
  data: any
}

@Injectable()
export class EditorService {
  private taskModel: TaskModel;
  private selectedTaskId: string;
  private selectedTaskNode: Task;
  private editorMode: EDITOR_MODES;
  private validataionInfo: any;

  private modelUpdatedSource = new Subject<ModelUpdateInfo>();
  private taskSelectedSource = new Subject<string>();
  private userActionSource = new Subject<UserAction>();
  modelUpdated$ = this.modelUpdatedSource.asObservable();
  taskSelected$ = this.taskSelectedSource.asObservable();
  userAction$ = this.userActionSource.asObservable();

  constructor( @Inject(LoggerService) private logger: LoggerService,
    @Inject(Simulator) private simulator: Simulator) {
    // this.createNew();
  }

  createNew() {
    this.taskModel = new TaskModel();
    this.selectedTaskId = this.taskModel.root.id;
    this.editorMode = EDITOR_MODES.DRAWING;
    this.taskSelectedSource.next(this.selectedTaskId);
  }

  getEditorMode() {
    return this.editorMode;
  }

  setEditorMode(mode: EDITOR_MODES) {
    this.editorMode = mode;
  }

  getTaskModel() {
    return this.taskModel;
  }

  selectTask(taskId: string) {
    this.selectedTaskId = taskId;
    this.userActionSource.next({ type: 'task', action: 'select', data: { taskId: taskId } });
  }

  getSelectedTask() {
    if (!this.selectedTaskId)
      return null;

    return this.getTaskNode(this.selectedTaskId);
  }

  unSelectTask() {
    this.selectedTaskId = this.selectedTaskNode = null;
    this.userActionSource.next({ type: 'task', action: 'unselect', data: null});
  }

  validateModel() {
    this.validataionInfo = this.taskModel.validateStructure();
    console.log(this.validataionInfo);
  }

  startSimulation() {
    if (this.editorMode === EDITOR_MODES.DRAWING) {
      let ets = this.simulator.start(this.taskModel);
      this.userActionSource.next({ type: 'simulation', action: 'start', data: ets });
      this.editorMode = EDITOR_MODES.SIMULATION;
    } else {
      this.userActionSource.next({ type: 'simulation', action: 'stop', data: null });
      this.editorMode = EDITOR_MODES.DRAWING;
    }
  }

  simPerformTask(taskId: string) {
    let ets = this.simulator.executeTask(this.getTaskNode(taskId));
    this.userActionSource.next({ type: 'simulation', action: 'update', data: ets });
  }

  getTaskNode(taskId: string) {
    this.selectedTaskNode = this.taskModel.searchTask(taskId);
    return this.selectedTaskNode;
  }

  addTask(type: string) {
    if (!this.selectedTaskId) {
      this.logger.error('Cannot add new task, select a task first');
      return;
    }
    var newTaskId = this.taskModel.addTask({ parentTaskId: this.selectedTaskId, taskType: type });
    this.logger.debug(this.taskModel);
    var updateInfo = {
      action: 'add',
      type: 'task',
      taskId: newTaskId
    };
    this.modelUpdatedSource.next(updateInfo);
  }

  // if taskId is not provided operate on selected task??
  updateTask(type, value, taskId?) {

    taskId = taskId || this.selectedTaskId;
    if (!type || !taskId) {
      this.logger.error('Cannot update task - Invalid input');
      return;
    }

    var result = this.taskModel.updateTask(taskId, type, value);
    if(result) {
      var updateInfo = {
        action: 'update',
        type: type,
        taskId: taskId
      };
      this.modelUpdatedSource.next(updateInfo);
    }

    return result;
  }

  getTaskTypes() {
    return TaskType;
  }

  getTaskRelations() {
    return TaskRelation;
  }

}