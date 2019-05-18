function playPass(s, n) {
    let chars = s.split('');
    for (let i = 0; i < chars.length; i++) {
        const chr = chars[i];
        if (/[0-9]/.test(chr)) {
            // 2. replace each digit by its complement to 9,
            chars[i] = `${9 - +chars[i]}`;
        } else if (/[a-z]/i.test(chr)) {
            // 1. shift each letter by a given number but the transformed letter must be a letter (circular shift),
            let chrCode = chr.charCodeAt(0) + n;
            if (chrCode > 90) {
                chrCode = 64 + (chrCode - 90);
            }
            chars[i] = String.fromCharCode(chrCode);
            if (i % 2) {
                // 4. downcase each letter in odd position, upcase each letter in even position (the first character is in position 0),
                chars[i] = chars[i].toLowerCase();
            }
        }
        // 3. keep such as non alphabetic and non digit characters,

    }
    // 5. reverse the whole result.
    return chars.reverse().join('');
}

console.log(playPass("I LOVE YOU!!!", 1) === "!!!vPz fWpM J",
    playPass("I LOVE YOU!!!", 1));
console.log(playPass("MY GRANMA CAME FROM NY ON THE 23RD OF APRIL 2015", 2) === "4897 NkTrC Hq fT67 GjV Pq aP OqTh gOcE CoPcTi aO",
    playPass("MY GRANMA CAME FROM NY ON THE 23RD OF APRIL 2015", 2));