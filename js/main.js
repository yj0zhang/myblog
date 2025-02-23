var obj1 = {
  a: function () {
    console.log(this);
    function f() {
      console.log(this); //执行obj1.a()是，这里输出的是window，f是独立的函数，不属于任何对象
    }
    f();
  },
};
var obj2 = new Object({
  a: function () {
    console.log(this);
  },
});

console.log(obj1, obj2);
