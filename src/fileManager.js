import { loadMesh } from './viewer.js';
import { STLLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/OBJLoader.js';

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

export function handleFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (event) => {
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
            loadMesh(geometry);
            const volume = computeVolume(geometry);
            const price = estimatePlaCost(volume);
            updateResult(volume, price);
        } else {
            console.error('Unsupported file format:', extension);
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

function estimatePlaCost(volumeCm3) {
    const density = 1.24; // g/cm^3
    const priceKg = 2000; // RUB per kg
    const infill = 0.2;
    const laborRate = 200; // RUB per hour

    const mass = volumeCm3 * density * infill; // in grams
    const material = (mass / 1000) * priceKg;
    const timeHours = (volumeCm3 * infill) / 10; // very rough estimate
    const labor = timeHours * laborRate;
    return Math.round(material + labor);
}

function updateResult(volumeCm3, priceRub) {
    const volEl = document.getElementById('volume');
    const priceEl = document.getElementById('price');
    if (volEl) volEl.textContent = `Объём: ${volumeCm3.toFixed(2)} см³`;
    if (priceEl) priceEl.textContent = `Стоимость: ${priceRub} ₽`;
}

export { handleFile };
