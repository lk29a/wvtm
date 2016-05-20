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
var STACK_FRAME_RE = new RegExp("\s*at ((\S+)\s)?\((.*)\)");
var LoggerService = (function () {
    function LoggerService() {
    }
    LoggerService.prototype.getCaller = function () {
        var err = new Error();
        // @lk Make sure this is cross-browser
        // Throw away the first three lines of trace and get fourth line
        // 1 - Error
        // 2 - this function
        // 3 - log function that called this
        var frame = err.stack.split('\n')[3];
        var callerInfo = STACK_FRAME_RE.exec(frame);
        callerInfo[3] = callerInfo[3].split('/').slice(-1).pop();
        // Find the first line in the stack that doesn't name this module.
        // for (var i = 0; i < frames.length; i++) {
        // if (frames[i].indexOf("LoggerService") === -1) {
        //   callerInfo = STACK_FRAME_RE.exec(frames[i]);
        //   break;
        // }
        // }
        if (callerInfo) {
            return {
                func: callerInfo[2] || 'aNoN',
                fileInfo: callerInfo[3] || null,
            };
        }
        return null;
    };
    LoggerService.prototype.log = function (message) {
        var caller = this.getCaller();
        var now = new Date();
        var nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("%s %cLOG" + "%c %s %s - %o", nowStr, "color:#009688;font-weight:bold", "", caller.func, caller.fileInfo, message);
    };
    LoggerService.prototype.info = function (message) {
        var caller = this.getCaller();
        var now = new Date();
        var nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("%s %cINFO" + "%c %s %s - %o", nowStr, "color:#2196F3;font-weight:bold", "", caller.func, caller.fileInfo, message);
    };
    LoggerService.prototype.error = function (message) {
        var caller = this.getCaller();
        var now = new Date();
        var nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("%s %cERROR" + "%c %s %s - %o", nowStr, "color:#F44336;font-weight:bold", "", caller.func, caller.fileInfo, message);
    };
    LoggerService.prototype.debug = function (message) {
        var caller = this.getCaller();
        var now = new Date();
        var nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("%s %cDEBUG" + "%c %s %s - %o", nowStr, "color:#424242;font-weight:bold", "", caller.func, caller.fileInfo, message);
    };
    LoggerService.prototype.trace = function (message) {
        var caller = this.getCaller();
        var now = new Date();
        var nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        console.log("%s %cINFO" + "%c %s %s - %o", nowStr, "color:#2196F3;font-weight:bold", "", caller.func, caller.fileInfo, message);
    };
    LoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map