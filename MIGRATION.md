# Migrating an Existing Obsidian Vault

Use this checklist when moving an existing vault into Claudesidian. The
migration keeps the original notes available while the new PARA folders and
assistant instructions are introduced.

## Before you start

1. Close Obsidian and any Claude Code sessions using the old vault.
2. Make a verified copy of the old vault outside the destination directory.
   Keep the copy until links and attachments have been checked.
3. If the old vault is tracked by Git, create a commit or tag before copying
   it. Do not use the old vault's `.git` directory as the new vault's history.
4. Decide whether the old vault's `CLAUDE.md`, `.claude/`, or other assistant
   configuration should be retained. Review these files manually; do not
   overwrite the Claudesidian instructions automatically.

## Import with the setup wizard

1. Clone Claudesidian into a new directory and start Claude Code from that
   directory.
2. Run `/init-bootstrap` and select the option to import the existing vault.
3. Confirm the source path when prompted. The wizard places the imported
   material under `OLD_VAULT/` so the original content is not mixed into the
   system folders during setup.
4. Complete setup and inspect the generated `CLAUDE.md` before opening the
   destination in Obsidian.

If the wizard cannot access the source path, stop and copy the old vault into
the destination manually. Never delete the source to work around a path or
permission error.

## Organize in stages

Move notes in small, reviewable batches:

- `00_Inbox/` for captures that still need a decision
- `01_Projects/` for time-bound work with a clear outcome
- `02_Areas/` for ongoing responsibilities
- `03_Resources/` for reference material
- `04_Archive/` for inactive or completed notes
- `05_Attachments/` for images, PDFs, and other binary files

Keep uncertain material in `OLD_VAULT/` or `00_Inbox/` until it has been
reviewed. Preserve filenames first; rename only after links have been checked.
Configure non-default destinations in `.claude/vault-config.json` before using
the attachment and clipping scripts.

## Validate links and attachments

1. Open the destination as a new Obsidian vault and wait for indexing to
   finish.
2. Search for unresolved `[[wikilinks]]` and missing Markdown links.
3. Run `pnpm attachments:orphans` to find files that are no longer referenced.
4. If attachments were moved, run `pnpm attachments:update-links` and review
   the diff before committing.
5. Compare note counts and a sample of important notes with the backup.

Do not remove `OLD_VAULT/` until these checks pass and the backup is stored
somewhere separate from the destination vault.

## Resume after an interrupted session

An interrupted Claude session does not change the migration state. Resume from
the destination vault rather than starting the wizard again:

1. Open a terminal in the destination vault and run `git status`.
2. If the working tree is clean, run `git pull --ff-only` to synchronize the
   latest checkpoint. Do not pull while another session is editing the vault.
3. Run `claude --resume` (or the installed `claudesidian` command) to restore
   the previous Claude session. If no resumable session exists, start `claude`
   in the same directory and ask it to inspect the latest commit and continue
   from `MIGRATION.md`.
4. Check the last migration checkpoint with `git log -1 --oneline` before
   moving or renaming more notes. Commit each reviewable batch so a later
   interruption can be resumed without guessing which files were processed.

Do not run `/init-bootstrap` again unless the destination vault was discarded
and you are intentionally starting over. Re-running bootstrap can recreate
configuration files and obscure the boundary between imported material and
the new vault instructions.

## Rollback

If the result is incorrect, close Obsidian, remove only the new destination
vault, and restore from the verified backup. If the destination is Git
tracked, use the migration commit history to review or revert system-file
changes; restore personal notes from the backup rather than forcing a reset.

After migration is complete, commit the new vault as a separate repository
history and keep the original vault backup for at least one review cycle.
