import {Component, ElementRef, AfterViewInit} from '@angular/core';
import {Simulator} from '../simulator/simulator';
import {EditorService} from '../editor/editor.service';
import {Renderer} from '../renderer/renderer.service';
import {TreeLayout} from '../renderer/treelayout';
import {LoggerService} from '../common/logger.service'
import {EDITOR_MODES} from '../common/constants'


@Component({
  selector: 'editor-canvas',
  templateUrl: 'src/components/editor-canvas/canvas.html',
	styleUrls: ['src/components/editor-canvas/canvas.css'],
  providers: [Simulator],
  host: {
    '(click)': 'onClick($event)',
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
              private simulator: Simulator,
              private logger: LoggerService) {

    this.editorService.modelUpdated$.subscribe(
      updateInfo => {
        this.modelUpdated(updateInfo);
      }
    );

    this.editorService.userAction$.subscribe(
      action => {
        let parts = action.split(':');
        if(parts[0] == 'simulation') {
          if (action == 'start') {
            this.startSimulation();
          } else {
          }
        }
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

  startSimulation() {
    let ets = this.simulator.start(this.editorService.getTaskModel());
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
    if(!taskId) {
      throw new Error("'taskId' must be valid.");
    }
    return this.svgElm.querySelector('#' + taskId);
  }

  onClick(event) {
    if(this.editorService.getEditorMode() == EDITOR_MODES.SIMULATION) {

      return;
    }
    //check if any task was clicked(icon or text)
    if(event.target.classList.contains('task-node')) {
      var taskId = event.target.parentNode.id;
      this.editorService.selectTask(taskId);
      
      this.renderer.selectTask(taskId);
    }
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