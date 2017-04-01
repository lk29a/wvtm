import { Injectable } from '@angular/core';

declare var Error: any;

const enum LOG_LEVEL {
  ALL,
  DEBUG,
  ERROR,
  INFO,
  WARN
}

// const STACK_FRAME_RE = new RegExp("\\s*at ((\\S+)\\s)?\\((.*)\\)");
// using negative look ahead
const STACK_FRAME_RE = new RegExp('\\s*at ((?:(?!\\().)*)?\\((.*)\\)');
// const STACK_FRAME_RE = new RegExp("\\s*at ([^\()]*)?\\((.*)\\)");

@Injectable()
export class LoggerService {

  private loglevel: LOG_LEVEL;

  constructor() {
    this.loglevel = LOG_LEVEL.ERROR;
  }

  private getCaller() {
    // @lk Make sure this is cross-browser
    const err = new Error();
    // Throw away the first three lines of trace and get fourth line
    // 0 - Error
    // 1 - this function
    // 2 - log function that called this
    // 3 - code calling logger
    const frame = err.stack.split('\n')[3];
    const callerInfo = STACK_FRAME_RE.exec(frame);
    callerInfo[2] = callerInfo[2].split('/').slice(-1).pop();

    // Find the first line in the stack that doesn't name this module.
    // for (var i = 0; i < frames.length; i++) {
    // if (frames[i].indexOf("LoggerService") === -1) {
    //   callerInfo = STACK_FRAME_RE.exec(frames[i]);
    //   break;
    // }
    // }

    if (callerInfo) {
      return {
        func: callerInfo[1] || 'aNoN',
        fileInfo: callerInfo[2] || null,
      };
    }
    return null;
  }

  private getTimestamp() {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + (((now.getMonth() + 1) < 10) ? '0' : '') + (now.getMonth() + 1) + '-' + ((now.getDate() < 10) ? '0' : '') + now.getDate();
    const timeStr = ((now.getHours() < 10) ? '0' : '') + now.getHours() + ':' + ((now.getMinutes() < 10) ? '0' : '') + now.getMinutes() + ':' + ((now.getSeconds() < 10) ? '0' : '') + now.getSeconds();
    return dateStr + ' ' + timeStr;
  }

  log(...args: any[]): void {
    const caller = this.getCaller();
    // let a: any = ["%s | %cLOG: %s %s", this.getTimestamp(), "color:#2196F3;font-weight:bold", caller.func, caller.fileInfo];
    const a: any = ['%c%s LOG: %s', 'color:#009688;font-weight:bold', this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.log.apply(console, a);
  }
  info(...args: any[]): void {
    if (this.loglevel <= LOG_LEVEL.INFO) {
      const caller = this.getCaller();
      const a: any = ['%c%s INFO: %s', 'color:#2196F3;font-weight:bold', this.getTimestamp(), caller.fileInfo];
      a.push(...args);
      console.info.apply(console, a);
    }
  }
  error(...args: any[]): void {
    if (this.loglevel <= LOG_LEVEL.ERROR) {
      const caller = this.getCaller();
      const a: any = ['%c%s ERROR: %s', 'color:#F44336;font-weight:bold', this.getTimestamp(), caller.fileInfo];
      a.push(...args);
      console.error.apply(console, a);
    }
  }
  debug(...args: any[]) {
    if (this.loglevel <= LOG_LEVEL.DEBUG) {
      const caller = this.getCaller();
      const a: any = ['%c%s DEBUG: %s %s', 'color:#BDBDBD;font-weight:bold', this.getTimestamp(), caller.fileInfo];
      a.push(...args);
      console.debug.apply(console, a);
    }
  }
  trace(...args: any[]): void {
    const caller = this.getCaller();
    const a: any = ['%c%s TRACE: %s', 'color:#2196F3;font-weight:bold', this.getTimestamp(), caller.fileInfo];
    a.push(...args);
    console.trace.apply(console, a);
  }
}
