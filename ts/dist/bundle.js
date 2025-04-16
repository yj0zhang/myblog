(function () {
    'use strict';

    const baseType = function () {
        //基本类型：string number boolean
        const name = 'zz';
        const age = 20;
        // gender = 1; //gender被推导为string类型，此处类型不对
        console.log(name, age);
        // arr3.push(true);//报类型错误
        //元组 tuple
        //元组与数组的区别是，元组限制了特定位置的类型，顺序、位置和数量都必须与类型定义一致
        let tuple1 = ['1', 1];
        // let tuple2: [string, number] = ['1'];//数量不对
        // let tuple3: [string, number] = [2, 1];//类型不对
        //可以增加string, number类型的元素，但是访问时会报错
        tuple1.push(2);
        // tuple1[2];//Tuple type '[string, number]' of length '2' has no element at index '2'
        console.log('tuple', tuple1);
        // enum 枚举，自带类型的对象，维护一组常量
        // 约定一组格式：状态码 权限 数据格式 标志位
        // 枚举内的值，默认从0开始递增；可以赋予其他值，后面的变量值默认是上一个值加1
        // （异构枚举）如果上一个值不是数字，那需要重新给当前变量初始化一个值
        let STATUS1;
        (function (STATUS1) {
            STATUS1[STATUS1["OK"] = 0] = "OK";
            STATUS1[STATUS1["NO_OK"] = 1] = "NO_OK";
        })(STATUS1 || (STATUS1 = {}));
        let STATUS2;
        (function (STATUS2) {
            STATUS2[STATUS2["OK"] = 2] = "OK";
            STATUS2[STATUS2["NO_OK"] = 3] = "NO_OK";
        })(STATUS2 || (STATUS2 = {}));
        let STATUS3;
        (function (STATUS3) {
            STATUS3[STATUS3["OK"] = 0] = "OK";
            STATUS3["NO_OK"] = "no_ok";
            STATUS3[STATUS3["NOT_FOUND"] = 2] = "NOT_FOUND";
        })(STATUS3 || (STATUS3 = {}));
        const r = 0 /* STATUS4['OK'] */;
        console.log(r);
        BigInt(1); //需要把target改为"ES2020"之后，或者添加lib: ["ES2020", "DOM"]，（console.log属于DOM）
    };

    function functionType () {
        // 参数this问题
        // 尽量不采用this来作为函数的上下文，this的缺陷就是类型推导问题
        // 如果想限制this类型，那么需要手动置顶this类型
        const person = { name: 'z', age: 30 };
        // this放在第一个参数，定义类型；不是形参
        function getValue(key) {
            return this[key];
        }
        getValue.call(person, 'name');
        // 参数不定项
        function sum6(...args) {
            return args.reduce((memo, cur) => (memo += cur, memo), 0);
        }
        sum6(1, 2, 3);
        //上面的声明仅仅是类型重载
        function toArray(value) {
            if (typeof value === 'number') {
                return value.toString().split('').map(Number);
            }
            if (typeof value === 'string') {
                return value.split('');
            }
            return [];
        }
        toArray('aaa');
        toArray(111);
    }

    function classType () {
        class Animal {
            constructor(name) {
                this.name = name;
                //实例属性
                this.name = name;
            }
            // 原型方法 这里的void表示不关心返回值
            changeName(value, age) {
                this.name = value;
            }
            // 原型属性，需要通过访问器实现
            get aliasName() {
                return '$' + this.name;
            }
            set aliasName(name) {
                this.name = name;
            }
            static getA() {
                // 静态方法中的this，指的是类本身
                return this.a;
            }
        }
        //静态属性
        Animal.a = 1;
        // super在构造函数中，指向父类；在原型方法中，指向的是父类的原型
        class Cat extends Animal {
            constructor(name, age) {
                super(name); //Animal.call(this)
                this.age = age;
                this.age = age;
                // this.name = '3'
            }
            // 重写父类的方法，参数类型要兼容，保证子类调用父类的时候参数一致
            changeName(value) {
                super.changeName(value, 10);
                // this.name = value;
                return 'a';
            }
        }
        const tom = new Cat('tom', 3);
        tom.changeName('jerry');
        // private constructor可以在单例模式中使用，不在外部使用new关键字创建实例：
        class Singleton {
            constructor() { }
            ;
            static getInstance() {
                return this.instance;
            }
        }
        Singleton.instance = new Singleton();
        Singleton.getInstance();
    }

    function interfaceAndGeneric () {
        // 如何表示函数的参数是一个类
        class Dog {
            constructor() {
                this.a = 1;
            }
        }
        class Cat {
            constructor() {
                this.a = 1;
                this.b = 1;
            }
        }
        {
            // 类类型，不能描述类本身，描述的是实例
            // 类的类型，需要通过typeof来取
            function createInstance(clazz) {
                return new clazz();
            }
            createInstance(Dog);
            // instance2也是Dog类型（鸭子类型检测）
            createInstance(Cat);
        }
        {
            // type IClazz<T> = new (name: string) => T
            function createInstance(clazz) {
                return new clazz();
            }
            // function createInstance<T>(clazz: new () => T) {
            //     return new clazz()
            // }
            // const instance1 = createInstance<Dog>(Dog);
            // const instance2 = createInstance<Cat>(Cat);
            // 可以省略，ts会推导
            createInstance(Dog);
            createInstance(Cat);
        }
        // ------------------- generic 泛型 -------------------
        // 泛型可以用于 函数、接口、类、type
        // 刚开始类型不确定，使用的时候才能确定
        // const createArr = <T>(times: number, val: T) => {
        // }
        function createArr(times, val) {
            return Array.from({ length: times }).fill(val);
        }
        createArr(2, 'a');
        createArr(2, 1);
        const forEach = (arr, cb) => {
            for (let i = 0; i < arr.length; i++) {
                cb(arr[i]);
            }
        };
        forEach(['a', 2, 3], function (val) {
            console.log(val);
        });
        {
            //类中的泛型
            //求一个数组中的最大值
            class MyList {
                constructor() {
                    this.arr = [];
                }
                add(val) {
                    this.arr.push(val);
                }
                ;
                getMax() {
                    //业务逻辑
                    return this.arr[0];
                }
            }
            const list = new MyList;
            list.add(1);
            list.add(100);
            list.add(200);
            list.getMax();
            //泛型可以使用的场景： 函数，对象，类
            //泛型有约束和默认值
        }
    }

    //基于条件类型的内置类型
    function conditionType () {
        // type NoNullable<T> = T & {};
        document.getElementById('app');
    }

    function compatibility () {
        // c1 = c2;
        // 逆变
        // 如果两个函数的参数是父与子的关系，
        // 那么函数的关系是反过来的，叫逆变
        class Parent {
            car() { }
        }
        class Child extends Parent {
            house() { }
        }
        class Grandson extends Child {
            sleep() { }
        }
        // 安全性考虑
        // 1）内部调用函数的时候，可以传递Child和Grandson，但是在使用属性时，只能调用child有的属性
        // 2）函数的返回值，需要返回子类，因为内部代码在访问属性的时候要保证可以访问到
        function fn(cb) {
            let r = cb(new Grandson());
            r.house;
        }
        // 参数child不能是Grandson类型，返回值不能是Parent类型
        fn((child) => {
            return new Grandson();
        });
        // 对象的兼容性，子可以赋值给父
        // 类型层级兼容性 never -> 字面量 -> 基础类型 -> 包装类型 -> any / unknown
    }

    function typeProtected () {
        class Cat {
            cry() { }
        }
        function getInstance(clazz) {
            return new clazz();
        }
        const ins = getInstance(Cat);
        if (ins instanceof Cat) {
            ins.cry();
        }
        else {
            ins.eat();
        }
    }

    var n;
    (function (n) {
        // namespace 避免文件内部命名冲突 很少用，因为模块化了
        let Zoo;
        (function (Zoo) {
            // 可以在外部通过import导入Zoo，通过Zoo.Dog使用
            class Dog {
            }
            Zoo.Dog = Dog;
            (function (House) {
                class Dog {
                }
                House.Dog = Dog;
            })(Zoo.House || (Zoo.House = {}));
        })(Zoo = n.Zoo || (n.Zoo = {}));
        (function (Home) {
            class Dog {
            }
            Home.Dog = Dog;
        })(n.Home || (n.Home = {}));
        Zoo.House.Dog;
        // namespace还可以扩展类、函数、枚举，但必须写在这些声明的下面
        class Animal {
        }
        (function (Animal) {
            Animal.a = 1;
        })(Animal || (Animal = {}));
        function counter() {
            return counter.count++;
        }
        (function (counter) {
            counter.count = 0;
        })(counter || (counter = {}));
        let Season;
        (function (Season) {
        })(Season || (Season = {}));
        (function (Season) {
            Season.Spring = "春";
        })(Season || (Season = {}));
    })(n || (n = {}));

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    function myDecorators () {
        // 什么是装饰器： 本质是函数，只能在类和类的成员上使用
        // ts装饰器：类装饰器、方法装饰器、属性装饰器、访问器装饰器(get set)、参数装饰器
        {
            // 1.类装饰器
            function ClassDecorator(target) {
                // target指向的是类的构造函数constructor
                target.type = 'animal';
                target.getType = function () {
                    return this.type;
                };
                target.prototype.eat = function () {
                    console.log('eat');
                };
            }
            function OvertideDecorator(target) {
                return class extends target {
                    eat() {
                        super.eat();
                        console.log('OvertideDecorator eat');
                    }
                };
            }
            let Animal = class Animal {
            };
            Animal = __decorate([
                OvertideDecorator,
                ClassDecorator
            ], Animal);
            console.log('class decorators static:', Animal.getType());
            new Animal().eat();
        }
        {
            //装饰器工厂，是一个返回装饰器函数的函数，允许你传递参数给装饰器
            function Enum(isEnm) {
                // target:类的原型
                // key: 方法名
                // keyDescriptor: 方法描述符
                return function (target, key, keyDescriptor) {
                    keyDescriptor.enumerable = isEnm;
                    let original = keyDescriptor.value; //保存原始方法
                    keyDescriptor.value = function (...args) {
                        // 重写方法
                        console.log('pre');
                        original.call(this, ...args);
                        console.log('next');
                    };
                };
            }
            // 方法装饰器
            class Animal {
                eat() {
                    console.log('eat');
                }
            }
            __decorate([
                Enum(true)
            ], Animal.prototype, "eat", null);
            const a = new Animal();
            a.eat();
        }
        {
            // 属性装饰器
            //key 参数名
            function toUpperCase(target, key) {
                console.log('toUpperCase>', target, key);
                let value = '';
                Object.defineProperty(target, key, {
                    get() {
                        console.log('get ', key);
                        return value;
                    },
                    set(val) {
                        value = val.toUpperCase();
                    }
                });
            }
            class Animal {
                constructor() {
                    this.name = 'aaa';
                    this.a = 1;
                }
            }
            __decorate([
                toUpperCase
            ], Animal.prototype, "name", void 0);
            const animal = new Animal();
            console.log(Animal, animal.name);
        }
    }

    baseType();
    // typeAsserts();
    functionType();
    classType();
    interfaceAndGeneric();
    // crossType();
    conditionType();
    compatibility();
    typeProtected();
    console.log(n.Zoo.Dog);
    //全局声明了有a，ts不会报错，但实际上没有a，运行时会报错
    // console.log('declare:', a);
    // import _ from 'lodash';
    // _.copy();
    // _.withIn();
    myDecorators();

})();
//# sourceMappingURL=bundle.js.map
