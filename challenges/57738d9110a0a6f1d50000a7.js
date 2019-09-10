// https://www.codewars.com/kata/57738d9110a0a6f1d50000a7/train/javascript
function linkUp(gamemap) {
    const tries = [];
    let currentTryIndex = -1;
    const addToTryTree = () => {
        currentTryIndex++;
        tries.push({
            i: 0,
            options: [],
            gameMapArray: gameMapArr.map(line => line.join(' ')).join('\n'),
            toReturnArray: [...toReturn.map(option => [...option])]
        });
        console.log('addToTryTree', currentTryIndex, currentTryIndex > 0 ? tries[currentTryIndex - 1].options.length : 0);
    }
    const addOptionToTry = (option) => {
        // console.log('addOptionToTry', currentTryIndex, tries[currentTryIndex].options.length, option);
        tries[currentTryIndex].options.push(option);
    }
    const nextTry = () => {
        tries[currentTryIndex].i++;
        if (tries[currentTryIndex].i >= tries[currentTryIndex].options.length) {
            tries.pop();
            currentTryIndex--;
            if (currentTryIndex === -1) {
                console.log('nextTry', 0);
                return false;
            }
            tries[currentTryIndex].i++;
        }
        gameMapArr = tries[currentTryIndex].gameMapArray.split('\n').map(x => x.split(' '));;
        toReturn = tries[currentTryIndex].toReturnArray;
        generateFlattened();
        console.log('nextTry', currentTryIndex, tries[currentTryIndex].i);
        return true;
    }

    const getTryOption = () => {
        if (currentTryIndex === -1) {
            return null;
        }
        return tries[currentTryIndex].options[tries[currentTryIndex].i];
    }
    /*
    [{
        i: 0,
        options: [[[], []]],
        gameMapArray: [][]
    }]
    */
    console.log(gamemap);

    let toReturn = [];

    let isOk = false;
    let gameMapArr;
    gameMapArr = gamemap.split('\n').map(x => ['', ...x.split(' '), '']);
    gameMapArr.unshift(gameMapArr[0].map(() => ''));
    gameMapArr.push(gameMapArr[0].map(() => ''));

    const generateFlattened = () => {
        flattened = gameMapArr.reduce((agg, line, i) => {
            for (let j = 0; j < line.length; j++) {
                const cell = line[j];
                if (cell) {
                    if (agg[cell]) {
                        agg[cell].push([i, j]);
                    } else {
                        agg[cell] = [[i, j]];
                    }
                }
            }
            return agg;
        }, {});
    }

    const checlImmediateNeighbours = (from, to) => {
        return (from[0] === to[0] && Math.abs(from[1] - to[1]) === 1) || (from[1] === to[1] && Math.abs(from[0] - to[0]) === 1);
    }
    const checkOneLine = (from, to) => {
        if (from[0] !== to[0] && from[1] !== to[1]) {
            return false;
        }
        const indexToCheck = from[0] === to[0] ? 1 : 0;
        const min = Math.min(from[indexToCheck], to[indexToCheck]) + 1;
        const max = Math.min(from[indexToCheck], to[indexToCheck]) - 1;
        if (indexToCheck === 1) {
            if (from[0] === 1 || from[0] === gameMapArr.length - 2) {
                return true;
            }
        } else {
            if (from[1] === 1 || from[1] === gameMapArr.length - 2) {
                return true;
            }
        }
        const path = indexToCheck === 1 ?
            gameMapArr[from[0]].slice(min, max) :
            gameMapArr.map(line => line[from[1]]).slice(min, max);
        return !!path.filter(x => x).length;
    }

    const checkTwoLines = (from, to) => {
        if (from[0] === to[0] || from[1] === to[1]) {
            return false;
        }
        /*
        A---2---C
        |       |
        0       1
        |       |
        D---3---B
        */
        const minR = Math.min(from[0], to[0]);
        const maxR = Math.max(from[0], to[0]);
        const minC = Math.min(from[1], to[1]);
        const maxC = Math.max(from[1], to[1]);
        const paths = [[], [], [], []];
        const fromOrToIsA =
            (minR === from[0] && minC === from[1]) ||
            (minR === to[0] && minC === to[1]);

        for (let i = minR; i < maxR + 1; i++) {
            paths[0].push(gameMapArr[i][minC]);
            paths[1].push(gameMapArr[i][maxC]);
        }
        for (let i = minC; i < maxC + 1; i++) {
            paths[2].push(gameMapArr[minR][i]);
            paths[3].push(gameMapArr[maxR][i]);
        }
        if (fromOrToIsA) {
            return (paths[2].filter(x => !!x).length === 1 && paths[1].filter(x => !!x).length === 1) ||
                (paths[0].filter(x => !!x).length === 1 && paths[3].filter(x => !!x).length === 1)
        } else {
            return (paths[0].filter(x => !!x).length === 1 && paths[2].filter(x => !!x).length === 1) ||
                (paths[1].filter(x => !!x).length === 1 && paths[3].filter(x => !!x).length === 1)
        }
    }

    const checkThreeLines = (from, to, letter) => {
        /*
        A---2---C
        |       |
        0       1
        |       |
        D---3---B
        */
        const minR = Math.min(from[0], to[0]);
        const maxR = Math.max(from[0], to[0]);
        const minC = Math.min(from[1], to[1]);
        const maxC = Math.max(from[1], to[1]);
        const fromOrToIsA =
            (minR === from[0] && minC === from[1]) ||
            (minR === to[0] && minC === to[1]);
        const path = [[], [], []];
        let found = false;
        /*
        ---1---
        |
        0
        |
        ---2---
        */
        // loop on Xs to try and get a path that works
        for (let i = 0; i < 10 && !found; i++) {
            if (i !== minC && i !== maxC) {
                // we only care about what's not 2 lines
                path[0] = gameMapArr.map(x => x[i]).slice(minR, maxR + 1).filter(x => !!x);
                if (!path[0].length) {
                    // we can carry on
                    path[1] = gameMapArr[minR].slice(
                        Math.min(fromOrToIsA ? minC : maxC, i),
                        Math.max(fromOrToIsA ? minC : maxC, i) + 1
                    );
                    path[2] = gameMapArr[maxR].slice(
                        Math.min(fromOrToIsA ? maxC : minC, i),
                        Math.max(fromOrToIsA ? maxC : minC, i) + 1
                    );
                    // console.log('X', fromOrToIsA, letter, i, JSON.stringify(path));

                    path[1] = path[1].filter(x => !!x);
                    path[2] = path[2].filter(x => !!x);
                    // if the length is 2, then we are just talking about our 2 ends
                    if (path[1].length === 1 && path[2].length === 1) {
                        found = path[1].filter(x => letter === x).length === 1 && path[2].filter(x => letter === x).length === 1;
                    }
                }
            }
        }
        // loop on Ys to try and get a path that works
        for (let i = 0; i < 10 && !found; i++) {
            if (i !== minR && i !== maxR) {
                // we only care about what's not 2 lines
                path[0] = gameMapArr[i].slice(minC, maxC + 1).filter(x => !!x);
                if (!path[0].length) {
                    // we can carry on
                    path[1] = gameMapArr.map(x => x[minC]).slice(
                        Math.min(fromOrToIsA ? minR : maxR, i),
                        Math.max(fromOrToIsA ? minR : maxR, i) + 1
                    );
                    path[2] = gameMapArr.map(x => x[maxC]).slice(
                        Math.min(fromOrToIsA ? maxR : minR, i),
                        Math.max(fromOrToIsA ? maxR : minR, i) + 1
                    );
                    // console.log('Y', fromOrToIsA, letter, i, JSON.stringify(path));
                    path[1] = path[1].filter(x => !!x);
                    path[2] = path[2].filter(x => !!x);
                    // if the length is 2, then we are just talking about our 2 ends
                    found = path[1].length === 1 && path[2].length === 1;
                }
            }
        }
        return found;
    }
    addToTryTree();
    let flattened;
    generateFlattened();
    while (!isOk) {
        //coding here...
        let changed = true;

        while (changed) {
            generateFlattened();
            changed = false;
            const keys = Object.keys(flattened);
            for (let i = 0; i < keys.length && !changed; i++) {
                const key = keys[i];
                for (let j = 0; j < flattened[key].length; j++) {
                    const coord = flattened[key][j];
                    for (let k = j + 1; k < flattened[key].length; k++) {
                        const otherCord = flattened[key][k];
                        let keyChanged = false;
                        keyChanged = checlImmediateNeighbours(coord, otherCord);
                        if (!keyChanged) {
                            keyChanged = checkOneLine(coord, otherCord);
                        }
                        if (!keyChanged) {
                            keyChanged = checkTwoLines(coord, otherCord);
                        }
                        if (!keyChanged) {
                            keyChanged = checkThreeLines(coord, otherCord, gameMapArr[coord[0]][coord[1]]);
                        }
                        if (keyChanged) {
                            addOptionToTry([coord.map(x => x - 1), otherCord.map(x => x - 1)]);
                        }
                    }
                }
            }
            let option = getTryOption();
            if (!option) {
                if (nextTry()) {
                    option = getTryOption();
                } else {
                    console.log('No more options');
                    console.log(gamemap);
                    console.log(gameMapArr.map((line) => line.map(cell => cell || '_').join('-')).join('\n'));
                    return toReturn;
                }
            }
            if (option) {
                toReturn.push(option);
                if (gameMapArr[option[0][0] + 1][option[0][1] + 1] !== gameMapArr[option[1][0] + 1][option[1][1] + 1]) {
                    console.log('Not same char', gameMapArr[option[0][0] + 1][option[0][1] + 1], gameMapArr[option[1][0] + 1][option[1][1] + 1]);
                    console.log(option);
                    console.log(gameMapArr.map((line) => line.map(cell => cell || '_').join('-')).join('\n'));
                    return toReturn;
                }
                gameMapArr[option[0][0] + 1][option[0][1] + 1] = '';
                gameMapArr[option[1][0] + 1][option[1][1] + 1] = '';
                // console.log(gameMapArr.map((line) => line.map(cell => cell || '_').join('-')).join('\n'));
                changed = true;
                addToTryTree();
            }
            isOk = !gameMapArr.map(line => line.join('')).join('');
            if (isOk) {
                // console.log(gameMapArr.map((line) => line.map(cell => cell || '_').join('-')).join('\n'));
                return toReturn;
            }
        }
    }

    return toReturn;
}
var maps =
    [`J L N O K F L G
M D E A K B I K
I O J L L M B P
P C G J F D O E
I N F O N M D H
I N D K J E C G
A M H B E P C H
C F A A B H P G`,
        `J G H D B D C C
F H M K N D P I
F N E E J I L K
M P L O F N P E
A N B L H C G G
G K I A D B H A
E M P L M K J O
C F J I O O B A`,
        `H D C I B N H P
A C N J O B I I
M F E O L B G C
O J E A C P D H
G P J D N E A I
M L F L A H K K
F P L G J K M G
E O N B M F D K`,
        `M A G L I G E L
L E F F F I D D
L C D K P C K O
E N P B H A A G
F J N K O J M C
I H N B P E P M
D B J C J N G I
O K H H A M B O`,
        `J N G B H J G M
F P A A I G D F
D E E O P D A I
L D A N M K H C
E J P B P L F I
N G M I J O N C
L E B C O K K O
H H L M K B F C`,
        `B F H N D L G O
G N F P C G M I
M E A I O L D K
O A P N J G N E
O K L F I K C I
P E M E A A C B
M B H L F P J D
J H B K D C H J`];

for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    linkUp(map);
    console.log('')
}


