/**
 * Verifies .env wiring: Resend (send email) + Google Apps Script (append sheet row).
 * Run from repo root: node scripts/test-change-order-integrations.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadDotEnv(filePath) {
  const out = {}
  if (!fs.existsSync(filePath)) {
    console.error('Missing file:', filePath)
    return out
  }
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

const RESEND_API_KEY = env.RESEND_API_KEY?.trim()
const RESEND_FROM = env.RESEND_FROM?.trim()
const RESEND_TEST_TO = (env.RESEND_TEST_TO || 'reveriontech@gmail.com').trim()
const APPS_SCRIPT_URL = (env.VITE_CHANGE_ORDER_APPS_SCRIPT_URL || '').trim()

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const payload = {
  coCode: 'TEST-' + Date.now().toString(36).toUpperCase(),
  date: new Date().toISOString().split('T')[0],
  client: 'IntegrationTest',
  authorizedPerson: 'CI Bot',
  taskDescription: 'Automated test row from scripts/test-change-order-integrations.mjs',
}

async function testResend() {
  assert(RESEND_API_KEY, 'RESEND_API_KEY is empty in .env')
  assert(RESEND_FROM, 'RESEND_FROM is empty in .env')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [RESEND_TEST_TO],
      subject: `[Change order test] ${payload.coCode}`,
      text: [
        'Resend integration test OK.',
        '',
        `Would match sheet row: ${JSON.stringify(payload, null, 2)}`,
      ].join('\n'),
    }),
  })
  const body = await res.text()
  if (!res.ok) {
    throw new Error(`Resend HTTP ${res.status}: ${body}`)
  }
  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    parsed = { raw: body }
  }
  return parsed
}

async function testAppsScript() {
  assert(APPS_SCRIPT_URL, 'VITE_CHANGE_ORDER_APPS_SCRIPT_URL is empty in .env')
  assert(
    APPS_SCRIPT_URL.startsWith('https://script.google.com/macros/s/'),
    'VITE_CHANGE_ORDER_APPS_SCRIPT_URL must start with https://script.google.com/macros/s/',
  )
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Apps Script HTTP ${res.status}: ${text.slice(0, 500)}`)
  }
  return text.slice(0, 200)
}

let failed = false

console.log('--- Resend ---')
try {
  const r = await testResend()
  console.log('OK', r.id ? `email id: ${r.id}` : r)
} catch (e) {
  failed = true
  console.error('FAIL', e.message)
}

console.log('\n--- Google Apps Script (sheet append) ---')
if (!APPS_SCRIPT_URL) {
  console.log(
    'SKIP: set VITE_CHANGE_ORDER_APPS_SCRIPT_URL in .env to test saving rows.',
  )
} else {
  try {
    const t = await testAppsScript()
    console.log('OK', t || '(empty body)')
  } catch (e) {
    failed = true
    console.error('FAIL', e.message)
  }
}

if (failed) {
  console.error('\nOne or more checks failed. Fix .env and redeploy Apps Script if needed.')
  process.exit(1)
}
console.log('\nDone (Resend is required; Apps Script runs when URL is set).')
