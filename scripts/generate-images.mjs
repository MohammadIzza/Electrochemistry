/**
 * Creates the resized WebP variants used by responsive images.
 *
 * For every image under public/media (except public/media/styles) this writes
 * public/media/styles/<width>w/public/<path>.webp for each width that is missing.
 * Existing variants are left untouched, so running it again is cheap.
 *
 *   npm run images
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MEDIA = path.join(process.cwd(), 'public', 'media');
const STYLES = path.join(MEDIA, 'styles');
const WIDTHS = [200, 300, 400, 600, 900, 1200, 1800, 2400];
const IMAGE = /\.(jpe?g|png|webp|gif)$/i;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== STYLES) yield* walk(full);
    } else if (IMAGE.test(entry.name)) {
      yield full;
    }
  }
}

let created = 0;
for (const file of walk(MEDIA)) {
  const rel = path.relative(MEDIA, file);
  const { width: original = 0 } = await sharp(file).metadata();
  for (const width of WIDTHS) {
    const out = path.join(STYLES, `${width}w`, 'public', `${rel}.webp`);
    if (fs.existsSync(out)) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(file)
      .resize({ width: Math.min(width, original || width), withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    created++;
  }
}
console.log(`Created ${created} image variant(s).`);
