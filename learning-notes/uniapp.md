## uniapp 是什么

uniapp 是一个基于 vue 的跨平台的前端框架，可以写一套代码适配 web，小程序，app

## uniapp 如何实现跨平台

- 根据不同平台编译为不同的格式
- 条件编译处理平台差异
- 提供统一 api 调用，api 底层适配不同平台实现

## uniapp 项目结构

- pages 页面结构
  - index
    - index.vue
- static 静态文件
- components 公共组件
- page.json 页面路由和样式配置、分包配置
- manifest.json 应用平台配置
- App.vue 入口组件
- main.js 入口文件
- store vuex 状态管理

## uniapp 条件编译的方法？

- 通过`#ifdef` `#ifndef`编译

  ```js
  // #ifdef APP-HARMONY
  console.log("仅鸿蒙会编译");
  // #endif

  // #ifndef APP-HARMONY
  console.log("仅非鸿蒙会编译");
  // #endif

  // #ifdef APP
  console.log("安卓、苹果、鸿蒙会编译，小程序和Web不会编译");
  // #endif

  // #ifndef APP
  console.log("安卓、苹果、鸿蒙不会编译，小程序和Web会编译");
  // #endif

  // #ifdef APP-PLUS
  console.log("安卓、苹果会编译，鸿蒙不会编译，小程序和Web也不会编译");
  // #endif

  // #ifndef APP-PLUS
  console.log("安卓、苹果不会编译，鸿蒙会编译，小程序和Web也会编译");
  // #endif

  // #ifndef H5
  console.log("H5会编译");
  // #endif

  // #ifndef MP-WEIXIN
  console.log("小程序会编译");
  // #endif
  ```

## uniapp 的生命周期有哪些

- 应用生命周期：
  - onLaunch
  - onShow
  - onHide
- 页面生命周期
  - onLoad
  - onShow
  - onReady
  - onHide
  - onUnload
- 组件生命周期
  - 与 vue 组件生命周期相同

## uniapp 的路由导航如何实现

- 组件 navigator
- 接口
  - uni.navigateTo 保留当前页面，跳转到新页面
  - uni.reLaunch 关闭所有页面，打开新页面
  - uni.redirectTo 关闭当前页面，跳转到新页面
  - uni.switchTab 跳转到 tabBar 页面

## uniapp 如何调用原生功能？

通过封装好的 api，分为几大类：媒体、文件、设备、位置等

- uni.chooseImage
- uni.getLocation
- uni.saveImageToPhotosAlbum
- uni.openSetting

## 如何实现移动端响应式布局

- flexbox 弹性布局
- grid 网格布局
  - 通过 grid-template-colum 属性，设置网格，比如：repeat(3,1fr)代表每行 3 项，1fr 代表每项均分空间
  - 同时可以设置此属性的 min 和 max，限制每一项的最小和最大尺寸
- rpx 单位，rpx 是小程序中的单位，1rpx 是屏幕宽度的 1/750，在配置 pageOrientation 后可支持横屏模式
- rem/em 基于根/父元素字体大小
- vw/vh 视窗单位
- % 百分比，相对于父元素
- @media 媒体查询策略（尺寸、屏幕方向）
- 图片响应式：
  - picture 标签包裹 source 标签和 img 标签，根据 source 标签的 media 属性的值来选择合适的图片
    - <picture>
        <source media="(max-width: 799px)" srcset="mobile.jpg">
        <source media="(min-width: 800px)" srcset="desktop.jpg">
        <img src="desktop.jpg" alt="响应式图片">
      </picture>
  - 分辨率切换
    - <img srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
      sizes="(max-width: 600px) 480px, (max-width: 1000px) 768px, 1200px"
      src="medium.jpg" alt="响应式图片">
  - 2x 3x 图片
    - img 标签可以直接用 srcset 属性
    - css 中，可用媒体查询分辨 devicePixelRadio 属性
- Tailwind CSS + PostCSS 方案 [TailwindCss+PostCss 样式](./TailwindCss+PostCss.md)

## 小程序微信授权流程

- 通过 wx.login 接口，获取到小程序登录码 code
- 把 code 发送到自己的服务端
- 服务端用 code、appid、appsecret 去微信换取 session_key 和 openid
- 用换取到的 session_key 和 openid 注册用户或者登录，生成 token 给到前端
- 前端把 token 带入到后续的请求头中

## 微信支付流程

- 支付功能需要先授权登录
- 前端将商品信息发送给自己的服务端
- 服务端根据商品信息和 openid，生成订单+签名（按微信支付 SDK 的要求）
- 把订单+签名向微信支付后台发送支付请求，获取预付款订单 id(prepay_id)
- 再次根据 SDK 要求生成 预付款订单签名
- 把 prepay_id 和预付款订单签名返回给前端
- 前端调用 wx.requestPayment 发起微信支付
- 微信支付后台处理后，将结果返回给前端和服务端

## uniapp 多端打包流程

- H5
  - HBuildx 上点击发行，会生成 dist 文件夹
- 微信小程序
  - 配置小程序 appid，点击发行
  - 成功后在微信开发者工具上点击上传，生成体验版二维码，
  - 在体验版测试完成后，提交审核，24 小时内审核完毕即可

## 小程序分包

- 在 page.json 里配置分包，留一个主包，其他包分拆到不同的 subPackages 里面
- 根据分包配置，拆分 pages 的文件夹目录，路由跳转也需要根据分包来修改
- 分包可以引用主包的资源，主包不能用分包的资源，分包之间也不能互相引用
- 预加载分包的方法
  - 可以在 page.json 中配置预加载分包规则 preloadRule
  - 小程序可以在代码中用 uniapp 的 api 预先加载：uni.preloadPage
  - 其他端可以通过请求分包中的一个小的资源来出发分包下载，模拟预加载

## uniapp 的性能优化有哪些

- 开发时注意响应式数据的改动尽量少，或者集中修改，减少底层调用 setData 的次数
  - 响应式数据的层级尽量不要嵌套很多
- 使用 scroll-view 分页加载大数据
- 使用虚拟滚动插件加载大数据
- 分包加载
- 避免过深的页面层级
- 图片
  - 压缩 使用 compressorjs 压缩
  - 使用 webp 格式
  - 使用 cdn
  - 图片懒加载
    - 使用 lazy-load 属性，<image lazy-load />，仅支持小程序
    - 使用插件 uni-lazy-load 包裹 image

## uniapp 如何管理全局状态

- vuex
- pinia

## uniapp 如何实现用户登录状态持久化？

- 使用 uni.setStorageSync 存储 token
- 封装请求拦截器，自动添加 token
- 在 app.vue 的 onLaunch 中检查登录状态

## uniapp 如何实现下拉刷新和上拉加载

- 在 page.json 中配置页面 enablePullDownRefresh
- 页面中监听：
  - 下拉刷新事件 onPullDownRefresh
  - 上拉加载 onReachBottom

## uniapp 如何调用第三方服务

- 使用官方提供的 api，如 uni.requestPayment

## uniapp 如何请求系统权限

需要使用条件编译，针对不同的平台调用对应的 api，

## uniapp 如何上传下载文件

先检测是否有读取/存储文件的权限
再上传下载
