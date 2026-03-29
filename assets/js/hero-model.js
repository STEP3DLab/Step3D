import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { STLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/STLLoader.js';

const canvas = document.getElementById('heroModelCanvas');
const stage = document.getElementById('heroModelStage');
const dimensionsBox = document.getElementById('heroModelDimensions');

if (!canvas || !stage || !dimensionsBox) {
  // Required elements are missing on page.
} else {
  const lowMotion = document.body.classList.contains('is-low-motion')
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 2000);
  camera.position.set(0, 0, 130);

  const hemi = new THREE.HemisphereLight(0x9ab9ff, 0x121821, 0.85);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(120, 90, 100);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x7fb7ff, 0.56);
  fillLight.position.set(-100, -40, 70);
  scene.add(fillLight);

  const grid = new THREE.GridHelper(180, 8, 0x2f4f6f, 0x223347);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  grid.position.y = -26;
  scene.add(grid);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x9ec8ff,
    metalness: 0.24,
    roughness: 0.36,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
  });

  let mesh = null;
  let rafId = 0;

  const formatMM = (value) => `${Math.round(value).toLocaleString('ru-RU')} мм`;

  const setDimensions = (x, y, z) => {
    const rows = dimensionsBox.querySelectorAll('li strong');
    if (rows.length < 3) return;
    rows[0].textContent = formatMM(x);
    rows[1].textContent = formatMM(y);
    rows[2].textContent = formatMM(z);
  };

  const fitCameraToObject = (object3d) => {
    const box = new THREE.Box3().setFromObject(object3d);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    setDimensions(size.x, size.y, size.z);

    object3d.position.sub(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.tan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.38;

    camera.position.set(distance * 0.35, distance * 0.2, distance);
    camera.near = Math.max(distance / 100, 0.01);
    camera.far = distance * 100;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };

  const onResize = () => {
    const width = stage.clientWidth || 1;
    const height = stage.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const animate = () => {
    if (mesh && !lowMotion) {
      mesh.rotation.y += 0.0038;
      mesh.rotation.x = Math.sin(performance.now() * 0.00025) * 0.06;
    }
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(animate);
  };

  const loader = new STLLoader();
  loader.load(
    'assets/Meshy_AI_Polar Sage_1774654464_texture.stl',
    (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      scene.add(mesh);
      onResize();
      fitCameraToObject(mesh);
      animate();
    },
    undefined,
    () => {
      stage.classList.add('model-stage--error');
    },
  );

  const resizeObserver = new ResizeObserver(() => {
    onResize();
    if (mesh) fitCameraToObject(mesh);
  });
  resizeObserver.observe(stage);

  window.addEventListener('beforeunload', () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    resizeObserver.disconnect();
    renderer.dispose();
  });
}
