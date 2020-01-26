export class StackNode<T> {
  val: T;
  prev: StackNode<T>;

  constructor(val: T) {
    this.val = val;
  }
}

export class Stack<T> {
  last: StackNode<T>;
  length = 0;

  constructor(public readonly max: number = -1) {}

  push(val: T) {
    if (this.length === this.max)
      return this;

    let newNode = new StackNode<T>(val);
    newNode.prev = this.last;
    this.last = newNode;
    this.length++;
    return this;
  }

  pop() {
    if (!this.last)
      return null;

    let popped = this.last;
    this.last = popped.prev;
    this.length--;
    return popped.val;
  }

  clear() {
    this.last = null;
    this.length = 0;
    return this;
  }
}