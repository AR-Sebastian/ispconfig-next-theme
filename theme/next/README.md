# ISPConfig NEXT Theme 1.1

NEXT is the calm, responsive premium theme for the ISPConfig Workbench. It
modernizes the visible interface without replacing ISPConfig permissions,
routes, remote API behavior or server-side provisioning.

## Compatibility

- ISPConfig baseline: `3.3.1p1`
- Validated laboratory platform: Ubuntu 24.04
- Release directory: `next`
- Required fallback: the ISPConfig `default` theme remains installed

## Theme scope

NEXT provides its own application and login shells, design tokens, navigation,
tables, filters, forms, dashboard, monitoring surfaces and selected module
templates. A missing module-specific override continues through ISPConfig's
normal theme fallback behavior.

The package contains theme files only. It does not install services, change the
database, replace the REST API or alter server configuration.

The distributable has no mandatory dependency on the Workbench branding
helper. On an unmodified compatible ISPConfig installation it uses its bundled
ISPConfig logo, favicon and red accent. If the optional Workbench branding
integration is present, supported dynamic appearance values may enhance those
defaults without changing the theme package contract.

## Installation

Extract the packaged `next` directory into:

`/usr/local/ispconfig/interface/web/themes/`

The resulting main template must be:

`/usr/local/ispconfig/interface/web/themes/next/templates/main.tpl.htm`

Select `next` in the ISPConfig user theme setting. Keep the current session
open until a second session has confirmed login, dashboard and navigation.

## Rollback

Set the affected user's `app_theme` back to `default`, sign out and verify a
new login with the default theme. Remove `next` only after that verification.
