# NEXT installieren

## Voraussetzungen

- Eine aktuelle ISPConfig-3.3-Installation
- Administratorzugriff auf den Server
- Ein vollständiges Backup von ISPConfig-Datenbank und `/usr/local/ispconfig`

Die Installation zunächst auf einem Testsystem durchführen.

## Installation

1. `ispconfig-next-theme-1.1.2.tar.gz` aus dem GitHub-Release herunterladen.
2. Archiv mit der mitgelieferten `SHA256SUMS.txt` prüfen.
3. Theme entpacken:

   ```bash
   sudo tar -xzf ispconfig-next-theme-1.1.2.tar.gz \
     -C /usr/local/ispconfig/interface/web/themes/
   ```

4. Rechte setzen:

   ```bash
   sudo chown -R ispconfig:ispconfig /usr/local/ispconfig/interface/web/themes/next
   sudo find /usr/local/ispconfig/interface/web/themes/next -type d -exec chmod 755 {} \;
   sudo find /usr/local/ispconfig/interface/web/themes/next -type f -exec chmod 644 {} \;
   ```

5. In ISPConfig unter **Einstellungen → Benutzereinstellungen → Design** das Theme **NEXT** auswählen.
6. Browser-Cache leeren und neu anmelden.

## Aktualisierung und Rückkehr

Vor einer Aktualisierung den vorhandenen Ordner sichern. Für die Rückkehr zuerst das ISPConfig-Standardtheme auswählen und danach `themes/next` entfernen.

