import { IObject, isObject } from "./";

export function describe(obj: IObject, indent: number): void {
  if (isObject(obj) || Array.isArray(obj))
    console.log(JSON.stringify(obj, null, indent || 2));
  else
    console.log(obj);
}