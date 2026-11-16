# Olupan

**Edzés-, étkezés- és testnapló, ami a te készülékeden marad.**
Nincs fiók, nincs szerver, nincs reklám és nincs követés. Ingyenes, internet nélkül is működik, és bármelyik telefonra vagy gépre telepíthető a böngészőből.

👉 **[olupan.com](https://olupan.com)**

> A név a „napló” szó visszafelé, japános kiejtéssel: *na-pu-lo* → **olupan**.

*[English below](#english)*

---

## Mire jó

### Edzés
- Edzéssablonok, sorozatok, szuperszettek, bemelegítő sorozatok és pihenőidő-számláló.
- **Javaslat minden gyakorlatnál** az előző alkalom alapján (kettős progresszió). Csak akkor javasol nehezebb súlyt, ha minden sorozat megvolt.
- Heti edzésterv 1, 2 vagy 4 hétre, edzéstörténet, izomcsoport-statisztika és az elmúlt 7 nap áttekintése.
- Edzéstervet Claude-dal is kérhetsz, a saját eszközeidhez és az elmúlt hetek edzéseihez igazítva.

### Étkezés
- **Több mint 700 tételes élelmiszer-adatbázis**, amely a telefonon van, ezért a kereséshez nem kell internet. Benne vannak magyar ételek és a nagy gyorséttermi láncok becsült értékei is.
- **Vonalkód-olvasás** a kamerával, iPhone-on is. A termékadatok az [Open Food Facts](https://world.openfoodfacts.org) nyílt adatbázisából jönnek, és csak a vonalkód száma megy el.
- Saját receptek, amelyek adagra vagy grammra is felvihetők.
- **Heti menü Claude-dal:** kevés, előre jelzett esti főzéssel a következő 1–2 napra, adagonkénti kalóriával és makrókkal. Bevásárlólista is jár hozzá, boltrészlegek szerint csoportosítva, és figyelembe veszi, mi van otthon.
- Napi kalória- és makrókeret a profilod és a célod alapján, heti korrekcióval a tényleges súlyváltozásod szerint.

### Test
- Testsúly, testzsír és lépésszám, trendekkel és grafikonokkal.
- **Egészséges súlytartomány** a BMI és, ha méred, a testzsírod alapján. Figyelmeztetést kapsz, ha a célsúlyod egészségtelenül alacsony.

### Claude-dal, ha szeretnéd
Az Olupan összeállítja a kérést (étkezés fényképről vagy diktálva, receptötletek, heti menü, edzésterv), és megnyitja a [Claude](https://claude.ai)-t. A választ te illeszted vissza. Az app maga nem küld adatot senkinek: azt látja a Claude, amit te beillesztesz. A Claude használatához saját Claude-fiók kell, az Olupan nélküle is teljes értékű.

## Adatvédelem

- **Minden adat a készüléken van**, a böngésző helyi tárhelyén. Fiók, felhő, analitika és süti nincs.
- **Titkosított mentés:** a mentésfájlt jelszóval titkosítod (Argon2id + AES-GCM), és oda viszed, ahová akarod.
- **Megosztás** linkkel vagy QR-kóddal: edzéssablont és receptet küldhetsz másnak. Szerver ehhez sem kell.
- Részletek az [adatkezelési tájékoztatóban](https://olupan.com/adatvedelem.html).

## Telepítés

Nyisd meg az [olupan.com](https://olupan.com) oldalt, és add hozzá a főképernyőhöz:
- **iPhone (Safari):** Megosztás → *Főképernyőhöz adás*
- **Android (Chrome):** menü → *Alkalmazás telepítése*
- **Számítógép (Chrome, Edge):** a címsor jobb oldalán a telepítés ikon

Az első megnyitás után internet nélkül is működik.

## Hasznos oldalak

- [Felhasználói útmutató](https://olupan.com/utmutato.html)
- [Adatkezelési tájékoztató](https://olupan.com/adatvedelem.html)
- [Jogi nyilatkozat](https://olupan.com/jogi-nyilatkozat.html)

Az Olupan tájékoztató becsléseket ad, nem orvosi tanácsot. Egészségügyi kérdésben fordulj szakemberhez.

## Visszajelzés

Hibát találtál, vagy ötleted van? Nyiss egy [issue-t](../../issues), vagy írj az **olupan@proton.me** címre.

---

## English

**A workout, food and body log that stays on your device.** No account, no server, no ads, no tracking. Free, works offline, and installs on any phone or computer from the browser: **[olupan.com](https://olupan.com)**.

- **Workouts:** templates, sets, supersets, rest timer, and a progression suggestion for every exercise based on last time. Weekly plans, history and muscle-group stats.
- **Food:** a 700+ item food database stored on the phone, so searching works offline. Barcode scanning (also on iPhone) via [Open Food Facts](https://world.openfoodfacts.org), own recipes, and daily calorie and macro targets.
- **Weekly menu with Claude:** a few planned evening cooking sessions for the next 1–2 days, with a shopping list grouped by store section.
- **Body:** weight, body fat and steps with trends, plus a healthy weight range and a warning for unhealthy target weights.
- **Privacy:** everything is stored in your browser. Backups are password-encrypted (Argon2id + AES-GCM). Claude features are optional: the app prepares the request and you paste the reply back, and the app itself sends nothing.

Available in Hungarian and English. See the [user guide](https://olupan.com/guide.html), [privacy policy](https://olupan.com/privacy.html) and [disclaimer](https://olupan.com/disclaimer.html). Olupan gives estimates, not medical advice.

---

## Fejlesztőknek / For developers

Az Olupan egyetlen HTML-forrásból épülő, build-lépéssel kiszolgált PWA. Keretrendszer és futásidejű függőség nincs. A forrás szerkezete, a build és a telepítés leírása: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Licenc / License

A saját kód MIT licencű ([LICENSE](LICENSE)). A felhasznált összetevők és adatforrások: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
