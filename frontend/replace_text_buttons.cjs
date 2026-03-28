const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Update text buttons
  content = content.replace(
    /text-sm font-medium text-zinc-900 dark:text-white hover:underline transition-colors duration-500/g,
    'text-sm font-medium text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 active:scale-[0.98]'
  );
  
  content = content.replace(
    /text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500/g,
    'text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-300 active:scale-[0.98]'
  );

  fs.writeFileSync(filePath, content);
});

console.log('Text buttons updated');
