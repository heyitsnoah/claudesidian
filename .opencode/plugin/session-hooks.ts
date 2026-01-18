// Session hooks plugin for Claudesidian
// Provides: first-run welcome, update checking, and skill discovery
//
// OpenCode equivalent of .claude/hooks/skill-discovery.sh and settings.json hooks

import type {
  PluginInput,
  UserPromptSubmitContext,
  UserPromptSubmitResult,
} from "@opencode-ai/plugin";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, basename } from "path";

/**
 * Claudesidian Session Hooks Plugin
 *
 * Features:
 * 1. First-run welcome message with setup instructions
 * 2. Update checking on session start
 * 3. Skill discovery when user mentions "skill"
 */
export default function createClaudesidianPlugin(input: PluginInput) {
  const { directory, $ } = input;

  /**
   * Check if this is the first run (FIRST_RUN file exists)
   */
  const isFirstRun = (): boolean => {
    return existsSync(join(directory, "FIRST_RUN"));
  };

  /**
   * Get available skills from .opencode/skill/ directory
   */
  const getSkills = (): Array<{ name: string; description: string }> => {
    const skillsDir = join(directory, ".opencode", "skills");
    const skills: Array<{ name: string; description: string }> = [];

    if (!existsSync(skillsDir)) {
      return skills;
    }

    try {
      const dirs = readdirSync(skillsDir, { withFileTypes: true });
      for (const dir of dirs) {
        if (!dir.isDirectory()) continue;

        const skillFile = join(skillsDir, dir.name, "SKILL.md");
        if (existsSync(skillFile)) {
          const content = readFileSync(skillFile, "utf-8");
          // Extract description from YAML frontmatter
          const descMatch = content.match(/^description:\s*(.+)$/m);
          const description = descMatch ? descMatch[1].trim() : "";
          skills.push({ name: dir.name, description });
        } else {
          skills.push({ name: dir.name, description: "" });
        }
      }
    } catch {
      // Silently handle errors
    }

    return skills.sort((a, b) => a.name.localeCompare(b.name));
  };

  /**
   * Check if prompt mentions "skill" or "skills"
   */
  const mentionsSkill = (prompt: string): boolean => {
    return /\bskills?\b/i.test(prompt);
  };

  return {
    /**
     * Session start hook
     * - Shows first-run welcome message
     * - Checks for updates
     */
    onSessionStart: async () => {
      const messages: string[] = [];

      // First run welcome
      if (isFirstRun()) {
        messages.push(`
# 🚀 Welcome to Claudesidian!

**This appears to be your first time using this vault.**

## Quick Start

Run the setup wizard:

⬇
/init-bootstrap
⬆

## What this will do:

✅ Set up your personalized configuration
✅ Disconnect from the original repository
✅ Help you import any existing Obsidian vault
✅ Configure your preferred workflow
✅ Create your PARA folder structure

The setup wizard will guide you through everything!
`);
      }

      // Check for updates (suppress errors)
      try {
        const result = await $`npm run check-updates --silent 2>/dev/null`;
        if (result.stdout.trim()) {
          messages.push(result.stdout.trim());
        }
      } catch {
        // Silently ignore update check failures
      }

      if (messages.length > 0) {
        console.log(messages.join("\n\n"));
      }
    },

    /**
     * User prompt submit hook
     * - Discovers skills when user mentions "skill"
     */
    UserPromptSubmit: async (
      ctx: UserPromptSubmitContext,
    ): Promise<UserPromptSubmitResult> => {
      const injectedMessages: string[] = [];

      // Skill discovery
      if (mentionsSkill(ctx.prompt)) {
        const skills = getSkills();
        if (skills.length > 0) {
          const skillList = skills
            .map((s) =>
              s.description ? `- ${s.name}: ${s.description}` : `- ${s.name}`,
            )
            .join("\n");

          injectedMessages.push(`<skill-discovery>
The user mentioned 'skill'. Available skills in this project:

${skillList}

If relevant to the user's request, read the SKILL.md file to load the skill instructions.
</skill-discovery>`);
        }
      }

      return {
        block: false,
        modifiedParts: ctx.parts,
        messages: injectedMessages,
      };
    },
  };
}
