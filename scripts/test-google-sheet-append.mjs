/**
 * POSTs a test change order to your Apps Script Web App → appendRow on Sheet1.
 *
 *   npm run test:sheet
 *   npm run test:sheet -- 'https://script.google.com/macros/s/XXXX/exec'
 *
 * URL: .env `VITE_CHANGE_ORDER_APPS_SCRIPT_URL`, or first CLI argument.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadDotEnv(filePath) {
  const out = {}
  if (!fs.existsSync(filePath)) return out
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

const env = loadDotEnv(path.join(root, '.env'))
const fromArg = process.argv[2]?.trim()
const url =
  fromArg ||
  (env.VITE_CHANGE_ORDER_APPS_SCRIPT_URL || '').trim()

if (!url) {
  console.error(
    'Missing Web App URL. Set VITE_CHANGE_ORDER_APPS_SCRIPT_URL in .env, or run:\n' +
      "  npm run test:sheet -- 'https://script.google.com/macros/s/<id>/exec'",
  )
  process.exit(1)
}
if (!url.startsWith('https://script.google.com/macros/s/')) {
  console.error('URL must start with https://script.google.com/macros/s/')
  process.exit(1)
}

const payload = {
  coCode: 'SHEET-TEST-' + Date.now().toString(36).toUpperCase(),
  date: new Date().toISOString().split('T')[0],
  client: 'SheetAppendTest',
  authorizedPerson: 'npm run test:sheet',
  taskDescription: 'Row appended by scripts/test-google-sheet-append.mjs (Sheet1 via Code.gs).',
}

const res = await fetch(url, {
  method: 'POST',
  redirect: 'follow',
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify(payload),
})

const text = await res.text()
console.log('HTTP', res.status)
console.log('Response:', text.slice(0, 500))

if (!res.ok) {
  console.error('Append request failed.')
  process.exit(1)
}

try {
  const j = JSON.parse(text)
  if (j.ok === false) {
    console.error('Apps Script reported error:', j)
    process.exit(1)
  }
} catch {
  /* non-JSON body is ok for some deployments */
}

console.log('\nOK — check Sheet1 for new row:', payload.coCode)
