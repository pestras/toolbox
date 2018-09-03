import { IObject } from "./";

export function getOwnPropList(src: IObject | any[], propName: string, path?: string): {[key: string]: any } {
  let result: any = {};
  path = path ? path + '.' : '';

  if (!src)
    return null;

  if (typeof src === "object") {
    if (src.hasOwnProperty(propName))
      result[path + propName] = (<IObject>src)[propName];

    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        if (typeof src[i] === "object") {
          let subResults = getOwnPropList(src[i], propName, path + i);
          if (subResults && Object.keys(subResults).length)
            Object.assign(result, subResults);
        }          
      }

    } else {
      for (let prop in src) {
        if (typeof src[prop] === "object") {
          let subResults = getOwnPropList(src[prop], propName, path + prop);
          if (subResults && Object.keys(subResults).length)
            Object.assign(result, subResults);
        }          
      }
    }
  }

  return Object.keys(result).length ? result : null;
}