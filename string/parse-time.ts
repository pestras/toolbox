export function parseTime(timeStr: string): number {
  let time = 0;
  let parts = timeStr.split(' ');
  let map: { [key: string]: number } = { y: 217728000, o: 18144000, w: 604800, d: 86400, h: 3600, m: 60, s: 1 };

  parts.forEach(function (part) {
    if (!part.length) return time += 0;

    let amount = part.slice(0, -1),
      unit = part.slice(-1);

    if (map.hasOwnProperty(unit))
      time += map[unit] * parseInt(amount, 10);
  });

  return time * 1000;
}