export function range(start: number, end: number, step?: number) {
  let result: number[] = [];

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

export function shuffle(arr: any[]): any[] {
  let currentIndex = arr.length;
  let temporaryValue: any[];
  let randomIndex: number;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}