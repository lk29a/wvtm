/**
 * angular wrapper for Snap
 */
(function() {
  'use strict';

  angular.module('WVTM')
    .factory('Snap', SnapWrapper);

  SnapWrapper.$inject = ['$window'];

  function SnapWrapper($window) {
    return $window.Snap;
  }
})();
