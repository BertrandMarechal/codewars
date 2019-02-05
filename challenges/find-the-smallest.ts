// https://www.codewars.com/kata/find-the-smallest/train/typescript
let log = false;
export class G964 {

    public static smallest(n: number): number[] {
        const nAsString = n.toString();
        //check if ordered
        if (/^1*2*3*4*5*6*7*8*9*$/.test(nAsString)) {
            return [n, 0, 0];
        }
        let from = -1, to = -1, newNumber = -1;
        // check if zeros
        const nAsArray = nAsString.split('');
        if (/^[1-9]00/.test(nAsString)) {
            // in this case we take 0 to the first item's index
            from = 0;

            let regexNextDigit = new RegExp(`0([${+nAsArray[0]}-9])`).exec(nAsString);
            if (nAsArray[0] !== '1') {
                regexNextDigit = new RegExp(`0[1-${+nAsArray[0] - 1}]*([${+nAsArray[0]}-9])`).exec(nAsString);
            }
            if (regexNextDigit) {
                if (regexNextDigit[1] === nAsArray[0]) {
                    to = regexNextDigit.index;
                } else {
                    to = regexNextDigit.index + regexNextDigit[0].indexOf(regexNextDigit[1]) - 1;
                }
            } else {
                to = nAsString.length - 1;
            }
        } else if (/^[1-9]0/.test(nAsString)) {
            if (+nAsArray[0] < +nAsArray[2]) {
                const lastZeroIndex = (/0[1-9]*$/.exec(nAsString) as any).index;
                from = lastZeroIndex === 1 ? 0 : lastZeroIndex;
            } else {
                from = 0;
            }
            
            if (from === 0) {
                to = (new RegExp(`[${nAsArray[0]}-9]`).exec(nAsString.substr(1)) as any).index;
            } else {
                to = 0;
            }
        } else {
            // is first highest ?
            if (!/0/.test(nAsString) && nAsArray[0] === '9' || !new RegExp(`[${+nAsArray[0] + 1}-9]`).test(nAsString)) {
                from = 0;
                to = nAsString.length - 1;
            } else {
                // get the smallest and higher number id
                let smallest = 10, higher = -1, orderedSoFar = true;
                for (let i = 0; i < nAsArray.length; i++) {
                    const element = +nAsArray[i];
                    orderedSoFar = orderedSoFar && (i === 0 || smallest < element);
                    if (!orderedSoFar ) {
                        // smallest = element;
                        if (smallest > element) {
                            smallest = element;
                        }
                        if (higher < element) {
                            higher = element;
                        }
                    }
                }
                // get one number with the last smallest in front
                const lastSmallest = new RegExp(`${smallest}+[${smallest + 1}-9]*?$`).exec(nAsString);
                const firstHigher = new RegExp(`${higher}`).exec(nAsString);
                // if (log) {
                //     console.log(`${smallest}+[${smallest + 1}-9]*?$`, smallest, lastSmallest, higher, firstHigher);
                // }
                if (firstHigher && firstHigher.index === 0 && lastSmallest && lastSmallest.index === nAsString.length - 1) {
                    from = 0;
                    to = nAsString.length - 1;
                } else if (firstHigher && (!lastSmallest || lastSmallest.index === 0)) {
                    const nextHigher = new RegExp(`[${higher === 9 ? 9 : higher + 1}-9]`).exec(nAsString.substr(firstHigher.index + 1));
                    from = firstHigher.index;
                    // console.log(`[${higher + 1}-9]`, nextHigher);
                    
                    to = (nextHigher ? nextHigher.index : nAsString.length) - 1;
                } else if (lastSmallest) {
                    // look for the index where we will put the smallest
                    const regex = new RegExp(`[${smallest}-9]`).exec(nAsString);
                    if (regex && !regex.index) {
                        if (+`${smallest}${nAsArray[0]}` < +`${nAsArray[1]}${nAsArray[2]}`)  {
                            from = lastSmallest.index;
                            to = regex ? regex.index : 0;
                        } else {
                            from = 0;
                            const firstRegexIndex = (new RegExp(`[${nAsArray[0]}-9]`).exec(nAsString.substr(1)) as any).index;
                            to = firstRegexIndex;
                        }
                    } else {
                        from = lastSmallest.index;
                        to = regex ? regex.index : 0;
                    }
                }
            }


        }

        const number = nAsArray.splice(from, 1)[0];

        if (newNumber === -1) {
            nAsArray.splice(to, 0, number);
            newNumber = +nAsArray.join('');
        }
        if (from === 1 && to === 0) {
            from--;
            to++;
        }
        return [newNumber, from, to];

    }
}

const tests = [
    {number: 123456, result: [123456, 0, 0]},
    {number: 1000000, result: [1, 0, 6]},
    {number: 1000001, result: [11, 0, 5]},
    {number: 5000244, result: [2445, 0, 6]},
    {number: 5000166, result: [1566, 0, 4]},
    {number: 2000001, result: [12, 0, 6]},
    {number: 1000002, result: [12, 0, 5]},
    {number: 311111, result: [111113, 0, 5]},
    {number: 261235, result: [126235, 2, 0]},
    {number: 209917, result: [29917, 0, 1]},
    {number: 269045, result: [26945, 3, 0]},
    {number: 285365, result: [238565, 3, 1]},
    {number: 296837, result: [239687, 4, 1]},
    {number: 187863002809, result: [18786300289, 10, 0]},
    {number: 935855753, result: [358557539, 0, 8]},
    {number: 13525232695182840, result: [1352523269518284, 16, 0]},
    {number: 5086750413549728, result: [508675413549728, 6, 0]},
    {number: 94883608842, result: [9488368842, 6, 0]},
    {number: 539158022110124, result: [53915802211124, 11, 0]},
    {number: 6463647658439697, result: [3646364765849697, 11, 0]},
    {number: 2695641211924676, result: [1269564121924676, 8, 0]},
    {number: 2364603846610085, result: [236460384661085, 12, 0]},
    {number: 8695471138827885, result: [1869547138827885, 6, 0]},
    {number: 5034322112203018, result: [343221122030158, 0, 14]},
    {number: 8243389226767632, result: [2433889226767632, 0, 4]},
    {number: 162477, result: [124677, 1, 3]},
    {number: 545484, result: [454548, 5, 0]},
];

const compareArrays = (arr1: number[], arr2: number[]): boolean => {
    return arr1.reduce((agg, curr, i) => agg && curr == arr2[i], true);
}

for (let i = 0; i < tests.length; i++) {
    const element = tests[i];
    if (!compareArrays(G964.smallest(element.number), element.result)) {
        log = true;
        console.log(
            element.number,
            G964.smallest(element.number), element.result
        );
        log = false;
    }
}    