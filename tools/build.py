#!/usr/bin/env python3
"""Olupan build – a src/ forrásból a public/ mappába (ezt szolgálja ki a Vercel).

Kimenet:
  public/index.html            az app (külön CSS/JS, SRI-hashekkel, szigorú CSP)
  public/assets/               app.css, app.js, ikonok, subsetelt betűk (woff2)
  public/manifest.webmanifest  PWA-manifest
  public/sw.js                 service worker (a gyorsítótár verziója a tartalom hash-e)
  public/olupan-offline.html   egyetlen önálló fájl, beágyazott betűkkel (letölthető offline változat)

Ikonok: Lucide (ISC). Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (SIL OFL 1.1) – @fontsource csomagokból.
Használat (a repó gyökeréből):  python3 tools/build.py
"""
import base64, hashlib, io, json, re, shutil, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
NM, SRC, PUB = ROOT / "node_modules", ROOT / "src", ROOT / "public"
ICONDIR = SRC / "icons"
ICONS = ["dumbbell","printer","repeat","calendar-plus","triangle-alert","lightbulb","calendar-days","chart-no-axes-combined","settings","plus","x","check",
         "chevron-left","chevron-right","chevron-down","chevron-up","arrow-up","arrow-down","timer","trophy","sun","moon","trash-2","rotate-ccw",
         "save","download","upload","pencil","party-popper","minus","flame","info","share","folder-open","smartphone","footprints","clipboard-paste",
         "circle-help","utensils","target","copy","external-link","shield-check","wifi-off","square-plus","hard-drive","person-standing","archive","archive-restore","notebook-pen","drumstick","wheat","droplet","leaf","footprints","calendar-days","chevron-left","trending-up","disc","history","link","monitor-down","scan-barcode","search","sparkles","chef-hat","cooking-pot","shopping-basket","thumbs-up","thumbs-down","lock","lock-open","eye","eye-off","dices","clipboard-list","sliders-horizontal","arrow-left-right","list-plus","key-round","house","camera"]
LATIN = "U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2019,U+201C-201E,U+2026,U+2212,U+2022,U+2192,U+2191,U+2193,U+00D7,U+0394,U+2248,U+2264,U+2265"
HU = "U+0150,U+0151,U+0170,U+0171"
FONTS = [("Instrument Sans", w, "instrument-sans") for w in (400, 500, 600)] + \
        [("Bricolage Grotesque", 600, "bricolage-grotesque")] + \
        [("JetBrains Mono", w, "jetbrains-mono") for w in (400, 500, 600)]

def rng(r):
    r = r.replace("U+", ""); a, _, b = r.partition("-"); return range(int(a, 16), int(b or a, 16) + 1)

def sub(path, ranges):
    opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["kern", "liga", "tnum", "lnum"]
    f = TTFont(path, recalcTimestamp=False); s = subset.Subsetter(opts)   # időbélyeg nélkül: a build determinisztikus (CI-ben nincs felesleges commit)
    s.populate(unicodes=[u for r in ranges.split(",") for u in rng(r)]); s.subset(f)
    b = io.BytesIO(); f.flavor = "woff2"; f.save(b); return b.getvalue()

def sri(data): return "sha384-" + base64.b64encode(hashlib.sha384(data).digest()).decode()

src = (SRC / "app.html").read_text(encoding="utf-8")
syms = []
for n in dict.fromkeys(ICONS):
    inner = re.search(r"<svg[^>]*>(.*)</svg>", (NM / f"lucide-static/icons/{n}.svg").read_text(), re.S).group(1)
    syms.append(f'<symbol id="i-{n}" viewBox="0 0 24 24">{re.sub(r"\s+", " ", inner).strip()}</symbol>')
src = src.replace("<!--@ICONS@-->", '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + "".join(syms) + "</svg>")
acts = sorted(set(re.findall(r'data-(?:click|input|change|submit|backdrop)="([A-Za-z_]\w*)', src)))   # műveletek engedélylistája
src = src.replace("/*@ACTIONS@*/", json.dumps(acts))
src = src.replace("/*@I18N@*/", "const EN=" + json.dumps(json.loads((SRC / "i18n" / "en.json").read_text(encoding="utf-8")),
                                                        ensure_ascii=False, separators=(",", ":")) + ";")
# --- élelmiszer-adattár (src/data/foods.json) tömör tömbként a JS-be: [id,kat,hu,en,kcal,F,Sz,Zs,rost,alk,ml?,usda,adagok]
_fd = json.loads((SRC / "data" / "foods.json").read_text(encoding="utf-8"))
_rows = [[x["id"], x["cat"], x["hu"], x["en"], x["kcal"], x["p"], x["c"], x["f"], x["fib"], x.get("alc", 0), 1 if x["unit"] == "ml" else 0,
          int(x["src"][5:]) if x["src"].startswith("usda:") else (-1 if x["src"] == "chain" else -2 if x["src"] == "brand" else 0), x.get("portions", [])] for x in _fd["foods"]]
src = src.replace("/*@FOODS@*/", "const FOODDB=" + json.dumps(_rows, ensure_ascii=False, separators=(",", ":")) + ";")
css = re.search(r"<style>\n?(.*?)</style>", src, re.S).group(1)
js = re.search(r"<script>\n?(.*?)</script>", src, re.S).group(1)

shutil.rmtree(PUB, ignore_errors=True)
A = PUB / "assets"; F = A / "fonts"; F.mkdir(parents=True)

# --- betűk: subset, egyszer; a public/-ba fájlként, az offline változatba base64-ként
ff_files, ff_inline = [], []
for fam, w, pkg in FONTS:
    for part, ranges in (("latin", LATIN), ("latin-ext", HU)):
        data = sub(NM / f"@fontsource/{pkg}/files/{pkg}-{part}-{w}-normal.woff2", ranges)
        name = f"{pkg}-{w}{'' if part == 'latin' else '-hu'}.woff2"
        (F / name).write_bytes(data)
        face = "@font-face{{font-family:'{f}';font-style:normal;font-weight:{w};font-display:swap;src:url({u}) format('woff2');unicode-range:{r}}}"
        ff_files.append(face.format(f=fam, w=w, u=f"'fonts/{name}'", r=ranges))
        ff_inline.append(face.format(f=fam, w=w, u=f"data:font/woff2;base64,{base64.b64encode(data).decode()}", r=ranges))

# ========== 1. offline egyfájlos változat ==========
single = src.replace("/*@FONTS@*/", "\n".join(ff_inline)).replace("/*@BOOT@*/", "")
fav = base64.b64encode((ICONDIR / "favicon.svg").read_bytes()).decode()
single = single.replace("</title>", f'</title>\n<meta name="robots" content="noindex">\n<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{fav}">', 1)
(PUB / "olupan-offline.html").write_text(single, encoding="utf-8")

# ========== 2. a webes változat ==========
LDJSON = json.dumps({"@context": "https://schema.org", "@type": "WebApplication", "name": "Olupan", "url": "https://olupan.com/",
    "applicationCategory": "HealthApplication", "applicationSubCategory": "Fitness", "operatingSystem": "iOS, Android, Windows, macOS, Linux (böngésző)",
    "browserRequirements": "Requires JavaScript; works offline after the first visit", "image": "https://olupan.com/assets/og-image.png",
    "inLanguage": ["hu", "en"], "isAccessibleForFree": True, "offers": {"@type": "Offer", "price": "0", "priceCurrency": "HUF"},
    "description": "Ingyenes, offline edzés-, étkezés- és testadatnapló: kalória és makrók fotóból vagy leírásból AI-jal (Claude), edzésterv-import, rekordok, statisztikák. Regisztráció nélkül, minden adat a készüléken marad. Free offline workout, food and body log with AI-assisted meal logging – no account, data stays on your device.",
    "featureList": ["Edzéssablonok, szuperszettek, bemelegítő-kalkulátor, tárcsakalkulátor", "Személyes rekordok, becsült 1RM és erőtrendek", "Izomcsoportonkénti heti sorozatszám és relatív erő",
        "Kalória- és makrókövetés AI-jal (Claude) fotóból vagy leírásból", "Kb. 650 élelmiszeres kereshető adattár (USDA, EU-s számítás)", "Adaptív napi kalóriakeret (TDEE) a súlytrend alapján",
        "Heti menü- és receptjavaslat", "Testsúly, testzsír, testméretek, lépések", "Offline működés, regisztráció nélkül, adatexport"],
    "author": {"@type": "Person", "name": "Rácz Zoltán"}}, ensure_ascii=False).replace("</", "<\\/")
NOSCRIPT = """<main></main>
<noscript><section style="max-width:680px;margin:24px auto;padding:0 16px;font-family:system-ui,sans-serif;line-height:1.5">
<h1>Olupan – offline edzés-, étkezés- és testadatnapló</h1>
<p>Ingyenes napló telefonra és számítógépre. Regisztráció nélkül, internet nélkül is működik, minden adat a készüléken marad.</p>
<h2>Edzés</h2><ul><li>Edzéssablonok, szuperszettek, pihenőidő-időzítő</li><li>Bemelegítő sorozatok kalkulátora, tárcsakalkulátor</li><li>Személyes rekordok, becsült 1RM, erőtrendek, relatív erő</li><li>Heti sorozatszám izomcsoportonként, gyakoriság, edzésnaptár</li><li>Edzésterv importálása Claude-ból</li></ul>
<h2>Étkezés</h2><ul><li>Kalória, makrók és rost: rögzítés fotóból vagy leírásból AI-jal (Claude), kézzel vagy gyors rögzítéssel</li><li>Kereshető élelmiszer-adattár (USDA, európai kalóriaszámítással), saját tételek</li><li>Adaptív napi kalóriakeret (TDEE) a súlytrend és az étkezések alapján</li><li>Heti menü- és receptjavaslat az étkezési preferenciáid szerint</li></ul>
<h2>Testadatok</h2><ul><li>Testsúly, testzsír, derék- és testméretek, lépések, trendek</li></ul>
<div lang="en"><h2>Olupan – offline workout, food and body log</h2><p>Free, no account, works offline; your data stays on your device. Workout templates, warm-up and plate calculators, personal records and estimated 1RM, weekly sets per muscle group; calories, macros and fibre with AI-assisted meal logging (Claude) from a photo or description, a searchable food database, adaptive calorie target (TDEE); body weight, measurements and steps.</p></div>
<p>Az app használatához kapcsold be a JavaScriptet. · <a href="/utmutato.html">Felhasználói útmutató</a> · <a href="/guide.html" lang="en">User guide</a> · <a href="/adatvedelem.html">Adatkezelés</a> · <a href="/privacy.html" lang="en">Privacy</a></p>
</section></noscript>"""
css_d = css.replace("/*@FONTS@*/", "\n".join(ff_files)).encode()
boot = """if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
  const had=!!navigator.serviceWorker.controller;
  addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(e=>console.warn('Service worker:',e)));
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)toast(L('Új verzió telepítve – a következő indításkor aktív','New version installed – active from the next start'))});
}"""
# --- titkosítás: Argon2id (hash-wasm, MIT) mindig; jelszómérő (zxcvbn-ts + magyar Diceware-listák) csak igény szerint töltődik
import subprocess
argon_js = (NM / "hash-wasm/dist/argon2.umd.min.js").read_bytes(); (A / "argon2.js").write_bytes(argon_js)
subprocess.run([str(NM / ".bin/esbuild"), str(SRC / "crypto/pwcheck.js"), "--bundle", "--minify", "--format=iife", "--loader:.txt=text",
                "--target=es2019", "--legal-comments=eof", f"--outfile={A / 'pwcheck.js'}", "--log-level=warning"], check=True)
pw_js = (A / "pwcheck.js").read_bytes()
qr_js = (NM / "qrcode-generator/dist/qrcode.js").read_bytes(); (A / "qrcode.js").write_bytes(qr_js)
# tápértéktábla-felismerés (OCR): tesseract.js + magyar nyelvi adat; csak első használatkor töltődik le, nem kerül az előtöltésbe
OCR = A / "ocr"; OCR.mkdir(exist_ok=True)
ocr_js = (NM / "tesseract.js/dist/tesseract.min.js").read_bytes(); (OCR / "tesseract.min.js").write_bytes(ocr_js)
shutil.copy(NM / "tesseract.js/dist/worker.min.js", OCR / "worker.min.js")
for v in ("", "simd-", "relaxedsimd-"): shutil.copy(NM / f"tesseract.js-core/tesseract-core-{v}lstm.wasm.js", OCR / f"tesseract-core-{v}lstm.wasm.js")
shutil.copy(NM / "@tesseract.js-data/hun/4.0.0_best_int/hun.traineddata.gz", OCR / "hun.traineddata.gz")
js_d = js.replace("/*@BOOT@*/", boot).replace("@@SRI_ARGON@@", sri(argon_js)).replace("@@SRI_PW@@", sri(pw_js)).replace("@@SRI_QR@@", sri(qr_js)).replace("@@SRI_OCR@@", sri(ocr_js)).encode()
(A / "app.css").write_bytes(css_d); (A / "app.js").write_bytes(js_d)
for f in ICONDIR.iterdir(): shutil.copy(f, A / f.name)

# ========== vonalkód-olvasó: külön oldal, saját CSP-vel (kamera csak itt) ==========
SC = SRC / "scanner"; ZX = NM / "zxing-wasm/dist"
zx_js = (ZX / "iife/reader/index.js").read_bytes(); (A / "zxing-reader.js").write_bytes(zx_js)
shutil.copy(ZX / "reader/zxing_reader.wasm", A / "zxing_reader.wasm")
sc_js = (SC / "scanner.js").read_bytes(); sc_css = (SC / "scanner.css").read_bytes()
(A / "scanner.js").write_bytes(sc_js); (A / "scanner.css").write_bytes(sc_css)
(PUB / "scanner.html").write_text((SC / "scanner.html").read_text(encoding="utf-8").replace("@@SRI_CSS@@", sri(sc_css))
    .replace("@@SRI_ZX@@", sri(zx_js)).replace("@@SRI_JS@@", sri(sc_js)), encoding="utf-8")
# harmadik féltől származó licencszövegek: a kiszolgált oldallal együtt terjesztjük (Apache-2.0 4. pont, MIT)
(PUB / "licenses").mkdir(exist_ok=True)
for lf in sorted((ROOT / "licenses").glob("*.txt")): shutil.copy(lf, PUB / "licenses" / lf.name)

head = f'''<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://world.openfoodfacts.org; manifest-src 'self'; worker-src 'self'; object-src 'none'; frame-src 'self'; base-uri 'self'; form-action 'self';">
<meta name="google-site-verification" content="Re288jc6stZsam8EJVN-Ufx_lNHClPDe0EuPK0cbYYQ">
<meta name="description" content="Ingyenes, offline edzés- és étkezésnapló: kalória és makrók fotóból vagy leírásból AI-jal (Claude), rekordok, statisztikák. Regisztráció nélkül, adataid a készüléken maradnak.">
<link rel="canonical" href="https://olupan.com/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Olupan">
<meta property="og:locale" content="hu_HU">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:title" content="Olupan – offline edzés- és étkezésnapló">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Olupan – offline edzés- és étkezésnapló">
<meta name="twitter:description" content="Edzés, kalória és makrók (AI-jal fotóból vagy leírásból), testadatok – regisztráció nélkül, minden adat a készüléken marad.">
<meta name="twitter:image" content="https://olupan.com/assets/og-image.png">
<script type="application/ld+json">{LDJSON}</script>
<meta property="og:description" content="Edzés, kalória és makrók (AI-jal fotóból vagy leírásból), testadatok – regisztráció nélkül, minden adat a készüléken marad. · Offline workout, food and body log – no account, your data stays on your device.">
<meta property="og:url" content="https://olupan.com/">
<meta property="og:image" content="https://olupan.com/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Olupan – offline edzés-, étkezés- és testadatnapló">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Olupan">
<link rel="preload" href="/assets/fonts/instrument-sans-400.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="stylesheet" href="/assets/app.css" integrity="{sri(css_d)}" crossorigin="anonymous">'''
html = re.sub(r"<style>.*?</style>", lambda m: head, src, count=1, flags=re.S)
html = html.replace("<title>Olupan</title>", "<title>Olupan – offline edzésnapló és étkezésnapló</title>", 1)
html = html.replace("<main></main>", NOSCRIPT, 1)
html = re.sub(r"<script>.*?</script>", lambda m: f'<script src="/assets/app.js" integrity="{sri(js_d)}" crossorigin="anonymous"></script>', html, count=1, flags=re.S)
html = html.replace('<meta name="apple-mobile-web-app-capable" content="yes">\n', '')
(PUB / "index.html").write_text(html, encoding="utf-8")

manifest = {"id": "/", "name": "Olupan", "short_name": "Olupan", "lang": "hu",
            "description": "Offline edzésnapló – sablonok, testadatok, étkezés, statisztikák. Minden adat a készüléken marad.",
            "start_url": "/", "scope": "/", "display": "standalone",
            "background_color": "#06080b", "theme_color": "#06080b", "categories": ["health", "fitness"],
            "icons": [{"src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                      {"src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
                      {"src": "/assets/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
(PUB / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

# ========== 3. tájékoztató oldalak (útmutató, adatkezelés, jogi nyilatkozat), két nyelven ==========
P = SRC / "pages"; cfg = json.loads((P / "config.json").read_text(encoding="utf-8"))
if not cfg.get("contact_email"):
    print("FIGYELEM: src/pages/config.json → contact_email üres; a jogi oldalakon helyőrző jelenik meg.")
    cfg["contact_email"] = "[KAPCSOLATI E-MAIL]"
cfg["site_short"] = cfg["site"].replace("https://", "")
lcss = (P / "legal.css").read_text(encoding="utf-8").replace("/*@FONTS@*/", "\n".join(f for f in ff_files if "Instrument Sans" in f or "Bricolage" in f)).encode()
ljs = (P / "legal.js").read_text(encoding="utf-8").encode()
(A / "legal.css").write_bytes(lcss); (A / "legal.js").write_bytes(ljs)
DOCS = {"guide": {"hu": ("utmutato.html", "Felhasználói útmutató"), "en": ("guide.html", "User guide")},
        "privacy": {"hu": ("adatvedelem.html", "Adatkezelési tájékoztató"), "en": ("privacy.html", "Privacy Policy")},
        "disclaimer": {"hu": ("jogi-nyilatkozat.html", "Jogi nyilatkozat"), "en": ("disclaimer.html", "Disclaimer")}}
LOGO = ('<svg viewBox="0 0 64 64" aria-hidden="true"><mask id="lm" maskUnits="userSpaceOnUse" x="-8" y="-8" width="80" height="80"><rect x="-8" y="-8" width="80" height="80" fill="#fff"/>'
        '<rect x="5.5" y="4" width="21" height="12" rx="4" stroke="#000" stroke-width="3"/><rect x="5.5" y="48" width="21" height="12" rx="4" stroke="#000" stroke-width="3"/></mask>'
        '<g mask="url(#lm)" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path class="lp" d="M16 10H47a5 5 0 0 1 5 5v34a5 5 0 0 1-5 5H16"/><path class="lp" d="M25 24h17M25 32h11"/></g>'
        '<rect class="la" x="5.5" y="4" width="21" height="12" rx="4"/><rect class="la" x="5.5" y="48" width="21" height="12" rx="4"/><path class="ls" d="M16 12v40" stroke-width="5.5" stroke-linecap="round"/></svg>')
PAGES = []
for key, langs in DOCS.items():
    for lang, (fname, title) in langs.items():
        other = "en" if lang == "hu" else "hu"
        body = (P / f"{key}.{lang}.html").read_text(encoding="utf-8")
        for k, v in cfg.items(): body = body.replace("{{" + k + "}}", str(v))
        t = (lambda hu, en: hu if lang == "hu" else en)
        nav = " ".join(f'<a href="/{DOCS[k][lang][0]}">{DOCS[k][lang][1]}</a>' for k in DOCS if k != key)
        page = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';">
<title>{title} – Olupan</title>
<meta name="description" content="{title} – Olupan, {t("ingyenes offline edzésnapló, étkezés- és testadatnapló. Regisztráció nélkül, minden adat a készüléken marad.", "a free offline workout, food and body log. No account – your data stays on your device.")}">
<link rel="canonical" href="{cfg["site"]}/{fname}">
<link rel="alternate" hreflang="{other}" href="{cfg["site"]}/{DOCS[key][other][0]}">
<link rel="alternate" hreflang="{lang}" href="{cfg["site"]}/{fname}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta name="theme-color" content="#06080b">
<script src="/assets/legal.js" integrity="{sri(ljs)}" crossorigin="anonymous"></script>
<link rel="stylesheet" href="/assets/legal.css" integrity="{sri(lcss)}" crossorigin="anonymous">
</head>
<body>
<header><div class="bar">
<a class="brand" href="/">{LOGO}<span>Olupan</span></a><span class="sp"></span>
<nav class="lang" aria-label="{t("Nyelv", "Language")}">{"<span>HU</span>" if lang == "hu" else f'<a href="/{DOCS[key]["hu"][0]}" hreflang="hu" lang="hu">HU</a>'}{"<span>EN</span>" if lang == "en" else f'<a href="/{DOCS[key]["en"][0]}" hreflang="en" lang="en">EN</a>'}</nav>
</div></header>
<main>
<p><a class="back" href="/">← {t("Vissza az appba", "Back to the app")}</a></p>
<article>
{body}
</article>
</main>
<footer>
<nav>{nav}</nav>
<p>© 2026 {cfg["controller"]} · Olupan</p>
</footer>
</body>
</html>
'''
        (PUB / fname).write_text(page, encoding="utf-8"); PAGES.append("/" + fname)

site = cfg["site"].rstrip("/")
(PUB / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {site}/sitemap.xml\n", encoding="utf-8")
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">', f"  <url><loc>{site}/</loc></url>"]
for key, langs in DOCS.items():
    for lang, (fname, _) in langs.items():
        alts = "".join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{site}/{f}"/>' for l, (f, _) in langs.items())
        sm.append(f"  <url><loc>{site}/{fname}</loc>{alts}</url>")
sm.append("</urlset>")
(PUB / "sitemap.xml").write_text("\n".join(sm) + "\n", encoding="utf-8")
core = ["/", "/index.html", "/manifest.webmanifest", "/scanner.html"] + PAGES + sorted("/" + str(p.relative_to(PUB)).replace("\\", "/") for p in A.rglob("*") if p.is_file() and p.name not in ("og-image.png", "zxing_reader.wasm", "pwcheck.js", "qrcode.js") and "ocr" not in p.relative_to(A).parts)
ver = hashlib.sha256(b"".join((PUB / p.lstrip("/")).read_bytes() for p in core if p != "/")).hexdigest()[:12]
sw = f"""/* Olupan service worker – gyorsítótár: olupan-<tartalom-hash>. A buildet a tools/build.py generálja, ne szerkeszd kézzel. */
const CACHE='olupan-{ver}';
const CORE={json.dumps(core)};
self.addEventListener('install',e=>e.waitUntil((async()=>{{
  const c=await caches.open(CACHE);
  await c.addAll(CORE.map(u=>new Request(u,{{cache:'reload'}})));
  await self.skipWaiting();
}})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{{
  for(const k of await caches.keys())if(k.startsWith('olupan-')&&k!==CACHE)await caches.delete(k);
  await self.clients.claim();
}})()));
self.addEventListener('fetch',e=>{{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith((async()=>{{
    const c=await caches.open(CACHE);
    const hit=await c.match(r,{{ignoreSearch:true}});
    if(hit)return hit;
    /* gyorsítótárban nem szereplő oldal: előbb a hálózat; ha nincs net vagy nincs ilyen oldal, az app */
    if(r.mode==='navigate'){{try{{const res=await fetch(r);if(res.ok)return res}}catch(err){{}}return await c.match('/index.html')||fetch(r)}}
    const res=await fetch(r);
    if(res.ok&&/(\\.wasm|pwcheck\\.js|qrcode\\.js|\\/ocr\\/[^/]+\\.js)$/.test(new URL(r.url).pathname))c.put(r,res.clone()); // a vonalkód-olvasó és a címkefelismerő első használat után offline is elérhető
    return res;
  }})());
}});
self.addEventListener('notificationclick',e=>{{
  e.notification.close();
  e.waitUntil((async()=>{{
    const all=await self.clients.matchAll({{type:'window',includeUncontrolled:true}});
    for(const c of all)if('focus' in c)return c.focus();
    if(self.clients.openWindow)return self.clients.openWindow('/');
  }})());
}});
"""
(PUB / "sw.js").write_text(sw, encoding="utf-8")
print(f"public/ kész · verzió {ver} · {len(acts)} művelet · offline {(PUB / 'olupan-offline.html').stat().st_size // 1024} KB")
