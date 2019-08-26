export function truncate(str: string, length: number) {
  return `${str.slice(0, length)}...`;
}