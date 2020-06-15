import { IObject } from "./";
import { equals } from "./equals";
import { getValue } from "./get-value";

export function compareValue(path: string, obj1: IObject, obj2: IObject): boolean {
  let value01 = getValue(obj1, path);
  let value02 = getValue(obj2, path);

  return equals(value01, value02, true);
}