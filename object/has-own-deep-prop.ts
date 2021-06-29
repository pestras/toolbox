export function hasOwnDeepProp(src: any, prop: string): boolean {
  if (typeof src !== "object" || src === null)
    return false;

  if (src[prop] !== undefined)
    return true;

  for (let key in src) {
    if (hasOwnDeepProp(src[key], prop))
      return true;
  }

  return false;
}