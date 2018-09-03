import { IObject } from "./";
import { compareValue } from "./compare-value";

export function compareValues(paths: string[], obj1: IObject, obj2: IObject): boolean {
  for (let i = 0; i < paths.length; i++)
    if (!compareValue(paths[i], obj1, obj2))
      return false;

  return true;
}