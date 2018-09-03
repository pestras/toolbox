import { IObject } from "./";
import { valuefromPath } from "./value-from-path";

export function setValue(obj: IObject, path: string, value: any) { return valuefromPath(obj, path, value); }
