import { IObject } from "./";
import { setValue } from "./set-value";

export function injectValue(obj: IObject, path: string, value: any) { return setValue(obj, path, value, true); }
