export function dontGiveMeFive(start:number, end:number) : number {
    let returnNumber = 0;
    const regex5 = /[5]/;
    for (let i = start; i < end + 1; i++) {
        if (!regex5.test(i.toString())) {
            returnNumber++;
        }
    }
    return returnNumber;
}