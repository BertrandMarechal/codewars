// https://www.codewars.com/kata/sorted-yes-no-how/train/typescript
export function isSortedAndHow(array: number[]): string {
    const expectedOrder: string = (array[0] < array[1] ? 'ascending' : 'descending');
    if (expectedOrder == 'ascending') {
        for (let i = 1; i < array.length; i++) {
            if (array[i] < array[i - 1]) {
                return 'no';
            }
        }
    } else {
        for (let i = 1; i < array.length; i++) {
            if (array[i] > array[i - 1]) {
                return 'no';
            }
        }
    }
    return `yes, ${expectedOrder}`;
}