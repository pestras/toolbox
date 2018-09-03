export function arrayToObject<T>(arr: T[], key: string): { [key: string]: T } {
  let obj = <{ [key: string]: T }>{};

  for (let i = 0; i < arr.length; i++) {
    obj[(<any>arr[i])[key]] = arr[i];
  }

  return obj;
}