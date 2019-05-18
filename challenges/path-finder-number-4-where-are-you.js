function IamHere(path) {
    this.coords = this.coords || [0, 0];
    this.direction = this.direction || 'n';
    const directions = ['n', 'e', 's', 'w'];

    const commands = path.match(/[RrLl]|[0-9]+/g);
    if (commands) {
        for (let i = 0; i < commands.length; i++) {
            const element = commands[i];
            if (/[RrLl]/.test(element)) {
                let delta = 0;
                switch (element) {
                    case 'R':
                        delta += 2;
                        break;
                    case 'L':
                        delta -= 2;
                        break;
                    case 'r':
                        delta += 1;
                        break;
                    case 'l':
                        delta -= 1;
                        break;
                    default:
                        break;
                }
                const newIndex = directions.indexOf(this.dir) + delta;
                this.dir = newIndex < 0 ? directions[newIndex + 4] : (newIndex > 3 ? directions[newIndex - 4] : directions[newIndex]);
            } else {
                switch (this.dir) {
                    case 'n':
                        coords[1] += +element;
                        break;
                    case 's':
                        coords[1] -= element;
                        break;
                    case 'e':
                        coords[0] += +element;
                        break;
                    case 'w':
                        coords[0] -= element;
                        break;

                    default:
                        break;
                }
            }
        }
    }
    return coords;
}
function WhereAreYou(path, result) {
    console.log(IamHere(path).join(), result.join(), path);
}

WhereAreYou('', [0, 0]);
WhereAreYou('RLrl', [0, 0]);
WhereAreYou('r5L2l4', [4, 3]);
WhereAreYou('r5L2l4', [0, 0]);