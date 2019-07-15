import filter from 'lodash/filter';
import compact from 'lodash/compact';
import map from 'lodash/map';

/**
 * 把flatten的数据，生成树型
 * @param {Array} data 原始数据
 * @param {String} key 索引键
 * @param {String} parentKey 父索引
 * @param {Any} parentVal 根节点的父
 */
export function generateTree({data, key, parentKey, parentVal = 0, childrenKey = "children"}) {
  let tree = [];
  let flattenChild = filter(data, d => d[key] !== parentKey);
  data.forEach((d, i) => {
    if (d[parentKey] === parentVal) {
      tree[i] = d;
      tree[i][childrenKey] = generateTree({data: flattenChild, key, parentKey, parentVal: d[key]})
    }
  })

  return compact(tree);
}


/**
 * 获取树中的所有节点
 * @param {Array} tree 原始数据，树形
 */
export function getAllNode({tree, childrenKey = "children"}) {
  let nodeList = [];
  tree.forEach(d => {
    nodeList.push(d);
    if (d[childrenKey] && d[childrenKey].length > 0) {
      nodeList = nodeList.concat(getAllNode(d[childrenKey]));
    }
  });

  return nodeList;
}

/**
 * 获取给定父节点的儿子节点，如果没有儿子，返回自身
 * @param {Array} tree 原始数据，树形
 * @param {String} key 索引键
 * @param {String} parentKey 父索引
 * @param {Any} parentVal 根节点的父
 */
export function getChildrenKey({tree, key, parentKey, parentsVals, childrenKey = "children"}) {
  let nodeList = getAllNode(tree), val = [];
  nodeList.forEach(node => {
    if (parentsVals.includes(node[key])) {
      if (node[childrenKey] && node[childrenKey].length) {
        val = val.concat(map(node[childrenKey], key))
      } else {
        val.push(node[key])
      }
    }
  })

  return val;
}

/**
 * 获取所有子节点
 */
export function getLeafNodes({tree, childrenKey = "children"}) {
  //todo
}

/**
 * 获取指定层级的所有节点，从0开始
 */
export function getNodesByLevel({tree, level, childrenKey = "children"}) {
  //todo
}
