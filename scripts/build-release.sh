#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
version="$(tr -d '[:space:]' < "$root/VERSION")"
dist="$root/dist"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

"$root/scripts/validate-theme.sh"
mkdir -p "$dist"
cp -a "$root/theme/next" "$stage/next"

(
  cd "$stage"
  zip -q -r "$dist/ispconfig-next-theme-$version.zip" next
  tar -czf "$dist/ispconfig-next-theme-$version.tar.gz" next
)

(
  cd "$dist"
  sha256sum \
    "ispconfig-next-theme-$version.zip" \
    "ispconfig-next-theme-$version.tar.gz" > SHA256SUMS.txt
)

echo "Release assets created in $dist"

