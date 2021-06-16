import { IObject } from "./";

export function size(obj: IObject): number {
  if (!obj) return 0;
  
  if (Object.keys)
    return Object.keys(obj).length;

  let count = 0;

  for (let prop in obj)
    if (obj.hasOwnProperty(prop))
      count += 1;

  return count;
}