// https://www.codewars.com/kata/fold-an-array/train/typescript
export function foldArray(array: number[], runs: number): number[] {
    let localArray = [].concat(array);
    for (let i = 0; i < runs; i++) {
        let newArray = [];
        for (let j = 0; j < Math.floor(localArray.length / 2); j++) {
            newArray.push(localArray[j] + localArray[localArray.length - 1 - j]);
        }
        if (localArray.length%2 === 1) {
            newArray.push(localArray[Math.floor(localArray.length / 2)]);
        }
        localArray = [].concat(newArray);
    }

    return localArray;
}
console.log(foldArray([ 1, 2, 3, 4, 5 ], 2));