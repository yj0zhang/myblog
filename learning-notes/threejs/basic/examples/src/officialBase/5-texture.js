import * as THREE from "three";
import { resizeRendererToDisplaySize, resizeHandle } from "../responsive";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { DegRadHelper, StringToNumberHelper } from "../helpers";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

//这四个参数定义了一个视锥，近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定
const fov = 75, //视野范围
  aspect = 2, //画布的宽高比
  near = 0.1,
  far = 50; //near、far表示近平面和远平面，在这两个外部的会被裁剪
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// 摄像机默认看向z轴的负方向，上方朝向Y轴的正方向，默认位置在原点，
// 把摄像机向z轴正向移动2坐标，可以看到原点处
camera.position.z = 5;

// 创建场景
const scene = new THREE.Scene();
// 创建长宽高都是1的立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);

const cubes = [];

//加载纹理
const loader = new THREE.TextureLoader();
const texture = loader.load("../asserts/images/wall.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
// 创建基本材质
const material = new THREE.MeshBasicMaterial({ map: texture });
// 创建网格对象
const cube = new THREE.Mesh(geometry, material);
// 移动
cube.position.x = 0;
cubes.push(cube);
{
  function loadColorTexture(path) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  // 正方体的6个面显示不同的图片
  const materials = [
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-1.jpg"),
    }),
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-2.jpg"),
    }),
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-3.jpg"),
    }),
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-4.jpg"),
    }),
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-5.jpg"),
    }),
    new THREE.MeshBasicMaterial({
      map: loadColorTexture("../asserts/images/flower-6.jpg"),
    }),
  ];
  const cube = new THREE.Mesh(geometry, materials);
  // 移动
  cube.position.x = 2;
  cubes.push(cube);
}

cubes.forEach((c) => scene.add(c));

const wrapModes = {
  ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
  RepeatWrapping: THREE.RepeatWrapping,
  MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
};

function updateTexture() {
  texture.needsUpdate = true;
}

// 设置UI操作
const gui = new GUI();
gui
  .add(new StringToNumberHelper(texture, "wrapS"), "value", wrapModes)
  .name("texture.wrapS")
  .onChange(updateTexture);
gui
  .add(new StringToNumberHelper(texture, "wrapT"), "value", wrapModes)
  .name("texture.wrapT")
  .onChange(updateTexture);
gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");
gui
  .add(new DegRadHelper(texture, "rotation"), "value", -360, 360)
  .name("texture.rotation");

// 为了让立方体动起来，使用requestAnimationFrame，每一帧旋转一点
function render(time) {
  time *= 0.001;

  // 响应式
  if (resizeRendererToDisplaySize(renderer)) {
    resizeHandle(renderer, camera);
  }
  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });
  // 每一帧都根据新的位置重新渲染
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
