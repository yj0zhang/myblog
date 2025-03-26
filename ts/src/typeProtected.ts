export default function () {
    // 类型保护
    // ts很多情况下需要使用联合类型，默认情况下只能用公共方法，此时需要用到类型保护（识别类型，针对某个类型处理）
    // 通过 typeof instanceof in等js方式判断，来缩小范围
    function fn(a: string | number) {
        if (typeof a === 'string') {
            a;//string类型
        } else {
            a;//number
        }
    }

    class Cat {
        cry() { }
    }
    class Dog {
        eat() { }
    }

    function getInstance(clazz: { new(...args: any): Cat | Dog; }) {
        return new clazz();
    }
    const ins = getInstance(Cat);
    if (ins instanceof Cat) {
        ins.cry();
    } else {
        ins.eat();
    }



    // 可辨识类型 通过in实现
    interface Bird {
        kind: '鸟';
        fly: string;
    }
    interface Fish {
        kind: '鱼';
        swim: string;
    }

    function getAnimal(val: Bird | Fish) {
        if ('fly' in val) {
            val.fly;
        } else {
            val.swim;
        }
    }



    function ensureArray<T>(input: T | T[]) {
        if (Array.isArray(input)) {
            return input;
        } else {
            return [input];
        }
    }
    let r1 = ensureArray('abc');
    let r2 = ensureArray(['abc']);



    {

        // is 语法 主要在辅助方法中用的多，用来判断
        interface Bird {
            kind: '鸟';
            fly: string;
        }
        interface Fish {
            kind: '鱼';
            swim: string;
        }
        function isBird(val: Bird | Fish): val is Bird {
            return 'fly' in val;
        }
        function getAnimal(val: Bird | Fish) {
            if (isBird(val)) {
                val.fly;
            } else {
                val.swim;
            }
        }
    }
}