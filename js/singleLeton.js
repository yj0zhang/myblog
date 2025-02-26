//通过单例模式创建的实例，是同一个
const CreateSingleton = (function () {
  let instance;
  return function (name) {
    if (instance) {
      return instance;
    }
    this.name = name;
    return (instance = this);
  };
})();
export default CreateSingleton;

// import CreateSingleton from "./singleLeton";
// let a = new CreateSingleton("a");
// let b = new CreateSingleton("b");
// console.log(a, b);
