/**
 * WVTM.modal Module
 *
 * Simple modal system for angular based on ben nadel's simple modal
 */
(function() {
  'use strict';
  angular.module('WVTM.modal', [])
    .factory('ModalService', ModalService)
    .directive('lkModal', lkModal);


  ModalService.$inject = ['$rootScope', '$q'];

  function ModalService($rootScope, $q) {

    var modal = {
      deferred: null,
      params: null
    };

    return {
      open: open,
      params: params,
      proceedTo: proceedTo,
      reject: reject,
      resolve: resolve
    };

    // function open(type, params, pipeResponse) {
    function open(modalObj) {
      //check modalObj properties
      if (!modalObj.templateUrl || (typeof modalObj.templateUrl !== 'string')) {
        throw new Error('templateUrl is required for modal');
      }

      var prevDeferred = modal.deferred;

      modal.deferred = $q.defer();
      modal.params = modalObj.params;

      if (prevDeferred && modalObj.pipe) {
        modal.deferred.promise.then(prevDeferred.resolve, prevDeferred.reject);
      } else if (prevDeferred) {
        prevDeferred.reject();
      }
      $rootScope.$emit('modal.open', modalObj);

      return modal.deferred.promise;
    }

    function params() {
      return modal.params || {};
    }

    function proceedTo(type, params) {
      return open(type, params, true);
    }

    function reject(reason) {
      if (!modal.deferred) {
        return;
      }

      modal.deferred.reject(reason);
      modal.deferred = modal.params = null;

      $rootScope.$emit('modal.close');
    }

    function resolve(response) {
      if (!modal.deferred) {
        return;
      }

      modal.deferred.resolve(response);
      modal.deferred = modal.params = null;

      $rootScope.$emit('modal.close');
    }
  }


  lkModal.$inject = ['$rootScope', 'ModalService', '$http', '$templateCache', '$compile'];

  function lkModal($rootScope, ModalService, $http, $templateCache, $compile) {

    var ddo = {
      // scope: true,
      // scope: {},
      // controller: 'CanvasController',
      // templateUrl: 'app/components/editor/partials/canvas.html',
      link: linker
    };
    return ddo;

    function linker(scope, element, attrs) {
      scope.modalView = null;

      element.on('click', function clickHandler(event) {
        if (element[0] !== event.target) {
          return;
        }
        scope.$apply(ModalService.reject);
      });

      $rootScope.$on("modal.open", function handleModalOpenEvent(event, modalObj) {

        $http.get(modalObj.templateUrl, {
          cache: $templateCache
        })
        .then(function(response) {
          scope.modalData = modalObj.params;
          element.addClass('open');
          element.html(response.data);
          $compile(element.contents())(scope);
        });
      });

      $rootScope.$on("modal.close", function handleModalCloseEvent(event) {
        element.removeClass('open');
        element.html('');
      });

    }

  }





})();
