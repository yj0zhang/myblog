# ts的目的是什么？
javascript是弱类型，ts是js的超集，使js变成强类型，在大型项目中，使代码变得更加健壮。
ts是用来检测类型的，只在开发时生效，在运行时没有类型（编译之后，类型就消失了）

# 运行ts文件的方式
## 命令行操作
- 全局安装：`npm install typescript -g`
- 初始化tsconfig.json：`tsc --init`
- 编译当前目录下的ts文件：`tsc`
- 监听文件变化：`tsc --watch`

## vscode插件 code runner
适合临时测试
- js文件可以直接右键'run code'执行
- ts文件需要安装ts-node：`npm install ts-node -g`

## 通过构建工具讲代码转成js（webpack，rollup，esbuild...）
- 使用rullup [rollup](./rollup.config.js) 和 [tsconfig](./tsconfig.json)
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
- never
- any
- unknown
- object
- symbol
- bigInt
## 类型断言
[typeAsserts](./src/typeAsserts.ts)
## 函数类型
[functionType](./src/functionType.ts)
## 内置类型
## 自定义类型
## 类型体操