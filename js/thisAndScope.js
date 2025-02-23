// javascript作用域

// 创建对象时，对象字面量方式与new Object的方式一样
// new方式是用构造函数创建的对象，这个被创建的对象，其方法属性中的this指向的是自身
// 所以可以理解为：对象字面量方式创建的对象，其方法属性中的this指向的也是自身
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
console.log(obj1.a(), obj2.a());

obj1.a();

var obj3 = { a: 1 };

obj3.test = function () {
  console.log(this); //obj
  var t1 = function () {
    console.log(this); // window
    var t2 = () => {
      // 箭头函数的this，指向外层作用域的this（外层作用域不能是箭头函数）
      // 如果t1是普通函数，这里的this指向window
      // 如果t1是箭头函数，这里的this指向obj
      console.log(this);
    };
    t2();
  };
  t1();
};
obj3.test();

// 对象方法属性内部的this，指向最近的引用（对象）
var obj4 = {
  a: 1,
  f: function () {
    console.log("o f", this); // o
  },
  c: {
    d: 1,
    cf: function () {
      console.log("c f", this); // c
      console.log(this.a); //undefined
    },
  },
};
obj4.f();
obj4.c.cf();
