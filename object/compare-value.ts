import { IObject } from "./";
import { valuefromPath } from "./value-from-path";
import { equals } from "./equals";

export function compareValue(path: string, obj1: IObject, obj2: IObject): boolean {
  let value01 = valuefromPath(obj1, path);
  let value02 = valuefromPath(obj2, path);

  return equals(value01, value02, true);
}