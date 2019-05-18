function topThreeWords(text) {
    const words = (text.match(/[a-z]+(\'[a-z]+)*/ig) || []).map(x => x.toLowerCase());

    const wordCounts = words.reduce((agg, curr) => {
        agg[curr] = (agg[curr] || 0) + 1;
        return agg;
    }, {});
    return Object.keys(wordCounts)
        .map(x => ({ w: x, c: wordCounts[x] }))
        .sort((a, b) => b.c - a.c)
        .slice(0, 3)
        .map(c => c.w);
}

function assertDeepEquals(a, b) {

    if (a.join() !== b.join()) {
        console.log(a, b);
    } else {
        console.log('Ok');
    }
}

assertDeepEquals(topThreeWords("a a a  b  c c  d d d d  e e e e e"), ['e', 'd', 'a'])

assertDeepEquals(topThreeWords("a a c b b"), ['a', 'b', 'c'])

assertDeepEquals(topThreeWords("e e e e DDD ddd DdD: ddd ddd aa aA Aa, bb cc cC e e e"), ['e', 'ddd', 'aa'])

assertDeepEquals(topThreeWords("  //wont won't won't "), ["won't", "wont"])

assertDeepEquals(topThreeWords("  , e   .. "), ["e"])

assertDeepEquals(topThreeWords("  ...  "), [])

assertDeepEquals(topThreeWords("  '  "), [])

assertDeepEquals(topThreeWords(`In a village of La Mancha, the name of which I have no desire to call to
mind, there lived not long since one of those gentlemen that keep a lance
in the lance-rack, an old buckler, a lean hack, and a greyhound for
coursing. An olla of rather more beef than mutton, a salad on most
nights, scraps on Saturdays, lentils on Fridays, and a pigeon or so extra
on Sundays, made away with three-quarters of his income.`), ['a', 'of', 'on'])