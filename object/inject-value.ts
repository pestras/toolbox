import { IObject } from "./";
import { valuefromPath } from "./value-from-path";

export function injectValue(obj: IObject, path: string, value: any) { return valuefromPath(obj, path, value, true); }
