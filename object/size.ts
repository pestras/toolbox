import { IObject } from "./";

export function size(obj: IObject): number {
  if (Object.keys)
    return Object.keys(obj).length;

  let count = 0;

  for (let prop in obj)
    if (obj.hasOwnProperty(prop))
      count += 1;

  return count;
}