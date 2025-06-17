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

export { handleFile };
