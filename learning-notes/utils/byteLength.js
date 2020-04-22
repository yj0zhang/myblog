//获取字符串的字节长度
export function byteLength(str) {
  var len = 0;

  if (!str) {
    return len;
  }

  for (var i = 0; i < str.length; i++) {
    var a = str.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }

  return len;
}
