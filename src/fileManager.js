// Работа с файлами моделей и расчётом стоимости
import { loadMesh } from './viewer.js';
// Загрузчики STL и OBJ из CDN Three.js
import { STLLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.152.2/examples/jsm/loaders/OBJLoader.js';
// Функции калькулятора и отправки данных
import { initConfig, calcPrice, formatPrice } from './calculator.js';
import { sendToSheets } from './sheets.js';

// Максимальный размер загружаемого файла (50 МБ)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
// Промис загрузки конфигурации, чтобы не делать это каждый раз
const configReady = initConfig();

// Загружает файл по ссылке (не используется напрямую)
export async function loadFile(path) {
    clearError();
    try {
        const res = await fetch(path);
        if (!res.ok) {
            showError('Не удалось загрузить файл');
            return;
        }
        const blob = await res.blob();
        const name = path.split('/').pop() || 'model';
        const file = new File([blob], name);
        await handleFile(file);
    } catch (err) {
        console.error('Failed to load remote file', err);
        showError('Ошибка загрузки файла');
    }
}

/**
 * Инициализирует обработчики для поля выбора файла и зоны перетаскивания.
 */
export function init(inputId, dropZoneId) {
    const input = document.getElementById(inputId);
    const dropZone = document.getElementById(dropZoneId);

    // если найден элемент input, подписываемся на событие выбора файла
    if (input) {
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                handleFile(file);
                // очищаем поле, чтобы можно было выбрать тот же файл снова
                input.value = '';
            }
        });
    }

    // настройка области перетаскивания файла
    if (dropZone) {
        ['dragover', 'dragenter'].forEach(type => {
            dropZone.addEventListener(type, (e) => {
                e.preventDefault(); // не даём браузеру открыть файл
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

/**
 * Читает выбранный пользователем файл и передаёт его на обработку.
 */
export async function handleFile(file) {
    clearError();
    const extension = file.name.split('.').pop().toLowerCase(); // расширение файла

    // поддерживаются только STL и OBJ
    if (!['stl', 'obj'].includes(extension)) {
        showError('Неподдерживаемый формат файла');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        showError('Файл слишком большой');
        return;
    }

    const reader = new FileReader();

    // после чтения файла парсим его содержимое
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
            // масштабирование модели по введённому коэффициенту
            const scaleInput = document.getElementById('scaleFactor');
            const scale = parseFloat(scaleInput?.value) || 1;
            geometry.scale(scale, scale, scale);

            // отображаем модель в окне просмотра
            loadMesh(geometry);
            const volume = computeVolume(geometry);

            const materialSelect = document.getElementById('material');
            const material = materialSelect ? materialSelect.value : 'PLA';

            await configReady; // дожидаемся готовности конфига
            const price = calcPrice({ volume_cm3: volume, material });
            updateResult(volume, price); // выводим результат пользователю
            sendToSheets({ volume_cm3: volume, price, material });
        } else {
            showError('Не удалось загрузить модель');
        }
    };

    if (extension === 'stl') {
        // STL читается как бинарный массив
        reader.readAsArrayBuffer(file);
    } else if (extension === 'obj') {
        // OBJ представляет собой текстовый формат
        reader.readAsText(file);
    } else {
        console.error('Unsupported file format:', extension);
    }
}

// Подсчёт объёма модели на основе её геометрии
function computeVolume(geometry) {
    // преобразуем геометрию к неиндексированному виду, чтобы удобнее идти по
    // вершинам
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const pos = g.attributes.position.array;
    let volume = 0;
    // перебираем вершины треугольников по три координаты
    for (let i = 0; i < pos.length; i += 9) {
        const ax = pos[i], ay = pos[i + 1], az = pos[i + 2];
        const bx = pos[i + 3], by = pos[i + 4], bz = pos[i + 5];
        const cx = pos[i + 6], cy = pos[i + 7], cz = pos[i + 8];
        // используем формулу вычисления объёма тетраэдров
        volume += ax * (by * cz - bz * cy) +
                  ay * (bz * cx - bx * cz) +
                  az * (bx * cy - by * cx);
    }
    // получаем объём в мм^3, затем переводим в см^3
    const mm3 = Math.abs(volume) / 6.0;
    return mm3 / 1000.0; // convert to cm^3
}

// Обновляет текстовые поля с рассчитанным объёмом и ценой
function updateResult(volumeCm3, priceRub) {
    const volEl = document.getElementById('volume');
    const priceEl = document.getElementById('price');
    if (volEl) volEl.textContent = `Объём: ${volumeCm3.toFixed(2)} см³`;
    if (priceEl) priceEl.textContent = `Стоимость: ${formatPrice(priceRub)}`;
}

// Показывает сообщение об ошибке пользователю
function showError(msg) {
    const errEl = document.getElementById('error');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
    }
}

// Скрывает и очищает текст ошибки
function clearError() {
    const errEl = document.getElementById('error');
    if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
    }
}

export { handleFile };
