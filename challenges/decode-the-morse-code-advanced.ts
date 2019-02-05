// https://www.codewars.com/kata/decode-the-morse-code-advanced/train/typescript

const MORSE_CODE: { [code: string]: string } = {
    '.-': 'A',
    '-.': 'N',
    '-...': 'B',
    '---': 'O',
    '-.-.': 'C',
    '.--.': 'P',
    '-..': 'D',
    '--.-': 'Q',
    '.': 'E',
    '.-.': 'R',
    '..-.': 'F',
    '...': 'S',
    '--.': 'G',
    '-': 'T',
    '....': 'H',
    '..-': 'U',
    '..': 'I',
    '...-': 'V',
    '.---': 'J',
    '.--': 'W',
    '-.-': 'K',
    '-..-': 'X',
    '.-..': 'L',
    '-.--': 'Y',
    '--': 'M',
    '--..': 'Z',

    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '@': ' ',
    '-.-.--': '!',
    '---.': '!',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '.----.': '\'',
    '-..-.': '/',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '---...': ':',
    '-.-.-.': ';',
    '-...-': '=',
    '.-.-.': '+',
    '-....-': '-',
    '..--.-': '_',
    '.-..-.': '"',
    '...-..-': '$',
    '.--.-.': '@',
    '...---...': 'SOS',
}
const CODE_MORSE: { [code: string]: string } = Object.keys(MORSE_CODE).reduce((agg, key) => ({ ...agg, [MORSE_CODE[key]]: key }), {})
export const decodeBits = (bits: string) => {
    // ToDo: Accept 0's and 1's, return dots, dashes and spaces

    // remove prefix and suffix zeros
    bits = bits.replace(/^[0]+[1]/, '1');
    bits = bits.replace(/[1][0]+$/, '1');

    if (bits.indexOf('0') === -1) {
        return '.';
    }
    let debounce = bits.indexOf('0');
    const debounceb4 = debounce;
    
    if (debounce % 3 === 0) {
        // risk that we started with a dash.
        // we check if there is an occurence of the 3 * 3 debounce, else we had a dash
        if (!new RegExp(`[1][0]{${debounce * 3}}[1]`).test(bits) && !new RegExp(`[0][1]{${debounce * 3}}[0]`).test(bits) && bits.length%3 !== 0) {
            debounce = debounce / 3;
        }
    }

    return bits
        .replace(new RegExp('0000000'.repeat(debounce), 'g'), '   ')
        .replace(new RegExp('111'.repeat(debounce), 'g'), '-')
        .replace(new RegExp('000'.repeat(debounce), 'g'), ' ')
        .replace(new RegExp('1'.repeat(debounce), 'g'), '.')
        .replace(new RegExp('0'.repeat(debounce), 'g'), '');
};

export const decodeMorse = (morseCode: string) => {
    // ToDo: Accept dots, dashes and spaces, return human-readable message
    return morseCode
        .trim()
        .split('   ')
        .map(word => word.split(' ').map(x => MORSE_CODE[x]).join(''))
        .join(' ');
};

const tests = [
    '1100110011001100000011000000111111001100111111001111110000000000000011001111110011111100111111000000110011001111110000001111110011001100000011',
    '10001',
    '101',
    '111000111',
    '0000011111000001111100000',
    '111111111000111111111',
    'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.'
        .split(' ')
        .map(x => {
            return x
                .split('')
                .map(y => CODE_MORSE[y].split('').map(x => x === '.' ? '1' : '111').join('0') )
                .join('000')
        }).join('0000000')
];
for (let i = 0; i < tests.length; i++) {
    const element = tests[i];
    console.log(decodeMorse(decodeBits(element)));
    // console.log(decodeBits(element), decodeMorse(decodeBits(element)));
}

/*
"Dot" – is 1 time unit long.
"Dash" – is 3 time units long.
Pause between dots and dashes in a character – is 1 time unit long.
Pause between characters inside a word – is 3 time units long.
Pause between words – is 7 time units long.
*/
