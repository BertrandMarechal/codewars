// https://www.codewars.com/kata/regex-tic-tac-toe-win-checker/train/javascript
function regexTicTacToeWinChecker(board) {
    // return /^(?:.{0,2}([XO])..\1..\1.{0,2})$/.test(board)
    return /^(?:(?:.{3})*([XO])\1\1(?:.{3})*|([XO]).{3}\2.{3}\2|..([XO]).\3.\3..|.{0,2}([XO])..\4..\4.{0,2})$/.test(board);
}

winners = ["XXX-O-O-O", "X--OOOX-X", "O--OO-XXX", "O-XOX-O-X", "OXOOXOXX-", "X-O-OOXXO", "XO--X-OOX", "X-OXOOOXX"];
notWinners = ["XO-------", "XX-XOO---", "-XX-OO-O-", "OXO--XXO-", "OOXXXO---", "OXXX-XOO-", "OOXXX----", "XXOOXXOO-", "OXOXOX---"];

console.log(winners.filter(x => regexTicTacToeWinChecker(x)).length);
console.log(notWinners.filter(x => !regexTicTacToeWinChecker(x)).length);