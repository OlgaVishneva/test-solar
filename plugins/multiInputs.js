import { resolve } from 'path';
import fs from 'fs';

export function generateMultiInputs(root) {
  const entries = {};
  const files = fs.readdirSync(root);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '');
      entries[name] = resolve(root, file);
    }
  }
  return entries;
}

export default generateMultiInputs;
