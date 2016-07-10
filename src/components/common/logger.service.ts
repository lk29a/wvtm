import { Injectable } from "@angular/core";

declare var Error: any;

const STACK_FRAME_RE = new RegExp("\\s*at ((\\S+)\\s)?\\((.*)\\)");

@Injectable()
export class LoggerService {

  private getCaller() {
    let err = new Error();

    // @lk Make sure this is cross-browser
    // Throw away the first three lines of trace and get fourth line
    // 0 - Error
    // 1 - this function
    // 2 - log function that called this
    // 3 - code calling logger
    let frame = err.stack.split("\n")[3];
    let  callerInfo = STACK_FRAME_RE.exec(frame);
    callerInfo[3] = callerInfo[3].split("/").slice(-1).pop();

    // Find the first line in the stack that doesn't name this module.
    // for (var i = 0; i < frames.length; i++) {
      // if (frames[i].indexOf("LoggerService") === -1) {
      //   callerInfo = STACK_FRAME_RE.exec(frames[i]);
      //   break;
      // }
    // }

    if (callerInfo) {
      return {
        func: callerInfo[2] || "aNoN",
        fileInfo: callerInfo[3] || null,
      };
    }
    return null;
  }

  private getTimestamp() {
    let now = new Date();
    let dateStr = now.getFullYear() + "-" + (((now.getMonth() + 1) < 10) ? "0" : "") + (now.getMonth() + 1) + "-" + ((now.getDate() < 10) ? "0" : "") + now.getDate();
    let timeStr = ((now.getHours() < 10) ? "0" : "") + now.getHours() + ":" + ((now.getMinutes() < 10) ? "0" : "") + now.getMinutes() + ":" + ((now.getSeconds() < 10) ? "0" : "") + now.getSeconds();
    return dateStr + " " + timeStr;
  }

  log(...args: any[]): void {
    let caller = this.getCaller();
    // let a: any = ["%s | %cLOG: %s %s", this.getTimestamp(), "color:#2196F3;font-weight:bold", caller.func, caller.fileInfo];
    let a: any = ["%c%s LOG: %s", "color:#009688;font-weight:bold", this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.log.apply(console, a);
  }
  info(args: any): void {
    let caller = this.getCaller();
    let a: any = ["%c%s LOG: %s", "color:#2196F3;font-weight:bold", this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.info.apply(console, a);
  }
  error(...args: any[]): void {
    let caller = this.getCaller();
    let a: any = ["%c%s LOG: %s", "color:#F44336;font-weight:bold", this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.error.apply(console, a);
  }
  debug(...args: any[]) {
    let caller = this.getCaller();
    let a: any = ["%c%s LOG: %s", "color:#424242;font-weight:bold", this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.debug.apply(console, a);
  }
  trace(...args: any[]): void {
    let caller = this.getCaller();
    let a: any = ["%c%s LOG: %s", "color:#2196F3;font-weight:bold", this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.trace.apply(console, a);
  }
}
