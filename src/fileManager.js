import { loadMesh } from './viewer.js';
import { STLLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/OBJLoader.js';
import { initConfig, calcPrice, formatPrice } from './calculator.js';
import { sendToSheets } from './sheets.js';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const configReady = initConfig();

export async function loadFile(path) {
    console.log(`Loading file: ${path}`);
}

export function init(inputId, dropZoneId) {
    const input = document.getElementById(inputId);
    const dropZone = document.getElementById(dropZoneId);

    if (input) {
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleFile(file);
                input.value = '';
            }
        });
    }

    if (dropZone) {
        ['dragover', 'dragenter'].forEach(type => {
            dropZone.addEventListener(type, (e) => {
                e.preventDefault();
            });
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        });
    }
}

export async function handleFile(file) {
    clearError();
    const extension = file.name.split('.').pop().toLowerCase();

    if (!['stl', 'obj'].includes(extension)) {
        showError('Неподдерживаемый формат файла');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        showError('Файл слишком большой');
        return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
        let geometry;
        if (extension === 'stl') {
            const loader = new STLLoader();
            geometry = loader.parse(event.target.result);
        } else if (extension === 'obj') {
            const loader = new OBJLoader();
            const object = loader.parse(event.target.result);
            const mesh = object.children.find((child) => child.isMesh);
            if (mesh) {
                geometry = mesh.geometry;
            }
        }

        if (geometry) {
            const scaleInput = document.getElementById('scaleFactor');
            const scale = parseFloat(scaleInput?.value) || 1;
            geometry.scale(scale, scale, scale);

            loadMesh(geometry);
            const volume = computeVolume(geometry);

            const materialSelect = document.getElementById('material');
            const material = materialSelect ? materialSelect.value : 'PLA';

            await configReady;
            const price = calcPrice({ volume_cm3: volume, material });
            updateResult(volume, price);
            sendToSheets({ volume_cm3: volume, price, material });
        } else {
            showError('Не удалось загрузить модель');
        }
    };

    if (extension === 'stl') {
        reader.readAsArrayBuffer(file);
    } else if (extension === 'obj') {
        reader.readAsText(file);
    } else {
        console.error('Unsupported file format:', extension);
    }
}

function computeVolume(geometry) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const pos = g.attributes.position.array;
    let volume = 0;
    for (let i = 0; i < pos.length; i += 9) {
        const ax = pos[i], ay = pos[i + 1], az = pos[i + 2];
        const bx = pos[i + 3], by = pos[i + 4], bz = pos[i + 5];
        const cx = pos[i + 6], cy = pos[i + 7], cz = pos[i + 8];
        volume += ax * (by * cz - bz * cy) +
                  ay * (bz * cx - bx * cz) +
                  az * (bx * cy - by * cx);
    }
    const mm3 = Math.abs(volume) / 6.0;
    return mm3 / 1000.0; // convert to cm^3
}

function updateResult(volumeCm3, priceRub) {
    const volEl = document.getElementById('volume');
    const priceEl = document.getElementById('price');
    if (volEl) volEl.textContent = `Объём: ${volumeCm3.toFixed(2)} см³`;
    if (priceEl) priceEl.textContent = `Стоимость: ${formatPrice(priceRub)}`;
}

function showError(msg) {
    const errEl = document.getElementById('error');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
    }
}

function clearError() {
    const errEl = document.getElementById('error');
    if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
    }
}

export { handleFile };
