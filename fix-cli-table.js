const fs = require('fs');
const path = require('path');

// Path to the utils.js file in cli-table3
const utilsPath = path.join(__dirname, 'node_modules', 'cli-table3', 'src', 'utils.js');

// Read the file
let content = fs.readFileSync(utilsPath, 'utf8');

// Replace the problematic import
content = content.replace(
  "var stringWidth = require('string-width');",
  "var stringWidth = require('string-width');\nif (typeof stringWidth !== 'function') { stringWidth = stringWidth.default; }"
);

// Write the file back
fs.writeFileSync(utilsPath, content, 'utf8');

console.log('Fixed cli-table3 utils.js');