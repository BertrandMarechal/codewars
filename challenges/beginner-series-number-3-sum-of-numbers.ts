export class Kata {
    static getSum(a: number, b: number) {
        if (a === b) {
            return a;
        }
        if (b < a) {
            const c = a;
            a = b;
            b = c;
        }
        let returnNumber = a + b;
        for (let i = a + 1; i < b; i++) {
            returnNumber += i;
        }
        return returnNumber;
    }
  }