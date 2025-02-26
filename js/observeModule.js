const queueObservers = new WeakMap(); //监视回调队列
// watch
const observe = (proxy, fn) => {
  //添加监视
  const existOb = queueObservers.get(proxy) || new Set();
  existOb.add(fn);
  queueObservers.set(proxy, existOb);
};

//设置对象为可监视对象
//reactive
const observable = (obj) => {
  const proxy = new Proxy(obj, {
    set(target, key, value) {
      console.log("...");
      const res = Reflect.set(target, key, value);
      (queueObservers.get(proxy) || []).forEach((cb) => cb());
      return res;
    },
  });
  return proxy;
};
export default { observe, observable };

// import observeModule from "./observeModule";

// const obj1 = observeModule.observable({ a: 1, b: 2 });
// observeModule.observe(obj1, function () {
//   console.log("1");
// });

// observeModule.observe(obj1, function () {
//   console.log("2");
// });
// const obj2 = observeModule.observable({ a: 1, b: 2 });
// observeModule.observe(obj2, function () {
//   console.log("3");
// });

// observeModule.observe(obj2, function () {
//   console.log("4");
// });
// obj1.a = 2;
// obj2.a = 2;
