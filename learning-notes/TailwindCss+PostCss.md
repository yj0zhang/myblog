## 安装依赖

- npm install tailwindcss postcss autoprefixer postcss-preset-env postcss-pxtorem
- npx tailwindcss init

## 文件基础结构

- src
  - input.css
  - main.js
- postcss.config.js
- tailwind.config.js
- package.json

## 配置文件设置

### postcss.config.js

```js
module.exports = {
  tailwindcss: {},
  autoprefixer: {
    overrideBrowserslist: [
      "last 2 versions",
      "> 1%",
      "iOS >= 10",
      "Android >= 5",
    ],
  }, //自动添加浏览器前缀
  "postcss-pxtorem": {
    rootValue: 75, // 750设计稿，1rem=75px
    propList: ["*", "!border*"], // 转换所有属性，除了border相关
    unitPrecision: 5, // 转换后保留的小数位数
    selectorBlackList: ["el-", "ant-"], // 忽略element-ui和antd的样式
    replace: true, // 是否直接替换值而不添加备用值
    mediaQuery: false, // 是否转换媒体查询中的px
    minPixelValue: 2, // 小于2px不转换
    exclude: /node_modules/,
  }, // 转换px到rem，html的font-size可以用lib-flexible库管理
  "postcss-preset-env": {
    stage: 3, // 使用stage 3+的CSS特性
    features: {
      "nesting-rules": true, // 启用嵌套规则
    },
  }, // 使用未来的CSS特性
  cssnano:
    process.env.NODE_ENV === "production"
      ? {
          preset: "default",
        }
      : {}, //使用cssnano压缩
};
```

### tailwind.config.js

```js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], //根据项目实际使用的文件类型调整
  theme: {
    extend: {}, //在此扩展默认主题
  },
  plugins: [], //可添加tailwind插件
};
```

### src/indput.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
/**可在此添加自定义css */
```

## 构建脚本

- package.json

```json
{
  "dev": "postcss src/input.css -o dist/output.css --watch",
  "build": "postcss src/input.css -o dist/output.css --env production"
}
```

## 与 webpack 集成，并使用 sass

- 安装额外依赖
  - npm install postcss-loader style-loader css-loader mini-css-extract-plugin sass
- 在 sass 中使用 tailwind
  ```scss
  @import "tailwindcss/base";
  @import "tailwindcss/components";
  @import "tailwindcss/utilities";
  .custom-class {
    @apply bg-blue-500;
    color: white;
  }
  ```
- webpack 配置示例

  ```js
  const MiniCssExtrackPlugin = require("mini-css-extract-plugin");
  module.exports = {
    module: {
      rules: [
        {
          test: "/.scss$/",
          use: [
            MiniCssExtractPlugin.loader,
            "style-loader",
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: styles.css,
      }),
    ],
  };
  ```

## 自定义主题

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#5c6ac4",
        secondary: "#ecc94b",
      },
      spacing: {
        128: "32rem",
      },
    },
  },
};
```

## 常用的 tailwind 插件

- npm install -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/line-clamp @tailwindcss/aspect-ratio
- 配置插件
  ```js
  // tailwind.config.js
  module.exports = {
    plugins: [
      require("@tailwindcss/typography"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/line-clamp"),
    ],
  };
  ```
