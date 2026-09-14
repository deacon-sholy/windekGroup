/*
 * Regenerates style.min.css and script.min.js from source files.
 * Run with: npm run build  (or node build.js)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = __dirname;

async function main() {
  let CleanCSS;
  let terser;

  try {
    CleanCSS = require('clean-css');
  } catch (e) {
    process.stderr.write('Missing dependency "clean-css". Run: npm install\n');
    process.exit(1);
  }
  try {
    terser = require('terser');
  } catch (e) {
    process.stderr.write('Missing dependency "terser". Run: npm install\n');
    process.exit(1);
  }

  const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
  const minCss = new CleanCSS({ level: 2 }).minify(css);
  if (minCss.errors && minCss.errors.length) {
    throw new Error('clean-css errors:\n' + minCss.errors.join('\n'));
  }
  fs.writeFileSync(path.join(root, 'style.min.css'), minCss.styles);

  const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const minJs = await terser.minify(js, {
    compress: true,
    mangle: true,
    format: { comments: false }
  });
  if (minJs.error) throw minJs.error;
  fs.writeFileSync(path.join(root, 'script.min.js'), minJs.code);

  const cssSize = (f) => `${(fs.statSync(path.join(root, f)).size / 1024).toFixed(1)} KiB`;
  process.stdout.write(
    `OK  style.css        (${cssSize('style.css')}) -> style.min.css  (${cssSize('style.min.css')})\n` +
    `OK  script.js        (${cssSize('script.js')}) -> script.min.js  (${cssSize('script.min.js')})\n`
  );
}

main().catch(err => {
  process.stderr.write(err.stack || String(err));
  process.exit(1);
});