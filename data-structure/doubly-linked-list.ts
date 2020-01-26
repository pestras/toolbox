export class DoublyLinkedListNode<T> {
  val: T;
  next: DoublyLinkedListNode<T> = null;
  prev: DoublyLinkedListNode<T> = null;

  constructor(val: T) {
    this.val = val;
  }
}

export class DoublyLinkedList<T = number> {
  head: DoublyLinkedListNode<T> = null;
  tail: DoublyLinkedListNode<T> = null;
  length = 0;

  constructor(...args: T[]) {
    if (args && args.length)
      for (let i = 0; i < args.length; i++)
        this.push(args[i]);
  }

  get(pos: number) {
    if (pos < 0 || pos >= this.length)
      return null;

    if (pos === this.length - 1)
      return this.tail;
    else if (pos === 0)
      return this.head;

    let currNode: DoublyLinkedListNode<T>;
    let dir: "next" | "prev" = 'next';

    if (pos <= this.length / 2) {
      currNode = this.head;
    } else {
      currNode = this.tail;
      dir = 'prev';
      pos = this.length - 1 - pos;
    }

    while (currNode[dir]) {
      if (pos === 0)
        return currNode;

      currNode = currNode[dir];
      pos--;
    }

    return null;
  }

  indexOf(val: T) {
    if (this.length === 0)
      return -1;

    let pos = 0;
    let current = this.head;
    while (current) {
      if (current.val === val)
        return pos;

      current = current.next;
      pos++;
    }

    return -1;
  }

  includes(cb: (val: T) => boolean) {
    if (this.length === 0)
      return false;

    let pos = 0;
    let current = this.head;
    while (current) {
      if (cb(current.val))
        return true;

      current = current.next;
      pos++;
    }

    return false;
  }

  find(cb: (val: T) => boolean) {
    if (this.length === 0)
      return null;

    let current = this.head;
    while (current) {
      if (cb(current.val))
        return current;

      current = current.next;
    }

    return null;
  }

  findIndex(cb: (val: T) => boolean) {
    if (this.length === 0)
      return - 1;

    let pos = 0;
    let current = this.head;
    while (current) {
      if (cb(current.val))
        return pos;

      current = current.next;
      pos++;
    }

    return -1;
  }

  set(pos: number, val: T) {
    let selectedNode = this.get(pos);

    if (selectedNode)
      selectedNode.val = val;

    return this;
  }

  push(val: T) {
    let newNode = new DoublyLinkedListNode<T>(val);

    if (this.length === 0) {
      this.head = this.tail = newNode;
      this.length++;
      return this;
    }

    this.tail.next = newNode;
    newNode.prev = this.tail;
    this.tail = newNode;
    this.length++;
    return this;
  }

  pop() {
    if (this.length === 0)
      return null;

    let popped = this.tail;
    let prev = popped.prev;

    if (!prev) {
      this.tail = this.head = null;
    } else {
      prev.next = null;
      this.tail = prev;
    }

    this.length--;
    return popped.val;
  }

  unshift(val: T) {
    var newNode = new DoublyLinkedListNode<T>(val);

    if (this.length === 0) {
      this.head = this.tail = newNode;
      this.length++;
      return this;
    }

    this.head.prev = newNode;
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
    return this;
  }

  shift() {
    if (this.length === 0)
      return null;

    let shifted = this.head;
    let next = this.head.next;

    if (!next) {
      this.tail = this.head = null;
    } else {
      next.prev = null;
      this.head = next;
    }

    this.length++;
    return shifted.val;
  }

  insert(pos: number, val: T) {
    if (pos < 0 || pos > this.length)
      return this;

    if (pos === 0)
      return this.unshift(val);

    if (pos === this.length)
      return this.push(val);

    let newNode = new DoublyLinkedListNode<T>(val);
    let next = this.get(pos);
    let prev = next.prev;
    next.prev = newNode;
    newNode.next = next;
    prev.next = newNode;
    newNode.prev = prev;
    this.length++;
    return this;
  }

  remove(pos: number) {
    if (pos < 0 || pos >= this.length)
      return null;

    if (pos === 0)
      return this.shift();

    if (pos === this.length - 1)
      return this.pop();

    let node = this.get(pos);
    let prev = node.prev;
    let next = node.prev;
    prev.next = next;
    next.prev = prev;
    this.length++;
    return node.val;
  };

  forEach(cb: (val: T, pos?: number) => void) {
    if (this.length === 0)
      return;

    let pos = 0;
    let current = this.head;
    while (current) {
      cb(current.val, pos++);
      current = current.next;
    }
  }

  filter(cb: (val: T, pos?: number) => boolean) {
    let newLinkedList = new DoublyLinkedList<T>();

    if (this.length === 0)
      return newLinkedList;

    let pos = 0;
    let current = this.head;
    while (current) {
      if (cb(current.val, pos))
        newLinkedList.push(current.val);

      current = current.next;
      pos++;
    }

    return newLinkedList;
  }

  map<U = T>(cb: (val: T, pos?: number) => U) {
    let newLinkedList = new DoublyLinkedList<U>();

    if (this.length === 0)
      return newLinkedList;

    let pos = 0;
    let current = this.head;
    while (current) {
      newLinkedList.push(cb(current.val, pos));
      current = current.next;
      pos++;
    }

    return newLinkedList;
  }

  reduce(cb: (prev: any, curr: T) => any, start: any) {
    let result = start;

    let current = this.head;
    while (current) {
      result = cb(result, current.val);
    }

    return result;
  }

  slice(start = 0, end = this.length) {
    let newLinkedList = new DoublyLinkedList<T>();

    if (start < 0)
      start = this.length + start;
    else if (start >= this.length)
      newLinkedList;

    if (end < 0)
      end = this.length + end;

    if (start >= end)
      return newLinkedList;

    let pos = 0;
    let current = this.head;
    while (start < end && current) {
      if (pos === start) {
        newLinkedList.push(current.val);
        start++;
      }

      current = current.next;
      pos++;
    }

    return newLinkedList;
  }

  splice(start = 0, deleteCount = 0, ...replace: T[]) {
    if (start < 0)
      start = this.length + start > 0 ? this.length + start : 0;
    else if (start > this.length)
      start = this.length;

    let deleted = new DoublyLinkedList<T>();

    if (this.length > 0 && deleteCount > 0) {
      let prev = this.get(start - 1);
      let current = prev ? prev.next : this.head;

      for (let i = 0; i < deleteCount; i++)
        if (current) {
          deleted.push(current.val);
          current = current.next;
          this.length--;
        }

      if (!prev) {
        this.head = prev = current;
        current && (current.prev = null);
      } else {
        prev.next = current;
        if (current) current.prev = prev;
        else this.tail = prev;
      }
    }

    if (replace.length > 0) {
      let next = start === 0 ? this.head : this.get(start);
      let startPoint = start === 0 ? (!!(++this.length) && (this.head = new DoublyLinkedListNode<T>(replace.shift()))) : this.get(start - 1);
      let current = startPoint;

      for (let val of replace) {
        current.next = new DoublyLinkedListNode<T>(val);
        current.next.prev = current;
        current = current.next;
        this.length++;
      }

      current.next = next;
      if (next) next.prev = current;
      else this.tail = current;
    }
  }

  toArray() {
    let arr: T[] = [];
    this.forEach(val => arr.push(val));
    return arr;
  }

  reverse() {
    if (this.length <= 1)
      return this;

    let curr = this.head;
    while (curr) {
      let next = curr.next;
      curr.next = curr.prev;
      curr.prev = next;
      if (!curr.next) this.tail = curr;
      else if (!curr.prev) this.head = curr;
      curr = next;
    }

    return this;
  }

  toString() {
    return this.toArray().toString()
  }
}