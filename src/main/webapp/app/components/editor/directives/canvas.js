(function() {
  'use strict';

  angular.module('WVTM.editor')
    .directive('editorCanvas', editorCanvas);

  editorCanvas.$inject = ['Snap', 'Renderer'];
  function editorCanvas(Snap, Renderer) {
    var tmr = Renderer;
    var ddo = {
    	// scope: true,
    	// scope: {},
    	// controller: 'CanvasController',
      templateUrl: 'app/components/editor/partials/canvas.html',
      require: '^taskmodelEditor',
      compile: function() {
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

    return ddo;

    /********************/

    function preLink(scope, element, attrs, ctrl) {
    	//render the initial model svg 
    	var svgElm = document.querySelector('editor-canvas');
    	if(svgElm) {
    		tmr.init('editor-canvas');
	      tmr.render(ctrl.taskModel);
    	} else {
    		console.log('SVG element not found...');
    	}
    }

    function postLink(scope, element, attrs, ctrl) {

      //for model update
      scope.$on('wvtm:model:update', function(event, data) {
        console.log('updating model');
        tmr.update(data.type, data.taskId, ctrl.taskModel);
      });

      //for simulation
      scope.$on('wvtm:simulation', function(event, data) {
        

        if(data.type === 'start') {
          tmr.startSimulation(data.ets);
        } 

        if(data.type === 'stop') {
          tmr.stopSimulation();
        } 

        if(data.type === 'update') {
          //maybe pass delta only
          tmr.updateSimulation(ets);
        } 
      });




      var paper = tmr.getPaper();
      
      var modelGroup = paper.select('#model-group');

      var prevSelection = null;

      //single click for selection
      modelGroup.click(function(evt) {
        if(evt.target.classList.contains('tree-node')) {
          ctrl.selectedTaskId = evt.target.id;
          var selectedTask = modelGroup.select("#" + evt.target.id);
          // if(prevSelection !== selectedTask && prevSelection) {
          //   tmr.selectEffect(prevSelection);
          // }
          tmr.selectEffect(selectedTask);
          prevSelection = selectedTask;
          scope.$apply(function() {
            ctrl.currentTask = selectedTask.data('origNode');
            console.log(ctrl.currentTask);
          });
        } else {
          ctrl.selectedTask = null;
          ctrl.currentTask = null;
        }
      });

      //double click for data edit
      modelGroup.dblclick(function(evt) {
        if(evt.target.classList.contains('tree-node')) {
          console.log("will edit task");
          var selectedTask = modelGroup.select("#" + evt.target.id);
          //@lk edit data popup or slide from right
          // ctrl.addTask(selectedTask.data('origNode'), );
        }
      });

      //hover for nodes
      modelGroup.hover(function(evt) {
        if(evt.target.classList.contains('tree-node')) {
          var hovered = modelGroup.select("#" + evt.target.id);
          tmr.hoverEffect(hovered);
        }
      }, function(evt) {
        if(evt.target.classList.contains('tree-node')) {
          var hovered = modelGroup.select("#" + evt.target.id);
          tmr.hoverEffect(hovered);
        }
      });


    }
  }
})();
