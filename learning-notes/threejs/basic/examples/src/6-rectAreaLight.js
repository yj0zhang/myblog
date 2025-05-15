import * as THREE from "three";
import { resizeRendererToDisplaySize, resizeHandle } from "./2-responsive";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ColorGUIHelper, DegRadHelper } from "./helpers";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
RectAreaLightUniformsLib.init();

const fov = 45, //视野范围
  aspect = 2, //画布的宽高比
  near = 0.1,
  far = 100; //near、far表示近平面和远平面，在这两个外部的会被裁剪
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 30);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// 创建场景
const scene = new THREE.Scene();
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
  const planeMat = new THREE.MeshStandardMaterial({
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
  const cubeMat = new THREE.MeshStandardMaterial({ color: "#8AC" });
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
  const sphereMat = new THREE.MeshStandardMaterial({ color: "#CA8" });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}

const color = 0xffffff;
const intensity = 10;
const width = 12;
const height = 4;
const light = new THREE.RectAreaLight(color, intensity, width, height);
light.position.set(0, 10, 0);
light.rotation.x = THREE.MathUtils.degToRad(-90);
// light.rotation.x = -Math.PI / 2;
scene.add(light);

const helper = new RectAreaLightHelper(light);
scene.add(helper);

{
  //添加GUI
  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
  gui.add(light, "intensity", 0, 10, 0.1);
  gui.add(light, "width", 0, 20);
  gui.add(light, "height", 0, 20);
  gui
    .add(new DegRadHelper(light.rotation, "x"), "value", -180, 180)
    .name("x rotation");
  gui
    .add(new DegRadHelper(light.rotation, "y"), "value", -180, 180)
    .name("y rotation");
  gui
    .add(new DegRadHelper(light.rotation, "z"), "value", -180, 180)
    .name("z rotation");
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
    folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
    folder.open();
  }
  function updateLight() {
    helper.update();
  }
  makeXYZGUI(gui, light.position, "position", updateLight);
}

// 为了让立方体动起来，使用requestAnimationFrame，每一帧旋转一点
function render(time) {
  time *= 0.001;

  // 响应式
  if (resizeRendererToDisplaySize(renderer)) {
    resizeHandle(renderer, camera);
  }
  // 每一帧都根据新的位置重新渲染
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
