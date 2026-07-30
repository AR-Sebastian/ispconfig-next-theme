#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
theme="$root/theme/next"

required=(
  "$root/VERSION"
  "$root/LICENSE.md"
  "$root/THIRD_PARTY_NOTICES.md"
  "$theme/README.md"
  "$theme/LICENSE.md"
  "$theme/LICENSE_SCOPE.md"
  "$theme/THIRD_PARTY_NOTICES.md"
  "$theme/theme-manifest.json"
  "$theme/ispconfig_version"
  "$theme/ISPC_VERSION"
)

for file in "${required[@]}"; do
  test -f "$file" || { echo "Missing required file: $file" >&2; exit 1; }
done

node -e "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'))" \
  "$theme/theme-manifest.json"

while IFS= read -r -d '' file; do
  node --check "$file"
done < <(find "$theme" -type f -name '*.js' -print0)

echo "NEXT validation passed."

