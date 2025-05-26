# 创建项目目录，并初始化

- mkdir my-monorepo
- pnpm init

# 配置 pnpm-workspace.yaml

```yaml
packages:
  - "packages/*"
  - "playground"
```

# 项目结构设计

- my-monorepo
  - packages/
    - components/
    - utils/
  - playground/ ## 开发测试环境
  - package.json
  - pnpm-workspace.yaml

# 创建组件库包

- cd packages/components
- pnpm init
- 安装组件库依赖
  - pnpm add react react-dom
  - pnpm add -D typescript vite @vitejs/plugin-react @types/react @types/react-dom
- 配置 tsconfig.json
- 配置 vite
- 编写组件代码
- 创建入口文件 packages/components/src/index.ts
- package.json 修改：
  ```json
  {
    "name": "@your-scope/components", // 分库名字
    "version": "1.0.0",
    "main": "dist/index.umd.js", //主入口，build后生成的文件
    "module": "dist/index.es.js",
    "types": "dist/index.d.ts", //ts类型声明文件，build:types生成的文件
    "files": ["dist"],
    "scripts": {
      "build": "vite build",
      "dev": "vite build --watch",
      "build:types": "tsc --emitDeclarationOnly"
    },
    "peerDependencies": {
      "react": "^18.0.0",
      "react-dom": "^18.0.0"
    }
  }
  ```

# 创建 playground 测试环境

- cd playground
- pnpm create vite@latest . --template react-ts
- pnpm install
- 修改 package.json， 链接本地组件库（跨包依赖）
  ```json
  {
    "dependencies": {
      "@your-scope/components": "workspace:*"
    }
  }
  ```
- 链接之后，需要重新安装: pnpm install
- 在 playground 中就可以使用@your-scope/components 导出的组件了

# monorepo 管理技巧

- 在根目录 package.json 中添加脚本，pnpm -r 循环执行子包的命令：
  ```json
  {
    "scripts": {
      "build": "pnpm -r run build",
      "dev": "pnpm run --parallel dev", //并行执行所有包的dev命令
      "test": "pnpm -r run test"
    }
  }
  ```
- 跨包依赖，在子包的 package.json 中
  ```json
  {
    "dependencies": {
      "@your-scope/theme": "workspace:*",
      "@your-scope/utils": "workspace:*"
    }
  }
  ```
- 安装所有子包的依赖，在根目录的 package.json 中，添加如下配置，再安装：
  ```json
  {
    "workspaces": ["packages/*", "playground"]
  }
  ```

# 构建与发布

- cd packages/components
- pnpm build 打包
- npm login 登录 npm，如果是自己的 npm 库，需要添加地址
- npm publish 发布
