# IMS Go Website

Statische Website für GitHub Pages: https://imsgo-app.github.io

Kein Build-Schritt, kein Framework – einfach HTML, CSS und etwas JavaScript.
Jeder Push auf `main` ist nach etwa einer Minute live.

## Seiten und Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite (App, Features, Hörspiel-Teaser, Team, Download) |
| `kids.html` | Hörspiele für Kinder – alle Geschichten stehen direkt im HTML |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `styles.css` | Gemeinsames Design für alle Seiten |
| `script.js` | Menü, Jahreszahl im Footer, Einblend-Animation (alle Seiten) |
| `kids.js` | Hörspiel-Seite: Alters-Tabs, Versions-Umschalter, Kapitel, Player |
| `audio/` | Hörspiele als M4A, sortiert nach Altersgruppe |
| `assets/images/` | Logo, App-Screenshots, Teamfotos |
| `assets/covers/` | Cover der drei Altersgruppen (SVG) |
| `sitemap.xml`, `robots.txt` | Für Suchmaschinen |

## Hörspiele

### Aufbau

Die Hörspiel-Seite hat drei Altersgruppen als Tabs: **2–3**, **4–6** und **7–11 Jahre**.

- **2–3 Jahre:** 5 Lars-Geschichten, jeweils nur eine Version.
- **4–6 Jahre:** 1 Tiergeschichte in 8 Kapiteln, in zwei Versionen.
- **7–11 Jahre:** 4 Abenteuer-Geschichten, jeweils in zwei Versionen.

**Versionen:** „Techniken“ und „Pseudostottern“ sind dieselbe Geschichte in zwei
Sprechweisen. Deshalb gibt es pro Geschichte eine Karte mit Umschalter statt zwei
getrennter Listen.

**Kapitel:** Die 4–6-Geschichte ist eine einzige Datei. Die Kapitel sind Sprungmarken
(Sekunden ab Anfang), die im HTML hinterlegt sind.

**Player:** Es gibt nur einen Player für die ganze Seite (unten am Bildschirmrand).
Es läuft immer nur ein Hörspiel. Auf dem iPhone kann man ihn auch über den
Sperrbildschirm steuern.

**Ohne JavaScript** sind alle Altersgruppen untereinander sichtbar und die
Download-Links funktionieren weiterhin.

### Dateiformat

- AAC in M4A, **96 kbit/s, Stereo** (die Aufnahmen nutzen echtes Stereo für Musik und Effekte).
- Etwa 0,7 MB pro Minute. Läuft in Safari, Chrome, Firefox und Edge.
- Dateinamen ohne Umlaute und Leerzeichen, Schema:
  `audio/<alter>/<titel>.m4a` oder `audio/<alter>/<titel>-techniken.m4a` / `-pseudostottern.m4a`
- **Keine WAV-Dateien ins Repo legen.** Eine WAV-Datei ist etwa 15-mal so groß.
  Die unkomprimierten Originale liegen außerhalb des Repos in `../imsgo_audio_masters/`.

### Neues Hörspiel hinzufügen

**1. Datei komprimieren** (macOS, ohne Zusatzsoftware):

```sh
afconvert -f m4af -d aac -b 96000 "Original.wav" audio/7-11/neuer-titel-techniken.m4a
```

**2. Laufzeit und Größe ablesen:**

```sh
afinfo audio/7-11/neuer-titel-techniken.m4a | grep duration   # Sekunden
ls -l audio/7-11/neuer-titel-techniken.m4a                    # Bytes → MB
```

**3. In `kids.html` eine bestehende Karte kopieren** (`<li class="kids-story">…</li>`)
und anpassen. Am einfachsten eine Karte aus derselben Altersgruppe nehmen.

*Geschichte mit nur einer Version* (wie bei 2–3 Jahre): Die Daten stehen direkt am `<li>`.

```html
<li class="kids-story" data-title="Neuer Titel" data-age-label="2–3 Jahre"
    data-cover="assets/covers/cover-2-3.svg" data-src="audio/2-3/neuer-titel.m4a">
    …
    <h3>Neuer Titel</h3>
    <p class="kids-story-meta" data-meta>2 Min.</p>
    …
    <a class="kids-download" href="audio/2-3/neuer-titel.m4a" download
       aria-label="„Neuer Titel“ herunterladen (1,4 MB)">…<span data-size>1,4 MB</span></a>
</li>
```

*Geschichte mit zwei Versionen* (wie bei 7–11 Jahre): Die Daten stehen an den beiden
Umschalter-Buttons. Die erste Version (`aria-pressed="true"`) ist die Standardversion,
und die sichtbaren Texte (Laufzeit, Download-Link, Größe) müssen zu ihr passen.

```html
<div class="kids-version" role="group" aria-label="Version von „Neuer Titel“">
    <button type="button" data-version="Techniken" data-src="audio/7-11/neuer-titel-techniken.m4a"
            data-dur="200" data-mb="2.4" aria-pressed="true">Techniken</button>
    <button type="button" data-version="Pseudostottern" data-src="audio/7-11/neuer-titel-pseudostottern.m4a"
            data-dur="236" data-mb="2.9" aria-pressed="false">Pseudostottern</button>
</div>
```

| Attribut | Bedeutung |
|---|---|
| `data-src` | Pfad zur Audiodatei |
| `data-dur` | Laufzeit in Sekunden (ganze Zahl) |
| `data-mb` | Dateigröße in MB, **mit Punkt** (`2.4`) |
| `data-chapters` | Nur bei Kapiteln: Startzeiten in Sekunden, z. B. `[0, 33.95, 144.82]` |

*Geschichte mit Kapiteln* (wie bei 4–6 Jahre): Die Kapitel-WAVs zuerst zu **einer**
WAV zusammenfügen, dann komprimieren. Die Startzeit jedes Kapitels ist die Summe der
Längen aller vorherigen Kapitel. Diese Zeiten kommen in `data-chapters` an jedem
Versions-Button, die Kapitelnamen in die Liste `<details class="kids-chapters">`.

**4. Zähler anpassen** – diese Zahlen stehen fest im HTML:

- `kids.html`: „10 Geschichten“ im Hero und „5 Geschichten“ usw. in den Tabs
- `index.html`: Texte der drei Hörspiel-Karten im Abschnitt „Hörspiele für stotternde Kinder“

## Bilder

- Bilder als **WebP** in der Größe, in der sie angezeigt werden (doppelte Pixel für Retina):
  Screenshots 480 px breit, Teamfotos 320 × 320 px, Logo 560 px.
- `ims-go-logo.png` (groß) bleibt nur für die Vorschau beim Teilen (`og:image`).
- `ims-go-logo-64.png` ist das Favicon und das Logo oben links,
  `apple-touch-icon.png` das Icon für den iPhone-Homescreen.

## Design-Regeln

- **Ansprache:** durchgehend **Du** („Schreib uns“, „dein Kind“).
- **Breakpoints:** Menü klappt ab **960 px** ein (iPad hochkant), Mobil-Layout ab **760 px**,
  kleine Handys ab **520 px**.
- **Zoomen nicht sperren:** Im Viewport-Tag kein `maximum-scale` und kein `user-scalable=no`.
- **Klickflächen** mindestens 44 px hoch (Apple-Empfehlung).
- **Farben pro Altersgruppe:** Rosa für 2–3, Gelb für 4–6, Blau für 7–11 Jahre
  (`.kids-age-…` und `.kids-tab-…` in `styles.css`).
- Bei Änderungen an CSS/JS die Versionsnummer `?v=…` in **allen** HTML-Dateien erhöhen,
  sonst sehen Besucherinnen und Besucher noch die alte Version aus dem Browser-Cache.

## Offene Punkte

- [ ] **Titel der Tiergeschichte:** „Flora und die Tiere“ ist ein Arbeitstitel.
  Den echten Titel in `kids.html` eintragen (`data-title`, `<h3>` und die `aria-label`-Texte der Karte).
- [ ] **Erklärtext Techniken / Pseudostottern** auf der Hörspiel-Seite fachlich gegenlesen.
- [ ] **Impressum:** Hausnummer bei der Adresse fehlt (auch in `datenschutz.html`).
- [ ] **Auf echtem iPhone testen:** Abspielen, Sperrbildschirm-Steuerung, Download in Safari.
- [ ] Optional: Die alten WAV-Dateien liegen noch in der Git-Historie (~670 MB).
  Die Website ist davon nicht betroffen, nur das Klonen des Repos dauert länger.
  Entfernen ginge nur durch Umschreiben der Historie.

## Veröffentlichen

```sh
git add .
git commit -m "Beschreibung der Änderung"
git push origin main
```

Lokal ansehen: `index.html` einfach im Browser öffnen.
