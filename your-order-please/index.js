function order(words) {
  const wordsSplit = words.split(' ');
  const wordAndIndex = wordsSplit.map((x, i) => ({ index: i, number: +/[0-9]/.exec(x) }));
  wordAndIndex.sort((a, b) => a.number - b.number);
  return wordAndIndex.map(x => wordsSplit[x.index]).join(' ');
}

module.exports = order;

console.log(order("is2 Thi1s T4est 3a"));
