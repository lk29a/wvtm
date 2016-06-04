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
var editor_service_1 = require('../editor/editor.service');
var logger_service_1 = require('../common/logger.service');
var EditorMenu = (function () {
    function EditorMenu(editorService, logger) {
        this.editorService = editorService;
        this.logger = logger;
    }
    EditorMenu.prototype.newProject = function () {
    };
    EditorMenu.prototype.saveProject = function () {
    };
    EditorMenu.prototype.validate = function () {
        this.editorService.validateModel();
    };
    EditorMenu.prototype.simulate = function () {
        this.editorService.simulateModel();
    };
    EditorMenu.prototype.zoom = function (action) {
        this.logger.debug("zoom - " + action);
    };
    EditorMenu.prototype.onClick = function (event) {
        var elm = event.target;
        if (elm.classList.contains('menu-btn') || elm.parentNode.classList.contains('menu-btn')) {
            var action = elm.getAttribute('action') || elm.parentNode.getAttribute('action');
            switch (action) {
                case 'new':
                    this.newProject();
                    break;
                case 'save':
                    this.saveProject();
                    break;
                case 'validate':
                    this.validate();
                    break;
                case 'simulate':
                    this.simulate();
                    break;
                case 'zoom-fit':
                    this.zoom("fit");
                    break;
                case 'zoom-minus':
                    this.zoom("minus");
                    break;
                case 'zoom-plus':
                    this.zoom("plus");
                    break;
            }
        }
    };
    EditorMenu = __decorate([
        core_1.Component({
            selector: 'editor-menu',
            templateUrl: 'src/components/editor-menu/menu.html',
            styleUrls: ['src/components/editor-menu/menu.css'],
            host: {
                '(click)': 'onClick($event)'
            }
        }), 
        __metadata('design:paramtypes', [editor_service_1.EditorService, logger_service_1.LoggerService])
    ], EditorMenu);
    return EditorMenu;
}());
exports.EditorMenu = EditorMenu;
;
//# sourceMappingURL=menu.component.js.map