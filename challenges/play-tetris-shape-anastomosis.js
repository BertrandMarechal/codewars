function playtetris(board, block) {
    let FILLED = '■';
    let EMPTY = '□';
    const LINE = 'L';
    board = board.map(line => line.map(cell => cell === FILLED ? 'F' : 'E'));
    block = block.map(line => line.map(cell => cell === FILLED ? 'F' : 'E'));
    FILLED = 'F';
    EMPTY = 'E';

    const boardWidth = board[0].length;
    const boardString = board.map(line => line.map(cell => cell).join('')).join(LINE);

    let FILL_LINE = FILLED + FILLED;
    if (boardWidth > 2) {
        FILL_LINE = `${FILLED}.{${boardWidth - 2 - block[0].length + 1}}${FILLED}`;
    }

    let blockRegex = '';
    // top line
    for (let i = 0; i < block[0].length; i++) {
        const element = block[0][i];
        if (element === EMPTY) {
            blockRegex += FILLED;
        } else {
            blockRegex += '.';
        }
    }
    // deal with the corner
    blockRegex += '.';
    blockRegex += FILL_LINE.substr(1);

    for (let i = 0; i < block.length; i++) {
        if (i > 0) {
            blockRegex += FILL_LINE;
        }
        const element = block[i];
        blockRegex += element.join('');
    }

    blockRegex += FILL_LINE.substr(0, FILL_LINE.length - 1);
    // deal with the corner
    blockRegex += '.';
    // bottom line
    for (let i = 0; i < block[block.length - 1].length; i++) {
        const element = block[block.length - 1][i];
        if (element === EMPTY) {
            blockRegex += FILLED;
        } else {
            blockRegex += '.';
        }
    }

    const execEd = new RegExp(blockRegex).exec(boardString);
    if (execEd) {
        const index = execEd.index;
        const lines = boardString.substr(0, index).split('L');
        // top left corner of block is last line of substring + 1 and last column of last line
        const dx = lines.length;
        const dy = lines[lines.length - 1].length;
        const returnArray = [];
        for (let i = 0; i < block.length; i++) {
            for (let j = 0; j < block[i].length; j++) {
                const element = block[i][j];
                if (element === EMPTY) {
                    returnArray.push([dx + i, dy + j]);
                }
            }
        }
        return returnArray.map(coord => `[${coord.join(',')}]`).join(',')
    }
    return "";
}

var bd = (
    "□□□□□□□□□□□\n" +
    "□□□□□□□□□□□\n" +
    "□□□□□□□□□□□\n" +
    "■■■■■■■■■■■\n" +
    "■■□□■■□□■■■\n" +
    "■■□□■■■□□■■\n" +
    "■■■■■■■■■■■\n" +
    "■■□■■□■■■□■\n" +
    "■□□□■□■■■□■\n" +
    "■■■■■□□■□□■\n" +
    "■□□■■■■■■■■\n" +
    "■□□■■□□□□■■\n" +
    "■■■■■■■■■■■").split("\n").map(x => x.split(""));

var b0 = ("□□\n" +
    "□□").split("\n").map(x => x.split(""));

var b1 = ("□□■\n" +
    "■□□").split("\n").map(x => x.split(""));

var b2 = ("■□■\n" +
    "□□□").split("\n").map(x => x.split(""));

var b3 = ("□□\n" +
    "□■\n" +
    "□■").split("\n").map(x => x.split(""));

console.log(playtetris(bd, b0), "[4,2],[4,3],[5,2],[5,3]", "wrong position");
console.log(playtetris(bd, b1), "[4,6],[4,7],[5,7],[5,8]", "wrong position");
console.log(playtetris(bd, b2), "[7,2],[8,1],[8,2],[8,3]", "wrong position");
console.log(playtetris(bd, b3), "", "Rotation is not supported");
//some helpful infomation:
/* list all of block types:
□□
□□

□□■
■□□

■□
□□
□■

■□□
□□■

□■
□□
■□

■□■
□□□

□□□
■□■

□■
□□
□■

■□
□□
■□

□□
■□
■□

□■
□■
□□

□□□
□■■

■■□
□□□

□□
□■
□■

■□
■□
□□

□□□
■■□

□■■
□□□

□□□□

□
□
□
□
*/
