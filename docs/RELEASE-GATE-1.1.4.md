# NEXT 1.1.4 release gate

Version 1.1.4 is released only when every required item below has objective
evidence. Published tags are immutable.

## Compatibility

- Clean ISPConfig 3.3.1p1 installation confirmed
- Ubuntu 22.04/24.04 and Debian 12/13 confirmed
- Apache and Nginx confirmed on every supported distribution
- `ispconfig_version`, `ISPC_VERSION`, manifest and documentation agree

## Roles and interface

- Administrator, reseller, customer and mail-user sessions passed
- Selected NEXT theme rendered without fallback to the default theme
- Required and forbidden navigation modules matched every role
- Protected routes rejected unauthorized roles
- All 47 referenced NEXT assets returned successfully
- Login, dashboard, navigation, settings and dialogs passed
- Desktop, tablet and mobile layouts passed in light and dark modes
- Direct dashboard return and interactive metric behavior passed

## Packages and publication

- Standalone source validation passed
- Functional parity with LIQUID passed
- ZIP and TAR.GZ package validation passed with 300 signed files
- Public-source AI/agent reference scan passed
- GitHub validation must pass for the exact release commit and tag
- Published assets must be downloaded and their checksums verified again

The final `v1.1.4` tag is created only from the validated release commit.
