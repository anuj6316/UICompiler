const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Primary buttons (Auth & Profile)
  content = content.replace(
    /bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 rounded-none font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-500 active:scale-\[0\.98\] disabled:opacity-70/g,
    'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none font-semibold border border-zinc-900 dark:border-white hover:bg-transparent hover:text-zinc-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none'
  );
  
  content = content.replace(
    /bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-900 rounded-none font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-500 active:scale-\[0\.98\] mt-6 disabled:opacity-70/g,
    'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none font-semibold border border-zinc-900 dark:border-white hover:bg-transparent hover:text-zinc-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98] mt-6 disabled:opacity-70 disabled:pointer-events-none'
  );

  fs.writeFileSync(filePath, content);
});

console.log('Button styles updated');
