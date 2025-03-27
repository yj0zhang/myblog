// 项目中得到类型声明文件，一般不会放在业务代码中，需要抽离到.d.ts文件中

declare const a: number;
declare function sum(a: string, b: string): string;
declare class P { }
declare interface PP { a: string; }
declare type P2 = { a: number; };
declare const enum S { a }

//声明某个模块
declare module "modulename" {
    type Type = string;
    type Listener = (...args: any[]) => void;
    //modulename.on('eventtype', cb)
    const on: (type: string, listener: Listener) => void;
    const off: (type: string, listener: Listener) => void;
    const emit: (type: string, listener: Listener) => void;
}

//声明.vue文件的类型
declare module "*.vue" {
    import type { DefineComponent } from 'vue';
    const comp: DefineComponent;
    export default comp;
}

//声明.jpg文件类型，
//import j from 'a.jpg
//j就是string类型
declare module "*.jpg" {
    const str: string;
    export default str;
}

// 扩展内置类型
declare interface String {
    // const s = 's';
    // s.customFn()
    customFn: (...args: any[]) => void;
}