const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Update sidebar buttons in Home.tsx
  content = content.replace(
    /text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white/g,
    'text-zinc-500 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white active:scale-[0.98]'
  );
  
  content = content.replace(
    /hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300/g,
    'border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.98]'
  );

  // Update the active state of sidebar buttons
  content = content.replace(
    /bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xl shadow-zinc-900\/20 dark:shadow-white\/10/g,
    'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white shadow-md'
  );

  fs.writeFileSync(filePath, content);
});

console.log('Sidebar buttons updated');
