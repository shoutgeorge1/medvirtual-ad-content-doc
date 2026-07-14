/**
 * Legacy /meta-launch-2.html → Real People #next
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');
const target = '/real-people-creative.html#next';

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting · Real People Next</title>
  <link rel="canonical" href="/real-people-creative.html" />
  <script>location.replace('${target}');</script>
</head>
<body>
  <p>Launch 2 merged into <a href="${target}">Real People → Next</a>.</p>
</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'meta-launch-2.html'), html);
console.log('Wrote public/meta-launch-2.html (redirect → #next)');
