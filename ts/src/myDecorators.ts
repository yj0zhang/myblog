export default function () {
    // 什么是装饰器： 本质是函数，只能在类和类的成员上使用
    // ts装饰器：类装饰器、方法装饰器、属性装饰器、访问器装饰器(get set)、参数装饰器

    {
        // 1.类装饰器
        function ClassDecorator(target: any) {
            // target指向的是类的构造函数constructor
            target.type = 'animal';
            target.getType = function () {
                return this.type;
            };
            target.prototype.eat = function () {
                console.log('eat');
            };
        }

        function OvertideDecorator(target: any) {
            return class extends target {
                eat() {
                    super.eat();
                    console.log('OvertideDecorator eat');
                }
            };
        }

        @OvertideDecorator
        @ClassDecorator
        class Animal { }

        console.log('class decorators static:', (Animal as any).getType());
        (new Animal() as any).eat();

    }
    {
        //装饰器工厂，是一个返回装饰器函数的函数，允许你传递参数给装饰器
        function Enum(isEnm: boolean) {
            // target:类的原型
            // key: 方法名
            // keyDescriptor: 方法描述符
            return function (target: any, key: string, keyDescriptor: PropertyDescriptor) {
                keyDescriptor.enumerable = isEnm;
                let original = keyDescriptor.value;//保存原始方法
                keyDescriptor.value = function (...args: any[]) {
                    // 重写方法
                    console.log('pre');
                    original.call(this, ...args);
                    console.log('next');
                };
            };
        }
        // 方法装饰器
        class Animal {
            @Enum(true)
            eat() {
                console.log('eat');
            }
        }
        const a = new Animal();
        a.eat();
    }
    {
        // 属性装饰器
        //key 参数名
        function toUpperCase(target: any, key: string) {
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
            public a: number;
            constructor() {
                this.a = 1;
            }
            @toUpperCase
            public name = 'aaa';
        }
        const animal = new Animal();
        console.log(Animal, animal.name);

    }
}