export default function () {
    //类 
    // 构造函数、属性、方法访问器，静态相关配置

    class Circle {
        // 给这个类声明属性
        public x: number;
        public y: number;
        constructor(x: number, y: number = 200) {
            this.x = x;
            this.y = y;
        }
    }

    // public 公开属性，类的实例、类内部、子类都可以访问
    // protected 自己和子类内部能访问，实例不能访问
    // private 私有的，只有自己内部能访问，实例不能访问
    // readonly 表示只读，初始化之后，不能被修改
    let circle = new Circle(100, 100);

    class Animal {
        constructor(public name: string) {
            //实例属性
            this.name = name;
        }
        // 原型方法 这里的void表示不关心返回值
        changeName(value: string, age: number): void {
            this.name = value;
        }
        // 原型属性，需要通过访问器实现
        get aliasName() {
            return '$' + this.name
        }
        set aliasName(name: string) {
            this.name = name;
        }
        //静态属性
        static a = 1;
        static getA() {
            // 静态方法中的this，指的是类本身
            return this.a;
        }
    }

    // super在构造函数中，指向父类；在原型方法中，指向的是父类的原型
    class Cat extends Animal {
        constructor(name: string, public readonly age: number) {
            super(name);//Animal.call(this)
            this.age = age;
            // this.name = '3'
        }
        // 重写父类的方法，参数类型要兼容，保证子类调用父类的时候参数一致
        changeName(value: string) {
            super.changeName(value, 10)
            // this.name = value;
            return 'a'
        }
    }
    const tom = new Cat('tom', 3);
    tom.changeName('jerry');
    //子类型可以赋值给父类型
    let a: Animal = tom;
    // a.age;//但此时a不能取到子类的属性

    class A {
        // private 只能在类内部访问，子类不能访问，此时A不能被继承，也不能被new
        // protected 只能在类和子类内部访问，此时A不能被new
        protected constructor() { }
    }
    class B extends A {
        constructor() {
            super()
        }
    }

    // private constructor可以在单例模式中使用，不在外部使用new关键字创建实例：
    class Singleton {
        static instance = new Singleton();
        private constructor() { };
        static getInstance() {
            return this.instance
        }
    }
    let instance = Singleton.getInstance();

    // 不能被new的类，叫抽象类，在ts中使用 abstract 关键字
    // 抽象类 可以含有非抽象的方法和属性
    // 抽象类可以被继承
    {
        abstract class Animal {
            public abstract a: string;//抽象属性
            drink() {//非抽象方法
                console.log('喝水')
            }
            abstract eat(): void;//抽象的方法，父类没有实现，子类必须实现
        }
        class Cat extends Animal {
            public a!: string;
            eat(): void {
                console.log('吃东西')
            }
        }
    }
}