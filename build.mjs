import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const parts = readdirSync('src/parts')
  .filter((name) => name.startsWith('app-js-'))
  .sort();

const app = parts.map((name) => readFileSync(`src/parts/${name}`, 'utf8')).join('');
writeFileSync('app.js', app);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css']) {
  cpSync(file, `dist/${file}`);
}
console.log('FCC Ops production build created in dist/');
