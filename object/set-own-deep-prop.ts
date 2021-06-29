import { IObject } from "./";

export function setOwnDeepProp(src: IObject | any[], propName: string, value: any | ((val: any) => any)) {

  if (typeof src === "object" && src !== null) {
    if (src.hasOwnProperty(propName))
      (<any>src)[propName] = typeof value === "function" ? value((<any>src)[propName]) : value;

    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        if (typeof src[i] === "object")
          setOwnDeepProp(src[i], propName, value)
      }

    } else {
      for (let prop in src) {  
        if (typeof src[prop] === "object")
          setOwnDeepProp(src[prop], propName, value)
      }
    }
  }
}