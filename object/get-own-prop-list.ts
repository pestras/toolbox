import { IObject } from "./";

export function getOwnPropList(src: IObject | any[], propName: string): {[key: string]: any } {
  let result: any = {};

  function search(src: IObject | any[], propName: string, path?: string): {[key: string]: any } {
    if (!src)
      return null;
  
    if (typeof src === "object") {
      if (src.hasOwnProperty(propName))
        result[path ? path + '.' + propName : propName] = (<IObject>src)[propName];
  
      if (Array.isArray(src)) {
        for (let i = 0; i < src.length; i++) {
          if (typeof src[i] === "object") {
            let currPath = path ? `${path}[${i}]` : `[${i}]`;
            let subResults = search(src[i], propName, currPath);
            if (subResults && Object.keys(subResults).length)
              Object.assign(result, subResults);
          }          
        }
  
      } else {
        for (let prop in src) {
          if (typeof src[prop] === "object") {
            let currPath = path ? `${path}.${prop}` : prop;
            let subResults = search(src[prop], propName, currPath);
            if (subResults && Object.keys(subResults).length)
              Object.assign(result, subResults);
          }          
        }
      }
    }
    
    return Object.keys(result).length ? result : null;
  }
  
  search(src, propName);
  return Object.keys(result).length ? result : null;
}