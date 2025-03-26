# ts 的目的是什么？

javascript 是弱类型，ts 是 js 的超集，使 js 变成强类型，在大型项目中，使代码变得更加健壮。
ts 是用来检测类型的，只在开发时生效，在运行时没有类型（编译之后，类型就消失了）

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

## 通过构建工具讲代码转成 js（webpack，rollup，esbuild...）

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

[typeAsserts](./src/typeAsserts.ts)

## 函数类型

[functionType](./src/functionType.ts)

## class

[classType](./src/classType.ts)

## 接口和泛型

[interfaceAndGeneric](./src/interfaceAndGeneric.ts)

## 交叉类型

[crossType](./src/crossType.ts)

## 内置类型

### 条件类型&基于条件类型的内置类型

[conditionType](./src/conditionType.ts)

### 对象类型&基于对象类型 keys 的内置类型

[objectKeysType](./src/objectKeysType.ts)

## infer 类型推断

[infer](./src/infer.ts)

## 自定义类型

## 类型体操
