const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const candidates = ['page.tsx','page.ts','page.jsx','page.js'];

function renameIfExists(filename) {
  const full = path.join(appDir, filename);
  if (!fs.existsSync(full)) return false;
  const disabled = path.join(appDir, filename + '.disabled');
  try {
    fs.renameSync(full, disabled);
    console.log(`Renamed ${full} -> ${disabled}`);
    return true;
  } catch (err) {
    console.error(`Failed to rename ${full}:`, err.message || err);
    return false;
  }
}

if (!fs.existsSync(appDir)) {
  console.log('No app/ directory found — nothing to do.');
  process.exit(0);
}

let any = false;
for (const c of candidates) {
  const ok = renameIfExists(c);
  any = any || ok;
}

if (!any) {
  console.log('No app/page.* files found to rename. If you want to keep the App Router, remove or rename pages/ instead.');
} else {
  console.log('App Router root disabled. Keep pages/ as the active router and restart Next.js.');
}
