import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DEFAULT_FOLDERS, getVaultFolders } from "./vault-config.js";

test("uses stable defaults when no config exists", () => {
  const folders = getVaultFolders(
    path.join(os.tmpdir(), "missing-vault-config.json"),
  );
  assert.deepEqual(folders, DEFAULT_FOLDERS);
});

test("overrides only configured folder paths", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "claudesidian-config-"));
  const configPath = path.join(root, "vault-config.json");
  fs.writeFileSync(
    configPath,
    JSON.stringify({ folders: { clippings: "Inbox/Web" } }),
  );

  assert.deepEqual(getVaultFolders(configPath), {
    ...DEFAULT_FOLDERS,
    clippings: "Inbox/Web",
  });
  fs.rmSync(root, { recursive: true, force: true });
});
