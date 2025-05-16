import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { resizeHandle, resizeRendererToDisplaySize } from "../responsive";
import { AxisGridHelper } from "../helpers";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  const gui = new GUI();

  const fov = 40; //视角
  const aspect = 2; // 宽高比，一般可以是画布的宽高比
  const near = 0.1; // camera能看到的最近距离
  const far = 1000; //camera能看到的最远距离
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  {
    //添加点光源
    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  const objects = []; // 存储场景中所有的几何体

  //创建球体，用来创造太阳、地球和月亮
  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  // 创建一个空的场景图节点，把太阳和地球都作为此节点的子节点
  const solarSystem = new THREE.Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  //创建太阳
  const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
  });
  const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  // 创建一个空的场景图节点，把地球和月亮都作为此节点的子节点
  const earthOrbit = new THREE.Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  // 创建地球
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });
  const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  // 创建月亮
  const moonMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.position.x = 2;
  moonMesh.scale.set(0.5, 0.5, 0.5);
  earthOrbit.add(moonMesh);
  objects.push(moonMesh);

  {
    // 添加控制坐标轴的gui
    function makeAxisGrid(node, label, units) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, "visible").name(label);
    }
    makeAxisGrid(solarSystem, "solarSystem", 25);
    makeAxisGrid(sunMesh, "sunMesh");
    makeAxisGrid(earthOrbit, "earthOrbit");
    makeAxisGrid(earthMesh, "earthMesh");
    makeAxisGrid(moonMesh, "moonMesh");
  }
  //渲染
  function render(time) {
    //响应式
    if (resizeRendererToDisplaySize(renderer)) {
      resizeHandle(renderer, camera);
    }
    //所有几何体都旋转
    time *= 0.001;
    objects.forEach((obj) => {
      obj.rotation.y = time;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
