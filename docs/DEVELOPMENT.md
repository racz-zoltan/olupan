# Olupan – fejlesztői leírás

Az Olupan offline, adatvédelem-központú PWA. Az egész app egyetlen forrásfájlból (`src/app.html`) épül, keretrendszer és futásidejű függőség nélkül. A felület forrásnyelve a magyar, az angol fordítás szótárból jön.

## Szerkezet

```
src/
  app.html          az app teljes forrása (HTML + CSS + JS, egy fájlban)
  i18n/en.json      angol szótár (magyar forrásszöveg → angol)
  data/foods.json   beépített élelmiszer-adatbázis (100 g / 100 ml)
  data/diceware_*   magyar Diceware-szólisták a jelszómérőhöz
  scanner/          vonalkód-olvasó (külön oldal, saját CSP) és diagnosztikai tesztoldala
  crypto/           jelszóerősség-mérő (igény szerint töltődik be)
  icons/            app-ikonok (PNG) és favicon (SVG)
  pages/            tájékoztató oldalak: útmutató, adatkezelés, jogi nyilatkozat (hu + en), config.json
licenses/           harmadik féltől származó licencszövegek (a build a public/licenses/ alá másolja)
tools/
  build.py          src/ → public/ (SRI, service worker, betű-subset, ikon-sprite)
public/             a kész, kiszolgált oldal – a GitHub Actions generálja, kézzel ne szerkeszd
.github/workflows/
  build.yml         push után újraépíti a public/-t, és visszacommitolja
vercel.json         Vercel-beállítás: a public/ kiszolgálása, biztonsági fejlécek
```

## Build és helyi futtatás

```bash
npm ci                              # ikonok, betűk, zxing-wasm, hash-wasm stb.
pip install -r requirements.txt     # fontTools (betű-subset)
python3 tools/build.py              # public/ újraépítése
npm run serve                       # http://localhost:8080
```

A szerkesztés mindig a `src/`-ben történik. Pushkor a **Build** workflow újraépíti a `public/` mappát:
- kiszámolja az SRI-hasheket;
- a service worker gyorsítótár-verzióját a tartalom hash-éből képzi;
- subseteli a betűket;
- ha a `public/` változott, visszacommitolja (`build: public/ frissítése … [skip ci]`).

A build determinisztikus: változatlan forrásból bájtra azonos kimenet jön.

## Tájékoztató oldalak

| | Magyar | English |
|---|---|---|
| Felhasználói útmutató | `/utmutato.html` | `/guide.html` |
| Adatkezelési tájékoztató | `/adatvedelem.html` | `/privacy.html` |
| Jogi nyilatkozat | `/jogi-nyilatkozat.html` | `/disclaimer.html` |

A tartalmuk a `src/pages/<név>.<nyelv>.html` fájlokban van, a közös fejlécet, nyelvváltót és láblécet a build adja hozzá. A `src/pages/config.json` tartalmazza:
- az adatkezelő nevét;
- a kapcsolati e-mail-címet;
- a hatálybalépés dátumát.

## Új szöveg a felületen

Angol módban az app a `src/i18n/en.json` szótár alapján fordít, a megjelenő szövegeket és a `placeholder` / `aria-label` / `title` attribútumokat is. Új magyar szöveg mellé fel kell venni az angol párját, különben angolul is magyarul jelenik meg. Rövid, kódban lévő szövegnél a `L('magyar','English')` forma is használható. A felhasználói adatokat (receptnevek, bolti tételek) `translate="no"` védi a fordítástól.

## Tárolás

Az adatok az eszközön maradnak.
- **Fő tár:** IndexedDB (`olupan` adatbázis, `kv` tároló, `state` kulcs: `{json, ts}`).
- **Tükör:** localStorage (`olupan.v1` + `olupan.v1.ts`), amíg az adat elfér benne. Induláskor a frissebb időbélyegű nyer.
- Minden betöltött és importált adat sémaellenőrzésen megy át (`sanitizeState`). Új mezőt ott is fel kell venni, különben a következő betöltéskor elveszik.

## Biztonság

- Szigorú CSP (`script-src 'self'`, nincs inline script), SRI a CSS-en és a JS-en.
- Nincs inline eseménykezelő. A `data-click` / `data-input` / … attribútumokból a build engedélylistát készít, csak ezek a függvények hívhatók.
- A WebAssembly (`'wasm-unsafe-eval'`) csak a vonalkód-olvasó külön oldalán engedélyezett.
- Titkosított mentés: Argon2id kulcsszármaztatás (hash-wasm) + AES-GCM (Web Crypto).
- A CSV-exportban képlet-injekció elleni védelem van.

## Vonalkód-olvasó

A `/scanner.html` egy külön oldal, amely iframe-ben fut, és a beolvasott kódot `postMessage`-dzsel adja vissza:
- ahol van, a beépített `BarcodeDetector`-t használja;
- máshol, például iOS-en, a [zxing-wasm](https://github.com/Sec-ant/zxing-wasm)-ot.

A `/scanner-test.html` ugyanezt lépésenkénti naplóval futtatja. Hibakereséshez és webview-próbához való, a navigációban nem szerepel.

## Telepítés (Vercel)

1. Vercel → **Add New… → Project** → a repó importálása.
2. Framework Preset: **Other**. A build- és telepítő parancsot, valamint a `public` kimeneti mappát a `vercel.json` adja meg.
3. Domain hozzáadása a projekt **Settings → Domains** oldalán.

A `vercel.json` `ignoreCommand`-ja kihagyja a telepítést, ha egy commit nem érinti a `public/`-t.
