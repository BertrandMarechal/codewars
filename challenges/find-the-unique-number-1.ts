// https://www.codewars.com/kata/find-the-unique-number-1/train/typescript
export function findUniq(arr: Array<number>): number {
    let number = arr[0];
    if (number !== arr[arr.length - 1]) {
        if (number === arr[1]) {
            return arr[arr.length - 1];
        } else {
            return number;
        }
    }
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== number) {
            return arr[i];
        }
    }
}
