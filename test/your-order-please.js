'use strict';
var expect = require('chai').expect;
const order = require('../your-order-please/index');

const tests = [
    {input: "is2 Thi1s T4est 3a", output: "Thi1s is2 3a T4est"},
    {input: "4of Fo1r pe6ople g3ood th5e the2", output: "Fo1r the2 g3ood 4of th5e pe6ople"},
    {input: "", output: ""},
];

describe('your order test', () => {
    tests.map(test => {
        return it(`${test.input} should return ${JSON.stringify(test.output)}`, () => {
            var result = order(test.input);
            expect(JSON.stringify(result)).to.equal(JSON.stringify(test.output));
        });
    });
})