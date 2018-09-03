import { IObject } from ".";

export function flatten(src: IObject | any[], prefix?: string): { [key: string]: any } {
  let result: any = {};

  if (!src || typeof src !== "object")
    return null;

  if (Array.isArray(src)) {
    for (let i = 0; i < src.length; i++) {
      let currentPath = prefix ? `${prefix}[${i}]` : `[${i}]`;

      if (typeof src[i] === "object" && src[i]) {
        result = { ...result, ...flatten(src[i], currentPath)}
      } else {
        result[currentPath] = src[i];
      }
    }
  } else {

    for (let prop in src) {
      let currentPath = prefix ? prefix + "." + prop : prop;

      if (typeof src[prop] === "object" && src[prop]) {
        result = { ...result, ...flatten(src[prop], currentPath)}
      } else {
        result[currentPath] = src[prop];
      }
    }

  }

  return result;
}