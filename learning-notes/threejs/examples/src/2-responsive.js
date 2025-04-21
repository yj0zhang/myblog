export function resizeHandle(renderer, camera) {
  // 解决立方体变形的问题：窗口尺寸变化导致拉伸
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}
// 解决立方体锯齿化的问题
export function resizeRendererToDispplaySize(renderer) {
  // 检查canvas的内部尺寸（分辨率，通常被叫做绘图缓冲区），和canvas的显示尺寸是否一致，如果绘图缓冲区小，会锯齿化
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  // 如果尺寸变化了，需要调整，返回true
  return needResize;
}
