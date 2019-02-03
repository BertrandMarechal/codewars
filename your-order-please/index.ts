export function order(words: String): String {
  const wordsSplit: string[] = words.split(' ');
  const wordAndIndex = wordsSplit.map((x, i) => ({ index: i, number: +/[0-9]/.exec(x) }));
  wordAndIndex.sort((a, b) => a.number - b.number);

  return wordAndIndex.map(x => wordsSplit[x.index]).join(' ');
}