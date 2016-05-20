export class GenericQueue {
		private _offset: number;
		_queue: Object[]

  size() {
		return (this._queue.length - this._offset);
  };

	enqueue(data) {
		this._queue.push(data);
	};

	dequeue() {
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
}