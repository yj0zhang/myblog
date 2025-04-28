webpack4 中新增了 DllPlugin，用来打包那些 万年不改的依赖库，需要现在本地运行 dll 配置，生成 dll 文件

dll.config 像正常的配置一样，有 entry、output，modules 和 plugins

```js
{
  mode: "production",
  entry: {//多入口，依赖分开打包
        vue: ["vue", "vue-router"],
        element: ["element-ui", "element-ui/lib/theme-chalk/index.css"]
  },
  output: {
    path: path.join(__dirname, "../vendor"),
    filename: "[name].vendor.[chunkhash:7].js",
    library: "[name]"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", //同extract-text-webpack-plugin一样,与url-loader里的outputPath对应
              filename: "[name].[contenthash:7].css"
            }
          },
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "file-loader",
        query: {
          limit: 10000,
          name: "img/[name].[hash:7].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "file-loader",
        query: {
          limit: 10000,
          name: "fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, "../vendor", "[name]-manifest.json"),
      name: "[name]",//需要与output中的library一致
      context: __dirname
    }),
    new MiniCssExtractPlugin("[name].[hash].css"),//压缩css
    new AssetsPlugin({//生成的依赖会带hash，这个插件，生成对应的路径关系，在base中使用
      filename: "bundle-config.json",//json文件名
      path: "./vendor"//文件路径
    })
  ]
};
```

在 base 中使用：
首先需要引入 bundle-config

```js
const bundleConfig = require("../vendor/bundle-config.json"); //调入生成的的路径json
```

然后根据 dll 的入口，引用：

```js
    new webpack.DllReferencePlugin({
      manifest: require("../vendor/vue-manifest.json"),
      context: __dirname//与DllPlugin中的context保持一致
    }),
    new webpack.DllReferencePlugin({
      manifest: require("../vendor/element-manifest.json"),
      context: __dirname//与DllPlugin中的context保持一致
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      //新增
      elementCss: bundleConfig.element.css,
      elementJs: bundleConfig.element.js,
      vueJs: bundleConfig.vue.js,
      env: "development",
    }),
```

接着在 index.html 中引用：

```html
<link
  rel="stylesheet"
  href="./vendor/<%= htmlWebpackPlugin.options.elementCss %>"
/>
<script src="./vendor/<%= htmlWebpackPlugin.options.vueJs %>"></script>
<script src="./vendor/<%= htmlWebpackPlugin.options.elementJs %>"></script>
```
