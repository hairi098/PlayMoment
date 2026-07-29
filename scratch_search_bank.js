const fs = require('fs');
const path = require('path');

function searchFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let found = false;
  lines.forEach((line, idx) => {
    if (line.includes('logoBank') || line.includes('bca') || line.includes('Bank') || line.includes('Gift')) {
      if (!found) {
        console.log(`\n=== File: ${filePath} ===`);
        found = true;
      }
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
}

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.vue') || file.endsWith('.js') || file.endsWith('.ts')) {
      searchFile(fullPath);
    }
  });
}

walkDir(path.join(__dirname, 'app'));
