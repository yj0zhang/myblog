/**
 * 给定两个字符串str1和str2，输出两个字符串的最长公共子序列。
 * 如果最长公共子序列为空，则返回"-1"。
 * longest common subsequence 最长公共子序列
 * @param s1 string字符串 the string
 * @param s2 string字符串 the string
 * @return string字符串
 */
function LCS(s1, s2) {
  // write code here
  if (s1.length === 0 || s2.length === 0) {
    return "-1";
  }
  const dp = []; //二维数组，存储在i,j处结尾的最长公共子序列的长度和上一个值的方向
  for (let i = 0; i < s1.length; i++) {
    //处理特殊情况
    dp[i] = dp[i] ?? [];
    dp[i][0] = {
      len:
        s1.charAt(i) === s2.charAt(0)
          ? 1
          : Math.max(dp[i - 1]?.[0]?.len || 0, 0),
      // 如果s1的第i个字符和s2的第一个字符相等，则长度为1，否则为上一个长度
      prePoint: null,
    };
    if (s1.charAt(i) !== s2.charAt(0) && dp[i][0].len === 1) {
      dp[i][0].prePoint = [i - 1, 0];
    }
  }
  for (let i = 0; i < s2.length; i++) {
    //处理特殊情况
    dp[0] = dp[0] ?? [];
    dp[0][i] = {
      // 如果s1的第一个字符和s2的第i个字符相等，则长度为1，否则为左边的最大值
      len:
        s1.charAt(0) === s2.charAt(i) ? 1 : Math.max(dp[0][i - 1]?.len || 0, 0),
      prePoint: null,
    };
    if (s1.charAt(0) !== s2.charAt(i) && dp[0][i].len === 1) {
      dp[0][i].prePoint = [0, i - 1];
    }
  }
  for (let i = 1; i < s1.length; i++) {
    for (let j = 1; j < s2.length; j++) {
      if (s1.charAt(i) === s2.charAt(j)) {
        // 如果相等，则最长公共子序列长度为前一个长度加1
        // 并且上一个点的方向为左上角
        dp[i][j] = {
          len: 1 + dp[i - 1][j - 1].len,
          prePoint: [i - 1, j - 1],
        };
      } else {
        // 如果不相等，则最长公共子序列长度为左边和上边的最大值
        // 并且上一个点的方向为左边或上边
        const leftLen = dp[i][j - 1] ? dp[i][j - 1].len : 0;
        const upLen = dp[i - 1][j] ? dp[i - 1][j].len : 0;
        dp[i][j] = {
          len: Math.max(leftLen, upLen),
          prePoint: leftLen > upLen ? [i, j - 1] : [i - 1, j],
        };
      }
    }
  }
  //   console.log(
  //     dp.map((row) =>
  //       row.map((item) => ({
  //         ...item,
  //         prePoint: item.prePoint ? item.prePoint.join(",") : null,
  //       }))
  //     )
  //   );
  // 输出最长公共子序列索引
  let current = dp[s1.length - 1][s2.length - 1];
  let curIndexs = [s1.length - 1, s2.length - 1];
  let path = [],
    str = "";
  while (current.prePoint) {
    const pre = dp[current.prePoint[0]][current.prePoint[1]];
    if (current.len === pre.len + 1) {
      path.unshift(curIndexs);
      str = s1.charAt(curIndexs[0]) + str;
    }
    curIndexs = current.prePoint;
    current = dp[current.prePoint[0]][current.prePoint[1]];
  }
  const first = path[0];
  const firstPoint = first ? dp[first[0]][first[1]] : null;
  if (
    !current.prePoint &&
    ((firstPoint && firstPoint.len === current.len + 1) ||
      firstPoint === null) &&
    current.len > 0
  ) {
    // 如果当前点没有上一个点，并且当前长度等于上一个长度加1，说明是起点
    // 需要将起点加入路径
    path.unshift(curIndexs);
    str = s1.charAt(curIndexs[0]) + str;
  }
  //   console.log("Path:", path);
  console.log("LCS:", str);
  return str || "-1";
}
// [2, 3][(1, 2)][(1, 1)][(0, 0)];
// Example usage
LCS("ABCD", "ABDC"); // 输出 "ABD"
LCS("ABCBDAB", "BDCAB"); // 输出 "BCAB"
LCS("AGGTAB", "GXTXAYB"); // 输出 "GTAB"
LCS("AGGTAB", "GXTXAYB"); // 输出 "GTAB"
LCS("AAB", "ABA"); // 输出 "AA"
LCS("AAB", "BBA"); // 输出 "A"
LCS(
  "EKhHnp06qE75TmA7036PyZdlzad49gGNsEAe0830ozh5zKD1w3ngrA7VA0OvK15v12WzqDERP375C3NJKP934O8Ix0NF412B6Kk2hbALBzYFq66r0BuSPt1KD816nwOWB0M1dK2Cg1s9O6IfQTS0bT852U78SSjk4astw2KKvudmsavy2699Ut1DN3bp0cbJuB131j6W8L7NTf8NnfznSWtF7g3UDB9O68UXU730f02WLnPGCcHOn0SRnnuXrQ862Z77Jo24H3WAmEZG5BbKztIec1OFr7kXS54k1HBN5Mqx5f6SzL6Po3LDXmIlb613ZBozxg5c9Uc3Bnssp17E1ch2ZS5LGn4TYf2CN88J2GC43k12hV4zeg23S4D3LNM31R6R3JuoMDBwHc349pzjmb7nCxWysf9csh4vC30k5185H023UI6E2Eiwys8bhb97CoDv16X40iNgb89O0c2C4y0Ew0FoHSFyePi34s2ik9H5KFgD7aCbar29j2bNxGo7ym1xO5VQouJAhmAZhBVHF6QPspcvn90zH8B2928Lae8a6JD28z38Z56Urr1MB8753xi5NfdGqA5CekTU0MStGmDBOzTE0GAfc3ygNLLTe0rwQ2WN4rX62YiwOBkX3OUJt8IR2Z7xv6u3g0E3498072lOGX6nm6zQJsV38HN4IFL9ekbWdMEr904wkK4mbEjz0ff3NB7G1x4Q42o9X2Vj5kDuSFl7HOT8CyMzw18kVoiDj3ri0EB2zl585M93rdOlcXL1acrR4m1VmRNRkj6YOsxa7g841UG77T5e2N61iZ1375A9BMKj5Li15rNKR33dXU6dNASuEBTgL4IR347M6kK40L6ui7uLW64qIUpPZvy5s3LP9827FWJEH98aB68rhp8xqUhJ6VPv4HJudP1l5wwL7g2B2o9s9P377Ed4c24e5HmDs5RU8YbB9uCGHC5da081o4C26FhJR8NSe0tIKoHPgbq31zNEmDo1nF3l1O4aSy0LF9dfthJFy0nWzyMdCy6du3bRNF8z93MKF1bJbehe16cqHXqFJI54aE3K9h8pooBgSqG4U9FH2eZT3IB21RJH24e9lrGpE8l22WOB3WmMj806890C45Few54gN5F1jBO2Ge5KqSopHaqK2FkvVStbeFkz4p143709gLtwIiww9E2Eg9VPty7Jx7ej7nmW5rfpnfwXWiD6zNg9z7J2ybs96l23868bytw8cA0H2kAA1QOidYvrA255bAZt0x5GTIrOP5I0ynCRsT54MYiDgFkJX7I7X9F2K3n369GOl8Ih3w7vwpq4f214e2l0745K9ighL6Pz7PNCO8oP5YNQ3oHXK7HV82bUSPk19kwu8xRRp8mNBAeo2W7yMe64UQD6W95fFo1NS2Q49e958w493WVL3O2t98Au6P3z3Bifb2bmQL1GXcL9VT1X3EgnmvnN03yqGVt278KLL5rJv05U7GUFOi957m8UFn5156Bg9ZcC9OM4Y2jdI1590XO9SrOF222gG13fP9WCNZ47298lZKA5h4sA20pyDqao3PP5YCCcIfTvsYy2ZR5w93s4Y8j0as32gy0ItXOzpqyp7hzik9P958hh8rEULpx1q63bo51Y3s8jLpCusP7O34REDjmixA2s2i4wbcVVshrvio1E4dJB77r2X6J3j8oW6LfmDuDpy3xy5wnJzAwjS5T78",
  "kQlReRfFX"
); // 输出 "kQlReRfFX"
LCS("94g5gd", "45d"); // 输出 "45d"
LCS("ABC", "DEF"); // 输出 ""
LCS("A", "B"); // 输出 ""
LCS("A", "A"); // 输出 "A"
LCS("A", "AA"); // 输出 "A"
LCS("AA", "A"); // 输出 "A"
