export function setOwnDeepBulkProps(src: any | any[], props: string[], value: any | ((val: any, prop: string) => any)) {

  if (typeof src !== "object" || src === null)
    return;

  for (let key in src) {
    let index = props.indexOf(key);
    console.log(key, index);
    if (index > -1) {
      (<any>src)[key] = typeof value === "function" ? value((<any>src)[key], props[index]) : value;
    } else {
      setOwnDeepBulkProps((<any>src)[key], props, value);
    }
  }
}