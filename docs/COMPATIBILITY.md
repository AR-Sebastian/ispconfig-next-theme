# Compatibility

## Supported baseline

| Component | Supported baseline |
|---|---|
| ISPConfig | 3.3.1p1 for the `v1.2.0` stable release |
| PHP | 8.1 and newer |
| Web server | Apache or Nginx as configured by ISPConfig |
| Desktop browsers | Current Chrome, Edge, Firefox and Safari |
| Mobile browsers | Current Chrome and Safari |

## Validation scope

Each release is checked for:

- a complete standalone theme directory;
- valid manifest and version files;
- JavaScript syntax;
- light and dark presentation;
- desktop, tablet and mobile breakpoints;
- administrator, reseller and customer navigation;
- tables, filters, forms, dialogs and empty states;
- login and logout presentation;
- installation without ISPConfig core replacement.

Server provisioning remains controlled by ISPConfig. The theme does not replace database, API, daemon or service behavior.

## Stable 3.3.1p1 release gate

The `v1.2.0` stable release names ISPConfig `3.3.1p1` so it can be tested
without ISPConfig falling back to the default theme. It has passed clean
Ubuntu 22.04, Ubuntu 24.04, Debian 12 and Debian 13 installations with
Apache and Nginx,
authenticated administrator login, actual NEXT selection without fallback
and all 47 theme assets referenced by each rendered dashboard.

Authenticated administrator, reseller, customer and mail-user sessions also
passed on Debian 12 with Apache and Nginx. Required and forbidden navigation
modules, representative protected routes, default-theme fallback and all 47
referenced assets were checked for every role.

The visual browser, responsive and screenshot matrix has also passed for login,
dashboard, tables, expanded filters, forms and mobile navigation in light and
dark presentation. The stable release is ready for the immutable tag workflow; the
tagged archives and checksums must still be downloaded and verified before the
GitHub release is declared complete.
