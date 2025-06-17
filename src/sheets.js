// Модуль для отправки данных в Google Sheets через Apps Script
import { initConfig } from './calculator.js';

// Загружаем конфигурацию один раз при инициализации модуля
const configPromise = initConfig();

/**
 * Отправляет объект с данными в Google Sheets.
 * Адрес скрипта берётся из конфигурации (googleScriptUrl).
 */
export async function sendToSheets(data) {
    const config = await configPromise;
    if (!config.googleScriptUrl) return; // если URL не указан — ничего не делаем
    try {
        await fetch(config.googleScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (err) {
        console.error('Failed to send data to Google Sheets', err);
    }
}
