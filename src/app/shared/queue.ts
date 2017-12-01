export class Queue<T> {
    private _offset: number = 0;
    _queue: Array<T> = [];

  size(): number {
    return (this._queue.length - this._offset);
  };

  enqueue(data: T) {
    this._queue.push(data);
  };

  dequeue(): T {
    if (this._queue.length === 0) {
      return undefined;
    }

    let item = this._queue[this._offset];
    this._offset++;

    if (2 * this._offset >= this._queue.length) {
      this._queue = this._queue.slice(this._offset);
      this._offset = 0;
    }

    return item;
  };
}
