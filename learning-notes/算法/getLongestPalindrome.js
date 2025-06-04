/**
 * 最长回文子串
 * 思路：
 * 1. 使用中心扩展法，遍历每个字符作为中心，向两边扩展寻找回文子串。
 * 2. 对于每个字符，考虑两种情况：奇数长度回文（以该字符为中心）和偶数长度回文（以该字符和下一个字符为中心）。
 * 3. 在扩展过程中，记录最长的回文子串长度。
 * 4. 时间复杂度为 O(n^2)，空间复杂度为 O(1)。
 * @param A string字符串
 * @return int整型
 */
function reverseSting(str) {
  // 反转字符串
  return str.split("").reverse().join("");
}
function getLongestPalindrome(A) {
  // write code here
  if (A.length === 0) {
    return 0; // 如果字符串为空，返回0
  }
  let maxLength = 1; // 最小回文长度为1
  for (let i = 1; i < A.length; i++) {
    for (let j = i - 1; j >= 0 && i - j <= A.length - i; j--) {
      // 以i为中心，向两边扩展
      //   console.log(
      //     `以${i}为中心，向两边扩展: `,
      //     A.substring(j, i),
      //     reverseSting(A.substring(i + 1, i + 1 + (i - j)))
      //   );
      if (
        A.substring(j, i) === reverseSting(A.substring(i + 1, i + 1 + (i - j)))
      ) {
        maxLength = Math.max(maxLength, 2 * (i - j) + 1);
      }
      // 以i和i - 1为中心，向两边扩展
      //   console.log(
      //     `以${i}和${i - 1}为中心，向两边扩展: `,
      //     A.substring(j, i),
      //     reverseSting(A.substring(i, i + (i - j)))
      //   );
      if (A.substring(j, i) === reverseSting(A.substring(i, i + (i - j)))) {
        maxLength = Math.max(maxLength, 2 * (i - j));
      }
    }
  }
  return maxLength; // 返回最长回文子串的长度
}
//
console.log(getLongestPalindrome("babad")); // 输出3
console.log(getLongestPalindrome("cbbd")); // 输出2
console.log(getLongestPalindrome("a")); // 输出1
console.log(getLongestPalindrome("ac")); // 输出1
console.log(getLongestPalindrome("racecar")); // 输出7
console.log(getLongestPalindrome("")); // 输出0
