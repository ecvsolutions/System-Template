#!/usr/bin/env node
/**
 * Playwright page capture.
 *
 * Saves, for one URL and one or more viewports:
 *   <out>/<viewport>/page.html        rendered DOM (after JS has run)
 *   <out>/<viewport>/screenshot.png   full-page screenshot
 *   <out>/<viewport>/layout.json      every element: tag, box, key computed styles
 *   <out>/<viewport>/requests.json    every network request and its status
 *   <out>/<viewport>/assets/          css / js / images / fonts / media bodies
 *
 * Usage:
 *   node capture.js <url> [--out dir] [--viewports desktop,tablet,mobile]
 *                   [--scale 2] [--wait 1500] [--no-assets] [--no-layout]
 *
 * Only use on sites you own or have permission to study.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Playwright is preinstalled in this environment. Fall back to the global path.
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  ({ chromium } = require('/opt/node-tools/node_modules/playwright'));
}

const PRESETS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024, isMobile: false },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

// Computed styles worth keeping for layout/visual reproduction.
const STYLE_PROPS = [
  'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index',
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'margin', 'padding', 'gap', 'flex-direction', 'justify-content', 'align-items',
  'grid-template-columns', 'grid-template-rows',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'color', 'background-color', 'background-image',
  'border', 'border-radius', 'box-shadow', 'opacity', 'overflow',
];

function parseArgs(argv) {
  const args = { url: null, out: null, viewports: ['desktop'], scale: 2, wait: 1500, assets: true, layout: true };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--out') args.out = rest[++i];
    else if (a === '--viewports') args.viewports = rest[++i].split(',').map((s) => s.trim());
    else if (a === '--scale') args.scale = Number(rest[++i]);
    else if (a === '--wait') args.wait = Number(rest[++i]);
    else if (a === '--no-assets') args.assets = false;
    else if (a === '--no-layout') args.layout = false;
    else if (!args.url) args.url = a;
    else throw new Error(`Unknown argument: ${a}`);
  }
  if (!args.url) {
    console.error('Usage: node capture.js <url> [--out dir] [--viewports desktop,tablet,mobile] [--scale 2] [--wait 1500] [--no-assets] [--no-layout]');
    process.exit(1);
  }
  for (const v of args.viewports) {
    if (!PRESETS[v]) throw new Error(`Unknown viewport "${v}". Use: ${Object.keys(PRESETS).join(', ')}`);
  }
  if (!args.out) {
    const host = new URL(args.url).hostname.replace(/[^a-z0-9.-]/gi, '_');
    args.out = path.join(process.cwd(), 'captures', host);
  }
  return args;
}

function safeName(url) {
  const u = new URL(url);
  const base = (u.pathname.split('/').pop() || 'index').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60);
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
  return `${hash}-${base}`;
}

async function captureViewport(browser, args, name) {
  const dir = path.join(args.out, name);
  const assetsDir = path.join(dir, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  if (args.assets) fs.mkdirSync(assetsDir, { recursive: true });

  const preset = PRESETS[name];
  const context = await browser.newContext({
    viewport: { width: preset.width, height: preset.height },
    isMobile: !!preset.isMobile,
    hasTouch: !!preset.hasTouch,
    deviceScaleFactor: args.scale,
    userAgent: undefined,
  });
  const page = await context.newPage();

  const requests = [];
  const saved = [];
  const ASSET_TYPES = new Set(['stylesheet', 'script', 'image', 'font', 'media']);

  page.on('requestfinished', async (req) => {
    try {
      const res = await req.response();
      requests.push({
        url: req.url(),
        type: req.resourceType(),
        method: req.method(),
        status: res ? res.status() : null,
        mimeType: res ? (await res.headerValue('content-type')) || null : null,
      });
      if (!args.assets || !res || !ASSET_TYPES.has(req.resourceType())) return;
      const body = await res.body();
      const file = path.join(assetsDir, `${req.resourceType()}-${safeName(req.url())}`);
      fs.writeFileSync(file, body);
      saved.push({ url: req.url(), file: path.relative(dir, file) });
    } catch (e) {
      // Some bodies are unavailable (redirects, aborted, streaming). Skip them.
    }
  });
  page.on('requestfailed', (req) => {
    requests.push({ url: req.url(), type: req.resourceType(), failed: req.failure() ? req.failure().errorText : 'unknown' });
  });

  await page.goto(args.url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(args.wait);

  // Scroll once to trigger lazy-loaded images and sections, then return to top.
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle').catch(() => {});

  fs.writeFileSync(path.join(dir, 'page.html'), await page.content());
  await page.screenshot({ path: path.join(dir, 'screenshot.png'), fullPage: true });

  if (args.layout) {
    const layout = await page.evaluate((props) => {
      const out = [];
      const walk = (el, depth) => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const styles = {};
        for (const p of props) styles[p] = cs.getPropertyValue(p);
        out.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          classes: el.className && typeof el.className === 'string' ? el.className : undefined,
          depth,
          text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 120) : undefined,
          box: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
          styles,
        });
        for (const child of el.children) walk(child, depth + 1);
      };
      walk(document.documentElement, 0);
      return out;
    }, STYLE_PROPS);
    fs.writeFileSync(path.join(dir, 'layout.json'), JSON.stringify(layout, null, 2));
  }

  fs.writeFileSync(path.join(dir, 'requests.json'), JSON.stringify(requests, null, 2));
  if (args.assets) fs.writeFileSync(path.join(assetsDir, 'index.json'), JSON.stringify(saved, null, 2));

  await context.close();
  return { name, files: dir, requests: requests.length, assets: saved.length };
}

async function main() {
  const args = parseArgs(process.argv);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  try {
    for (const v of args.viewports) {
      const result = await captureViewport(browser, args, v);
      console.log(`[${result.name}] ${result.files}  requests=${result.requests} assets=${result.assets}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Capture failed:', err.message);
  process.exit(1);
});
