/**
 * Proecdure:
 * 1. Find the leftmost path from root to a leaf, 
 * 2. Add all the tasks to stack
 * 3. Pop a task and add it to ETS  ??(this is the leaf, should be enabled)??
 * 4. Depending on relation next task will be also be enabled(|||, [], |=|, etc) 
 * 5. repeat step 3-4
 */

(function(){
	'use strict';

	angular.module('WVTM.renderer')
	.factory('TaskModelSimulator', TaskModelSimulator);

	TaskModelSimulator.$inject = ['TaskRelation'];
	function TaskModelSimulator(TaskRelation){

		//Enabled task sets
		var ets = [],
		tasksExecuted = [];

		var api = {
			simulate: simulate
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
		function simulate(taskModel) {
			//reset prev
			ets.length = 0;
			ets = [];


			//first validate structure of the model
			// var valid = taskModel.validateStructure();
			// if(!valid) {
			// 	console.log('Model has errors please fix them first.');
			// 	return;
			// }

			var lpath = [],
					node = taskModel.root;

			//push leftmost path to a stack
			lpath.push(node);
			while(node.children.length) {
				node = node.children[0];
				lpath.push(node);
			}

			//this is the leaf. should be enabled.
			// var curTask = lpath.pop();
			// while(curTask) {
			// 	console.log(curTask.data);
			// 	ets.push(curTask);
			// 	curTask = checkRelation(curTask);
			// }

			//@lk proper error handling if needed
			while(lpath.length) {
				var curTask = lpath.pop();
				// console.log(aTask.data);
				while(curTask) {
					console.log(curTask.data);
					ets.push(curTask);
					curTask = checkRelation(curTask);
				}
			}
			
			console.log(ets);
			for (var i = 0; i < ets.length; i++) {
				console.log(ets[i].data);
			}
		}


		/**
		 * Enabling a task requires:
		 * 1. Checking relationship
		 * 2. Checking entire subtree rooted at current task
		 * 
		 * @param  {[type]} aTask [description]
		 */
		function enableTask(curTask) {
			var lpath = [];
			//push leftmost path(till leaf) to a stack
			lpath.push(curTask);
			while(curTask.children.length) {
				curTask = curTask.children[0];
				lpath.push(curTask);
			}

			//for each task check its relation
			while(lpath.length) {
				var aTask = lpath.pop();
				// console.log(aTask.data);
				while(aTask) {
					console.log(aTask.data);
					ets.push(aTask);
					aTask = checkRelation(aTask);
				}
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
			if(
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