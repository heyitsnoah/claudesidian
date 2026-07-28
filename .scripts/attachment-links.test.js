import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const updateScript = path.join(scriptsDir, "update-attachment-links.js");
const renameScript = path.join(scriptsDir, "fix-renamed-links.js");

function createVault() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "claudesidian-links-"));
  fs.mkdirSync(path.join(root, ".claude"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".claude", "vault-config.json"),
    JSON.stringify({
      folders: {
        attachments: "Media",
        attachmentsOrganized: "Media/Sorted",
      },
    }),
  );
  return root;
}

test("update-attachment-links uses configured attachment paths", () => {
  const root = createVault();
  fs.writeFileSync(path.join(root, "note.md"), "![[Media/photo.png]]");

  execFileSync(process.execPath, [updateScript, "photo.png"], { cwd: root });

  assert.equal(
    fs.readFileSync(path.join(root, "note.md"), "utf8"),
    "![[Media/Sorted/photo.png]]",
  );
  fs.rmSync(root, { recursive: true, force: true });
});

test("fix-renamed-links uses configured attachment paths", () => {
  const root = createVault();
  fs.writeFileSync(path.join(root, "note.md"), "[[old.pdf]]");

  execFileSync(process.execPath, [renameScript, "old.pdf", "new.pdf"], {
    cwd: root,
  });

  assert.equal(
    fs.readFileSync(path.join(root, "note.md"), "utf8"),
    "[[Media/Sorted/new.pdf]]",
  );
  fs.rmSync(root, { recursive: true, force: true });
});
