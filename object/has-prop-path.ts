import { cleanPropPath } from "./clean-prop-path";

export function hasPropPath(src: any, path: string): boolean {
  let parts = cleanPropPath(path).split('.');

  if (parts.length === 1)
    return src.hasOwnProperty(path);

  let temp = src;

  for (let i = 0; i < parts.length; i++) {
    if (!temp.hasOwnProperty(parts[i]))
      return false;

    temp = temp[parts[i]];
  }

  return true;
}