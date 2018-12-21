export function arrayToObject<T>(arr: T[], key?: string): { [key: string]: T } {
  let obj = <{ [key: string]: T }>{};

  for (let i = 0; i < arr.length; i++) {
    let currentKey = key ? (<any>arr[i])[key] : ("" + i);
    obj[currentKey] = arr[i];
  }

  return obj;
}