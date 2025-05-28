/**
 * 给定两个字符串str1和str2,输出两个字符串的最长公共子串
 * longest common substring
 * @param str1 string字符串 the string
 * @param str2 string字符串 the string
 * @return string字符串
 */
function LCS(str1, str2) {
  // write code here
  // 处理特殊情况
  // 用一个二维数组dp，存储在i,j处结尾的最长公共子串的长度
  // 如果i,j处的字符相等，则dp[i][j] = dp[i-1][j-1] + 1
  // 如果不相等，则dp[i][j] = 0
  // 记录最大长度和结束位置
  if (str1.length === 0 || str2.length === 0) {
    return "-1";
  }
  const dp = [];
  let maxLen = 0;
  let endIndex = [-1, -1]; // 用于记录最长公共子串的结束位置

  for (let i = 0; i < str1.length; i++) {
    dp[i] = [];
    for (let j = 0; j < str2.length; j++) {
      if (str1[i] === str2[j]) {
        // 如果相等，则最长公共子串长度为前一个长度加1
        dp[i][j] = (dp[i - 1]?.[j - 1] ?? 0) + 1;
        if (dp[i][j] > maxLen) {
          maxLen = dp[i][j];
          endIndex = [i, j];
        }
      } else {
        dp[i][j] = 0; // 不相等则长度为0
      }
    }
  }

  if (maxLen === 0) {
    return "-1"; // 没有公共子串
  }

  // 根据endIndex和maxLen提取最长公共子串
  return str1.slice(endIndex[0] - maxLen + 1, endIndex[0] + 1);
}
module.exports = {
  LCS: LCS,
};
LCS("abcde", "abfce"); // "ab"
LCS("abcdefg", "xyzabcde"); // "abcde"
LCS("abc", "def"); // "-1"
LCS("abcde", "xyz"); // "-1"
LCS("abcde", "ab"); // "ab"
LCS("abcde", "cde"); // "cde"
LCS("abcde", "de"); // "de"
LCS("abcde", "e"); // "e"
LCS("abcde", "a"); // "a"
LCS("abcde", "b"); // "b"
LCS("abcde", "f"); // "-1"
