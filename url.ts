import { stringify } from './string/stringify';

function parse(str: string): any {
  var result: any;
  var type: string;

  if (str === 'null') return null;
  if (str === 'undefined') return undefined;
  if (!isNaN(Number(str))) return Number(str);
  if (str === 'true') return true;
  if (str === 'false') return false;

  if (str.charAt(0) === '/') {
    let parts = decodeURI(str).split('/');
    let flags = parts.pop();
    str = parts.join('/').replace(/^\/|\/$/g, '');
    return new RegExp(str, flags);
  }

  if (str.charAt(0) === '{') {
    result = {};
    type = 'object';
  } else if (str.charAt(0) === '[') {
    result = [];
    type = 'array'
  } else return decodeURI(str);

  str = decodeURI(str).slice(1, -1);

  let temp: any = { value: '', prop: '' }
  let context: string = type === 'array' ? 'value' : 'prop';
  let level: number = 0;

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === ':' && level === 0 && type === 'object') {
      context = 'value';
      continue;
    } else if (str.charAt(i) === '[') {
      level++;
    } else if (str.charAt(i) === ']') {
      level--;
    } if (str.charAt(i) === '{') {
      level++;
    } else if (str.charAt(i) === '}') {
      level--;
    } else if (str.charAt(i) === ',' && level === 0) {
      if (type === 'array') {
        result.push(temp.value.trim());
      } else {
        result[temp.prop.trim()] = temp.value.trim();
        context = 'prop';
      }

      temp.prop = '';
      temp.value = '';
      continue;
    }

    temp[context] += str.charAt(i);

    if (i === str.length - 1) {
      if (type === 'array') result.push(temp.value.trim());
      else result[temp.prop.trim()] = temp.value.trim();
    }
  }

  if (type === 'array')
    result = result.map((prop: any) => parse(prop));
  else
    for (let prop in result)
      result[prop] = parse(result[prop]);

  return result;
}
  
function objectToQueryStr(obj: { [key: string]: any }, encode?: boolean): string {
  let result = "";

  if (!obj || !Object.keys(obj).length)
    return result;

  for (let prop in obj)
    result += '&' + prop + '=' + stringify(obj[prop]);

  return encode ? encodeURI(result.slice(1)) : result.slice(1);
}

function getPath(url: string): string {
  if (url.indexOf('://') > -1)
    url = url.split('://')[1];

  if (url.indexOf('#') > -1)
    url = url.split('#')[0];

  if (url.indexOf('?') > -1)
    url = url.split('?')[0];

  let urlBlocks = url.split('/');
  urlBlocks.shift();

  return '/' + urlBlocks.join('/');
}

function clean(path: string): string {
  if (!path)
    return "";

  path = path.trim()
    .replace(/^\/|\/$/g, "")
    .replace(/:\/\//, '%')
    .replace(/\/{2,}/g, "/")
    .replace('%', '://')
    .replace(/(\w+)\/\.\./g, "$1");

  return path;
}

function getQuery(url: string) {
  let query = url.split('?')[1] || "";

  if (query.indexOf('#'))
    query = query.split('#')[0];

  return query;
}

function queryStrToObject(query: string): any {
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

function getParamsObject(url: string, pattern: string): any {
  let params = pattern.match(/:\w+/g) || [];
  let patternPathBlocks = getPath(pattern).split('/');
  let urlPathBlocks = getPath(url).split('/');
  let results: any = {};

  for (let i = 0; i < patternPathBlocks.length; i++) {
    for (let j = 0; j < params.length; j++)
      if (params[j] === patternPathBlocks[i])
        results[params.splice(j--, 1)[0].slice(1)] = urlPathBlocks[i];
  }

  return results;
}

function getHash(url: string) {
  if (url.indexOf('#') === -1)
    return null;

  let hash = url.split('#')[1];

  if (hash.indexOf('?') > -1)
    return hash.split('?')[0];

  return hash;
}

function getOrigin(url: string) {
  if (url.indexOf('?') > -1)
    url = url.split('?')[0];

  if (url.indexOf('#') > -1)
    url = url.split('#')[0];

  let protocol = "";

  if (url.indexOf('://') > -1)
    [protocol, url] = url.split('://');

  if (url.indexOf('/') > -1)
    url = url.split('/')[0];

  return `${protocol}://${url}`;
}

function matchPathPattern(url: string, pattern:string) {
  let patternBlocks = URL.Clean(pattern).split('/');
  let paramsNames = pattern.match(/(:[a-zA-Z0-9_-]+\??)/g) || [];
  let urlBlocks = URL.Clean(URL.GetPath(url)).split('/');

  if (urlBlocks.length > patternBlocks.length) {
    if (pattern.charAt(pattern.length - 1) === '*')
      return true
    
    return false;
  }

  for (let i = 0; i < patternBlocks.length; i++) {
    if (paramsNames.indexOf(patternBlocks[i]) > -1)
      if (urlBlocks[i] || patternBlocks[i].indexOf('?') > -1)
        continue;

    if (patternBlocks[i] !== urlBlocks[i])
      return false;
  }

  return true;
}

function generateServiceUrl(pattern: string, params: { [key: string]: string } = {}, query: any = null): string {
  let path = "";

  path = pattern.replace(/(:[a-zA-Z0-9_]+\??\*?)/g, (match, $1) => {
    let key = $1.slice(1);

    if (key.indexOf('?') > -1)
      return params ? params[key.slice(0, key.length - 1)] || '' : '';

    return params ? params[key] || '' : '';
  });

  path = URL.Clean(path);

  if (query && Object.keys(query).length)
    path += '?' + URL.ToQuery(query);

  return path;
}

/**
 * URL class
 * =================================================================================================================================
 */
export class URL {
  private _paramsNames: string[];
  private _pathPattern: string;
  private _url: string;
  private _path: string;
  private _query: string;
  private _hostname: string;
  private _origin: string;
  private _protocol: string;
  private _hash: string;
  private _isSecure: boolean;
  private _params: { [key: string]: string } = {};

  constructor(url?: string, pattern?: string) {
    this._url = url || null;
    this._pathPattern = pattern || null;

    if (url)
      this._prepare();
  }

  static Clean(url: string) {
    return clean(url);
  }

  static GetPath(url: string): string {
    return getPath(url);
  }

  static GetQuery(url: string): string {
    return getQuery(url);
  }

  static GetQueryObject(url: string): any {
    return queryStrToObject(getQuery(url));
  }

  static ToQuery(value: any): string {
    return objectToQueryStr(value);
  }

  static GetHash(url: string): string {
    return getHash(url);
  }

  static GetOrigin(url: string): string {
    return getOrigin(url);
  }

  static GetHostName(url: string): string {
    return getOrigin(url).split('://')[1];
  }

  static GetProtocol(url: string): string {
    return getOrigin(url).split('://')[0];
  }

  static MatchPattern(url: string, pattern: string): boolean {
    return matchPathPattern(url, pattern);
  }

  static From(pattern: string, params: { [key: string]: string } = null, query: any = null): string {
    return generateServiceUrl(pattern, params, query);
  }

  private _prepare() {
    this._path = getPath(this.url);
    this._query = getQuery(this.url);
    this._origin = getOrigin(this.url);
    [this._protocol, this._hostname] = this._origin.split('://');
    this._hash = getHash(this.url);
    this._isSecure = this._protocol.charAt(this._protocol.length - 1) === 's';

    if (this.pathPattern)
      this._prepareParams();
  }

  private _prepareParams() {
    this._paramsNames = (this._pathPattern.match(/:\w+/g) || []).map(entry => entry.slice(1));
    this._params = getParamsObject(this.url, this._pathPattern);
  }

  get url() { return this._url; }
  set url(value: string) {
    if (!this._pathPattern || (this._pathPattern && matchPathPattern(value, this._pathPattern))) {
      this._url = value;
      this._prepare();
    } else {
      console.warn('url set was deinied due to unmatched current path pattern');
    }
  }

  get pathPattern() { return this._pathPattern; }
  set pathPattern(value: string) {
    if (!value)
      return;

      if (this._url && matchPathPattern(this._url, value)) {
        this._pathPattern = value;
        this._prepareParams();
      } else {        
        console.warn('path pattern set was deinied due to unmatched current url');
      }
  }

  get params(): {[key: string]: string} { return Object.assign({}, this.params); }
  set params(value: {[key: string]: string}) {
    this._params = value || {};
    this._url = generateServiceUrl(this.pathPattern, this._params, this.queryObject);
  }

  get query() { return this._query; }
  set query(value: any) {
    if (typeof value === "object") {
      let queryObject = value || {};
      this._query = objectToQueryStr(queryObject);
      this.url = generateServiceUrl(this.pathPattern, this.params, queryObject);
    }
  }

  get queryObject(): any { return queryStrToObject(this._query); }
  get path() { return this._path; }
  get origin() { return this._origin; }
  get hostname() { return this._hostname; }
  get protocol() { return this._protocol; }
  get hash() { return this._hash; }
  get isSecure() { return this._isSecure; }
  get paramsNames() { return this._paramsNames; }

  toString() { return this.url; }
  toLocalString() { return this.url; }

  matchPathPattern(url?: string): boolean {
    if (this._pathPattern)
      return matchPathPattern(url || this.url, this._pathPattern);

    return false;
  }

  setParam(key: string, value: string) {
    if (this._params.hasOwnProperty(key)) {
      this._params[key] = value || '';
      this._url = generateServiceUrl(this.pathPattern, this.params, this.queryObject);
    }
  }
}