#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
theme="$root/theme/next"

bash -n "$root/scripts/manage-theme.sh"
bash -n "$root/scripts/test-manager.sh"
"$root/scripts/test-manager.sh"

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

version="$(tr -d '[:space:]' < "$root/VERSION")"
manifest_version="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version" \
  "$theme/theme-manifest.json")"
manifest_stage="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).stage" \
  "$theme/theme-manifest.json")"
manifest_tag="$(node -p "JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).releaseTag" \
  "$theme/theme-manifest.json")"

test "$version" = "$manifest_version" || {
  echo "VERSION and manifest version differ: $version != $manifest_version" >&2
  exit 1
}
test "$manifest_stage" = "stable" || {
  echo "Manifest stage must be stable, got: $manifest_stage" >&2
  exit 1
}
test "$manifest_tag" = "v$version" || {
  echo "Manifest release tag must be v$version, got: $manifest_tag" >&2
  exit 1
}
test "$(tr -d '[:space:]' < "$theme/ispconfig_version")" = "3.3.1p1"
test "$(tr -d '[:space:]' < "$theme/ISPC_VERSION")" = "3.3.1p1"

if grep -RIEq 'Private ISPConfig Workbench|geschützte Testumgebung|an deiner Testumgebung|signed files' \
  "$theme/templates" "$theme/README.md" "$theme/assets/favicon/site.webmanifest"; then
  echo "Public theme contains private laboratory or inaccurate release wording." >&2
  exit 1
fi
grep -q 'data-wb-i18n-de=' "$theme/templates/main_login.tpl.htm"
grep -q 'data-wb-i18n-en=' "$theme/templates/main_login.tpl.htm"
grep -q 'ISPConfig NEXT' "$theme/assets/favicon/site.webmanifest"

while IFS= read -r -d '' file; do
  node --check "$file"
done < <(find "$theme" -type f -name '*.js' -print0)

echo "NEXT validation passed."
