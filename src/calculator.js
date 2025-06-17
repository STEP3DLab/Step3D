let config;

export async function initConfig() {
    const response = await fetch('./config.json');
    if (!response.ok) {
        throw new Error('Failed to load config.json');
    }
    config = await response.json();
    return config;
}

export function calcPrice({ volume_cm3, material }) {
    if (!config) {
        throw new Error('Config not initialized');
    }

    const materialCfg = config.materials[material];
    if (!materialCfg) {
        throw new Error(`Unknown material: ${material}`);
    }

    const { density, priceKg } = materialCfg;
    const { laborRate } = config;
    const infill = 0.2;
    const mass = volume_cm3 * density * infill;
    const materialCost = mass * (priceKg / 1000);
    const timeHrs = volume_cm3 * infill / 10;
    const labor = timeHrs * laborRate;
    return Math.round((materialCost + labor) * 1.2);
}

export function formatPrice(rub) {
    return `${rub} ₽`;
}
