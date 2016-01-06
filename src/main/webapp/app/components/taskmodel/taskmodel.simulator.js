/**
 * Proecdure:
 * 1. Find the leftmost path from root to a leaf, 
 * 2. Add all the tasks to stack
 * 3. Pop a task and add it to ETS  ??(this is the leaf, should be enabled)??
 * 4. Depending on relation next task will be also be enabled(|||, [], |=|, etc) 
 * 5. repeat step 3-4
 */

(function() {
  'use strict';

  angular.module('WVTM.TaskModel')
    .factory('TaskModelSimulator', TaskModelSimulator);

  TaskModelSimulator.$inject = ['TaskRelation'];

  function TaskModelSimulator(TaskRelation) {

    //Enabled task sets
    var ets = [],
      tasksExecuted = [];

    var api = {
      start: start
    };

    return api;

    /******************************/


    /**
     * Will simulate the given model
     * setup for simulator
     * 1. Validate model structure
     * 2. Remove event handlers (hover, click and others if exists)
     * 3. ...
     *
     * 
     * @param  {[type]} taskModel [description]
     * @return {[type]}           [description]
     */
    function start(taskModel) {
      //reset prev
      ets.length = 0;
      ets = [];


      //first validate structure of the model
      // var valid = taskModel.validateStructure();
      // if(!valid) {
      // 	console.log('Model has errors please fix them first.');
      // 	return;
      // }
      
      // start with the root
      enableTask(taskModel.root);

      // for (var i = 0; i < ets.length; i++) {
      //   console.log(ets[i].data);
      // }

      return ets;
    }


    /**
     * Enabling a task requires:
     * 1. Directly enable if its leaf else,
     * 2. Check entire subtree rooted at current task then,
     * 3. Check relationship with right sibling, enable right sibling if required
     * 
     * @param  {[type]} aTask [description]
     */
    function enableTask(curTask) {

      //find left modt child of this task
      while (curTask.children.length) {
        curTask = curTask.children[0];
      }

      //for each task check its relation
      while (curTask.parent) {
        if (curTask.isLeaf()) {
          ets.push(curTask);
        }

        //if relation is 
        var rSibling = checkRelation(curTask);
        if (rSibling !== null) {
          enableTask(rSibling);
        }

        curTask = curTask.parent;
      }
    }

    /**
     * Checks for the relation with its right sibling(if any). 
     * Depending on the relation returns right sibling or null.
     * 
     * @param  {[type]} aTask [description]
     */
    function checkRelation(aTask) {
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

    /**
     * We need to check both right and left sibling for relations.
     * next/prev task wil be enabled or disabled based on these relations
     * Eg. if left sibling had choice relation then left sibling(it must be enabled) should be disabled.
     *
     * //@lk IF ALL CHILD TASKS ARE PERFORMED THEN PARENT TASK IS PERFORMED AS WELL??//
     * 
     * @return {[type]} [description]
     */
    function performTask(aTask) {
    	
    }

  }
})();
