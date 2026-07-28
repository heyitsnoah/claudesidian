import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { discoverSkills } from './skill-discovery.js'

test('discovers skills from valid hook JSON', () => {
  const root = mkdtempSync(join(tmpdir(), 'claudesidian-skills-'))
  mkdirSync(join(root, '.claude', 'skills', 'zeta'), { recursive: true })
  mkdirSync(join(root, '.claude', 'skills', 'alpha'), { recursive: true })
  writeFileSync(
    join(root, '.claude', 'skills', 'zeta', 'SKILL.md'),
    'description: Zeta skill\n',
  )

  const output = discoverSkills(
    '{"prompt":"Please list available skills"}',
    root,
  )
  assert.match(output, /<skill-discovery>/)
  assert.match(output, /alpha\nzeta: Zeta skill/)
})

test('ignores malformed input and prompts without skill', () => {
  const root = mkdtempSync(join(tmpdir(), 'claudesidian-skills-'))
  assert.equal(discoverSkills('not json', root), '')
  assert.equal(discoverSkills('{"prompt":"show projects"}', root), '')
})

test('runs as a command-line hook', () => {
  const root = mkdtempSync(join(tmpdir(), 'claudesidian-skills-'))
  mkdirSync(join(root, '.claude', 'skills', 'example'), { recursive: true })
  const output = execFileSync(
    process.execPath,
    [join(import.meta.dirname, 'skill-discovery.js')],
    {
      cwd: root,
      encoding: 'utf8',
      input: JSON.stringify({ prompt: 'find skills' }),
    },
  )
  assert.match(output, /example/)
})
