## gltf 模型是什么

在企业开发中，通常会在 3D 建模软件中创建好场景，再导入 threejs 中，显示在页面上。gltf/glb 是比较常用的一种模型格式

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const gltfLoader = new GLTFLoader();
gltfLoader.load("./scene.gltf", (gltf) => {
  console.log(gltf);
  scene.add(gltf.scene);
});
```

## 模型解压

有些模型是被压缩过的，threejs 提供了一个 loader，用于加载经过 Draco 压缩的图像库

```js
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
const loader = new DRACOLoader();
loader.setDecoderPath("/examples/jsm/libs/draco/");
loader.load(
  "/model.drc",
  // called when the resource is loaded
  function (geometry) {
    const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  },
  // called as loading progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);
```
