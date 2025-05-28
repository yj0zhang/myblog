/**
 * 给定数组arr，arr中所有的值都为正整数且不重复。
 * 每个值代表一种面值的货币，每种面值的货币可以使用任意张，
 * 再给定一个aim，代表要找的钱数，求组成aim的最少货币数。
 * 如果无解，请返回-1.
 *
 * 最少货币数
 * @param arr int整型一维数组 the array
 * @param aim int整型 the target
 * @return int整型
 */
function minMoney(arr, aim) {
  // write code here
  // 使用数组dp存储组成金额i的最少货币数
  // 金额0的最少货币数为0，金额aim的最大货币数是aim（每个货币都是1），
  // 我们可以初始化dp数组：每个元素的值是aim+1，再用较小的数量替换，
  // 并且dp是从0开始的，所以dp的长度是aim+1
  // 初始化后，需要设置dp[0] = 0， 因为金额0的最少货币数为0
  // 然后从1到aim遍历每个金额，变量为i，
  // 对比每个金额i，遍历每个货币面值arr[j]，
  // 可得公式：dp[i] = Math.min(dp[i], dp[i - arr[j]] + 1)
  // 其中dp[i - arr[j]]表示使用了面值为arr[j]的货币后，剩余金额的最少货币数
  // 如果dp[i]没有被更新，说明无法组成该金额，返回-1
  if (arr.length === 0 || aim < 0) {
    return -1;
  }
  const dp = new Array(aim + 1).fill(aim + 1);
  dp[0] = 0; // 金额0的最少货币数为0
  for (let i = 1; i <= aim; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i - arr[j] >= 0) {
        dp[i] = Math.min(dp[i], dp[i - arr[j]] + 1);
      }
    }
  }
  console.log(dp[aim] > aim ? -1 : dp[aim]);
  return dp[aim] > aim ? -1 : dp[aim];
}
minMoney([1, 2, 5], 11); // 输出3
minMoney([3, 5, 10], 7); // 输出-1
minMoney([1, 2, 5], 0); // 输出0
minMoney([1, 2, 5], 1); // 输出1
