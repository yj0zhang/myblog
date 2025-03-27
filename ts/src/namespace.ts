

export namespace n {
    // namespace 避免文件内部命名冲突 很少用，因为模块化了

    export namespace Zoo {
        // 可以在外部通过import导入Zoo，通过Zoo.Dog使用
        export class Dog { }
        // namespace可以嵌套
        export namespace House {
            export class Dog { }
        }
    }
    export namespace Home {
        export class Dog { }
    }
    Zoo.House.Dog;

    // namespace还可以扩展类、函数、枚举，但必须写在这些声明的下面
    class Animal { }
    namespace Animal {
        export let a = 1;
    }

    function counter() {
        return counter.count++;
    }
    namespace counter {
        export let count = 0;
    }
    enum Season { }
    namespace Season {
        export let Spring = "春";
    }
}
