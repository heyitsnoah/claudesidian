#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'

export function discoverSkills(input, projectDir = process.cwd()) {
  const prompt = getPrompt(input)
  if (!/\bskills?\b/i.test(prompt)) {
    return ''
  }

  const skillsDir = join(projectDir, '.claude', 'skills')
  if (!existsSync(skillsDir) || !statSync(skillsDir).isDirectory()) {
    return ''
  }

  const skills = readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const skillFile = join(skillsDir, entry.name, 'SKILL.md')
      if (!existsSync(skillFile)) {
        return entry.name
      }

      const description = readFileSync(skillFile, 'utf8')
        .split(/\r?\n/)
        .find((line) => line.startsWith('description:'))
        ?.replace(/^description:\s*/, '')
      return description ? `${entry.name}: ${description}` : entry.name
    })
    .sort()

  if (skills.length === 0) {
    return ''
  }

  return [
    '<skill-discovery>',
    "The user mentioned 'skill'. Available skills in this project:",
    '',
    ...skills,
    "If relevant to the user's request, read the SKILL.md file to load the skill instructions.",
    '</skill-discovery>',
  ].join('\n')
}

function getPrompt(input) {
  try {
    const payload = JSON.parse(input)
    return typeof payload.prompt === 'string' ? payload.prompt : ''
  } catch {
    return ''
  }
}

if (
  process.argv[1] &&
  basename(process.argv[1]).toLowerCase() === 'skill-discovery.js'
) {
  const chunks = []
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) chunks.push(chunk)
  const output = discoverSkills(
    chunks.join(''),
    process.env.CLAUDE_PROJECT_DIR || process.cwd(),
  )
  if (output) process.stdout.write(`${output}\n`)
}
