import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const scripts = ['firecrawl-scrape.sh', 'firecrawl-batch.sh'].map((name) =>
  readFileSync(join(import.meta.dirname, name), 'utf8'),
)

test('encodes Firecrawl URLs as JSON values instead of interpolating them', () => {
  for (const script of scripts) {
    assert.match(script, /jq -nc --arg url "\$URL"/)
    assert.match(script, /-d "\$REQUEST_BODY"/)
    assert.doesNotMatch(script, /\\"url\\": \\"\$URL\\"/)
  }
})

test('treats Firecrawl HTTP failures as failed captures', () => {
  for (const script of scripts) {
    assert.match(script, /curl -fsS/)
  }
  assert.match(scripts[0], /Firecrawl request failed/)
  assert.match(scripts[1], /Firecrawl request failed/)
})
