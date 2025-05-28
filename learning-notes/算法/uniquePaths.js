/**
 * 一个机器人在m×n大小的地图的左上角（起点）。
 * 机器人每次可以向下或向右移动。机器人要到达地图的右下角（终点）。
 * 可以有多少种不同的路径从起点走到终点？
 * @param m int整型
 * @param n int整型
 * @return int整型
 */
function uniquePaths(m, n) {
  // write code here
  // 在(m,n)的上一步，有两种情况，在左边(m, n-1)，在上面(m-1, n)
  // 所以f(m,n)=f(m,n-1)+f(m-1,n)
  // 使用dp[m][n]存储路径数量，初始情况下，dp[0][0-n]是1，dp[0-m][0]也是1
  const dp = [];
  for (let i = 0; i < m; i++) {
    dp[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 1;
      } else {
        dp[i][j] = dp[i][j - 1] + dp[i - 1][j];
      }
    }
  }
  return dp[m - 1][n - 1];
}
// uniquePaths(3, 7); // 28
// uniquePaths(3, 2); // 3
// uniquePaths(7, 3); // 28
// uniquePaths(3, 3); // 6
// uniquePaths(1, 1); // 1
// uniquePaths(2, 2); // 2
// uniquePaths(2, 3); // 3
// uniquePaths(2, 1); // 1
// uniquePaths(1, 3); // 1
