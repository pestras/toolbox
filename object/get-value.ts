import { IObject } from "./";
import { valuefromPath } from "./value-from-path";

export function getValue(obj: IObject, path: string) { return valuefromPath(obj, path); }
