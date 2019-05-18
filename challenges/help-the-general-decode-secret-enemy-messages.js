// console.log (1, device.encode ('What is this ?')) ;
// 1 'EFhZINtl3rgKW9'
// console.log (2, device.encode ('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')) ;
// 2 'bdhpF,82QsLirJejtNmzZKgnB3SwTyXG ?.6YIcflxVC5WE94UA1OoD70MkvRuPqHabdhpF,82QsLir'
// console.log (3, device.encode ('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')) ;  
// 3 'dhpF,82QsLirJejtNmzZKgnB3SwTyXG ?.6YIcflxVC5WE94UA1OoD70MkvRuPqHabdhp'
// console.log (4, device.encode ('!@#$%^&*()_+-')) ;
// 4 '!@#$%^&*()_+-'
// console.log (5, 'abcdefghijklmnopqrstuvwxyz') ;
// 5 'abcdefghijklmnopqrstuvwxyz'
// console.log (6, 'abcdefghijklmnopqrstuvwxyz'.split ('').map (function (a) {
//   return device.encode (a) ;
// }).join ('')) ;
// 6 'bdfhjlnprtvxzBDFHJLNPRTVXZ'
// console.log (7, 'abcdefghijklmnopqrstuvwxyz'.split ('').map (function (a) {
//   return device.encode ('_'+a)[1] ;
// }).join ('')) ;
// 7 'dhlptxBFJNRVZ37,aeimquyCGK'
// console.log (8, 'abcdefghijklmnopqrstuvwxyz'.split ('').map (function (a) {
    //   return device.encode ('__'+a)[2] ;
    // }).join ('')) ;
    // 8 'hpxFNV3,emuCKS08bjrzHPX5 g'

device.decode = function (w) {
    // 1 to 1 char encoding
    // special chars as '!@#$%^&*()_+-' not encoded
    return w ;
}