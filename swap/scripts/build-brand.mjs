/**
 * Génère src/components/brand/svg-sources.ts à partir des SVG officiels
 * de assets/brand/. À relancer après toute mise à jour des logos :
 *   npm run brand:build
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'assets', 'brand');
const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();

const entries = files.map((f) => {
  const key = f.replace(/\.svg$/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const xml = readFileSync(join(dir, f), 'utf8').trim();
  return `  ${key}: ${JSON.stringify(xml)},`;
});

writeFileSync(
  join(root, 'src', 'components', 'brand', 'svg-sources.ts'),
  `// Fichier généré par scripts/build-brand.mjs — ne pas modifier à la main.\n` +
    `// Source : SVG officiels de assets/brand/.\n` +
    `export const BRAND_SVG = {\n${entries.join('\n')}\n} as const;\n\n` +
    `export type BrandSvgKey = keyof typeof BRAND_SVG;\n`,
);
console.log(`svg-sources.ts : ${files.length} logos`);
