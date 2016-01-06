(function() {
  'use strict';

  angular.module('WVTM.editor')
    .factory('EditorService', EditorService);

  EditorService.$inject = ['TaskModel', 'TaskModelSimulator'];

  function EditorService(TaskModel, TaskModelSimulator) {
    var curModel = null;
    var editorState = {
      actions: {
        prev: [],
        next: []
      }
    };

    var api = {
      newInstance: newInstance,
      getTaskModel: getTaskModel,
      getEditorState: getEditorState,
      addTask: addTask,
      addRelation: addRelation,
      validateStructure: validateStructure,
      simulateModel: simulateModel,
      test123: test123
    };

    return api;

    /***********************************/

    function newInstance() {
    	//reset all variables
      curModel = new TaskModel();
      return curModel;
    }


    function getTaskModel() {
      return curModel;
    }

    function getEditorState() {
      return editorState;
    }

    function addTask(options) {
      curModel.addTask(options);
      return curModel;
    }

    function addRelation(node, relation) {
      curModel.addRelation(node, relation);
      return curModel;
    }

    function validateStructure() {
      curModel.validateStructure();
    }

    function simulateModel() {
      //get enabled tasks set
      return TaskModelSimulator.start(curModel);

    }

    function test123() {
      curModel.addTask({parentTaskId:'TASK_0', taskType:'USER', name:'b'});
      curModel.addTask({parentTaskId:'TASK_0', taskType:'INTERCACTION', name:'c'});
      curModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'d'});
      // curModel.addTask({parentTaskId:'TASK_0', taskType:'Abstract', name:'e'});

      curModel.addTask({parentTaskId:'TASK_1', taskType:'Abstract', name:'zz'});
      curModel.addTask({parentTaskId:'TASK_1', taskType:'Abstract', name:'zzz'});


      curModel.addTask({parentTaskId:'TASK_2', taskType:'SYSTEM', name:'f'});
      curModel.addTask({parentTaskId:'TASK_2', taskType:'USER', name:'g'});
      // curModel.addTask({parentTaskId:'TASK_2', taskType:'Abstract', name:'h'});


      // curModel.addTask({parentTaskId:'TASK_3', taskType:'USER', name:'i'});
      // curModel.addTask({parentTaskId:'TASK_3', taskType:'system', name:'j'});
      // curModel.addTask({parentTaskId:'TASK_3', taskType:'system', name:'k'});

      // curModel.addTask({parentTaskId:'TASK_4', taskType:'system', name:'l'});
      // curModel.addTask({parentTaskId:'TASK_4', taskType:'system', name:'m'});
    }
  }

})();
