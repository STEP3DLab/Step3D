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

  const hemi = new THREE.HemisphereLight(0xa5c4ff, 0x101827, 1.05);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(120, 90, 100);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x7fb7ff, 0.62);
  fillLight.position.set(-100, -40, 70);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x8fd7ff, 0.3);
  rimLight.position.set(20, 20, -120);
  scene.add(rimLight);

  const grid = new THREE.GridHelper(180, 8, 0x2f4f6f, 0x223347);
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  grid.position.y = -26;
  scene.add(grid);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x9ec8ff,
    metalness: 0.16,
    roughness: 0.34,
    clearcoat: 0.36,
    clearcoatRoughness: 0.32,
    side: THREE.DoubleSide,
  });

  let mesh = null;
  let rafId = 0;
  let fitDistance = 130;

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
    const fitWidthDistance = fitHeightDistance / Math.max(camera.aspect, 0.5);
    fitDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.34;

    camera.position.set(fitDistance * 0.34, fitDistance * 0.18, fitDistance);
    camera.near = Math.max(fitDistance / 120, 0.01);
    camera.far = fitDistance * 100;
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
      const t = performance.now();
      mesh.rotation.y += 0.0038;
      mesh.rotation.x = Math.sin(t * 0.00022) * 0.06;
      camera.position.x = Math.sin(t * 0.00012) * (fitDistance * 0.03) + (fitDistance * 0.34);
      camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
    rafId = window.requestAnimationFrame(animate);
  };

  const loader = new STLLoader();

  const modelFilename = 'Meshy_AI_Polar Sage_1774654464_texture.stl';
  const modelCandidates = [
    new URL(`../${modelFilename}`, import.meta.url).href,
    new URL(`assets/${modelFilename}`, document.baseURI).href,
  ];

  const loadModel = async () => {
    for (const modelUrl of modelCandidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const geometry = await loader.loadAsync(modelUrl);
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();
        geometry.center();
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        scene.add(mesh);
        stage.classList.remove('model-stage--error');
        onResize();
        fitCameraToObject(mesh);
        animate();
        return;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Не удалось загрузить 3D-модель по пути:', modelUrl, error);
      }
    }

    stage.classList.add('model-stage--error');
    // eslint-disable-next-line no-console
    console.error('Не удалось загрузить 3D-модель. Проверены пути:', modelCandidates.join(', '));
  };

  loadModel();

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
