(function() {
  'use strict';

  angular.module('WVTM.editor')
    .controller('InfobarController', InfobarController)
    .directive('editorInfobar', editorInfobar);

    InfobarController.$inject = ['TaskType', 'TaskRelation', 'EditorService', 'ModalService'];
    function InfobarController(TaskTypes, TaskRelations, EditorService, ModalService) {
      var _this = this;
    	this.TaskTypes = TaskTypes;
    	this.TaskRelations = TaskRelations;
      this.currentTask = null;
      this.infoType = '';
      this.title = 'Information';


      this.infoModel = {
        type: "",
        relation: '',
        isLast: false,
        isRoot: false
      };

      this.showTaskInfo = function() {

        var selectedTask = EditorService.getSelectedTask();
        if(selectedTask) {
          _this.infoType = 'task';
          _this.title = 'Selected Task';
          _this.currentTask = selectedTask;
          _this.infoModel.type = selectedTask.data.type;
          _this.infoModel.relation = selectedTask.data.relation;
          _this.infoModel.isLast = selectedTask.getRightSibling() ? false : true;
          _this.infoModel.isRoot = selectedTask.parent ? false : true;

          //@lk check if node is part of module/library show options accordingly

        } else if(_this.infoType === 'task') {
          _this.infoType = '';
          _this.title = 'Information';
          _this.currentTask = null;
          _this.infoModel.type = _this.infoModel.relation = '';
        }        
      };

      this.updateTaskType = function() {
        EditorService.updateTaskType(_this.infoModel.type);
      };

      this.updateTaskRelation = function() {
        EditorService.addUpdateTaskRelation(_this.infoModel.relation);
      };

      this.showValidationInfo = function() {
        _this.infoType = 'validation';
        _this.title = 'Validation info';
        _this.vInfo = EditorService.getValidationObj();
      };

      this.showSimulationInfo = function() {
        _this.infoType = 'simulation';
        _this.title = 'Simulation info';

      };

      this.addToLibrary = function() {
        ModalService.open({
          templateUrl: 'app/partials/librarymodal.html',
          params: {
            msg: '_this.selectedTask',
            task: _this.selectedTask
          },
          pipe: false
        });

        // EditorService.addToLibrary();
      };

    }

  editorInfobar.$inject = ['$rootScope'];

  function editorInfobar($rootScope) {
    var ddo = {
    	scope: {},
      controller: 'InfobarController',
      controllerAs: 'vm',
      templateUrl: 'app/components/editor/infobar/infobar.html',
      link: link,
    };

    return ddo;

    /********************/

    function link(scope, element, attrs, ctrl) {
      $rootScope.$on('wvtm:info:task', function() {
        scope.$apply(function() {
          ctrl.showTaskInfo();
        });
      });

      $rootScope.$on("wvtm:info:validation", function() {
        scope.$apply(function() {
          ctrl.showValidationInfo();
        });
      });

      $rootScope.$on("wvtm:info:simulation", function() {
        scope.$apply(function() {
          ctrl.showSimulationInfo();
        });
      });
      
      // $rootScope.$on("wvtm:info:simulation", function() {
      //   scope.$apply(function() {
      //     ctrl.showSimulationInfo();
      //   });
      // });

      // scope.$destroy(function() {
      //   deregister();
      // });
    }
  }
})();
