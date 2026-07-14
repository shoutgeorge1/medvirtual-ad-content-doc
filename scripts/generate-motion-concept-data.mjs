/**
 * Sync Remotion default props from shared concept-lab data.
 * Used by generate:motion-lab / remotion renders.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildMotionDefaults, buildDefaultBatch, clientPayload } from './concept-lab-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'remotion', 'data', 'motionDefaults.js');
const JSON_OUT = path.join(ROOT, 'public', 'assets', 'concept-lab', 'motion-defaults.json');

const batch = buildDefaultBatch();
const motion = buildMotionDefaults(batch);
const payload = clientPayload();

const js = `/** Auto-generated from scripts/concept-lab-data.mjs — do not edit by hand */
export const MOTION_DEFAULTS = ${JSON.stringify(motion, null, 2)};

export const STATIC_BATCH = ${JSON.stringify(batch, null, 2)};

export const STORAGE_KEYS = ${JSON.stringify(payload.storageKeys, null, 2)};

export const STATUSES = ${JSON.stringify(payload.statuses, null, 2)};
`;

fs.writeFileSync(OUT, js);
fs.writeFileSync(JSON_OUT, JSON.stringify({ motion, staticBatch: batch, storageKeys: payload.storageKeys }, null, 2));
console.log('Remotion motion defaults written');
