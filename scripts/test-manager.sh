#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sandbox="$(mktemp -d)"
trap 'rm -rf "$sandbox"' EXIT
target_root="$sandbox/themes"
backup_root="$sandbox/backups"
manager="$root/scripts/manage-theme.sh"

"$manager" install --target-root "$target_root" --backup-root "$backup_root"
"$manager" status --target-root "$target_root" --backup-root "$backup_root" |
  grep -q 'Installed version:'

printf 'previous payload\n' > "$target_root/next/rollback-sentinel"
"$manager" install --target-root "$target_root" --backup-root "$backup_root"
"$manager" rollback --target-root "$target_root" --backup-root "$backup_root"
test -f "$target_root/next/rollback-sentinel"

"$manager" uninstall --target-root "$target_root" --backup-root "$backup_root"
test ! -d "$target_root/next"
"$manager" rollback --target-root "$target_root" --backup-root "$backup_root"
test -f "$target_root/next/theme-manifest.json"

"$manager" install --target-root "$target_root" --backup-root "$backup_root" --dry-run >/dev/null
echo 'NEXT managed lifecycle passed.'
