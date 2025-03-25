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