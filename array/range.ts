export function range(start: number, end?: number, step?: number) {
  let result: number[] = [];

  if (start > 0 && end === undefined) {
    for (let i = 0; i <= start; i++)
      result.push(i);
    
    return result;
  }

  if ((start !== 0 && !start) || (end !== 0 && !end))
    return result;

  step = step || 1
  step = Math.abs(step);
  step = start < end ? step : step *= -1;

  let counter = start;

  while (true) {
    result.push(counter);
    counter += step;

    if ((step < 0 && counter < end) || (step > 0 && counter > end))
      break;
  }

  return result;
}