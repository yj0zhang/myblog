/**
 * 给定一个 n * m 的矩阵 a，
 * 从左上角开始每次只能向右或者向下走，最后到达右下角的位置，
 * 路径上所有的数字累加起来就是路径和，
 * 输出所有的路径中最小的路径和。
 * @param matrix int整型二维数组 the matrix
 * @return int整型
 */
function minPathSum(matrix) {
  // write code here
  // 二维数组dp[i][j]存储到达i,j位置的最小路径和
  // dp[i][j] = Math.min(dp[i][j-1], dp[i-1][j])
  // 先算出第一行和第一列
  const dp = [];
  matrix.forEach((item, i) => {
    dp[i] = dp[i] ?? [];
    item.forEach((val, j) => {
      if (i === 0) {
        dp[i][j] = val + (dp[i][j - 1] ?? 0);
      } else if (j === 0) {
        dp[i][j] = val + (dp[i - 1]?.[j] ?? 0);
      } else {
        dp[i][j] = val + Math.min(dp[i][j - 1], dp[i - 1][j]);
      }
    });
  });
  //   console.log(dp);
  const minVal = dp.pop().pop();
  //   console.log(minVal);
  return minVal;
}
minPathSum([
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
]); // 输出7
minPathSum([
  [1, 2, 3],
  [4, 5, 6],
]); // 输出12
minPathSum([
  [1, 2],
  [3, 4],
]); // 输出7
minPathSum([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]); // 输出21
minPathSum([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
]); // 输出33
minPathSum([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
]); // 输出48
