import { cleanPropPath } from "./clean-prop-path";

export function valuefromPath(src: any, path: string, newValue?: any, inject?: boolean): any {
  if (typeof src !== "object")
    return undefined;

  let parts = cleanPropPath(path).split('.');

  if (parts.length === 1) {
    if (newValue === undefined) {
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

    if (parts.length === 1)
      return valuefromPath(src[currentField], parts[0], newValue, inject);

    if (!isNaN(Number(parts[0])))
      return valuefromPath(src[currentField][Number(parts[0])], parts.slice(1).join('.'), newValue, inject);

      return valuefromPath(src[currentField], parts.join('.'), newValue, inject);
  }

  return valuefromPath(src[currentField], parts.join('.'), newValue, inject);
}