import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { getFirstRunContext } from './session-start.js'

test('returns first-run guidance when the marker exists', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'claudesidian-session-'))
  try {
    fs.writeFileSync(path.join(root, 'FIRST_RUN'), '')

    const context = getFirstRunContext(root)

    assert.match(context, /Welcome to Claudesidian/)
    assert.match(context, /\/init-bootstrap/)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('does not add guidance for an initialized vault', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'claudesidian-session-'))
  try {
    assert.equal(getFirstRunContext(root), null)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
