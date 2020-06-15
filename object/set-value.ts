import { IObject } from "./";
import { cleanPropPath } from "./clean-prop-path";

export function setValue(src: IObject, path: string, value: any, inject?: boolean): void
export function setValue(src: IObject, path: string, value: (curr: any) => any, inject?: boolean): void
export function setValue(src: IObject, path: string, value: any | ((curr: any) => any), inject = false): void {
  let parts = cleanPropPath(path).split('.');
  let currentField = parts.shift();

  if (!src || typeof src !== "object") return undefined;

  if (currentField === '$') {
    if (!Array.isArray(src)) return;
    for (let i = 0; i < src.length; i++)
      if (parts.length === 0) {
        if (typeof value === 'function') src[i] = value(src[i]);
        else src[i] = value;
      } else setValue(src[i], parts.join('.'), value, inject);
    return;
  }

  if (parts.length === 0) {
    if (inject || src.hasOwnProperty(path)) {
      if (typeof value === 'function') src[currentField] = value(src[currentField])
      else src[currentField] = value;
      return;
    }
  }

  if (src[currentField] === undefined)
    if (inject && parts[0] !== '$') src[currentField] = !isNaN(Number(parts[0])) ? [] : {};
    else return;

  if (Array.isArray(src[currentField])) {
    if (parts[0] === '$') {
      parts.shift();
      for (let i = 0; i < src[currentField].length; i++)
        if (parts.length === 0) src[currentField][i] = value;
        else setValue(src[currentField][i], parts.join('.'), value, inject);
      return;
    }

    if (src[currentField].length === 0 && inject && parts.length > 1) src[currentField][0] = {};
    if (parts.length === 1) return setValue(src[currentField], parts[0], value, inject);
    if (!isNaN(Number(parts[0]))) return setValue(src[currentField][Number(parts[0])], parts.slice(1).join('.'), value, inject);
  }

  return setValue(src[currentField], parts.join('.'), value, inject);
} 