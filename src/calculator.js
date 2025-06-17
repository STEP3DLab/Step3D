// Здесь будет храниться загруженный конфиг с настройками приложения
let config;

/**
 * Загружает файл конфигурации и сохраняет его в переменную `config`.
 * Возвращает загруженные данные.
 */
export async function initConfig() {
    // загружаем конфиг, лежащий рядом в каталоге src
    const response = await fetch('./config.json');
    if (!response.ok) {
        // если файл не найден или произошла ошибка сети
        throw new Error('Failed to load config.json');
    }
    // сохраняем результат для дальнейшего использования
    config = await response.json();
    return config;
}

/**
 * Рассчитывает цену печати исходя из объёма модели и выбранного материала.
 * @param {Object} params
 * @param {number} params.volume_cm3 - объём модели в кубических сантиметрах
 * @param {string} params.material - ключ материала из конфигурации
 */
export function calcPrice({ volume_cm3, material }) {
    if (!config) {
        // функция предполагает, что конфиг уже загружен
        throw new Error('Config not initialized');
    }

    // ищем настройки для выбранного материала
    const materialCfg = config.materials[material];
    if (!materialCfg) {
        // если материала нет в конфиге
        throw new Error(`Unknown material: ${material}`);
    }

    // достаём параметры материала и общую стоимость часа работы
    const { density, priceKg } = materialCfg;
    const { laborRate } = config;
    // коэффициент заполнения детали (20%)
    const infill = 0.2;
    // вычисляем массу модели в граммах
    const mass = volume_cm3 * density * infill;
    // стоимость материала в рублях
    const materialCost = mass * (priceKg / 1000);
    // условное время печати пропорционально объёму
    const timeHrs = volume_cm3 * infill / 10;
    const labor = timeHrs * laborRate;
    // итоговая цена с наценкой 20%
    return Math.round((materialCost + labor) * 1.2);
}

export function formatPrice(rub) {
    return `${rub} ₽`;
}
