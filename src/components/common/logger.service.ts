import { Injectable } from '@angular/core';

declare var Error: any;

const STACK_FRAME_RE = new RegExp("\s*at ((\S+)\s)?\((.*)\)");

@Injectable()
export class LoggerService {

  private getCaller() {
    var err = new Error();

    // @lk Make sure this is cross-browser
    // Throw away the first three lines of trace and get fourth line
    // 1 - Error
    // 2 - this function
    // 3 - log function that called this
    var frame = err.stack.split('\n')[3];
    var  callerInfo = STACK_FRAME_RE.exec(frame);
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
  }

  log(message: any): void {
    let caller = this.getCaller();
    let now = new Date();
    let nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log("%s %cLOG" + "%c %s %s - %o", nowStr, "color:#009688;font-weight:bold", "", caller.func, caller.fileInfo, message);
  }
  info(message: any): void {
    let caller = this.getCaller();
    let now = new Date();
    let nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log("%s %cINFO" + "%c %s %s - %o", nowStr, "color:#2196F3;font-weight:bold", "", caller.func, caller.fileInfo, message);
  }
  error(message: any): void {
    let caller = this.getCaller();
    let now = new Date();
    let nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log("%s %cERROR" + "%c %s %s - %o", nowStr, "color:#F44336;font-weight:bold", "", caller.func, caller.fileInfo, message);
  }
  debug(message: any) {
    let caller = this.getCaller();
    let now = new Date();
    let nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log("%s %cDEBUG" + "%c %s %s - %o", nowStr, "color:#424242;font-weight:bold", "", caller.func, caller.fileInfo, message);
  }
  trace(message: any): void {
    let caller = this.getCaller();
    let now = new Date();
    let nowStr = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log("%s %cINFO" + "%c %s %s - %o", nowStr, "color:#2196F3;font-weight:bold", "", caller.func, caller.fileInfo, message);
  }
}
