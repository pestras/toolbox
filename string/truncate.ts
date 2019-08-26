export function truncate(str: string, length: number) {
  return length >= str.length ? str : `${str.slice(0, length)}...`;
}