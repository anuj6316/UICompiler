const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Improve text contrast on pure black backgrounds
  content = content.replace(/dark:text-zinc-500/g, 'dark:text-zinc-400');
  
  // 2. Remove muddy shadows in dark mode. 
  // The "Sculpted" aesthetic relies on crisp borders and solid shapes, not soft drop shadows which get lost on black.
  content = content.replace(/dark:shadow-sm/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-md/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-lg/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-xl/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-2xl/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-white\/10/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-zinc-900\/20/g, 'dark:shadow-none');
  content = content.replace(/dark:shadow-zinc-900\/50/g, 'dark:shadow-none');
  
  // 3. Refine hover states for a more premium glass/sculpted feel
  content = content.replace(/dark:hover:bg-zinc-900/g, 'dark:hover:bg-white/5');
  content = content.replace(/dark:hover:bg-zinc-800/g, 'dark:hover:bg-white/10');
  
  // 4. Ensure elevated surfaces have a very subtle distinction from the pure black canvas
  content = content.replace(/dark:bg-zinc-950/g, 'dark:bg-[#0a0a0a]');

  fs.writeFileSync(filePath, content);
});

console.log('Dark theme refined for sculpted aesthetic');
