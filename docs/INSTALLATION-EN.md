# Install NEXT

## Requirements

- A current ISPConfig 3.3 installation
- Administrative access to the server
- A complete backup of the ISPConfig database and `/usr/local/ispconfig`

Install and verify the theme on a staging system first.

## Managed installation from the repository

The cloned repository includes one operator tool for installation, updates and
safe rollback:

```bash
sudo ./scripts/manage-theme.sh status
sudo ./scripts/manage-theme.sh install
sudo ./scripts/manage-theme.sh rollback
sudo ./scripts/manage-theme.sh uninstall
```

`install` validates the payload, prepares the new version in a temporary
directory and only then replaces the installed theme. An existing version is
kept below `/var/backups/ispconfig-themes`. `uninstall` also moves the theme to
that recovery area instead of deleting it permanently. Use `--dry-run` to
review every planned operation without writing changes.

## Installation

1. Download `ispconfig-next-theme-1.2.4.tar.gz` from the GitHub release.
2. Verify it with the supplied `SHA256SUMS.txt`.
3. Extract it:

   ```bash
   sudo tar -xzf ispconfig-next-theme-1.2.4.tar.gz \
     -C /usr/local/ispconfig/interface/web/themes/
   ```

4. Set ownership and permissions:

   ```bash
   sudo chown -R ispconfig:ispconfig /usr/local/ispconfig/interface/web/themes/next
   sudo find /usr/local/ispconfig/interface/web/themes/next -type d -exec chmod 750 {} \;
   sudo find /usr/local/ispconfig/interface/web/themes/next -type f -exec chmod 640 {} \;
   ```

5. Select **NEXT** in **System → User Settings → Design**.
6. Clear the browser cache and sign in again.

## Enable NEXT for the sign-in page

The personal theme selection applies only after sign-in. To use NEXT for the
public sign-in page and as the system-wide fallback, add this line to
`/usr/local/ispconfig/interface/lib/config.inc.local.php`:

```php
$conf['theme'] = 'next';
```

If the file does not exist yet, it must start with `<?php`. Do not edit the
generated `config.inc.php`. To return to the ISPConfig default sign-in theme,
remove the line from `config.inc.local.php` and clear the browser cache.

For a manual update, back up the existing directory first. To return manually,
select the ISPConfig default theme and then remove `themes/next`. When using the
operator tool, `rollback` restores the newest managed backup.
