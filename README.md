# Olupan

Offline, adatvédelem-központú edzésnapló PWA – edzéssablonok, sorozatok és pihenőidő, testadatok, lépésszám, étkezés (Claude-dal), naptár és statisztikák. Magyar és angol felület.

**Minden adat csak a készüléken van** (a böngésző helyi tárhelyén): nincs fiók, szerver, analitika, süti vagy követés. Az első megnyitás után internet nélkül is működik; főképernyőre telepítve natív appként viselkedik.

> A név a „napló” szó visszafelé, japános kiejtéssel: *na-pu-lo* → **olupan**.

## Szerkezet

```
src/
  app.html          az app teljes forrása (HTML + CSS + JS, egy fájlban)
  i18n/en.json      angol szótár (magyar forrásszöveg → angol)
  icons/            app-ikonok (PNG) és favicon (SVG)
tools/
  build.py          src/ → public/ (SRI, service worker, betű-subset, ikon-sprite)
public/             a kész, kiszolgált oldal – a GitHub Actions generálja, kézzel ne szerkeszd
.github/workflows/
  build.yml         push után újraépíti a public/-t, és visszacommitolja
vercel.json         Vercel-beállítás: a public/ kiszolgálása, biztonsági fejlécek
```

## Fejlesztés

```bash
npm ci                              # Lucide-ikonok és @fontsource betűk
pip install -r requirements.txt     # fontTools (betű-subset)
python3 tools/build.py              # public/ újraépítése
npm run serve                       # http://localhost:8080
```

A szerkesztés mindig a `src/`-ben történik. Pushkor a **Build** workflow újraépíti a `public/` mappát: kiszámolja az SRI-hasheket (`integrity` a CSS-en és a JS-en), a service worker gyorsítótár-verzióját a tartalom hash-éből, subseteli a betűket, és ha a `public/` változott, visszacommitolja (`build: public/ frissítése … [skip ci]`). A build determinisztikus: változatlan forrásból bájtra azonos kimenet jön, így nincs felesleges commit.

### Új szöveg a felületen
A forrásnyelv a magyar. Angol módban az app a `src/i18n/en.json` szótár alapján fordít (a megjelenő szövegeket és a `placeholder` / `aria-label` / `title` attribútumokat). Új magyar szöveg mellé az angol párját is fel kell venni, különben angolul is magyarul jelenik meg. A dátum- és számformátum, a relatív idő, a CSV és a Claude-utasítás nyelvfüggése a forrásban van (`L()`, `LOC()`).

### Biztonság
- Szigorú CSP (`script-src 'self'`, nincs inline script), SRI a CSS-en és a JS-en.
- Nincs inline eseménykezelő: a `data-click` / `data-input` / … attribútumokból a build engedélylistát készít, csak ezek a függvények hívhatók.
- Minden betöltött és importált adat sémaellenőrzésen megy át (`sanitizeState`); a CSV-exportban képlet-injekció elleni védelem.

## Vercel

1. Vercel → **Add New… → Project** → az `olupan` repó importálása (privát repó is mehet).
2. Framework Preset: **Other**. A build- és telepítő parancsot, valamint a `public` kimeneti mappát a `vercel.json` adja meg – nem kell átírni.
3. Domain hozzáadása (pl. `olupan.hu`) a projekt **Settings → Domains** oldalán.

A `vercel.json` `ignoreCommand`-ja kihagyja a telepítést, ha egy commit nem érinti a `public/`-t – így a forrás-push után a workflow által készített build-commit kerül ki.

## Átállás a kockajelszo.hu/edzesnaplo.html-ről

Az új címen az app üresen indul (a böngésző az adatokat domainenként tárolja). Átköltözés: a régi címen **Beállítások → Mentés / megosztás**, az új címen **Beállítások → Import**. iPhone-on a főképernyős ikont is újra kell telepíteni az új címről.

## Licenc

Saját kód: MIT (`LICENSE`). Harmadik féltől származó összetevők: `THIRD_PARTY_NOTICES.md`.
