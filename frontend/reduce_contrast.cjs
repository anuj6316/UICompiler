const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'src/pages'), path.join(__dirname, 'src')];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Soften backgrounds
    content = content.replace(/dark:bg-black/g, 'dark:bg-zinc-950');
    content = content.replace(/dark:bg-\[\#0a0a0a\]/g, 'dark:bg-zinc-900');
    
    // Soften text
    content = content.replace(/dark:text-white/g, 'dark:text-zinc-100');
    content = content.replace(/dark:hover:text-white/g, 'dark:hover:text-zinc-100');
    
    // Soften borders
    content = content.replace(/dark:border-white\/10/g, 'dark:border-zinc-800');
    content = content.replace(/dark:border-white\/20/g, 'dark:border-zinc-700');
    content = content.replace(/dark:border-white\/30/g, 'dark:border-zinc-600');
    content = content.replace(/dark:hover:border-white\/20/g, 'dark:hover:border-zinc-700');
    content = content.replace(/dark:hover:border-white\/30/g, 'dark:hover:border-zinc-600');
    
    // Soften overlays and hovers
    content = content.replace(/dark:bg-white\/5/g, 'dark:bg-zinc-800/50');
    content = content.replace(/dark:hover:bg-white\/5/g, 'dark:hover:bg-zinc-800');
    
    // Primary buttons (were white background, now zinc-100)
    content = content.replace(/dark:bg-white(?![\/\w])/g, 'dark:bg-zinc-100');
    content = content.replace(/dark:border-white(?![\/\w])/g, 'dark:border-zinc-100');
    
    // Focus rings
    content = content.replace(/dark:focus:ring-white/g, 'dark:focus:ring-zinc-400');
    content = content.replace(/dark:peer-checked:bg-white/g, 'dark:peer-checked:bg-zinc-100');
    
    // Selection
    content = content.replace(/dark:selection:bg-white/g, 'dark:selection:bg-zinc-100');

    fs.writeFileSync(filePath, content);
  });
});

console.log('Contrast reduced in dark theme');
