#!/bin/bash
# Skill discovery hook - suggests relevant skills when user mentions "skill"
# Exit 0 stdout → added as context for Claude
# No dependencies - pure bash

# Read all stdin
INPUT=$(cat)

# Extract just the prompt field value (pure bash, no jq)
# Input format: {"prompt": "user text here", ...}
# Pattern handles escaped quotes: matches [^\"] or \. sequences
# Use -n and /p so non-matching input produces empty output (not original input)
PROMPT=$(echo "$INPUT" | sed -nE 's/.*"prompt"[[:space:]]*:[[:space:]]*"(([^\\"]|\\.)*)".*/\1/p')

# Match: skill, skills (case-insensitive, word boundary) in prompt only
if echo "$PROMPT" | grep -iqE '\bskills?\b'; then
  # Get skill names from .claude/skills/ directory
  SKILLS_DIR="${CLAUDE_PROJECT_DIR:-.}/.claude/skills"

  if [ -d "$SKILLS_DIR" ]; then
    # Build list of skills with descriptions
    output=""
    for d in "$SKILLS_DIR"/*/; do
      [ -d "$d" ] || continue
      name=$(basename "$d")
      skill_file="$d/SKILL.md"
      if [ -f "$skill_file" ]; then
        # Extract description from YAML frontmatter
        desc=$(grep -m1 '^description:' "$skill_file" | sed 's/^description: *//')
        output="$output$name: $desc"$'\n'
      else
        output="$output$name"$'\n'
      fi
    done

    if [ -n "$output" ]; then
      echo "<skill-discovery>"
      echo "The user mentioned 'skill'. Available skills in this project:"
      echo ""
      echo "$output" | sort
      echo "If relevant to the user's request, read the SKILL.md file to load the skill instructions."
      echo "</skill-discovery>"
    fi
  fi
fi

# Always exit 0 - never block user prompts
exit 0
