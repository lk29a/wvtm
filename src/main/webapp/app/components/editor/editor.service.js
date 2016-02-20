(function() {
  'use strict';

  angular.module('WVTM.editor')
    .factory('EditorService', EditorService);

  EditorService.$inject = ['$rootScope', 'TaskModel', 'TaskModelSimulator', 'Renderer'];

  function EditorService($rootScope, TaskModel, TaskModelSimulator, Renderer) {
    var currentTaskModel = null;
    var library = {};

    var editorState = {
      mode: 'editor',
      selectedTaskId: '',
      selectedTaskNode: null,
      actions: {
        prev: [],
        next: []
      },
      validationObj: {}
    };

    var api = {
      init: init,
      highlightTask: highlightTask,
      selectTask: selectTask,
      deSelectTask: deSelectTask,
      addTask: addTask,
      addUpdateTaskRelation: addUpdateTaskRelation,
      updateTaskType: updateTaskType,
      getTaskModel: getTaskModel,
      getSelectedTask: getSelectedTask,
      getEditorMode: getEditorMode,
      validateStructure: validateStructure,
      getValidationObj: getValidationObj,
      simulate: simulateModel,
      simPerformTask: simPerformTask,
      addToLibrary: addToLibrary,
      test123: test123
    };

    return api;

    /***********************************/

    function init() {
      if(!currentTaskModel) {
        currentTaskModel = new TaskModel();
      }
      test123();
      Renderer.init('editor-canvas');
      render();

    }

    function selectTask(taskId) {
      if (editorState.mode === 'simulation') {
        angular.noop();
      } else {
        editorState.selectedTaskId = taskId;
        $rootScope.$emit('wvtm:info:task');
        Renderer.selectTask(taskId);
      }
    }

    function getSelectedTask() {
      if(currentTaskModel) {
        editorState.selectedTaskNode = getTaskById(editorState.selectedTaskId);
        return editorState.selectedTaskNode;
      } else {
        return null;
      }
    }

    function getTaskById(taskId) {
      return currentTaskModel.searchNode(taskId);
    }

    function deSelectTask() {
      Renderer.deSelectTask();
      editorState.selectedTaskId = null;
      $rootScope.$emit('wvtm:info:task');
    }

    function highlightTask(taskId) {
      Renderer.highlightTask(taskId);
    }

    function render() {
      Renderer.render(currentTaskModel);
    }

    function getTaskModel() {
      return currentTaskModel;
    }

    function getEditorMode() {
      return editorState.mode;
    }

    function addTask(type) {
      if (!editorState.selectedTaskId) {
        throw new Error('Cannot add new task, select a task first');
      }
      var options = {
        parentTaskId: editorState.selectedTaskId,
        taskType: type
      };

      currentTaskModel.addTask(options);
      Renderer.update('task', editorState.selectedTaskId, currentTaskModel);

      // $rootScope.$emit('wvtm:model:update');
    }

    function addUpdateTaskRelation(relation) {
      if (!editorState.selectedTaskId) {
        throw new Error('Cannot add/update relation, select a task first');
      }
      currentTaskModel.addUpdateRelation(editorState.selectedTaskId, relation);

      Renderer.update('relation', editorState.selectedTaskId, currentTaskModel);
      // $rootScope.$emit('wvtm:model:update');
    }

    function updateTaskType(taskType) {
      if(!editorState.selectedTaskId) {
        throw new Error('No task selected');
      }
      currentTaskModel.changeTaskType(editorState.selectedTaskId, taskType);
      Renderer.update('task', editorState.selectedTaskId, currentTaskModel);
    }

    //is it a good idea to call this from info component or 
    //save the validation result and use events to get this info to info component??    
    function validateStructure() {
      console.log('validating model');
      deSelectTask();
      editorState.validationObj = currentTaskModel.validateStructure();
      $rootScope.$emit("wvtm:info:validation");
    }

    function getValidationObj() {
      return editorState.validationObj;
    }

    function simulateModel() {

      if (editorState.mode === 'editor') {
        //unselect previous selected task if any
        deSelectTask();
        var ets = TaskModelSimulator.start(currentTaskModel);
        Renderer.startSimulation(ets);
        editorState.mode = 'simulation';
      } else {
        Renderer.stopSimulation();
        editorState.mode = 'editor';
      }
    }

    function simPerformTask(taskId) {
      var ets = TaskModelSimulator.executeTask(getTaskById(taskId));
      Renderer.updateSimulation(ets);
    }

    /**
     * adds the selected subtree to library/module
     * 
     * @param {[Task]} task root of the subtree
     */
    function addToLibrary(task) {
      //add some more checks??
      if(!task) {
        throw new Error("No task (subtree) to add to library");
      }

      var partial = angular.copy(task);
      // var partial = task;

      var child0 = partial.children[0];

      console.log(child0.data);
      child0.data.name = 'lklk';
      console.log(child0.data);
      // library.push(partial);
    }

    function test123() {
      currentTaskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'Enable access', relation: '>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'Access', relation: '[>'});
      currentTaskModel.addTask({parentTaskId:'TASK_0', taskType:'INTERACTION', name:'Close access'});
      // currentTaskModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});

      currentTaskModel.addTask({parentTaskId:'TASK_1', taskType:'INTERACTION', name:'Insert card', relation: '>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_1', taskType:'System', name:'Require password', relation: '>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_1', taskType:'INTERACTION', name:'Insert Password'});


      currentTaskModel.addTask({parentTaskId:'TASK_2', taskType:'Abstract', name:'Withdraw cash', relation: '[]'});
      currentTaskModel.addTask({parentTaskId:'TASK_2', taskType:'Abstract', name:'Deposit cash', relation: '[]'});
      currentTaskModel.addTask({parentTaskId:'TASK_2', taskType:'Abstract', name:'Get information'});

      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'INTERACTION', name:'Select withdraw', relation: '>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'System', name:'Show possible amounts', relation: '[]>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'User', name:'Decide amount', relation: '[]>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'INTERACTION', name:'Select account', relation: '[]>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'System', name:'Provice cash', relation: '[]>>'});
      currentTaskModel.addTask({parentTaskId:'TASK_7', taskType:'INTERACTION', name:'Check cash'});

    }
  }

})();
