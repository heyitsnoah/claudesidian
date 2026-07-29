import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const scriptsDir = import.meta.dirname;
const sessionStart = join(scriptsDir, "session-start.js");

function runSessionStart(projectDir) {
  return execFileSync(process.execPath, [sessionStart], {
    cwd: projectDir,
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    encoding: "utf8",
  });
}

test("emits first-run context as valid hook JSON", () => {
  const projectDir = mkdtempSync(join(tmpdir(), "claudesidian-hook-"));
  try {
    writeFileSync(join(projectDir, "FIRST_RUN"), "");

    const payload = JSON.parse(runSessionStart(projectDir));

    assert.equal(payload.hookSpecificOutput.hookEventName, "SessionStart");
    assert.match(payload.hookSpecificOutput.additionalContext, /init-bootstrap/);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
});

test("stays silent after the vault has been initialized", () => {
  const projectDir = mkdtempSync(join(tmpdir(), "claudesidian-hook-"));
  try {
    assert.equal(runSessionStart(projectDir), "");
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
});
