// https://www.codewars.com/kata/roboscript-number-5-the-final-obstacle-implement-rsu/train/javascript
class RSUProgram {
    constructor(source) {
        this.tokens = [];
        this.source = source;
        // TODO: Configure and customize your class constructor
        if (typeof source === 'string') {
            this.source = source.replace(/\/\*([\S\s]*?)\*\/|\/\*\*\/|\/\/.*?$/gm, '');
            this.tokens = this.source
                .replace(/\/\*([\S\s]*?)\*\/|\/\*\*\/|\/\/.*?$/gm, '')
                .match(/P[0-9]+|p[0-9]+|q|\)[0-9]+|\)|[RFL][0-9]+|[RFL]|\(/g);

        }
    }
    deserializeCode(c) {
        while (c.match(/\)[0-9]/)) {
            c = c.replace(/\(([RLPF0-9]+)\)([0-9]+)/g, (_a, b, c) => b.repeat(+c));
        }
        while (c.match(/\)/)) {
            c = c.replace(/\(([RLFP0-9]+)\)/g, '$1');
        }
        c = c.replace(/([RLF])([0-9]+)/g, (_a, b, c) => b.repeat(+c));
        c = c.replace(/P([0-9]+)/g, (_a, b) => this.patterns[+b] ? this.patterns[+b].patternCode : `P${b}`);
        return c;
    }
    commandsToRaw(code) {
        this.patterns = {};

        // we have to look for patterns as p<ID><code>q that are going to be used as P<ID>
        const patternsRegexed = code.match(/p[0-9]+[PRLF0-9()]+q/g);

        if (patternsRegexed) {
            this.patterns = patternsRegexed
                .reduce((agg, p) => {
                    const [, index, patternCode] = p.match(/p([0-9]+)([PRLF0-9()]+)q/);
                    // check if pattern has already been declared
                    if (agg[index]) {
                        throw `Pattern ${index} already exists`;
                    }
                    return {
                        ...agg,
                        [index]: {
                            patternCode: this.deserializeCode(patternCode),
                            patternOriginalCode: patternCode,
                            needs: (patternCode.match(/P[0-9]+/g) || []).map(sp => sp.substr(1))
                        }
                    }
                }, {});
            // check all patterns are defined
            const undefinedPatttterns = (code.match(/P[0-9]+/g) || [])
                .map(sp => sp.substr(1))
                .filter(x => !this.patterns[x]);
            // console.log(this.patterns);
            // console.log(code);

            if (undefinedPatttterns.length > 0) {
                throw `Missing patterns ${undefinedPatttterns.join(', ')}`;
            }
            // check patterns circular references
            const patternNames = Object.keys(this.patterns);

            for (let i = 0; i < patternNames.length; i++) {
                // check for circular references
                // we get the list of patterns the current pattern needs and check if they refer to the current pattern
                const circularReferencePatterns = this.patterns[patternNames[i]].needs
                    .filter(pn => this.patterns[pn].needs.indexOf(patternNames[i]) > -1);
                if (circularReferencePatterns.length > 0) {
                    throw `Pattern ${patternNames[i]} has a circular reference with patterns ${circularReferencePatterns.join(', ')}`
                }
            }
            // patterns are fine, let's deserialize them
            let patternsToDeserialize = patternNames
                .filter(pn => this.patterns[pn].patternCode.indexOf('P') > -1);
            while (patternsToDeserialize.length > 0) {
                for (let i = 0; i < patternsToDeserialize.length; i++) {
                    this.patterns[patternsToDeserialize[i]].patternCode = this.deserializeCode(this.patterns[patternsToDeserialize[i]].patternCode);
                }
                patternsToDeserialize = patternNames
                    .filter(pn => this.patterns[pn].patternCode.indexOf('P') > -1);
            }

            // we now replace the pattern code in the string
            for (let i = 0; i < patternNames.length; i++) {
                code = code.replace('p' + patternNames[i] + this.patterns[patternNames[i]].patternOriginalCode + 'q', '', 'g');
            }
        }

        // check all patterns are defined
        const undefinedPatttterns = (code.match(/P[0-9]+/g) || [])
            .map(sp => +sp.substr(1))
            .filter(x => !this.patterns[x]);
        if (undefinedPatttterns.length > 0) {
            throw `Missing patterns ${undefinedPatttterns.join(', ')}`;
        }


        return this.deserializeCode(code);
    }
    _execute(code, isRaw) {
        if (!isRaw) {
            code = this.commandsToRaw(code);
        }

        const directions = {
            e: { L: 'n', R: 's' },
            w: { L: 's', R: 'n' },
            n: { L: 'w', R: 'e' },
            s: { L: 'e', R: 'w' },
        }
        let direction = 'e';
        const path = [['*']];
        const position = {
            x: 0,
            y: 0
        };
        let maxX = 0;
        for (let i = 0; i < code.length; i++) {
            switch (code[i]) {
                case 'F':
                    switch (direction) {
                        case 'e':
                            position.x++;
                            maxX = Math.max(maxX, position.x);
                            break;
                        case 'w':
                            position.x--;
                            if (position.x < 0) {
                                position.x = 0;
                                for (let j = 0; j < path.length; j++) {
                                    path[j].unshift(null);
                                }
                                maxX++;
                            }
                            break;
                        case 'n':
                            position.y--;
                            if (position.y < 0) {
                                position.y = 0;
                                path.unshift([]);
                            }
                            break;
                        case 's':
                            position.y++;
                            if (position.y === path.length) {
                                path.push([]);
                            }
                            break;
                        default:
                            break;
                    }
                    path[position.y][position.x] = '*';
                    break;
                default:
                    direction = directions[direction][code[i]];
                    break;
            }
        }
        let toReturn = '';
        for (let i = 0; i < path.length; i++) {
            for (let j = 0; j < maxX + 1; j++) {
                toReturn += path[i][j] || ' ';
            }
            if (i < path.length - 1) {
                toReturn += '\r\n';
            }
        }
        return toReturn;
    }
    getTokens() {
        // TODO: Convert `source` (argument from class constructor) into
        // an array of tokens as specified in the Description if `source`
        // is a valid RSU program; otherwise, throw an error (ideally with
        // a suitable message)

        // check for invalid commands
        if (this.source.match(/[^()0-9FLRPpq\r\n ]/)) {
            throw 'invalid commands';
        }
        // check for whitespaces before numbers
        if (this.source.match(/[\t ][0-9]/)) {
            throw 'There is a whitespace before numbers';
        }
        return this.tokens;
    }
    convertToRaw(tokens) {
        // TODO: Process the array of tokens generated by the `getTokens`
        // method (passed into this method as `tokens`) and return an (new)
        // array containing only the raw commands `F`, `L` and/or `R`
        // Throw a suitable error if necessary
        return this.commandsToRaw(tokens.join('')).split('');
    }
    executeRaw(cmds) {
        // TODO: Execute the raw commands passed in and return a string
        // representation of the MyRobot's path
        return this._execute(cmds, true);
    }
    execute() {
        // TODO: Work your magic here to pass the Kata :D
        return this._execute(this.tokens.join(''), false);
    }
}
module.exports = RSUProgram;