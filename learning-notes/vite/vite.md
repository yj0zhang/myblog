# 官网

https://vite.dev/

# vite 的目标（优势）

- 使用简单
  - 内置配置项，不需要配置各种 loader
  - 集成了 dev-server，不需要额外配置
  - 内置了 build 命令
- 快，开发效率高
  - 秒级启动项目
  - 得益于 vite 的架构和 esbuild
- 便于扩展
  - 大部份 rollup 插件可以在 vite 中使用
  - 有自己的插件系统

# 与传统构建工具的区别

- vite 的 api 更加高层级
- 不包含自己的编译能力，底层编译能力来自于 rollup 和 esbuild
- 开发时完全基于 esmodule

## vs webpack & rollup

- webpack 更全面
- rollup 更专一
- vite 更好用，为项目而是，而不是为了构建

## vite 为什么更快

- 开发模式：
  - vite 的预编译 详情见下方
  - vite 启动时，不编译，当访问某个路由的时候，才会去根据路由编译对应的模块
  - vite 使用 esbuild 做开发环境下的编译，esbuild 很快
  - vite 会设置 js 请求的缓存设置，当某个公共组件被浏览器加载后，浏览器就把组件存储到缓存中，下次再导入相同的组件时，直接用缓存
  - vite 的 HMR 机制，在组件代码变化时，可以通知到浏览器单独加载该组件
- 生产模式：
  - 基于 rollup 优化构建流程，rollup 的 tree-shaking 和静态分析能力比 webpack 更高效

# vite 构建 vue3 项目

- 创建项目`pnpm create vite@latest my-vue-app --template vue`
- 进入项目，安装依赖`pnpm install`

## 支持 jsx &tsx：

- 先安装插件 `pnpm add @vitejs/plugin-vue-jsx -D`

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
});
```

- 支持 TSX（TypeScript+JSX），需要确保 tsconfig.json 支持 jsx：

```json
{
  "compilerOptions": {
    "jsx": "preserve", // Vue JSX需要这个配置
    "jsxFactory": "h", // Vue3默认使用`h`
    "jsxFragmentFactory": "Fragment"
  }
}
```

## 配置 alias，方便引入文件

在 css 文件中引入其他样式文件: `@import url("@styles/other.css")`

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@styles": "/src/styles",
    },
  },
});
```

## css-modules 使用

- vite 默认支持 css modules，只需要把文件命名为[name].module.css（或.scss/.less）
  例如有一个 css-module 文件： test.module.css

```css
.moduleClass {
  color: red;
}
```

```jsx
// 在组件中使用
import classes from "@styles/test.module.css";
export default defineComponent({
  setup() {
    return () => {
      return <div class={`root ${classes.moduleClass}`}>test</div>;
    };
  },
});
```

## css pre-processors（css 预处理器：scss，less 等）

- vite 内置支持 sass、less、stylus，只需安装对应的预处理器，比如`pnpm install -D sass`
- postcss 支持
  - 如果项目中有`postcss.config.js`，vite 会自动应用
- 在 vite 中配置全局 css：

```js
// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import ./src/styles/global.scss`, //全局scss变量
      },
    },
  },
});
```

## 支持 TypeScript

- 安装 typescript `pnpm install typescript`
- 安装 vue-tsc `vue-tsc --noEmit` 对 vue 中的 ts 做检查校验
- vite 不会对类型进行检查，需要手动检查：`tsc --noEmit`
- vite/client

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve", //typescript不编译语法，留给后续的插件编译
    "sourceMap": true, //在浏览器中直接调试typescript代码
    "resolveJsonModule": true, //可以直接import json
    "esModuleInterop": true, //方便import
    "lib": ["ESNext", "DOM"], //指明当前运行环境需要哪些library的类型
    "isolatedModules": true, // 在写代码时，提示一下潜在的模块相关的错误
    "types": ["vite/client"] //vite/client 在import.meta上添加一些变量，支持导入assets比如png图片
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

## 其他便捷的用法

- vite 可以导入文件的 url 和内容
  - 导入文件地址： `import test from "./test?url"`
  - 导入模块原始内容： `import test from "./test?raw"`
- vite 中使用 worker 也更简单：
  ```js
  //worker.js
  var i = 1;
  function timedCount() {
    i += 1;
    postMessage(i);
    setTimeout(timedCount, 500);
  }
  timedCount();
  ```
  ```js
  import Worker from "./worker?worker";
  const worker = new Worker();
  worker.onmessage = function (e) {
    console.log(e);
  };
  ```
- vite 中 import 一个 json
  - 引入整个 json `import pkg from 'package.json'`
  - 引入某个字段 `import { version } from 'package.json'`

# vite 集成 eslint 和 prettier

- 安装 eslint 相关插件 `pnpm install eslint eslint-config-standard eslint-lugin-import eslint-plugin-promise eslint-plugin-node`
- 配置 .eslintrc.js
  ```js
  module.exports = {
    extends: "standard", // 直接继承 standard 规则
    rules: {
      // 可覆盖或扩展规则
      "no-console": "warn",
    },
  };
  ```
- 添加脚本（package.json）
  ```json
  {
    "scripts": {
      "lint": "eslint .",
      "lint:fix": "eslint . --fix"
    }
  }
  ```
- 结合 prettier 自动修复 eslint 问题
  - vscode 需要安装 prettier 插件
  - 配置.prettierrc 文件
  - 配置 setting 设置 format on save 和 default formatter
  - 使用 husky，在 pre-commit 钩子中，添加`pnpm run lint`命令，使提交的代码符合格式

# vite 中的环境变量

- 内置的环境变量（`import.meta.env` 对象），包含以下值：
  - MODE 用来区分 dev、test、production 等
  - BASE_URL 静态资源 base 路径
  - PROD
  - DEV
  - SSR
- 自定义环境变量，在根目录的.env 文件中添加，必须带`VITE_`前缀，会被添加到`import.meta.env`中：
- 可以定义环境变量的类型，在 vite-env.d.ts 中定义：
  ```ts
  /// <reference types="vite/client" />
  interface ImportMetaEnv {
    VITE_TITLE: string;
  }
  ```

# vite 的 HMR

- 一般在 vue 或 react 项目中，vite 会自动开启 HMR
  vite 会建立一个 websocket 连接，当资源文件更新后，通知浏览器需要更新的文件，浏览器会重新请求对应的文件

- 在无框架的项目中，可以用 vite 自己的 HMR API，实现 HMR
  ```js
  export function render() {
    // do some render work
  }
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      //newModule上有当前模块导出的方法和变量
      newModule.render();
    });
  }
  ```

# vite glob import（导入某个文件夹下的所有文件）

vite 的 glob import 功能，来自第三方库: fast-glob

```js
const globModules = import.meta.glob("./globFolder/*");
Object.entries(globModules).forEach([k,v] => {
  // k: 文件路径，比如：'./globFolder/a.js' or './globFolder/a.json'
  // v: 导入这个文件的函数表达式，比如：
  //    () => import("src/globFolder/a.js")
  //    () => import("src/globFolder/a.json?import")
  v().then(myModule => {
    // myModule.default 默认导出的变量
    // ...
  })
})
```

- `import.meta.glob`方法是异步的，返回的是获取模块的方法
- `import.meta.globEager`方法是同步的，返回的就是模块导出的变量，不需要再异步获取

# vite 的预编译

- vite 会在第一次启动时，会使用 esbuild 把 node_modules 中第三方的库预编译一下，放到 cache 中
- 在预编译过程中，vite 会把非 esm 的模块(CommonJs)编译成 esm 形式
- 也可以在`vite.config.js`中配置需要预编译的模块，使用 optimizeDeps：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    // 如果第三方库引用了另外一个非esm形式的库，可能会报错，此时可尝试在include中加入这个非esm形式的库
    include: [],
    exclude: [],
  },
});
```

# vite 如何配置多页应用

- 使用`rollupOptions.input`指定多个入口文件

```js
import { resolve } from "path";
import { defineConfig } from "vite";
import glob from "glob";
import { createHtmlPlugin } from "vite-plugin-html"; //为不同页面指定独立的html文件和变量
// 自动匹配 src/modules 下的所有 HTML 文件作为入口
const inputs = {};
glob.sync("src/modules/**/index.html").forEach((file) => {
  const name = file.split("/")[2]; // 获取页面名称（如 home、about）
  inputs[name] = resolve(__dirname, file);
});

export default defineConfig({
  build: {
    rollupOptions: {
      input: inputs,
      output: {
        manualChunks: {
          vendor: ["vue", "lodash"], //将公共第三方库单独打包
        },
      },
    },
  },
  plugins: [
    createHtmlPlugin({
      pages: [
        {
          entry: "src/main.ts", // 对应 JS 入口文件
          filename: "index.html", // 输出文件名
          template: "index.html", // 模板文件路径
          injectOptions: {
            data: { title: "Home" }, // 页面专属变量
          },
        },
        {
          entry: "src/about/main.ts",
          filename: "about.html",
          template: "about.html",
          injectOptions: {
            data: { title: "About" },
          },
        },
      ],
      inject: {
        //插入到html中的变量，在html中使用EJS语法引用变量
        data: {
          title: "My App",
          description: "A Vite-powered project",
        },
      },
      minify: {
        //html压缩配置，可以是boolean类型
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
      },
    }),
  ],
});
```

- 每个入口配置自己的 index.html，并显式引入对应入口的 js 文件
- 开发时，直接访问模块的 index.html: `http://localhost:5173/src/modules/home/index.html`
  - 或者使用插件`vite-plugin-html`动态生成 html
- 公共资源放在`public/shared-assets`下，通过绝对路径访问，比如`/shared-assets/logo.png`

# vite 性能优化的手段

## 生产构建优化

- 代码分割
  - 动态导入，使用`import()`语法按需加载模块
  - 配置 rollup 分割策略
  ```js
  {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue','lodash'],
            utils: ['src/utils/*']
          }
        }
      }
    }
  }
  ```
- 依赖预构建优化
  - 排除不需要的依赖：`optimizeDeps.exclude = []`
- 使用 esbuild 压缩：`build.minify = 'esbuild'`
- 静态资源优化

  - 图片，使用插件`vite-plugin-imagemin`：`plugins: [viteImagemin({gifsicle:{optimizationLevel: 3}})]`
  - 小文件转 base64：`build.assetsInlineLimit = 4096`

- cdn 加速第三方依赖
  - 使用 vite-plugin-cdn-import 将 vue、axios 等库替换为 cdn 链接：`plugins: [viteCDNPlugin({ modules: [{ name: 'vue', var: 'Vue',path: 'https://cdn.jsdelivr.net/npm/vue@3' }] })]`

## 开发模式优化

- 减少模块扫描：通过`optimizeDeps.include`预声明依赖，避免冷启动时频繁扫描
- 禁用 sourcemap
- 预渲染，对静态页面使用`vite-plugin-prerenderer`提前生成 html

## 运行时性能

- 异步组件
- 虚拟滚动
