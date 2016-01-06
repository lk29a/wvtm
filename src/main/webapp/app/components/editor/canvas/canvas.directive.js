(function(){
	'use strict';

	angular.module('WVTM.editor.canvas')
		.directive('editorCanvas', editorCanvas);

		editorCanvas.$inject = ['SVG'];
		function editorCanvas(SVG) {
			var ddo = {
				scope: {
					taskModel: '='
				},
				compile: function () {
					return {
						pre: preLink,
						post: postLink
					};
				}
			};

			return ddo;

			/********************/

			function preLink(scope, element) {
				var paper = new Raphael(document.getElementById('canvas-container'), 600, 600);
				var connectors = paper.set();

        (function recursiveDF(currentNode) {
        	var mCood = "" + currentNode.layout.x + "," + (currentNode.layout.y + 20);
        	var levelCentre = 0;
        	if(currentNode.children.length) {
	        	levelCentre = currentNode.layout.y + (currentNode.children[0].layout.y - currentNode.layout.y) / 2;
        	}
          for (var i = 0; i < currentNode.children.length; i++) {
            recursiveDF(currentNode.children[i]);

            var child = currentNode.children[i];
            var connectorPath = 'M' + mCood + " C" + currentNode.layout.x + "," + levelCentre + " " + child.layout.x + "," + levelCentre + " " + child.layout.x + "," + (child.layout.y - 20);
            console.log(connectorPath);
            connectors.push(paper.path(connectorPath));
          }
          paper.circle(currentNode.layout.x, currentNode.layout.y, 20);
          // console.log(currentNode.layout);
        })(scope.taskModel.tree.root);

			}

			function postLink(scope, element) {	

				// attrs.$observe(scope.taskModel, function(oldVal, newVal) {
				// 	console.log(oldVal);
				// 	console.log(newVal);
				// });

				var height = angular.element(window).height();
				var width = angular.element(window).width();
				//toolbar and header have fixed width and height of 60px and 65px respectively
				height -= 65;
				width -= 60;



			}
		}
})();