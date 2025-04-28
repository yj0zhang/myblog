## loader 和 plugin 的区别

### loader

- 作用
  - 用于转换模块源代码，将不同类型的文件转换成 webpack 可以处理的文件
- 特点
  - 只在模块加载/解析阶段执行
  - 一个 loader 只做一种文件转换
  - 可以链式处理，按照从下到上的顺序
  - 一次处理一个文件

### plugin

- 作用
  - 介入 webpack 构建过程的各个阶段，处理 loader 不能完成的任务
- 特点
  - 全局操作，可以影响整个构建流程
  - 有生命周期钩子，可以在不同的构建阶段执行
  - 可以实现复杂功能：资源管理、环境变量注入、打包优化等

## 常用 loader

- 文件处理
  - file-loader 将文件输出到输出目录，并返回 public URL
  - url-loader 与 file-loader 类似，但在处理小文件时，可以返回 Data URL
- 样式处理
  - style-loader
  - css-loader
  - sass-loader
  - less-loader
- js
  - vue-loader
  - ts-loader
  - babel-loader
    - 编译 js/jsx，设置 options: {presets: ['@babel/preset-env', '@babel/preset-react']}
- 其他资源
  - html-loader
  - svg-inline-loader

## 常用 plugin

- 优化
  - SplitChunksPlugin(内置): 分包
  - TerserPlugin(内置): 压缩 js
  - CssMinimizerPlugin: 压缩 css
  - CompressionPlugin: 压缩文件（gzip/brotli）
  - DllPlugin/DllReferencePlugin: 将资源提前打包成动态链接库
- 功能增强
  - HtmlWebpackPlugin: 生成 html 文件，并自动注入资源
  - MiniCssExtractPlugin: 将 css 抽取为单独文件
- 开发辅助
  - HotModuleReplacementPlugin(内置): 热更新
  - CleanWebpackPlugin
  - BundleAnalyzerPlugin
