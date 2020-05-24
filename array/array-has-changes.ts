import { hasChanges } from "../object/has-changes";

export function arrayHasChanges(arr1: any[], arr2: any[], key?: number | string, keys: string[] = []) {
  if (!arr1 && !arr2) return false;
  if (!arr1 || !arr2) return true;
  if (arr1.length !== arr2.length) return true;

  if (!key) return false;
  
  let arr1Map = new Map<string | number, any>();

  for (let item of arr1) arr1Map.set(item[key], item);

  for (let item of arr2)
    if (!arr1Map.has(item[key]) || hasChanges(item, arr1Map.get(item[key]), keys)) return true;

  return false;
}