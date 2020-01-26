export class BinarySearchTeeeNode<T> {
  left: BinarySearchTeeeNode<T>;
  right: BinarySearchTeeeNode<T>;

  constructor(public readonly val: T) { }
}

export class BinarySearchTeee<T> {
  root: BinarySearchTeeeNode<T>;

  constructor(public readonly comparer: (a: T, b: T) => number = null) { }

  private compare(a: any, b: any) {
    return this.comparer ? this.comparer(a, b) : (a - b);
  }

  insert(val: T) {
    let newNode = new BinarySearchTeeeNode<T>(val);
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let curr = this.root;

    while (true) {
      let compare = this.compare(curr.val, val);
      if (compare > 0) {
        if (curr.right) {
          curr = curr.right;
        } else {
          curr.right = newNode;
          break;
        }
      } else if (compare < 0) {
        if (curr.left) {
          curr = curr.left;
        } else {
          curr.left = newNode;
          break;
        }
      } else {
        break;
      }
    }

    return this;
  }

  find(val: T): T {
    let curr = this.root;
    while (curr) {
      let compare = this.compare(curr.val, val);

      if (compare === 0) return curr.val;    
      if (compare > 0) curr = curr.right;
      if (compare < 0) curr = curr.left;
    }

    return null;
  }

  private PFS() {
    if (!this.root) return [];

    let queue = [this.root];
    let visisted = [];
    let curr: BinarySearchTeeeNode<T>;

    while (queue.length > 0) {
      curr = queue.shift();
      visisted.push(curr.val);
      if (curr.left) queue.push(curr.left);
      if (curr.right) queue.push(curr.right);
    }

    return visisted;
  }

  private DFS(order: -1 | 0 | 1) {
    let visited: T[] = [];
    if (!this.root) return [];

    function travers(node: BinarySearchTeeeNode<T>) {
      order < 0 && visited.push(node.val);
      if (node.left) travers(node.left);
      order === 0 && visited.push(node.val);
      if (node.right) travers(node.right);
      order > 0 && visited.push(node.val);
    }

    travers(this.root);
    return visited;
  }

  private DFSPreOrder() {
    let visited: T[] = [];
    if (!this.root) return [];

    function travers(node: BinarySearchTeeeNode<T>) {
      visited.push(node.val);
      if (node.left) travers(node.left);
      if (node.right) travers(node.right);
    }

    travers(this.root);
    return visited;
  }
  
  private DFSPostOrder() {
    let visited: T[] = [];
    if (!this.root) return [];

    function travers(node: BinarySearchTeeeNode<T>) {
      if (node.left) travers(node.left);
      if (node.right) travers(node.right);
      visited.push(node.val);
    }

    travers(this.root);
    return visited;
  }
  
  private DFSInOrder() {
    let visited: T[] = [];
    if (!this.root) return [];

    function travers(node: BinarySearchTeeeNode<T>) {
      if (node.left) travers(node.left);
      visited.push(node.val);
      if (node.right) travers(node.right);
    }

    travers(this.root);
    return visited;
  }
}