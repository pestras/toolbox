import { IObject } from "./";

export function hasOwnDeepProp(src: IObject | any[], propName: string): boolean {
  if (!src)
    return false;

  if (typeof src === "object") {
    if (src.hasOwnProperty(propName))
      return true;

    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        if (typeof src[i] === "object")
          if (hasOwnDeepProp(src[i], propName))
            return true;
      }

    } else {
      for (let prop in src) {  
        if (typeof src[prop] === "object")
          if (hasOwnDeepProp(src[prop], propName))
            return true;
      }
    }
  }

  return false;
}