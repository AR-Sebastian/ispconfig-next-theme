# Compatibility

## Supported baseline

| Component | Supported baseline |
|---|---|
| ISPConfig | 3.3 development line (`3.3dev`) for the current evaluation package |
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

The `release/v1.1.3` candidate names ISPConfig `3.3.1p1` so it can be tested
without ISPConfig falling back to the default theme. It has passed clean
Ubuntu 22.04 and Ubuntu 24.04 installations with Apache and Nginx,
authenticated administrator login, actual NEXT selection without fallback
and all 47 theme assets referenced by each rendered dashboard.

This is candidate evidence, not yet a public compatibility claim. The
remaining distributions and the reseller, customer and mail-user views must
still pass before the candidate can be merged and tagged.
