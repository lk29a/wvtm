/**
* WVTM.editor Module
*
* Visual editor 
*/
(function(){
	'use strict';

	angular.module('WVTM.editor', [
			'WVTM.TaskModel',
			'WVTM.renderer',
		])
	.config(routeConfig);

  routeConfig.$inject = ['$routeProvider'];
	function routeConfig($routeProvider) {
		$routeProvider.when('/editor', {
			controller: 'EditorController',
			controllerAs: 'evm',
      templateUrl: 'app/components/editor/editor.html',
      reloadOnSearch: false,
		});
	}

})();