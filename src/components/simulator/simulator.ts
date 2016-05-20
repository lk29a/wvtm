import {Injectable, Inject} from '@angular/core';
import { Task } from '../../lib/taskmodel/task';
import { TaskModel, TaskType, TaskRelation } from '../../lib/taskmodel/taskmodel';

@Injectable()
export class Simulator {
  ets: Array < Task > ;
  tasksExecuted: Array < Task > ;

  start(model: TaskModel) {
    this.ets = [];
    this.tasksExecuted = [];

    // first validate structure of the model
    if (!model.validateStructure()) {
      throw new Error('Model has errors please fix them first.');
    }

    var lpath = [],
      node = model.root;

    //push leftmost path to a stack
    lpath.push(node);
    while (node.children.length) {
      node = node.children[0];
      lpath.push(node);
    }

  }

  /**
   * Checks for the relation with its right sibling(if any). 
   * Depending on the relation returns right sibling or null.
   * 
   * @param  {[type]} aTask [description]
   */
  checkRelation(aTask) {
    //can add more relations to check here
    if (
      aTask.relation === TaskRelation.UNRESTRICTED ||
      aTask.relation === TaskRelation.CHOICE ||
      aTask.relation === TaskRelation.RANDOM
    ) {
      return aTask.getRightSibling();
    }

    return null;
  }

}
