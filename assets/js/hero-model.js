import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/STLLoader.js';

const mount = document.getElementById('heroModelViewer');

if (mount) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1000);
  camera.position.set(0, 20, 120);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xd8e7ff, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x9dc3ff, 1.8);
  keyLight.position.set(28, 36, 34);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x9bf9ff, 0.75);
  rimLight.position.set(-24, -10, -20);
  scene.add(rimLight);

  const group = new THREE.Group();
  scene.add(group);

  let mesh = null;
  const loader = new STLLoader();

  const fitRenderer = () => {
    const { width, height } = mount.getBoundingClientRect();
    const safeWidth = Math.max(width, 120);
    const safeHeight = Math.max(height, 120);
    renderer.setSize(safeWidth, safeHeight, false);
    camera.aspect = safeWidth / safeHeight;
    camera.updateProjectionMatrix();
  };

  loader.load(
    'Meshy_AI_Polar Sage_1774654256_generate.stl',
    (geometry) => {
      geometry.computeVertexNormals();
      geometry.center();

      const material = new THREE.MeshPhysicalMaterial({
        color: 0xdce9ff,
        metalness: 0.24,
        roughness: 0.32,
        clearcoat: 0.5,
        clearcoatRoughness: 0.25,
      });

      mesh = new THREE.Mesh(geometry, material);
      const bounds = new THREE.Box3().setFromObject(mesh);
      const size = bounds.getSize(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;
      const scale = 62 / maxAxis;
      mesh.scale.setScalar(scale);
      group.add(mesh);
    },
    undefined,
    () => {
      mount.classList.add('model-fallback');
      mount.innerHTML = '<span>3D preview unavailable</span>';
    },
  );

  fitRenderer();
  window.addEventListener('resize', fitRenderer);

  let rafId = 0;
  let running = true;

  const animate = () => {
    if (!running) return;
    rafId = requestAnimationFrame(animate);

    if (mesh) {
      mesh.rotation.y += 0.0038;
      mesh.rotation.x = Math.sin(Date.now() * 0.00035) * 0.07;
    }

    group.rotation.z = Math.sin(Date.now() * 0.0002) * 0.03;
    renderer.render(scene, camera);
  };

  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
      return;
    }

    if (!running) {
      running = true;
      animate();
    }
  });
}
