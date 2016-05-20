"use strict";
var GenericQueue = (function () {
    function GenericQueue() {
    }
    GenericQueue.prototype.size = function () {
        return (this._queue.length - this._offset);
    };
    ;
    GenericQueue.prototype.enqueue = function (data) {
        this._queue.push(data);
    };
    ;
    GenericQueue.prototype.dequeue = function () {
        if (this._queue.length === 0) {
            return undefined;
        }
        var item = this._queue[this._offset];
        this._offset++;
        if (2 * this._offset >= this._queue.length) {
            this._queue = this._queue.slice(this._offset);
            this._offset = 0;
        }
        return item;
    };
    ;
    return GenericQueue;
}());
exports.GenericQueue = GenericQueue;
//# sourceMappingURL=queue.js.map