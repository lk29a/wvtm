/**
 * WVTM.renderer Module
 *
 * Description
 */
(function() {
  'use strict';

  angular.module('WVTM.renderer', [])
    .constant('RendererDefaults', {
      radius: 20,
      baseAttrs: {
        fill: 'transparent',
        stroke: "#212121",
        strokeWidth: 1,
      }
    });
})();
