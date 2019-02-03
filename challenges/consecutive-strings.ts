// https://www.codewars.com/kata/consecutive-strings/train/typescript
/*
You are given an array strarr of strings and an integer k.
Your task is to return the first longest string consisting of k consecutive strings taken in the array.
*/
export class G964 {
    public static longestConsec(strarr, k) {
        if (strarr.length === 0 || k > strarr.length || k <= 0) {
            return '';
        }
        const lengthArray = strarr.map(x => x.length);
        const evaluator = {
            max: 0,
            index: -1
        };
        for (let i = k - 1; i < lengthArray.length; i++) {
            let strLength = lengthArray[i];
            for (let j = i + 1 - k; j < i; j++) {
                strLength += lengthArray[j];
            }
            if (evaluator.max < strLength) {
                evaluator.max = strLength;
                evaluator.index = i;
            }
        }
        let returnString = '';
        for (let j = evaluator.index - k + 1; j < evaluator.index + 1; j++) {
            returnString += strarr[j];
        }
        return returnString;
    }
}
console.log(G964.longestConsec(["zone", "abigail", "theta", "form", "libe", "zas"], 2));
//"abigailtheta"
console.log(G964.longestConsec(["ejjjjmmtthh", "zxxuueeg", "aanlljrrrxx", "dqqqaaabbb", "oocccffuucccjjjkkkjyyyeehh"], 1));
//"oocccffuucccjjjkkkjyyyeehh"
console.log(G964.longestConsec(["it","wkppv","ixoyx", "3452", "zzzzzzzzzzzz"], 3));
//"ixoyx3452zzzzzzzzzzzz"