export class G964 {
    public static accum(s: string):string {
        return s.split('').map((l, i) => l.toUpperCase() + l.toLowerCase().repeat(i)).join('-');
    }
}

G964.accum('abcd');