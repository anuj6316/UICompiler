const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'src/pages'), path.join(__dirname, 'src')];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace any remaining pure white text/bg/border in dark mode with zinc-100
    content = content.replace(/dark:text-white/g, 'dark:text-zinc-100');
    content = content.replace(/dark:bg-white(?![\/\w])/g, 'dark:bg-zinc-100');
    content = content.replace(/dark:border-white(?![\/\w])/g, 'dark:border-zinc-100');
    content = content.replace(/dark:group-hover:bg-white(?![\/\w])/g, 'dark:group-hover:bg-zinc-100');
    content = content.replace(/dark:group-hover:text-white/g, 'dark:group-hover:text-zinc-100');
    content = content.replace(/dark:hover:bg-white(?![\/\w])/g, 'dark:hover:bg-zinc-100');
    content = content.replace(/dark:hover:text-white/g, 'dark:hover:text-zinc-100');
    content = content.replace(/dark:peer-checked:bg-white(?![\/\w])/g, 'dark:peer-checked:bg-zinc-100');
    content = content.replace(/dark:selection:bg-white(?![\/\w])/g, 'dark:selection:bg-zinc-100');
    
    // Also replace pure black backgrounds with zinc-950
    content = content.replace(/dark:bg-black(?![\/\w])/g, 'dark:bg-zinc-950');

    fs.writeFileSync(filePath, content);
  });
});

console.log('Remaining pure white/black colors softened in dark theme');
