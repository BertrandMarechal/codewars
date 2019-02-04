//return the total number of smiling faces in the array
export function countSmileys(arr: string[]) {
    const regex = /[:;][-~]{0,1}[\)D])/;
    return arr.filter(x => regex.test(x)).length;
}