import * as THREE from "three";
import { resizeRendererToDispplaySize, resizeHandle } from "./2-responsive";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

//这四个参数定义了一个视锥，近平面和远平面的高度由视野范围决定，宽度由视野范围和宽高比决定
const fov = 75, //视野范围
  aspect = 2, //画布的宽高比
  near = 0.1,
  far = 5; //near、far表示近平面和远平面，在这两个外部的会被裁剪
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// 摄像机默认看向z轴的负方向，上方朝向Y轴的正方向，默认位置在原点，
// 把摄像机向z轴正向移动2坐标，可以看到原点处
camera.position.z = 2;

// 创建场景
const scene = new THREE.Scene();
// 创建长宽高都是1的立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 再添加几个立方体
// 根据入参创造立方体
function makeInstance(geometry, color, x) {
  // 创建基本材质
  const material = new THREE.MeshPhongMaterial({ color });
  // 创建网格对象
  const cube = new THREE.Mesh(geometry, material);
  // 移动
  cube.position.x = x;
  return cube;
}
const cubes = [
  makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2),
];

cubes.forEach((c) => scene.add(c));

// 为了让立方体动起来，使用requestAnimationFrame，每一帧旋转一点
function render(time) {
  time *= 0.001;

  // 响应式
  if (resizeRendererToDispplaySize(renderer)) {
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

// 添加一盏平行光，使画面更加立体
const light = new THREE.DirectionalLight(0xffffff, 3);
// 光源位置设置在摄像机左上方，朝向原点
light.position.set(-1, 2, 4);
scene.add(light);
