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

function hasWebGlSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function detectQualityMode() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const memory = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = window.matchMedia('(max-width: 860px)').matches;

  if (prefersReducedMotion || memory <= 2 || cores <= 4 || mobile) {
    return {
      label: 'Адаптивный (mobile)',
      maxPixelRatio: 1.25,
      antialias: false,
      autoRotate: false,
      powerPreference: 'low-power'
    };
  }

  return {
    label: 'Высокое качество',
    maxPixelRatio: 2,
    antialias: true,
    autoRotate: true,
    powerPreference: 'high-performance'
  };
}

export async function initModelViewer() {
  const modelViewport = document.getElementById('modelViewport');
  if (!modelViewport) return;

  const modelOverlay = document.getElementById('modelOverlay');
  const modelLiveStatus = document.getElementById('modelLiveStatus');
  const resetButton = document.getElementById('modelResetView');
  const spinButton = document.getElementById('modelToggleSpin');
  const downloadButton = document.getElementById('modelDownloadLink');

  const setStatus = (text) => {
    if (modelLiveStatus) modelLiveStatus.textContent = text;
  };

  const showOverlay = (title, text) => {
    if (!modelOverlay) return;
    modelOverlay.classList.remove('is-hidden');
    modelOverlay.innerHTML = `<div class="model-overlay-card"><strong>${title}</strong><p>${text}</p></div>`;
  };

  const hideOverlay = () => modelOverlay?.classList.add('is-hidden');

  const blob = new Blob([asciiStl], { type: 'model/stl' });
  const downloadUrl = URL.createObjectURL(blob);
  if (downloadButton) downloadButton.href = downloadUrl;

  if (!hasWebGlSupport()) {
    setStatus('WebGL недоступен');
    showOverlay(
      '3D-просмотр недоступен на этом устройстве',
      'Браузер не поддерживает WebGL. Вы можете скачать STL-файл и открыть его в стороннем просмотрщике.'
    );
    return;
  }

  try {
    const [{ default: THREE }, { OrbitControls }, { STLLoader }] = await Promise.all([
      import('https://unpkg.com/three@0.160.1/build/three.module.js'),
      import('https://unpkg.com/three@0.160.1/examples/jsm/controls/OrbitControls.js'),
      import('https://unpkg.com/three@0.160.1/examples/jsm/loaders/STLLoader.js')
    ]);

    const quality = detectQualityMode();
    const renderer = new THREE.WebGLRenderer({ antialias: quality.antialias, alpha: true, powerPreference: quality.powerPreference });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxPixelRatio));
    renderer.setSize(modelViewport.clientWidth, modelViewport.clientHeight);
    modelViewport.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, modelViewport.clientWidth / modelViewport.clientHeight, 0.1, 2000);
    camera.position.set(120, 90, 130);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = quality.autoRotate;
    controls.enablePan = false;

    scene.add(new THREE.HemisphereLight(0xe9f1ff, 0x111722, 1.65));

    const geometry = new STLLoader().parse(new TextEncoder().encode(asciiStl).buffer);
    geometry.computeVertexNormals();
    geometry.center();

    const material = new THREE.MeshStandardMaterial({ color: 0xdfe8ff, metalness: 0.1, roughness: 0.4 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    setStatus(`Файл открыт · ${quality.label}`);
    hideOverlay();

    const onResize = () => {
      const width = modelViewport.clientWidth || 1;
      const height = modelViewport.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize, { passive: true });

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
      spinButton.classList.toggle('is-active', controls.autoRotate);
      spinButton.setAttribute('aria-pressed', String(controls.autoRotate));
      spinButton.textContent = controls.autoRotate ? 'Автоповорот' : 'Вращение вручную';

      spinButton.addEventListener('click', () => {
        controls.autoRotate = !controls.autoRotate;
        spinButton.classList.toggle('is-active', controls.autoRotate);
        spinButton.setAttribute('aria-pressed', String(controls.autoRotate));
        spinButton.textContent = controls.autoRotate ? 'Автоповорот' : 'Вращение вручную';
      });
    }

    let rafId = 0;
    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(renderLoop);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
        return;
      }
      rafId = window.requestAnimationFrame(renderLoop);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    rafId = window.requestAnimationFrame(renderLoop);

    window.addEventListener(
      'pagehide',
      () => {
        window.cancelAnimationFrame(rafId);
        URL.revokeObjectURL(downloadUrl);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('resize', onResize);
        controls.dispose();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      },
      { once: true }
    );
  } catch (error) {
    URL.revokeObjectURL(downloadUrl);
    console.error(error);
    setStatus('Просмотр недоступен');
    showOverlay(
      'Не удалось открыть 3D-просмотр',
      'Браузер не загрузил движок просмотра. Проверьте подключение к интернету и обновите страницу. STL-файл можно скачать кнопкой выше.'
    );
  }
}
