import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

test("vault stats reads attachment paths from vault config", () => {
  const script = fs.readFileSync(path.join(import.meta.dirname, "vault-stats.sh"), "utf8");

  assert.match(script, /vault-config\.js/);
  assert.match(script, /node \"\$CONFIG_SCRIPT\" attachments/);
  assert.match(script, /node \"\$CONFIG_SCRIPT\" attachmentsOrganized/);
  assert.match(script, /find \"\$ATTACHMENTS_DIR\"/);
  assert.match(script, /find \"\$ORGANIZED_DIR\"/);
});
