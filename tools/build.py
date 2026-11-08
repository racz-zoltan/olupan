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
ICONS = ["dumbbell","calendar-days","chart-no-axes-combined","settings","plus","x","check",
         "chevron-left","chevron-right","chevron-down","chevron-up","arrow-up","arrow-down","timer","trophy","sun","moon","trash-2","rotate-ccw",
         "save","download","upload","pencil","party-popper","minus","flame","info","share","folder-open","smartphone","footprints","clipboard-paste",
         "circle-help","utensils","target","copy","external-link","shield-check","wifi-off","square-plus","hard-drive","person-standing"]
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
for n in ICONS:
    inner = re.search(r"<svg[^>]*>(.*)</svg>", (NM / f"lucide-static/icons/{n}.svg").read_text(), re.S).group(1)
    syms.append(f'<symbol id="i-{n}" viewBox="0 0 24 24">{re.sub(r"\s+", " ", inner).strip()}</symbol>')
src = src.replace("<!--@ICONS@-->", '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + "".join(syms) + "</svg>")
acts = sorted(set(re.findall(r'data-(?:click|input|change|submit|backdrop)="([A-Za-z_]\w*)', src)))   # műveletek engedélylistája
src = src.replace("/*@ACTIONS@*/", json.dumps(acts))
src = src.replace("/*@I18N@*/", "const EN=" + json.dumps(json.loads((SRC / "i18n" / "en.json").read_text(encoding="utf-8")),
                                                        ensure_ascii=False, separators=(",", ":")) + ";")
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
single = single.replace("</title>", f'</title>\n<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,{fav}">', 1)
(PUB / "olupan-offline.html").write_text(single, encoding="utf-8")

# ========== 2. a webes változat ==========
css_d = css.replace("/*@FONTS@*/", "\n".join(ff_files)).encode()
boot = """if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
  const had=!!navigator.serviceWorker.controller;
  addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(e=>console.warn('Service worker:',e)));
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)toast(L('Új verzió telepítve – a következő indításkor aktív','New version installed – active from the next start'))});
}"""
js_d = js.replace("/*@BOOT@*/", boot).encode()
(A / "app.css").write_bytes(css_d); (A / "app.js").write_bytes(js_d)
for f in ICONDIR.iterdir(): shutil.copy(f, A / f.name)

head = f'''<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';">
<meta name="description" content="Olupan – offline edzésnapló: sablonok, testadatok, étkezés, naptár, erőtrendek és személyes rekordok. Minden adat a készüléken marad.">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Olupan">
<link rel="preload" href="/assets/fonts/instrument-sans-400.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="stylesheet" href="/assets/app.css" integrity="{sri(css_d)}" crossorigin="anonymous">'''
html = re.sub(r"<style>.*?</style>", lambda m: head, src, count=1, flags=re.S)
html = re.sub(r"<script>.*?</script>", lambda m: f'<script src="/assets/app.js" integrity="{sri(js_d)}" crossorigin="anonymous"></script>', html, count=1, flags=re.S)
html = html.replace('<meta name="apple-mobile-web-app-capable" content="yes">\n', '')
(PUB / "index.html").write_text(html, encoding="utf-8")

manifest = {"id": "/", "name": "Olupan", "short_name": "Olupan", "lang": "hu",
            "description": "Offline edzésnapló – sablonok, testadatok, étkezés, statisztikák. Minden adat a készüléken marad.",
            "start_url": "/", "scope": "/", "display": "standalone",
            "background_color": "#0a0f1e", "theme_color": "#0a0f1e", "categories": ["health", "fitness"],
            "icons": [{"src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
                      {"src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
                      {"src": "/assets/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
(PUB / "manifest.webmanifest").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

core = ["/", "/index.html", "/manifest.webmanifest"] + sorted("/" + str(p.relative_to(PUB)).replace("\\", "/") for p in A.rglob("*") if p.is_file())
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
    const hit=await c.match(r,{{ignoreSearch:true}})||(r.mode==='navigate'?await c.match('/index.html'):null);
    return hit||fetch(r);
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
