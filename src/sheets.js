import { initConfig } from './calculator.js';

const configPromise = initConfig();

export async function sendToSheets(data) {
    const config = await configPromise;
    if (!config.googleScriptUrl) return;
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
