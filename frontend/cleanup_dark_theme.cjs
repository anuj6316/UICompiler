const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Clean up remaining shadows in dark mode
  content = content.replace(/dark:hover:shadow-zinc-900\/50/g, 'dark:hover:shadow-none');
  content = content.replace(/dark:shadow-white\/10/g, 'dark:shadow-none');
  
  // Clean up borders
  content = content.replace(/dark:border-zinc-900/g, 'dark:border-[#0a0a0a]'); // for images overlapping backgrounds
  content = content.replace(/dark:border-zinc-950/g, 'dark:border-black');
  content = content.replace(/dark:hover:border-zinc-800/g, 'dark:hover:border-white/20');
  content = content.replace(/dark:hover:border-zinc-700/g, 'dark:hover:border-white/30');

  // Clean up backgrounds
  content = content.replace(/dark:bg-zinc-800/g, 'dark:bg-white/5');
  content = content.replace(/dark:bg-zinc-900/g, 'dark:bg-[#0a0a0a]');
  
  // Clean up text
  content = content.replace(/dark:text-zinc-400/g, 'dark:text-zinc-400'); // already done, but just in case
  
  fs.writeFileSync(filePath, content);
});

console.log('Dark theme stragglers cleaned up');
