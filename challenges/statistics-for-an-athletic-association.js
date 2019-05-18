function stat(strg) {
    if (strg === '') return '';
    let times = strg
        .replace(', ', ',')
        .split(',')
        .map(timestr => timestr.split('|').map(x => +x))
        .map(times => times[0] * 3600 + times[1] * 60 + times[2])
        .sort((a, b) => a - b);
    const data = times
        .reduce((agg, curr) => {
            agg.count++;
            agg.total += curr;
            agg.max = Math.max(agg.max, curr);
            agg.min = Math.min(agg.min, curr);
            return agg;
        }, { total: 0, count: 0, min: times[0], max: times[0] });
    const range = data.max - data.min;
    const average = data.count ? data.total / data.count : 0;
    let median = 0;
    if (times.length % 2 === 0) {
        median = (times[times.length / 2] + times[times.length / 2 - 1]) / 2.0;
    } else {
        median = times[Math.floor(times.length / 2)];
    }
    console.log(times, median, times.length % 2);
    const convert = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = Math.floor((time - hours * 3600 - minutes * 60));
        return [hours, minutes, seconds].map(t => `00${t}`.substr(-2)).join('|');
    }
    return ['Range:', convert(range), 'Average:', convert(average), 'Median:', convert(median)].join(' ');
}