import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { getPageFile, loadPages, OUT_DIR } from './lib/pages.mjs';

// Пререндер: знімок готової сторінки для роботів, що не виконують JS
// (AI-краулери GPTBot, ClaudeBot, PerplexityBot; частково Bing; прев'ю
// месенджерів). Без нього в сирому HTML лише порожній #root.
// Скрипт відкриває кожну сторінку з getPageMetaMap (крім noIndex) у headless
// Chrome, чекає рендеру, прокручує до кінця (лінивий контент) і кладе вміст
// #root у її HTML — dist/<шлях>.html, який перед цим написав
// scripts/gen-pages.mjs. Людина знімка не бачить: обгортку [data-prerender]
// ховає inline-стиль index.html, а createRoot при старті замінює вміст #root.
//
// Нових залежностей немає: Chrome керується через CDP (WebSocket і fetch уже є
// в Node ≥ 22). Шлях до Chrome — CHROME_PATH або стандартні місця. Без Chrome
// збірка падає: інакше на прод тихо поїхав би сайт без контенту для роботів.
// Свідомо без пререндеру — SKIP_PRERENDER=1.

const SHELL_FILE = path.join(OUT_DIR, 'index.html');
const EMPTY_ROOT = '<div id="root"></div>';
// Сторінка вважається готовою, коли мережа мовчить стільки часу
const NETWORK_IDLE_MS = 800;
const PAGE_TIMEOUT_MS = 60000;

if (process.env.SKIP_PRERENDER === '1') {
  console.log('prerender: пропущено (SKIP_PRERENDER=1)');
  process.exit(0);
}

const findChrome = () => {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));

  if (!found) {
    throw new Error(
      'prerender: не знайдено Chrome. Вкажи CHROME_PATH або збирай з SKIP_PRERENDER=1 ' +
        '(тоді в сирому HTML не буде контенту для роботів без JS).'
    );
  }

  return found;
};

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

// Оболонка — HTML головної з gen-pages.mjs, поки в ньому ще порожній #root.
// Її сервер віддає на будь-яку адресу без розширення, як SPA-фолбек хостингу.
const shell = fs.readFileSync(SHELL_FILE, 'utf8');

if (!shell.includes(EMPTY_ROOT)) {
  throw new Error(
    `prerender: у ${SHELL_FILE} немає порожнього #root — запусти npm run build заново`
  );
}

const outDir = path.resolve(OUT_DIR);

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (!path.extname(urlPath)) {
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES['.html'] });
    res.end(shell);
    return;
  }

  const filePath = path.join(outDir, urlPath);

  if (
    !filePath.startsWith(outDir + path.sep) ||
    !fs.existsSync(filePath) ||
    !fs.statSync(filePath).isFile()
  ) {
    res.writeHead(404);
    res.end();
    return;
  }

  res.writeHead(200, {
    'Content-Type': CONTENT_TYPES[path.extname(filePath)] || 'application/octet-stream',
  });
  fs.createReadStream(filePath).pipe(res);
});

// Знімок #root: без того, чого робот не прочитає або що задвоїть текст —
// прихованих елементів (вимірювальні шари, мобільні й десктопні варіанти),
// aria-hidden, скриптів, canvas і svg (назви іконок-посилань — в aria-label);
// без class/style/data-*.
// Картинки — лише з alt, без src/srcset, відео — геть: інакше браузер ще до
// запуску React тягнув би всі картинки прихованого знімка (loading=lazy не
// рятує — сторінка без стилів довга) і забирав канал у JS. Роботам без JS
// потрібен текст.
const SNAPSHOT = `(() => {
  const marked = [];
  for (const el of document.querySelectorAll('#root *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || el.getAttribute('aria-hidden') === 'true') {
      el.setAttribute('data-prerender-drop', '');
      marked.push(el);
    } else if (style.display !== 'inline' && style.display !== 'contents') {
      // Рядки й слова, що на екрані стоять блоками, без стилів злиплися б в
      // одне слово, тож після кожного блока — пробіл
      el.setAttribute('data-prerender-block', '');
      marked.push(el);
    }
  }
  const clone = document.getElementById('root').cloneNode(true);
  marked.forEach((el) => {
    el.removeAttribute('data-prerender-drop');
    el.removeAttribute('data-prerender-block');
  });
  clone.querySelectorAll('[data-prerender-drop], script, style, canvas, svg, noscript, iframe, template').forEach((el) => el.remove());
  clone.querySelectorAll('[data-prerender-block]').forEach((el) => el.after(' '));
  // Заголовок, увесь видимий вміст якого під aria-hidden (окремі літери для
  // анімації появи), скрінрідер читає з aria-label; роботу віддаємо той самий
  // текст звичайним вмістом, а не порожній тег.
  clone.querySelectorAll('h1[aria-label], h2[aria-label], h3[aria-label], h4[aria-label], h5[aria-label], h6[aria-label]').forEach((el) => {
    if (el.textContent.trim()) return;
    el.textContent = el.getAttribute('aria-label');
    el.removeAttribute('aria-label');
  });
  for (const el of clone.querySelectorAll('*')) {
    for (const { name } of [...el.attributes]) {
      if (name === 'class' || name === 'style' || name.startsWith('data-') || name === 'tabindex') el.removeAttribute(name);
    }
    if (el.tagName === 'IMG') ['src', 'srcset', 'sizes', 'loading', 'fetchpriority'].forEach((name) => el.removeAttribute(name));
  }
  clone.querySelectorAll('source, video').forEach((el) => el.remove());
  return clone.innerHTML.replace(/<!--[\\s\\S]*?-->/g, '').replace(/\\s+/g, ' ');
})()`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connect = async (wsUrl) => {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let lastId = 0;
  const pending = new Map();
  const listeners = new Set();

  ws.onmessage = ({ data }) => {
    const message = JSON.parse(data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    } else if (message.method) {
      listeners.forEach((listener) => listener(message));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      lastId += 1;
      pending.set(lastId, { resolve, reject });
      ws.send(JSON.stringify({ id: lastId, method, params }));
    });

  return { send, on: (listener) => listeners.add(listener), close: () => ws.close() };
};

const evaluate = async (tab, expression) => {
  const { result, exceptionDetails } = await tab.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  }

  return result.value;
};

// Запити в дорозі рахуються за requestId і без відео. Медіа-завантажувач
// Chrome свідомо тримає запит відео відкритим (докачує буфер у міру
// відтворення), а запити відео сторінки, з якої йдемо, при переході
// обриваються без loadingFailed — лічильник-число застрягав назавжди (так
// пререндер падав у newsun2). Відео в знімок однаково не потрапляє.
const renderPage = async (tab, url) => {
  const inflight = new Set();
  const media = new Set();
  let lastActivity = Date.now();
  const onEvent = ({ method, params }) => {
    if (!method.startsWith('Network.')) return;
    if (method === 'Network.requestWillBeSent' && params.type === 'Media') media.add(params.requestId);
    if (media.has(params.requestId)) return;
    if (method === 'Network.requestWillBeSent') inflight.add(params.requestId);
    if (method === 'Network.loadingFinished' || method === 'Network.loadingFailed') inflight.delete(params.requestId);
    lastActivity = Date.now();
  };
  tab.on(onEvent);

  await tab.send('Page.navigate', { url });
  const started = Date.now();

  const waitIdle = async () => {
    while (inflight.size > 0 || Date.now() - lastActivity < NETWORK_IDLE_MS) {
      if (Date.now() - started > PAGE_TIMEOUT_MS) throw new Error(`prerender: ${url} не дочекався тиші мережі`);
      await sleep(100);
    }
  };

  await waitIdle();
  await evaluate(tab, `new Promise((resolve) => {
    const check = () => document.querySelector('#root main') ? resolve() : setTimeout(check, 100);
    check();
  })`);
  await evaluate(tab, 'document.fonts.ready.then(() => true)');
  await evaluate(tab, `(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    let still = 0;
    let last = -1;
    while (still < 4) {
      window.scrollBy(0, innerHeight * 0.8);
      await pause(120);
      still = scrollY === last ? still + 1 : 0;
      last = scrollY;
    }
    window.scrollTo(0, 0);
  })()`);
  await waitIdle();
  await sleep(500);

  return evaluate(tab, SNAPSHOT);
};

const { pages } = await loadPages();
const routes = pages.filter(({ tags }) => !tags.noIndex).map(({ path: pagePath }) => pagePath);

// Мова — з <html lang> сторінки: знімок для роботів — завжди мовою сайту за
// замовчуванням, а не мовою системи, де йде збірка.
const DEFAULT_LOCALE = shell.match(/<html lang="([^"]+)"/)?.[1] ?? 'uk';
const chromePath = findChrome();
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prerender-chrome-'));

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--mute-audio',
  // Мова сайту визначається за мовою браузера, а знімок для роботів — завжди
  // типовою мовою. Без прапорця Chrome узяв би мову системи, де йде збірка.
  `--accept-lang=${DEFAULT_LOCALE}`,
  '--remote-debugging-port=0',
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore' });

try {
  // Порт CDP Chrome пише у DevToolsActivePort профілю
  const portFile = path.join(profileDir, 'DevToolsActivePort');
  const waitStarted = Date.now();

  while (!fs.existsSync(portFile) || !fs.readFileSync(portFile, 'utf8').includes('\n')) {
    if (Date.now() - waitStarted > 20000) throw new Error('prerender: Chrome не запустився');
    await sleep(100);
  }

  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const tab = await connect(target.webSocketDebuggerUrl);

  await tab.send('Page.enable');
  await tab.send('Network.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  // Спершу всі знімки, потім запис: сервер віддає оболонку з dist/index.html,
  // і знімок головної не має потрапити в оболонку інших сторінок.
  const snapshots = [];

  for (const route of routes) {
    const html = await renderPage(tab, origin + route);

    if (!html.includes('<h1')) {
      throw new Error(`prerender: у знімку ${route} немає h1 — сторінка не відрендерилась`);
    }

    snapshots.push({ route, html });
    console.log(`prerender: ${route} — ${Math.round(html.length / 1024)} КБ`);
  }

  tab.close();

  for (const { route, html } of snapshots) {
    const file = getPageFile(route);
    const page = fs.readFileSync(file, 'utf8');

    if (!page.includes(EMPTY_ROOT)) {
      throw new Error(`prerender: у ${file} немає порожнього #root — запусти npm run build заново`);
    }

    fs.writeFileSync(
      file,
      page.replace(EMPTY_ROOT, `<div id="root"><div data-prerender>${html}</div></div>`)
    );
  }
} finally {
  chrome.kill();
  server.close();
  // Chrome відпускає файли профілю не одразу
  await sleep(500);
  try {
    fs.rmSync(profileDir, { recursive: true, force: true });
  } catch {
    // тимчасова тека, ОС прибере
  }
}
