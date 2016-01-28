(function() {
  'use strict';

  angular.module('WVTM.editor')
    .controller('EditorController', EditorController);

  EditorController.$inject = ['$scope', 'EditorService', 'TaskType', 'TaskRelation', 'Renderer', 'ModalService'];

  function EditorController($scope, EditorService, TaskType, TaskRelation, Renderer, ModalService) {
    var _this = this;

    this.currentTask = EditorService.getSelectedTask();

  }

})();
