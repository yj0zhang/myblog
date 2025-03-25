// 默认情况下rollup打包的时候，会查找当前目录下这个文件，可以单独指定
// 采用es模块编写配置文件

import ts from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import { fileURLToPath } from "url";

// import.meta.url: 当前文件的绝对路径 file://XXX/XXX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); //当前文件所在的文件夹目录，绝对路径

export default {
  input: "./index.ts",
  output: {
    file: path.resolve(__dirname, "dist/bundle.js"),
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    nodeResolve({
      //（第三方包的入口）入口文件可以是ts、js
      extensions: [".js", "ts"],
    }),
    ts({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
};
