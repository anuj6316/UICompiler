const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove shadow-sm in dark mode for inputs
  content = content.replace(/shadow-sm rounded-none/g, 'shadow-sm dark:shadow-none rounded-none');
  
  fs.writeFileSync(filePath, content);
});

console.log('Input shadows cleaned up');
