// https://www.codewars.com/kata/585aad11f59b3c25500001d4/train/typescript
export function pingPong(startNumber: number, endNumber: number): string {
  const returnArray = [];
  for (let i = startNumber; i < endNumber + 1; i++) {
    returnArray.push(((i % 3 ? '' : 'Ping') + (i % 5 ? '' : 'Pong')) || i);
  }
  return returnArray.join(' ');
}