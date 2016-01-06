/**
* WVTM.TaskModel Module
*
* Description
*/
(function(){
	'use strict';

	angular.module('WVTM.TaskModel', [
		'WVTM.tree'
		])

	.constant('TaskType', {
		'ABSTRACT': 0,
		'USER': 1,
		'INTERCACTION': 2,
		'SYSTEM': 3,
	})
	.constant('TaskRelation', {
		'UNRESTRICTED': '|||',
		'CHOICE': '[]',
		'CONCURRENTINFO': '|[]|',
		'RANDOM': '|=|',
		'DEACT': '[>',
		'ENABLE':'>>',
		'CHOICEINFO': '[]>>',
		'RESUME': '|>',
		'ITERATION': 'T*',
		'OPTIONAL': '[T]',
		'SAME': '<->',
	});
})();