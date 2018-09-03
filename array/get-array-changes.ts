import { getChanges } from "../object/get-changes";

export function getArrayChanges(arr1: any[], arr2: any[], key: string): { [key: string]: { count: number; changes: [any, any]; }} {
  let arrRef1 = arr1.length > arr2.length ? arr1 : arr2;
  let arrRef2 = arr1.length > arr2.length ? arr2 : arr1;
  let swipe = arrRef1 === arr1 ? false : true;
  let results: any = {};

  for (let i = 0; i < arrRef1.length; i++) {
    let compareElm = arrRef2.find(elm => elm[key] === arrRef1[i][key]) || null;
    let compareResults = getChanges(swipe ? compareElm : arrRef1[i], swipe ? arrRef1[i] : compareElm);

    if (compareResults.count > 0)
      results[arrRef1[i][key]] = compareResults;
  }

  for (let i = 0; i < arrRef2.length; i++) {
    let compareElm = arrRef1.find(elm => elm[key] === arrRef2[i][key]) || null;

    if (!compareElm) {
      results[arrRef1[i][key]] = { count: 1, changes: [swipe ? arrRef2[i] : null, swipe ? null : arrRef2[i]] };
    }
  }

  return results;
}