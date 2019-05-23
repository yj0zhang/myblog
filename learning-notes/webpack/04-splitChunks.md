关于splitChunks，有一个系列文章写的不错：https://www.cnblogs.com/kwzm/p/10314438.html

使用splitChunks拆分element-ui：

```js
splitChunks: {
  cacheGroups: {
    chunks: 'all',
    common: {
      test:/[\\/]src[\\/]js[\\/]/,
      minSize: 10,//要生成的块的最小大小（以字节为单位）
      minChunks: 1,//其他entry引用次数大于1
      // name: 'common',
      reuseExistingChunk: true,
      maxInitialRequests: 6,// entry文件请求的chunks不应该超过此值
      // maxAsyncRequests 异步请求的chunks不应该超过此值
      priority: 10,
    },
    vendor: {
      name: true,
      test: /[\\/]node_modules[\\/]/,
      priority: 15,
      chunks: 'all',
      reuseExistingChunk: true,
    },
    elementUI: {
      name: 'element-ui',
      test: /[\\/]node_modules[\\/]element-ui[\\/]/,
      priority: 20,
      //虽然在cacheGroups下已经写了chunks: 'all'，但是这里如果不加的话，还是会把element-ui打包进app，不知道为什么，vendor同理
      chunks: 'all',
    }
  }
}
```
