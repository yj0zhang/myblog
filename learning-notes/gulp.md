## angularJs 结合 Vue，如何优化加载性能

- 基于纯 gulp 构建，gulp 按照文件系统打包、压缩，不会按照 js 引用图谱打包
- gulp 把 angularJs 和 vue 文件夹分开打包
- vue 文件夹分主包和路由包，生成不同的 bundle，并生成 manifest.json
- index.html 中只加载 angularJs 代码，并使用 gulp 把 manifest.json 写在全局变量中
- 代码中渲染某个路由的页面时，根据 url 和 manifest，动态加载 vue 路由代码
  - 在动态加载路由代码之前，先在页面上展示 loading 效果，在路由代码中调用全局 cancelLoading 的方法
  - 在全局维护脚本加载状态，已加载的不再重复加载
