const fs = require('fs');
const path = require('path');

function processFile(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const output = [];
  let state = 'normal';
  for (const line of lines) {
    if (state === 'normal') {
      if (line.startsWith('<<<<<<< ')) {
        state = 'keep';
        continue; // skip marker
      }
      output.push(line);
    } else if (state === 'keep') {
      if (line.startsWith('=======')) {
        state = 'skip';
        continue; // skip separator
      }
      output.push(line);
    } else if (state === 'skip') {
      if (line.startsWith('>>>>>>> ')) {
        state = 'normal';
        continue; // skip end marker
      }
      // skip remote lines
    }
  }
  fs.writeFileSync(file, output.join('\n'), 'utf8');
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx|js)$/i.test(entry.name)) {
      const text = fs.readFileSync(p, 'utf8');
      if (text.includes('<<<<<<< ')) {
        processFile(p);
        console.log('resolved', p);
      }
    }
  }
}

walk('.'); 