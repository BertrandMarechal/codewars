var p = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const expected = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

function sudoku(puzzle) {
    const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const peuzeule = {};
    peuzeule.done = false;
    const convert = () => {
        peuzeule.cells = puzzle.map((r, y) => r.map((cell, x) => ({
            value: cell,
            x: x,
            y: y,
            xInBloc: x - Math.floor(x / 3) * 3,
            yInBloc: y - Math.floor(y / 3) * 3,
            b: Math.floor(x / 3) * 3 + Math.floor(y / 3)
        })));
        peuzeule.lines = peuzeule.cells.map(r => ({ done: false, cells: r }));
        peuzeule.columns = [];
        for (let i = 0; i < oneToNine.length; i++) {
            peuzeule.columns[i] = {
                done: false,
                cells: oneToNine.map(n => peuzeule.cells[n - 1][i])
            };
        }
        peuzeule.blocs = oneToNine.map((x, i) => ({
            cells: [],
            bloc: [],
            done: false,
            y: Math.floor(i / 3),
            x: i % 3
        }));
        for (let i = 0; i < oneToNine.length; i++) {
            for (let j = 0; j < oneToNine.length; j++) {
                peuzeule.blocs[Math.floor(i / 3) * 3 + Math.floor(j / 3)].cells.push(peuzeule.cells[i][j]);
            }
        }
        for (let i = 0; i < oneToNine.length; i++) {
            peuzeule.blocs[i].bloc = peuzeule.blocs[i].cells.reduce((agg, current, j) => {
                agg[Math.floor(j / 3)].push(current);
                return agg;
            }, [[], [], []]);
        }
    };
    const _check = (entity) => {
        entity.done = true;
        for (let i = 0; i < entity.cells.length && entity.done; i++) {
            entity.done = !!entity.cells[i].value;
        }
    }
    const _checkEntities = (cell) => {
        _check(peuzeule.lines[cell.y]);
        _check(peuzeule.columns[cell.x]);
        _check(peuzeule.blocs[cell.b]);
    }
    convert();
    //return the solved puzzle as a 2d array of 9 x 9

    // check if sudoku is done
    const _isDone = () => {
        peuzeule.done = peuzeule.lines.filter(l => !l.done).length === 0;
        if (peuzeule.done) {
            console.log('Solved');

        }
        return peuzeule.done;
    };
    const _processEntity = (entity, type, i) => {
        if (entity.done) {
            return false;
        }
        if (entity.cells.filter(cell => cell.value === 0).length === 1) {
            // we just need to find which one it is
            const zeroIndexOf = entity.cells.findIndex(cell => cell.value === 0);
            const toAdd = oneToNine.find(x => entity.cells.map(x => x.value).indexOf(x) === -1);
            peuzeule.cells[entity.cells[zeroIndexOf].y][entity.cells[zeroIndexOf].x].value = toAdd;
            _checkEntities(peuzeule.cells[entity.cells[zeroIndexOf].y][entity.cells[zeroIndexOf].x]);
            // console.log(`_processEntity, [${type} ${i}] ${toAdd} placed at ${entity.cells[zeroIndexOf].x} - ${entity.cells[zeroIndexOf].y}`);
            return true;
        }
    };

    const _processNumber = (n) => {
        // loop on blocs, if number is in bloc, go to next
        let somethingChanged = true;
        let somethingReallyChanged = false;
        while (somethingChanged) {
            somethingChanged = false;
            for (let i = 0; i < peuzeule.blocs.length && !somethingChanged; i++) {
                const bloc = peuzeule.blocs[i];
                if (!bloc.done) {
                    if (!bloc.cells.find(c => c.value === n)) {
                        // number not in the bloc
                        // check top / bottom blocs
                        let otherBlocs = [];
                        if (bloc.y === 0) {
                            otherBlocs.push(peuzeule.blocs[i + 3]);
                            otherBlocs.push(peuzeule.blocs[i + 6]);
                        } else if (bloc.y === 2) {
                            otherBlocs.push(peuzeule.blocs[i - 6]);
                            otherBlocs.push(peuzeule.blocs[i - 3]);
                        } else {
                            otherBlocs.push(peuzeule.blocs[i - 3]);
                            otherBlocs.push(peuzeule.blocs[i + 3]);
                        }
                        const takenXes = otherBlocs.map(b => {
                            const valCell = b.cells.find(c => c.value === n);
                            if (valCell) {
                                return valCell.xInBloc;
                            }
                        }).filter(x => x === 0 || Boolean(x));
                        otherBlocs = [];
                        if (bloc.x === 0) {
                            otherBlocs.push(peuzeule.blocs[i + 1]);
                            otherBlocs.push(peuzeule.blocs[i + 2]);
                        } else if (bloc.x === 2) {
                            otherBlocs.push(peuzeule.blocs[i - 2]);
                            otherBlocs.push(peuzeule.blocs[i - 1]);
                        } else {
                            otherBlocs.push(peuzeule.blocs[i - 1]);
                            otherBlocs.push(peuzeule.blocs[i + 1]);
                        }
                        const takenYs = otherBlocs.map(b => {
                            const valCell = b.cells.find(c => c.value === n);
                            if (valCell) {
                                return valCell.yInBloc;
                            }
                        }).filter(x => x === 0 || Boolean(x));
                        takenYs.sort();
                        takenXes.sort();
                        const availablePositions = [...oneToNine.map(x => x - 1)];
                        // remove rows occupied by other blocs
                        for (let j = takenYs.length - 1; j > -1; j--) {
                            availablePositions.splice(takenYs[j] * 3, 3);
                        }

                        // remove columns occupied by other blocs
                        for (let j = takenXes.length - 1; j > -1; j--) {
                            for (let k = availablePositions.length - 1; k > -1; k--) {
                                if (availablePositions[k] % 3 === takenXes[j]) {
                                    availablePositions.splice(k, 1);
                                }
                            }
                        }

                        // remove already used cells
                        for (let j = availablePositions.length - 1; j > -1; j--) {
                            const dy = Math.floor(availablePositions[j] / 3.0);
                            const dx = availablePositions[j] % 3;
                            if (bloc.bloc[dy][dx].value) {
                                availablePositions.splice(j, 1);
                            }
                        }
                        if (availablePositions.length === 1) {
                            somethingChanged = true;
                            somethingReallyChanged = true;
                            const dy = Math.floor(availablePositions[0] / 3.0);
                            const dx = availablePositions[0] % 3;
                            bloc.bloc[dy][dx].value = n;
                            _checkEntities(bloc.bloc[dy][dx]);
                        }
                    }
                }
            }
        }
        return somethingReallyChanged;
    }

    const _logGrid = () => {
        console.log('| --------------------------- |\r\n|' +
            peuzeule.cells.map((row, i) =>
                row.map((c, j) => (c.value === 0 ? '   ' : ` ${c.value} `) + `${j % 3 === 2 ? '|' : ''}`).join('') + (i % 3 === 2 ? '\r\n| --------------------------- |' : '')
            ).join('\r\n|'));
    }

    _isDone();
    let somethingChanged = true;
    while (somethingChanged && !peuzeule.done) {
        somethingChanged = false;
        for (let i = 0; i < 9 && !somethingChanged; i++) {
            somethingChanged = _processEntity(peuzeule.lines[i], 'line', i);
        }
        for (let i = 0; i < 9 && !somethingChanged; i++) {
            somethingChanged = _processEntity(peuzeule.columns[i], 'column', i);
        }
        for (let i = 0; i < 9 && !somethingChanged; i++) {
            somethingChanged = _processEntity(peuzeule.blocs[i], 'bloc', i);
        }
        for (let i = 0; i < 9 && !somethingChanged; i++) {
            somethingChanged = _processNumber(i);
        }
        if (somethingChanged) {
            _isDone();
        } else {
            // we are in a situation where the case is a bit more complicated.
            // we have to loop on the numbers and blocs, and get the available spaces, based on the other surrounding occurences of this number
            for (let i = 1; i < 10; i++) {

            }
        }
    }
    _logGrid();

    return peuzeule.cells.map(row => row.map(cell => cell.value));
}

// --------------------------- | --------------------------- |
// 5  3    |    7    |         | 5  3    |    7    |    1    |
// 6       | 1  9  5 |         | 6       | 1  9  5 |         |
//    9  8 |         |    6    | 1  9  8 |         | 5  6    |
// --------------------------- | --------------------------- |
// 8       |    6    |       3 | 8       |    6    |       3 |
// 4       | 8     3 |       1 | 4     6 | 8     3 |       1 |
// 7       |    2    |       6 | 7     3 |    2    | 8     6 |
// --------------------------- | --------------------------- |
//    6    |         | 2  8    |    6    |         | 2  8    |
//         | 4  1  9 |       5 |         | 4  1  9 |       5 |
//         |    8    |    7  9 |         |    8    | 1  7  9 |
// --------------------------- | --------------------------- |

// --------------------------- |
// 5  3  4 | 6  7  8 | 9  1  2 |
// 6  7  2 | 1  9  5 | 3  4  8 |
// 1  9  8 | 3  4  2 | 5  6  7 |
// --------------------------- |
// 8  5  9 | 7  6  1 | 4  2  3 |
// 4  2  6 | 8  5  3 | 7  9  1 |
// 7  1  3 | 9  2  4 | 8  5  6 |
// --------------------------- |
// 9  6  1 | 5  3  7 | 2  8  4 |
// 2  8  7 | 4  1  9 | 6  3  5 |
// 3  4  5 | 2  8  6 | 1  7  9 |
// --------------------------- |
const time = new Date().getTime();

sudoku(p);
console.log(sudoku([
    [3, 0, 5, 0, 0, 0, 4, 0, 1],
    [0, 1, 0, 0, 0, 0, 0, 9, 0],
    [0, 4, 0, 1, 3, 6, 0, 8, 0],
    [0, 2, 7, 0, 8, 0, 3, 6, 0],
    [4, 0, 0, 0, 5, 0, 0, 0, 8],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 4, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 9, 3, 0, 8, 2, 4, 0],
]));
console.log(`${new Date().getTime() - time} ms`);