function solution(list) {
    return list
        .reduce((agg, curr) => {
            if (agg.length > 0 && agg[agg.length - 1].last === curr - 1) {
                agg[agg.length - 1].last = curr;
            } else {
                agg.push({
                    start: curr,
                    last: curr
                });
            }
            return agg;
        }, [])
        .reduce((agg, curr) => {
            if (curr.last - curr.start < 2) {
                for (let i = curr.start; i < curr.last + 1; i++) {
                    agg.push(`${i}`);
                }
            } else {
                agg.push(`${curr.start}-${curr.last}`);
            }
            return agg;
        }, [])
        .join(',');
}
console.log(solution([-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20]) === "-6,-3-1,3-5,7-11,14,15,17-20")
console.log(solution([-6, -3, -2, -1, 0, 1, 3, 4, 5, 7, 8, 9, 10, 11, 14, 15, 17, 18, 19, 20]))
console.log("-6,-3-1,3-5,7-11,14,15,17-20");