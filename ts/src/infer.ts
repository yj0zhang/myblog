export default function () {
    //类型推断 inference 简写infer
    function getUser(name: string, age: number) {
        return { name, age, address: {} };
    }
    // 获取函数getUser的返回值类型，
    // infer关键字，只能用在条件类型中，用来提取类型的某一个部份的类型，写在哪里就会提取那一部分的类型
    // 如果T满足条件，infer自动提取返回值的类型R，返回R
    type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;
    type T1 = ReturnType<typeof getUser>;

    //获取参数的类型
    type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
    type T2 = Parameters<typeof getUser>;


    // 获取实例类型
    class Person {
        // constructor() {
        //     return { a: 1, b: 2 };
        // }
    }
    let p = new Person();
    type InstanceType<T extends { new(...args: any[]): any; }> = T extends { new(...args: any[]): infer I; } ? I : never;
    type T3 = InstanceType<typeof Person>;


    //将元组转换成联合类型
    type ElementOf<T> = T extends Array<infer R> ? R : any;
    type TupleToUnion = ElementOf<[string, number, boolean]>;



}