/**
 * 快速排序算法
 */
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr; // 如果数组长度小于等于1，直接返回数组
  }
  const pivot = arr[Math.floor(arr.length / 2)]; // 选择中间元素作为基准
  const left = []; // 存储小于基准的元素
  const right = []; // 存储大于基准的元素
  const equal = []; // 存储等于基准的元素
  for (const num of arr) {
    if (num < pivot) {
      left.push(num); // 如果元素小于基准，放入左边数组
    } else if (num > pivot) {
      right.push(num); // 如果元素大于基准，放入右边数组
    } else {
      equal.push(num); // 如果元素等于基准，放入等于数组
    }
  }
  return [...quickSort(left), ...equal, ...quickSort(right)]; // 递归排序左边和右边数组，并合并结果
}
console.log(quickSort([3, 6, 8, 10, 1, 2, 1])); // 输出 [1, 1, 2, 3, 6, 8, 10]
console.log(quickSort([10, 7, 8, 9, 1, 5])); // 输出 [1, 5, 7, 8, 9, 10]
