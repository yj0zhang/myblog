# ts 的目的是什么？

javascript 是弱类型，ts 是 js 的超集，使 js 变成强类型，在大型项目中，使代码变得更加健壮。
ts 是用来检测类型的，只在开发时生效，在运行时没有类型（编译之后，类型就消失了）

# ts 的优点

- 类型检查：编译时捕捉类型错误，减少运行时错误
- 更好的代码维护性
- 大型项目优势
  - 团队协作减少沟通成本
  - 代码组织：通过模块和命名空间更好组织代码
  - 类型安全：降低模块间集成时的隐性错误

# 运行 ts 文件的方式

## 命令行操作

- 全局安装：`npm install typescript -g`
- 初始化 tsconfig.json：`tsc --init`
- 编译当前目录下的 ts 文件：`tsc`
- 监听文件变化：`tsc --watch`

## vscode 插件 code runner

适合临时测试

- js 文件可以直接右键'run code'执行
- ts 文件需要安装 ts-node：`npm install ts-node -g`

## 通过构建工具将代码转成 js（webpack，rollup，esbuild...）

- 使用 rullup [rollup](./rollup.config.js) 和 [tsconfig](./tsconfig.json)
- 再创建一个[index.html](./dist/index.html)，在浏览器中运行

# 类型分类

## 基础类型

[baseType](./src/baseType.ts)

- string
- number
- boolean
- array 数组
- tuple 元组
- enum 枚举
- null
- undefined
- void
- never 这是最小的类型，是任何类型的子类型
- any
- unknown
- object
- symbol
- bigInt

## 类型断言

as
<number>str

[typeAsserts](./src/typeAsserts.ts)

## 函数类型

type f1 = (a:number,b:string)=>string|number;
type f2 = {(a:number): number}

[functionType](./src/functionType.ts)

## class

[classType](./src/classType.ts)

## 接口和泛型

[interfaceAndGeneric](./src/interfaceAndGeneric.ts)

## 交叉类型

[crossType](./src/crossType.ts)

## 内置类型

### 条件类型&基于条件类型的内置类型

[conditionBuiltinType](./src/conditionBuiltinType.ts)

### 基于集合的内置类型

[keysBuiltinType](./src/keysBuiltinType.ts)

## infer 类型推断

[infer](./src/infer.ts)

## 类型兼容性

[compatibility](./src/compatibility.ts)

## 类型保护

[typeProtected](./src/typeProtected.ts)

## 自定义类型

[customType](./src/customType.ts)

## 命名空间

[namespace](./src/namespace.ts)

## 外部模块

- ts 为了能做到 commonjs 和 amd 互转，自己发明了一种写法(export = XXX / import a = require('XXX'))
  - 基本不用
  - 使用 esModule 替代
- tsconfig 配置
  - target 指代打包后的语法
  - module 导出的模块规范
  - declaration 打包时为每个 ts 文件生成类型声明文件
  - moduleResolution
- 使用的第三方库时，如果没有 ts 类型，需要自己编写(.d.ts 文件)，或者安装社区类型 npm i @types/XXX
- declare 用于声明类型，告诉 ts 全局下有某些类型
  - `declare const a:number` 告诉 ts 全局下有 number 类型的常量 a
  - 一般单独放在一个 d.ts 文件中[env.d.ts](./src/env.d.ts)
  - 需要在 tsconfig.json 中添加 types 字段，里面填写类型声明文件路径，告诉 ts 去哪里找类型声明文件
- ts 查找类型声明的方式：
  - 查找 node_modules 下同名模块中，package.json 中的 types 字段
  - 查找 node_modules 下同名模块下的 index.d.ts
  - 查找 node_modules 下@types 中是否有同名模块，找到后按照上述方式继续查找
  - 除了以上方式，还可以在 tsconfig 中定义 paths，让 ts 根据 paths 配置查找声明，这种方式优先级比上面的高
    - paths: { "_": ["./src/types/_"]} // 表示所有类型先从./src/types/文件夹下找
      - [lodash 声明文件](./src/types/lodash.d.ts)
- 在.d.ts 中还可使用三斜线指令引入其他声明文件：
  - /// <reference path="./XXX"> 按文件路径加载类型
  - /// <reference types="XXX"> 引入第三方声明文件
  - /// <reference lib="XXX"> 加载内置的类型

## 类型体操

## 装饰器（试验性语法，后续具体实现可能会发生变化）

[decorators](./src/myDecorators.ts)
