(function() {
  'use strict';

  angular.module('WVTM.editor')
    .controller('MenuController', MenuController)
    .directive('editorMenu', editorMenu);

  MenuController.$inject = ['EditorService'];

  function MenuController(EditorService) {
    this.menuAction = function(action) {

      switch(action) {
        case 'validate':
          EditorService.validateStructure();
          break;

        case 'simulate':
          EditorService.simulate();
          break;
      }
    };

  }

  // editorMenu.$inject = [];

  function editorMenu() {
    var ddo = {
      controller: 'MenuController',
      controllerAs: 'vm',
      templateUrl: 'app/components/editor/menu/menu.html',
      link: link
    };

    return ddo;

    /********************/

    function link(scope, element, attrs, ctrl) {

      element.on('click', '.menu-btn', menuClickHandler);

      function menuClickHandler(evt) {
        var elm = angular.element(this);
        var action = elm.attr('action');
        console.log(action);
        ctrl.menuAction(action);

        // if (action === 'validate') {
        //   ctrl.validateStructure();
        // }
        // if (action === 'simulate') {
        //   ctrl.simulate();
        // }
      }
    }
  }
})();
