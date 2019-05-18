function pathFinder(maze) {
    const mazeSplit = maze.split('\n').map(x => x.split(''));
    const mazeLength = mazeSplit.length;
    const maxMax = mazeLength * mazeLength + 1;
    const path = mazeSplit.map(l => l.map(x => maxMax));
    let currentX = 0, currentY = 0;
    path[currentY][currentX] = 1;

    let next = [[currentY, currentX]];

    while (next.length) {
        const nexNexts = [];
        for (let k = 0; k < next.length; k++) {
            const element = next[k];
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i * j !== 0 || (i === 0 && j === 0)) {
                        continue;
                    }
                    if (i + element[0] > -1 &&
                        i + element[0] < mazeLength &&
                        j + element[1] > -1 &&
                        j + element[1] < mazeLength) {
                        if (path[element[0] + i][element[1] + j] === maxMax && mazeSplit[element[0] + i][element[1] + j] !== 'W') {
                            path[element[0] + i][element[1] + j] = path[element[0]][element[1]] + 1;
                            nexNexts.push([element[0] + i, element[1] + j]);
                        }
                    }
                }
            }
        }
        next = [...nexNexts];
    }
    console.log(path);

    return path[mazeLength - 1][mazeLength - 1] !== maxMax;
}
console.log(pathFinder(//true
    `.W.
.W.
...`));


console.log(pathFinder(//true,
    `.W.
.W.
...`));

console.log(pathFinder(//false,
    `.W.
.W.
W..`));

console.log(pathFinder(//true,
    `......
......
......
......
......
......`));

console.log(pathFinder(//false,
    `......
......
......
......
.....W
....W.`));