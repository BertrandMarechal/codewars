export function brainLuck(code: string, input: string) {
  const inpurSplit = input.split('').map(x => x.charCodeAt(0));
  const outputArray: number[] = [];
  const cells: number[] = [];
  let i = 0;

  const runCode = (subCode: string, isSubCode?: boolean) => {
    let carryOn = true;
    // console.log('runCode', subCode, isSubCode, i, cells, cells[i]);
    while (carryOn) {
      let iC = 0;
      let c = subCode[iC];
      while (c) {
        switch (c) {
          case '>': i++; break;
          case '<': i--; break;
          case '+': cells[i] = ((cells[i] || 0) === 255 ? 0 : ((cells[i] || 0) + 1)); break;
          case '-': cells[i] = ((cells[i] || 0) === 0 ? 255 : ((cells[i] || 0) - 1)); break;
          case '.': outputArray.push(cells[i]); break;
          case ',': cells[i] = inpurSplit.splice(0, 1)[0] || 0; break;
          case '[':
            let o = 0, c = 0;
            iC++;
            if (cells[i] !== 0) {
              let newCode = '';
              while (subCode[iC] !== ']' || c !== o) {
                newCode += subCode[iC];
                if (subCode[iC] === '[') {
                  o++;
                } else if (subCode[iC] === ']') {
                  c++;
                }
                iC++;
              }
              runCode(newCode, true);
            } else {
              while (subCode[iC] !== ']' || c !== o) {
                if (subCode[iC] === '[') {
                  o++;
                } else if (subCode[iC] === ']') {
                  c++;
                }
                iC++;
              }
            }
            break;
          default:
            break;
        }
        c = subCode[++iC];
      }
      carryOn = !!isSubCode && cells[i] !== 0;
    }
  };
  runCode(code);
  // console.log(outputArray);
  
  return outputArray.map(x => String.fromCharCode(x)).join('');
}
console.log(brainLuck(',+[-.,+]', 'Codewars' + String.fromCharCode(255)));
console.log(brainLuck(',[.[-],]', 'Codewars' + String.fromCharCode(0)));
console.log(brainLuck(',>,<[>[->+>+<<]>>[-<<+>>]<<<-]>>.', String.fromCharCode(8) + String.fromCharCode(9)));
console.log(brainLuck(',>+>>>>++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++<<<<<<[>[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]<[>++++++++++[-<-[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<[>>>+<<<-]>>[-]]<<]>>>[>>+>+<<<-]>>>[<<<+>>>-]+<[>[-]<[-]]>[<<+>>[-]]<<<<<<<]>>>>>[++++++++++++++++++++++++++++++++++++++++++++++++.[-]]++++++++++<[->-<]>++++++++++++++++++++++++++++++++++++++++++++++++.[-]<<<<<<<<<<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]<-[>>.>.<<<[-]]<<[>>+>+<<<-]>>>[<<<+>>>-]<<[<+>-]>[<+>-]<<<-]', String.fromCharCode(10)));