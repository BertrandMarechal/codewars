export const findOdd = (xs: number[]): number => {
    const readyToReturn = xs.reduce((agg, current) => ({...agg, [current]: (agg[current] || 0) + 1}), {});
    const keys = Object.keys(readyToReturn);
    for (let i = 0; i < keys.length; i++) {
        if (readyToReturn[keys[i]]%2 === 1) {
            return +keys[i];
        }
    }
  };
  