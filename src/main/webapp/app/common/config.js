(function() {
	"use strict";

	angular.module('WVTM')
	.config(appConfig)
	.constant('wvtmConfig', {
    apiUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/WVTM/api/',
	});
  
  appConfig.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];
  function appConfig($routeProvider, $locationProvider, $httpProvider, $compileProvider) {
    //disable debug info
    // $compileProvider.debugInfoEnabled(false);

    $routeProvider.otherwise({
      redirectTo: '/editor'
    });

    $httpProvider.defaults.transformRequest = function(data) {
      var query = '';
      if (data instanceof Object) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
          }
        }
        return query;
      } else {
        return data;
      }
    };

    $httpProvider.defaults.headers.post = {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    };
    // $locationProvider.html5Mode(true).hashPrefix('!');
  }	
})();