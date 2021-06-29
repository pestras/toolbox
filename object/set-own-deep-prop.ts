export function setOwnDeepProp(src: any, prop: string, value: any | ((val: any) => any)) {

  if (typeof src !== "object" || src === null)
    return;

  if (src[prop] !== undefined)
    (<any>src)[prop] = typeof value === "function" ? value((<any>src)[prop]) : value;

  for (let key in src) {
    setOwnDeepProp(src[key], prop, value)
  }
}