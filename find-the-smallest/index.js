function smallest(n) {
    const params = {
        number: n,
        numberAsString: `${n}`,
        previous: 0,
        lowest: 10,
        lowestIndex: -1,
        firstIsHighest: true,
        firstHasSiblings: false
    }
    params.numberAsArray = params.numberAsString.split('').map(x => +x);
    params.hasZero = /0/.test(params.numberAsString);
    params.hasZeroAfterFirst = params.numberAsArray[1] === 0;
    params.hasMultipleZeroAfterFirst = params.numberAsArray[1] === 0 && params.numberAsArray[2] === 0;
    params.firstSuperiorToSecond = params.numberAsArray[0] > params.numberAsArray[1];
    params.ordered = params.numberAsArray[1] >= params.numberAsArray[0];
    params.onlyZerosAfterFirst = params.hasMultipleZeroAfterFirst;
    params.onlySameNumberIfZeros = params.hasMultipleZeroAfterFirst;

    for (let i = 0; i < params.numberAsArray.length; i++) {
        if (i > 0 && params.firstIsHighest && params.numberAsArray[0] < params.numberAsArray[i]) {
            params.firstIsHighest = false;
        }
        if (i > 0) {
            params.firstHasSiblings = params.firstHasSiblings || params.numberAsArray[0] === params.numberAsArray[i];
        }
        if (params.numberAsArray[i] === 0) {
            params.lastZero = i;
        }
        if (params.ordered) {
            if (params.previous > params.numberAsArray[i]) {
                params.ordered = false;
            } else {
                params.previous = params.numberAsArray[i];
            }
        }
        if (!params.ordered){
            if (params.numberAsArray[i] < params.lowest) {
                params.lowest = params.numberAsArray[i];
                params.lowestIndex = i;
            }
        }
        if (i > 0 && params.onlyZerosAfterFirst) {
            params.onlyZerosAfterFirst = params.onlyZerosAfterFirst && params.numberAsArray[i] === 0;
        }
        if (params.hasMultipleZeroAfterFirst) {
            if (params.numberAsArray[0] < params.numberAsArray[i]) {
                if (!params.highestNumberAfterFirstIndex ||
                        (
                            params.highestNumberAfterFirstIndex &&
                            params.numberAsArray[params.highestNumberAfterFirstIndex] < params.numberAsArray[i]
                        )
                    ) {
                        params.highestNumberAfterFirstIndex = i;
                }
            }
            params.onlySameNumberIfZeros = params.onlySameNumberIfZeros && 
                (
                    params.numberAsArray[0] === params.numberAsArray[i] ||
                    params.numberAsArray[i] === 0
                )
        }
    }
    if (process.env.local) {
        console.log(params);
    }
    if (params.ordered) {
        // number already ordered, we do nothing
        return [n, 0, 0];
    } else if (params.hasMultipleZeroAfterFirst) {
        if (params.highestNumberAfterFirstIndex) {
            const first = params.numberAsArray.splice(0, 1);
            const newNumber =
                params.numberAsArray.splice(0, params.highestNumberAfterFirstIndex - 1).join('') +
                `${first}` +
                params.numberAsArray.join('');
            return [+newNumber, 0, params.highestNumberAfterFirstIndex - 1];
        } else {
            if (params.onlyZerosAfterFirst) {
                return [params.numberAsArray[0], 0, params.numberAsArray.length - 1];
            } else if(params.onlySameNumberIfZeros) {
                const newNumber = `${params.numberAsArray[0]}` +
                    params.numberAsArray.splice(params.lastZero + 1, params.numberAsArray.length).join('');
                return [+newNumber, 0, params.lastZero];
            } else {
                const newNumber =
                    params.numberAsArray.splice(params.lastZero + 1, params.numberAsArray.length).join('') +
                    `${params.numberAsArray[0]}`;
                return [+newNumber, 0, params.numberAsString.length - 1];
            }
        }
    } else if (params.hasZero) {
        if (params.hasZeroAfterFirst && params.lastZero === 1) {
            const number = params.numberAsArray.splice(0, 1);
            const newIndex = new RegExp(`[${number}-9]`).exec(params.numberAsString.substr(1));
            params.numberAsArray.splice(newIndex.index, 0, number);
            const newNumber = params.numberAsArray.join('');
            return [+newNumber, 0, newIndex.index];
        }
        const toReturn = [];
        //check if we have other same value before
        let index = params.lastZero - 1;
        while(index > 0) {
            if (params.numberAsArray[index] === 0) {
                params.lastZero = index;
            } else {
                break;
            }
            index--;
        }

        params.numberAsArray.splice(params.lastZero, 1);
        const newNumber = params.numberAsArray.join('');
        if (params.lastZero === 1) {
            toReturn[0] = +newNumber;
            toReturn[1] = 0;
            toReturn[2] = 1;
            [+newNumber, 0, 1];
        } else {
            toReturn[0] = +newNumber;
            toReturn[1] = params.lastZero;
            toReturn[2] = 0;
        }
        return toReturn;
    } else {
        // we are in a case where there are no zeros
        // we have lowest and lowest index to sort our things out

        if (params.firstIsHighest) {
            // if (!params.firstHasSiblings) {
                params.numberAsArray.push(params.numberAsArray.splice(0, 1));
                const newNumber = params.numberAsArray.join('');
                return [+newNumber, 0, params.numberAsArray.length - 1];
            // }
        }
        let higherSameIndex = params.lowestIndex;
        let suite = false;
        for (let i = params.lowestIndex + 1; i < params.numberAsArray.length; i++) {
            if (params.lowest === params.numberAsArray[i]) {
                if (!suite) {
                    higherSameIndex = i;
                    suite = true;
                }
            } else {
                suite = false;
            }
        }
        //check if we have other same value before
        let index = higherSameIndex - 1;
        while(index > 0) {
            if (params.numberAsArray[index] === params.lowest) {
                higherSameIndex = index;
            } else {
                break;
            }
            index--;
        }
        const newIndex = new RegExp(`[${params.lowest}-9]`).exec(params.numberAsString);
        params.numberAsArray.splice(higherSameIndex, 1);
        params.numberAsArray.splice(newIndex.index, 0, params.lowest);
        const newNumber = params.numberAsArray.join('');
        return [+newNumber, higherSameIndex, newIndex.index];
    }
}

module.exports = smallest;