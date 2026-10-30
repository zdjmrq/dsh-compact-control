import { build } from 'esbuild';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const bundle = await build({ entryPoints: ['test/preview.jsx'], bundle: true, write: false, format: 'iife', platform: 'browser', define: { 'process.env.NODE_ENV': '"development"' } });
const js = bundle.outputFiles[0].contents;
const icon = await readFile(new URL('../icon.svg', import.meta.url));
const server = createServer((req, res) => {
  if (req.url === '/preview.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); res.end(js); }
  else if (req.url === '/icon.svg') { res.setHeader('Content-Type', 'image/svg+xml'); res.end(icon); }
  else { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>自动压缩阈值 · 插件详情预览</title><div id="root"></div><script src="/preview.js"></script></html>'); }
});
server.listen(47831, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:47831'));
