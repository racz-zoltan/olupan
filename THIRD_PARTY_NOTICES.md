# Harmadik féltől származó összetevők

Az Olupan saját kódja MIT-licencű (lásd `LICENSE`). A buildbe beépülő összetevők:

| Összetevő | Felhasználás | Licenc |
|---|---|---|
| [Lucide](https://lucide.dev) (`lucide-static`) | ikonok (SVG-sprite az `index.html`-ben) | ISC |
| [Instrument Sans](https://github.com/Instrument/instrument-sans) (`@fontsource/instrument-sans`) | felületi betű, subsetelve | SIL Open Font License 1.1 |
| [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) (`@fontsource/bricolage-grotesque`) | címbetű, subsetelve | SIL Open Font License 1.1 |
| [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) (`@fontsource/jetbrains-mono`) | számok, kód, subsetelve | SIL Open Font License 1.1 |
| [zxing-wasm](https://github.com/Sec-ant/zxing-wasm) (Ze-Zheng Wu) | vonalkód-olvasó (WebAssembly) | MIT |
| [zxing-cpp](https://github.com/zxing-cpp/zxing-cpp) | a zxing-wasm-ba fordított vonalkód-dekóder | Apache License 2.0 |
| [hash-wasm](https://github.com/Daninet/hash-wasm) | Argon2id kulcsszármaztatás a titkosított mentéshez | MIT |
| [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn) (`@zxcvbn-ts/core`, `@zxcvbn-ts/language-common`) | jelszóerősség-mérés | MIT |
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | QR-kód a megosztáshoz | MIT |
| [tesseract.js](https://github.com/naptha/tesseract.js) (Project Naptha) | tápértéktábla felismerése fotóról, a készüléken | Apache License 2.0 |
| [tesseract.js-core](https://github.com/naptha/tesseract.js-core) / [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) | a tesseract.js-be WebAssemblyre fordított szövegfelismerő motor | Apache License 2.0 |
| [tessdata_best](https://github.com/tesseract-ocr/tessdata_best) magyar nyelvi modell (`@tesseract.js-data/hun`, best_int) | a felismerő magyar modellje | Apache License 2.0 |

A teljes licencszövegek, amelyeket a licencek mellékelni írnak elő, a `licenses/` mappában vannak, és a build a kiszolgált oldallal együtt a `/licenses/` alá másolja őket:
- [zxing-cpp – Apache License 2.0](licenses/zxing-cpp-Apache-2.0.txt) (olupan.com/licenses/zxing-cpp-Apache-2.0.txt)
- [zxing-wasm – MIT](licenses/zxing-wasm-MIT.txt) (olupan.com/licenses/zxing-wasm-MIT.txt)
- [tesseract.js – Apache License 2.0](licenses/tesseract.js-Apache-2.0.txt) (olupan.com/licenses/tesseract.js-Apache-2.0.txt)
- [Tesseract OCR / tesseract.js-core / tessdata – Apache License 2.0](licenses/tesseract-ocr-Apache-2.0.txt) (olupan.com/licenses/tesseract-ocr-Apache-2.0.txt)
- [a tesseract.js csomagjaiba beépített kisebb könyvtárak (MIT, BSD-3-Clause) megjegyzései](licenses/tesseract.js-bundled-notices.txt) (olupan.com/licenses/tesseract.js-bundled-notices.txt)

A betűk a `public/assets/fonts/` mappában subsetelt (csak a szükséges karaktereket tartalmazó) formában szerepelnek, az OFL feltételei szerint.

## Adatforrások

| Forrás | Felhasználás | Licenc |
|---|---|---|
| [USDA FoodData Central – SR Legacy](https://fdc.nal.usda.gov/) | a beépített élelmiszer-adatbázis alapja | CC0 1.0 (közkincs) |
| Saját becslések | magyar ételek és általános italok (pl. szénsavas üdítő, jeges tea) átlagértékei | az Olupan része (MIT) |
| Burger King, KFC és Subway nyilvános magyarországi tápértéktáblázatai | a gyorséttermi tételek (forrásmegjelöléssel) | a láncok nyilvános adatai |
| [Open Food Facts](https://world.openfoodfacts.org) | vonalkódos termékadatok, felhasználói kérésre lekérdezve | adatbázis: ODbL 1.0, tartalom: DbCL 1.0 |
| Magyar Diceware-szólisták ([kockajelszo.hu](https://kockajelszo.hu)) | jelszóerősség-mérés | CC BY-SA 4.0 (a Magyar Wikiszótár alapján) |
