// https://www.codewars.com/kata/integers-recreation-one/train/typescript

// Divisors of 42 are : 1, 2, 3, 6, 7, 14, 21, 42.
// These divisors squared are: 1, 4, 9, 36, 49, 196, 441, 1764.
// The sum of the squared divisors is 2500 which is 50 * 50, a square!

// Given two integers m, n (1 <= m <= n) we want to find all integers between m and n whose sum of squared divisors
// is itself a square. 42 is such a number.

export class G964 {

    public static listSquared = (m: number, n: number) => {
        const returnArray = [];
        for (let i = m; i <= n; i++) {
            const divisors = [];
            for (let j = 1; j <= i; j++) {
                if (i%j === 0) {
                    divisors.push(j);
                }
            }
            const divisorsSquared = divisors.map(x => x*x);
            const divisorsSquaredSum = divisorsSquared.reduce((agg, curr) => agg + curr, 0);
            if (Math.sqrt(divisorsSquaredSum) === Math.floor(Math.sqrt(divisorsSquaredSum))) {
                returnArray.push([i, divisorsSquaredSum]);
            }
        }
        return returnArray;
    }
}


// testing(1, 250, [[1, 1], [42, 2500], [246, 84100]]);
// testing(42, 250, [[42, 2500], [246, 84100]]);
// testing(250, 500, [[287, 84100]]);
// testing(300, 600, []);

console.log(G964.listSquared(1, 250))
