import { cleanPropPath } from "./clean-prop-path";

export function valuefromPath(src: any, path: string, newValue?: any, inject?: boolean): any {
  if (typeof src !== "object")
    return undefined;


  let parts = cleanPropPath(path).split('.');
  let currentField = parts.shift();

  if (!src) return parts.length > 0 ? undefined : src;

  if (currentField === '$') {

    if (!Array.isArray(src))
      return;

    return handleAnonymousArrayIndex(src, parts.join('.'), newValue, inject);
  }

  if (parts.length === 0) {
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

  if (src[currentField] === undefined)
    if (inject && parts[0] !== '$')
      src[currentField] = !isNaN(Number(parts[0])) ? [] : {};
    else
      return undefined;

  if (Array.isArray(src[currentField])) {

    if (parts[0] === '$') {
      return handleAnonymousArrayIndex(src[currentField], parts.slice(1).join('.'), newValue, inject);
    }

    if (src[currentField].length === 0 && inject && parts.length > 1)
      src[currentField][0] = {};

    if (parts.length === 1)
      return valuefromPath(src[currentField], parts[0], newValue, inject);

    if (!isNaN(Number(parts[0])))
      return valuefromPath(src[currentField][Number(parts[0])], parts.slice(1).join('.'), newValue, inject);
  }

  return valuefromPath(src[currentField], parts.join('.'), newValue, inject);
}

function handleAnonymousArrayIndex(src: any[], path: string, newValue: any, inject: boolean) {
  let result: any[] = [];

  for (let i = 0; i < src.length; i++) {
    if (!path) {
      if (newValue)
        src[i] = newValue;

      result.push(src[i]);
    } else {
      let val: any = valuefromPath(src[i], path, newValue, inject);

      if (val)
        result.push(val);
    }
  }

  return result;
}