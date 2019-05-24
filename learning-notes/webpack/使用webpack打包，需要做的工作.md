使用webpack打包项目，需要区分环境，一般为开发环境和生产环境，两个环境中需要做的工作不同

在打包前，需要配置babel，browserslist

### 基础工作：

    * 定义入口
    * 定义module中的rules(js使用babel，css使用sass，图片和字体等使用url-loader)
    * 定义出口
    * 定义各种插件(引用dll，清除dest，抽取css，把静态文件inject到html中，打包分析工具)
    * 优化工作：splitChunks
    * 外部资源(external)，通过script标签直接引用，不需要打包的资源
    * resolve(extensions, alias)

### 开发环境：

    * 定义devServer(hot reload, proxy,)

### 生产环境
    * 静态文件生产hash后缀
    * 静态文件压缩
