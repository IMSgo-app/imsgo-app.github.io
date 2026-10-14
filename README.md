# IMS Go Website

Statische Website für GitHub Pages: https://imsgo-app.github.io

## Dateien

- `index.html` – Startseite
- `kids.html` – Hörspiele für Kinder (statisches HTML, Player-Logik in `kids.js`)
- `impressum.html`, `datenschutz.html` – Rechtliches
- `styles.css` – gemeinsames Design
- `script.js` – Menü und kleine Interaktionen (alle Seiten)
- `audio/` – komprimierte Hörspiele (AAC/M4A, 96 kbit/s)

## Neues Hörspiel hinzufügen

1. WAV-Datei komprimieren (macOS, ohne Zusatzsoftware):

   ```sh
   afconvert -f m4af -d aac -b 96000 "Original.wav" audio/7-11/neuer-titel-techniken.m4a
   afinfo audio/7-11/neuer-titel-techniken.m4a | grep duration
   ```

2. In `kids.html` einen bestehenden `<li class="kids-story">` kopieren und Titel,
   `data-src`/`href`, Laufzeit (`data-dur` in Sekunden) und Dateigröße (`data-mb`) anpassen.
3. Bei Änderungen an CSS/JS die Versionsnummer `?v=…` in den HTML-Dateien erhöhen.

Die unkomprimierten WAV-Originale liegen nicht im Repository.

## Veröffentlichen

```sh
git add .
git commit -m "Beschreibung"
git push origin main
```
