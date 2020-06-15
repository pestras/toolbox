import { IObject } from "./";
import { cleanPropPath } from "./clean-prop-path";

// export function getValue(obj: IObject, path: string) { return valuefromPath(obj, path); }

export function getValue(src: IObject, path: string): any { 
  let parts = cleanPropPath(path).split('.');
  let currentField = parts.shift();

  if (!currentField) return src;
  if (!src || typeof src !== "object") return;

  if (currentField === '$') {
    if (!Array.isArray(src)) return;
    return src.map(item => getValue(item, parts.join('.')));
  }

  if (Array.isArray(src)) {
    if (!isNaN(Number(currentField))) return getValue(src[+currentField], parts.join('.'));
    else return src[currentField as 'length'];
  }

  if (parts.length === 0) return src[currentField];
  else return getValue(src[currentField], parts.join('.'));
}