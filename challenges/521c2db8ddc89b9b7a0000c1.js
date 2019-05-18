snail = function (array) {
    let d = 'r'; // r, d, l, u
    let output = [];
    while (array.length > 0) {
        const lineLength = array[0].length;
        switch (d) {
            case 'r':
                for (let i = 0; i < lineLength; i++) {
                    output.push(array[0][i]);
                }
                array.splice(0, 1);
                d = 'd';
                break;
            case 'd':
                for (let i = 0; i < array.length; i++) {
                    output.push(array[i].splice(lineLength - 1, 1)[0]);
                }
                d = 'l';
                break;
            case 'l':
                for (let i = 0; i < lineLength; i++) {
                    output.push(array[array.length - 1][lineLength - 1 - i]);
                }
                array.splice(array.length - 1, 1);
                d = 'u';
                break;
            case 'u':
                for (let i = 0; i < array.length; i++) {
                    output.push(array[array.length - 1 - i].splice(0, 1)[0]);
                }
                d = 'r';
                break;
        }
    }
    return output;
}

console.log(snail([[]])) // [];
console.log(snail([[1]])) // [];
console.log(snail([[1, 2, 3], [4, 5, 6], [7, 8, 9]])) // [];
// snail([[1]]), [1];
// snail([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5];
// snail([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]]), [1, 2, 3, 4, 5, 10, 15, 20, 25, 24, 23, 22, 21, 16, 11, 6, 7, 8, 9, 14, 19, 18, 17, 12, 13];
// snail([[1, 2, 3, 4, 5, 6], [20, 21, 22, 23, 24, 7], [19, 32, 33, 34, 25, 8], [18, 31, 36, 35, 26, 9], [17, 30, 29, 28, 27, 10], [16, 15, 14, 13, 12, 11]]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];