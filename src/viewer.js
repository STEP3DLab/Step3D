import { loadFile } from './fileManager.js';
import { calculateCost } from './calculator.js';
import config from './config.json' assert { type: 'json' };

console.log('Viewer initialized');
console.log('Current material prices:', config.prices);

// Example usage
// loadFile('path/to/model.stl').then(model => {
//     const cost = calculateCost(model);
//     console.log('Model cost', cost);
// });
