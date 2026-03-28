const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Make backgrounds darker
  content = content.replace(/dark:bg-zinc-950/g, 'dark:bg-black');
  content = content.replace(/dark:bg-zinc-900\/50/g, 'dark:bg-zinc-950/50');
  content = content.replace(/dark:bg-zinc-900/g, 'dark:bg-zinc-950');
  
  // Make borders more subtle in dark mode
  content = content.replace(/dark:border-zinc-800/g, 'dark:border-white/10');
  content = content.replace(/dark:border-zinc-700/g, 'dark:border-white/20');

  // Update text colors for better contrast
  content = content.replace(/dark:text-zinc-400/g, 'dark:text-zinc-500');
  content = content.replace(/dark:text-zinc-100/g, 'dark:text-white');

  fs.writeFileSync(filePath, content);
});

console.log('Dark theme updated');
