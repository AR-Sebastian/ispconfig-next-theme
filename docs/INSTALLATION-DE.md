# NEXT installieren

## Voraussetzungen

- Eine aktuelle ISPConfig-3.3-Installation
- Administratorzugriff auf den Server
- Ein vollständiges Backup von ISPConfig-Datenbank und `/usr/local/ispconfig`

Die Installation zunächst auf einem Testsystem durchführen.

## Verwaltete Installation aus dem Repository

Für Installation, Aktualisierung und eine sichere Rückkehr steht im geklonten
Repository ein gemeinsames Verwaltungswerkzeug bereit:

```bash
sudo ./scripts/manage-theme.sh status
sudo ./scripts/manage-theme.sh install
sudo ./scripts/manage-theme.sh rollback
sudo ./scripts/manage-theme.sh uninstall
```

`install` prüft den Theme-Inhalt, baut die neue Version zunächst in einem
temporären Ordner auf und tauscht sie erst danach aus. Eine vorhandene Version
wird unter `/var/backups/ispconfig-themes` gesichert. `uninstall` löscht das
Theme nicht endgültig, sondern verschiebt es ebenfalls in diesen
Rückkehrbereich. Mit `--dry-run` lassen sich alle geplanten Schritte vorab
anzeigen.

## Installation

1. `ispconfig-next-theme-1.2.4.tar.gz` aus dem GitHub-Release herunterladen.
2. Archiv mit der mitgelieferten `SHA256SUMS.txt` prüfen.
3. Theme entpacken:

   ```bash
   sudo tar -xzf ispconfig-next-theme-1.2.4.tar.gz \
     -C /usr/local/ispconfig/interface/web/themes/
   ```

4. Rechte setzen:

   ```bash
   sudo chown -R ispconfig:ispconfig /usr/local/ispconfig/interface/web/themes/next
   sudo find /usr/local/ispconfig/interface/web/themes/next -type d -exec chmod 750 {} \;
   sudo find /usr/local/ispconfig/interface/web/themes/next -type f -exec chmod 640 {} \;
   ```

5. In ISPConfig unter **Einstellungen → Benutzereinstellungen → Design** das Theme **NEXT** auswählen.
6. Browser-Cache leeren und neu anmelden.

## NEXT auch für die Anmeldeseite aktivieren

Die persönliche Designauswahl gilt erst nach der Anmeldung. Soll NEXT zusätzlich
für die öffentliche Anmeldeseite und als systemweiter Rückfall dienen, in
`/usr/local/ispconfig/interface/lib/config.inc.local.php` ergänzen:

```php
$conf['theme'] = 'next';
```

Existiert die Datei noch nicht, muss sie mit `<?php` beginnen. Die generierte
`config.inc.php` nicht bearbeiten. Für die Rückkehr zum ISPConfig-Standardtheme
die Zeile aus `config.inc.local.php` entfernen und den Browser-Cache leeren.

## Aktualisierung und Rückkehr

Bei einer manuellen Aktualisierung den vorhandenen Ordner vorher sichern. Für
die Rückkehr zuerst das ISPConfig-Standardtheme auswählen und danach
`themes/next` entfernen. Bei Verwendung des Verwaltungswerkzeugs übernimmt
`rollback` die Wiederherstellung der zuletzt gesicherten Version.
