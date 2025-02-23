/**
 * 返回传入的字符串的字节长度
 * @param {String} str
 * @returns Number
 */
function getStringByteLength(str) {
  if (typeof arguments[0] !== "string") {
    throw new Error("必须传字符串");
  }
  let byteLen = 0;
  for (let i = 0; i < str.length; i++) {
    // unicode 编码前255位（即ASCII码）是单字节，后面的都是双字节
    byteLen += str.charCodeAt(i) > 255 ? 2 : 1;
  }
  return byteLen;
}
