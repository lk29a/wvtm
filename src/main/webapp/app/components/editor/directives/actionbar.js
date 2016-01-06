(function() {
  'use strict';

  angular.module('WVTM.editor')
    .directive('editorActionbar', editorActionbar);

  // editorActionbar.$inject = [];

  function editorActionbar() {
    var ddo = {
      templateUrl: 'app/components/editor/partials/actionbar.html',
      link: link,
      require: '^taskmodelEditor',
    };

    return ddo;

    /********************/

    function link(scope, element, attrs, ctrl) {
        var actionBtns = document.querySelectorAll('#action-bar ul');

        angular.element(actionBtns).on('click', actionClickHandler);

        function actionClickHandler(evt) {
          if(evt.target.nodeName === 'BUTTON') {
            var elm = angular.element(evt.target);
            var action = elm.attr('action');

            if(action === 'validate') {
              ctrl.validateStructure();
            }
            if(action === 'simulate') {
              ctrl.simulate();
            }
          }
        }
    }
  }
})();
