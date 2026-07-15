import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const dir = 'public/exports/wave1-first-launch/creatives';
const files = [
  'MV_VMA_33_SpanishNeverLost_4x5.png',
  'MV_VMA_34_BilingualFrontDesk_4x5.png',
  'MV_VMA_37_TrainedWorkflow_4x5.png',
  'MV_VMA_41_FrontDeskCapacity_4x5.png',
  'MV_VMA_43_ScheduleMoving_4x5.png',
];

function isPink(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 25) return false;
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h *= 60;
  if (h < 0) h += 360;
  const sat = (max - min) / max;
  return sat > 0.25 && h >= 290 && h <= 345;
}

for (const file of files) {
  const full = path.join(dir, file);
  const img = sharp(full);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  let pink = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (isPink(data[i], data[i + 1], data[i + 2])) pink += 1;
  }
  console.log(`${file} ${meta.width}x${meta.height} bytes=${fs.statSync(full).size} pinkPx=${pink}`);
}
