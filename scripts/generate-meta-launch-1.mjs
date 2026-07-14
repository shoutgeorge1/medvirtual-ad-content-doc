/**
 * Legacy /meta-launch-1.html → Real People #ready
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const target = '/real-people-creative.html#ready';

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting · Real People Ready</title>
  <link rel="canonical" href="/real-people-creative.html" />
  <script>location.replace('${target}');</script>
</head>
<body>
  <p>Launch 1 merged into <a href="${target}">Real People → Ready</a>.</p>
</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'meta-launch-1.html'), html);
console.log('Wrote public/meta-launch-1.html (redirect → #ready)');
