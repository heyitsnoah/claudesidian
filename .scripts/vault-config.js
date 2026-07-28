#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_FOLDERS = Object.freeze({
  clippings: "00_Inbox/Clippings",
  attachments: "05_Attachments",
  attachmentsOrganized: "05_Attachments/Organized",
});

export function getVaultFolders(configPath = ".claude/vault-config.json") {
  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return { ...DEFAULT_FOLDERS, ...(config.folders ?? {}) };
  } catch {
    return { ...DEFAULT_FOLDERS };
  }
}

function printFolder(name) {
  const folders = getVaultFolders();
  if (!(name in folders)) {
    console.error(
      `Unknown folder "${name}". Expected one of: ${Object.keys(folders).join(", ")}`,
    );
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`${folders[name]}\n`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  printFolder(process.argv[2] ?? "clippings");
}
