const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'src/pages'), path.join(__dirname, 'src')];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Base Backgrounds (Zinc-950 is #09090b, the modern standard)
    content = content.replace(/dark:bg-zinc-950/g, 'dark:bg-[#09090B]');
    content = content.replace(/dark:from-zinc-950/g, 'dark:from-[#09090B]');
    content = content.replace(/dark:via-zinc-950/g, 'dark:via-[#09090B]');
    
    // 2. Surfaces (Cards, Panels, Dropdowns) - Use translucent white for elevation
    content = content.replace(/dark:bg-zinc-900\/50/g, 'dark:bg-white/[0.02]');
    content = content.replace(/dark:bg-zinc-900(?![\/\]])/g, 'dark:bg-white/[0.02]');
    content = content.replace(/dark:bg-zinc-800\/50/g, 'dark:bg-white/[0.04]');
    content = content.replace(/dark:bg-zinc-800(?![\/\]])/g, 'dark:bg-white/[0.04]');
    
    // 3. Borders (Translucent edges instead of solid grays)
    content = content.replace(/dark:border-zinc-800/g, 'dark:border-white/[0.05]');
    content = content.replace(/dark:border-zinc-700/g, 'dark:border-white/[0.08]');
    content = content.replace(/dark:border-zinc-600/g, 'dark:border-white/[0.12]');
    content = content.replace(/dark:border-zinc-950/g, 'dark:border-[#09090B]');
    content = content.replace(/dark:hover:border-zinc-700/g, 'dark:hover:border-white/[0.1]');
    content = content.replace(/dark:hover:border-zinc-600/g, 'dark:hover:border-white/[0.15]');
    
    // 4. Hover States
    content = content.replace(/dark:hover:bg-zinc-800/g, 'dark:hover:bg-white/[0.06]');
    content = content.replace(/dark:hover:bg-zinc-900/g, 'dark:hover:bg-white/[0.04]');
    content = content.replace(/dark:group-hover:bg-zinc-900/g, 'dark:group-hover:bg-white/[0.04]');
    
    // 5. Typography (Softer white to reduce astigmatism halation)
    content = content.replace(/dark:text-zinc-100/g, 'dark:text-zinc-200');
    
    // 6. Primary Actions (High contrast inverted)
    content = content.replace(/dark:bg-zinc-100/g, 'dark:bg-white');
    content = content.replace(/dark:text-zinc-900/g, 'dark:text-black');
    content = content.replace(/dark:border-zinc-100/g, 'dark:border-white/[0.1]');
    content = content.replace(/dark:hover:text-zinc-900/g, 'dark:hover:text-black');
    content = content.replace(/dark:group-hover:text-zinc-900/g, 'dark:group-hover:text-black');
    content = content.replace(/dark:group-hover:bg-zinc-100/g, 'dark:group-hover:bg-white');
    content = content.replace(/dark:hover:bg-zinc-100/g, 'dark:hover:bg-white');
    content = content.replace(/dark:selection:bg-zinc-100/g, 'dark:selection:bg-white/20');
    content = content.replace(/dark:selection:text-zinc-900/g, 'dark:selection:text-white');

    // 7. Focus Rings
    content = content.replace(/dark:focus:ring-zinc-400/g, 'dark:focus:ring-white/20');

    fs.writeFileSync(filePath, content);
  });
});

console.log('Modern dark theme applied');
