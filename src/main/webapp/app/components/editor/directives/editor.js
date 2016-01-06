(function(){
	'use strict';

	angular.module('WVTM.editor')
	.directive('taskmodelEditor', taskmodelEditor);

	// taskmodelEditor.$inject = ['EditorService'];
	function taskmodelEditor(){
		return {
			// scope: {},
			// controller: 'TaskEditorController',
			controller: 'EditorController',
			controllerAs: 'evm',
			bindToController: true
		};
	}
})();