// import VirtualTable from "./virtualTable/index";
// const container = document.querySelector("#app");
// const introduceList = [
//   "这里是自我介绍",
//   "大家好",
//   "我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍我是很长的自我介绍",
// ];
// const data = Array.from({ length: 100000 }).map((_, i) => {
//   return {
//     id: i + 1,
//     name: "姓名" + i,
//     address: "上海",
//     age: Math.floor(Math.random() * 30) + 20,
//     introduce: introduceList[Math.floor(Math.random() * 3)],
//   };
// });
// VirtualTable(container, {
//   estimateTdHeight: 32, //单元格高度
//   height: 500, //表格高度
//   data,
//   columns: [
//     { label: "编号", key: "id", width: 50 },
//     { label: "姓名", key: "name", minWidth: 80 },
//     { label: "年龄", key: "age" },
//     { label: "地址", key: "address" },
//     { label: "自我介绍", key: "introduce" },
//   ],
// });
try {
  console.log("测试");
  window.alert("没报错");
  // 如果此处没有错误，可能说明控制台未完全关闭
} catch (e) {
  window.alert("报错了");
  // 可能捕获到某些错误，但这不一定意味着控制台已打开
}
