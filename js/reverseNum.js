/**
 * 把一个正整数翻转，比如：789->987
 * @param {Number} num 正整数
 */
function reverseNum(num) {
  if (!(typeof num === "number") || Math.floor(num) !== num || num <= 0) {
    //不是数字、不是整数、不是正数
    return;
  }
  let ret = "";
  while (num > 0) {
    ret += num % 10;
    num = Math.floor(num / 10);
  }
  return Number(ret);
}

console.log(reverseNum(123456789));
