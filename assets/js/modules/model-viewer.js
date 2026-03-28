const asciiStl = `solid tetra
facet normal 0 0 1
outer loop
vertex 0 0 0
vertex 40 0 0
vertex 20 35 0
endloop
endfacet
facet normal 0 1 0
outer loop
vertex 0 0 0
vertex 20 10 40
vertex 40 0 0
endloop
endfacet
facet normal 1 0 0
outer loop
vertex 40 0 0
vertex 20 10 40
vertex 20 35 0
endloop
endfacet
facet normal -1 0 0
outer loop
vertex 20 35 0
vertex 20 10 40
vertex 0 0 0
endloop
endfacet
endsolid tetra`;

export async function initModelViewer() {
  const modelViewport = document.getElementById('modelViewport');
  if (!modelViewport) return;

  const modelOverlay = document.getElementById('modelOverlay');
  const modelLiveStatus = document.getElementById('modelLiveStatus');
  const resetButton = document.getElementById('modelResetView');
  const spinButton = document.getElementById('modelToggleSpin');
  const downloadButton = document.getElementById('modelDownloadLink');

  const setStatus = (text) => modelLiveStatus && (modelLiveStatus.textContent = text);
  const hideOverlay = () => modelOverlay && modelOverlay.classList.add('is-hidden');
  const showOverlay = (title, text) => {
    if (!modelOverlay) return;
    modelOverlay.classList.remove('is-hidden');
    modelOverlay.innerHTML = `<div class="model-overlay-card"><strong>${title}</strong><p>${text}</p></div>`;
  };
  const supportsWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  };

  try {
    if (!supportsWebGL()) {
      setStatus('WebGL не поддерживается');
      showOverlay('3D-просмотр недоступен', 'На этом устройстве нет поддержки WebGL. Вы можете скачать STL-файл и открыть его в стороннем просмотрщике.');
      return;
    }

    const [{ default: THREE }, { OrbitControls }, { STLLoader }] = await Promise.all([
      import('https://unpkg.com/three@0.160.1/build/three.module.js'),
      import('https://unpkg.com/three@0.160.1/examples/jsm/controls/OrbitControls.js'),
      import('https://unpkg.com/three@0.160.1/examples/jsm/loaders/STLLoader.js')
    ]);

    const weakDevice = window.matchMedia('(max-width: 820px)').matches || ((window.devicePixelRatio || 1) > 2);
    const renderer = new THREE.WebGLRenderer({ antialias: !weakDevice, alpha: true, powerPreference: weakDevice ? 'default' : 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, weakDevice ? 1.5 : 2));
    renderer.setSize(modelViewport.clientWidth, modelViewport.clientHeight);
    modelViewport.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, modelViewport.clientWidth / modelViewport.clientHeight, 0.1, 2000);
    camera.position.set(120, 90, 130);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = weakDevice ? 1.2 : 1.8;
    controls.enablePan = false;

    scene.add(new THREE.HemisphereLight(0xe9f1ff, 0x111722, 1.65));

    const blob = new Blob([asciiStl], { type: 'model/stl' });
    if (downloadButton) downloadButton.href = URL.createObjectURL(blob);

    const geometry = new STLLoader().parse(new TextEncoder().encode(asciiStl).buffer);
    geometry.computeVertexNormals();
    geometry.center();
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xdfe8ff, metalness: 0.1, roughness: 0.4 }));
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    setStatus(weakDevice ? 'Открыт адаптивный режим просмотра' : 'Файл из чата открыт');
    hideOverlay();

    const onResize = () => {
      const width = modelViewport.clientWidth || 1;
      const height = modelViewport.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    const defaultPosition = camera.position.clone();
    const defaultTarget = controls.target.clone();

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        camera.position.copy(defaultPosition);
        controls.target.copy(defaultTarget);
        controls.update();
      });
    }

    if (spinButton) {
      spinButton.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        spinButton.classList.toggle('is-active', controls.autoRotate);
        spinButton.textContent = controls.autoRotate ? 'Автоповорот' : 'Повернуть вручную';
      });
    }

    let rafId = 0;
    let isAnimating = false;
    const animate = () => {
      isAnimating = true;
      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isAnimating = false;
        window.cancelAnimationFrame(rafId);
      } else if (!isAnimating) {
        animate();
      }
    });
  } catch (error) {
    console.error(error);
    setStatus('Просмотр недоступен');
    showOverlay('Не удалось открыть 3D-просмотр', 'Если браузер не загрузил движок просмотра, обновите страницу при подключении к интернету. STL-файл все равно можно скачать кнопкой выше.');
  }
}
