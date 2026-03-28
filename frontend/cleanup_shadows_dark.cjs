const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add dark:shadow-none after shadow-sm if not present
  content = content.replace(/shadow-sm(?! dark:shadow-none)/g, 'shadow-sm dark:shadow-none');
  content = content.replace(/shadow-md(?! dark:shadow-none)/g, 'shadow-md dark:shadow-none');
  content = content.replace(/shadow-lg(?! dark:shadow-none)/g, 'shadow-lg dark:shadow-none');
  content = content.replace(/shadow-xl(?! dark:shadow-none)/g, 'shadow-xl dark:shadow-none');
  content = content.replace(/shadow-2xl(?! dark:shadow-none)/g, 'shadow-2xl dark:shadow-none');
  
  fs.writeFileSync(filePath, content);
});

console.log('Shadows cleaned up in dark mode');
