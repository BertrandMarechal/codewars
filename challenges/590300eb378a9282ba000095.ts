// https://www.codewars.com/kata/590300eb378a9282ba000095/train/typescript
export class Game {
  board: number[][];
  mapped: number[][];
  dimension: number;

  constructor(board: number[][]) {
    // Good luck
    this.board = board;
    this.mapped = this.board.map(line => line.map(cell => cell === 0 ? 0 : -1));
    this.dimension = this.mapped.length;
  }

  private resoveCells(index: number, i: number, j: number) {
    this.mapped[i][j] = index;
    if (i > 0 && this.mapped[i - 1][j] === -1) {
      this.resoveCells(index, i - 1, j);
    }
    if (j > 0 && this.mapped[i][j - 1] === -1) {
      this.resoveCells(index, i, j - 1);
    }
    if (i < this.dimension - 1 && this.mapped[i + 1][j] === -1) {
      this.resoveCells(index, i + 1, j);
    }
    if (j < this.dimension - 1 && this.mapped[i][j + 1] === -1) {
      this.resoveCells(index, i, j + 1);
    }
  }

  play(): number {
    let index = 0;
    console.log(this.mapped);
    // Good luck
    for (let i = 0; i < this.board.length; i++) {
      const line = this.board[i];
      for (let j = 0; j < line.length; j++) {
        if (this.mapped[i][j] === -1) {
          index++;
          this.resoveCells(index, i, j);
        }
      }
    }

    return index;
  }

}


let board, game;
board = [[1, 1, 0, 0, 0],
[1, 1, 0, 0, 0],
[0, 0, 0, 0, 0],
[0, 0, 0, 1, 1],
[0, 0, 0, 1, 1]];
game = new Game(board);
console.log(game.play()); //2

board = [[1, 0, 1, 0, 1],
[1, 0, 1, 0, 1],
[1, 1, 1, 0, 0],
[0, 0, 0, 1, 1],
[0, 0, 0, 1, 1]];
game = new Game(board);
console.log(game.play()); //3

board = [[1, 0, 1, 0, 1],
[0, 1, 0, 1, 0],
[1, 0, 1, 0, 1],
[0, 1, 0, 1, 0],
[1, 0, 1, 0, 1]];
game = new Game(board);
console.log(game.play()); //13

board = [[1, 0, 0, 0, 0],
[0, 0, 1, 1, 0],
[1, 0, 1, 0, 1],
[1, 1, 1, 1, 0],
[1, 1, 1, 0, 1]];
game = new Game(board);
console.log(game.play()); //4