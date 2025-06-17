// Инициализация 3D‑просмотра и загрузка моделей
import { initConfig } from './calculator.js';
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// При инициализации выводим в консоль текущие цены материалов
console.log('Viewer initialized');
initConfig().then(cfg => {
    console.log('Current material prices:', cfg.materials);
});


// Глобальные переменные сцены Three.js
let scene, camera, renderer, controls, mesh;

/**
 * Создаёт сцену Three.js внутри элемента с указанным id.
 */
export function init(canvasId) {
    const container = document.getElementById(canvasId);
    if (!container) {
        throw new Error(`Container with id "${canvasId}" not found`);
    }

    // создаём сцену и задаём белый фон
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // настраиваем камеру
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // подключаем орбитальные контролы для вращения модели мышью
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    window.addEventListener('resize', onWindowResize);

    // запускаем рендер‑цикл
    animate();
}

// Подгоняем размер холста при изменении размеров окна
function onWindowResize() {
    if (!renderer) return;
    const container = renderer.domElement.parentElement;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Цикл рендера сцены
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Добавляет меш с геометрией на сцену и выставляет камеру.
 */
export function loadMesh(geometry) {
    if (!scene) {
        throw new Error('Viewer not initialized. Call init() first.');
    }

    if (mesh) {
        scene.remove(mesh);
    }

    // вычисляем границы модели
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.computeBoundingSphere();

    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    fitCameraToGeometry(geometry);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Располагает камеру так, чтобы модель полностью помещалась в кадр
function fitCameraToGeometry(geometry) {
    const radius = geometry.boundingSphere.radius;
    const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
}

export { THREE };
