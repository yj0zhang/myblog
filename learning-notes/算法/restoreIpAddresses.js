/**
 * 现在有一个只包含数字的字符串，将该字符串转化成IP地址的形式，返回所有可能的情况。
 * 思路：
 * 1. 构造一个树形结构，每个节点代表一个IP地址的段。
 * 2. 每个节点可以有1到3个子节点，代表IP地址的每一段。
 * 3. 使用深度优先搜索（DFS）遍历树形结构，生成所有可能的IP地址。
 * 4. 在生成IP地址的过程中，检查每个段是否有效（长度不超过3，不能以0开头，数字范围在0到255之间）。
 * 5. 如果到达叶子节点且当前层级是4，说明生成了一个有效的IP地址，将其加入结果列表。
 * 6. 返回所有生成的IP地址。
 * @param s string字符串 数字字符串
 * @return string字符串一维数组 所有可能的IP地址
 */
function restoreIpAddresses(s) {
  const root = { children: [], str: "", level: 0 }; //树形数组，存储所有可能的IP地址
  function getChildren(node, str, startIndex) {
    if (!str || startIndex >= str.length) {
      return [];
    }
    // 获取当前节点的子节点
    const children = [];
    const childLevel = node.level + 1;
    for (let i = 1; i <= 3; i++) {
      const segment = str.substring(startIndex, startIndex + i);
      if (isValidSegment(segment) && startIndex + i <= str.length) {
        children.push({
          children: [],
          str: segment,
          level: childLevel,
          endIndex: startIndex + i - 1,
          invalid: childLevel === 4 && startIndex + i < str.length, // 如果是最后一层且还有剩余字符，则标记为无效
        });
      }
    }
    if (childLevel < 4) {
      // 如果当前层级小于4，继续获取子节点
      children.forEach((child) => {
        // 递归获取子节点的子节点
        child.children = getChildren(child, str, child.endIndex + 1);
      });
    }
    return children;
  }
  root.children = getChildren(root, s, 0);
  const dp = [];
  function dfs(node, path) {
    if (node.invalid) return; // 如果有剩余字符，则无效
    if (node.children.length === 0 && node.level === 4) {
      // 如果没有子节点且当前层级是4，说明到达了叶子节点
      // 将路径转换为IP地址格式
      dp.push(path.join(".")); // 将路径转换为IP地址格式
      return;
    }
    // 深度优先遍历
    node.children.forEach((child) => {
      dfs(child, [...path, child.str]); // 递归遍历子节点
    });
  }
  dfs(root, []);
  return dp; // 返回所有可能的IP地址
}

function isValidSegment(segment) {
  // 检查段是否有效
  if (segment.length === 0 || segment.length > 3) return false;
  if (segment.length > 1 && segment.startsWith("0")) return false; // 不能以0开头
  const num = parseInt(segment, 10);
  return num >= 0 && num <= 255; // 数字范围在0到255之间
}
// restoreIpAddresses("25525511135"); // 输出 ["255.255.11.135", "255.255.111.35"]
console.log(restoreIpAddresses("25525522135")); // 输出 ["255.255.22.135","255.255.221.35"]
