// utils/priorityQueue.js
export class PriorityQueue {
  constructor(comparator) {
    this.heap = [];
    this.comparator = comparator;
  }

  enqueue(item) {
    this.heap.push(item);
    this.heap.sort(this.comparator);
  }

  dequeue() {
    return this.heap.shift();
  }

  remove(predicate) {
    this.heap = this.heap.filter(item => !predicate(item));
  }

  toArray() {
    return [...this.heap];
  }
}