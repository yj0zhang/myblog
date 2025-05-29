/**
 * 最长严格上升子序列问题。
 * 题目描述：
 * 给定一个整数数组，求其中最长严格上升子序列的长度。
 * 严格上升子序列是指子序列中的元素严格递增。
 * 例如，给定数组 [10, 9, 2, 5, 3, 7, 101, 18]，最长严格上升子序列为 [2, 3, 7, 101]，长度为 4。
 * 该问题可以使用动态规划来解决。
 * 动态规划思路：
 * 1. 初始化一个 dp 数组，dp[i] 表示以 arr[i] 结尾的最长严格上升子序列的长度。
 * 2. 遍历数组，对于每个元素 arr[i]，遍历之前的元素 arr[j] (j < i)，
 *    如果 arr[j] < arr[i]，则可以将 arr[i] 添加到以 arr[j] 结尾的子序列中。
 *    更新 dp[i] = max(dp[i], dp[j] + 1)。
 * 3. 最终，最长严格上升子序列的长度为 dp 数组中的最大值。
 * 4. 时间复杂度为 O(n^2)，空间复杂度为 O(n)。
 * 给定数组的最长严格上升子序列的长度。
 * @param arr int整型一维数组 给定的数组
 * @return int整型
 */
function LIS(arr) {
  // write code here
  if (arr.length === 0) {
    return 0; // 如果数组为空，返回0
  }
  const dp = new Array(arr.length).fill(1); // 初始化 dp 数组，长度为 arr 的长度，初始值为 1
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        // 与i之前的元素比较，如果 arr[j] < arr[i]，则可以将 arr[i] 添加到以 arr[j] 结尾的子序列中
        // 更新 dp[i] 为 dp[j] + 1 的最大值
        dp[i] = Math.max(dp[i], dp[j] + 1); // 更新 dp[i]
      }
    }
  }
  const maxLength = Math.max(...dp); // 获取 dp 数组中的最大值

  // 获取最长严格上升子序列
  const maxIndex = dp.indexOf(maxLength); // 获取最大值的索引
  const lis = [];
  for (let i = maxIndex; i >= 0; i--) {
    if (dp[i] === maxLength) {
      lis.unshift(arr[i]); // 将 arr[i] 添加到 lis 的开头
      maxLength--; // 减少最长子序列长度
    }
  }
  console.log(lis); // 输出最长严格上升子序列

  return maxLength; // 返回 dp 数组中的最大值，即最长严格上升子序列的长度
}
// LIS([10, 9, 2, 5, 3, 7, 101, 18]); // 输出4
// LIS([1, 3, 6, 7, 9, 4, 10, 5, 6]); // 输出6
// LIS([3, 2]); // 输出1
// LIS([1, 2, 3, 4, 5]); // 输出5
// LIS([5, 4, 3, 2, 1]); // 输出1
// LIS([10, 12, 22, 8, 9]); // 输出3

/**
 * 最长严格上升子序列问题。
 * 贪心算法和二分查找的结合。
 * 题目描述：
 * 给定一个整数数组，求其中最长严格上升子序列的长度。
 * 严格上升子序列是指子序列中的元素严格递增。
 * 例如，给定数组 [10, 9, 2, 5, 3, 7, 101, 18]，最长严格上升子序列为 [2, 3, 7, 101]，长度为 4。
 * 该问题可以使用贪心算法和二分查找的结合来解决。
 * 贪心算法思路：
 * 1. 初始化一个空数组 tails，用于存储当前找到的最长严格上升子序列的末尾元素。
 * 2. 遍历数组，对于每个元素 arr[i]，使用二分查找在 tails 中找到第一个大于等于 arr[i] 的位置 pos。
 *    如果 pos 等于 tails 的长度，说明 arr[i] 可以添加到 tails 的末尾，更新 tails。
 *    如果 pos 小于 tails 的长度，说明 arr[i] 可以替换 tails[pos]，以保持 tails 的最小值。
 * 3. 最终，tails 的长度即为最长严格上升子序列的长度。
 * 4. 时间复杂度为 O(n log n)，空间复杂度为 O(n)。
 * 给定数组的最长严格上升子序列的长度。
 * 为什么这样替换是正确的：替换 tail 中的元素不会改变当前子序列的长度，但为未来更长的子序列提供了更优的“增长潜力”。
 * 此方法最后tails数组的长度即为最长严格上升子序列的长度，但不是最长严格上升子序列。
 * @param arr int整型一维数组 给定的数组
 * @return int整型
 */
function LISGreedy(arr) {
  // write code here
  if (arr.length === 0) {
    return 0; // 如果数组为空，返回0
  }
  const tails = []; // 用于存储当前找到的最长严格上升子序列的末尾元素
  for (let i = 0; i < arr.length; i++) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < arr[i]) {
        left = mid + 1; // 寻找第一个大于等于 arr[i] 的位置
      } else {
        right = mid; // 寻找第一个大于等于 arr[i] 的位置
      }
    }
    if (left === tails.length) {
      tails.push(arr[i]); // 如果 pos 等于 tails 的长度，说明 tails 所有元素都小于arr[i], arr[i] 可以添加到 tails 的末尾
    } else {
      tails[left] = arr[i]; // 否则替换 tails[pos]
    }
  }
  return tails.length; // 返回最长严格上升子序列的长度
}
// LISGreedy([10, 9, 2, 5, 3, 7, 101, 18]); // 输出4
// LISGreedy([1, 3, 6, 7, 9, 4, 10, 5, 6]); // 输出6

/**
 * 获取最长严格上升子序列（LIS）
 * 使用贪心算法和二分查找的结合。
 * 该方法不仅返回最长严格上升子序列的长度，还返回实际的子序列。
 * 题目描述：
 * 给定一个整数数组，求其中最长严格上升子序列。
 * 严格上升子序列是指子序列中的元素严格递增。
 * 例如，给定数组 [10, 9, 2, 5, 3, 7, 101, 18]，最长严格上升子序列为 [2, 3, 7, 101]。
 * 该问题可以使用贪心算法和二分查找的结合来解决。
 * 贪心算法思路：
 * 1. 初始化一个空数组 tails，用于存储当前找到的最长严格上升子序列的末尾元素索引。
 * 2. 初始化一个 parents 数组，用于存储每个元素在 LIS 中的前一个元素索引。
 * 3. 遍历数组，对于每个元素 arr[i]，使用二分查找在 tails 中找到第一个大于等于 arr[i] 的位置 pos。
 *    如果 pos 等于 tails 的长度，说明 arr[i] 可以添加到 tails 的末尾，更新 tails 和 parents。
 *    如果 pos 小于 tails 的长度，说明 arr[i] 可以替换 tails[pos]，以保持 tails 的最小值，并更新 parents。
 * 4. 最终，通过 parents 数组可以 reconstruct 出最长严格上升子序列。
 * 5. 时间复杂度为 O(n log n)，空间复杂度为 O(n)。
 * 给定数组的最长严格上升子序列。
 * @param {*} arr
 * @returns
 */
function getLISGreedy(arr) {
  if (arr.length === 0) {
    return []; // 如果数组为空，返回空数组
  }
  const tails = []; // 用于存储当前找到的LIS的末尾元素索引
  const parents = new Array(arr.length).fill(-1); //用于存储每一个元素在LIS中的前一个元素索引
  for (let i = 0; i < arr.length; i++) {
    let left = 0;
    let right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[tails[mid]] < arr[i]) {
        left = mid + 1; // 寻找第一个大于等于 arr[i] 的位置
      } else {
        right = mid; // 寻找第一个大于等于 arr[i] 的位置
      }
    }
    parents[i] = left > 0 ? tails[left - 1] : -1; // 设置前一个元素索引
    if (left === tails.length) {
      tails.push(i); // 如果 pos 等于 tails 的长度，说明 tails 所有元素都小于arr[i], arr[i] 可以添加到 tails 的末尾
    } else {
      tails[left] = i; // 否则替换 tails[pos]
    }
  }
  // 重建最长严格上升子序列
  const lis = [];
  let k = tails[tails.length - 1]; // 获取最后一个元素的索引
  while (k !== -1) {
    lis.unshift(arr[k]); // 将元素添加到 lis 中
    k = parents[k]; // 更新 k 为前一个元素的索引
  }
  return lis; // 返回 lis，即最长严格上升子序列
}
console.log(getLISGreedy([10, 9, 2, 5, 3, 7, 101, 18])); // 输出 [2, 3, 7, 101] 或 [2, 3, 7, 18]
console.log(getLISGreedy([1, 3, 6, 7, 9, 4, 10, 5, 6])); // 输出 [ 1, 3, 6, 7, 9, 10 ]
console.log(getLISGreedy([3, 2])); // 输出 [3] 或 [2]
