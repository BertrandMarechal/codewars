var calc = function (expression) {
    const split = expression
        .replace(/ /g, '')
        .match(/-?[0-9]+(\.[0-9]+)*|[\+\-\*\/]/g);
    console.log(split);
};
var tests = [
    ['1+1', 2],
    // ['1 - 1', 0],
    // ['1* 1', 1],
    // ['1 /1', 1],
    // ['-123', -123],
    // ['123', 123],
    // ['2 /2+3 * 4.75- -6', 21.25],
    // ['12* 123', 1476],
    // ['2 / (2 + 3) * 4.33 - -6', 7.732],
];

tests.forEach(function (m) {
    console.log(calc(m[0]) === m[1]);
});