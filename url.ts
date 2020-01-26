import { URL as RootURL } from 'url';
import { parse } from './object/parse';
import { stringify } from './string/stringify';
import { strSplice } from './string/str-splice';

function cleanParam(param: string): string {
  param = param.slice(1);
  if (param.charAt(param.length - 1) === '?')
    param = param.slice(0, param.length - 1);
  return param;
}

export class PathPattern {
  private _parts: string[];
  private _pattern: string;
  private _params: string[];
  private _outputParams: string[];
  private _hasRest = false;
  private _hasOptional = false;

  constructor(pattern: string) {
    this._pattern = PathPattern.Clean(pattern);
    this.init();
  }

  static Clean(path: string) {
    if (!path)
      return "";

    path = path.trim()
      .replace(/\/$/g, "")
      .replace(/\/{2,}/g, "/")
      .replace(/(\w+)\/\.+/g, "$1");

    return path;
  }

  private init() {
    this._params = /:[a-z]\w*/g.exec(this._pattern);
    this._outputParams = this._params ? this._params.map(param => cleanParam(param)) : [];
    this._parts = this._pattern.split('/');
    this._hasRest = this._pattern.charAt(this._pattern.length - 1) === '*';
    this._hasOptional = this._pattern.charAt(this._pattern.length - 1) === '?';
  }

  get params(): string[] {
    return this._outputParams;
  }

  get pattern(): string {
    return this._pattern;
  }

  set pattern(value: string) {
    this._pattern = PathPattern.Clean(value);
    this.init();
  }

  match(path: string): boolean {
    path = PathPattern.Clean(path);
    let pathParts = path.split('/');

    if (this._parts.length > pathParts.length && !this._hasOptional) {
      if (this._parts.length - pathParts.length > 1)
        return false;
      else if (!this._hasOptional)
        return false;

    } else if (this._parts.length < pathParts.length && !this._hasRest) {
      return false;
    }


    for (let i = 0; i < this._parts.length; i++) {
      if (this._parts[i].charAt(0) !== ':' && this._parts[i] !== '*') {
        if (this._parts[i] !== pathParts[i])
          return false;
      }
    }

    return true;
  }

  getParamsObj(path: string) {
    path = PathPattern.Clean(path);
    let pathParts = path.split('/');
    let paramsObj: { [key: string]: string } = {};

    if (!this.match(path))
      return null;

    for (let i = 0; i < this._parts.length; i++) {
      if (this._parts[i].charAt(0) === ':') {
        paramsObj[cleanParam(this._parts[i])] = pathParts[i] || null;

      } else if (this._parts[i] === '*') {
        paramsObj['*'] = pathParts.slice(i).join('/');
      }
    }

    return paramsObj;
  }

  pathFromParamsObj(paramsObj: { [key: string]: string | number }) {
    let path = '';

    for (let i = 0; i < this._parts.length; i++) {
      path += '/';
      if (this._parts[i].charAt(0) === ':') {
        let param = this._parts[i];
        let isOptional = param.charAt(param.length - 1) === '?';
        param = cleanParam(this._parts[i]);

        if (paramsObj.hasOwnProperty(param)) {
          path += paramsObj[param] || '';
        } else if (!isOptional) {
          return null;
        } else {
          return PathPattern.Clean(path);
        }

      } else if (this._parts[i] === '*') {
        if (paramsObj.hasOwnProperty('*'))
          path += paramsObj['*'] || '';

        return PathPattern.Clean(path);

      } else {
        path += this._parts[i];
      }
    }

    return PathPattern.Clean(path);
  }
}

export class URL extends RootURL {
  queryObject: any;
  private _pathPattern: PathPattern;
  private _paramsObj: {[key: string]: string | number};

  constructor(href: string, base?: string | RootURL) {
    super(href, base);

    this.queryObject = this.search ? URL.QueryToObject(this.search.slice(1)) : {};
  }

  static QueryToObject(query: string): any {
    query = decodeURI(query);

    let result: any = {};
    let parts: any[] = query.split('&');

    for (let i = 0; i < parts.length; i++) {
      let part: any = parts[i];
      let pair: any[] = part.split('=');

      result[pair[0]] = pair[1] ? parse(pair[1]) : null;
    }

    return result;
  }

  static ObjectToQuery(obj: { [key: string]: any }, encode?: boolean): string {
    let result = "";
  
    if (!obj || !Object.keys(obj).length)
      return result;
  
    for (let prop in obj)
      result += '&' + prop + '=' + stringify(obj[prop]);
  
    return encode ? encodeURI(result.slice(1)) : result.slice(1);
  }

  static Clean(path: string) {
    if (!path)

      return "";

    path = path.trim()
      .replace(/^\/|\/$/g, "")
      .replace(/:\/\//, '%')
      .replace(/\/{2,}/g, "/")
      .replace(/(\w+)\/\.+/g, "$1")
      .replace('%', '://');

    return path;
  }

  static From(origin: string, pathname?: { pattern: string, params?: { [key: string]: string } } | string, searchObj?: any, hash?: string): URL {
    let url = new URL(origin);
    if (pathname) {
      if (typeof pathname === 'string')
        url.pathname = pathname;
      else {
        url.pathPattern = pathname.pattern;
        pathname.params ? url.pathParmsObj = pathname.params : url.pathname = '/';
      }
    }

    if (searchObj) {
      url.search = URL.ObjectToQuery(searchObj);
    }

    if (hash)
      url.hash = hash;

    return url;
  }

  set pathname(value: string) {
    if (this._pathPattern) {
      if (value === '/' || !value || this._pathPattern.match(value))
        super.pathname = value || '';
    } else {
      super.pathname = value || '';
    }
  }

  get pathname(): string {
    return super.pathname;
  }

  get pathPattern(): string {
    return this._pathPattern ? this._pathPattern.pattern : null;
  }

  set pathPattern(value: string) {
    let pp = new PathPattern(value);
    if (super.pathname !== '/' && !pp.match(super.pathname))
      throw 'invalid existing pathname';

    this._pathPattern = pp;

    if (super.pathname === '/') {
      this._paramsObj = {};

      for (let key of this._pathPattern.params)
        this._paramsObj[key] = null;
        
    } else {
      this._paramsObj = this._pathPattern.getParamsObj(super.pathname);
    }
  }

  get pathParmsObj(): { [key: string]: string | number } {
    return this._paramsObj || null;
  }

  set pathParmsObj(value: { [key: string]: string | number }) {
    if (this._pathPattern) {
      super.pathname = this._pathPattern.pathFromParamsObj(value);
      this._paramsObj = value;
    }
  }

  setPathParam(key: string, value: string | number) {
    if (!this._paramsObj || (!this._paramsObj.hasOwnProperty(key) && key !== '*'))
      return;

    this._paramsObj[key] = value;
    this.pathParmsObj = this._paramsObj;
  }

  isSecure(): boolean {
    return this.protocol.charAt(this.protocol.length - 2) === 's';
  }

  secure(enable: boolean = true) {
    if (enable && !this.isSecure())
      this.protocol = strSplice(this.protocol, this.protocol.length - 1, 0, 's');
    else if (!enable && this.isSecure())
      this.protocol = strSplice(this.protocol, this.protocol.length - 2, 1);
  }
}