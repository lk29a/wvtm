/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { TaskTreeComponent } from './task-tree.component';

describe('Component: TaskTree', () => {
  it('should create an instance', () => {
    let component = new TaskTreeComponent();
    expect(component).toBeTruthy();
  });
});
