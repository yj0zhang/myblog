## 虚拟表格思路
### 初始化
    - 取得每行的高度（如果高度不固定，先按照预估高度（最小高度）计算，后面渲染之后更新每行的高度）
    - 获取容器高度
    - 计算每条数据的尺寸，包括top，height，bottom，设置总高度
    - 根据每行的高度计算可见窗口中可容纳的数据
    - 渲染可见的数据，根据数据id，设置每行tr的属性（data-idx），设置translate样式
    - 如果每行高度是估算的，那么此时需要获取每行的实际高度，并重新计算每条数据的尺寸和总高度，重新设置translate样式
    - 记录startIdx和endIdx
### 滚动
    - 如果滚动到最下面，加载第二页(todo)
    - 根据滚动高度，重新计算可见窗口中可容纳的数据
    - 重新渲染每行，新渲染的数据如果没有记录过实际尺寸，那么此时需要重新计算

### demo
```js
import VirtualTable from "./virtualTable/index";
const container = document.querySelector("#app");
const introduceList = [
  "这里是自我介绍",
  "大家好",
  "我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍",
];
const data = Array.from({ length: 9999 }).map((_, i) => {
  return {
    id: i + 1,
    name: "姓名" + 99,
    address: "上海",
    age: Math.floor(Math.random() * 30) + 20,
    introduce: introduceList[Math.floor(Math.random() * 3)],
  };
});
VirtualTable(container, {
  estimateTdHeight: 48, //单元格高度
  height: 500, //表格高度
  data,
  columns: [
    { label: "编号", key: "id", width: 50 },
    { label: "姓名", key: "name", minWidth: 80 },
    { label: "年龄", key: "age" },
    { label: "地址", key: "address" },
    { label: "自我介绍", key: "introduce" },
  ],
})
```