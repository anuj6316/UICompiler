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

  // Secondary buttons (Auth Google/Github)
  content = content.replace(
    /bg-white dark:bg-zinc-950 border border-black\/5 dark:border-white\/10 text-zinc-900 dark:text-white rounded-none font-semibold shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-500 active:scale-\[0\.98\]/g,
    'bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-none font-semibold hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.98]'
  );

  // Icon buttons (Theme toggle, close, etc.)
  content = content.replace(
    /p-2 rounded-none hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500/g,
    'p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.96]'
  );
  
  content = content.replace(
    /p-2 -ml-2 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500/g,
    'p-2 -ml-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.96]'
  );
  
  content = content.replace(
    /p-2 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-500/g,
    'p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.96]'
  );

  // Home page "New Project" button
  content = content.replace(
    /bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-md/g,
    'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none text-sm font-semibold border border-zinc-900 dark:border-white hover:bg-transparent hover:text-zinc-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98]'
  );

  // Profile page specific buttons
  content = content.replace(
    /flex-1 py-3\.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-70/g,
    'flex-1 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-none font-semibold border border-zinc-900 dark:border-white hover:bg-transparent hover:text-zinc-900 dark:hover:text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none'
  );

  content = content.replace(
    /flex-1 py-3\.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-none font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-300/g,
    'flex-1 py-3.5 bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-none font-semibold hover:border-zinc-900 dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300 active:scale-[0.98]'
  );

  fs.writeFileSync(filePath, content);
});

console.log('Button styles updated');
