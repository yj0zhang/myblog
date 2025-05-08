import * as THREE from "three";
import { resizeRendererToDisplaySize } from "./2-responsive";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  const loader = new THREE.TextureLoader();

  {
    //画地面
    const planeSize = 40;

    const texture = loader.load("../asserts/images/checker.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  const shadowTexture = loader.load("../asserts/images/roundshadow.png");
  const sphereShadowBases = [];
  {
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );

    const planeSize = 1;
    const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize);

    const numSpheres = 15;
    for (let i = 0; i < numSpheres; ++i) {
      // 球体和阴影的父
      const base = new THREE.Object3D();
      scene.add(base);

      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true, // 透明的，让我们可以看到地面
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.y = 0.001; // 阴影在地面上
      shadowMesh.rotation.x = Math.PI * -0.5;
      const shadowSize = sphereRadius * 4;
      shadowMesh.scale.set(shadowSize, shadowSize, shadowSize);
      base.add(shadowMesh);

      // add the sphere to the base
      const u = i / numSpheres;
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(u, 1, 0.75);
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(0, sphereRadius + 2, 0);
      base.add(sphereMesh);

      // remember all 3 plus the y position
      sphereShadowBases.push({
        base,
        sphereMesh,
        shadowMesh,
        y: sphereMesh.position.y,
      });
    }
  }

  {
    //半球光
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 0.75;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    //方向光
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 5);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);
  }

  function render(time) {
    time *= 0.001; // convert to seconds

    resizeRendererToDisplaySize(renderer);

    {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    sphereShadowBases.forEach((sphereShadowBase, ndx) => {
      const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;

      // u is a value that goes from 0 to 1 as we iterate the spheres
      const u = ndx / sphereShadowBases.length;

      // 计算base的位置，让其在xz平面上移动
      const speed = time * 0.2;
      const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
      const radius = Math.sin(speed - ndx) * 10;
      base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

      // yOff is a value that goes from 0 to 1
      const yOff = Math.abs(Math.sin(time * 2 + ndx));
      // 让球体上下移动
      sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
      // 让阴影的透明度随球体的上下移动变化
      shadowMesh.material.opacity = THREE.MathUtils.lerp(1, 0.25, yOff);
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
