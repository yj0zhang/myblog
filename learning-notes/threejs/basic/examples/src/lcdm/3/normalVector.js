//法向量，是垂直于模型表面的向量，用于光照计算和着色

// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

let uvTexture = new THREE.TextureLoader().load(
  "../../../public/texture/uv_grid_opengl.jpg"
);

// // 创建平面几何体
const planeGeometry = new THREE.PlaneGeometry(2, 2);
console.log(planeGeometry);
// // 创建材质
const planeMaterial = new THREE.MeshBasicMaterial({
  map: uvTexture,
});
// // 创建平面
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// // 添加到场景
scene.add(planeMesh);
planeMesh.position.x = -3;

// 创建几何体
const geometry = new THREE.BufferGeometry();
// 创建顶点数据,顶点是有序的,每三个为一个顶点，逆时针为正面
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,

//   1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0,
// ]);
// // 创建顶点属性
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// 使用索引绘制
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0,
]);
// 创建顶点属性
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0]);
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// 设置uv坐标
const uv = new Float32Array([
  0,
  0,
  1,
  0,
  1,
  1,
  0,
  1, // 正面
]);
// 创建uv属性
geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
{
  //直接计算出法向量 或者 设置法向量 都可以
  // 设置法向量
  const normals = new Float32Array([
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1, // 正面
  ]);
  // 创建法向量属性
  geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

  // 计算出法向量
  // geometry.computeVertexNormals();
}
//顶点移动，会改变顶点坐标，作用与修改position类似
geometry.translate(-1, 0, 0);
//顶点旋转
geometry.rotateX(Math.PI / 6);
//顶点缩放
geometry.scale(1, 1, 3);

console.log(geometry);
// 创建材质
const material = new THREE.MeshBasicMaterial({
  map: uvTexture,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
plane.position.x = 3;

// 创建法向量辅助器 显示法向量标线
const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000);
scene.add(helper);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
}
animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let eventObj = {
  Fullscreen: function () {
    // 全屏
    document.body.requestFullscreen();
    console.log("全屏");
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
    console.log("退出全屏");
  },
};

// 创建GUI
const gui = new GUI();
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏");
gui.add(eventObj, "ExitFullscreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "../../../public/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
  (envMap) => {
    // 设置球形贴图
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.background = envMap;
    // 设置环境贴图
    scene.environment = envMap;
    // 设置plane的环境贴图
    planeMaterial.envMap = envMap;
    // 设置plane的环境贴图
    material.envMap = envMap;
  }
);
