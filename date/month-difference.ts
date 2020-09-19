export function monthDiff(start: Date, end: Date) {
  let months: number;

  months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth() + (end.getDate() - start.getDate() >= 28 ? 1 : 0);
  return months <= 0 ? 0 : months;
}