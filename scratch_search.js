const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'pages', 'edit-undangan', '[slug].vue');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const keywords = ['BroadcastChannel', 'saveEditorSnapshot', 'watch', 'preview', 'debounce'];
  console.log(`=== Searching in ${filePath} ===`);
  lines.forEach((line, idx) => {
    const matched = keywords.filter(kw => line.toLowerCase().includes(kw.toLowerCase()));
    if (matched.length > 0) {
      console.log(`${idx + 1} [${matched.join(',')}]: ${line.trim()}`);
    }
  });
} else {
  console.log('File not found:', filePath);
}

