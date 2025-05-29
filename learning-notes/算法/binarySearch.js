/**
 * 二分查找
 */
function binarySearch(arr, target) {
  let left = 0; // 左指针
  let right = arr.length - 1; // 右指针
  while (left <= right) {
    const mid = Math.floor((left + right) / 2); // 中间指针
    if (arr[mid] === target) {
      return mid; // 找到目标值，返回索引
    } else if (arr[mid] < target) {
      left = mid + 1; // 目标值在右半部分，移动左指针
    } else {
      right = mid - 1; // 目标值在左半部分，移动右指针
    }
  }
  return -1; // 未找到目标值，返回-1
}
console.log(binarySearch([1, 2, 3, 4, 5], 3)); // 输出2
console.log(binarySearch([1, 2, 3, 4, 5], 6)); // 输出-1
