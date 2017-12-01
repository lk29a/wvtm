import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'iterable'})
export class IterablePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return Object.keys(value);
  }
}
