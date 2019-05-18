//https://www.codewars.com/kata/mine-sweeper/train/javascript
function solveMine(map, n, l) {
    // if (!l) {
    //     console.log(map);
    //     console.log(n);
    // }

    //conding and coding..
    const myMap = map
        .split(/\n/g)
        .map(x => x.split(' ').map(c => ({
            value: c,
            solved: c !== '?', // if we found the value
            resolved: c === '0' || c === 'x' // if we have found the bomb around
        })));
    // if (!l) {
    //     console.log(myMap.map((line, i) => {
    //         return line.map((cell, j) => {
    //             try {
    //                 return open(i, j);
    //             } catch (error) {
    //                 return 'x'
    //             }
    //         }).join(' ');
    //     }).join('\n'));
    // }
    // find zeros
    let somethingChanged = true;
    const logAndOpen = (x, y) => {
        const opened = open(x, y);
        if (process.env.log) {
            console.log(`opened ${x} ${y} => ${opened}`);
        }
        return opened;
    }

    while (somethingChanged) {
        while (somethingChanged) {
            somethingChanged = false;
            for (let i = 0; i < myMap.length; i++) {
                for (let j = 0; j < myMap[i].length; j++) {
                    const cell = myMap[i][j];
                    if (cell.value !== 'x') {
                        // we check the cells around, for 0s
                        for (let k = -1; k < 2 && cell.value === '?'; k++) {
                            for (let l = -1; l < 2 && cell.value === '?'; l++) {
                                if (Math.abs(k) + Math.abs(l) !== 0) {
                                    if (myMap[i + k] && myMap[i + k][j + l]) {
                                        if (myMap[i + k][j + l].value === '0') {
                                            cell.value = logAndOpen(i, j);
                                            somethingChanged = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (cell.value !== '?' && !cell.resolved) {
                            // get the count of bombs around. if we found them all, cell is resolved, and the other ? are dummies
                            let questionMarksCoords = [];
                            let bombCount = 0;
                            for (let k = -1; k < 2; k++) {
                                for (let l = -1; l < 2; l++) {
                                    if (Math.abs(k) + Math.abs(l) !== 0) {
                                        if (myMap[i + k] && myMap[i + k][j + l]) {
                                            if (myMap[i + k][j + l].value === '?') {
                                                questionMarksCoords.push([i + k, j + l]);
                                            } else if (myMap[i + k][j + l].value === 'x') {
                                                bombCount++;
                                            }
                                        }
                                    }
                                }
                            }
                            if (bombCount === +cell.value) {
                                cell.resolved = true;
                                for (let k = 0; k < questionMarksCoords.length; k++) {
                                    myMap[questionMarksCoords[k][0]][questionMarksCoords[k][1]].value =
                                        logAndOpen(questionMarksCoords[k][0], questionMarksCoords[k][1]);
                                    if (myMap[questionMarksCoords[k][0]][questionMarksCoords[k][1]].value === '0') {
                                        myMap[questionMarksCoords[k][0]][questionMarksCoords[k][1]].resolved = true;
                                    }
                                }
                                somethingChanged = true;
                            }
                        }
                    }
                }
            }
        }
        let somethingChanged2 = true;
        while (somethingChanged2) {
            somethingChanged2 = false;
            for (let i = 0; i < myMap.length; i++) {
                for (let j = 0; j < myMap[i].length; j++) {
                    const cell = myMap[i][j];
                    if (!cell.resolved) {
                        // we check the cells around, and check if nb ? = value
                        let questionMarksCoords = [];
                        let bombCount = 0;
                        for (let k = -1; k < 2; k++) {
                            for (let l = -1; l < 2; l++) {
                                if (Math.abs(k) + Math.abs(l) !== 0) {
                                    if (myMap[i + k] && myMap[i + k][j + l]) {
                                        if (myMap[i + k][j + l].value === '?') {
                                            questionMarksCoords.push([i + k, j + l]);
                                        } else if (myMap[i + k][j + l].value === 'x') {
                                            bombCount++;
                                        }
                                    }
                                }
                            }
                        }
                        if (process.env.log && +cell.value) {
                            console.log(i, j, questionMarksCoords.length, bombCount, +cell.value);
                        }
                        if (questionMarksCoords.length + bombCount === +cell.value) {
                            cell.resolved = true;
                            for (let k = 0; k < questionMarksCoords.length; k++) {
                                myMap[questionMarksCoords[k][0]][questionMarksCoords[k][1]].value = 'x';
                                myMap[questionMarksCoords[k][0]][questionMarksCoords[k][1]].resolved = true;
                            }
                            somethingChanged2 = true;
                            somethingChanged = true;
                        }
                    }
                }
            }
        }
    }
    const isSolved = myMap.filter(x => x.filter(y => y.value === '?').length > 0).length === 0;
    const bombCount = myMap.reduce((agg, x) => agg + x.filter(y => y.value === 'x').length, 0);

    if (isSolved || bombCount === n) {
        return myMap.map(l => l.map(c => c.value).join(' ')).join('\n');
    } else {
        // we got to a point, we have unknown we cannot figure out with what we have
        // we will get all the ? coords, and try all the combinaisons, and see if it works
        const questionMarksCoords = [];
        for (let i = 0; i < myMap.length; i++) {
            for (let j = 0; j < myMap[i].length; j++) {
                if (myMap[i][j].value === '?') {
                    questionMarksCoords.push([i, j]);
                }
            }
        }
        const combinations = [];
        const bombsToPlace = n - bombCount;

        for (let i = 1; i < Math.pow(2, questionMarksCoords.length); i++) {
            let current = i;
            let binary = '';
            while (current > 0) {
                binary = (current % 2) + binary; current = Math.floor(current / 2);
            }
            binary = binary.split('').reverse().join('') + '0'.repeat(questionMarksCoords.length - binary.length);
            const bombsPlaced = (binary.match(/1/g) || []).length
            if (bombsToPlace === bombsPlaced) {
                combinations.push(binary.split('').map(x => +x));
            }
        }
        if (process.env.log) {
            console.log('we got to a point, we have unknown we cannot figure out with what we have');
            console.log(bombsToPlace, combinations.length);
            console.log(myMap.map(l => l.map(c => c.value).join(' ')).join('\n'));
        }


        const possibleOutputs = [];
        for (let i = 0; i < combinations.length; i++) {
            const combination = combinations[i];
            const newMap = myMap.map(l => l.map(c => c.value));

            for (let j = 0; j < combination.length; j++) {
                if (combination[j]) {
                    newMap[questionMarksCoords[j][0]][questionMarksCoords[j][1]] = 'x';
                }
            }

            let gridIsValid = true;
            for (let i1 = 0; i1 < newMap.length && gridIsValid; i1++) {
                for (let i2 = 0; i2 < newMap[i1].length && gridIsValid; i2++) {
                    let bombs = +newMap[i1][i2];
                    if (bombs) {

                        for (let d1 = -1; d1 < 2; d1++) {
                            for (let d2 = -1; d2 < 2; d2++) {
                                if (Math.abs(d1) + Math.abs(d2) !== 0) {
                                    if (newMap[i1 + d1] && newMap[i1 + d1][i2 + d2] && newMap[i1 + d1][i2 + d2] === 'x') {
                                        bombs--;
                                    }
                                }
                            }
                        }
                        gridIsValid = bombs === 0;
                    }
                }
            }
            if (gridIsValid) {
                if (process.env.log) {
                    console.log('gridIsValid');
                    console.log(newMap.map(x => x.join(' ')).join('\n'));
                }
                possibleOutputs.push(newMap.map(x => x.join(' ')).join('\n'));
                if (possibleOutputs.length > 1) {
                    return '?';
                }
            }

        }
        if (possibleOutputs.length === 1) {
            const solvedMine = solveMine(possibleOutputs[0], n);
            return solvedMine;
        } else {
            return '?';
        }
    }
}


const cases = [
    {
        map:
            `? ? ? ? ? ?
? ? ? ? ? ?
? ? ? 0 ? ?
? ? ? ? ? ?
? ? ? ? ? ?
0 0 0 ? ? ?`,
        result:
            `1 x 1 1 x 1
2 2 2 1 2 2
2 x 2 0 1 x
2 x 2 1 2 2
1 1 1 1 x 1
0 0 0 1 1 1`,
        m: 6,
        out: `1 x 1 1 x 1
2 2 2 1 2 2
2 x 2 0 1 x
2 x 2 1 2 2
1 1 1 1 x 1
0 0 0 1 1 1`
    },
    {
        map:
            `0 ? ?
0 ? ?`,
        result:
            `0 1 x
0 1 1`,
        m: 1,
        out: '?'
    },
    {
        map:
            `0 ? ?
0 ? ?`,
        result:
            `0 2 x
0 2 x`,
        m: 2,
        out: `0 2 x
0 2 x`
    },
    {
        map: `? ? ? ? 0 0 0
? ? ? ? 0 ? ?
? ? ? 0 0 ? ?
? ? ? 0 0 ? ?
0 ? ? ? 0 0 0
0 ? ? ? 0 0 0
0 ? ? ? 0 ? ?
0 0 0 0 0 ? ?
0 0 0 0 0 ? ?`,
        result: `1 x x 1 0 0 0
2 3 3 1 0 1 1
1 x 1 0 0 1 x
1 1 1 0 0 1 1
0 1 1 1 0 0 0
0 1 x 1 0 0 0
0 1 1 1 0 1 1
0 0 0 0 0 1 x
0 0 0 0 0 1 1`,
        m: 6,
        out: `1 x x 1 0 0 0
2 3 3 1 0 1 1
1 x 1 0 0 1 x
1 1 1 0 0 1 1
0 1 1 1 0 0 0
0 1 x 1 0 0 0
0 1 1 1 0 1 1
0 0 0 0 0 1 x
0 0 0 0 0 1 1`
    },
    {
        map: `0 0 0 0 0 0 0 0 0 0 0 0 ? ? ? 0 0 0 0 0 0 0 0 ? ? ? ? ? ? 0
0 0 0 0 0 0 0 0 0 0 0 0 ? ? ? 0 ? ? ? 0 0 0 0 ? ? ? ? ? ? 0
? ? ? 0 0 0 0 ? ? ? 0 0 0 0 ? ? ? ? ? 0 0 0 0 ? ? ? ? ? ? 0
? ? ? ? ? ? 0 ? ? ? ? ? 0 0 ? ? ? ? ? 0 0 0 0 ? ? ? 0 0 0 0
? ? ? ? ? ? 0 ? ? ? ? ? 0 0 ? ? ? ? 0 0 0 0 0 ? ? ? 0 0 ? ?
0 ? ? ? ? ? 0 0 0 ? ? ? 0 ? ? ? ? ? 0 0 0 0 0 ? ? ? 0 0 ? ?
0 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? 0 0 0 ? ? ? ? ? ? ?
0 0 0 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? 0 ? ? ? 0 0 ? ? ? 0
0 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? 0 ? ? ? 0 0 ? ? ? 0
? ? ? ? 0 ? ? ? ? 0 0 0 ? ? ? ? ? ? ? 0 0 ? ? ? 0 0 ? ? ? 0
? ? ? ? 0 ? ? ? ? ? 0 0 ? ? ? ? ? ? ? 0 0 0 ? ? ? 0 0 0 0 0
? ? ? ? ? ? ? ? ? ? 0 0 ? ? ? ? ? ? ? 0 0 0 ? ? ? ? 0 0 0 0
? ? ? ? ? ? ? ? ? ? 0 0 0 0 ? ? ? ? ? 0 0 0 ? ? ? ? 0 0 0 0
? ? ? ? ? ? ? 0 0 ? ? ? 0 0 ? ? ? 0 0 0 0 0 ? ? ? ? 0 0 0 0
? ? ? ? 0 0 0 0 0 ? ? ? 0 0 ? ? ? 0 0 0 0 0 ? ? ? 0 0 0 0 0`,
        result: `0 0 0 0 0 0 0 0 0 0 0 0 1 x 1 0 0 0 0 0 0 0 0 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 1 1 1 0 0 0 0 2 x 2 1 x 1 0
1 1 1 0 0 0 0 1 1 1 0 0 0 0 1 1 2 x 1 0 0 0 0 2 x 2 1 1 1 0
1 x 1 1 1 1 0 1 x 2 1 1 0 0 1 x 2 1 1 0 0 0 0 1 1 1 0 0 0 0
1 2 2 3 x 2 0 1 1 2 x 1 0 0 1 2 2 1 0 0 0 0 0 1 1 1 0 0 1 1
0 1 x 3 x 2 0 0 0 1 1 1 0 1 2 3 x 1 0 0 0 0 0 1 x 1 0 0 1 x
0 1 1 3 3 3 2 1 1 1 1 2 1 2 x x 2 2 1 1 0 0 0 1 1 1 1 1 2 1
0 0 0 1 x x 2 x 1 1 x 2 x 2 3 3 3 2 x 1 0 1 1 1 0 0 2 x 2 0
0 1 1 2 2 2 3 2 2 1 1 2 1 1 1 x 2 x 2 1 0 1 x 1 0 0 2 x 2 0
1 2 x 1 0 1 2 x 1 0 0 0 1 1 2 2 3 2 1 0 0 1 1 1 0 0 1 1 1 0
1 x 2 1 0 1 x 3 2 1 0 0 1 x 1 1 x 2 1 0 0 0 1 1 1 0 0 0 0 0
1 1 2 1 2 2 2 2 x 1 0 0 1 1 1 1 2 x 1 0 0 0 1 x 2 1 0 0 0 0
1 1 2 x 2 x 1 1 1 1 0 0 0 0 1 1 2 1 1 0 0 0 1 2 x 1 0 0 0 0
1 x 3 2 2 1 1 0 0 1 1 1 0 0 1 x 1 0 0 0 0 0 1 2 2 1 0 0 0 0
1 2 x 1 0 0 0 0 0 1 x 1 0 0 1 1 1 0 0 0 0 0 1 x 1 0 0 0 0 0`,
        m: 45,
        out: `0 0 0 0 0 0 0 0 0 0 0 0 1 x 1 0 0 0 0 0 0 0 0 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 0 1 1 1 0 0 0 0 2 x 2 1 x 1 0
1 1 1 0 0 0 0 1 1 1 0 0 0 0 1 1 2 x 1 0 0 0 0 2 x 2 1 1 1 0
1 x 1 1 1 1 0 1 x 2 1 1 0 0 1 x 2 1 1 0 0 0 0 1 1 1 0 0 0 0
1 2 2 3 x 2 0 1 1 2 x 1 0 0 1 2 2 1 0 0 0 0 0 1 1 1 0 0 1 1
0 1 x 3 x 2 0 0 0 1 1 1 0 1 2 3 x 1 0 0 0 0 0 1 x 1 0 0 1 x
0 1 1 3 3 3 2 1 1 1 1 2 1 2 x x 2 2 1 1 0 0 0 1 1 1 1 1 2 1
0 0 0 1 x x 2 x 1 1 x 2 x 2 3 3 3 2 x 1 0 1 1 1 0 0 2 x 2 0
0 1 1 2 2 2 3 2 2 1 1 2 1 1 1 x 2 x 2 1 0 1 x 1 0 0 2 x 2 0
1 2 x 1 0 1 2 x 1 0 0 0 1 1 2 2 3 2 1 0 0 1 1 1 0 0 1 1 1 0
1 x 2 1 0 1 x 3 2 1 0 0 1 x 1 1 x 2 1 0 0 0 1 1 1 0 0 0 0 0
1 1 2 1 2 2 2 2 x 1 0 0 1 1 1 1 2 x 1 0 0 0 1 x 2 1 0 0 0 0
1 1 2 x 2 x 1 1 1 1 0 0 0 0 1 1 2 1 1 0 0 0 1 2 x 1 0 0 0 0
1 x 3 2 2 1 1 0 0 1 1 1 0 0 1 x 1 0 0 0 0 0 1 2 2 1 0 0 0 0
1 2 x 1 0 0 0 0 0 1 x 1 0 0 1 1 1 0 0 0 0 0 1 x 1 0 0 0 0 0`
    },
];

let open = (x, y) => 0;
for (let i = 0; i < cases.length; i++) {
    open = (x, y) => {
        const toReturn = cases[i].result.split(/\n/g).map(l => l.split(' '))[x][y];
        if (toReturn === 'x') {
            throw 'Mine mate'
        }
        return toReturn;
    };
    const sm = solveMine(cases[i].map, cases[i].m);
    if (sm !== cases[i].out) {
        console.log('Issue for the following case');
        console.log(cases[i].result);
        console.log('We got');
        console.log(cases[i].map);
        console.log('We gave');
        console.log(sm);

        process.env.log = true;
        solveMine(cases[i].map, cases[i].m);
        process.env.log = false;

    } else {
        console.log('ok');
    }
}