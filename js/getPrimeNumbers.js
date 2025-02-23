/**
 * 获取小于max的所有质数
 * @param {Number} max
 */
function getPrimeNumbers(max) {
  let c = 0;
  let ret = [];
  for (let i = 2; i <= max; i++) {
    for (let j = 1; j <= i; j++) {
      if (i % j === 0) {
        c++;
      }
    }
    if (c === 2) {
      ret.push(i);
    }
    c = 0;
  }
  return ret;
}
