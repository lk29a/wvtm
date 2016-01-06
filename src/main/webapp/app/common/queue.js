/**
 * Tarkk.queue Module
 *
 * A generic queue implementation
 */
(function() {
  'use strict';

  angular.module('WVTM.queue', [])
    .factory('Queue', function() {
    	return GenericQueue;
    });

  function GenericQueue() {
  	this._offset = 0;
  	this._queue = [];
  }

  GenericQueue.prototype.size = function() {
  	return (this.length - this._offset);
  };

	GenericQueue.prototype.enqueue = function(data) {
		this._queue.push(data);
	}; 

	GenericQueue.prototype.dequeue = function() {
		if (this._queue.length === 0) {
			return undefined;
		}

		var item = this._queue[this._offset];
		this._offset++;

		if(2 * this._offset >= this._queue.length) {
			this._queue = this._queue.slice(this._offset);
			this._offset = 0;
		}

		return item;

	};

})();
