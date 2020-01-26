export class QueueNode<T> {
  val: T;
  next: QueueNode<T>;

  constructor(val: T) {
    this.val = val;
  }
}

export class Queue<T> {
  private first: QueueNode<T>;
  private last: QueueNode<T>;
  length = 0;

  constructor(public readonly max: number = -1) {}

  push(val: T) {
    if (this.length === this.max)
      return;

    let newNode = new QueueNode<T>(val);
    if (this.length === 0) {
      this.first = this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }

    this.length++;
    return this;
  }

  pop() {
    if (this.length === 0)
      return null;

    let popped = this.first;
    this.first = popped.next;
    this.length--;
    return popped.val;
  }

  clear() {
    this.first = this.last = null;
    this.length = 0;
    return this;
  }
}