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

A teljes licencszövegek, amelyeket a licencek mellékelni írnak elő, a `licenses/` mappában vannak, és a build a kiszolgált oldallal együtt a `/licenses/` alá másolja őket:
- [zxing-cpp – Apache License 2.0](licenses/zxing-cpp-Apache-2.0.txt) (olupan.com/licenses/zxing-cpp-Apache-2.0.txt)
- [zxing-wasm – MIT](licenses/zxing-wasm-MIT.txt) (olupan.com/licenses/zxing-wasm-MIT.txt)

A betűk a `public/assets/fonts/` mappában subsetelt (csak a szükséges karaktereket tartalmazó) formában szerepelnek, az OFL feltételei szerint.

## Adatforrások

| Forrás | Felhasználás | Licenc |
|---|---|---|
| [USDA FoodData Central – SR Legacy](https://fdc.nal.usda.gov/) | a beépített élelmiszer-adatbázis alapja | CC0 1.0 (közkincs) |
| Saját becslések | magyar ételek, gyorséttermi és márkás termékek átlagértékei | az Olupan része (MIT) |
| [Open Food Facts](https://world.openfoodfacts.org) | vonalkódos termékadatok, felhasználói kérésre lekérdezve | adatbázis: ODbL 1.0, tartalom: DbCL 1.0 |
| Magyar Diceware-szólisták ([kockajelszo.hu](https://kockajelszo.hu)) | jelszóerősség-mérés | CC BY-SA 4.0 (a Magyar Wikiszótár alapján) |
