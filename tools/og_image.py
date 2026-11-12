"""Közösségi előnézeti kép (1200×630) generálása: src/icons/og-image.png. Futtatás: python3 tools/og_image.py (Playwright kell)."""
import asyncio, base64, pathlib
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
NM = ROOT / "node_modules/@fontsource"
def ff(fam, pkg, w):
    d = base64.b64encode((NM / f"{pkg}/files/{pkg}-latin-ext-{w}-normal.woff2").read_bytes()).decode()
    d2 = base64.b64encode((NM / f"{pkg}/files/{pkg}-latin-{w}-normal.woff2").read_bytes()).decode()
    return (f"@font-face{{font-family:'{fam}';font-weight:{w};src:url(data:font/woff2;base64,{d2}) format('woff2')}}"
            f"@font-face{{font-family:'{fam}x';font-weight:{w};src:url(data:font/woff2;base64,{d}) format('woff2')}}")
logo = (ROOT / "src/icons/favicon.svg").read_text()
logo = logo.replace('<rect width="64" height="64" rx="14" fill="#1c2128"/>', '')
HTML = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
{ff('Bri','bricolage-grotesque',700)}{ff('Ins','instrument-sans',400)}{ff('Ins','instrument-sans',600)}
*{{margin:0;box-sizing:border-box}}
body{{width:1200px;height:630px;background:radial-gradient(900px 500px at 85% 15%,#1f3a44 0%,#1c2128 60%);color:#e2e8f0;font-family:'Ins','Insx',sans-serif;padding:72px 80px;position:relative;overflow:hidden}}
.top{{display:flex;align-items:center;gap:26px}}
.top svg{{width:120px;height:120px}}
h1{{font:700 96px/1 'Bri','Brix',sans-serif;letter-spacing:-2px}}
.t{{margin-top:44px;font:600 46px/1.2 'Ins','Insx',sans-serif;max-width:980px}}
.e{{margin-top:14px;font:400 30px/1.3 'Ins','Insx',sans-serif;color:#94a3b8}}
.chips{{position:absolute;left:80px;bottom:64px;display:flex;gap:14px;flex-wrap:wrap;max-width:1040px}}
.chips span{{font:600 24px 'Ins','Insx',sans-serif;padding:10px 20px;border-radius:999px;border:2px solid #22d3ee55;color:#a5f3fc;background:#22d3ee14}}
.url{{position:absolute;right:80px;top:96px;font:600 28px 'Ins','Insx',sans-serif;color:#22d3ee}}
</style></head><body>
<div class="top">{logo}<h1>Olupan</h1></div><div class="url">olupan.com</div>
<div class="t">Offline edzés-, étkezés- és testadatnapló</div>
<div class="e">Offline workout, food &amp; body log · no account, your data stays on your device</div>
<div class="chips"><span>Edzéssablonok &amp; rekordok</span><span>Kalória &amp; makrók AI-jal</span><span>Izomcsoport-statisztika</span><span>Ingyenes · regisztráció nélkül</span></div>
</body></html>"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width": 1200, "height": 630})
        await pg.set_content(HTML); await pg.wait_for_timeout(400)
        await pg.screenshot(path=str(ROOT / "src/icons/og-image.png")); await b.close()
asyncio.run(main())
print("src/icons/og-image.png kész")
