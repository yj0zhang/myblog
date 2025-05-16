// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeHandle, resizeRendererToDisplaySize } from "../../responsive";

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

// 设置相机位置
camera.position.z = 15;
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
// controls.target.set(0, 5, 0);
controls.update();

// 渲染函数
function animate() {
  if (resizeRendererToDisplaySize(renderer)) {
    resizeHandle(renderer, camera);
  }
  controls.update();
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
}
animate();

// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
);
sphere1.position.x = -4;
scene.add(sphere1);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
);

scene.add(sphere2);

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff,
  })
);

sphere3.position.x = 4;
scene.add(sphere3);

console.log(scene.children);
// 创建射线
const raycaster = new THREE.Raycaster();
// 创建鼠标向量
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  console.log(event.clientX, event.clientY);
  // 设置鼠标向量的x,y值
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

  // console.log(mouse.x, mouse.y);
  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(mouse, camera);

  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3]);

  if (intersects.length > 0) {
    //光源和鼠标位置组成的射线上，穿过的几何体列表：intersects
    // console.log(intersects[0].object);
    if (intersects[0].object._isSelect) {
      //已经选中了，恢复
      console.log(intersects[0].object._originColor);
      intersects[0].object.material.color.set(
        intersects[0].object._originColor
      );
      intersects[0].object._isSelect = false;
      return;
    }
    //修改第一个物体的颜色
    intersects[0].object._isSelect = true;
    intersects[0].object._originColor =
      intersects[0].object.material.color.getHex();
    intersects[0].object.material.color.set(0xff0000);
  }

  console.log(intersects);
});
