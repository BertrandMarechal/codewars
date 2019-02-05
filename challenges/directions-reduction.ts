// https://www.codewars.com/kata/550f22f4d758534c1100025a/train/typescript

export class G964 {

    public static dirReduc = (arr: string[]) => {
        let dirsAsString = arr.map(x => x.substr(0, 1).toLowerCase()).join('');
        let differences = true;
        while (differences) {
            const len = dirsAsString.length;
            dirsAsString = dirsAsString
                .replace(/ns/g,'')
                .replace(/sn/g,'')
                .replace(/ew/g,'')
                .replace(/we/g,'');
            differences = len !== dirsAsString.length;
        }
        return dirsAsString.split('').map(x => {
            switch (x) {
                case 'w':
                    return 'WEST';
                case 'e':
                    return 'EAST';
                case 's':
                    return 'SOUTH';
                case 'n':
                    return 'NORTH';
            }
        });
    }
}


console.log(G964.dirReduc(["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"]));
console.log(G964.dirReduc(["NORTH","SOUTH","SOUTH","EAST","WEST","NORTH"]));
