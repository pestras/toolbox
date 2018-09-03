import { IObject } from "./";

export function extend(dest: IObject | any[], src: IObject | any[], overwrite: boolean = true): any {
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