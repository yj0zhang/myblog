import * as THREE from "three";
import { resizeRendererToDisplaySize, resizeHandle } from "../responsive";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ColorGUIHelper, MinMaxGUIHelper } from "../helpers";

const canvas = document.querySelector("#c");
const view1Elem = document.querySelector("#view1");
const view2Elem = document.querySelector("#view2");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  // logarithmicDepthBuffer: true,
});

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

const left = -1;
const right = 1;
const top = 1;
const bottom = -1;
const near = 5;
const far = 50;
const camera = new THREE.OrthographicCamera(
  left,
  right,
  top,
  bottom,
  near,
  far
);
camera.zoom = 0.2;
camera.position.set(0, 10, 20);

const controls = new OrbitControls(camera, view1Elem);
controls.target.set(0, 5, 0);
controls.update();

// 显示摄像机视锥
const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);
//定义第二个摄像机
const camera2 = new THREE.PerspectiveCamera(
  60, // fov
  2, // aspect
  0.1, // near
  500 // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);

const controls2 = new OrbitControls(camera2, view2Elem);
controls2.target.set(0, 5, 0);
controls2.update();

{
  //添加有纹理的平面
  const planeSize = 40;

  const loader = new THREE.TextureLoader();
  const texture = loader.load("../asserts/images/checker.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  scene.add(mesh);
}
{
  //添加立方体
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}
{
  //添加球体
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );
  const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );
  const numSpheres = 20;
  for (let i = 0; i < numSpheres; ++i) {
    const sphereMat = new THREE.MeshPhongMaterial();
    sphereMat.color.setHSL(i * 0.73, 1, 0.5);
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(
      -sphereRadius - 1,
      sphereRadius + 2,
      i * sphereRadius * -2.2
    );
    scene.add(mesh);
  }
}

const color = 0xffffff;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

{
  //添加GUI
  const gui = new GUI();
  const cameraFolder = gui.addFolder("camera");
  cameraFolder.add(camera, "zoom", 0.01, 1, 0.01).listen();
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
  cameraFolder.add(minMaxGUIHelper, "min", 0.00001, 50, 0.00001).name("near");
  cameraFolder.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far");

  const lightFolder = gui.addFolder("light");
  lightFolder
    .addColor(new ColorGUIHelper(light, "color"), "value")
    .name("color");
  lightFolder.add(light, "intensity", 0, 5, 0.1);
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
    folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
    folder.open();
  }
  function updateLight() {
    light.target.updateMatrixWorld();
    helper.update();
  }
  updateLight();
  makeXYZGUI(lightFolder, light.position, "position", updateLight);
  makeXYZGUI(lightFolder, light.target.position, "target", updateLight);
}

function setScissorForElement(elem) {
  const canvasRect = canvas.getBoundingClientRect();
  const elemRect = elem.getBoundingClientRect();

  // 计算canvas的尺寸
  const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
  const left = Math.max(0, elemRect.left - canvasRect.left);
  const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
  const top = Math.max(0, elemRect.top - canvasRect.top);

  const width = Math.min(canvasRect.width, right - left);
  const height = Math.min(canvasRect.height, bottom - top);

  // 设置剪函数以仅渲染一部分场景
  const positiveYUpBottom = canvasRect.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  // 返回aspect
  return width / height;
}
// 为了让立方体动起来，使用requestAnimationFrame，每一帧旋转一点
function render(time) {
  time *= 0.001;

  // 响应式
  resizeRendererToDisplaySize(renderer);
  //启用剪刀函数
  renderer.setScissorTest(true);
  {
    //渲染主视野
    const aspect = setScissorForElement(view1Elem);
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();
    cameraHelper.update();
    //原视野中不绘制cameraHelper
    cameraHelper.visible = false;
    scene.background.set(0x000000);
    //渲染
    renderer.render(scene, camera);
  }
  {
    //渲染第二台摄像机
    const aspect = setScissorForElement(view2Elem);
    camera2.aspect = aspect;
    camera2.updateProjectionMatrix();
    //第二台摄像机中显示cameraHelper
    cameraHelper.visible = true;
    scene.background.set(0x000040);
    renderer.render(scene, camera2);
  }
  // 每一帧都根据新的位置重新渲染
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
