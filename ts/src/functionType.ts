export default function () {
    // 函数中的类型
    // 参数、返回值
    type Fn1 = (a: number, b: string) => number | string;
    type Fn2 = { (a: number, b: string): number | string };
    function sum1(a: number, b: string): number | string {
        return a + b;
    }
    const sum2: Fn1 = function (a, b) {
        return a + b;
    }
    const sum3: Fn2 = function (a, b) {
        return a + b;
    }
    sum1(1, '1')
    sum2(1, '1')
    sum3(1, '1');

    // ? 可选参数，必须放在后面，且不能有默认值
    const sum4 = function (a: string, b?: string, c?: number) {
        return a + b
    }
    sum4('1');


    // 默认值
    const sum5 = function (a: string, b: string = '1') {
        return a + b
    }
    sum5('1');

    // 参数this问题
    // 尽量不采用this来作为函数的上下文，this的缺陷就是类型推导问题
    // 如果想限制this类型，那么需要手动置顶this类型
    const person = { name: 'z', age: 30 };
    type IPerson = typeof person;//提取对象的类型为IPerson，type类型会提升到顶部
    type IKeys = keyof IPerson;//提取类型的key作为联合类型
    // this放在第一个参数，定义类型；不是形参
    function getValue(this: IPerson, key: IKeys) {
        return this[key]
    }
    getValue.call(person, 'name');


    // 参数不定项
    function sum6(...args: number[]): number {
        return args.reduce((memo, cur) => (memo += cur, memo), 0)
    }
    sum6(1, 2, 3);


    // 函数重载（类型重载）
    function toArray(value: string): string[];//具体的某一种方案
    function toArray(value: number): number[];
    //上面的声明仅仅是类型重载
    function toArray(value: string | number): string[] | number[] {//所有的实现
        if (typeof value === 'number') {
            return value.toString().split('').map(Number)
        }
        if (typeof value === 'string') {
            return value.split('')
        }
        return []
    }

    let arr1 = toArray('aaa');
    let arr2 = toArray(111);
}