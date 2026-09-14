const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join('img', '_src');
const targets = [
  { name: 'hero-oil',       w: 1600, h: 900 },
  { name: 'hero-energy',    w: 1600, h: 900 },
  { name: 'hero-logistics', w: 1600, h: 900 },
  { name: 'hero-fisheries', w: 1600, h: 900 },
  { name: 'about',          w: 1000, h: 750 },
  { name: 'div-oilgas',     w: 1200, h: 900 },
  { name: 'div-energy',     w: 1200, h: 900 },
  { name: 'div-logistics',  w: 1200, h: 900 },
  { name: 'div-food',       w: 1200, h: 900 },
  { name: 'proj-coldchain', w: 900,  h: 450 },
  { name: 'proj-freight',   w: 900,  h: 450 },
  { name: 'proj-solar',     w: 900,  h: 450 },
  { name: 'proj-fish',      w: 900,  h: 450 },
];

(async () => {
  const total = targets.length;
  let done = 0;
  for (const t of targets) {
    const inFile = path.join(srcDir, `${t.name}.jpg`);
    const outFile = path.join('img', `${t.name}.webp`);
    if (!fs.existsSync(inFile)) { console.log('MISS', t.name); done++; continue; }
    await sharp(inFile)
      .resize(t.w, t.h, { fit: 'cover', position: 'centre' })
      .webp({ quality: 78 })
      .toFile(outFile);
    const bytes = fs.statSync(outFile).size;
    done++;
    console.log(`ok    ${t.name}.webp (${(bytes / 1024).toFixed(1)} KB) ${done}/${total}`);
  }
})().catch(e => { console.error(e); process.exit(1); });