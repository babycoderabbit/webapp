const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let totalReplacements = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace border-4 and border-2 with border (1px)
  content = content.replace(/\bborder-4\b/g, 'border');
  content = content.replace(/\bborder-2\b/g, 'border');
  
  // Also reduce hard shadows to a modern subtle shadow if they exist
  content = content.replace(/shadow-\[4px_4px_0_0_#000000\]/g, 'shadow-lg');
  content = content.replace(/shadow-\[8px_8px_0_0_#000000\]/g, 'shadow-xl');
  
  // Replace black borders with subtle borders where appropriate? No, just keep border-black or border-border
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    totalReplacements++;
  }
});

console.log(`Updated ${totalReplacements} files to reduce borders.`);
