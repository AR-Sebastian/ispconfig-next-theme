# Install NEXT

## Requirements

- A current ISPConfig 3.3 installation
- Administrative access to the server
- A complete backup of the ISPConfig database and `/usr/local/ispconfig`

Install and verify the theme on a staging system first.

## Installation

1. Download `ispconfig-next-theme-1.2.3.tar.gz` from the GitHub release.
2. Verify it with the supplied `SHA256SUMS.txt`.
3. Extract it:

   ```bash
   sudo tar -xzf ispconfig-next-theme-1.2.3.tar.gz \
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

Back up the existing directory before updating. To roll back, select the ISPConfig default theme first and then remove `themes/next`.
