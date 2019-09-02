// https://www.codewars.com/kata/convert-string-to-camel-case/train/javascript
function toCamelCase(str) {
    return str.replace(/([_-])([a-z])/gi, (a, b, s) => s.toUpperCase())
}
console.log(toCamelCase('the_stealth_warrior'));