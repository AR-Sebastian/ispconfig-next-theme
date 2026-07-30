# NEXT 1.2.0 release gate

Version 1.2.0 is released only when every required item below has objective
evidence. Published tags are immutable.

## Compatibility

- ISPConfig 3.3.1p1 is declared consistently in both compatibility files
- Ubuntu 22.04/24.04 and Debian 12/13 passed
- Apache and Nginx passed on every supported distribution
- The selected theme rendered without fallback in all eight platform profiles

## Roles and interface

- Administrator, reseller, customer and mail-user sessions passed
- Required and forbidden navigation modules matched every role
- Protected routes rejected unauthorized roles
- All 47 referenced NEXT assets loaded successfully
- Login, dashboard, navigation, tables, filters, forms, settings and dialogs passed
- Desktop, tablet and mobile layouts passed in light and dark modes
- Interactive dashboard metrics and direct dashboard return passed

## Packages and publication

- Functional parity with LIQUID passed for 243 templates per theme
- 241 shared module templates are byte-identical
- JavaScript syntax passed for 70 files
- ZIP and TAR.GZ package validation passed with 300 signed files
- Fresh installation, upgrade, backup and rollback passed
- Public-source neutrality and secret scans passed
- GitHub validation must pass for the exact release commit and tag
- Published assets must be downloaded and their checksums verified again

The final `v1.2.0` tag is created only from the validated release commit.
