'use strict';
process.env.local = true;
var expect = require('chai').expect;
const smallest = require('../find-the-smallest/index');

const tests = [
    {number: 123456, result: [123456, 0, 0]},
    {number: 1000000, result: [1, 0, 6]},
    {number: 1000001, result: [11, 0, 5]},
    {number: 5000244, result: [2445, 0, 6]},
    {number: 5000166, result: [1566, 0, 4]},
    {number: 2000001, result: [12, 0, 6]},
    {number: 1000002, result: [12, 0, 5]},
    {number: 123645, result: [123465, 4, 3]},
    {number: 311111, result: [111113, 0, 5]},
    {number: 261235, result: [126235, 2, 0]},
    {number: 209917, result: [29917, 0, 1]},
    {number: 285365, result: [238565, 3, 1]},
    {number: 269045, result: [26945, 3, 0]},
    {number: 296837, result: [239687, 4, 1]},
    {number: 187863002809, result: [18786300289, 10, 0]},
    {number: 935855753, result: [358557539, 0, 8]},
    {number: 13525232695182840, result: [1352523269518284, 16, 0]},
    {number: 5086750413549728, result: [508675413549728, 6, 0]},
    {number: 94883608842, result: [9488368842, 6, 0]},
    {number: 539158022110124, result: [53915802211124, 11, 0]},
    {number: 6463647658439697, result: [3646364765849697, 11, 0]},
    {number: 2695641211924676, result: [1269564121924676, 8, 0]},
    {number: 2364603846610085, result: [236460384661085, 12, 0]},
    {number: 8695471138827885, result: [1869547138827885, 6, 0]},

    {number: 5034322112203018, result: [343221122030158, 0, 14]},
    {number: 8243389226767632, result: [2433889226767632, 0, 4]},

    // [343221122030158, 0, 14]', instead got: '[503432211220318, 13, 0]'
    // '[2433889226767632, 0, 4]', instead got: '[2824338922676763, 15, 0]
];
describe('smallest test', () => {
    tests.map(test => {
        return it(`${test.number} should return ${JSON.stringify(test.result)}`, () => {
            var result = smallest(test.number, true);
            expect(JSON.stringify(result)).to.equal(JSON.stringify(test.result));
        });
    });
})