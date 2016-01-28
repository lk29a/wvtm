(function() {
  'use strict';

  angular.module('WVTM.editor')
    .controller('ToolbarController', ToolbarController)
    .directive('editorToolbar', editorToolbar);

  ToolbarController.$inject = ['TaskType', 'TaskRelation', 'EditorService'];

  function ToolbarController(TaskTypes, TaskRelations, EditorService) {
    this.TaskTypes = TaskTypes;
    this.TaskRelations = TaskRelations;

    this.addTask = function(taskType) {
      EditorService.addTask(taskType);
    };

    this.addRelation = function(relation) {
      EditorService.addUpdateTaskRelation(relation);
    };

  }

  // editorToolbar.$inject = [];

  function editorToolbar() {
    var ddo = {
      scope: {},
      controller: 'ToolbarController',
      controllerAs: 'vm',
      templateUrl: 'app/components/editor/toolbar/toolbar.html',
      link: link,
    };

    return ddo;

    /********************/

    function link(scope, element, attrs, ctrl) {

      element.on('click', '.toolbar-btn', toolbarClickHandler);

      function toolbarClickHandler(event) {
        var elm = angular.element(this);
        var action = elm.attr('action');

        if (action === 'task') {
          ctrl.addTask(elm.attr('task'));
        } else if (action === 'relation') {
          ctrl.addRelation(elm.attr('relation'));
        } else if (action === 'library') {
          showModules(event.target);
        }
      }

      function showModules(target) {
        console.log(target);
        var parent = target.parentElement;
        console.log(parent);
        //generate popover html
      }


    }
  }
})();
