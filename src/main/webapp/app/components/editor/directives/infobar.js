(function() {
  'use strict';

  angular.module('WVTM.editor')
    .directive('infoBar', infoBar);

  // editorActionbar.$inject = [];

  function infoBar() {
    var ddo = {
      templateUrl: 'app/components/editor/partials/infobar.html',
      link: link,
      require: '^taskmodelEditor',
    };

    return ddo;

    /********************/

    function link(scope, element, attrs, ctrl) {

    }
  }
})();
