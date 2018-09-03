export function equals(arg1: any, arg2: any, deep?: boolean): boolean {
  if (arg1 instanceof Array && arg2 instanceof Array) {
    if (arg1.length !== arg2.length) return false;
    for (let i = 0; i < arg1.length; i++) {
      let pass = false;
      for (let j = 0; j < arg2.length; j++) {
        if ((deep && equals(arg1[i], arg2[j], deep)) || (!deep && arg1[i] === arg2[j])) {
          if (equals(arg1[i], arg2[j])) {
            pass = true;
            break;
          }
        }
      }
      if (!pass) return false;
    }
    return true;
  } else if (arg1 instanceof Date && arg2 instanceof Date) {
    return arg1.toDateString() === arg2.toDateString();
  } else if (arg1 instanceof RegExp && arg2 instanceof RegExp) {
    return arg1.toString() === arg2.toString();
  } else if (arg1 instanceof Object && arg2 instanceof Object) {
    if (Object.keys(arg1).length !== Object.keys(arg2).length) return false;
    for (let prop1 in arg1) {
      if (arg1.hasOwnProperty(prop1)) {
        let pass = false;
        for (let prop2 in arg2) {
          if (arg2.hasOwnProperty(prop1)) {
            if ((deep && equals(arg1[prop1], arg2[prop2], deep)) || (!deep && arg1[prop1] === arg2[prop2])) {
              pass = true;
              break;
            }
          }
        }
        if (!pass) return false;
      }
    }
    return true;
  } else {
    return arg1 === arg2;
  }
}