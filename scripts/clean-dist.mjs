import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const distPath = fileURLToPath(new URL('../dist/', import.meta.url));
const projectRoot = fileURLToPath(new URL('../', import.meta.url));

if (!distPath.startsWith(projectRoot)) {
  throw new Error(`Refusing to clean outside project root: ${distPath}`);
}

await rm(distPath, { recursive: true, force: true });
