function execute(code) {
    console.log(code);

    let patterns = {};
    const deserializeCode = (c) => {
        while (c.match(/\)[0-9]/)) {
            c = c.replace(/\(([RLPF0-9]+)\)([0-9]+)/g, (_a, b, c) => b.repeat(+c));
        }
        while (c.match(/\)/)) {
            c = c.replace(/\(([RLFP0-9]+)\)/g, '$1');
        }
        c = c.replace(/([RLF])([0-9]+)/g, (_a, b, c) => b.repeat(+c));
        c = c.replace(/P([0-9]+)/g, (_a, b) => patterns[+b] ? patterns[+b].patternCode : `P${b}`);
        return c;
    }
    // we have to look for patterns as p<ID><code>q that are going to be used as P<ID>
    const patternsRegexed = code.match(/p[0-9]+[PRLF0-9()]+q/g);

    if (patternsRegexed) {
        patterns = patternsRegexed
            .reduce((agg, p) => {
                const [, index, patternCode] = p.match(/p([0-9]+)([PRLF0-9()]+)q/);
                // check if pattern has already been declared
                if (agg[index]) {
                    throw `Pattern ${index} already exists`;
                }
                return {
                    ...agg,
                    [index]: {
                        patternCode: deserializeCode(patternCode),
                        patternOriginalCode: patternCode,
                        needs: (patternCode.match(/P[0-9]+/g) || []).map(sp => sp.substr(1))
                    }
                }
            }, {});
        // check all patterns are defined
        const undefinedPatttterns = (code.match(/P[0-9]+/g) || [])
            .map(sp => sp.substr(1))
            .filter(x => !patterns[x]);
        if (undefinedPatttterns.length > 0) {
            throw `Missing patterns ${undefinedPatttterns.join(', ')}`;
        }
        // check patterns circular references
        const patternNames = Object.keys(patterns);
        console.log(patterns);

        for (let i = 0; i < patternNames.length; i++) {
            // check for circular references
            // we get the list of patterns the current pattern needs and check if they refer to the current pattern
            const circularReferencePatterns = patterns[patternNames[i]].needs
                .filter(pn => patterns[pn].needs.indexOf(patternNames[i]) > -1);
            if (circularReferencePatterns.length > 0) {
                throw `Pattern ${patternNames[i]} has a circular reference with patterns ${circularReferencePatterns.join(', ')}`
            }
        }
        // patterns are fine, let's deserialize them
        let patternsToDeserialize = patternNames
            .filter(pn => patterns[pn].patternCode.indexOf('P') > -1);
        while (patternsToDeserialize.length > 0) {
            for (let i = 0; i < patternsToDeserialize.length; i++) {
                patterns[patternsToDeserialize[i]].patternCode = deserializeCode(patterns[patternsToDeserialize[i]].patternCode);
            }
            patternsToDeserialize = patternNames
                .filter(pn => patterns[pn].patternCode.indexOf('P') > -1);
        }

        // we now replace the pattern code in the string
        for (let i = 0; i < patternNames.length; i++) {
            code = code.replace('p' + patternNames[i] + patterns[patternNames[i]].patternOriginalCode + 'q', '', 'g');
        }
    }

    // check all patterns are defined
    const undefinedPatttterns = (code.match(/P[0-9]+/g) || [])
        .map(sp => +sp.substr(1))
        .filter(x => !patterns[x]);
    if (undefinedPatttterns.length > 0) {
        throw `Missing patterns ${undefinedPatttterns.join(', ')}`;
    }

    code = deserializeCode(code);
    console.log(code);

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

function assertPathEquals(p1, p2) {
    if (p1 !== p2) {
        console.log('False');
    }
    else {
        console.log('True');
    }
}
assertPathEquals(execute('(F2LF2R)2FRF4L(F2LF2R)2(FRFL)4(F2LF2R)2'), "    **   **      *\r\n    **   ***     *\r\n  **** *** **  ***\r\n  *  * *    ** *  \r\n***  ***     ***  ");
assertPathEquals(execute('p0(F2LF2R)2q'), '*');
assertPathEquals(execute('p312(F2LF2R)2q'), '*');
assertPathEquals(execute('p0(F2LF2R)2qP0'), "    *\r\n    *\r\n  ***\r\n  *  \r\n***  ");
assertPathEquals(execute('p312(F2LF2R)2qP312'), "    *\r\n    *\r\n  ***\r\n  *  \r\n***  ");
assertPathEquals(execute('P0p0(F2LF2R)2q'), "    *\r\n    *\r\n  ***\r\n  *  \r\n***  ");
assertPathEquals(execute('P312p312(F2LF2R)2q'), "    *\r\n    *\r\n  ***\r\n  *  \r\n***  ");
assertPathEquals(execute('F3P0Lp0(F2LF2R)2qF2'), "       *\r\n       *\r\n       *\r\n       *\r\n     ***\r\n     *  \r\n******  ");
assertPathEquals(execute('(P0)2p0F2LF2RqP0'), "      *\r\n      *\r\n    ***\r\n    *  \r\n  ***  \r\n  *    \r\n***    ");

// throws
// execute('p0(F2LF2R)2qP1'); // ok
// execute('P0p312(F2LF2R)2q'); // ok
// execute('P312'); //ok

assertPathEquals(execute('P1P2p1F2Lqp2F2RqP2P1'), "  ***\r\n  * *\r\n*** *");
assertPathEquals(execute('p1F2Lqp2F2Rqp3P1(P2)2P1q(P3)3'), "  *** *** ***\r\n  * * * * * *\r\n*** *** *** *");

// throws
// execute('p1F2Lqp1(F3LF4R)5qp2F2Rqp3P1(P2)2P1q(P3)3');
// execute('p1F2RP1F2LqP1');
// execute('p1F2LP2qp2F2RP1qP1');