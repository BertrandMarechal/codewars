export class Challenge {
    static validBraces(braces) {
        const bracesPairs = {
            '(': ')',
            '{': '}',
            '[': ']'
        };
        const open = [];
        let ok = true;
        const split = braces.split('');
        for (let i = 0; i < split.length; i++) {
            // console.log(open, split[i]);

            if (bracesPairs[split[i]]) {
                open.push(split[i]);
            } else {
                if (bracesPairs[open[open.length - 1]] === split[i]) {
                    open.splice(open.length - 1);
                } else {
                    return false;
                }
            }
        }
        return open.length === 0;
    }
}

console.log(Challenge.validBraces("(){}[]"), 'True'); // => True
console.log(Challenge.validBraces("([{}])"), 'True'); // => True
console.log(Challenge.validBraces("(}"), 'False'); // => False
console.log(Challenge.validBraces("[(])"), 'False'); // => False
console.log(Challenge.validBraces("[({})](]"), 'False'); // => False