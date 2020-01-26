export class LinkedListNode<T> {
  val: T;
  next: LinkedListNode<T> = null;

  constructor(val: T) {
    this.val = val;
  }
}

export class LinkedList<T = number> {
  head: LinkedListNode<T> = null;
  tail: LinkedListNode<T> = null;
  length = 0;

  constructor(...args: T[]) {
    if (args.length)
      for (let i = 0; i < args.length; i++)
        this.push(args[i]);
  }

  get(pos: number) {
    if (pos < 0 || pos >= this.length)
      return null;

    if (pos === this.length - 1)
      return this.tail;

    let currNode = this.head;

    while (currNode.next) {
      if (pos === 0)
        return currNode;

      currNode = currNode.next;
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
    var newNode = new LinkedListNode<T>(val);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  pop() {
    if (!this.head)
      return null;

    let current = this.head;
    let newTail = null;

    while (current.next) {
      newTail = current;
      current = current.next;
    }

    this.tail = newTail;

    if (!this.tail) {
      this.head = null;
    } else {
      this.tail.next = null;
    }

    this.length--;
    return current.val;
  }

  unshift(val: T) {
    let newHead = new LinkedListNode<T>(val);

    newHead.next = this.head;
    this.head = newHead;
    !!this.tail || (this.tail = this.head);
    this.length++;
    return this;
  }

  shift() {
    if (!this.head)
      return null;

    let currentHead = this.head;
    this.head = this.head.next;
    !!this.head || (this.tail = null);
    this.length--;
    return currentHead;
  }

  insert(pos: number, val: T) {
    if (pos < 0 || pos > this.length)
      return this;

    if (pos === 0)
      return this.unshift(val);

    if (pos === this.length)
      return this.push(val);

    let newNode = new LinkedListNode<T>(val);
    let prev = this.head;
    while (prev.next) {
      if (pos === 1) {
        newNode.next = prev.next;
        prev.next = newNode;
        this.length++;
        return this;
      }

      prev = prev.next;
      pos--;
    }
  }

  remove(pos: number) {
    if (pos < 0 || pos >= this.length)
      return null;

    if (pos === 0)
      return this.shift();

    if (pos === this.length - 1)
      return this.pop();

    let prev = this.head;
    while (prev.next) {
      if (pos === 1) {
        let removedItem = prev.next;
        prev.next = prev.next.next;
        this.length--;
        return removedItem.val;
      }

      prev = prev.next;
      pos--;
    }
  }

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
    let newLinkedList = new LinkedList<T>();

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
    let newLinkedList = new LinkedList<U>();

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
    let newLinkedList = new LinkedList<T>();
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

    let deleted = new LinkedList<T>();

    if (this.length > 0 && deleteCount > 0) {
      let prev = this.get(start - 1);
      let current = prev ? prev.next : this.head;

      for (let i = 0; i < deleteCount; i++)
        if (current) {
          deleted.push(current.val);
          current = current.next;
          this.length--;
        }

      if (!prev)  this.head = prev = current;
      else prev.next = current;

      if (!current) this.tail = prev;
    }

    if (replace.length > 0) {

      let next = start === 0 ? this.head : this.get(start);
      let startPoint = start === 0 ? (!!(++this.length) && (this.head = new LinkedListNode<T>(replace.shift()))) : this.get(start - 1);
      let current = startPoint;

      for (let val of replace) {
        current.next = new LinkedListNode<T>(val);
        current = current.next;
        this.length++;
      }

      current.next = next;

      if (!next) this.tail = current;
    }

    return deleted;
  }

  toArray(): T[] {
    let arr: T[] = [];
    this.forEach(val => arr.push(val));
    return arr;
  }

  reverse() {
    if (this.length <= 1)
      return this;

    var node = this.head;
    this.head = this.tail;
    this.tail = node;
    let prev = null;
    let next = null;

    for (let i = 0; i < this.length; i++) {
      next = node.next;
      node.next = prev;
      prev = node;
      node = next;
    }

    return this;
  }

  toString() {
    return this.toArray().toString()
  }
} 