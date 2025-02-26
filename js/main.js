// todo 函数柯里化
import observeModule from "./observeModule";

const obj1 = observeModule.observable({ a: 1, b: 2 });
observeModule.observe(obj1, function () {
  console.log("1");
});

observeModule.observe(obj1, function () {
  console.log("2");
});
const obj2 = observeModule.observable({ a: 1, b: 2 });
observeModule.observe(obj2, function () {
  console.log("3");
});

observeModule.observe(obj2, function () {
  console.log("4");
});
obj1.a = 2;
obj2.a = 2;
