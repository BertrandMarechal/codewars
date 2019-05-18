function dblLinear(n) {
    let i = 0;
    let j = 0;
    let v = [1];
    while (true) {
        if (v[i]) {
            if (j === n) {
                return v[i];
            }
            j++;
            const y = 2 * v[i] + 1;
            const z = 3 * v[i] + 1;
            v[y] = y;
            v[z] = z;
        }   
        i ++;
    }
}
let now = new Date().getTime();
console.log(dblLinear(10));//22
console.log(dblLinear(20));//57
console.log(dblLinear(30));//91
console.log(dblLinear(50));//157
console.log(dblLinear(100));//447
console.log('t', new Date().getTime() - now);