export default function add(x: number): any {
    const fn = (n: number) => add(n + x);
    fn.valueOf = () => x;
    return fn;
}

console.log(add(1));
console.log(add(1)(2));
console.log(add(1)(3)(4));
console.log(add(1)(3)(4)(5));