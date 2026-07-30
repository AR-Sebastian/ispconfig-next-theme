# Release process

1. Update `VERSION`, `theme/next/theme-manifest.json`, `CHANGELOG.md` and release notes.
2. Run the repository validation workflow.
3. Test administrator, reseller and customer roles on a staging installation.
4. Verify light, dark, desktop, tablet and mobile presentation.
5. Create an annotated tag such as `v1.1.3`.
6. Push the tag. The release workflow builds ZIP and TAR.GZ archives with SHA-256 checksums.
7. Review the generated release and installation contents before announcing it.

Published version tags are treated as immutable.

