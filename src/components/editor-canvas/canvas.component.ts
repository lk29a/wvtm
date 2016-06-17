import {Component, ElementRef, AfterViewInit} from '@angular/core';
// import {Simulator} from '../simulator/simulator';
import {EditorService} from '../editor/editor.service';
import {Renderer} from '../renderer/renderer.service';
import {TreeLayout} from '../renderer/treelayout';
import {LoggerService} from '../common/logger.service'
import {EDITOR_MODES} from '../common/constants'


@Component({
  selector: 'editor-canvas',
  templateUrl: 'components/editor-canvas/canvas.html',
  styleUrls: ['components/editor-canvas/canvas.css'],
  // providers: [Simulator],
  host: {
    '(click)': 'onClick($event)',
    '(dblclick)': 'onDbClick($event)'
    // '(mouseenter)': 'onMouseEnter($event)',
    // '(mouseleave)': 'onMouseLeave($event)'    
  }
})
export class EditorCanvas implements AfterViewInit {
  // renderer: Renderer;
  // editorService: EditorService;
  svgElm: HTMLElement;

  canvasDim: any;

  constructor(private el: ElementRef,
    private editorService: EditorService,
    private renderer: Renderer,
    // private simulator: Simulator,
    private logger: LoggerService) {

    this.editorService.modelUpdated$.subscribe(
      updateInfo => {
        this.modelUpdated(updateInfo);
      }
    );

    this.editorService.userAction$.subscribe(
      userAction => {
        if (userAction.type == 'simulation')
          this.simulationAction(userAction.action, userAction.data);
      }
    );
  }

  modelUpdated(updateInfo) {
    console.log(this.editorService.getTaskModel());
    this.logger.debug("model updated");
    // if(updateInfo.action) {
    this.renderer.update(this.editorService.getTaskModel(), updateInfo.type, updateInfo.taskId)
    // }
  }

  simulationAction(action: string, data: any) {
    switch (action) {
      case "start":
        this.startSimulationMode(data);
        break;

      case "update":
        this.updateSimulation(data);
        break;

      case "stop":
        this.stopSimulationMode(data);
        break;

      default:
        break;
    }
  }

  startSimulationMode(data: any) {
    this.renderer.startSimulation();
    this.updateSimulation(data);
  }

  updateSimulation(data: any) {
    console.log(data);
    this.renderer.updateSimulation(data);
  }
  
  stopSimulationMode(data: any) {
    this.renderer.stopSimulation();
  }

  ngAfterViewInit() {
    let dim = {
      height: this.el.nativeElement.firstChild.clientHeight,
      width: this.el.nativeElement.firstChild.clientWidth,
    };
    this.svgElm = this.el.nativeElement.querySelector('svg');
    this.renderer.init(this.svgElm, dim);

    this.renderer.render(this.editorService.getTaskModel());
  }

  getTaskElementById(taskId: string) {
    if (!taskId) {
      throw new Error("'taskId' must be valid.");
    }
    return this.svgElm.querySelector('#' + taskId);
  }

  onClick(event) {
    if (this.editorService.getEditorMode() == EDITOR_MODES.SIMULATION)
      return;    
    
    //check if any task was clicked(icon or text)
    if (event.target.classList.contains('task-node')) {
      var taskId = event.target.parentNode.id;
      this.editorService.selectTask(taskId);
      this.renderer.selectTask(taskId);
    }
  }

  onDbClick(event) {
    if (this.editorService.getEditorMode() == EDITOR_MODES.SIMULATION)
      if (event.target.classList.contains('task-node'))
        this.editorService.simPerformTask(event.target.parentNode.id);
  }

  onMouseEnter(event) {
    console.log(event);
    if (this.editorService.getEditorMode() == EDITOR_MODES.SIMULATION) {
      return;
    }
    if (event.target.classList.contains('task-node')) {
      this.renderer.highlightTask(event.target.parentNode.id);
      this.logger.debug('highlight task node');
    }

  }

  onMouseLeave(event) {
    console.log(event);
    if (this.editorService.getEditorMode() == EDITOR_MODES.SIMULATION) {
      return;
    }
    if (event.target.classList.contains('task-node')) {
      this.renderer.highlightTask(event.target.parentNode.id);
      this.logger.debug('un-highlight task node');
    }

  }
};