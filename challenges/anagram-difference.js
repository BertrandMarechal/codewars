function anagramDifference(w1,w2){
    const w2Bis = w1;
    let same = 0;
    for (let i = 0; i < w1.length; i++) {
        if (w2Bis.indexOf(w1[i]) > -1) {
            w2Bis = w2Bis.replace(w1[i], '');
            same++;
        }
    }
    return w1.length - same + w2.length - same;
}