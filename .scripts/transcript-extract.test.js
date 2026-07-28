import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const script = readFileSync(
  join(import.meta.dirname, 'transcript-extract.sh'),
  'utf8',
)

test('isolates downloaded captions in a temporary directory', () => {
  assert.match(script, /TEMP_DIR="\$\(mktemp -d\)"/)
  assert.match(script, /trap cleanup EXIT/)
  assert.match(script, /-P "\$TEMP_DIR" -o/)
  assert.match(script, /"\$TEMP_DIR"\/\*\.json3/)
  assert.doesNotMatch(script, /rm -f \*\.json3/)
})
