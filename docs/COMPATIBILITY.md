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

NEXT does not currently claim compatibility with ISPConfig 3.3.1p1. The
`ispconfig_version` and `ISPC_VERSION` files remain at `3.3dev` until the
overridden templates have passed the stable-release matrix. The planned
`v1.1.3` package will name `3.3.1p1` only after administrator, reseller,
customer and mail-user views have been verified on clean Apache and Nginx
installations. Changing only the version marker is not accepted as proof.
