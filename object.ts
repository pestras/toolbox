export interface IObject {
  [key: string]: any;
}

export function cleanPropPath(path: string = ""): string {
  return path
    .replace(/\[|\]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .replace(/\.{2,}/g, ".");
}

export function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function desc(obj: IObject, indent: number): void {
  if (isObject(obj) || Array.isArray(obj))
    console.log(JSON.stringify(obj, null, indent || 2));
  else
    console.log(obj);
}

export function size(obj: IObject): number {
  if (Object.keys)
    return Object.keys(obj).length;

  let count = 0;

  for (let prop in obj)
    if (obj.hasOwnProperty(prop))
      count += 1;

  return count;
}

export function extend(dest: any, src: any, overwrite: boolean = true): any {
  if (Array.isArray(src)) {
    dest = dest || [];
    for (let i = 0; i < src.length; i++) {
      if (Object.prototype.toString.call(src[i]) === "[object Object]") {
        if ((Object.prototype.toString.call(dest[i]) !== "[object Object]" && overwrite) || dest[i] === undefined) {
          dest[i] = {};
          extend(dest[i], src[i], overwrite);
        } else if (Object.prototype.toString.call(dest[i]) === "[object Object]") {
          extend(dest[i], src[i], overwrite);
        }

      } else if (Array.isArray(src[i])) {
        if ((!Array.isArray(src[i]) && overwrite) || dest[i] === undefined) {
          dest[i] = [];
          extend(dest[i], src[i], overwrite);
        } else if (Array.isArray(src[i])) {
          extend(dest[i], src[i], overwrite);
        }

      } else if (dest[i] === undefined || overwrite) {
        dest[i] = src[i];
      }
    }
  } else {
    dest = dest || {};
    for (let prop in src) {
      if (src.hasOwnProperty(prop)) {
        if (Object.prototype.toString.call(src[prop]) === "[object Object]") {
          if ((Object.prototype.toString.call(dest[prop]) !== "[object Object]" && overwrite) || dest[prop] === undefined) {
            dest[prop] = <any>{};
            extend(dest[prop], src[prop], overwrite);

          } else if (Object.prototype.toString.call(dest[prop]) === "[object Object]") {
            extend(dest[prop], src[prop], overwrite);
          }

        } else if (Array.isArray(src[prop])) {
          if ((!Array.isArray(src[prop]) && overwrite) || dest[prop] === undefined) {
            dest[prop] = <any>[];
            extend(dest[prop], src[prop], overwrite);

          } else if (Array.isArray(src[prop])) {
            extend(dest[prop], src[prop], overwrite);
          }

        } else if (dest[prop] === undefined || overwrite) {
          dest[prop] = src[prop];
        }
      }
    }
  }

  return dest;
}

export function getValue(obj: IObject, path: string) { return fromPath(obj, path); }
export function setValue(obj: IObject, path: string, value: any) { return fromPath(obj, path, value); }
export function injectValue(obj: IObject, path: string, value: any) { return fromPath(obj, path, value, true); }

export function hasPropertyPath(src: any, path: string): boolean {
  let parts = cleanPropPath(path).split('.');

  if (parts.length === 1)
    return src.hasOwnProperty(path);

  let temp = src;

  for (let i = 0; i < parts.length; i++) {
    if (!temp.hasOwnProperty(parts[i]))
      return false;

    temp = temp[parts[i]];
  }

  return true;
}

export function hasOwnDeepProperty(src: any, propName: string): boolean {
  if (!src)
    return false;

  if (typeof src === "object") {
    if (src.hasOwnProperty(propName))
      return true;

    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        if (typeof src[i] === "object")
          if (hasOwnDeepProperty(src[i], propName))
            return true;
      }

    } else {
      for (let prop in src) {  
        if (typeof src[prop] === "object")
          if (hasOwnDeepProperty(src[prop], propName))
            return true;
      }
    }
  }

  return false;
}

export function getOwnPropertyList(src: any, propName: string, path?: string): {[key: string]: any } {
  let result: any = {};
  path = path ? path + '.' : '';

  if (!src)
    return null;

  if (typeof src === "object") {
    if (src.hasOwnProperty(propName))
      result[path + propName] = src[propName];

    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        if (typeof src[i] === "object") {
          let subResults = getOwnPropertyList(src[i], propName, path + i);
          if (subResults && Object.keys(subResults).length)
            Object.assign(result, subResults);
        }          
      }

    } else {
      for (let prop in src) {
        if (typeof src[prop] === "object") {
          let subResults = getOwnPropertyList(src[prop], propName, path + prop);
          if (subResults && Object.keys(subResults).length)
            Object.assign(result, subResults);
        }          
      }
    }
  }

  return Object.keys(result).length ? result : null;
}

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

export function parse(str: string): any {
  var result: any;
  var type: string;

  if (str === 'null') return null;
  if (str === 'undefined') return undefined;
  if (!isNaN(Number(str))) return Number(str);
  if (str === 'true') return true;
  if (str === 'false') return false;

  if (str.charAt(0) === '/') {
    let parts = decodeURI(str).split('/');
    let flags = parts.pop();
    str = parts.join('/').replace(/^\/|\/$/g, '');
    return new RegExp(str, flags);
  }

  if (str.charAt(0) === '{') {
    result = {};
    type = 'object';
  } else if (str.charAt(0) === '[') {
    result = [];
    type = 'array'
  } else return decodeURI(str);

  str = decodeURI(str).slice(1, -1);

  let temp: any = { value: '', prop: '' }
  let context: string = type === 'array' ? 'value' : 'prop';
  let level: number = 0;

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === ':' && level === 0 && type === 'object') {
      context = 'value';
      continue;
    } else if (str.charAt(i) === '[') {
      level++;
    } else if (str.charAt(i) === ']') {
      level--;
    } if (str.charAt(i) === '{') {
      level++;
    } else if (str.charAt(i) === '}') {
      level--;
    } else if (str.charAt(i) === ',' && level === 0) {
      if (type === 'array') {
        result.push(temp.value.trim());
      } else {
        result[temp.prop.trim()] = temp.value.trim();
        context = 'prop';
      }

      temp.prop = '';
      temp.value = '';
      continue;
    }

    temp[context] += str.charAt(i);

    if (i === str.length - 1) {
      if (type === 'array') result.push(temp.value.trim());
      else result[temp.prop.trim()] = temp.value.trim();
    }
  }

  if (type === 'array')
    result = result.map((prop: any) => parse(prop));
  else
    for (let prop in result)
      result[prop] = parse(result[prop]);

  return result;
}

export function queryStrToObject(query: string): any {
  query = decodeURI(query);

  let result: any = {};
  let parts: any[] = query.split('&');

  for (let i = 0; i < parts.length; i++) {
    let part: any = parts[i];
    let pair: any[] = part.split('=');

    result[pair[0]] = pair[1] ? parse(pair[1]) : null;
  }

  return result;
}

export function pick(obj: any, props: string[]): any {
  let result: any = {};
  for (let i = 0; i < props.length; i++) {
    let path = cleanPropPath(props[i]).split('.');

    if (path.length === 1) {
      result[props[i]] = obj[props[i]];
      continue;
    }

    result[path[0]] = result[path[0]] || {};
    let temp = result;
    let currentvalue = obj[path[0]];
    for (let j = 1; j < path.length; j++) {
      currentvalue = currentvalue[path[j]];
      if (j === path.length - 1) {
        temp[path[j - 1]][path[j]] = currentvalue;
        break;
      }
      temp[path[j - 1]][path[j]] = temp[path[j - 1]][j] || {};
      temp = temp[path[j - 1]];
    }
  }

  return result;
}

export function omit(obj: any, props: string[]): any {
  for (let i = 0; i < props.length; i++) {
    let path = cleanPropPath(props[i]).split('.');

    if (path.length === 1) {
      delete obj[props[i]];
      continue;
    }

    let temp = obj;
    for (let j = 0; j < path.length; j++) {
      temp = temp[path[j]];
      if (j === path.length - 2) {
        delete temp[path[j + 1]];
        break;
      }
    }
  }

  return obj;
}

export function compareValue(path: string, obj1: any, obj2: any): boolean {
  let value01 = fromPath(obj1, path);
  let value02 = fromPath(obj2, path);

  return equals(value01, value02, true);
}

export function compareValues(paths: string[], obj1: any, obj2: any): boolean {
  for (let i = 0; i < paths.length; i++)
    if (!compareValue(paths[i], obj1, obj2))
      return false;

  return true;
}

export function getChanges(obj1: any, obj2: any): { count: number, changes: [any, any]} {
  let results: any = { count: 0, changes: [{}, {}] };

  if (obj1 === obj2)
    return results;

  if ((typeof obj1 !== 'object' && typeof obj2 !== 'object') || (obj1 === null || obj2 === null)) {
    results.changes[0] = obj1;
    results.changes[1] = obj2;
    results.count++;
    return results;
  }

  let obj1Size = Object.keys(obj1).length;
  let obj2Size = Object.keys(obj2).length;

  if (obj1Size === 0 || obj2Size === 0) {
    results.changes[0] = obj1;
    results.changes[1] = obj2;
    results.count++;
    return results;
  }

  let ref1 = obj1Size >= obj2Size ? obj1 : obj2;
  let ref2 = obj1Size >= obj2Size ? obj2 : obj1;
  let swipe = ref1 === obj2;

  for (let prop in ref1) {
    if (ref2[prop] === ref1[prop])
      continue;

    if (!ref2.hasOwnProperty(prop)) {
      results.changes[swipe ? 1 : 0][prop] = ref1[prop];
      results.count++;
      continue;
    }

    if (typeof ref1[prop] === 'object' && typeof ref2[prop] === 'object') {
      if (Array.isArray(ref1[prop])) {
        if (Array.isArray(ref2[prop])) {
          if (ref1[prop].length === ref2[prop].length) {
                results.changes[0][prop] = [];
                results.changes[1][prop] = [];
            for ( let i = 0; i < ref1[prop].length; i++) {
              let subResults = getChanges(ref1[prop][i], ref2[prop][i]);
              if (subResults.count > 0) {
                results.changes[0][prop].push(swipe ? subResults.changes[1] : subResults.changes[0]);
                results.changes[1][prop].push(swipe ? subResults.changes[0] : subResults.changes[1]);
                results.count++;
              }
            }

            if (results.changes[0][prop].length === 0) {
              delete results.changes[0][prop];
              delete results.changes[1][prop];
            }

            continue;
          }
        }

      } else {

        let subResults = getChanges(ref1[prop], ref2[prop]);
        if (subResults.count > 0) {
          results.changes[0][prop] = swipe ? subResults.changes[1] : subResults.changes[0];
          results.changes[1][prop] = swipe ? subResults.changes[0] : subResults.changes[1];
          results.count++;
        }

        continue;
      }
    }

    results.changes[0][prop] = swipe ? ref2[prop] : ref1[prop];
    results.changes[1][prop] = swipe ? ref1[prop] : ref2[prop];
    results.count++;
  }

  for (let prop in ref2) {
    if (!ref1.hasOwnProperty(prop)) {
      results.changes[swipe ? 0 : 1][prop] = ref2[prop];
      results.count++;
    }
  }

  return results;
}

export function getArrayChanges(arr1: any[], arr2: any[], key: string): { count: number; changes: [any, any]; _id: string }[] {
  let arrRef1 = arr1.length > arr2.length ? arr1 : arr2;
  let arrRef2 = arr1.length > arr2.length ? arr2 : arr1;
  let swipe = arrRef1 === arr1 ? false : true;
  let results: any = {};

  for (let i = 0; i < arrRef1.length; i++) {
    let compareElm = arrRef2.find(elm => elm[key] === arrRef1[i][key]) || null;
    let compareResults = getChanges(swipe ? compareElm : arrRef1[i], swipe ? arrRef1[i] : compareElm);

    if (compareResults.count > 0)
      results[arrRef1[i][key]] = compareResults;
  }

  for (let i = 0; i < arrRef2.length; i++) {
    let compareElm = arrRef1.find(elm => elm[key] === arrRef2[i][key]) || null;

    if (!compareElm) {
      results[arrRef1[i][key]] = { count: 1, changes: [swipe ? arrRef2[i] : null, swipe ? null : arrRef2[i]] };
    }
  }

  return results;
}

export function arrayToObject<T>(arr: T[], key: string): { [key: string]: T } {
  let obj = <{ [key: string]: T }>{};

  for (let i = 0; i < arr.length; i++) {
    obj[(<any>arr[i])[key]] = arr[i];
  }

  return obj;
}

// Privates
// --------------------------------------------------------------------------------------------------------------------------------------
function fromPath(src: any, path: string, newValue?: any, inject?: boolean): any {
  if (typeof src !== "object")
    return src;

  let parts = cleanPropPath(path).split('.');

  if (parts.length === 1) {
    if (!newValue) {
      return src[path];
    } else if (inject || src.hasOwnProperty(path)) {
      if (typeof newValue === "function")
        return src[path] = newValue(src[path])
      else
        return src[path] = newValue;
    } else {
      return undefined;
    }
  }

  let currentField = parts.shift();

  if (src[currentField] === undefined)
    if (inject)
      src[currentField] = {};
    else
      return undefined;

  if (Array.isArray(src[currentField])) {
    if (Number(parts[0])) {
      if (parts.length === 1)
        return fromPath(src[currentField], parts[0], newValue, inject);
      else
        return fromPath(src[currentField][Number(parts[0])], parts.slice(1).join('.'), newValue, inject);
    }

    let results = [];

    for (let i = 0; i < src[currentField].length; i++)
      results.push(fromPath(src[currentField][i], parts.join('.'), newValue, inject));

    return results;
  }

  return fromPath(src[currentField], parts.join('.'), newValue, inject);
}