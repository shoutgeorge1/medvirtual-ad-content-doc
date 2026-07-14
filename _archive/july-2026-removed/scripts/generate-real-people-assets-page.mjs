/**
 * Legacy /real-people-assets.html → redirect into the combined Real People page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=/real-people-creative.html#downloads" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting · Real People</title>
  <link rel="canonical" href="/real-people-creative.html" />
  <script>location.replace('/real-people-creative.html#downloads');</script>
</head>
<body>
  <p>Real People Assets merged into <a href="/real-people-creative.html#downloads">Real People</a>.</p>
</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'real-people-assets.html'), html);
console.log('Wrote public/real-people-assets.html (redirect)');
