import * as THREE from 'three';

let renderer, camera, scene, group, surfaces, ready = false;
let width = 1, height = 1, progress = 0, visible = true;
const draw = () => {
  if (!ready || !visible) return;
  const mobile = width < 700;
  camera.position.set(mobile ? 0.6 : -0.5 + progress * 1.6, 0.5 - progress * 0.8, (mobile ? 17 : 13) - progress * (mobile ? 2 : 6));
  camera.lookAt(0, 0, -4);
  group.rotation.y = -0.18 + progress * 0.35;
  group.rotation.z = -0.19 + progress * 0.12;
  surfaces.forEach((surface, i) => { surface.rotation.y = progress * (i % 2 ? -0.35 : 0.35); });
  renderer.render(scene, camera);
  postMessage({ type: 'rendered' });
};
self.onmessage = async ({ data }) => {
  if (data.type === 'init') {
    try {
      renderer = new THREE.WebGLRenderer({ canvas: data.canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      data.canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); ready = false; postMessage({ type: 'fallback' }); });
      renderer.setPixelRatio(data.ratio);
      renderer.setClearColor(0x0a0a0b, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0b, 0.042);
      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 70);
      group = new THREE.Group();
      scene.add(group);
      scene.add(new THREE.HemisphereLight(0xe7e2ff, 0x0a0a0b, 2.5));
      const key = new THREE.DirectionalLight(0xe5e4ec, 5);
      key.position.set(-3, 6, 5); scene.add(key);
      const violet = new THREE.PointLight(0x9d7cff, 36, 30, 2);
      violet.position.set(5, 1, 2); scene.add(violet);
      const graphite = new THREE.MeshPhongMaterial({ color: 0x37363d, specular: 0x4a4650, shininess: 35 });
      const pale = new THREE.MeshPhongMaterial({ color: 0x77737f, specular: 0x77717f, shininess: 45 });
      const purple = new THREE.MeshPhongMaterial({ color: 0x7857c2, specular: 0x665181, shininess: 35 });
      const light = new THREE.MeshBasicMaterial({ color: 0xc6b8ff });
      const box = new THREE.BoxGeometry(1, 1, 1);
      const add = (x, y, z, sx, sy, sz, material = graphite, rotation = 0) => {
        const mesh = new THREE.Mesh(box, material);
        mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); mesh.rotation.z = rotation;
        group.add(mesh); return mesh;
      };
      // An architectural frame, with real thickness and lit edges. The visitor moves through it.
      for (let i = 0; i < 7; i++) {
        const z = -i * 2.2;
        add(-5.3, 0, z, 0.32, 10, 0.52, i % 2 ? graphite : pale);
        add(5.3, 0, z, 0.32, 10, 0.52, i % 2 ? graphite : pale);
        add(0, 4.9, z, 10.9, 0.3, 0.52);
        add(0, -4.9, z, 10.9, 0.3, 0.52);
        add(5.08, 0, z + 0.28, 0.035, 9.7, 0.02, light);
      }
      // Offset work surfaces create depth around the semantic, readable HTML surfaces.
      surfaces = [
        add(3.4, -1.5, 1, 4.3, 2.5, 0.16, graphite, -0.18),
        add(3.6, 2.7, -2.4, 2.5, 1.5, 0.12, purple, -0.13),
      ];
      group.rotation.z = -0.19;

      width = data.width; height = data.height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      await renderer.compileAsync(scene, camera);
      ready = true;
      draw();
    } catch { postMessage({ type: 'fallback' }); }
    return;
  }
  if (!renderer) return;
  if (data.type === 'resize') {
    width = data.width; height = data.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  if (data.type === 'scroll') progress = data.progress;
  if (data.type === 'visible') visible = data.visible;
  draw();
};
