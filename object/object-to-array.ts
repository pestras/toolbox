export function objectToArray<T>(obj: { [key: string]: T }, key: string): T[] {
  let arr: T[] = [];

  for (let prop in obj) {
    arr.push({ [key]: prop, ...(<any>obj[prop]) });
  }

  return arr;
}