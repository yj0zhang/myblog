/**
 * 有一种将字母编码成数字的方式：'a'->1, 'b->2', ... , 'z->26'。
 * 现在给一串数字，返回有多少种可能的译码结果
 * 解码
 * @param nums string字符串 数字串
 * @return int整型
 */
function solve(nums) {
  // write code here
  // 使用数组dp存储前i个数字的解码数量
  // 在第i个数字处，有两种解码方式：
  // 如果单独解码，则dp[i] = dp[i - 1]
  // 如果和前一个数字一起解码，则dp[i] = dp[i-2]
  // 这两种方式的和就是dp[i]，但是要注意解码的数字需要在1到26之间，否则不能解码
  if (nums.length === 0) {
    return 0;
  }
  const dp = [];
  dp[0] = 1; // 空字符串有一种解码方式
  dp[1] = nums.charAt(0) !== "0" ? 1 : 0; // 第一个数字不能为0
  for (let i = 2; i <= nums.length; i++) {
    const oneDigit = parseInt(nums.charAt(i - 1), 10);
    const twoDigits = parseInt(nums.substring(i - 2, i), 10);
    if (oneDigit >= 1 && oneDigit <= 9) {
      dp[i] = dp[i - 1];
    } else {
      dp[i] = 0; // 如果单个数字不在1到9之间，则不能单独解码
    }
    if (twoDigits >= 10 && twoDigits <= 26) {
      dp[i] = dp[i] + dp[i - 2];
    }
  }
  console.log(dp[nums.length]);
  return dp[nums.length];
}
solve("12"); // 输出2
solve("226"); // 输出3
solve("0"); // 输出0
solve("06"); // 输出0
solve("10"); // 输出1
solve("27"); // 输出1
solve("123456"); // 输出3
solve("890"); // 输出0
