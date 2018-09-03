export function toRegExp(pattern: string): RegExp {
  let parts;
  let flags;
  if (pattern.charAt(0) === '/') {
    parts = decodeURI(pattern).split('/');
    flags = parts.pop();
    pattern = parts.join('/').replace(/^\/|\/$/g, '');
  }

  return new RegExp(pattern, flags);
}