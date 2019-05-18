function pathFinder(maze, endTurn) {
    let monsterPath = '';
    for (let way of 'SNEESS') monsterPath += endTurn(way);
    console.log("monster's path:", monsterPath);
}
function testMaze(maze) {
    if (expected !== pathFinder(area)) {
        console.log(pathFinder(area), expected);
    } else {
        console.log('Ok');
    }
}
testMaze(
    `...
.W.
...`
);

testMaze(
    `......
....W.
......
......
......
......`
);

testMaze(
    `......
......
......
...W..
......
......`
);