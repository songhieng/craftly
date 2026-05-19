import 'server-only';

import { readFileSync } from 'node:fs';
import path from 'node:path';

const prototypeDir = path.join(process.cwd(), 'public', 'prototypes');

export function readPrototypeHtml(fileName: 'ai-creative-cambodia.html' | 'sprint-board.html') {
  return readFileSync(path.join(prototypeDir, fileName), 'utf8');
}
