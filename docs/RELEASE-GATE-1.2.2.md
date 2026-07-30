# NEXT 1.2.2 release gate

Version 1.2.2 is released only when all of the following checks pass:

- ISPConfig compatibility files name `3.3.1p1`;
- manifest, repository version and release tag agree;
- all package files match their SHA-256 checksums;
- no private Workbench or laboratory wording is visible;
- German and English login, accessibility and runtime table copy is present;
- standalone runtime and package validation passes;
- administrator, reseller, customer and mail-user boundaries pass;
- Apache and Nginx rendering completes without default-theme fallback.

The final `v1.2.2` tag is created only from the validated release commit and is
not changed afterwards.
