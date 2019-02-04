// https://www.codewars.com/kata/tortoise-racing/train/typescript
export class G964 {

    public static race = (v1, v2, g) => {
        // d1(x) = v1 * x
        // d2(x) = v2 * x + g
        // v1 * x = v2 * x + g
        // x = g / (v1 - v2)
        if (v1 > v2) {
            return null;
        }
        const tSec = Math.floor(g / (v2 - v1) * 60 * 60);
        const hours = Math.floor(tSec / 3600);
        const minutes = Math.floor((tSec - hours * 3600) / 60);
        const secondes = tSec - hours * 3600 - minutes * 60;
        return [hours, minutes, secondes];
    }    
}
console.log(G964.race(720, 850, 70), [0, 32, 18]);
console.log(G964.race(80, 91, 37), [3, 21, 49]);
console.log(G964.race(80, 100, 40), [2, 0, 0]);
console.log(G964.race(720, 850, 37), [0, 17, 4]);