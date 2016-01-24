(function(){
	'use strict';

	angular.module('WVTM.editor')
		.directive('editorToolbar', editorToolbar);

		editorToolbar.$inject = [];
		function editorToolbar() {

			var ddo = {
				templateUrl: 'app/components/editor/partials/toolbar.html',
				// scope: {},
				require: '^taskmodelEditor',
				link: link
			};

			return ddo;

			/********************/


			function link(scope, element, attrs, ctrl) {	




				// var toolBtns = document.querySelectorAll('#toolbar button');
				var toolBtns = document.querySelector('#toolbar');
				
				angular.element(toolBtns).on('click', clickHandler);
				function clickHandler(evt) {
					var elm = angular.element(evt.target);
					var action = elm.attr('action');
					console.log(action);
					if(action === 'task') {
						ctrl.addTask(elm.attr('task'));
					} else if(action === 'relation') {
						ctrl.addRelation(elm.attr('relation'));
					} else if(action === 'library') {
						showModules(evt.target);
					}
				}

				function showModules(target) {
					console.log(target);
					var parent = target.parentElement;
					console.log(parent);
					//generate popover html
						

					
				}

				// var height = angular.element(window).height();
				// var width = angular.element(window).width();
				// //toolbar and header have fixed width and height of 60px and 65px respectively
				// height -= 65;
				// width -= 60;

			}
		}
})();