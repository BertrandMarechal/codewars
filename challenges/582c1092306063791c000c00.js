
// 

const findSmallest = (num) => {
    const numbers = num.split('').map(x => +x);
    let size = 1;
    let suite = [];
    let lastFoundSuite = [];
    let toFind = 0;
    while (size < numbers.length) {
        for (let i = 0; i < size; i++) {
            suite = [];
            let j = 0;
            while (j < 1) {
                // shifting counter
                let k = 0;
                while (k - i < numbers.length) {
                    suite.push(
                        numbers.slice(
                            Math.max(k - i, 0),
                            Math.min(k - i + size + j, numbers.length)
                        ).join('')
                    );
                    k = k + size;
                }
                // console.log(suite);

                // check if the number at position 0 is similar to 1 -1
                let p0 =
                    suite[0].length === size ?
                        new RegExp(`^${suite[1]}`)
                            .test(`${+suite[0] + 1}`) :
                        new RegExp(`${suite[0]}$`)
                            .test(`${+suite[1] - 1}`);

                // check if the last is the one before + 1
                let pmoins1 =
                    suite[suite.length - 2].length === size ?
                        new RegExp(`^${suite[suite.length - 1]}`)
                            .test(`${+suite[suite.length - 2] + 1}`) :
                        new RegExp(`${suite[suite.length - 2]}$`)
                            .test(`${+suite[suite.length - 1] - 1}`);

                // check if the ones in the middle are consecutive
                let consecutive = true;
                for (let l = 2; l < suite.length - 1 && consecutive; l++) {
                    consecutive = `${(+suite[l] + 1)}`.indexOf(`${(+suite[l + 1])}`) > -1;
                    if (!consecutive) {
                        if (process.env.log) {
                            console.log('Not consecutive', `${(+suite[l + 1])}`, `${(+suite[l]) + 1}`);
                        }
                    }
                }
                if (process.env.log) {
                    console.log(
                        size,
                        p0,
                        pmoins1,
                        consecutive,
                        suite);
                }
                if (suite.length === 2) {
                    if (p0 || pmoins1) {
                        let newToFind = suite[0].length === size ?
                            suite[0] : `${+suite[1] - 1}`;
                        if (!toFind || +newToFind < +toFind) {
                            lastFoundSuite = suite;
                            toFind = newToFind;
                            if (process.env.log) {
                                console.log('toFind = newToFind', toFind);
                            }
                        }
                    } else {
                        // if the lengths are != from the size, we might have parts of the expected number
                        // as 53635 => 536 / 35 for 3536 / 3537
                        // todo deal with this case
                    }
                } else if (p0 && pmoins1 && consecutive) {
                    toFind = suite[0].length === size ? suite[0] : suite[1];
                }
                j++;
            }
        }
        size++;
    }
    return toFind;
}
process.env.log = true;
console.log(findSmallest("456"));
// console.log(findSmallest("454"));
// console.log(findSmallest("455"));
// console.log(findSmallest("910"));
// console.log(findSmallest("9100"));
// console.log(findSmallest("99100"));
// console.log(findSmallest("00101"));
// console.log(findSmallest("00"));
// console.log(findSmallest("123456789"));
// console.log(findSmallest("1234567891"));
// console.log(findSmallest("123456798"));
// console.log(findSmallest("10"));
// console.log(findSmallest("11"));
// console.log(findSmallest("667"));
// console.log(findSmallest("949225100"));
// console.log(findSmallest("01"));
console.log(findSmallest("53635"));

// https://www.codewars.com/kata/582c1092306063791c000c00/train/javascript
function findPosition(num) {
    const numbers = num.split('').map(x => +x);
    let size = 1;
    let notFound = true;
    let suite = [];
    let lastFoundSuite = [];
    let toFind = 0;
    while (size < numbers.length && notFound) {
        for (let i = 0; i < size; i++) {
            suite = [];
            let j = 0;
            while (j < size) {
                // shifting counter
                let k = 0;
                while (k - i < numbers.length) {
                    suite.push(
                        numbers.slice(
                            Math.max(k - i, 0),
                            Math.min(k - i + size + j, numbers.length)
                        ).join('')
                    );
                    k = k + size;
                }

                // check if the number at position 0 is similar to 1 -1
                const p0 =
                    suite[0].length === size ?
                        new RegExp(`^${suite[1]}`)
                            .test(`${+suite[0] + 1}`) :
                        new RegExp(`${suite[0]}$`)
                            .test(`${+suite[1] - 1}`);

                // check if the last is the one before + 1
                let pmoins1 =
                    suite[suite.length - 2].length === size ?
                        new RegExp(`^${suite[suite.length - 1]}`)
                            .test(`${+suite[suite.length - 2] + 1}`) :
                        new RegExp(`${suite[suite.length - 2]}$`)
                            .test(`${+suite[suite.length - 1] - 1}`);

                // check if the ones in the middle are consecutive
                let consecutive = true;
                for (let l = 2; l < suite.length - 1 && consecutive; l++) {
                    consecutive = `${(+suite[l] + 1)}`.indexOf(`${(+suite[l + 1])}`) > -1;
                    if (!consecutive) {
                        if (process.env.log) {
                            console.log('Not consecutive', `${(+suite[l + 1])}`, `${(+suite[l]) + 1}`);
                        }
                    }
                }
                if (process.env.log) {
                    console.log(
                        p0,
                        pmoins1,
                        consecutive,
                        suite);
                }
                if (suite.length === 2) {
                    if (p0 || pmoins1) {
                        let newToFind = suite[0].length === size ?
                            suite[0] : `${+suite[1] - 1}`;
                        if (!toFind || +newToFind < +toFind) {
                            lastFoundSuite = suite;
                            toFind = newToFind;
                            if (process.env.log) {
                                console.log('toFind = newToFind', toFind);
                            }
                        }
                        notFound = false;
                    }
                } else if (p0 && pmoins1 && consecutive) {
                    notFound = false;
                }
                j++;
            }
        }
        if (notFound) {
            size++;
        }
    }
    if (notFound || /^0+[1-9][0-9]*0$|^0[1-9]+$/.test(num)) {
        // deal with crazy cases
        if (process.env.log) {
            console.log('deal with crazy cases');
        }
        if (+num === 0) {
            toFind = +(1 + num);
        } else if (num.match(/0+[1-9]/)) {
            const nums = num.match(/(0+)([1-9][0-9]*)/);
            toFind = +(nums[2] + nums[2]);
        } else {
            toFind = num;
        }
    } else if (!toFind) {
        toFind = suite[0];
        if (suite[0].length !== size) {
            toFind = +suite[1] - 1;
            if (`${+toFind}`.length !== size) {
                size--;
            }
        }
    } else {
        suite = lastFoundSuite;
        // size--;
    }

    // function
    let c = 0;
    for (let j = 1; j < size; j++) {
        c += (Math.pow(10, j) - Math.pow(10, j - 1)) * j;
    }
    if (process.env.log) {
        console.log(size, suite, toFind, c, notFound);
    }
    if (size > 1) {
        if (notFound) {
            c += (toFind - (Math.pow(10, size - 1) - 1)) * size;
        } else {
            c += (toFind - Math.pow(10, size - 1)) * size;
        }
    } else {
        c = toFind - 1;
    }
    if (process.env.log) {
        console.log(size, suite, toFind, c);
    }
    if (notFound) {
        if (process.env.log) {
            console.log('notFound');
        }
        if (`${toFind}`.length - num.length !== 0) {
            return c - (`${toFind}`.length - num.length);
        } else {
            return c - size;
        }
    } else {
        if (suite[0].length === size) {
            if (process.env.log) {
                console.log('found suite[0].length === size');
            }
            return c;
        } else {
            if (process.env.log) {
                console.log('found else');
                console.log(c, size, suite[0].length);
            }
            return c + (size - suite[0].length);
        }
    }
}

function assertEquals(n, a, b, c) {
    if (a !== b) {
        console.log('#### KO', n, a, b);
        process.env.log = true;
        findPosition(n);
        process.env.log = false;
        if (n.length < 10) {
            let t = '';
            let i = 1;
            while (t.indexOf(n) === -1) {
                t += i;
                i++;
            }
            console.log('...' + t.substr(- n.length * 3) + '...', n, i - 1, t.indexOf(n));
        }
        process.exit();
    } else {
        console.log('Ok ' + n);
    }
}

// assertEquals("456", findPosition("456"), 3, "...3456...");
// assertEquals("454", findPosition("454"), 79, "...444546...");
// assertEquals("455", findPosition("455"), 98, "...545556...");
// assertEquals("910", findPosition("910"), 8, "...7891011...");
// assertEquals("9100", findPosition("9100"), 188, "...9899100...");
// assertEquals("99100", findPosition("99100"), 187, "...9899100...");
// assertEquals("00101", findPosition("00101"), 190, "...99100101...");
// assertEquals("00", findPosition("00"), 190, "...9899100...");
// assertEquals("123456789", findPosition("123456789"), 0);
// assertEquals("1234567891", findPosition("1234567891"), 0);
// assertEquals("123456798", findPosition("123456798"), 1000000071);
// assertEquals("10", findPosition("10"), 9);
// assertEquals("11", findPosition("11"), 11);
// assertEquals("667", findPosition("667"), 122);
// assertEquals("949225100", findPosition("949225100"), 382689688);
// assertEquals("01", findPosition("01"), 10);

// assertEquals("53635", findPosition("53635"), 13034);
// assertEquals("040", findPosition("040"), 1091);
// assertEquals("99", findPosition("99"), 168);
// assertEquals("0404", findPosition("0404"), 15050);
// assertEquals("58257860625", findPosition("58257860625"), 24674951477);
// assertEquals("3999589058124", findPosition("3999589058124"), 6957586376885);
// assertEquals("555899959741198", findPosition("555899959741198"), 1686722738828503);
// assertEquals("091", findPosition("091"), 170);
// assertEquals("0910", findPosition("0910"), 2927);
// assertEquals("0991", findPosition("0991"), 2617);
// assertEquals("09910", findPosition("09910"), 2617);
// assertEquals("09991", findPosition("09991"), 35286);