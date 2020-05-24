import { flatten } from "./flatten";
import { getValue } from "./get-value";

export function hasChanges(obj1: any, obj2: any, keys: string[] = []) {
  if (!obj1 && !obj2) return obj1 !== obj2;
  if (!obj1 || !obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj1 !== 'object') return obj1 !== obj2;
  if (obj1 instanceof Date && obj2 instanceof Date) return obj1.getTime() !== obj2.getTime();
  if (obj1 instanceof Date || obj2 instanceof Date) return true;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return true;

  if (keys.length > 0) {
    for (let key of keys) if (hasChanges(getValue(obj1, key), getValue(obj2, key))) return true;
    return false;
  }
  
  let obj1Flat = flatten(obj1);
  let obj2Flat = flatten(obj2);
  
  if (Object.keys(obj1Flat).length !== Object.keys(obj2Flat).length) return true;
  
  for (let path in obj1Flat) if (!obj2Flat.hasOwnProperty(path) || obj2Flat[path] !== obj1Flat[path]) return true;
  
  return false;
}