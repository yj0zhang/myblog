## angularJs 结合 Vue，如何优化加载性能

- gulp 结合 webpack-stream，实现生产环境打包
  - webpack 配置分包
  - 使用 webpack 魔法注释实现动态加载：在源代码中实现动态导入
- gulp 结合 gulp-webserver 实现开发服务器

```js
// gulpfile.js
const gulp = require("gulp");
const webpack = require("webpack-stream");
const named = require("vinyl-named");

gulp.task("bundle", () => {
  return gulp
    .src("src/*.js")
    .pipe(named()) // 保持原始文件名
    .pipe(
      webpack({
        mode: "production",
        output: {
          filename: "[name].js",
          chunkFilename: "[name].[chunkhash:8].js", // 分包文件命名
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env"] },
              },
            },
          ],
        },
        optimization: {
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vendors: {
                test: /[\\/]vendor[\\/]/,
                name: "vendors",
                priority: 10,
              },
            },
          },
        },
      })
    )
    .pipe(gulp.dest("dist"));
});
```

拥有良好的沟通和协调能力，能够快速适应新环境，重视自身素质培养，学习能力强，做事情可以坚持不懈，持之以恒。

个人练习：

uniapp 跨端开发： https://github.com/yj0zhang/WallpaperMall/tree/main
大数据量虚拟表格 https://github.com/yj0zhang/myblog/tree/master/js/virtualTable
大文件断点续传 https://github.com/yj0zhang/my-video-uploader
支持虚拟滚动的瀑布式布局 https://github.com/yj0zhang/uniapp-execise/blob/main/src/pages/index/components/WaterfallVirtual.vue
