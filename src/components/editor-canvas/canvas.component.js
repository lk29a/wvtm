"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var simulator_1 = require('../simulator/simulator');
var editor_service_1 = require('../editor/editor.service');
var renderer_service_1 = require('../renderer/renderer.service');
var logger_service_1 = require('../common/logger.service');
var constants_1 = require('../common/constants');
var EditorCanvas = (function () {
    function EditorCanvas(el, editorService, renderer, simulator, logger) {
        var _this = this;
        this.el = el;
        this.editorService = editorService;
        this.renderer = renderer;
        this.simulator = simulator;
        this.logger = logger;
        this.editorService.modelUpdated$.subscribe(function (updateInfo) {
            _this.modelUpdated(updateInfo);
        });
        this.editorService.userAction$.subscribe(function (action) {
            console.log(action);
            var parts = action.split(':');
            if (parts[0] == 'simulation') {
                if (parts[1] == 'start') {
                    _this.startSimulation();
                }
                else {
                }
            }
        });
    }
    EditorCanvas.prototype.modelUpdated = function (updateInfo) {
        console.log(this.editorService.getTaskModel());
        this.logger.debug("model updated");
        // if(updateInfo.action) {
        this.renderer.update(this.editorService.getTaskModel(), updateInfo.type, updateInfo.taskId);
        // }
    };
    EditorCanvas.prototype.startSimulation = function () {
        var ets = this.simulator.start(this.editorService.getTaskModel());
        this.logger.debug('enabled tasks set', ets);
    };
    EditorCanvas.prototype.ngAfterViewInit = function () {
        var dim = {
            height: this.el.nativeElement.firstChild.clientHeight,
            width: this.el.nativeElement.firstChild.clientWidth,
        };
        this.svgElm = this.el.nativeElement.querySelector('svg');
        this.renderer.init(this.svgElm, dim);
        this.renderer.render(this.editorService.getTaskModel());
    };
    EditorCanvas.prototype.getTaskElementById = function (taskId) {
        if (!taskId) {
            throw new Error("'taskId' must be valid.");
        }
        return this.svgElm.querySelector('#' + taskId);
    };
    EditorCanvas.prototype.onClick = function (event) {
        if (this.editorService.getEditorMode() == constants_1.EDITOR_MODES.SIMULATION) {
            return;
        }
        //check if any task was clicked(icon or text)
        if (event.target.classList.contains('task-node')) {
            var taskId = event.target.parentNode.id;
            this.editorService.selectTask(taskId);
            this.renderer.selectTask(taskId);
        }
    };
    EditorCanvas.prototype.onMouseEnter = function (event) {
        console.log(event);
        if (this.editorService.getEditorMode() == constants_1.EDITOR_MODES.SIMULATION) {
            return;
        }
        if (event.target.classList.contains('task-node')) {
            this.renderer.highlightTask(event.target.parentNode.id);
            this.logger.debug('highlight task node');
        }
    };
    EditorCanvas.prototype.onMouseLeave = function (event) {
        console.log(event);
        if (this.editorService.getEditorMode() == constants_1.EDITOR_MODES.SIMULATION) {
            return;
        }
        if (event.target.classList.contains('task-node')) {
            this.renderer.highlightTask(event.target.parentNode.id);
            this.logger.debug('un-highlight task node');
        }
    };
    EditorCanvas = __decorate([
        core_1.Component({
            selector: 'editor-canvas',
            templateUrl: 'src/components/editor-canvas/canvas.html',
            styleUrls: ['src/components/editor-canvas/canvas.css'],
            providers: [simulator_1.Simulator],
            host: {
                '(click)': 'onClick($event)',
            }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, editor_service_1.EditorService, renderer_service_1.Renderer, simulator_1.Simulator, logger_service_1.LoggerService])
    ], EditorCanvas);
    return EditorCanvas;
}());
exports.EditorCanvas = EditorCanvas;
;
//# sourceMappingURL=canvas.component.js.map