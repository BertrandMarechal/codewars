export class G964 {
    static maxCharCode = 'm'.charCodeAt(0);

    public static printerError(s: string): string {
        const errorCount = s
            .split('')
            .filter(x => x.charCodeAt(0) > G964.maxCharCode)
            .length;
        return `${errorCount}/${s.length}`;
    }
}
