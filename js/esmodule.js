const obj = {
  a: 1,
};
function test() {
  console.log("module test");
}
let CONSTANE_A = "a";
// esmodule返回的是引用，在不同的地方引入同一个模块，指向同一个引用
// 对于原始值和function，不能修改
// 对象不能修改引用，但是可以修改对象中的属性（增删改）
export { obj, test, CONSTANE_A };
