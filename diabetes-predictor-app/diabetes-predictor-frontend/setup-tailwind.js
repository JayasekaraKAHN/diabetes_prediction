import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .vscode directory if it doesn't exist
const vscodeDir = path.join(__dirname, '.vscode');
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir);
}

// Create settings.json
const settings = {
  "css.validate": true,
  "scss.validate": true,
  "less.validate": true,
  "editor.quickSuggestions": {
    "strings": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.inlineSuggest.enabled": true
};

fs.writeFileSync(
  path.join(vscodeDir, 'settings.json'),
  JSON.stringify(settings, null, 2)
);

console.log('VS Code settings configured for Tailwind CSS');