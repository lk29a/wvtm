(function() {
  'use strict';

  angular.module('WVTM.editor')
    .directive('editorCanvas', editorCanvas);

  editorCanvas.$inject = ['$rootScope', 'EditorService'];
  function editorCanvas($rootScope, EditorService) {
    var ddo = {
      scope: {},
      // controller: 'CanvasController',
      // controllerAs: 'vm',
      // bindToController: {
      //   taskModel: '='
      // },
      templateUrl: 'app/components/editor/canvas/canvas.html',
      compile: function() {
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

    return ddo;

    /********************/

    function preLink(scope, element) {

      var svgElm = element.find('svg');

      //render the initial model svg 
      if (svgElm) {
        EditorService.init();
      } else {
        console.log('SVG element not found...');
      }
    }

    function postLink(scope, element) {
      var svgElm = element.find('svg');

      // $rootScope.$on('wvtm:model:update', function(event, data) {
      //   console.log('updating model');
      //   render.update(data.type, data.taskId, ctrl.taskModel);
      // });



      svgElm.on('click', function(event) {
        if(EditorService.getEditorMode() === 'simulation') {
          return;
        }

        if(event.target.classList.contains('task-node')) {
          // console.log(event.target.parentNode.id);
          EditorService.selectTask(event.target.parentNode.id);
        } else {
          EditorService.deSelectTask();
        }
      });      

      //handle hover on task node
      element.on('mouseenter', '.task-node', highlightTask);
      element.on('mouseleave', '.task-node', highlightTask);

      function highlightTask(event) {
        EditorService.highlightTask(event.target.parentNode.id);
      }

      element.on('dblclick', '.task-node', dbClickTask);

      function dbClickTask(event) {
        if(EditorService.getEditorMode() === 'simulation') {
          // console.log(event.target.parentNode.id);
          EditorService.simPerformTask(event.target.parentNode.id);
        }
      }



    }
  }
})();
