export class Kata {
    static descendingOrder(n: number) {
        const numbers = n.toString().split('').map(x => +x);
        numbers.sort((a, b) => b - a);
        return +numbers.map(x => `${x}`).join('')
    }
}

console.log(Kata.descendingOrder(1234506789));
