// Take an integer n (n >= 0) and a digit d (0 <= d <= 9) as an integer.
// Square all numbers k (0 <= k <= n) between 0 and n.
// Count the numbers of digits d used in the writing of all the k**2.
// Call nb_dig (or nbDig or ...) the function taking n and d as parameters and returning this count.
export class G964 {
    public static nbDig(n, d) {
        let count = 0;
        const regex = new RegExp(`[${d}]`, 'g');
        for (let i = 0; i < n + 1; i++) {
            const iToString = (i * i).toString();
            count += (iToString.match(regex) || []).length;
        }
        return count;
    }
}

console.log(G964.nbDig(5750, 0)); // 4700
console.log(G964.nbDig(11011, 2)); // 9481
console.log(G964.nbDig(12224, 8)); // 7733
console.log(G964.nbDig(11549, 1)); // 11905