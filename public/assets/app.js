'use strict';
/* ===== Segédfüggvények ===== */
const $=s=>document.querySelector(s);
const DAY=864e5;
const C={blue:'var(--kj-blue-line)',gold:'var(--kj-gold-line)',violet:'var(--kj-violet)',green:'var(--kj-green-line)',red:'var(--kj-red-line)',
  // adattípusok színei – mindenhol ugyanazt jelentik (naptár, statisztika, étkezés)
  weight:'var(--c-weight)',fat:'var(--c-fat)',waist:'var(--c-waist)',steps:'var(--c-steps)',workout:'var(--c-workout)',kcal:'var(--c-kcal)',
  protein:'var(--c-protein)',carb:'var(--c-carb)',fatm:'var(--c-fatm)',fiber:'var(--c-fiber)',cardio:'var(--c-cardio)',volume:'var(--c-volume)',text:'var(--kj-text)'};
const I=(n,c='')=>`<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const z2=n=>String(n).padStart(2,'0');
const ymd=d=>d.getFullYear()+'-'+z2(d.getMonth()+1)+'-'+z2(d.getDate());
const today=()=>ymd(new Date());
const pYmd=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ===== Nyelv / i18n: magyar a forrásnyelv; angolnál a DOM-ot fordítjuk szótár alapján ===== */
const EN={"Fekvenyomás (rúd)":"Bench press (barbell)","Ferde fekvenyomás (kézisúlyzó)":"Incline bench press (dumbbell)","Fekvenyomás (kézisúlyzó)":"Bench press (dumbbell)","Tárogatás (kábel)":"Chest fly (cable)","Tolódzkodás":"Dips","Felhúzás (rúd)":"Deadlift (barbell)","Hát":"Back","Evezés (rúd)":"Bent-over row (barbell)","Húzódzkodás":"Pull-up","Mellhez húzás (kábel)":"Lat pulldown (cable)","Evezés ülve (kábel)":"Seated row (cable)","Evezés (kézisúlyzó)":"Row (dumbbell)","Guggolás (rúd)":"Squat (barbell)","Láb":"Legs","Román felhúzás (rúd)":"Romanian deadlift (barbell)","Lábtolás (gép)":"Leg press (machine)","Kitörés (kézisúlyzó)":"Lunge (dumbbell)","Lábhajlítás (gép)":"Leg curl (machine)","Lábnyújtás (gép)":"Leg extension (machine)","Csípőemelés (rúd)":"Hip thrust (barbell)","Vádliemelés (gép)":"Calf raise (machine)","Katonai nyomás (rúd)":"Overhead press (barbell)","Váll":"Shoulders","Vállból nyomás (kézisúlyzó)":"Shoulder press (dumbbell)","Oldalemelés (kézisúlyzó)":"Lateral raise (dumbbell)","Face pull (kábel)":"Face pull (cable)","Bicepsz hajlítás (kézisúlyzó)":"Biceps curl (dumbbell)","Bicepsz hajlítás (rúd)":"Biceps curl (barbell)","Kalapács hajlítás":"Hammer curl","Tricepsz letolás (kábel)":"Triceps pushdown (cable)","Francia nyomás":"Skull crusher","Hasprés":"Crunch","Törzs":"Core","Lábemelés függésben":"Hanging leg raise","Hasgörgő":"Ab wheel rollout","KB swing (kétkezes)":"KB swing (two-handed)","KB swing (egykezes)":"KB swing (one-handed)","KB goblet guggolás":"KB goblet squat","KB török felállás (get-up)":"KB Turkish get-up","KB nyomás (egykezes)":"KB press (one-handed)","KB evezés":"KB row","KB felhúzás":"KB deadlift","KB front rack guggolás":"KB front rack squat","Fekvőtámasz":"Push-up","Saját testsúly":"Bodyweight","Pike fekvőtámasz":"Pike push-up","Ausztrál húzódzkodás":"Inverted row","Guggolás (saját testsúly)":"Squat (bodyweight)","Kitörés (saját testsúly)":"Lunge (bodyweight)","Bolgár guggolás (saját testsúly)":"Bulgarian split squat (bodyweight)","Csípőemelés (saját testsúly)":"Glute bridge (bodyweight)","Plank (mp)":"Plank (s)","Hegymászó":"Mountain climber","Futás (terep)":"Running (trail)","Kardió":"Cardio","Futás (aszfalt)":"Running (road)","Futópad":"Treadmill","Kerékpár (kültéri)":"Cycling (outdoor)","Terembicikli":"Stationary bike","Evezőgép":"Rowing machine","Elliptikus tréner":"Elliptical","Lépcsőzőgép":"Stair climber","Gyaloglás":"Walking","Túrázás":"Hiking","Úszás":"Swimming","Ugrókötél":"Jump rope","Koncentrált bicepszhajlítás (kézisúlyzó)":"Concentration curl (dumbbell)","Bolgár guggolás (kézisúlyzó)":"Bulgarian split squat (dumbbell)","Padlón nyomás (kézisúlyzó)":"Floor press (dumbbell)","Román felhúzás (kézisúlyzó)":"Romanian deadlift (dumbbell)","Goblet guggolás (kézisúlyzó)":"Goblet squat (dumbbell)","Lábemelés fekve":"Lying leg raise","Push – mell, váll, tricepsz":"Push – chest, shoulders, triceps","Pull – hát, bicepsz":"Pull – back, biceps","Kettlebell – teljes test":"Kettlebell – full body","Kettlebell – ballisztikus":"Kettlebell – ballistic","Saját testsúly – teljes test":"Bodyweight – full body","Saját testsúly – felsőtest":"Bodyweight – upper body","Saját testsúly – láb és törzs":"Bodyweight – legs and core","Kardió – gépek (terem)":"Cardio – machines (gym)","Kardió – szabadtéri":"Cardio – outdoor","Kézisúlyzó A – húzó + láb":"Dumbbell A – pull + legs","Kézisúlyzó B – nyomó + láb":"Dumbbell B – push + legs","Kézisúlyzó":"Dumbbell","Húzódzkodás (fordított fogás)":"Chin-up","Mell":"Chest","Kar":"Arms","Padlón nyomás (rúd)":"Floor press (barbell)","Guggolás (kézisúlyzó)":"Squat (dumbbell)","Állig húzás (rúd)":"Upright row (barbell)","Állig húzás (kézisúlyzó)":"Upright row (dumbbell)","Arnold-nyomás (kézisúlyzó)":"Arnold press (dumbbell)","Előreemelés (kézisúlyzó)":"Front raise (dumbbell)","Ferde pados bicepszhajlítás (kézisúlyzó)":"Incline curl (dumbbell)","Tricepsz nyújtás (rúd)":"Triceps extension (barbell)","Tricepsz nyújtás (kézisúlyzó)":"Triceps extension (dumbbell)","Vádliemelés állva (kézisúlyzó)":"Standing calf raise (dumbbell)","Edzés":"Workout","Étkezés":"Food","Naptár":"Calendar","Test":"Body","Statisztika":"Stats","Beállítások":"Settings","Edzőterem":"Gym","Kézisúlyzó (otthon)":"Dumbbell (home)","(otthon)":"(home)","Betöltési hiba":"Loading error","Mentés sikertelen (tárhely?)":"Saving failed (storage full?)","(törölt gyakorlat)":"(deleted exercise)","leghosszabb táv":"longest distance","leghosszabb idő":"longest time","max súly":"max weight","ismétlés":"reps","becs. 1RM":"est. 1RM","Megerősítés":"Confirm","Mégse":"Cancel","Mentés":"Save","Rendben":"OK","Ismeretlen művelet:":"Unknown action:","Hibás argumentum:":"Invalid argument:","Mentve":"Saved","Egyéb":"Other","Edzés folyamatban":"Workout in progress","Edzés folytatása":"Resume workout","Testadatok":"Body data","Edzésnapló":"Olupan","Pihenő":"Rest","Pihenő leállítása":"Stop rest timer","A személyes egészségcélok elérése érdekében töltsd ki a profiladatokat":"Fill in your profile to get personal health targets","napja nem mentettél":"days since your last backup","Még nem készült mentés":"No backup yet","– az adatok csak ezen az eszközön vannak":"– your data exists only on this device","születési év":"birth year","magasság":"height","aktivitás":"activity","hónapja":"months ago","éve":"years ago","Sablon szerkesztése":"Edit template","Indítás":"Start","Üres sablon":"Empty template","Utoljára:":"Last:","Még nem használt":"Not used yet","Üres edzés indítása":"Start empty workout","Befejezés után a dátummal és időponttal elmentődik az Edzéseim közé – onnan átnevezhető, módosítható, törölhető.":"When finished, it’s saved under My workouts with its date and time – you can rename, edit or delete it there.","Edzéseim":"My workouts","Legutóbbi edzések":"Recent workouts","Kevesebb mutatása":"Show less","Edzéstörténet":"Workout history","· további":"·","további":"more","Régebbi edzések a Naptárban":"Older workouts are in the Calendar","Új sablon":"New template","Sablonok":"Templates","Minden sablon használatban van – fent, az Edzéseim között találod őket.":"All templates are in use – you’ll find them above, under My workouts.","Még nincs sablon.":"No templates yet.","perc kardió":"min cardio","kg volumen":"kg volume","Ismétlés":"Repeat","Sablonként":"As template","Edzés törlése":"Delete workout","Már fut egy edzés. Elveted, és újat indítasz? A rögzített sorozatai elvesznek.":"A workout is already running. Discard it and start a new one? Its logged sets will be lost.","Futó edzés":"Running workout","Elvetés és új":"Discard and start new","Edzés –":"Workout –","Edzés neve":"Workout name","A képernyő nem kapcsol ki edzés közben":"The screen stays on during the workout","ébren":"awake","Pihenőidő ennél a gyakorlatnál":"Rest time for this exercise","Eltávolítás":"Remove","Előző":"Previous","Fel":"Up","Le":"Down","Sorozat kész":"Set done","Sorozat":"Set","· alap":"· default","alap":"default","Táv (km)":"Distance (km)","Súly":"Weight","Idő (perc)":"Time (min)","Perc":"Min","Ism.":"Reps","ism.":"reps","Első alkalom":"First time","Gyakorlat hozzáadása":"Add exercise","Elvetés":"Discard","Edzés befejezése":"Finish workout","Add meg az időt (perc)":"Enter the time (min)","Add meg az ismétlésszámot":"Enter the reps","Eltávolítod a(z)":"Remove","gyakorlatot az edzésből?":"from the workout?","Biztosan elveted az edzést? A rögzített sorozatok elvesznek.":"Discard this workout? Logged sets will be lost.","Edzés elvetése":"Discard workout","Nincs teljesített (pipált) sorozat. Elveted az edzést?":"No completed (checked) sets. Discard the workout?","Üres edzés":"Empty workout","nem pipált sorozat van – ezek nem kerülnek mentésre. Befejezed az edzést?":"unchecked set(s) – these won’t be saved. Finish the workout?","Befejezés":"Finish","Edzés kész":"Workout complete","Sablon frissítése":"Update template","Elmentve az Edzéseim közé":"Saved to My workouts","Sablon frissítve":"Template updated","Mentés sablonként":"Save as template","Sablon neve":"Template name","Sablon mentve":"Template saved","Törlöd a(z)":"Delete the","edzést (":"workout (","Törlés":"Delete","Pihenőidő":"Rest time","Pihenő sorozatok között (mp)":"Rest between sets (s)","alapértelmezett:":"default:","Üresen hagyva a Beállításokban megadott alapértelmezést használja. 0 = nincs pihenőszámláló.":"Leave empty to use the default from Settings. 0 = no rest timer.","Következő sorozat:":"Next set:","Következő sorozat":"Next set","Pihenő vége":"Rest over","Ez a böngésző nem támogatja az értesítéseket":"This browser doesn’t support notifications","Az értesítés nincs engedélyezve a böngésző/telefon beállításaiban":"Notifications are not allowed in the browser/phone settings","Csak https://claude.ai/ kezdetű link adható meg":"Only links starting with https://claude.ai/ are allowed","Link törölve":"Link removed","Link mentve":"Link saved","Pihenő vége – következő sorozat":"Rest over – next set","Keresés…":"Search…","Gyakorlat választása":"Choose exercise","Új gyakorlat":"New exercise","Nincs találat – hozd létre új gyakorlatként.":"No match – create it as a new exercise.","Név":"Name","pl. KB egykezes evezés":"e.g. KB one-arm row","Izomcsoport / kategória":"Muscle group / category","pl. Hát, Kettlebell":"e.g. Back, Kettlebell","Típus":"Type","Erőedzés (súly × ismétlés)":"Strength (weight × reps)","Kardió (táv km × idő perc)":"Cardio (distance km × time min)","Pihenőidő (mp)":"Rest time (s)","Üresen: az alapértelmezett pihenőidőt használja.":"Empty: uses the default rest time.","Már létezik ilyen nevű gyakorlat":"An exercise with this name already exists","Gyakorlatok · sorozatszám":"Exercises · sets","Sorozatok":"Sets","pl. Push nap":"e.g. Push day","Még nincs gyakorlat.":"No exercises yet.","Adj nevet a sablonnak":"Give the template a name","Törlöd a sablont? A korábbi edzések megmaradnak.":"Delete the template? Past workouts are kept.","Sablon törlése":"Delete template","Előző hónap":"Previous month","Következő hónap":"Next month","Testmérés":"Measurement","Lépés":"Steps","Ma":"Today","Volumen":"Volume","Edzés a hónapban":"Workouts this month","Súlyváltozás":"Weight change","Szerkesztés":"Edit","Rögzítés":"Log","Testzsír":"Body fat","Derék":"Waist","· cél:":"· goal:","Nincs mérés erre a napra":"No measurement on this day","Megnyitás":"Open","tétel:":"items:","Rost:":"Fiber:","Fehérje":"Protein","Szénh.":"Carbs","Zsír":"Fat","Nincs rögzített étkezés":"No food logged","Nincs edzés erre a napra":"No workout on this day","Ülő – irodai munka, kevés mozgás":"Sedentary – desk job, little movement","Enyhén aktív – heti 1–3 edzés":"Lightly active – 1–3 workouts/week","Mérsékelten aktív – heti 3–5 edzés":"Moderately active – 3–5 workouts/week","Nagyon aktív – heti 6–7 edzés":"Very active – 6–7 workouts/week","Extrém – fizikai munka + edzés":"Extreme – physical job + training","Fogyás":"Lose weight","Szinten tartás":"Maintain","Izomépítés":"Build muscle","Hízás":"Gain weight","Enyhe":"Gentle","Közepes":"Moderate","Gyors":"Fast","800–6000 kcal között adható meg":"Enter a value between 800 and 6000 kcal","A célsúly nem kisebb a jelenlegi súlynál, közben a cél fogyás.":"The target weight isn’t below your current weight, but the goal is to lose weight.","A célsúly nem nagyobb a jelenlegi súlynál, közben a cél hízás.":"The target weight isn’t above your current weight, but the goal is to gain weight.","A javasolt érték felnőttekre (18+) vonatkozik.":"The suggested value applies to adults (18+).","A javasolt értékhez hiányzik:":"Missing for the suggested value:","Fehérje:":"Protein:",", zsír: az energia":", fat:","%-a, szénhidrát: a maradék, rost: 14 g / 1000 kcal, de legalább 25 g (ebből a több is jó). Tájékoztató becslés, nem orvosi tanács – egészségügyi állapot esetén egyeztesd szakemberrel.":"% of energy, carbs: the rest, fiber: 14 g / 1000 kcal, at least 25 g (more is fine). An informational estimate, not medical advice – with a health condition, consult a professional.","Napi energiaigény":"Daily energy need","Saját napi érték":"Custom daily value","Szénhidrát":"Carbs","Alapanyagcsere (BMR)":"Basal metabolic rate (BMR)","Javasolt napi keret":"Suggested daily budget","Javasolt napi bevitel":"Suggested daily intake","Rost (min.)":"Fiber (min.)","kb.":"approx.","g/ttkg":"g/kg bw","Energiaigény: Mifflin–St Jeor × aktivitás. Korrekció a célhoz:":"Energy need: Mifflin–St Jeor × activity. Adjustment for the goal:","kg/hét fogyás":"kg/week loss","kg/hét gyarapodás":"kg/week gain","súlytartás":"maintenance","A javaslat elérte az alsó határt (":"The suggestion hit the lower limit (","kcal), ennél kevesebbet nem javaslok.":"kcal); I don’t suggest less than that.","(referencia-testsúlyra)":"(for a reference body weight)","Profil és célok":"Profile and goals","Nem":"Sex","Születési év":"Birth year","Magasság (cm)":"Height (cm)","Célsúly (kg)":"Target weight (kg)","Aktivitás":"Activity","– válassz –":"– choose –","Cél":"Goal","Saját napi kalóriaérték (kcal)":"Custom daily calories (kcal)","üresen: a javasolt érték":"empty: the suggested value","Férfi":"Male","Nő":"Female","év":"years","Tempó":"Pace","pl. 1980":"e.g. 1980","pl. 178":"e.g. 178","pl. 80":"e.g. 80","kcal (":"kcal (","kcal)":"kcal)","Reggeli":"Breakfast","Tízórai":"Morning snack","Ebéd":"Lunch","Uzsonna":"Afternoon snack","Vacsora":"Dinner","Nasi / egyéb":"Snack / other","Étkezés beillesztése":"Paste food","Claude válaszának kódblokkja":"Code block from Claude’s reply","2026-11-06;ebéd;Csirkemell 150 g;248;46;0;6;0":"2026-11-06;lunch;Chicken breast 150 g;248;46;0;6;0","Nyomd hosszan a mezőt, majd Beillesztés. Soronként egy tétel: dátum;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír;rost":"Long-press the field, then Paste. One item per line: date;meal;name;kcal;protein;carbs;fat;fiber","Feldolgozás":"Process","A vágólap tartalmában nem találtam étkezés-sort.":"No food lines found on the clipboard.","Nem találtam felismerhető sort":"No recognizable lines found","Ezek a tételek már szerepelnek":"These items are already logged","… és még":"… and","tétel":"items","Összesen":"Total","tétel már szerepelt, azt kihagyom.":"item(s) already logged – skipping them.","tétel mentése":"items – save","tétel mentve":"items saved","Megnevezés":"Name","pl. Zabkása 60 g banánnal":"e.g. Oatmeal 60 g with banana","Energia (kcal)":"Energy (kcal)","Fehérje (g)":"Protein (g)","Szénhidrát (g)":"Carbs (g)","Zsír (g)":"Fat (g)","Rost (g)":"Fiber (g)","Új tétel":"New item","Adj meg megnevezést":"Enter a name","Tétel szerkesztése":"Edit item","Törlöd:":"Delete:","Tétel törlése":"Delete item","Hozzáadva a mai naphoz":"Added to today","Előző nap":"Previous day","Következő nap":"Next day","Nap":"Day","Beillesztés":"Paste","Súgó: Claude-projekt":"Help: Claude project","Kézi":"Manual","Erre a napra még nincs étkezés":"No food logged for this day","A javasolt napi bevitelhez töltsd ki a profilodat a Beállításokban.":"Fill in your profile in Settings to get a suggested daily intake.","Claude-ból":"from Claude","Utolsó 7 nap":"Last 7 days","Hozzáadás a mai naphoz":"Add to today","Rost":"Fiber","Még":"","kcal fér bele a napi keretbe":"kcal left in today’s budget","A javasolt bevitelig még":"To the suggested intake:","kcal-lal a napi keret felett":"kcal over today’s budget","kcal a javasolt bevitelig":"kcal to the suggested intake","kcal-lal a javasolt bevitel felett":"kcal over the suggested intake","A javasolt bevitel megvan":"Suggested intake reached","napi keret":"daily budget","javasolt bevitel":"suggested intake","Az elmúlt":"In the last","napban nincs rögzített étkezés":"days no food was logged","legalább 90%":"at least 90%","7 napos átlag":"7-day average","Átl. eltérés · kcal/nap":"Avg. difference · kcal/day","Alatta / felette":"Under / over","±10%-on belül":"Within ±10%","Napi energia:":"Daily energy:","(tájékoztató):":"(informational):","g fehérje,":"g protein,","g szénhidrát,":"g carbs,","g zsír, legalább":"g fat, at least","Napi keretem":"My daily budget","Javasolt napi bevitelem":"My suggested daily intake","Utasítás a vágólapon":"Instructions copied","Jelöld ki és másold ki kézzel":"Select and copy it manually","Étkezésnapló Claude-dal":"Food log with Claude","Lefényképezed vagy elmondod, mit ettél, Claude kiszámolja a kalóriát, a makrókat és a rostot, és egy kódblokkban adja vissza. Ezt itt egy gombnyomással átveszed. Az Olupanba csak a számok kerülnek, a fotó csak a Claude-ba megy.":"You take a photo or describe what you ate, Claude works out the calories, macros and fiber and returns them in a code block. You bring it in here with one tap. Only the numbers end up in Olupan; the photo goes to Claude only.","1. A projekt létrehozása (egyszer)":"1. Create the project (once)","Nyisd meg a Claude-ot. A projektet legkényelmesebb a":"Open Claude. The project is easiest to create on the","weboldalon létrehozni, de a mobilappban is megy, ha ott is elérhető.":"website, but the mobile app works too if it’s available there.","Bal oldali menü →":"Left menu →","Új projekt":"New project",". Név: pl.":". Name: e.g.","Étkezésnapló":"Food log","A projekt oldalán keresd az":"On the project page, find the","Utasítások":"Instructions","(Instructions / „Projekt utasításainak beállítása”) részt, és illeszd be a lenti szöveget. A":"section (“Set project instructions”) and paste the text below. The","Másolás":"Copy","gomb a vágólapra teszi.":"button puts it on the clipboard.","Mentsd. A projekt ezután a telefonos Claude appban is megjelenik a Projektek között.":"Save it. The project then also appears under Projects in the Claude phone app.","Projektek":"Projects","Másold ki a projekt címét a böngésző címsorából (":"Copy the project’s address from the browser’s address bar (","), és illeszd be a Beállítások →":"), and paste it into Settings →","Claude-projekt linkje":"Claude project link","mezőbe. Ekkor az Étkezés fülön megjelenik a":"field. A","gomb.":"button then appears on the Food tab.","Az utasítás tartalmazza a mostani javasolt napi bevitelt is. Ha a Beállításokban módosítod a profilodat, másold ki és illeszd be újra.":"The instructions include your current suggested daily intake. If you change your profile in Settings, copy and paste them again.","2. Használat étkezésenként":"2. Use for each meal","Claude app →":"Claude app →","→ új beszélgetés (vagy folytasd a napit).":"→ new chat (or continue today’s).","Fotó:":"Photo:","a + vagy kamera ikonnal készíts képet a tányérról.":"use the + or camera icon to photograph your plate.","Szöveg vagy hang:":"Text or voice:","írd be vagy diktáld, pl. „reggelire 60 g zabpehely 2 dl tejjel és egy banán”.":"type or dictate, e.g. “60 g oats with 200 ml milk and a banana for breakfast”.","Ha Claude visszakérdez az adagra, válaszolj. A válasz végén lévő kódblokk sarkában lévő":"If Claude asks about the portion, answer. Copy the code block at the end of the reply with the","másolás":"copy","ikonnal másold ki.":"icon in its corner.","Olupan →":"Olupan →","Beillesztés Claude-ból":"Paste from Claude","Tipp: grammban vagy darabban megadott adaggal sokkal pontosabb a becslés, mint fotóval. A rejtett olaj, a szósz és az adagméret miatt a fotós becslés könnyen 20–30%-ot téved. Ha a vágólapról nem sikerül a beolvasás, a Beillesztés ablakba kézzel is bemásolhatod.":"Tip: portions given in grams or pieces are much more accurate than photos. Hidden oil, sauces and portion size easily make photo estimates 20–30% off. If reading the clipboard fails, you can paste into the Paste window manually.","Nincs új adat – minden érték szerepel már":"No new data – all values are already logged","nap lépésszám,":"days of steps,","testsúly- és":"weight and","testzsírmérés (":"body fat measurements (","új érték":"new values","eltér a már rögzítettől":"differ from what’s logged","már szerepel":"already logged","Egészség adatok átvétele":"Import Health data","Eltérő meglévő értékeknél":"Where existing values differ","az Egészség app értéke legyen (felülírás)":"use the Health app value (overwrite)","a már rögzített érték maradjon":"keep the logged value","érték mentve":"values saved","Vágólap":"Clipboard","Parancs kimenete":"Shortcut output","Egészség adatok beillesztése":"Paste Health data","Nyomd hosszan a mezőt, majd Beillesztés. Hosszabb időszakhoz használd a Fájl gombot.":"Long-press the field, then Paste. For longer periods, use the File button.","A vágólap tartalmában nem találtam felismerhető sort.":"No recognizable lines found on the clipboard.","Beillesztett szöveg":"Pasted text","A fájl nem olvasható":"The file can’t be read","A fájlban nem találtam lépés-, súly- vagy testzsír-sort":"No step, weight or body fat lines found in the file","Egészség app adatai iPhone-ról":"Health app data from iPhone","Egy":"A","Parancsok":"Shortcuts","-parancs kiírja a lépésszámot, a testsúlyt és a testzsír-százalékot egy szövegfájlba; itt a":" shortcut writes your steps, weight and body fat percentage to a text file; here you read it with the","Fájl":"File","gombbal beolvasod. A fájlnak nincs méretkorlátja, így akár több év is átjön (a vágólap kb. 200 napnál elakad). Az adat nem hagyja el a telefont.":"button. The file has no size limit, so even several years come through (the clipboard stops at about 200 days). The data never leaves your phone.","Egészségügyi minták keresése (Steps)":"Find Health Samples (Steps)","Megismétlés … minden elemével":"Repeat with Each …","↳ Szöveg: lepes;Kezdési dátum;Elem ismétlése":"↳ Text: steps;Start Date;Repeat Item","↳ Hozzáadás változóhoz: Egeszseg":"↳ Add to Variable: Health","Ismétlés vége":"End Repeat","… ugyanez Testtömeg (suly) és Testzsír (zsir) …":"… same for Body Mass (weight) and Body Fat (fat) …","A(z) Egeszseg egyesítése Új sorok elválasztóval":"Combine Health with New Lines","Név beállítása: egeszseg.txt":"Set Name: health.txt","Fájl mentése":"Save File","Új művelet:":"New action:","a szerkesztő alján lévő":"type its name into the","Keresés":"Search","mezőbe írd a nevét, koppints rá – a parancs":"field at the bottom of the editor and tap it – it goes to the","végére":"end","kerül; a":"of the shortcut; drag it by its","nevénél":"name","fogva húzható a helyére.":"to move it.","Lépések.":"Steps.","Egészségügyi minták keresése":"Find Health Samples",": Típus":": Type",", Kezdési dátum":", Start Date","benne van ebben: előző 365 nap":"is in the last 365 days","(első alkalommal akár több év), Csoportosítás szempontja:":"(the first time, even several years), Group By:",", Rendezés:":", Sort by:","Kezdési dátum, legrégebbi elöl":"Start Date, oldest first",", Korlát: ki.":", Limit: off.","Ismétlés mindegyikkel":"Repeat with Each","Megismétlés…":"Repeat…","és az":"and","közé) két művelet:":") two actions:","Szöveg":"Text",": írd be:":": type:","Elem ismétlése":"Repeat Item","változó → koppints rá →":"variable → tap it →","Kezdési dátum":"Start Date","(tulajdonság nélkül).":"(no property).","Hozzáadás változóhoz":"Add to Variable","(Add to Variable): a Szöveget add hozzá egy új változóhoz, neve:":": add the Text to a new variable named:","Testsúly.":"Weight.","Újra":"Again","Testtömeg":"Body Mass","(Body Mass), ugyanaz a dátumszűrő, Mértékegység:":", same date filter, Unit:",", Csoportosítás:":", Group By:",", Rendezés: legrégebbi elöl. Utána ugyanaz a ciklus, csak a szöveg eleje":", Sort: oldest first. Then the same loop, only the text starts with",", és ugyanahhoz az":", and add it to the same","változóhoz add hozzá.":"variable.","Testzsír.":"Body fat.","Ugyanígy, Típus":"Same again, Type","Testzsír-százalék":"Body Fat Percentage","(Body Fat Percentage), a szöveg eleje":", the text starts with","A ciklusok után:":"After the loops:","Szöveg egyesítése":"Combine Text","változó, elválasztó:":"variable, separator:","Új sorok":"New Lines","Név beállítása":"Set Name","(Set Name) → az Egyesített szöveg neve:":"→ name the Combined Text:","és a":"and","a legutolsó":"after the last","után":"","álljon, ne a cikluson belül – különben a teljes tartalom minden körben újra kiíródik (az app az azonos sorokat egyszer veszi figyelembe, de a fájl feleslegesen nagy lesz).":"must come after the last loop, not inside it – otherwise the whole content is written again on every pass (the app counts identical lines only once, but the file gets needlessly large).","(Save File) → pl. iCloud Drive / Shortcuts mappa; „Felülírás, ha létezik”: be. Ha a „Kérdezze meg, hová mentse” be van kapcsolva, minden futtatáskor választhatsz helyet.":"→ e.g. iCloud Drive / Shortcuts folder; “Overwrite If File Exists”: on. If “Ask Where to Save” is on, you can pick a location each time.","Futtatás után: Olupan → Test →":"After running it: Olupan → Body →","→ válaszd ki az":"→ choose","-t. Mentés előtt megmutatja, hány új és hány eltérő érték van; eltérésnél választhatsz, melyik maradjon. Egy napon több mérésnél az elsőt (reggelit) veszi.":". Before saving it shows how many values are new or different; for differences you choose which to keep. With several measurements on one day, the first (morning) one is used.","Csak az utolsó ~30 nap jön át?":"Only the last ~30 days come through?","Az iOS adattípusonként korlátozhatja, mennyi régi adatot láthat a Parancsok app. Nézd meg:":"iOS can limit how much past data the Shortcuts app may see, per data type. Check:","Beállítások → Adatvédelem és biztonság → Egészség → Parancsok":"Settings → Privacy & Security → Health → Shortcuts",", és minden használt típusnál (Lépések, Testtömeg, Testzsír) legyen engedélyezve a":", and allow the","teljes":"full","előzmény. Ha a Lépések 30 napra van állítva, a Parancsok a régebbi napokat egyszerűen nem kapja meg, hiba nélkül.":"history for every type used (Steps, Body Mass, Body Fat). If Steps is set to 30 days, Shortcuts simply won’t get older days – with no error.","Fontos:":"Important:","Steps":"Steps","Egeszseg":"Health","egeszseg.txt":"health.txt","→ bemenet:":"→ input:","Mérés rögzítése":"Log measurement","Dátum":"Date","Súly (kg)":"Weight (kg)","Testzsír (%)":"Body fat (%)","Derék (cm)":"Waist (cm)","Lépésszám":"Steps","pl. 8500":"e.g. 8500","Súgó: lépések átvétele":"Help: importing steps","Egészség app":"Health app","Lépésszám, testsúly és testzsír az iPhone Egészség appjából, Parancsok segítségével (leírás a ? gomb alatt) – vagy rögzítsd kézzel fent.":"Steps, weight and body fat from the iPhone Health app via Shortcuts (guide under the ? button) – or log them manually above.","Testsúly":"Body weight","A trend a mérésekre illesztett lineáris regresszió meredeksége heti változásra vetítve – kevésbé érzékeny a napi ingadozásra, mint két mérés különbsége.":"The trend is the slope of a linear regression fitted to the measurements, as a weekly change – less sensitive to daily fluctuation than the difference of two measurements.","Frissítés":"Update","Utolsó súly":"Latest weight","kg/hét":"kg/week","Utolsó testzsír":"Latest body fat","%p/hét":"pp/week","· cél":"· goal","30 napos átlag":"30-day average","Előzmények":"History","Még nincs mérés.":"No measurements yet.","Adj meg legalább egy értéket":"Enter at least one value","A lépésszám 0–200 000 között legyen":"Steps must be between 0 and 200,000","A súly 20–400 kg között legyen":"Weight must be between 20 and 400 kg","A testzsír 2–70% között legyen":"Body fat must be between 2 and 70%","A derékkerület 30–250 cm között legyen":"Waist must be between 30 and 250 cm","mérést?":"measurement?","Mérés törlése":"Delete measurement","Δ 30 nap":"Δ 30 days","Trend 14 nap":"Trend 14 days","Trend 30 nap":"Trend 30 days","Trend 90 nap":"Trend 90 days","30 nap":"30 days","90 nap":"90 days","120 nap":"120 days","Mind":"All","1 év":"1 year","Részletes nézet":"Detailed view","Mérés":"Measurement","Jelenlegi":"Current","Δ 7 nap":"Δ 7 days","Δ 90 nap":"Δ 90 days","Min – max (kg)":"Min – max (kg)","Trend (kg/hét)":"Trend (kg/week)","Célsúly":"Target weight","Hátra (fogyás)":"To go (loss)","Hátra (gyarapodás)":"To go (gain)","Elérted":"Reached","Becsült idő (trend)":"Estimated time (trend)","hét":"weeks","A becsült időhöz a kiválasztott időszak súlytrendjének a cél felé kell mutatnia.":"For an estimated time, the weight trend of the selected period must point towards the goal.","Testzsír %":"Body fat %","Derékbőség":"Waist","Trend (%p/hét)":"Trend (pp/week)","%p":"pp","Energiaegyenleg":"Energy balance","A „várható” az átlagos bevitel és a becsült napi energiaigény (":"“Expected” is calculated from the difference between average intake and estimated daily energy need (","kcal) különbségéből számol (7700 kcal ≈ 1 kg). Ha nagyon eltér a mért trendtől, valószínűleg nem minden étkezés került rögzítésre, vagy az energiaigény becslése pontatlan.":"kcal) (7700 kcal ≈ 1 kg). If it differs a lot from the measured trend, probably not every meal was logged, or the energy need estimate is off.","Átl. egyenleg · kcal/nap":"Avg. balance · kcal/day","Várható · kg/hét":"Expected · kg/week","Mért trend · kg/hét":"Measured trend · kg/week","Napi energia":"Daily energy","A kiválasztott időszak (":"Averages for the selected period (",") átlagai":")","Átlag kcal (időszak)":"Avg. kcal (period)","Átlag fehérje":"Avg. protein","±10%-on belüli nap":"Days within ±10%","Rögzített nap":"Days logged","Átlag szénhidrát":"Avg. carbs","Átlag zsír":"Avg. fat","Átlag rost":"Avg. fiber","Legjobb nap":"Best day","Lépések":"Steps","Utolsó 30 nap":"Last 30 days","Az elmúlt 30 napban nincs lépésadat":"No step data in the last 30 days","7 napos átlag (időszak)":"7-day average (period)","Átlag (időszak)":"Average (period)","Cél teljesítve":"Goal met","Edzések":"Workouts","Edzésszám hetente":"Workouts per week","Összes edzés":"Total workouts","Ebben a hónapban":"This month","Átlag / hét (12 hét)":"Avg. / week (12 weeks)","Heti volumen (kg)":"Weekly volume (kg)","Volumen = súly × ismétlés, a pipált erősorozatokra összeadva. A saját testsúlyos (0 kg) és a kardió sorozatok nem számítanak bele.":"Volume = weight × reps, summed over checked strength sets. Bodyweight (0 kg) and cardio sets are not included.","Átlag / edzés (időszak)":"Avg. / workout (period)","Utolsó 4 hét vs. előző 4":"Last 4 weeks vs. previous 4","Az elmúlt 12 hétben nincs erőedzés-volumen":"No strength volume in the last 12 weeks","Edzésenként (időszak)":"Per workout (period)","5 edzéses átlag":"5-workout average","Legnagyobb volumenű edzés az időszakban:":"Highest-volume workout in the period:","Edzéstrend":"Training trend","Rögzíts edzéseket a trendekhez.":"Log workouts to see trends.","Becs. 1RM":"Est. 1RM","Tempó (perc/km)":"Pace (min/km)","perc/km":"min/km","Max ismétlés":"Max reps","Max súly":"Max weight","Gyakorlat":"Exercise","Alkalom (időszak)":"Sessions (period)","Legutóbbi":"Latest","Változás (időszak)":"Change (period)","Személyes rekordok":"Personal records","Becsült 1RM: Epley-képlet (súly × (1 + ism./30)). Koppints egy sorra az erőtrendhez.":"Estimated 1RM: Epley formula (weight × (1 + reps/30)). Tap a row for the strength trend.","Max ism.":"Max reps","Legjobb sorozat":"Best set","Leghosszabb táv":"Longest distance","Leghosszabb idő":"Longest time","Még nincs rekord.":"No records yet.","Étkezési energia":"Food energy","Edzések / hét":"Workouts / week","Volumen / hét":"Volume / week","elhanyagolható":"negligible","gyenge":"weak","közepes":"moderate","erős":"strong","Magyarázat":"Explanation","Kevés adat":"Not enough data","kevés adat":"not enough data","Összesítő trend":"Combined trend","átl.":"avg.","Minden vonal a saját átlagához képest mutatja a le-fel mozgást (0 = az időszak átlaga, ±1 = egy szórásnyi eltérés), simítva: testsúly, étkezés, lépés 7 napos, testzsír 21 napos átlag, edzés és volumen: az előző 7 nap edzésszáma, illetve megmozgatott összsúlya. Mérés nélküli napokon a vonal a következő értékig összeköt. Így a különböző mértékegységű adatok egy grafikonon összevethetők; a pontos értéket koppintásra mutatja. A lenti gombokkal ki-be kapcsolhatod az adatsorokat.":"Each line shows movement relative to its own average (0 = the period average, ±1 = one standard deviation), smoothed: weight, food and steps as 7-day, body fat as 21-day averages; workouts and volume as the previous 7 days’ count and total weight lifted. On days without data the line connects to the next value. This lets data in different units be compared on one chart; tap for the exact value. Use the buttons below to toggle series.","Étkezési energia (7 napos átlag)":"Food energy (7-day average)","Lépések (7 napos átlag)":"Steps (7-day average)","Edzések az előző 7 napban":"Workouts in the previous 7 days","Edzésvolumen az előző 7 napban":"Training volume in the previous 7 days","Összefüggések (":"Correlations (","nap)":"days)","Tényező":"Factor","Testsúly heti változása":"Weekly weight change","Testzsír 2 heti változása":"2-week body fat change","Ebben az időszakban a testsúly változásával leginkább a(z)":"In this period, weight change moved most closely with","mozgott együtt (r =":"(r =","– ha nőtt, a testsúly is inkább nőtt":"– when it rose, weight tended to rise too","– ha nőtt, a testsúly inkább csökkent":"– when it rose, weight tended to fall","Korrelációs együttható (r, −1…+1): az adott tényező szintje és az ugyanarra az időszakra eső súly-, illetve zsírváltozás együttmozgása. Pozitív: együtt nőnek; negatív: ellentétesen mozognak. Legalább 20 közös nap kell hozzá, és az együttmozgás nem bizonyít ok-okozatot – egy-egy rendhagyó hét (betegség, utazás) is erősen befolyásolhatja. A testzsír-mérés (főleg otthoni mérlegnél) zajos, ott a jelzés óvatosabban értelmezendő.":"Correlation coefficient (r, −1…+1): how the factor’s level moves together with the weight or fat change in the same period. Positive: they rise together; negative: they move in opposite directions. It needs at least 20 shared days, and correlation doesn’t prove causation – a single unusual week (illness, travel) can have a strong effect. Body fat measurements (especially on home scales) are noisy, so read that column with more caution.","A zsírtömeg többel csökkent, mint a testsúly – a zsírmentes tömeg (izom, víz) közben nőtt.":"Fat mass fell more than body weight – lean mass (muscle, water) increased meanwhile.","A testsúly csökkent, de a zsírtömeg nem – a fogyás zsírmentes tömegből (izom, víz) származott.":"Body weight fell but fat mass didn’t – the loss came from lean mass (muscle, water).","A fogyás kb.":"About","zsírból származott":"of the loss came from fat","%-a":"%","– ez arra utalhat, hogy izom is fogyott; a fehérjebevitel és az erőedzés segít megőrizni.":"– this may mean some muscle was lost too; protein intake and strength training help preserve it.","A testsúly nőtt, a zsírtömeg csökkent – a gyarapodás zsírmentes tömeg.":"Body weight rose while fat mass fell – the gain is lean mass.","A gyarapodás kb.":"About","zsírmentes tömeg (izom, víz),":"of the gain is lean mass (muscle, water),","%-a zsír.":"% is fat.","A testsúly alig változott, a zsírtömeg csökkent – testösszetétel-javulás.":"Body weight barely changed while fat mass fell – improved body composition.","A testsúly alig változott, a zsírtömeg nőtt.":"Body weight barely changed while fat mass rose.","A testösszetétel érdemben nem változott.":"Body composition didn’t change meaningfully.","Testösszetétel változása":"Body composition change","· testzsír":"· body fat","Zsírtömeg":"Fat mass","Zsírmentes tömeg":"Lean mass","A testösszetétel-változáshoz legalább két testzsír-mérés kell az időszakban.":"Body composition change needs at least two body fat measurements in the period.","Ebben az időszakban nincs adat":"No data in this period","Az elmúlt 12 hétben nincs edzés":"No workouts in the last 12 weeks","cél":"goal","üres":"empty","nem Strong-formátum":"not Strong format","Ez nem Strong CSV-exportnak tűnik":"This doesn’t look like a Strong CSV export","Nem találtam edzést a fájlban":"No workouts found in the file","Mind a(z)":"All","edzés szerepel már – nincs mit importálni":"workouts are already logged – nothing to import","Import a Strong appból":"Import from the Strong app","A súlyok mértékegysége az exportban":"Weight unit in the export","font (lbs) – átváltom kg-ra":"pounds (lbs) – convert to kg","Importálás":"Import","edzés (":"workouts (","sorozat,":"sets,","gyakorlat – ebből":"exercises – of these","a meglévőkhöz rendelve,":"matched to existing ones,","új lesz.":"will be new.","edzés már szerepel (azonos kezdési idő), ezeket kihagyom.":"workouts already logged (same start time) – skipping them.","üres sort (0 ismétlés) kihagyok.":"empty rows (0 reps) skipped.","Import kész":"Import complete","edzés és":"workouts and","sorozat importálva.":"sets imported.","Az új gyakorlatokat a Beállítások → Gyakorlatok listában átnevezheted, kategorizálhatod.":"You can rename and categorize new exercises under Settings → Exercises.","sablon jött létre a gyakran használt edzésnevekből (az Edzéseim között).":"templates were created from frequently used workout names (under My workouts).","Új gyakorlatok:":"New exercises:","Adatvédelem és offline működés":"Privacy and offline use","Főképernyős appként fut":"Running as a home screen app","Böngészőben fut":"Running in the browser","Offline is elérhető":"Available offline","Offline mód még nem aktív":"Offline mode not active yet","Minden adat csak ezen az eszközön van.":"All data stays on this device.","Nincs regisztráció, fiók, szerver, analitika, süti vagy követés. Az edzések, testadatok, étkezések és a profil a böngésző helyi tárhelyén maradnak; az app semmit nem küld el sehova.":"No sign-up, account, server, analytics, cookies or tracking. Workouts, body data, food and your profile stay in the browser’s local storage; the app sends nothing anywhere.","Internet nélkül is működik.":"Works without internet.","Az első megnyitás után a teljes app a telefonon tárolódik, edzőteremben, térerő nélkül is használható. Ha van net, a frissítés automatikusan letöltődik.":"After the first visit the whole app is stored on your phone, so it works in the gym without signal. Updates download automatically when you’re online.","Natív appként is használható.":"Use it like a native app.","iPhone-on Safariban:":"On iPhone in Safari:","Megosztás":"Share","Főképernyőhöz adás":"Add to Home Screen",". Androidon Chrome-ban: menü →":". On Android in Chrome: menu →","Alkalmazás telepítése":"Install app",". Utána saját ikonról, teljes képernyőn, címsor nélkül indul, mint egy letöltött app.":". It then starts from its own icon, full screen, without an address bar, like a downloaded app.","iPhone-on érdemes telepíteni.":"On iPhone, install it.","A Safari a sokáig nem látogatott oldalak helyi adatait törölheti, a főképernyős appokra ez nem vonatkozik. A főképernyős app és a Safari":"Safari may delete local data of sites you haven’t visited for a while; this doesn’t apply to home screen apps. The home screen app and Safari use","külön tárhelyet":"separate storage","használ: ami az egyikben van, az a másikban nem látszik – áthozni Mentés + Import segítségével lehet.":": what’s in one doesn’t show in the other – move it with Save + Import.","A mentés a te kezedben van.":"Backups are in your hands.","Mivel nincs szerver, eszközcsere vagy az app törlése esetén csak a saját mentésedből állítható vissza minden. A":"As there’s no server, after changing devices or deleting the app, everything can only be restored from your own backup. Put the","Mentés / megosztás":"Save / share","fájlt a Drive-ra, iCloudba vagy a Fájlokba teheted.":"file on Drive, iCloud or in Files.","Étkezésnaplózás Claude-dal:":"Food logging with Claude:","a gomb a Claude appot nyitja meg; amit ott leírsz vagy lefényképezel, az Anthropic szolgáltatásához kerül. Az Olupanba csak az kerül, amit vágólapról beillesztesz.":"the button opens the Claude app; what you describe or photograph there goes to Anthropic’s service. Only what you paste from the clipboard ends up in Olupan.","Indulási nézet":"Start screen","Ez a fül nyílik meg az app indításakor. Ha edzés van folyamatban, mindig az Edzés nyílik.":"This tab opens when the app starts. If a workout is in progress, Workout always opens.","Megjelenés":"Appearance","Rendszer szerint":"System","Világos":"Light","Sötét":"Dark","Kiemelőszín sötét módban":"Accent colour in dark mode","Ciánkék":"Cyan","Sötétnarancs":"Dark orange","A gombok, a kiválasztott elemek és az aktív menüpont színe. Világos módban mindig ciánkék.":"Colour of buttons, selected items and the active tab. Always cyan in light mode.","Alapértelmezett pihenőidő (mp)":"Default rest time (s)","Pipálás után indul. Gyakorlatonként felülírható (edzés közben a gyakorlat neve alatti időre koppintva, vagy lent a listában). 0 = kikapcsolva.":"Starts when you check a set. Can be set per exercise (tap the time under the exercise name during a workout, or in the list below). 0 = off.","Hangjelzés a pihenő végén":"Sound at the end of rest","Ki":"Off","Halk":"Quiet","Hangos":"Loud","Teszt":"Test","Be":"On","iPhone-on a némító kapcsoló (csengő ki) a hangot is elnémítja. Lezárt képernyőnél vagy háttérben a böngésző szünetelteti az időzítőt – ezt a lenti ébren tartás megelőzi.":"On iPhone the silent switch also mutes the sound. With the screen locked or in the background the browser pauses the timer – keeping the screen awake (below) prevents this.","Visszajelző hangok és rezgés":"Feedback sounds and haptics","Gombok":"Buttons","Gépelés":"Typing","Kész sorozat":"Set done","Rezgés":"Haptics","Koppintásra halk kattanás, gépeléskor finom tikk, sorozat kipipálásakor rövid „siker” dallam és enyhe rezgés. A pihenő-hangjelzéstől függetlenül kapcsolhatók. A rezgés Androidon és iPhone-on iOS 18-tól működik; iPhone-on a némító kapcsoló a hangokat is elnémítja, és ha a billentyűzet kattanása be van kapcsolva az iOS-ben, a gépelés-hangot érdemes kikapcsolni.":"A soft click on taps, a gentle tick when typing, and a short “success” chime with a light vibration when you check a set. Independent of the rest sound. Haptics work on Android and on iPhone from iOS 18; on iPhone the silent switch also mutes these, and if keyboard clicks are on in iOS, turn off the typing sound.","Értesítés a pihenő végén, ha az app háttérben van":"Notify at the end of rest when the app is in the background","Androidon és számítógépen értesítés jelenik meg, ha pihenő közben másik appra váltasz. iPhone-on a rendszer a háttérbe tett webappot felfüggeszti, és szerver nélkül nem lehet időzített értesítést küldeni – ott visszatéréskor azonnal szól, és jelzi, mennyi ideje járt le. Megbízható megoldás iPhone-on: a képernyő ébren tartása és az app előtérben hagyása.":"On Android and desktop a notification appears if you switch to another app during rest. On iPhone the system suspends background web apps and timed notifications aren’t possible without a server – there it alerts you as soon as you return and shows how long ago rest ended. Reliable on iPhone: keep the screen awake and the app in front.","Képernyő ébren tartása edzés közben":"Keep screen awake during workouts","Futó edzés alatt a képernyő nem sötétül el és nem zár le, így a pihenő-visszaszámlálás és a hangjelzés is működik. Az edzés befejezésekor automatikusan kikapcsol. Több akkumulátort fogyaszt.":"During a workout the screen doesn’t dim or lock, so the rest countdown and sound keep working. Turns off automatically when the workout ends. Uses more battery.","Ez a böngésző nem támogatja (iPhone-on iOS 16.4 vagy újabb kell).":"Not supported by this browser (iPhone needs iOS 16.4 or later).","Claude-projekt linkje (étkezésnapló)":"Claude project link (food log)","A claude.ai-on nyisd meg a projektet, és másold be a címsorból. Az Étkezés fülön a „Claude” gomb ezt nyitja meg új böngészőlapon.":"Open the project on claude.ai and copy it from the address bar. The “Claude” button on the Food tab opens it in a new tab.","Napi lépéscél":"Daily step goal","nincs cél":"no goal","A statisztikában szaggatott vonal jelzi, a célt elérő napok zöldek. Üresen hagyva nincs cél.":"Shown as a dashed line in stats; days reaching the goal are green. Leave empty for no goal.","Minden adat csak ezen az eszközön, a böngésző helyi tárhelyén van – semmi nem kerül szerverre. A":"All data is only on this device, in the browser’s local storage – nothing goes to a server.","a telefon megosztás menüjét nyitja meg: innen menthetsz Google Drive-ra, a Fájlok appba vagy iCloud Drive-ra. Visszatöltés:":"opens your phone’s share menu: save to Google Drive, the Files app or iCloud Drive from there. Restore:",", majd a fájl kiválasztása (a Drive is megjelenik a fájlválasztóban, ha telepítve van).":", then pick the file (Drive also shows in the file picker if installed).","Utolsó mentés":"Last backup","Még nem volt":"Never","Export CSV-ben":"Export as CSV","Strong-formátum":"Strong format","Étkezés – tételek":"Food – items","makrók, rost":"macros, fiber","Étkezés – napi":"Food – daily","összesítő":"summary","Import":"Import","A magyar táblázatok pontosvesszővel és tizedesvesszővel készülnek (Excel, Numbers közvetlenül megnyitja). Az edzések a Strong app CSV-formátumában, így ide vagy más appba vissza is importálhatók.":"Files use commas and decimal points (Excel and Numbers open them directly). Workouts are in the Strong app’s CSV format, so they can be imported back here or into other apps.","Import Strong appból (CSV)":"Import from Strong (CSV)","Strong app → Profil → Beállítások → Adatok exportálása. Az edzéseket hozzáadja a meglévőkhöz; az újraimportált (azonos kezdési idejű) edzéseket kihagyja.":"Strong app → Profile → Settings → Export data. Workouts are added to existing ones; re-imported workouts (same start time) are skipped.","Mintaadatok":"Sample data","Gyakorlatok":"Exercises","Minden törlése":"Delete everything","Új":"New","Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)":"Icons: Lucide (ISC) · Fonts: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)","edzés":"workouts","Mentés kész":"Backup ready","Gyakorlat szerkesztése":"Edit exercise","Edzésben már szerepel – csak szerkeszthető":"Already used in workouts – edit only","gyakorlatot? A sablonokból is kikerül.":"exercise? It’s also removed from templates.","Gyakorlat törlése":"Delete exercise","Ehhez még nincs adat":"No data for this yet","CSV elkészült":"CSV ready","Hibás vagy nem támogatott fájl":"Invalid or unsupported file","A fájlban":"The file contains","mérés van. Felülírja a jelenlegi adatokat?":"measurements. Overwrite the current data?","Felülírás":"Overwrite","Importálva":"Imported","Minden edzés, mérés, sablon és saját gyakorlat törlődik erről az eszközről. Érdemes előtte exportálni.":"All workouts, measurements, templates and custom exercises will be deleted from this device. Consider exporting first.","Minden adat törlése":"Delete all data","Tovább":"Continue","Ez nem vonható vissza. Biztosan törlöd?":"This can’t be undone. Delete everything?","Utolsó megerősítés":"Final confirmation","Végleges törlés":"Delete permanently","Kb. 4 hónapnyi mintaadatot (edzéseket és méréseket) adok hozzá a meglévőkhöz. Később a „Minden törlése” gombbal eltávolítható.":"Adds about 4 months of sample data (workouts and measurements) to your existing data. Remove it later with “Delete everything”.","Hozzáadás":"Add","Mintaadatok betöltve":"Sample data loaded","Zabkása 60 g tejjel, banán":"Oatmeal 60 g with milk, banana","Rántotta 3 tojásból, kenyér":"Scrambled eggs (3), bread","Görög joghurt 200 g":"Greek yogurt 200 g","Lazac 150 g, zöldség":"Salmon 150 g, vegetables","Túrós tészta":"Pasta with cottage cheese","Fehérjeszelet":"Protein bar","Csirkemell 150 g, rizs 180 g":"Chicken breast 150 g, rice 180 g","Bolognai spagetti":"Spaghetti bolognese","Alma, mandula 30 g":"Apple, almonds 30 g","Energia":"Energy","kcal fér bele":"kcal left","Nincs új adat":"No new data","perc":"min","mp":"s","nap":"days","sorozat":"sets","nincs":"None","keret":"budget","javasolt":"suggested","alatta":"below","felette":"over",", a ciklusba (a":", into the loop (between","alkalom":"sessions","napi":"daily","lepes;":"steps;","suly;":"weight;","zsir;":"fat;","sorozatonként":"one row per set","A magyar táblázatok pontosvesszővel és tizedesvesszővel készülnek (Excel, Numbers közvetlenül megnyitja). Az edzések sorozatonként egy sorban, így ide vissza is importálhatók.":"Files use commas and decimal points (Excel and Numbers open them directly). Workouts have one row per set, so they can be imported back here.","Edzések importálása (CSV)":"Import workouts (CSV)","Minta":"Sample","Edzések importálása":"Import workouts","Soronként egy sorozat. Kötelező oszlopok:":"One set per row. Required columns:","(ÉÉÉÉ-HH-NN ÓÓ:PP),":"(YYYY-MM-DD HH:MM),","(kg),":"(kg),","; ajánlott:":"; recommended:","(pl. 55m), kardióhoz":"(e.g. 55m), for cardio","(km) és":"(km) and",". Az azonos dátumú és nevű sorokból lesz egy edzés. Elválasztó: vessző vagy pontosvessző. A":". Rows with the same date and name form one workout. Separator: comma or semicolon. The","gomb egy kitölthető példafájlt ad. Az edzéseket hozzáadja a meglévőkhöz; az azonos kezdési idejűeket kihagyja.":"button gives you an example file to fill in. Workouts are added to existing ones; ones with the same start time are skipped.","A fájl szerkezete nem megfelelő – nézd meg a Minta fájlt":"The file structure isn’t valid – see the Sample file","hibás szerkezet":"invalid structure","Edzés-import minta":"Workout import sample","Ha pihenő közben másik appra váltasz, a pihenő végén értesítés jelenik meg. Androidon, számítógépen és újabb iPhone-okon (iPhone 17-en kipróbálva) működik; régebbi iOS-en a rendszer a háttérbe tett webappot felfüggesztheti – ott visszatéréskor azonnal szól, és jelzi, mennyi ideje járt le. iPhone-on csak a főképernyőre telepített app küldhet értesítést.":"If you switch to another app during rest, a notification appears when rest ends. Works on Android, desktop and newer iPhones (tested on iPhone 17); on older iOS the system may suspend background web apps – there it alerts you as soon as you return and shows how long ago rest ended. On iPhone only the home-screen app can send notifications.","Napi frissítéshez elég a dátumszűrőt „előző 30 nap”-ra állítani – az újraolvasás nem duplikál. A korábbi, csak lépésszámos (vágólapos) parancsod is működik tovább a Beillesztés gombbal. A testzsírt az app akkor is helyesen kezeli, ha a parancs törtként (0,215) adja ki. A műveletnevek iOS-verziónként kicsit eltérhetnek.":"For daily updates, setting the date filter to “last 30 days” is enough – re-reading doesn’t duplicate. An older steps-only (clipboard) shortcut keeps working with the Paste button. Body fat is handled correctly even if the shortcut outputs it as a fraction (0.215). Action names can differ slightly between iOS versions.","Kiemelőszín":"Accent colour","A gombok, a kiválasztott elemek és az aktív menüpont színe, világos és sötét módban is.":"Colour of buttons, selected items and the active tab, in both light and dark mode.","Mintaadat csak üres naplóba tölthető be":"Sample data can only be loaded into an empty log","iPhone-on a némítás (csengő ki / Action gomb) a hangot is elnémítja, és a hangerőt a médiahangerő szabályozza. Lezárt képernyőnél vagy háttérben a böngésző szünetelteti az időzítőt – ezt a lenti ébren tartás megelőzi.":"On iPhone, silent mode (ring switch / Action button) also mutes the sound, and the level follows the media volume. With the screen locked or in the background the browser pauses the timer – keeping the screen awake (below) prevents this.","Olupan mentés":"Olupan backup","Tudnivalók":"About","Felhasználói útmutató":"User guide","Adatkezelési tájékoztató":"Privacy Policy","Jogi nyilatkozat":"Disclaimer","Az Olupan nem orvosi alkalmazás; a javasolt értékek tájékoztató becslések.":"Olupan is not a medical app; suggested values are informational estimates.","© 2026 Rácz Zoltán · Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)":"© 2026 Zoltán Rácz · Icons: Lucide (ISC) · Fonts: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)","A projekt Context (fájlok) részéhez add hozzá a receptfájlt, amelyet a lenti Receptfájl letöltése gombbal kapsz. Ebbe kerülnek a saját receptjeid: elég a hozzávalókat felsorolni, a kalóriát, a makrókat és a rostot Claude számolja ki.":"Add the recipe file to the project’s Context (files) section – you get it with the Download recipe file button below. Your own recipes go in it: just list the ingredients, and Claude calculates the calories, macros and fiber.","Receptfájl letöltése":"Download recipe file","Receptfájl elkészült":"Recipe file ready","Olupan – receptek":"Olupan – recipes","Saját recept: írd azt, hogy „reggelire 1 adag zabkása”, és Claude a receptfájl hozzávalóiból számol. Új receptet a beszélgetésben is megadhatsz; ha szeretnéd, hogy minden beszélgetésben elérhető legyen, kérd el a frissített receptfájlt, és cseréld le vele a projektben lévőt.":"Own recipes: write “1 serving of breakfast porridge for breakfast”, and Claude calculates from the recipe file’s ingredients. You can also give a new recipe in the chat; to make it available in every chat, ask for the updated recipe file and replace the one in the project.","Korábbi dátum":"Earlier date","Hova kerüljenek?":"Where should they go?","Mégis rögzítem":"Log anyway","Kihagyom":"Skip","Nem maradt rögzítendő tétel":"Nothing left to log","Áthelyezés a sablonok közé":"Move to templates","Vissza az Edzéseim közé":"Back to My workouts","Jegyzetek":"Notes","Korábbi edzéseim":"Earlier workouts","A jegyzet az edzés sablonjához kerül, így a következő alkalommal itt olvashatod.":"Notes are saved to the workout’s template, so you can read them here next time.","Új jegyzet":"New note","Jegyzet":"Note","Jegyzet törlése":"Delete note","Bezárás":"Close","Még nincs jegyzet.":"No notes yet.","Törlöd a jegyzetet?":"Delete this note?","Visszakerült az Edzéseim közé":"Moved back to My workouts","Áthelyezve a sablonok közé":"Moved to templates","Előző bejegyzés":"Previous entry","Következő bejegyzés":"Next entry",". Mentés előtt megmutatja a tételeket; a már rögzítettekre és a korábbi napra szólókra rákérdez.":". Before saving, it shows the items and asks about ones already logged or dated to an earlier day.","Naptár megnyitása":"Open calendar","Vissza a beállításokhoz":"Back to settings","Vissza a mai naphoz":"Back to today","Edzések és sablonok":"Workouts and templates","Vissza a mai napra":"Back to today","Vissza a futó edzéshez":"Back to the running workout","Vissza az edzéshez":"Back to workout","kcal maradt":"kcal left","a keretből":"of target","Étkezés megnyitása":"Open food","kcal elfogyasztva":"kcal eaten","Kalóriakeret: Beállítások → Profil és célok.":"Calorie target: Settings → Profile and goals.","Testadatok megnyitása":"Open body data","% testzsír":"% body fat","cm derék":"cm waist","lépés":"steps","Mai edzés":"Today’s workout","Tervezett edzés":"Planned workout","Csere":"Change","Edzés indítása":"Start workout","Nem volt edzés":"No workout","Pihenőnap":"Rest day","Erre a napra nincs tervezett edzés.":"No workout planned for this day.","Ma nincs tervezett edzés.":"No workout planned for today.","Tervezd meg a mai edzést":"Plan today’s workout","Edzés tervezése":"Plan a workout","Még egy edzés":"One more workout","Válaszd ki, mit edzel – a főképernyőn csak ez látszik.":"Choose what you’ll train – only this shows on the home screen.","Terv törlése":"Remove plan","Mai tervnek":"Plan for today","Tervbe":"Plan","Indítás most":"Start now","Minden adat ezen a készüléken marad.":"All data stays on this device.","Adatok":"Data","Profil":"Profile","Kalória- és makrócélok":"Calorie and macro targets","Téma":"Theme","Nyelv":"Language","Alapértelmezett pihenőidő":"Default rest time","Hangok és rezgés":"Sounds and haptics","Értesítés a pihenő végén":"Rest-end notification","Képernyő ébren tartása":"Keep screen awake","Claude-projekt és receptfájl":"Claude project and recipe file","Egészség":"Health","Lépés, súly, testzsír az iPhone-ról":"Steps, weight, body fat from iPhone","Export CSV-be":"Export to CSV","Rózsaszín":"Pink","Claude-projekt útmutató":"Claude project guide","A claude.ai-on nyisd meg a projektet, és másold be a címsorból. Az Étkezés oldalon a „Claude” gomb ezt nyitja meg új böngészőlapon.":"Open the project on claude.ai and copy it from the address bar. The “Claude” button on the Food page opens it in a new tab.","testsúly (Test kártya)":"body weight (Body card)","), és illeszd be a Beállítások → Étkezés →":"), and paste it into Settings → Food →","Tárolás":"Storage","Adatok mérete":"Data size","Hely":"Location","Tartós tárolás":"Persistent storage","Minden adat ezen a készüléken marad. A rendszeres mentés ettől függetlenül fontos: eszközcserénél vagy az app törlésekor csak abból állítható vissza minden.":"All data stays on this device. Regular backups still matter: when you change devices or delete the app, they are the only way to restore everything.","Étkezési preferenciák":"Food preferences","A Menüjavaslat gombok ezeket küldik el a Claude-projektednek, a kalóriakerettel együtt. Csak ezen a készüléken tárolódnak.":"The Meal suggestion buttons send these to your Claude project, together with your calorie target. They are stored only on this device.","Étrend":"Diet","Kerülendő összetevők":"Foods to avoid","Stílus":"Style","Főzési gyakorlat":"Cooking level","Hány főre főzöl":"Cooking for","Étkezés naponta":"Meals per day","Konyhai eszközök (nem kötelező)":"Kitchen equipment (optional)","Menüjavaslat":"Meal suggestion","Mit egyek még ma?":"What should I eat today?","Napi menü":"Daily menu","Heti menü":"Weekly menu","Ezt a kérést másolja ki az app a Claude-projektedbe. Beillesztés előtt átírhatod.":"The app copies this request for your Claude project. You can edit it before pasting.","Add meg a Claude-projekt linkjét a Beállítások → Étkezés részben, és a gomb meg is nyitja.":"Add your Claude project link in Settings → Food and the button will open it too.","Másolás és Claude":"Copy and open Claude","Kérés a vágólapon – illeszd be a Claude-ba":"Request copied – paste it into Claude","Bemelegítő sorozat – koppints a munkasorozathoz":"Warm-up set – tap to make it a working set","Koppints: bemelegítő sorozat":"Tap: warm-up set","Javaslat:":"Suggestion:","Kitöltés":"Fill in","Tárcsák":"Plates","Tárcsakalkulátor":"Plate calculator","Rúd (kg)":"Bar (kg)","Elérhető tárcsák":"Available plates","Oldalanként":"Per side","Gyors rögzítés":"Quick log","Korábbi étkezések":"Earlier meals","Gyakori tételek":"Frequent items","Kész":"Done","Ismét":"Again","Még nincs korábbi étkezés.":"No earlier meals yet.","További testméretek (cm)":"More body measurements (cm)","Mellkas":"Chest","Felkar":"Upper arm","Csípő":"Hips","Comb":"Thigh","Testméretek":"Body measurements","A testméretek 10–250 cm között legyenek":"Body measurements must be between 10 and 250 cm","Szuperszett a következő gyakorlattal":"Superset with the next exercise","Alkalmazás":"Apply","Megnézem":"View","Később":"Later","Adaptív keret":"Adaptive target","A tényleges energiaigényedet az étkezéseidből és a súlyod változásából számolom. Ehhez az elmúlt 4 hétből kell legalább 14 rögzített nap (napi 800 kcal felett) és legalább 8 mérés 2 hét alatt.":"I estimate your actual energy needs from your meals and weight change. This needs at least 14 logged days (above 800 kcal) in the last 4 weeks and at least 8 weigh-ins over 2 weeks.","Időtáv":"Time span","Átlagos bevitel":"Average intake","Súlytrend":"Weight trend","Tényleges energiaigény":"Actual energy needs","Edzésterv Claude-dal":"Training plan with Claude","Terv kérése":"Request a plan","Edzésterv beillesztése":"Paste training plan","Az app összeállít egy kérést a gyakorlataid listájával; a válasz kódblokkját az":"The app builds a request with your exercise list; add the code block from the reply with","gombbal sablonokként veheted fel.":"as templates.","Nap hetente":"Days per week","Edzés hossza":"Session length","Eszközök":"Equipment","Gyakorlottság":"Experience","Kerülendő gyakorlatok (nem kötelező)":"Exercises to avoid (optional)","Változásnapló":"Change log","Magasság":"Height","Legalább 1200 kcal; a javasoltnál jóval alacsonyabb értéket csak orvossal vagy dietetikussal egyeztetve állíts be.":"At least 1200 kcal; only set a value far below the suggested one after agreeing it with a doctor or dietitian.","Számítási módszerek":"Calculation methods","Telepítsd az Olupant":"Install Olupan","Ingyenes, nincs appon belüli vásárlás és fiók – az adatok az eszközödön maradnak, és offline is működik.":"Free, no in-app purchases or account – your data stays on your device, and it works offline.","Telepítés":"Install","Részletek":"Details","Most nem":"Not now","Terpeszugrás (jumping jack)":"Jumping jacks","Guggolásos felugrás":"Jump squat","Magastérd-emelés helyben":"High knees","Kitöréses váltóugrás":"Jumping lunges","Tabata (HIIT) – saját testsúly":"Tabata (HIIT) – bodyweight","Tabata: gyakorlatonként 8 kör – 20 mp maximális tempó, 10 mp pihenő (a pihenőidő 10 mp-re van állítva). A gyakorlatok között 1 perc pihenő. Sorozatonként a 20 mp alatt elért ismétlésszámot rögzítsd.":"Tabata: 8 rounds per exercise – 20 s at maximum effort, 10 s rest (the rest timer is set to 10 s). Rest 1 minute between exercises. For each set, log the reps you did in the 20 s.","Előbb add meg a Claude-projekt linkjét. A terv kérése ugyanabba a projektbe megy, mint az étkezésnapló.":"Add your Claude project link first. Plan requests go to the same project as your food log.","Claude-projekt beállítása":"Set up Claude project","Ebben a csoportban már nincs sablon.":"There are no templates left in this group.","Még nincs befejezett edzés.":"No finished workouts yet.","A javasolt napi bevitelhez töltsd ki a profilodat. A Claude-projekt útmutatója és a menüjavaslat csak utána érhető el, mert a napi célok is belekerülnek.":"Fill in your profile to get a suggested daily intake. The Claude project guide and meal suggestions become available after that, because they include your daily targets.","Profil kitöltése":"Fill in profile","A profil kitöltése után érhető el.":"Available once your profile is filled in.","Az útmutató a profil kitöltése után érhető el, mert a projekt utasításába a napi célok is belekerülnek.":"The guide becomes available once your profile is filled in, because the project instructions include your daily targets.","Előbb töltsd ki a profilodat":"Fill in your profile first","Előbb add meg a Claude-projekt linkjét":"Add your Claude project link first","Vissza":"Back","Egyéb kívánság vagy stílus":"Other wishes or style","Konyhai eszközeim":"My kitchen equipment","Jelöld be, ami van. Ha bármit bejelölsz, Claude csak ezekkel számol, és a többit nem használja.":"Select what you have. If you select anything, Claude only plans with these and leaves out the rest.","Egyéb eszköz (nem kötelező)":"Other equipment (optional)","Bemelegítő":"Warm-up","Egyéb receptötletek":"Other recipe ideas","Konyha":"Cuisine","Napi és heti menünél az app 1–2 konyhát választ ki véletlenszerűen a bejelöltek közül, hogy az alapanyagok átfedjenek. A receptötleteknél mindet használja.":"For daily and weekly menus the app randomly picks 1–2 of the selected cuisines so the ingredients overlap. Recipe ideas use all of them.","Receptötletek":"Recipe ideas","Főzés hetente (heti menü)":"Cooking per week (weekly menu)","A heti menü ennyi főzésből ad főtt ételt minden napra – ugyanaz az étel több napon is előjöhet.":"The weekly menu gives a cooked meal for every day from this many cooking sessions – the same dish may come up on several days.","Mi van kéznél?":"What do you have at hand?","Hol vagy, mit tudsz venni? (nem kötelező)":"Where are you, what can you buy? (optional)","Legalább az egyiket töltsd ki: Claude csak ebből javasol, a mai maradék kereted szerint.":"Fill in at least one: Claude only suggests from this, within what’s left of today’s target.","Írd be, mi van kéznél, vagy hol vagy":"Enter what you have at hand or where you are","A Megnyitás gomb új böngészőlapon nyitja meg a projektet – itt cserélheted az utasítást vagy a receptfájlt.":"The Open button opens the project in a new browser tab – that’s where you can replace the instructions or the recipe file.","Claude megnyitása (claude.ai)":"Open Claude (claude.ai)","Claude-projekt megnyitása":"Open Claude project","Elsődleges izomcsoport":"Primary muscle group","Másodlagos izmok (nem kötelező)":"Secondary muscles (optional)","Eszköz":"Equipment","Bemelegítés":"Warm-up","Pluszsúly":"Added weight","Idő (mp)":"Time (s)","Mp":"Sec","Nyisd meg a Claude-ot ugyanabban a böngészőben, amelyben az Olupant használod (ne a Claude appot – ott nincs kimásolható webcím), jelentkezz be vagy regisztrálj, hozz létre egy projektet, és másold be ide a linkjét a címsorból.":"Open Claude in the same browser you use Olupan in (not the Claude app – it has no web address to copy), sign in or sign up, create a project and paste its link from the address bar here.","Testsúly (kg)":"Body weight (kg)","Testzsír % (nem kötelező)":"Body fat % (optional)","Napi lépéscél (nem kötelező)":"Daily step goal (optional)","Saját napi kalóriakeret (kcal)":"Own daily calorie target (kcal)","Ha kitöltöd, a javasolt keret helyett ezzel számol az app; törölve visszaáll a javasoltra. Legalább 1200 kcal; a javasoltnál jóval alacsonyabb értéket csak orvossal vagy dietetikussal egyeztetve állíts be.":"If you fill it in, the app uses it instead of the suggested target; clear it to go back to the suggestion. At least 1200 kcal; only set a value well below the suggestion after consulting a doctor or dietitian.","Tájékoztató becslés, nem orvosi tanács – egészségügyi állapot esetén egyeztesd szakemberrel.":"An indicative estimate, not medical advice – if you have a health condition, check with a professional."};
const detectLang=()=>/^hu\b/i.test(navigator.language||'')?'hu':'en';
let LANG='hu';
const LOC=()=>LANG==='en'?'en-GB':'hu-HU';
const L=(h,e)=>LANG==='en'?e:h;
let TRX=null;
function trRe(){if(TRX)return TRX;const ks=Object.keys(EN).sort((a,b)=>b.length-a.length).map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  TRX=new RegExp('(^|[^\\p{L}])?('+ks.join('|')+')(?![\\p{L}])','gu');return TRX}
const LET=/\p{L}/u;
function T(v){if(LANG!=='en'||v==null)return v;v=String(v);if(!/[A-Za-zÀ-ž]/.test(v))return v;
  const m=/^([\s\u00a0]*)([\s\S]*?)([\s\u00a0]*)$/.exec(v),core=m[2].replace(/[\s\u00a0]+/g,' ');
  if(EN[core]!=null)return m[1]+EN[core]+m[3];
  const out=core.replace(trRe(),(m,p,k,o,str)=>p===undefined&&o>0&&LET.test(k[0])&&LET.test(str[o-1])?m:(p||'')+EN[k]);return out===core?v:m[1]+out+m[3]}
const TRD=new WeakMap(),TRA=['placeholder','aria-label','title','alt'];
function trEl(el){for(const a of TRA){const v=el.getAttribute(a);if(v){const t=T(v);if(t!==v)el.setAttribute(a,t)}}}
function trTxt(n){const v=n.nodeValue;if(TRD.get(n)===v)return;const t=T(v);if(t!==v){n.nodeValue=t}TRD.set(n,n.nodeValue)}
function trSkip(el){for(let e=el;e&&e.nodeType===1;e=e.parentElement){const tg=e.tagName;if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA'||e.getAttribute('translate')==='no')return true}return false}
function trNode(root){if(LANG!=='en'||!root)return;
  if(root.nodeType===3){if(!trSkip(root.parentElement))trTxt(root);return}
  if(root.nodeType!==1||trSkip(root))return;trEl(root);
  const w=document.createTreeWalker(root,5,{acceptNode(n){if(n.nodeType===1){const tg=n.tagName;if(tg==='TEXTAREA')trEl(n);if(tg==='SCRIPT'||tg==='STYLE'||tg==='TEXTAREA'||n.getAttribute('translate')==='no')return 2;trEl(n);return 3}return 1}});
  let n;while((n=w.nextNode()))trTxt(n)}
let trObs=null;
function trWatch(){if(trObs||!window.MutationObserver)return;trObs=new MutationObserver(ms=>{if(LANG!=='en')return;for(const m of ms){
  if(m.type==='childList')m.addedNodes.forEach(trNode);else if(m.type==='characterData'){if(!trSkip(m.target.parentElement))trTxt(m.target)}else if(m.target.nodeType===1&&!trSkip(m.target))trEl(m.target)}});
  trObs.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:TRA})}
function applyLang(){LANG=S.settings.lang||detectLang();document.documentElement.lang=LANG;const nm='Olupan';document.title=nm+(LANG==='en'?' – offline workout and food log':' – offline edzésnapló és étkezésnapló');
  const am=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(am)am.content=nm;trWatch();trNode(document.body)}
function setLang(v){if(!['hu','en'].includes(v))return;S.settings.lang=v;save();location.reload()}
const fmtF=(n,d=1)=>n==null||isNaN(n)?'–':(+n).toLocaleString(LOC(),{minimumFractionDigits:d,maximumFractionDigits:d});
const fmt=(n,d=1)=>n==null||isNaN(n)?'–':(+n).toLocaleString(LOC(),{maximumFractionDigits:d});
const sgn=(n,d=1)=>{if(n==null||isNaN(n))return'–';const r=Math.round(n*10**d)/10**d;return(r>0?'+':r<0?'−':'±')+fmtF(Math.abs(r),d)};
const fmtShort=v=>v>=1e4?fmt(v/1000,0)+'k':v>=1000?fmt(v/1000,1)+'k':fmt(v,1);
const e1rm=(w,r)=>!w||!r?0:(r===1?w:w*(1+r/30)); // Epley
const dur=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return(h?h+':'+z2(m):m)+':'+z2(s%60)};
const fmtSec=s=>s>=60?(s%60?Math.floor(s/60)+':'+z2(s%60):s/60+' perc'):s+' mp';
function fmtDate(s){const d=typeof s==='string'?pYmd(s):new Date(s);const o={month:'short',day:'numeric'};if(d.getFullYear()!==new Date().getFullYear())o.year='numeric';return d.toLocaleDateString(LOC(),o)}
const fmtTime=ts=>{const d=new Date(ts);return z2(d.getHours())+':'+z2(d.getMinutes())};
const byName=(a,b)=>a.name.localeCompare(b.name,'hu');

/* ===== Alapadatok ===== */
const DEF_EX=[
['Fekvenyomás (rúd)','Mell'],['Ferde fekvenyomás (kézisúlyzó)','Mell'],['Fekvenyomás (kézisúlyzó)','Mell'],['Tárogatás (kábel)','Mell'],['Tolódzkodás','Mell'],
['Felhúzás (rúd)','Hát'],['Evezés (rúd)','Hát'],['Húzódzkodás','Hát'],['Mellhez húzás (kábel)','Hát'],['Evezés ülve (kábel)','Hát'],['Evezés (kézisúlyzó)','Hát'],
['Guggolás (rúd)','Láb'],['Román felhúzás (rúd)','Láb'],['Lábtolás (gép)','Láb'],['Kitörés (kézisúlyzó)','Láb'],['Lábhajlítás (gép)','Láb'],['Lábnyújtás (gép)','Láb'],['Csípőemelés (rúd)','Láb'],['Vádliemelés (gép)','Láb'],
['Katonai nyomás (rúd)','Váll'],['Vállból nyomás (kézisúlyzó)','Váll'],['Oldalemelés (kézisúlyzó)','Váll'],['Face pull (kábel)','Váll'],
['Bicepsz hajlítás (kézisúlyzó)','Kar'],['Bicepsz hajlítás (rúd)','Kar'],['Kalapács hajlítás','Kar'],['Tricepsz letolás (kábel)','Kar'],['Francia nyomás','Kar'],
['Hasprés','Törzs'],['Lábemelés függésben','Törzs'],['Hasgörgő','Törzs'],
['KB swing (kétkezes)','Kettlebell'],['KB swing (egykezes)','Kettlebell'],['KB goblet guggolás','Kettlebell'],['KB török felállás (get-up)','Kettlebell'],
['KB clean','Kettlebell'],['KB clean & press','Kettlebell'],['KB snatch','Kettlebell'],['KB nyomás (egykezes)','Kettlebell'],['KB evezés','Kettlebell'],
['KB felhúzás','Kettlebell'],['KB front rack guggolás','Kettlebell'],['KB halo','Kettlebell'],['KB windmill','Kettlebell'],['KB thruster','Kettlebell'],['KB high pull','Kettlebell'],
['Fekvőtámasz','Saját testsúly'],['Pike fekvőtámasz','Saját testsúly'],['Ausztrál húzódzkodás','Saját testsúly'],['Guggolás (saját testsúly)','Saját testsúly'],
['Kitörés (saját testsúly)','Saját testsúly'],['Bolgár guggolás (saját testsúly)','Saját testsúly'],['Csípőemelés (saját testsúly)','Saját testsúly'],
['Plank (mp)','Saját testsúly'],['Hegymászó','Saját testsúly'],['Burpee','Saját testsúly'],['Superman','Saját testsúly'],
['Futás (terep)','Kardió','cardio'],['Futás (aszfalt)','Kardió','cardio'],['Futópad','Kardió','cardio'],['Kerékpár (kültéri)','Kardió','cardio'],
['Terembicikli','Kardió','cardio'],['Evezőgép','Kardió','cardio'],['Elliptikus tréner','Kardió','cardio'],['Lépcsőzőgép','Kardió','cardio'],
['Gyaloglás','Kardió','cardio'],['Túrázás','Kardió','cardio'],['Úszás','Kardió','cardio'],['Ugrókötél','Kardió','cardio'],
['Koncentrált bicepszhajlítás (kézisúlyzó)','Kar'],['Bolgár guggolás (kézisúlyzó)','Láb'],['Padlón nyomás (kézisúlyzó)','Mell'],
['Román felhúzás (kézisúlyzó)','Láb'],['Goblet guggolás (kézisúlyzó)','Láb'],['Lábemelés fekve','Törzs'],['Dead bug','Törzs'],
['Terpeszugrás (jumping jack)','Saját testsúly'],['Guggolásos felugrás','Saját testsúly'],['Magastérd-emelés helyben','Saját testsúly'],['Kitöréses váltóugrás','Saját testsúly']];
const DEF_TPL=[
 ['Push – mell, váll, tricepsz',[['Fekvenyomás (rúd)',3],['Ferde fekvenyomás (kézisúlyzó)',3],['Katonai nyomás (rúd)',3],['Oldalemelés (kézisúlyzó)',3],['Tricepsz letolás (kábel)',3]]],
 ['Pull – hát, bicepsz',[['Felhúzás (rúd)',3],['Evezés (rúd)',3],['Húzódzkodás',3],['Mellhez húzás (kábel)',3],['Bicepsz hajlítás (kézisúlyzó)',3]]],
 ['Láb',[['Guggolás (rúd)',3],['Román felhúzás (rúd)',3],['Lábtolás (gép)',3],['Kitörés (kézisúlyzó)',3],['Vádliemelés (gép)',3]]],
 ['Kettlebell – swing & get-up',[['KB swing (egykezes)',10],['KB török felállás (get-up)',5]]],
 ['Kettlebell – teljes test',[['KB goblet guggolás',3],['KB clean & press',3],['KB evezés',3],['KB swing (kétkezes)',3],['KB halo',2]]],
 ['Kettlebell – ballisztikus',[['KB swing (kétkezes)',5],['KB clean',4],['KB snatch',4],['KB front rack guggolás',3],['KB windmill',2]]],
 ['Saját testsúly – teljes test',[['Fekvőtámasz',3],['Guggolás (saját testsúly)',3],['Ausztrál húzódzkodás',3],['Kitörés (saját testsúly)',3],['Plank (mp)',3]]],
 ['Saját testsúly – felsőtest',[['Húzódzkodás',4],['Fekvőtámasz',4],['Tolódzkodás',3],['Pike fekvőtámasz',3],['Ausztrál húzódzkodás',3]]],
 ['Saját testsúly – láb és törzs',[['Bolgár guggolás (saját testsúly)',3],['Guggolás (saját testsúly)',3],['Csípőemelés (saját testsúly)',3],['Hegymászó',3],['Lábemelés függésben',3]]],
 ['Kardió – gépek (terem)',[['Futópad',1],['Terembicikli',1],['Evezőgép',1]]],
 ['Kardió – szabadtéri',[['Futás (terep)',1]]],
 ['Kézisúlyzó A – húzó + láb',[['Húzódzkodás',4],['Evezés (kézisúlyzó)',4],['Koncentrált bicepszhajlítás (kézisúlyzó)',3],['Bolgár guggolás (kézisúlyzó)',3],['Lábemelés fekve',3]]],
 ['Kézisúlyzó B – nyomó + láb',[['Padlón nyomás (kézisúlyzó)',4],['Oldalemelés (kézisúlyzó)',3],['Fekvőtámasz',3],['Román felhúzás (kézisúlyzó)',3],['Goblet guggolás (kézisúlyzó)',3],['Dead bug',3]]],
 ['Tabata (HIIT) – saját testsúly',[['Terpeszugrás (jumping jack)',8],['Guggolásos felugrás',8],['Magastérd-emelés helyben',8],['Kitöréses váltóugrás',8]]]];
const TPL_NOTE={'Tabata (HIIT) – saját testsúly':'Tabata: gyakorlatonként 8 kör – 20 mp maximális tempó, 10 mp pihenő (a pihenőidő 10 mp-re van állítva). A gyakorlatok között 1 perc pihenő. Sorozatonként a 20 mp alatt elért ismétlésszámot rögzítsd.'};
const TPL_VER=n=>n.startsWith('Tabata')?6:n.startsWith('Kardió')?5:n.startsWith('Kézisúlyzó')?4:n.startsWith('Saját testsúly')?3:n.startsWith('Kettlebell')?2:0; // melyik adatverzióban jelent meg
const DATA_V=6;
/* ===== Gyakorlat-adatmodell: elsődleges izomcsoport (mu), másodlagos izmok (mu2), eszköz (eq), mérés (kind) ===== */
const MUSCLES=[['chest','Mell','Chest'],['back','Hát','Back'],['shoulders','Váll','Shoulders'],['biceps','Bicepsz','Biceps'],['triceps','Tricepsz','Triceps'],['core','Has / törzs','Abs / core'],['quads','Comb elöl','Quads'],['hams','Comb hátul','Hamstrings'],['glutes','Farizom','Glutes'],['calves','Vádli','Calves'],['full','Teljes test','Full body']];
const EQUIP=[['bar','Rúd','Barbell'],['db','Kézisúlyzó','Dumbbell'],['mach','Gép / kábel','Machine / cable'],['bw','Saját testsúly','Bodyweight'],['kb','Kettlebell','Kettlebell'],['other','Egyéb','Other']];
const KINDS=[['strength','Súly × ismétlés','Weight × reps'],['reps','Ismétlés (+ súly)','Reps (+ weight)'],['time','Idő (mp)','Time (s)'],['cardio','Kardió (táv × idő)','Cardio (distance × time)']];
const lblOf=(arr,k)=>{const x=arr.find(a=>a[0]===k);return x?(LANG==='en'?x[2]:x[1]):''};
const muName=k=>lblOf(MUSCLES,k);
const exKind=id=>exById(id)?.kind||'strength';
const exGroup=e=>e.kind==='cardio'?L('Kardió','Cardio'):e.mu?muName(e.mu):L('Besorolatlan','Unassigned');
const groupSort=(a,b)=>{const o=[...MUSCLES.map(m=>LANG==='en'?m[2]:m[1]),L('Kardió','Cardio'),L('Besorolatlan','Unassigned')];return o.indexOf(a)-o.indexOf(b)};
/* Beépített gyakorlatok besorolása: [elsődleges, [másodlagos], eszköz, mérés] */
const EX_META={
'Fekvenyomás (rúd)':['chest',['triceps','shoulders'],'bar'],'Ferde fekvenyomás (kézisúlyzó)':['chest',['shoulders','triceps'],'db'],'Fekvenyomás (kézisúlyzó)':['chest',['triceps','shoulders'],'db'],'Tárogatás (kábel)':['chest',[],'mach'],'Tolódzkodás':['chest',['triceps','shoulders'],'bw','reps'],'Padlón nyomás (kézisúlyzó)':['chest',['triceps'],'db'],'Padlón nyomás (rúd)':['chest',['triceps'],'bar'],
'Felhúzás (rúd)':['back',['glutes','hams'],'bar'],'Evezés (rúd)':['back',['biceps'],'bar'],'Húzódzkodás':['back',['biceps'],'bw','reps'],'Húzódzkodás (fordított fogás)':['back',['biceps'],'bw','reps'],'Mellhez húzás (kábel)':['back',['biceps'],'mach'],'Evezés ülve (kábel)':['back',['biceps'],'mach'],'Evezés (kézisúlyzó)':['back',['biceps'],'db'],
'Guggolás (rúd)':['quads',['glutes'],'bar'],'Román felhúzás (rúd)':['hams',['glutes','back'],'bar'],'Lábtolás (gép)':['quads',['glutes'],'mach'],'Kitörés (kézisúlyzó)':['quads',['glutes'],'db'],'Lábhajlítás (gép)':['hams',[],'mach'],'Lábnyújtás (gép)':['quads',[],'mach'],'Csípőemelés (rúd)':['glutes',['hams'],'bar'],'Vádliemelés (gép)':['calves',[],'mach'],
'Bolgár guggolás (kézisúlyzó)':['quads',['glutes'],'db'],'Román felhúzás (kézisúlyzó)':['hams',['glutes'],'db'],'Goblet guggolás (kézisúlyzó)':['quads',['glutes'],'db'],'Guggolás (kézisúlyzó)':['quads',['glutes'],'db'],
'Katonai nyomás (rúd)':['shoulders',['triceps'],'bar'],'Vállból nyomás (kézisúlyzó)':['shoulders',['triceps'],'db'],'Oldalemelés (kézisúlyzó)':['shoulders',[],'db'],'Face pull (kábel)':['shoulders',['back'],'mach'],
'Bicepsz hajlítás (kézisúlyzó)':['biceps',[],'db'],'Bicepsz hajlítás (rúd)':['biceps',[],'bar'],'Kalapács hajlítás':['biceps',[],'db'],'Koncentrált bicepszhajlítás (kézisúlyzó)':['biceps',[],'db'],'Tricepsz letolás (kábel)':['triceps',[],'mach'],'Francia nyomás':['triceps',[],'bar'],
'Hasprés':['core',[],'bw','reps'],'Lábemelés függésben':['core',[],'bw','reps'],'Hasgörgő':['core',[],'other','reps'],'Lábemelés fekve':['core',[],'bw','reps'],'Dead bug':['core',[],'bw','reps'],
'KB swing (kétkezes)':['glutes',['hams','back'],'kb'],'KB swing (egykezes)':['glutes',['hams','back'],'kb'],'KB goblet guggolás':['quads',['glutes'],'kb'],'KB török felállás (get-up)':['full',['shoulders','core'],'kb'],'KB clean':['full',['glutes','back'],'kb'],'KB clean & press':['shoulders',['glutes','triceps'],'kb'],'KB snatch':['full',['glutes','shoulders'],'kb'],'KB nyomás (egykezes)':['shoulders',['triceps'],'kb'],'KB evezés':['back',['biceps'],'kb'],'KB felhúzás':['hams',['glutes','back'],'kb'],'KB front rack guggolás':['quads',['glutes','core'],'kb'],'KB halo':['shoulders',['core'],'kb'],'KB windmill':['core',['shoulders','hams'],'kb'],'KB thruster':['quads',['shoulders','glutes'],'kb'],'KB high pull':['back',['shoulders','glutes'],'kb'],
'Fekvőtámasz':['chest',['triceps','shoulders'],'bw','reps'],'Pike fekvőtámasz':['shoulders',['triceps'],'bw','reps'],'Ausztrál húzódzkodás':['back',['biceps'],'bw','reps'],'Guggolás (saját testsúly)':['quads',['glutes'],'bw','reps'],'Kitörés (saját testsúly)':['quads',['glutes'],'bw','reps'],'Bolgár guggolás (saját testsúly)':['quads',['glutes'],'bw','reps'],'Csípőemelés (saját testsúly)':['glutes',['hams'],'bw','reps'],'Plank (mp)':['core',[],'bw','time'],'Hegymászó':['core',['shoulders'],'bw','reps'],'Burpee':['full',[],'bw','reps'],'Superman':['back',['glutes'],'bw','reps'],
'Terpeszugrás (jumping jack)':['full',[],'bw','reps'],'Guggolásos felugrás':['quads',['glutes','calves'],'bw','reps'],'Magastérd-emelés helyben':['full',['core'],'bw','reps'],'Kitöréses váltóugrás':['quads',['glutes'],'bw','reps']};
const CAT2MU={'Mell':'chest','Hát':'back','Váll':'shoulders','Láb':'quads','Törzs':'core','Has':'core','Bicepsz':'biceps','Tricepsz':'triceps','Farizom':'glutes','Vádli':'calves'};
/* Egyszeri besorolás (e.m jelzi, hogy megtörtént – a felhasználó módosításait később nem írja felül) */
function fillMeta(e){if(e.m)return e;const m=EX_META[e.name];
  if(m){e.mu=m[0];if(m[1].length)e.mu2=[...m[1]];e.eq=m[2];if(m[3]&&e.kind!=='cardio')e.kind=m[3]}
  if(e.kind!=='cardio'){const n=e.name.toLowerCase();
    if(!e.eq){const q=e.cat==='Kettlebell'||/^kb |kettlebell/.test(n)?'kb':/\(rúd\)|barbell/.test(n)?'bar':/kézisúlyzó|dumbbell/.test(n)?'db':/\((gép|kábel)\)|machine|cable/.test(n)?'mach':e.cat==='Saját testsúly'||BW_NAMES.includes(e.name)?'bw':'';if(q)e.eq=q}
    if(!e.mu&&CAT2MU[e.cat])e.mu=CAT2MU[e.cat]}
  e.m=1;return e}
/* Eszköz szerinti címke: KB = kettlebell, ST = saját testsúly, ET = edzőterem (rúd, gép, kábel), KS = kézisúlyzó (otthon) */
const BW_NAMES=['Húzódzkodás (fordított fogás)','Húzódzkodás','Tolódzkodás','Hasprés','Lábemelés függésben','Hasgörgő','Lábemelés fekve','Dead bug'];
function exEq(e){if(!e)return null;const n=e.name;if(e.kind==='cardio')return'KA';if(e.eq){const t={kb:'KB',bw:'ST',bar:'ET',mach:'ET',db:'KS'}[e.eq];if(t)return t}if(e.cat==='Kettlebell'||/^KB /.test(n))return'KB';if(/\((rúd|gép|kábel)\)/.test(n))return'ET';
  if(e.cat==='Saját testsúly'||BW_NAMES.includes(n))return'ST';if(/kézisúlyzó|Kalapács/i.test(n))return'KS';return null}
const START_TABS=[['workout','Edzés'],['food','Étkezés'],['body','Test'],['history','Naptár'],['stats','Statisztika']];
const TAGS={ET:['et','Edzőterem'],KS:['ks','Kézisúlyzó (otthon)'],ST:['st','Saját testsúly'],KB:['kb','Kettlebell'],KA:['ka','Kardió']}; // ez a sorrend a sablonlistában is
const TAG_ORDER=Object.keys(TAGS);
function tplKey(t){let eq=t.items.map(i=>exEq(exById(i.exId))).filter(Boolean);if(!eq.length)return null;
  if(eq.every(x=>x==='KA'))return'KA';eq=eq.filter(x=>x!=='KA');
  return eq.includes('ET')?'ET':eq.every(x=>x==='KB'||x==='ST')&&eq.includes('KB')?'KB':eq.every(x=>x==='ST')?'ST':eq.every(x=>x==='KS'||x==='ST')?'KS':'ET'}
const tplRank=t=>{const k=tplKey(t);return k?TAG_ORDER.indexOf(k):TAG_ORDER.length};
const DEF_REST={'Terpeszugrás (jumping jack)':10,'Guggolásos felugrás':10,'Magastérd-emelés helyben':10,'Kitöréses váltóugrás':10,'KB swing (egykezes)':45,'KB swing (kétkezes)':60,'KB snatch':60,'KB török felállás (get-up)':60};
function addDefaults(st){
  for(const[name,cat,kind]of DEF_EX){let e=st.exercises.find(x=>x.name===name);if(!e){e={id:uid(),name,cat};if(DEF_REST[name])e.rest=DEF_REST[name];st.exercises.push(e)}if(kind&&!e.kind)e.kind=kind}
  st.exercises.forEach(fillMeta);
  const f=n=>st.exercises.find(e=>e.name===n)?.id;
  for(const[name,items]of DEF_TPL)if(!st.templates.some(t=>t.name===name)&&(st.v===0||TPL_VER(name)>st.v))
    st.templates.push({id:uid(),name,items:items.filter(([n])=>f(n)).map(([n,s])=>({exId:f(n),sets:s})),...(TPL_NOTE[name]?{notes:[{id:uid(),ts:Date.now(),text:TPL_NOTE[name],wid:null}]}:{})});
}
function defaults(){const st={v:0,exercises:[],templates:[],workouts:[],body:[],meals:[],profile:{pace:1},active:null,settings:{rest:90,backupEvery:7,theme:null,sound:3,wakeLock:true,stepGoal:0,uiSound:true,typeSound:true,doneSound:true,haptic:true,restNotify:false,startTab:'workout',accent:'cyan',lang:null}};addDefaults(st);st.v=DATA_V;return st}
const KEY='olupan.v1',KEY_OLD='edzesnaplo.v1';
let S; // a betöltés a fájl végén történik (a validáló függvények után)
function load(){try{const raw=localStorage.getItem(KEY)||localStorage.getItem(KEY_OLD);if(raw){const s=sanitizeState(JSON.parse(raw));if(s.v<DATA_V){addDefaults(s);s.v=DATA_V}return s}}catch(e){console.warn('Betöltési hiba',e)}return defaults()}
/* ===== Tárolás =====
   Fő tár: IndexedDB (a böngésző adatbázisa, nagyobb keret, aszinkron írás). A localStorage tükörként megmarad, amíg
   az adat elfér benne (kb. 5 MB) – így az indulás azonnali, és ha az IndexedDB nem érhető el, onnan tölt be.
   Mindkét helyen időbélyeg van; induláskor a frissebb nyer. */
const IDB={db:null,state:'pending',dirty:false};let mirrorFull=false,idbBusy=false,idbNext=null;
function idbOpen(){return new Promise((res,rej)=>{if(!window.indexedDB)return rej(new Error('nincs IndexedDB'));let r;try{r=indexedDB.open('olupan',1)}catch(e){return rej(e)}
  r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('blokkolva'))})}
function idbReq(mode,fn){return new Promise((res,rej)=>{let v;try{const tx=IDB.db.transaction('kv',mode),rq=fn(tx.objectStore('kv'));rq.onsuccess=()=>{v=rq.result};tx.oncomplete=()=>res(v);tx.onerror=tx.onabort=()=>rej(tx.error||new Error('megszakítva'))}catch(e){rej(e)}})}
const idbGet=k=>idbReq('readonly',st=>st.get(k)),idbPut=(k,v)=>idbReq('readwrite',st=>st.put(v,k));
function idbSave(rec){idbNext=rec;if(idbBusy)return;idbBusy=true;
  (async()=>{while(idbNext){const r=idbNext;idbNext=null;
    try{await idbPut('state',r)}catch(e){console.warn('IndexedDB mentési hiba',e);IDB.state='off';
      try{localStorage.setItem(KEY,r.json);localStorage.setItem(KEY+'.ts',String(r.ts));mirrorFull=false}catch(e2){toast('Mentés sikertelen (tárhely?)')}}}
    idbBusy=false})()}
function save(){const json=JSON.stringify(S),ts=Date.now();
  try{localStorage.setItem('olupan.ui',JSON.stringify({theme:S.settings.theme||null,accent:S.settings.accent||'cyan'}))}catch(e){}
  let lsOk=false;if(!mirrorFull){try{localStorage.setItem(KEY,json);localStorage.setItem(KEY+'.ts',String(ts));lsOk=true}catch(e){mirrorFull=true}}
  if(IDB.state==='ok')idbSave({json,ts});else if(IDB.state==='pending')IDB.dirty=true;else if(!lsOk)toast('Mentés sikertelen (tárhely?)')}
async function bootStore(){
  try{IDB.db=await idbOpen()}catch(e){console.warn('IndexedDB nem érhető el – marad a helyi tárhely',e);IDB.state='off';return}
  try{
    const rec=await idbGet('state'),lsTs=+(localStorage.getItem(KEY+'.ts')||0);
    if(rec&&rec.json&&(rec.ts||0)>lsTs){ // az IndexedDB frissebb (pl. a tükör betelt vagy törlődött) → onnan töltünk
      const s=sanitizeState(JSON.parse(rec.json));if(s.v<DATA_V){addDefaults(s);s.v=DATA_V}S=s;
      tab=S.active?'workout':'home';applyTheme();applyLang();render();
    }else{ // első indulás az új tárral (átemelés) vagy a tükör a frissebb: az IndexedDB-be írjuk, és visszaolvasva ellenőrizzük
      const json=JSON.stringify(S),ts=lsTs||Date.now();await idbPut('state',{json,ts});
      const back=await idbGet('state');if(!back||back.json!==json)throw new Error('ellenőrzés sikertelen');
    }
    IDB.state='ok';
    if(IDB.dirty){IDB.dirty=false;save()}
    try{if(navigator.storage&&navigator.storage.persist&&!localStorage.getItem('olupan.persist'))navigator.storage.persist().then(p=>{try{localStorage.setItem('olupan.persist',p?'1':'0')}catch(e){}})}catch(e){}
  }catch(e){console.warn('IndexedDB nem használható – marad a helyi tárhely',e);IDB.state='off'}
}
function storeCard(){
  const kb=new Blob([JSON.stringify(S)]).size/1024,size=kb<1024?fmt(kb,0)+' KB':fmt(kb/1024,1)+' MB';
  const where=IDB.state==='ok'?(mirrorFull?L('böngésző-adatbázis (IndexedDB)','browser database (IndexedDB)'):L('böngésző-adatbázis (IndexedDB), tartalék másolattal','browser database (IndexedDB), with a backup copy')):L(`helyi tárhely · ${size} / kb. 5 MB`,`local storage · ${size} / approx. 5 MB`);
  setTimeout(()=>{try{navigator.storage&&navigator.storage.persisted&&navigator.storage.persisted().then(p=>{const el=$('#persist');if(el)el.textContent=p?L('engedélyezve','granted'):L('a böngésző dönt róla','up to the browser')})}catch(e){}},0);
  return `<div class="card"><h2>Tárolás</h2><div class="exl"><span>Adatok mérete</span><span>${size}</span></div><div class="exl"><span>Hely</span><span>${where}</span></div><div class="exl"><span>Tartós tárolás</span><span id="persist">–</span></div>
  <div class="hint">Minden adat ezen a készüléken marad. A rendszeres mentés ettől függetlenül fontos: eszközcserénél vagy az app törlésekor csak abból állítható vissza minden.</div></div>`}

/* ===== Téma ===== */
const mq=matchMedia('(prefers-color-scheme: dark)');
function curTheme(){return S.settings.theme||(mq.matches?'dark':'light')}
function applyTheme(){const t=curTheme(),de=document.documentElement;de.dataset.theme=t;de.dataset.accent=['orange','pink'].includes(S.settings.accent)?S.settings.accent:'cyan';$('#themeColor').content=t==='dark'?'#1c2128':'#eef2f8'}
mq.addEventListener?.('change',()=>{if(!S.settings.theme)applyTheme()});

/* ===== Állapot ===== */
let tab='home',back=null,histN=12,tplCat=null,homeDay=today(),setSub=null,planPick=null,calMonth=null,calSel=today(),bodyDate=today(),statRange=90,strEx=null,strMetric='e',rest=null,tplDraft=null,pickCb=null,pickCancel=null;
const exById=id=>S.exercises.find(e=>e.id===id);
const exName=id=>exById(id)?.name||'(törölt gyakorlat)';
const exRest=id=>exById(id)?.rest??S.settings.rest??90;
const isCardio=id=>exById(id)?.kind==='cardio';
const setStr=(s,cardio,kind)=>cardio?(s.w?`${fmt(s.w,2)} km · `:'')+`${s.r} perc`:kind==='time'?(s.w?`+${fmt(s.w)} kg · `:'')+`${s.r} mp`:s.w?(kind==='reps'?'+':'')+`${fmt(s.w)}×${s.r}`:`${s.r} ism.`;
const prLbl=p=>isCardio(p.exId)?({w:['leghosszabb táv',' km'],r:['leghosszabb idő',' perc']}[p.type]||['rekord','']):exKind(p.exId)==='time'?({w:['max pluszsúly',' kg'],r:['leghosszabb idő',' mp']}[p.type]||['rekord','']):exKind(p.exId)==='reps'&&p.type==='w'?['max pluszsúly',' kg']:[PRLBL[p.type],PRUNIT[p.type]];
const wSorted=()=>[...S.workouts].sort((a,b)=>a.start-b.start);
const wVolume=w=>w.exercises.reduce((a,e)=>isCardio(e.exId)||exKind(e.exId)==='time'?a:a+e.sets.reduce((b,s)=>s.wu?b:b+(s.w||0)*(s.r||0),0),0); // a bemelegítő sorozat nem számít bele
const wCardioMin=w=>w.exercises.reduce((a,e)=>isCardio(e.exId)?a+e.sets.reduce((b,s)=>b+(s.r||0),0):a,0);
const PRLBL={w:'max súly',e:'becs. 1RM',r:'ismétlés',v:'sorozat-volumen'};
const PRUNIT={w:' kg',e:' kg',r:'',v:' kg'};

function prevSets(exId){let best=null;for(const w of S.workouts)for(const e of w.exercises)if(e.exId===exId&&(!best||w.start>best.t))best={t:w.start,sets:e.sets};return best?best.sets:[]}
function bests(sets,cardio,kind){const b={w:0,e:0,r:0,v:0};for(const s of sets){if(s.wu)continue;if(s.w>b.w)b.w=s.w;if(cardio||kind==='time'||kind==='reps'){if(s.r>b.r)b.r=s.r;continue}const e=e1rm(s.w,s.r);if(e>b.e)b.e=e;if(s.r>b.r)b.r=s.r;if(s.w*s.r>b.v)b.v=s.w*s.r}return b}
function bestsBefore(exId,ts,skipId){const all=[];for(const w of S.workouts){if(w.id===skipId||w.start>=ts)continue;for(const e of w.exercises)if(e.exId===exId)all.push(...e.sets)}return all.length?bests(all,isCardio(exId),exKind(exId)):null}
function detectPRs(w){const out=[];for(const e of w.exercises){const prev=bestsBefore(e.exId,w.start,w.id);if(!prev)continue;const cur=bests(e.sets,isCardio(e.exId),exKind(e.exId));for(const t of['w','e','r','v'])if(cur[t]>prev[t]+1e-9&&cur[t]>0)out.push({exId:e.exId,type:t,val:Math.round(cur[t]*10)/10})}return out}
function allPRs(){const m={};for(const w of wSorted())for(const e of w.exercises){const r=m[e.exId]||(m[e.exId]={w:{v:0},e:{v:0},r:{v:0},v:{v:0},n:0});r.n++;const cd=isCardio(e.exId)||exKind(e.exId)!=='strength';for(const s of e.sets){if(s.wu)continue;const d=w.start;if(s.w>r.w.v)r.w={v:s.w,d,s};if(cd){if(s.r>r.r.v)r.r={v:s.r,d,s};continue}const q=e1rm(s.w,s.r);if(q>r.e.v)r.e={v:q,d,s};if(s.r>r.r.v)r.r={v:s.r,d,s};if(s.w*s.r>r.v.v)r.v={v:s.w*s.r,d,s}}}return m}

/* ===== Bemelegítő sorozat, progressziójavaslat, tárcsakalkulátor ===== */
/* ===== Edzésterv Claude-dal: az app állítja össze a kérést (a gyakorlatlistával), a válasz kódblokkját sablonokként olvassa be ===== */
const TP_GOAL=[['strength','Erő','Strength'],['muscle','Izomépítés','Muscle building'],['fit','Általános fittség','General fitness'],['fatloss','Fogyás támogatása','Supporting fat loss']];
const TP_EQ=[['gym','Edzőterem','Gym'],['db','Kézisúlyzó otthon','Dumbbells at home'],['kb','Kettlebell','Kettlebell'],['bw','Saját testsúly','Bodyweight']];
function tpPrefs(){return Object.assign({goal:'muscle',days:3,mins:60,eq:['gym'],level:'beginner',avoid:''},S.settings.tp||{})}
function openPlanReq(){if(!S.settings.claudeUrl){toast('Előbb add meg a Claude-projekt linkjét');return}const p=tpPrefs(),lbl=x=>LANG==='en'?x[2]:x[1];
  openModal(`<h2>Edzésterv Claude-dal</h2><div class="hint" style="margin-top:-4px">Az app összeállít egy kérést a gyakorlataid listájával; a válasz kódblokkját az <b>Edzésterv beillesztése</b> gombbal sablonokként veheted fel.</div>
  <label>Cél</label><div class="chips" style="margin:0">${TP_GOAL.map(x=>`<button class="chip${p.goal===x[0]?' on':''}" data-click="tpSet('goal','${x[0]}')">${esc(lbl(x))}</button>`).join('')}</div>
  <div class="grid2"><div><label for="tpd">Nap hetente</label><select id="tpd" data-change="tpSet('days',this.value)">${[2,3,4,5,6].map(n=>`<option ${p.days===n?'selected':''}>${n}</option>`).join('')}</select></div>
  <div><label for="tpm">Edzés hossza</label><select id="tpm" data-change="tpSet('mins',this.value)">${[30,45,60,75,90].map(n=>`<option value="${n}" ${p.mins===n?'selected':''}>${n} ${L('perc','min')}</option>`).join('')}</select></div></div>
  <label>Eszközök</label><div class="chips" style="margin:0">${TP_EQ.map(x=>`<button class="chip${p.eq.includes(x[0])?' on':''}" data-click="tpSet('eq','${x[0]}')">${esc(lbl(x))}</button>`).join('')}</div>
  <label for="tpl">Gyakorlottság</label><select id="tpl" data-change="tpSet('level',this.value)">${PREF_SKILL.map(x=>`<option value="${x[0]}" ${p.level===x[0]?'selected':''}>${esc(lbl(x))}</option>`).join('')}</select>
  <label for="tpa">Kerülendő gyakorlatok (nem kötelező)</label><input id="tpa" maxlength="200" value="${esc(p.avoid)}" placeholder="${esc(L('pl. guggolás rúddal, fej fölé nyomás','e.g. barbell squat, overhead press'))}" data-change="tpSet('avoid',this.value)">
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">Mégse</button><span class="sp"></span><button class="btn p" data-click="copyPlanReq()">${I(S.settings.claudeUrl?'external-link':'copy','sm')} ${S.settings.claudeUrl?'Másolás és Claude':'Másolás'}</button></div>`)}
function tpSet(k,v){const p=tpPrefs();if(k==='eq'){const a=new Set(p.eq);a.has(v)?a.delete(v):a.add(v);p.eq=[...a]}else if(k==='days'||k==='mins')p[k]=parseInt(v)||p[k];else p[k]=String(v).slice(0,200);S.settings.tp=p;save();if(k==='goal'||k==='eq')openPlanReq()}
function planPrompt(){const p=tpPrefs(),en=LANG==='en',lbl=x=>en?x[2]:x[1],L2=(h,e)=>en?e:h;
  const names=[...new Set(S.exercises.filter(e=>e.kind!=='cardio').map(e=>T(e.name)))].sort((a,b)=>a.localeCompare(b,LOC()));
  return[L2('Edzésterv – kérlek, állíts össze egy heti edzéstervet.','Training plan – please put together a weekly training plan.'),'',
    L2('Cél: ','Goal: ')+lbl(TP_GOAL.find(x=>x[0]===p.goal)||TP_GOAL[1]),
    L2('Nap hetente: ','Days per week: ')+p.days+' · '+L2('edzés hossza: ','session length: ')+p.mins+L2(' perc',' min'),
    L2('Eszközök: ','Equipment: ')+(TP_EQ.filter(x=>p.eq.includes(x[0])).map(lbl).join(', ')||L2('nincs megadva','not given')),
    L2('Gyakorlottság: ','Experience: ')+lbl(PREF_SKILL.find(x=>x[0]===p.level)||PREF_SKILL[0]),
    ...(p.avoid?[L2('Kerülendő gyakorlatok: ','Exercises to avoid: ')+p.avoid]:[]),
    ...(()=>{const now=Date.now(),c=muSets(now-28*DAY,now+1),ax=MUSCLES.filter(m=>m[0]!=='full');if(!ax.some(m=>c.sets[m[0]]>0))return[];
      return[L2('Az elmúlt 4 hét heti átlagos sorozatszáma izomcsoportonként (a másodlagos izom fél sorozat): ','Average weekly sets per muscle group over the last 4 weeks (secondary muscle = half a set): ')+ax.map(m=>`${en?m[2]:m[1]} ${fmt(c.sets[m[0]]/4,1)}`).join(', '),
        L2('Ahol heti 10 alatt van, azt lehetőleg emeld közelebb a heti 10–20 sorozathoz, hacsak nem írom, hogy szándékosan egy testrészre koncentrálok.','Where it’s under 10 a week, bring it closer to 10–20 sets a week, unless I say I’m deliberately focusing on one body part.')]})(),'',
    L2('Az appban ezek a gyakorlatok vannak – lehetőleg ezeket használd, pontosan ezzel a névvel (új gyakorlat is lehet, ha szükséges):','These exercises exist in the app – use them where possible, with exactly these names (new ones are fine if needed):'),
    names.join('; '),'',
    L2('Írd le röviden a terv logikáját és a heti beosztást, a haladás módját (mikor emeljek), és a bemelegítést. A végén egyetlen kódblokkban add meg az edzésnapokat sablonként, pontosan így:','Briefly explain the plan, the weekly schedule, how to progress (when to add weight) and the warm-up. At the end, give the training days as templates in a single code block, exactly like this:'),
    L2('TERV;A terv neve','PLAN;Plan name'),L2('SABLON;Az edzésnap neve','TEMPLATE;Training day name'),L2('Gyakorlat neve;sorozatok száma;ismétlés (pl. 8-10)','Exercise name;number of sets;reps (e.g. 8-10)'),
    L2('Szuperszettnél a gyakorlat sora után írd: ;SS (a következő gyakorlattal kötöm össze). A kódblokkban semmi más ne legyen.','For a superset, add ;SS after the exercise line (it is linked with the next one). Nothing else in the code block.'),'',
    L2('Szempontok: a gyakorlottságomhoz illő mennyiség és összetettség, biztonságos technikájú gyakorlatok, egészségügyi vagy rehabilitációs tanács nélkül.','Keep the volume and complexity right for my experience, use exercises with safe technique, and give no medical or rehab advice.')].join('\n')}
function copyPlanReq(){const txt=planPrompt(),url=S.settings.claudeUrl;
  try{navigator.clipboard.writeText(txt).then(()=>toast(L('Kérés a vágólapon – illeszd be a Claude-ba','Request copied – paste it into Claude')),()=>toast(L('A másolás nem sikerült','Copy failed')))}catch(e){}
  if(url){try{window.open(url,'_blank','noopener')}catch(e){}}closeModal()}
function parsePlan(text){const m=text.match(/```[a-z]*\n?([\s\S]*?)```/i);if(m)text=m[1];
  let plan='',cur=null;const tpls=[];
  for(let line of text.split(/\r?\n/)){line=line.trim();if(!line)continue;const parts=line.split(/\s*;\s*/),k=parts[0].toUpperCase();
    if(k==='TERV'||k==='PLAN'){plan=(parts[1]||'').slice(0,60);continue}
    if(k==='SABLON'||k==='TEMPLATE'){cur={name:(parts.slice(1).join(' ')||'Edzés').slice(0,100),items:[]};tpls.push(cur);continue}
    if(!cur||parts.length<2)continue;
    const sets=Math.max(1,Math.min(30,parseInt(parts[1])||3)),reps=(parts[2]||'').replace(/[^\d\-–]/g,'').slice(0,9),ss=parts.slice(2).some(x=>/^ss$/i.test(x));
    cur.items.push({name:parts[0].slice(0,100),sets,reps,ss})}
  return{plan,tpls:tpls.filter(t=>t.items.length)}}
function findEx(name){const n=name.toLowerCase(),rev=revEN();const hu=rev[name]||name;return S.exercises.find(e=>e.name.toLowerCase()===n||e.name.toLowerCase()===hu.toLowerCase()||T(e.name).toLowerCase()===n)}
async function pastePlan(){let text='';try{text=await navigator.clipboard.readText()}catch(e){}
  if(!/;/.test(text)){const r=await form('Edzésterv beillesztése',[{id:'t',label:L('A Claude válaszának kódblokkja','The code block from Claude’s reply'),type:'textarea',rows:8,placeholder:'SABLON;Push A\nFekvenyomás (rúd);4;6-8'}]);if(!r)return;text=r.t||''}
  const P=parsePlan(text);if(!P.tpls.length){toast(L('Nem találtam sablont – a kódblokkot másold ki','No templates found – copy the code block'));return}
  const newEx=[...new Set(P.tpls.flatMap(t=>t.items.map(i=>i.name)).filter(n=>!findEx(n)))];
  const list=P.tpls.map(t=>`<div class="exl"><span><b>${esc(t.name)}</b><br><span class="mut small">${t.items.map(i=>esc(i.name)+' '+i.sets+'×'+(i.reps||'?')+(i.ss?' (SS)':'')).join(' · ')}</span></span><span class="mono small">${t.items.length}</span></div>`).join('');
  if(!await ask(list+(newEx.length?`<div class="hint">${L('Új gyakorlatként veszem fel: ','Added as new exercises: ')}${newEx.map(esc).join(', ')}</div>`:''),{title:(P.plan?esc(P.plan)+' · ':'')+L(`${P.tpls.length} sablon`,`${P.tpls.length} template(s)`),ok:L('Felvétel a sablonok közé','Add to templates')}))return;
  for(const t of P.tpls){const items=t.items.map(i=>{let e=findEx(i.name);if(!e){e=fillMeta({id:uid(),name:i.name,cat:'Egyéb'});S.exercises.push(e)}const x={exId:e.id,sets:i.sets};if(i.reps)x.reps=i.reps;if(i.ss)x.ss=true;return x});
    const nt={id:uid(),name:t.name,items};if(P.plan)nt.plan=P.plan;S.templates.push(nt)}
  save();go('workout');toast(L(`${P.tpls.length} sablon felvéve`,`${P.tpls.length} template(s) added`))}
function toggleSS(i){const e=S.active.exercises[i];if(e.ss)delete e.ss;else e.ss=true;save();render();toast(e.ss?L('Összekötve a következő gyakorlattal – a pihenő a kör végén indul','Linked with the next exercise – rest starts after the round'):L('Szuperszett megszüntetve','Superset removed'))}
/* Sorozattípus léptetése: normál → B (bemelegítő) → D (drop) → F (failure) → normál. A D és az F munkasorozat, csak a jelölés más. */
function toggleWu(i,j){const s=S.active.exercises[i].sets[j];if(s.wu){delete s.wu;s.st='d'}else if(s.st==='d')s.st='f';else if(s.st==='f')delete s.st;else s.wu=true;save();render()}
const SET_TAG={d:'D',f:'F'};
const exEquip=id=>{const ex=exById(id);if(ex?.eq)return ex.eq;const n=(ex?.name||'').toLowerCase();return /^kb |kettlebell/.test(n)?'kb':/rúd|barbell|smith/.test(n)?'bar':/kézisúlyzó|dumbbell/.test(n)?'db':/gép|machine|kábel|cable/.test(n)?'mach':'other'};
const isBarbell=id=>exEquip(id)==='bar'&&!isCardio(id);
/* Kettős progresszió: ha legutóbb minden munkasorozat megvolt a csúcssúllyal, emelj; ha nem, ismételd meg; saját testsúlynál és kettlebellnél +1 ismétlés. */
function suggestFor(exId){if(isCardio(exId))return null;let last=null;
  for(const w of S.workouts)for(const e of w.exercises)if(e.exId===exId&&(!last||w.start>last.t))last={t:w.start,sets:e.sets.filter(s=>!s.wu&&s.r>0)};
  if(!last||!last.sets.length)return null;
  const sets=last.sets,top=Math.max(...sets.map(s=>s.w||0)),atTop=sets.filter(s=>(s.w||0)===top),target=atTop[0].r,eq=exEquip(exId),prevTxt=(top?hu(top,2)+' kg × ':'')+atTop.map(s=>s.r).join(', ');
  const hit=atTop.every(s=>s.r>=target);let w=top,r=target,why;
  if(!top||eq==='kb'){r=target+1;why=L(`legutóbb ${prevTxt} – egy ismétléssel több`,`last time ${prevTxt} – one more rep`)}
  else if(hit){w=Math.round((top+(eq==='db'?2:2.5))*4)/4;why=L(`legutóbb ${prevTxt} – minden megvolt`,`last time ${prevTxt} – all sets done`)}
  else why=L(`legutóbb ${prevTxt} – ismételd meg`,`last time ${prevTxt} – repeat it`);
  return{w,r,txt:(w?hu(w,2)+' kg × ':'')+r+(w?'':' '+L('ism.','reps')),why}}
function applySugg(i){const e=S.active.exercises[i],sg=suggestFor(e.exId);if(!sg)return;let n=0;for(const s of e.sets){if(s.done||s.wu)continue;if(s.w===''||s.w==null)s.w=sg.w;if(s.r===''||s.r==null)s.r=sg.r;n++}save();render();toast(n?L('Kitöltve','Filled in'):L('Nincs üres munkasorozat','No empty work sets'))}
let plateT=0,warmI=null,plateMode='bar',warmOff=new Set();
function plateCalc(i){warmI=i;plateMode='bar';warmOff=new Set();const e=S.active.exercises[i],nx=e.sets.find(s=>!s.done&&!s.wu&&s.w!==''),sg=suggestFor(e.exId);plateT=+(nx?.w||sg?.w||S.settings.bar||20);renderPlates()}
function warmCalc(i){warmI=i;plateMode='warm';warmOff=new Set();const e=S.active.exercises[i],nx=e.sets.find(s=>!s.done&&!s.wu&&s.w!==''),sg=suggestFor(e.exId);plateT=+(nx?.w||sg?.w||0);renderPlates()}
/* Bemelegítés: rúdnál üres rúd × 10, majd kb. 40/60/80% (5/3/2 ism.); kézisúlyzónál, gépnél, kettlebellnél 50% × 10 és 75% × 5 */
function warmSets(){const ex=S.active?.exercises[warmI];if(!ex)return[];const eq=exEquip(ex.exId),t=plateT;if(!(t>0))return[];
  if(eq==='bar'){const bar=S.settings.bar||20,rd=x=>Math.max(bar,Math.round(x/2.5)*2.5),out=t>bar?[{w:bar,r:10}]:[];for(const[p,r]of[[.4,5],[.6,3],[.8,2]]){const w=rd(t*p);if(w<t&&(!out.length||w>out[out.length-1].w))out.push({w,r})}return out}
  const step=eq==='db'?2:eq==='kb'?4:5,rd=x=>Math.max(step,Math.round(x/step)*step),out=[];for(const[p,r]of[[.5,10],[.75,5]]){const w=rd(t*p);if(w<t&&(!out.length||w>out[out.length-1].w))out.push({w,r})}return out}
function warmToggle(k){warmOff.has(k)?warmOff.delete(k):warmOff.add(k);renderPlates(false)}
function warmHtml(){const ws=warmSets(),n=ws.filter((_,k)=>!warmOff.has(k)).length,ex=S.active?.exercises[warmI],has=ex?.sets.some(s=>s.wu&&!s.done);
  return`<h3 style="margin-top:16px">Bemelegítés</h3>${ws.length?ws.map((x,k)=>`<button class="wsel${warmOff.has(k)?'':' on'}" data-click="warmToggle(${k})" aria-pressed="${!warmOff.has(k)}"><span class="wck">${I('check','sm')}</span><span class="wutag">B</span><b class="mono" style="flex:1;text-align:left">${hu(x.w,2)} kg × ${x.r}</b></button>`).join('')
    +(n?`<button class="btn block" style="margin-top:8px" data-click="addWarm()">${I('plus','sm')} ${L(`${n} bemelegítő sorozat hozzáadása`,`Add ${n} warm-up set${n>1?'s':''}`)}</button>`:has?`<button class="btn block d" style="margin-top:8px" data-click="addWarm()">${I('trash-2','sm')} ${L('Bemelegítők eltávolítása','Remove warm-ups')}</button>`:'')
    +`<div class="hint">${L('Koppints egy sorra, ha nem kéred. A hozzáadás a még nem pipált bemelegítő sorozatokat lecseréli. A bemelegítés nem számít a volumenbe és a rekordokba.','Tap a row to leave it out. Adding replaces warm-up sets not yet ticked. Warm-ups don’t count towards volume or records.')}</div>`:`<div class="hint">${L('Add meg a munkasúlyt.','Enter the working weight.')}</div>`}`}
function addWarm(){const e=S.active?.exercises[warmI],ws=warmSets().filter((_,k)=>!warmOff.has(k));if(!e)return;e.sets=e.sets.filter(s=>!(s.wu&&!s.done));const k=e.sets.findIndex(s=>!s.wu);
  e.sets.splice(k<0?e.sets.length:k,0,...ws.map(x=>({w:x.w,r:x.r,done:false,wu:true})));save();closeModal();render();toast(ws.length?L(`${ws.length} bemelegítő sorozat hozzáadva`,`${ws.length} warm-up sets added`):L('Bemelegítők eltávolítva','Warm-ups removed'))}
function plateSet(k,v){if(k==='t'){warmOff=new Set()}if(k==='t')plateT=parseFloat(String(v).replace(',','.'))||0;else if(k==='bar'){S.settings.bar=parseFloat(v)||20;save()}renderPlates(k!=='t')}
function plateToggle(v){const all=S.settings.plates||[25,20,15,10,5,2.5,1.25],a=new Set(all);a.has(v)?a.delete(v):a.add(v);S.settings.plates=[...a].sort((x,y)=>y-x);save();renderPlates(true)}
function plateMath(){const bar=S.settings.bar||20,pl=(S.settings.plates||[25,20,15,10,5,2.5,1.25]).slice().sort((a,b)=>b-a);let side=Math.max(0,(plateT-bar)/2);const out=[];
  for(const p of pl){while(side+1e-9>=p){out.push(p);side-=p}}return{bar,out,total:bar+2*out.reduce((a,b)=>a+b,0)}}
function renderPlates(full=true){const m=plateMath(),pl=S.settings.plates||[25,20,15,10,5,2.5,1.25];
  if(plateMode==='warm'){if(!full&&$('#plres')){$('#plres').innerHTML=warmHtml();return}
    openModal(`<h2>Bemelegítés</h2><label for="plt">${L('Munkasúly (kg)','Working weight (kg)')}</label><input id="plt" type="text" inputmode="decimal" value="${plateT?hu(plateT,2):''}" data-input="plateSet('t',this.value)"><div id="plres">${warmHtml()}</div><div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn" data-click="closeModal()">Bezárás</button></div>`);return}
  const res=`<div class="plviz" aria-hidden="true">${m.out.slice().reverse().map(p=>`<i style="height:${30+p*2}px">${hu(p,2)}</i>`).join('')}<span class="plbar"></span></div>
  <div class="exl"><span>Oldalanként</span><b class="mono">${m.out.length?m.out.map(p=>hu(p,2)).join(' + ')+' kg':L('csak a rúd','bar only')}</b></div>
  ${Math.abs(m.total-plateT)>1e-6?`<div class="hint">${L(`Pontosan ennyi nem rakható ki; a legközelebbi: ${hu(m.total,2)} kg.`,`Can’t load exactly that; closest: ${hu(m.total,2)} kg.`)}</div>`:''}${warmI!=null&&S.active?warmHtml():''}`;
  if(!full&&$('#plres')){$('#plres').innerHTML=res;return}
  openModal(`<h2>Tárcsakalkulátor</h2><div class="grid2"><div><label for="plt">Célsúly (kg)</label><input id="plt" type="text" inputmode="decimal" value="${hu(plateT,2)}" data-input="plateSet('t',this.value)"></div>
  <div><label for="plb">Rúd (kg)</label><select id="plb" data-change="plateSet('bar',this.value)">${[20,15,10,7].map(b=>`<option value="${b}" ${(S.settings.bar||20)===b?'selected':''}>${b} kg</option>`).join('')}</select></div></div>
  <label>Elérhető tárcsák</label><div class="chips" style="margin:0">${[25,20,15,10,5,2.5,1.25,0.5].map(p=>`<button class="chip${pl.includes(p)?' on':''}" data-click="plateToggle(${p})" aria-pressed="${pl.includes(p)}">${hu(p,2)}</button>`).join('')}</div>
  <div id="plres" style="margin-top:14px">${res}</div><div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">Bezárás</button></div>`)}

/* ===== Gyors rögzítés: korábbi étkezések és gyakori tételek Claude nélkül ===== */
let qMeal=null,qFreq=[],qGroups=[];
function quickLog(){qMeal=foodDate===today()?guessMeal():'ebed';const lim=ymd(new Date(Date.now()-90*DAY)),cnt=new Map();
  for(const m of S.meals){if(m.date<lim)continue;const k=deacc(m.name)+'|'+m.kcal,c=cnt.get(k);if(c){c.n++;if(m.date>c.m.date)c.m=m}else cnt.set(k,{n:1,m})}
  qFreq=[...cnt.values()].filter(x=>x.n>=1).sort((a,b)=>b.n-a.n||(a.m.date<b.m.date?1:-1)).slice(0,12).map(x=>x.m);
  const g=new Map();for(const m of S.meals){if(m.date===foodDate||m.date<ymd(new Date(Date.now()-14*DAY)))continue;const k=m.date+'|'+m.meal;(g.get(k)||g.set(k,[]).get(k)).push(m)}
  qGroups=[...g.entries()].sort((a,b)=>a[0]<b[0]?1:-1).slice(0,8).map(([k,items])=>({date:k.split('|')[0],meal:k.split('|')[1],items}));
  renderQuick()}
function renderQuick(){
  openModal(`<h2>Gyors rögzítés</h2><div class="hint" style="margin-top:-4px">${esc(fmtDate(foodDate))} · ${L('korábbi étkezések és gyakori tételek, Claude nélkül','earlier meals and frequent items, without Claude')}</div>
  ${qGroups.length?`<div class="grp">Korábbi étkezések</div>${qGroups.map((g,i)=>`<div class="qrow"><span><b>${esc(mealLbl(g.meal))}</b> <span class="mut small">· ${esc(relDay(pYmd(g.date).getTime()))}</span><br><span class="small mut">${esc(g.items.map(m=>m.name).join(' · '))}</span></span><span class="mono small">${fmt(sumMeals(g.items).kcal,0)}</span><button class="btn sm" data-click="copyGroup(${i})">Ismét</button></div>`).join('')}`:''}
  ${qFreq.length?`<div class="grp">Gyakori tételek</div><label for="qmeal" style="margin-top:0">Étkezés</label><select id="qmeal" data-change="qMealSet(this.value)">${MEALS.map(([k,l])=>`<option value="${k}" ${k===qMeal?'selected':''}>${l}</option>`).join('')}</select>
  ${qFreq.map((m,i)=>`<div class="qrow"><span>${esc(m.name)}<br><span class="small mut mono">F ${fmt(m.p,0)} · Sz ${fmt(m.c,0)} · Zs ${fmt(m.f,0)} g</span></span><span class="mono small">${fmt(m.kcal,0)}</span><button class="btn sm ico" data-click="addFreq(${i})" aria-label="Hozzáadás">${I('plus','sm')}</button></div>`).join('')}`:''}
  ${!qGroups.length&&!qFreq.length?'<div class="empty">Még nincs korábbi étkezés.</div>':''}
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">Kész</button></div>`)}
function qMealSet(v){qMeal=v}
function copyGroup(i){const g=qGroups[i];if(!g)return;for(const m of g.items){const x=Object.assign({},m,{id:uid(),date:foodDate});S.meals.push(x)}save();render();toast(L(`${g.items.length} tétel hozzáadva`,`${g.items.length} item(s) added`))}
function addFreq(i){const m=qFreq[i];if(!m)return;S.meals.push(Object.assign({},m,{id:uid(),date:foodDate,meal:qMeal||m.meal}));save();render();toast(L('Hozzáadva: ','Added: ')+m.name)}

/* ===== Saját párbeszédablakok (alert/confirm/prompt helyett) ===== */
let dlgResolve=null,dlgDefault=null;
function dlg(html,def=null){if(dlgResolve)dlgClose(dlgDefault);return new Promise(res=>{dlgResolve=res;dlgDefault=def;$('#dlgBox').innerHTML=html;$('#dlg').classList.add('on');setTimeout(()=>{const f=$('#dlgBox [autofocus]')||$('#dlgBox .btn.p,#dlgBox .btn.danger');f&&f.focus()},40)})}
function dlgClose(v){$('#dlg').classList.remove('on');const r=dlgResolve;dlgResolve=null;r&&r(v)}
function ask(msg,{title='Megerősítés',ok='Rendben',cancel='Mégse',danger=false}={}){
  return dlg(`<h2>${esc(title)}</h2><p>${msg}</p><div class="row end"><button class="btn" data-click="dlgClose(false)">${cancel}</button><button class="btn ${danger?'danger':'p'}" data-click="dlgClose(true)">${ok}</button></div>`,false)}
function form(title,fields,{ok='Mentés',intro=''}={}){
  const f=fields.map((x,i)=>`<div ${x.exmu?`data-exmu ${fields.find(y=>y.id==='kind')?.value?.[0]==='cardio'?'hidden':''}`:''}><label for="ff${i}">${esc(x.label)}</label>`+(x.type==='textarea'
    ?`<textarea id="ff${i}" data-f="${x.id}" rows="${x.rows||6}" placeholder="${esc(x.placeholder||'')}" ${i===0?'autofocus':''} autocomplete="off" spellcheck="false">${esc(x.value??'')}</textarea>`
    :x.type==='pills'
    ?`<input type="hidden" id="ff${i}" data-f="${x.id}" value="${esc((x.value||[]).join(','))}"><div class="chips pills" data-multi="${x.multi?1:''}" data-for="ff${i}" style="margin:0">${x.options.map(o=>`<button type="button" class="chip${(x.value||[]).includes(o[0])?' on':''}" data-v="${esc(o[0])}" data-click="pillPick(this)" aria-pressed="${(x.value||[]).includes(o[0])}">${esc(o[1])}</button>`).join('')}</div>`
    :x.type==='select'
    ?`<select id="ff${i}" data-f="${x.id}">${x.options.map(o=>`<option value="${esc(o[0])}" ${o[0]==x.value?'selected':''}>${esc(o[1])}</option>`).join('')}</select>`
    :`<input id="ff${i}" data-f="${x.id}" type="${x.type==='number'?'text':(x.type||'text')}" value="${esc(x.value??'')}" placeholder="${esc(x.placeholder||'')}" ${x.list?`list="dl${i}"`:''} ${x.min!=null?`min="${x.min}"`:''} ${x.step?`step="${x.step}"`:''} ${x.type==='number'?'inputmode="decimal" class="mono"':''} ${i===0?'autofocus':''} autocomplete="off">`
      +(x.list?`<datalist id="dl${i}">${x.list.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`:''))
    +(x.hint?`<div class="hint">${x.hint}</div>`:'')+'</div>').join('');
  return dlg(`<h2>${esc(title)}</h2>${intro?`<p class="mut small">${intro}</p>`:''}<form data-submit="formSubmit()">${f}<div class="row end"><button type="button" class="btn" data-click="dlgClose(null)">Mégse</button><button class="btn p" type="submit">${ok}</button></div></form>`,null)}
/* Pirulás választó a párbeszédablakokban: egy vagy több érték, a rejtett mezőbe vesszővel */
function pillPick(el){const box=el.parentElement,inp=document.getElementById(box.dataset.for),multi=!!box.dataset.multi,v=el.dataset.v;
  let cur=inp.value?inp.value.split(','):[];if(multi)cur=cur.includes(v)?cur.filter(x=>x!==v):[...cur,v];else cur=cur[0]===v?[]:[v];
  inp.value=cur.join(',');box.querySelectorAll('.chip').forEach(c=>{const on=cur.includes(c.dataset.v);c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
  if(box.dataset.for&&inp.dataset.f==='kind')exFormKind(cur[0]||'strength')}
function exFormKind(k){document.querySelectorAll('#dlgBox [data-exmu]').forEach(el=>el.hidden=k==='cardio')}
function readForm(){const o={};document.querySelectorAll('#dlgBox [data-f]').forEach(el=>o[el.dataset.f]=el.value.trim());return o}
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if($('#dlg').classList.contains('on'))dlgClose(dlgDefault);else if($('#modal').classList.contains('on'))modalBg()});


/* ===== Eseménykezelés (CSP: nincs inline handler, nincs eval) =====
   A sablonokban data-click/input/change/submit="fn(arg,...)" áll; az argumentum csak
   literál lehet (szám, 'szöveg', null, true/false), illetve this / this.value. */
const ACT=new Set(["addActiveNote", "addFreq", "addMeal", "addSet", "addTplNote", "addWarm", "adjRest", "applyAdapt", "applySugg", "askMenu", "askRest", "calMove", "calPick", "chooseEx", "clearDemo", "clearPlan", "closeModal", "copyGroup", "copyInstr", "copyMealToday", "copyMenu", "copyPlanReq", "delBody", "delEx", "delMeal", "delNote", "delTemplate", "delWorkout", "demoData", "discardWorkout", "dismissAdapt", "dlgBackdrop", "dlgClose", "downloadRecipes", "editBodyRow", "editEx", "editMeal", "editTemplate", "exportCsv", "exportData", "finishWorkout", "foodHelp", "foodNav", "foodToday", "formSubmit", "go", "goBack", "goProfile", "hideInstall", "histMore", "importData", "importHealthFile", "importSample", "importStrong", "installApp", "modalBg", "moveEx", "muDetail", "newExFromList", "newExercise", "obSkip", "openBody", "openCal", "openFood", "openHealthFile", "openHist", "openImport", "openKcal", "openNotes", "openPlan", "openPlanReq", "openStrong", "openSub", "openTplCat", "pasteMeals", "pastePlan", "pasteSteps", "pickForActive", "pickForTpl", "pickPlan", "pillPick", "planEmpty", "planManage", "plateCalc", "plateSet", "plateToggle", "qMealSet", "quickLog", "renderPick", "repeatWorkout", "resetAll", "resetKcal", "rmActiveNote", "rmEx", "rmSet", "rmSetAt", "saveAsTemplate", "saveBody", "savePlan", "saveTpl", "setAccent", "setBackupEvery", "setBodyDate", "setClaudeUrl", "setDay", "setDefRest", "setExRest", "setFPref", "setFoodDate", "setFoodRng", "setFx", "setLang", "setMuDays", "setProf", "setProfBody", "setRange", "setRestNotify", "setSound", "setStepGoal", "setStrEx", "setStrMetric", "setTheme", "setTplName", "setTplSets", "setTrendRng", "setVal", "setWName", "setWake", "showStr", "showWorkout", "startPick", "startPlanned", "startWorkout", "stepsHelp", "stopRest", "testSound", "toggleArchive", "toggleFPref", "toggleInfo", "toggleLog", "toggleProfLog", "toggleSS", "toggleSet", "toggleTrend", "toggleWaist", "toggleWu", "tpSet", "tplMove", "tplRemove", "undoRm", "updateTplFrom", "warmCalc", "warmToggle", "whyClaude"]);
function splitArgs(s){const out=[];let cur='',q=false;for(const ch of s){if(ch==="'")q=!q;if(ch===','&&!q){out.push(cur.trim());cur=''}else cur+=ch}if(cur.trim())out.push(cur.trim());return out}
function parseArg(a,el){if(a==='this')return el;if(a==='this.value')return el.value;if(/^'[^'"\\]*'$/.test(a))return a.slice(1,-1);if(/^-?\d+(\.\d+)?$/.test(a))return +a;if(a==='null')return null;if(a==='true')return true;if(a==='false')return false;throw new Error('arg')}
function runAct(src,el){const m=/^([A-Za-z_]\w*)\((.*)\)$/.exec((src||'').trim());if(!m||!ACT.has(m[1])||typeof window[m[1]]!=='function'){console.warn('Ismeretlen művelet:',src);return}
  let args;try{args=m[2].trim()?splitArgs(m[2]).map(a=>parseArg(a,el)):[]}catch(e){console.warn('Hibás argumentum:',src);return}window[m[1]].apply(el,args)}
for(const type of['click','input','change','submit'])document.addEventListener(type,e=>{
  if(type==='click'){const bd=e.target.closest&&e.target.closest('[data-backdrop]');if(bd&&e.target===bd){runAct(bd.dataset.backdrop+'()',bd);return}}
  const el=e.target.closest&&e.target.closest('[data-'+type+']');if(!el)return;if(type==='submit')e.preventDefault();runAct(el.getAttribute('data-'+type),el)});
/* Balra húzás egy sorozat során → Törlés gomb; jobbra húzás vagy máshova koppintás → vissza */
{let sx=0,sy=0,row=null,dec=false;
 document.addEventListener('touchstart',e=>{const tr=e.target.closest&&e.target.closest('table.sets tr[id^="r"]');row=tr;dec=false;if(!tr)return;const t=e.touches[0];sx=t.clientX;sy=t.clientY},{passive:true});
 document.addEventListener('touchmove',e=>{if(!row||dec)return;const t=e.touches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dy)>14&&Math.abs(dy)>Math.abs(dx)){row=null;return}
   if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.5){dec=true;const id=row.id.slice(1);const nx=dx<0?id:null;if(swRow!==nx){swRow=nx;const y=scrollY;render();scrollTo(0,y)}}},{passive:true});
 document.addEventListener('touchend',()=>{row=null},{passive:true});
 document.addEventListener('click',e=>{if(swRow&&!(e.target.closest&&e.target.closest('.rmsw'))&&!(e.target.closest&&e.target.closest('#r'+swRow))){swRow=null;const y=scrollY;render();scrollTo(0,y)}},true);}
/* kis segédműveletek a korábbi inline kódok helyett */
function setTplName(v){tplDraft.name=v}
function setTplSets(i,v){tplDraft.items[i].sets=Math.max(1,Math.min(30,parseInt(v)||1))}
function setWName(v){S.active.name=v;save()}
function tplRemove(i){tplDraft.items.splice(i,1);renderTpl()}
function setStrMetric(k){strMetric=k;render()}
function setStrEx(id){strEx=id;render()}
function showStr(id){strEx=id;render();document.getElementById('strcard')?.scrollIntoView({behavior:'smooth'})}
function setRange(v){statRange=v;const y=scrollY;render();scrollTo(0,y)}
/* a fejléc magassága a ragadós időszakválasztóhoz */
try{new ResizeObserver(()=>{const h=document.querySelector('header');if(h)document.documentElement.style.setProperty('--hh',h.offsetHeight+'px')}).observe(document.querySelector('header'))}catch(e){}
function stopRest(){rest=null;tick()}
function pickForTpl(){pickExercise(tplAddEx,renderTpl)}
function pickForActive(){pickExercise(addExToActive)}
function dlgBackdrop(){dlgClose(dlgDefault)}
function newExFromList(){createExercise().then(e=>e&&render())}
function saveAsTplFromSummary(id){closeModal();saveAsTemplate(id)}
function editBodyRow(d){bodyDate=d;render();scrollTo(0,0)}
function setBodyDate(v){bodyDate=/^\d{4}-\d\d-\d\d$/.test(v)?v:today();render()}
function setTheme(v){S.settings.theme=v;save();applyTheme();render()}
function setAccent(v){if(!['cyan','orange','pink'].includes(v))return;S.settings.accent=v;save();applyTheme();render()}
function openImport(){$('#imp').click()}
async function importSample(){
  const ex=n=>T(n),d=new Date();d.setDate(d.getDate()-1);const day=`${d.getFullYear()}-${z2(d.getMonth()+1)}-${z2(d.getDate())}`;
  const nm=L('Push nap','Push day'),cn=L('Futás','Run');
  const rows=[['Date','Workout Name','Duration','Exercise Name','Set Order','Weight','Reps','Distance','Seconds'],
    [day+' 18:00:00',nm,'55m',ex('Fekvenyomás (rúd)'),1,60,8,'',''],[day+' 18:00:00',nm,'55m',ex('Fekvenyomás (rúd)'),2,60,8,'',''],[day+' 18:00:00',nm,'55m',ex('Fekvenyomás (rúd)'),3,62.5,6,'',''],
    [day+' 18:00:00',nm,'55m',ex('Oldalemelés (kézisúlyzó)'),1,10,12,'',''],[day+' 18:00:00',nm,'55m',ex('Oldalemelés (kézisúlyzó)'),2,10,10,'',''],
    [day+' 18:00:00',nm,'55m',ex('Fekvőtámasz'),1,0,15,'',''],
    [day+' 07:30:00',cn,'32m',ex('Futás (terep)'),1,0,0,5.2,1860]];
  await shareOrDownload(L('edzes-import-minta.csv','workout-import-sample.csv'),'\ufeff'+rows.map(r=>r.map(c=>csvCell(c,',')).join(',')).join('\r\n'),'text/csv',L('Edzés-import minta','Workout import sample'));
}
function openStrong(){$('#impStrong').click()}
function setDefRest(v){S.settings.rest=Math.max(0,Math.min(1800,parseInt(v)||0));save();toast('Mentve')}
function formSubmit(){dlgClose(readForm())}

/* ===== Adatellenőrzés (import és betöltés) =====
   Az azonosítók és dátumok HTML-attribútumokba kerülnek, ezért szigorúan validáljuk őket. */
const ID_RE=/^[A-Za-z0-9_-]{1,40}$/,DATE_RE=/^\d{4}-\d\d-\d\d$/;
const num=(v,min,max)=>{v=+v;return isFinite(v)&&v>=min&&v<=max?v:null};
const str=(v,n=120)=>String(v??'').slice(0,n);
function sanitizeState(d){
  if(!d||typeof d!=='object'||!Array.isArray(d.exercises)||!Array.isArray(d.workouts))throw new Error('format');
  const map={},fix=id=>{const k=String(id);if(!map[k])map[k]=ID_RE.test(k)?k:uid();return map[k]};
  const o={v:num(d.v,1,99)||2,settings:{rest:num(d.settings?.rest,0,1800)??90,sound:num(d.settings?.sound,0,3)??3,claudeUrl:typeof d.settings?.claudeUrl==='string'&&/^https:\/\/claude\.ai\/[\w\-./?=&#%~]*$/.test(d.settings.claudeUrl)?d.settings.claudeUrl.slice(0,300):null,stepGoal:num(d.settings?.stepGoal,0,100000)??0,wakeLock:d.settings?.wakeLock!==false,uiSound:d.settings?.uiSound!==false,typeSound:d.settings?.typeSound!==false,doneSound:d.settings?.doneSound!==false,haptic:d.settings?.haptic!==false,restNotify:d.settings?.restNotify===true,accent:['orange','pink'].includes(d.settings?.accent)?d.settings.accent:'cyan',lang:['hu','en'].includes(d.settings?.lang)?d.settings.lang:null,startTab:START_TABS.some(x=>x[0]===d.settings?.startTab)?d.settings.startTab:'workout',theme:['light','dark'].includes(d.settings?.theme)?d.settings.theme:null,lastBackup:num(d.settings?.lastBackup,0,9e15)||undefined,installHide:num(d.settings?.installHide,0,9e15)||undefined,adaptSeen:typeof d.settings?.adaptSeen==='string'&&DATE_RE.test(d.settings.adaptSeen)?d.settings.adaptSeen:undefined,bar:[20,15,10,7].includes(+d.settings?.bar)?+d.settings.bar:undefined,plates:Array.isArray(d.settings?.plates)?d.settings.plates.map(Number).filter(v=>[25,20,15,10,5,2.5,1.25,0.5].includes(v)):undefined,foodPrefs:(()=>{const f=d.settings?.foodPrefs;if(!f||typeof f!=='object')return undefined;const keys=(a,list)=>(Array.isArray(a)?a:[]).filter(x=>list.some(y=>y[0]===x));
  return{diet:keys(f.diet,PREF_DIET),cuisine:(()=>{const c=keys(f.cuisine,PREF_CUISINE);if(Array.isArray(f.style)&&f.style.includes('hu')&&!c.includes('hu'))c.unshift('hu');return c})(),style:keys(f.style,PREF_STYLE),avoid:str(f.avoid||'',300),wish:str(f.wish||'',300),eq:keys(f.eq,PREF_EQUIP),skill:PREF_SKILL.some(y=>y[0]===f.skill)?f.skill:'intermediate',people:num(f.people,1,8)||1,cook:num(f.cook,1,4)||2,meals:num(f.meals,1,6)||4,equipment:str(f.equipment||'',300)}})()}};
  o.exercises=d.exercises.filter(e=>e&&e.name).map(e=>{const x={id:fix(e.id),name:str(e.name,100),cat:str(e.cat||'Egyéb',40)};if(['cardio','reps','time'].includes(e.kind))x.kind=e.kind;if(MUSCLES.some(m=>m[0]===e.mu))x.mu=e.mu;if(Array.isArray(e.mu2)){const a=[...new Set(e.mu2.filter(k=>k!==x.mu&&MUSCLES.some(m=>m[0]===k)))];if(a.length)x.mu2=a}if(EQUIP.some(q=>q[0]===e.eq))x.eq=e.eq;if(e.m===1)x.m=1;const r=num(e.rest,0,1800);if(r!=null&&e.rest!==''&&e.rest!=null)x.rest=r;return x});
  o.exercises.forEach(fillMeta);
  o.settings.backupEvery=[0,1,7,14].includes(d.settings?.backupEvery)?d.settings.backupEvery:7;if(d.settings?.demo===true)o.settings.demo=true;for(const k of['obSteps','obClaude'])if(d.settings?.[k]===true)o.settings[k]=true;
  const sets=a=>(Array.isArray(a)?a:[]).map(s=>{const x={w:num(s?.w,0,2000)??0,r:num(s?.r,0,10000)??0};if(s?.wu===true)x.wu=true;else if(s?.st==='d'||s?.st==='f')x.st=s.st;return x});
  const notes=(a,withW)=>(Array.isArray(a)?a:[]).filter(n=>n&&n.text).map(n=>{const x={id:fix(n.id||uid()),ts:num(n.ts,0,9e15)||Date.now(),text:str(n.text,2000)};if(withW)x.wid=n.wid?fix(n.wid):null;return x});
  o.templates=(Array.isArray(d.templates)?d.templates:[]).filter(t=>t&&t.name).map(t=>{const x={id:fix(t.id),name:str(t.name,100),items:(Array.isArray(t.items)?t.items:[]).map(i=>{const x={exId:fix(i?.exId),sets:num(i?.sets,1,30)||3};if(i?.ss===true)x.ss=true;if(typeof i?.reps==='string'&&/^[\d\s–\-]{1,9}$/.test(i.reps))x.reps=i.reps;return x})};const pl=str(t.plan||'',60).trim();if(pl)x.plan=pl;
    const ns=notes(t.notes,true);if(ns.length)x.notes=ns;if(t.archived===true)x.archived=true;return x});
  o.plans={};if(d.plans&&typeof d.plans==='object')for(const[k,v]of Object.entries(d.plans))if(/^\d{4}-\d\d-\d\d$/.test(k)&&typeof v==='string'){const id=fix(v);if(o.templates.some(t=>t.id===id))o.plans[k]=id}
  o.workouts=d.workouts.filter(w=>w&&num(w.start,0,9e15)).map(w=>({id:fix(w.id),name:str(w.name||'Edzés',100),start:+w.start,end:num(w.end,0,9e15)||+w.start,tplId:w.tplId?fix(w.tplId):null,
    exercises:(Array.isArray(w.exercises)?w.exercises:[]).map(e=>({exId:fix(e?.exId),...(e?.ss===true?{ss:true}:{}),sets:sets(e?.sets)})),
    prs:(Array.isArray(w.prs)?w.prs:[]).filter(p=>p&&['w','e','r','v'].includes(p.type)).map(p=>({exId:fix(p.exId),type:p.type,val:num(p.val,0,1e7)||0}))}));
  o.body=(Array.isArray(d.body)?d.body:[]).filter(b=>b&&DATE_RE.test(b.date)).map(b=>{const x={date:b.date};const w=num(b.weight,20,400),f=num(b.fat,2,70),wa=num(b.waist,30,250),st=num(b.steps,0,200000);if(w!=null)x.weight=w;if(f!=null)x.fat=f;if(wa!=null)x.waist=wa;for(const[k]of BODY_X){const v=num(b[k],10,250);if(v!=null)x[k]=v}if(st!=null)x.steps=Math.round(st);return x}).filter(b=>Object.keys(b).length>1);
  o.meals=(Array.isArray(d.meals)?d.meals:[]).filter(m=>m&&DATE_RE.test(m.date)&&m.name).map(m=>({id:fix(m.id),date:m.date,meal:MEALS.some(x=>x[0]===m.meal)?m.meal:'nasi',name:str(m.name,100),kcal:Math.round(num(m.kcal,0,10000)??0),p:num(m.p,0,1000)??0,c:num(m.c,0,1000)??0,f:num(m.f,0,1000)??0,fib:m.fib==null||m.fib===''?null:num(m.fib,0,500)}));
  {const pr=d.profile||{};o.profile={sex:['m','f'].includes(pr.sex)?pr.sex:null,birthYear:num(pr.birthYear,1900,new Date().getFullYear())||null,height:num(pr.height,100,250)||null,
    activity:ACT_LV.some(a=>a[0]===+pr.activity)?+pr.activity:null,goal:GOALS.some(g=>g[0]===pr.goal)?pr.goal:null,pace:[0,1,2].includes(+pr.pace)?+pr.pace:1,
    targetWeight:num(pr.targetWeight,30,300)||null,kcalOverride:num(pr.kcalOverride,1200,6000)||null}}
  o.profileLog=(Array.isArray(d.profileLog)?d.profileLog:[]).filter(e=>e&&num(e.ts,0,9e15)&&typeof e.f==='string'&&e.f in PROF_F).slice(-200).map(e=>{const v=x=>x==null?null:typeof x==='number'?x:str(x,40);const y={ts:+e.ts,f:e.f,a:v(e.a),b:v(e.b),k0:num(e.k0,0,10000)||null,k1:num(e.k1,0,10000)||null};if(e.src==='adapt')y.src='adapt';return y});
  const a=d.active;
  o.active=a&&num(a.start,0,9e15)?{id:fix(a.id),name:str(a.name,100),start:+a.start,tplId:a.tplId?fix(a.tplId):null,exercises:(Array.isArray(a.exercises)?a.exercises:[]).map(e=>({exId:fix(e?.exId),...(e?.ss===true?{ss:true}:{}),...(typeof e?.reps==='string'&&/^[\d\s–\-]{1,9}$/.test(e.reps)?{reps:e.reps}:{}),sets:(Array.isArray(e?.sets)?e.sets:[]).map(s=>{const x={w:s?.w===''?'':num(s?.w,0,2000)??'',r:s?.r===''?'':num(s?.r,0,10000)??'',done:!!s?.done};if(s?.wu===true)x.wu=true;else if(s?.st==='d'||s?.st==='f')x.st=s.st;return x})})),notes:notes(a.notes,false)}:null;
  return o;
}

/* ===== Navigáció, keret ===== */
function setStartTab(k){if(!START_TABS.some(x=>x[0]===k))return;S.settings.startTab=k;save();render()}
function go(t){document.activeElement&&document.activeElement.blur&&document.activeElement.blur();if(t==='more')setSub=null;if(t==='history')t='home';back=null;tab=t;render();scrollTo(0,0)}
/* Megnyitás úgy, hogy a Vissza oda vigyen, ahonnan jöttünk */
function goFrom(t){const b={tab,sub:setSub,y:scrollY};go(t);back=b;render()}
const BACK_LBL={home:'Ma',food:'Étkezés',workout:'Edzések',body:'Test',stats:'Statisztika',more:'Beállítások',hist:'Edzéstörténet'};
function render(){
  const home=tab==='home';
  if(home){const d=pYmd(homeDay),wd=d.toLocaleDateString(LOC(),{weekday:'long'});
    $('#hl').innerHTML=`<button class="hbtn" data-click="openCal()" aria-label="Naptár megnyitása">${I('calendar-days','sm')}<span>Ma</span></button>`;
    $('#title').innerHTML=`<span class="hd1">${esc(wd.charAt(0).toUpperCase()+wd.slice(1))}</span><span class="hd2">${esc(d.toLocaleDateString(LOC(),{year:'numeric',month:'long',day:'numeric'}))}</span>`;
    $('#hdr').innerHTML=`<button class="hico" data-click="go('stats')" aria-label="Statisztika">${I('chart-no-axes-combined','sm')}</button><button class="hico" data-click="go('more')" aria-label="Beállítások">${I('settings','sm')}</button>`;
  }else{
    const toSet=tab==='more'&&setSub,bl=back?(back.sub?'Beállítások':BACK_LBL[back.tab]||'Vissza'):toSet?'Beállítások':'Ma';
    $('#hl').innerHTML=`<button class="hbtn" data-click="goBack()" aria-label="Vissza">${I('chevron-left','sm')}<span>${bl}</span></button>`;
    $('#title').textContent=toSet?SUBS[setSub][0]:tab==='tpls'?(tplCats().find(c=>c.id===tplCat)?.label||'Sablonok'):{workout:S.active?'Edzés folyamatban':'Edzések és sablonok',food:'Étkezés',body:'Testadatok',stats:'Statisztika',more:'Beállítások',hist:'Edzéstörténet'}[tab];
    $('#hdr').innerHTML=S.active&&tab!=='workout'?`<button class="pill" data-click="go('workout')" aria-label="Edzés folytatása">${I('flame','sm')}<span id="elapsed2"></span></button>`:'';
  }
  document.body.classList.toggle('home',home);
  for(const k in CH)delete CH[k];
  $('main').innerHTML=({home:vHome,workout:S.active?vActive:vWorkout,food:vFood,body:vBody,stats:vStats,more:vMore,hist:vHist,tpls:vTpls})[tab]();
  attachCharts();tick();updAvol();syncWake();updWakeUI();
}
function goBack(){if(back){const b=back;back=null;tab=b.tab;setSub=b.sub;render();scrollTo(0,b.y||0);return}if(tab==='more'&&setSub){setSub=null;render();scrollTo(0,0)}else go('home')}
function openModal(h){$('#sheet').innerHTML=h;$('#modal').classList.add('on')}
function closeModal(){$('#modal').classList.remove('on')}
function modalBg(){if(pickCb){const c=pickCancel;pickCb=pickCancel=null;closeModal();c&&c()}else closeModal()}
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.classList.remove('act');t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2200)}
/* toast művelettel (pl. Visszavonás), 5 mp-ig */
function toastAct(m,btn){const t=$('#toast');t.innerHTML=`<span>${esc(m)}</span>${btn}`;t.classList.add('on','act');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on','act'),5000)}

/* ===== Főképernyő (Ma) – minden egy helyen: heti sáv, étkezés + makrók, test, lépés, edzés ===== */
function dayMaps(){const wDay={};for(const w of S.workouts){const k=ymd(new Date(w.start));(wDay[k]=wDay[k]||[]).push(w)}
  const bMap={};for(const b of S.body)bMap[b.date]=b;return{wDay,bMap,mDay:new Set(S.meals.map(m=>m.date))}}
function dayDots(k,M){return(M.wDay[k]?`<i style="background:${C.workout}"></i>`:'')+(hasMeas(M.bMap[k])?`<i style="background:${C.weight}"></i>`:'')+(M.bMap[k]?.steps!=null?`<i style="background:${C.steps}"></i>`:'')+(M.mDay.has(k)?`<i style="background:${C.kcal}"></i>`:'')}
function setDay(k){homeDay=k;render()}
function lastUse(){const lastOf={},uses={};for(const w of S.workouts)if(w.tplId){lastOf[w.tplId]=Math.max(lastOf[w.tplId]||0,w.start);uses[w.tplId]=(uses[w.tplId]||0)+1}return{lastOf,uses}}
/* Léptetés az adott típusú bejegyzés előző/következő napjára (a kártya fejlécében) */
function dayNav(list){list=[...list].sort();let p=null,n=null;for(const k of list){if(k<homeDay)p=k;else if(k>homeDay&&!n)n=k}
  return`<span class="calnav"><button class="btn sm ico" ${p?`data-click="setDay('${p}')"`:'disabled'} aria-label="Előző bejegyzés">${I('chevron-left','sm')}</button><button class="btn sm ico" ${n?`data-click="setDay('${n}')"`:'disabled'} aria-label="Következő bejegyzés">${I('chevron-right','sm')}</button></span>`}
function vHome(){
  const M=dayMaps(),td=today(),isT=homeDay===td,d=pYmd(homeDay),off=(d.getDay()+6)%7;
  const dn=LANG==='en'?['Mo','Tu','We','Th','Fr','Sa','Su']:['H','K','Sze','Cs','P','Szo','V'];
  let h=`<div class="wk">`;
  for(let i=0;i<7;i++){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()-off+i),k=ymd(x);
    h+=`<button class="d${k===td?' t':''}${k===homeDay?' sel':''}${k>td?' f':''}" data-click="setDay('${k}')" aria-label="${esc(x.toLocaleDateString(LOC(),{month:'long',day:'numeric',weekday:'long'}))}" aria-current="${k===homeDay?'date':'false'}"><span class="dw">${dn[i]}</span><span class="dn">${x.getDate()}</span><span class="dots">${dayDots(k,M)}</span></button>`}
  h+=`</div>`;
  if(!isT)h+=`<button class="linkbtn" style="margin:-4px 0 10px" data-click="setDay('${td}')">${I('chevron-left','sm')} Vissza a mai napra</button>`;
  if(isT)h+=installCard()+notices();
  if(S.active&&isT)h+=activeCard();
  h+=kcalCard(M);
  h+=bodyCard(M)+stepsCard(M);
  h+=workoutSection(M);
  h+=`<div class="hint" style="text-align:center;margin-top:14px">Minden adat ezen a készüléken marad.</div>`;
  return h;
}
function activeCard(){const a=S.active,all=a.exercises.reduce((n,e)=>n+e.sets.length,0),done=a.exercises.reduce((n,e)=>n+e.sets.filter(x=>x.done).length,0);
  let nx='';for(const e of a.exercises){const j=e.sets.findIndex(x=>!x.done);if(j>=0){nx=`${esc(exName(e.exId))} · ${j+1}. ${L('sorozat','set')}`;break}}
  return`<div class="card hcard runcard" data-click="go('workout')" role="button" tabindex="0" aria-label="Vissza a futó edzéshez">
  <div class="row" style="flex-wrap:nowrap"><span class="livedot"></span><span class="hk" style="flex:1;color:var(--kj-blue-line)">Edzés folyamatban</span><b class="mono" id="elapsed2">0:00</b></div>
  <div class="htitle">${esc(T(a.name))}</div>
  <div class="row small mut" style="flex-wrap:nowrap;margin-top:8px"><span style="flex:1;min-width:0">${nx?L('Következő: ','Next: ')+nx:L('Minden sorozat kész','All sets done')}</span><span class="mono">${done}/${all}</span></div>
  <div class="bar"><i style="width:${all?Math.round(done/all*100):0}%;background:var(--kj-blue-line)"></i></div>
  <button class="btn p block" style="margin-top:12px" data-click="go('workout')">Vissza az edzéshez</button></div>`}
const MACS=[['p','Fehérje','drumstick','--c-protein'],['c','Szénhidrát','wheat','--c-carb'],['f','Zsír','droplet','--c-fatm'],['fib','Rost','leaf','--c-fiber']];
/* Közös étkezés-vizuál (főképernyő és Étkezés nézet): fogyó korong + makródobozok */
function kcalViz(ms,head){
  const s=sumMeals(ms),t=targets(),g=t.kcal;
  const rem=g?g-s.kcal:null,pct=g?Math.max(0,Math.min(100,rem/g*100)):(s.kcal?0:100),over=g?s.kcal-g:0,big=!!g&&over>g*.1;
  const center=!g?`<b>–</b><span>${L('nincs keret','no target')}</span>`:rem>=0?`<b>${fmt(rem,0)}</b><span>kcal maradt</span>`:`<b>${Math.round(s.kcal/g*100)}%</b><span>a keretből</span>`;
  const macs=MACS.map(([k,l,ic,cv])=>{const v=s[k]||0,goal=t[k],p=goal?Math.min(100,v/goal*100):0,ov=goal&&k!=='fib'&&v>goal?Math.round(v-goal):0;
    return`<div class="mac${ov?' over':''}" style="--mc:var(${cv})"><div class="mbox"><div class="mfill" style="height:${p.toFixed(1)}%"></div><div class="mic">${I(ic)}<div class="mclip" style="height:${p.toFixed(1)}%"><svg class="ic filled"><use href="#i-${ic}"/></svg></div></div>${ov?`<span class="mbadge">+${ov}</span>`:''}</div><span class="ml">${l}</span><span class="mv"><b>${fmt(v,0)}</b>${goal?`/${goal}`:''} g</span></div>`}).join('');
  return`<div class="kc"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:10px">
    ${head}
    <div><div class="bignum">${fmt(s.kcal,0)}</div><div class="small mut">kcal elfogyasztva</div></div>
    <div class="row small" style="gap:16px"><div><b class="mono">${g?fmt(g,0):'–'}</b><div class="mut">keret</div></div><div><b class="mono">${ms.length}</b><div class="mut">tétel</div></div></div></div>
  <div class="discw${big?' over':''}"><div class="disc"><div class="lvl" style="height:${pct.toFixed(1)}%"></div></div><div class="dc">${center}</div>${big?`<span class="badge">+${fmt(over,0)}</span>`:''}</div></div>
  <div class="macs">${macs}</div>`;
}
function kcalCard(M){
  const ms=S.meals.filter(m=>m.date===homeDay),g=targets().kcal;
  return`<div class="card hcard" data-click="openFood()" role="button" tabindex="0" aria-label="Étkezés megnyitása">
  ${kcalViz(ms,`<div class="row" style="flex-wrap:nowrap"><span class="hk" style="flex:1">Étkezés</span>${dayNav(M.mDay)}</div>`)}
  ${!g?`<div class="hint" style="margin-top:10px">Kalóriakeret: Beállítások → Profil és célok.</div>`:''}</div>`;
}
function bodyCard(M){const b=M.bMap[homeDay],list=S.body.filter(x=>hasMeas(x)).map(x=>x.date);
  let inner;
  if(hasMeas(b)){const prev=S.body.filter(x=>x.date<homeDay&&x.weight!=null).sort((x,y)=>x.date<y.date?1:-1)[0];
    const dw=b.weight!=null&&prev?b.weight-prev.weight:null;
    const c=(v,u,extra='')=>`<div><div class="midnum">${v==null?'–':hu(v,1)}</div><div class="small mut">${u}${extra}</div></div>`;
    inner=`<div class="grid3h">${c(b.weight,'kg',dw!=null&&Math.abs(dw)>=.05?` · <span style="color:${dw<0?'var(--kj-green)':'var(--kj-gold)'}">${sgn(dw)}</span>`:'')}${c(b.fat,'% testzsír')}${c(b.waist,'cm derék')}</div>`}
  else{const lw=lastWeight();inner=`<div class="small mut">Nincs mérés erre a napra${lw?` · ${L('utolsó súly','last weight')}: <b class="mono" style="color:var(--kj-text)">${hu(lw,1)} kg</b>`:''}</div>`}
  return`<div class="card hcard" data-click="openBody()" role="button" tabindex="0" aria-label="Testadatok megnyitása"><div class="row" style="flex-wrap:nowrap;margin-bottom:10px"><span class="hk" style="flex:1">Test</span>${dayNav(list)}</div>${inner}</div>`}
function stepsCard(M){const st=M.bMap[homeDay]?.steps,goal=S.settings.stepGoal||0,list=S.body.filter(x=>x.steps!=null).map(x=>x.date);
  return`<div class="card hcard" data-click="openBody()" role="button" tabindex="0" aria-label="Lépésszám"><div class="row" style="flex-wrap:nowrap;gap:12px"><span class="stepic">${I('footprints','sm')}</span>
  <div style="flex:1;min-width:0"><div class="row" style="gap:6px;flex-wrap:nowrap"><span class="midnum">${st!=null?fmt(st,0):'–'}</span><span class="small mut">${goal?`/ ${fmt(goal,0)} `:''}lépés</span></div>
  ${goal?`<div class="bar"><i style="width:${st?Math.min(100,st/goal*100).toFixed(1):0}%;background:var(--c-steps)"></i></div>`:''}</div>${dayNav(list)}</div></div>`}
function plans(){S.plans=S.plans||{};return S.plans}
function workoutSection(M){
  const td=today(),isT=homeDay===td,future=homeDay>td,dw=(M.wDay[homeDay]||[]).sort((a,b)=>a.start-b.start);
  const nav=dayNav(Object.keys(M.wDay)),pl=plans()[homeDay],pt=pl&&S.templates.find(t=>t.id===pl);
  let h='';
  const showPlan=pt&&(future||(isT&&!S.active&&!dw.some(w=>w.tplId===pt.id)));
  if(showPlan){const {lastOf}=lastUse(),sets=pt.items.reduce((n,i)=>n+(i.sets||0),0);
    h+=`<div class="card hcard" data-click="openPlan()" role="button" tabindex="0" aria-label="Mai edzés">
    <div class="row" style="flex-wrap:nowrap"><span class="hk" style="flex:1">${isT?'Mai edzés':'Tervezett edzés'}</span><button class="linkbtn" style="margin:0;padding:0;width:auto;flex:none" data-click="openPlan()">Csere</button></div>
    <div class="htitle">${esc(T(pt.name))}</div>
    <div class="small mut" style="margin-top:4px">${pt.items.length} ${L('gyakorlat','exercises')} · ${sets} ${L('sorozat','sets')}${lastOf[pt.id]?' · '+L('utoljára','last')+' '+relDay(lastOf[pt.id]):''}</div>
    <div class="small mut" style="margin-top:8px;line-height:1.5">${pt.items.map(i=>esc(exName(i.exId))).join(' · ')}</div>
    ${isT?`<button class="btn p block" style="margin-top:12px" data-click="startPlanned()">${I('flame','sm')} Edzés indítása</button>`:''}</div>`}
  if(dw.length){h+=`<div class="row" style="margin:16px 2px 10px;flex-wrap:nowrap"><h3 style="flex:1;margin:0">${isT?'Mai edzés':'Edzés'}</h3>${nav}</div>`+dw.map(w=>workoutCard(w)).join('')}
  if(!showPlan&&!dw.length&&!(S.active&&isT)){
    h+=`<div class="card restcard"><div class="row" style="flex-wrap:nowrap"><span class="hk" style="flex:1">${isT?'Mai edzés':'Edzés'}</span>${nav}</div>
    <div class="htitle mut">${homeDay<td?'Nem volt edzés':'Pihenőnap'}</div>
    ${homeDay<td?'':`<div class="small mut" style="margin-top:4px">${future?'Erre a napra nincs tervezett edzés.':'Ma nincs tervezett edzés.'}</div><button class="btn block" style="margin-top:12px;border-color:var(--kj-blue-line);color:var(--kj-blue-line)" data-click="openPlan()">${I('plus','sm')} ${isT?'Tervezd meg a mai edzést':'Edzés tervezése'}</button>`}</div>`}
  if(isT&&dw.length&&!S.active&&!showPlan)h+=`<button class="linkbtn" data-click="openPlan()">${I('plus','sm')} Még egy edzés</button>`;
  h+=`<div class="row" style="justify-content:center;gap:18px;flex-wrap:nowrap"><button class="linkbtn" style="width:auto" data-click="go('workout')">Edzések és sablonok ${I('chevron-right','sm')}</button>${S.workouts.length?`<button class="linkbtn" style="width:auto" data-click="openHist()">${I('history','sm')} Edzéstörténet</button>`:''}</div>`;
  return h;
}
function openFood(){foodDate=homeDay;go('food')}
function openBody(){bodyDate=homeDay;go('body')}
/* Mai edzés tervezése: sablon kiválasztása az Edzéseim és a Sablonok közül */
function openPlan(){planPick=plans()[homeDay]||null;renderPlan()}
function pickPlan(id){planPick=id;renderPlan()}
function renderPlan(){const {lastOf}=lastUse(),isT=homeDay===today();
  const used=S.templates.filter(t=>lastOf[t.id]&&!t.archived).sort((a,b)=>lastOf[b.id]-lastOf[a.id]),fresh=S.templates.filter(t=>!lastOf[t.id]&&!t.archived);
  const row=t=>`<button class="planrow${planPick===t.id?' on':''}" data-click="pickPlan('${t.id}')" aria-pressed="${planPick===t.id}"><span class="radio">${planPick===t.id?I('check','sm'):''}</span><span style="flex:1;min-width:0;text-align:left"><b>${esc(T(t.name))}</b><span class="small mut" style="display:block">${t.items.length} ${L('gyakorlat','exercises')}${lastOf[t.id]?' · '+L('utoljára','last')+' '+relDay(lastOf[t.id]):''}</span></span></button>`;
  openModal(`<h2>${isT?'Mai edzés':esc(pYmd(homeDay).toLocaleDateString(LOC(),{month:'long',day:'numeric',weekday:'long'}))}</h2><div class="hint" style="margin:-4px 0 12px">Válaszd ki, mit edzel – a főképernyőn csak ez látszik.</div>
  ${used.length?`<div class="grp">Edzéseim</div>${used.map(row).join('')}`:''}
  ${fresh.length?`<div class="grp">Sablonok</div>${fresh.map(row).join('')}`:''}
  <div class="row" style="margin:12px 0 4px;gap:14px"><button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="planEmpty()">Üres edzés</button><button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="planManage()">Edzések és sablonok</button></div>
  <div class="row" style="position:sticky;bottom:calc(-20px - env(safe-area-inset-bottom));margin:14px -16px calc(-20px - env(safe-area-inset-bottom));padding:12px 16px calc(14px + env(safe-area-inset-bottom));border-top:1px solid var(--kj-border);background:var(--kj-sheet)">${plans()[homeDay]?`<button class="btn d" data-click="clearPlan()">Terv törlése</button>`:''}<span class="sp"></span><button class="btn" data-click="savePlan()" ${planPick?'':'disabled'}>${isT?'Mai tervnek':'Tervbe'}</button>${isT?`<button class="btn p" data-click="startPick()" ${planPick?'':'disabled'}>Indítás most</button>`:''}</div>`)}
function savePlan(){if(!planPick)return;plans()[homeDay]=planPick;prunePlans();save();closeModal();render()}
function clearPlan(){delete plans()[homeDay];save();closeModal();render()}
function startPick(){if(!planPick)return;plans()[homeDay]=planPick;prunePlans();save();closeModal();startWorkout(planPick)}
function startPlanned(){const id=plans()[homeDay];if(id)startWorkout(id)}
function planEmpty(){closeModal();startWorkout()}
function planManage(){closeModal();go('workout')}
function prunePlans(){const lim=ymd(new Date(Date.now()-7*DAY));for(const k in plans())if(k<lim)delete S.plans[k]}
/* Naptár modalban: napra koppintva a főképernyő arra a napra vált */
function openCal(){const d=pYmd(homeDay);calMonth=[d.getFullYear(),d.getMonth()];openModal(calHtml())}
function calMove(n){let[y,m]=calMonth;m+=n;if(m<0){m=11;y--}if(m>11){m=0;y++}calMonth=[y,m];$('#sheet').innerHTML=calHtml()}
function calPick(k){homeDay=k;back=null;closeModal();if(tab!=='home')tab='home';render();scrollTo(0,0)}
function calHtml(){const[y,m]=calMonth,first=new Date(y,m,1),off=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),n=Math.ceil((off+days)/7)*7,M=dayMaps(),td=today();
  let cells=(LANG==='en'?['Mo','Tu','We','Th','Fr','Sa','Su']:['H','K','Sze','Cs','P','Szo','V']).map(d=>`<div class="h">${d}</div>`).join('');
  for(let i=0;i<n;i++){const d=new Date(y,m,1-off+i),k=ymd(d);cells+=`<div class="d ${d.getMonth()!==m?'o':''} ${k===td?'t':''} ${k===homeDay?'sel':''}" data-click="calPick('${k}')">${d.getDate()}<div class="dots">${dayDots(k,M).replace(/<i /g,'<i class="dot" ')}</div></div>`}
  const mW=S.workouts.filter(w=>{const d=new Date(w.start);return d.getFullYear()===y&&d.getMonth()===m});
  const mB=S.body.filter(b=>{const d=pYmd(b.date);return d.getFullYear()===y&&d.getMonth()===m&&b.weight!=null}).sort((a,b)=>a.date<b.date?-1:1);
  const mDelta=mB.length>1?mB[mB.length-1].weight-mB[0].weight:null;
  return`<div class="row" style="margin-bottom:12px;flex-wrap:nowrap"><button class="iconbtn" data-click="calMove(-1)" aria-label="Előző hónap">${I('chevron-left')}</button><h2 style="flex:1;text-align:center;margin:0;text-transform:capitalize">${first.toLocaleDateString(LOC(),{year:'numeric',month:'long'})}</h2><button class="iconbtn" data-click="calMove(1)" aria-label="Következő hónap">${I('chevron-right')}</button></div>
  <div class="cal">${cells}</div>
  <div class="legend" style="margin-top:12px"><span><i style="background:${C.workout}"></i>Edzés</span><span><i style="background:${C.weight}"></i>Testmérés</span><span><i style="background:${C.steps}"></i>Lépés</span><span><i style="background:${C.kcal}"></i>Étkezés</span></div>
  <div class="grid3" style="margin:12px 0">${stat('Edzés a hónapban',mW.length)}${stat('Volumen',mW.length?fmtShort(mW.reduce((a,w)=>a+wVolume(w),0))+' kg':null)}${stat('Súlyváltozás',mDelta==null?null:sgn(mDelta)+' kg')}</div>
  <div class="row"><button class="btn" data-click="calPick('${td}')">Ma</button><span class="sp"></span><button class="btn p" data-click="closeModal()">Bezárás</button></div>`}

/* ===== Edzés kezdőlap ===== */
function notices(){
  const rows=[],miss=profileMissing();
  const empty=!S.workouts.length&&!S.meals.length&&!S.body.length;
  if(S.settings.demo)rows.push([L('Mintaadatokat látsz. Mielőtt valódi használatba veszed az appot, töröld őket.','You’re looking at sample data. Delete it before you start using the app for real.'),`<button class="btn sm d" data-click="clearDemo()">${L('Törlés','Delete')}</button>`]);
  if(miss.length)rows.push(empty&&!S.settings.demo?[L('A személyes célokhoz töltsd ki a profiladatokat. Ha előbb csak kipróbálnád, hogyan működik, tölts be mintaadatokat.','Fill in your profile for personal targets. If you just want to see how it works first, load sample data.'),`<button class="btn sm" data-click="goProfile()">${L('Profil','Profile')}</button><button class="btn sm gold" data-click="demoData()">${L('Mintaadatok','Sample data')}</button>`]
    :['A személyes egészségcélok elérése érdekében töltsd ki a profiladatokat',`<button class="btn sm" data-click="goProfile()">Beállítások</button>`]);
  /* Bevezető lépések: profil → lépéscél (kihagyható) → étkezésnapló Claude-dal */
  if(!S.settings.demo&&targets().kcal){
    if(!S.settings.stepGoal&&!S.settings.obSteps)rows.push([L('Következő lépés: állíts be napi lépéscélt. Nem kötelező, de a statisztika és a főképernyő így mutatja, hol tartasz.','Next step: set a daily step goal. Optional, but then stats and the home screen show how you’re doing.'),`<button class="btn sm" data-click="openSub('profile','stepgoalc')">${L('Beállítom','Set it')}</button><button class="btn sm" data-click="obSkip('obSteps')">${L('Kihagyom','Skip')}</button>`]);
    else if(!S.settings.claudeUrl&&!S.settings.obClaude)rows.push([L('Étkezésnapló Claude-dal: fényképről, diktálva vagy kézzel jegyzetelve is részletes kalória- és makróértékeket kapsz, amelyeket egy koppintással rögzítesz. Első lépésként állítsd be az étkezési preferenciáidat, utána jön a Claude-projekt.','Food log with Claude: from a photo, by voice or from notes you get detailed calories and macros that you log with one tap. First set your food preferences, then the Claude project.'),`<button class="btn sm" data-click="openSub('food')">${L('Beállítás','Set up')}</button><button class="btn sm" data-click="obSkip('obClaude')">${L('Most nem','Not now')}</button>`]);}
  if(!S.settings.demo&&S.settings.backupEvery&&S.workouts.length+S.body.length+S.meals.length>=5){const lb=S.settings.lastBackup||0,days=Math.floor((Date.now()-lb)/DAY);
    if(!lb||days>=S.settings.backupEvery)rows.push([(lb?`${days} napja nem mentettél`:'Még nem készült mentés')+' – az adatok csak ezen az eszközön vannak',`<button class="btn sm" data-click="exportData()">Mentés</button>`])}
  {const a=adaptive();if(a&&a.ready&&Math.abs(a.diff)>=100&&S.settings.adaptSeen!==weekKey())rows.push([L(`Heti keretkorrekció: a súlytrended és az étkezéseid alapján ${fmt(a.cur,0)} → ${fmt(a.step,0)} kcal javasolt`,`Weekly target check: based on your weight trend and meals, ${fmt(a.cur,0)} → ${fmt(a.step,0)} kcal is suggested`),`<button class="btn sm" data-click="openSub('profile','adapt')">Megnézem</button><button class="btn sm ico" data-click="dismissAdapt()" aria-label="Később">${I('x','sm')}</button>`])}
  if(!rows.length)return '';
  return `<div class="card notice">${rows.map(([t,b])=>`<div class="row li" style="flex-wrap:wrap"><span class="nd"></span><span class="small" style="flex:1 1 180px">${t}</span><span class="row" style="gap:6px;margin-left:auto;flex-wrap:nowrap">${b}</span></div>`).join('')}</div>`;
}
/* ===== Adaptív kalóriakeret: a tényleges energiaigény a bevitelből és a súlytrendből (28 nap) ===== */
function adaptive(){const t=targets();if(!t.tdee||!t.adult)return null;
  const td=today(),start=ymd(new Date(pYmd(td).getTime()-28*DAY)),byDay={};
  for(const m of S.meals)if(m.date>=start&&m.date<td)byDay[m.date]=(byDay[m.date]||0)+(m.kcal||0);
  const logged=Object.values(byDay).filter(k=>k>=800);
  const ws=series('weight').filter(p=>p.x>=pYmd(start).getTime()),span=ws.length?(ws[ws.length-1].x-ws[0].x)/DAY:0;
  if(logged.length<14||ws.length<8||span<14)return{ready:false,days:logged.length,weights:ws.length,span:Math.round(span)};
  const avgIn=logged.reduce((a,b)=>a+b,0)/logged.length,slope=slopeWeek(ws);if(slope==null)return{ready:false,days:logged.length,weights:ws.length,span:Math.round(span)};
  const tdeeA=Math.round(avgIn-slope*7700/7),cur=t.kcal||t.suggested;
  /* Biztonsági korlát: a becslés az alapanyagcsere alatt valószínűleg hiányos rögzítést jelez – ilyenkor nem javaslunk csökkentést;
     és a keret soha nem megy a minimum, illetve a képlet szerinti energiaigény 70%-a alá. */
  const suspect=tdeeA<t.bmr,low=Math.max(t.floor,r5(t.tdee*.7)),ideal=Math.max(low,r5(tdeeA+t.adj));
  let step=Math.max(low,Math.max(cur-250,Math.min(cur+250,ideal)));if(suspect&&step<cur)step=cur;
  return{ready:true,days:logged.length,avgIn:Math.round(avgIn),slope,tdeeA,ideal,cur,step:r5(step),diff:r5(step)-cur,suspect}}
function adaptCard(){const a=adaptive();if(!a)return'';
  if(!a.ready)return`<div class="card" id="adapt"><h2>Adaptív keret</h2><div class="hint" style="margin-top:-4px">A tényleges energiaigényedet az étkezéseidből és a súlyod változásából számolom. Ehhez az elmúlt 4 hétből kell legalább 14 rögzített nap (napi 800 kcal felett) és legalább 8 mérés 2 hét alatt.</div>
    <div class="grid3" style="margin-top:10px">${stat('Rögzített nap',a.days+' / 14')}${stat('Mérés',a.weights+' / 8')}${stat('Időtáv',a.span+' / 14 nap')}</div></div>`;
  return`<div class="card" id="adapt"><h2>Adaptív keret</h2>
  <div class="grid3">${stat('Átlagos bevitel',fmt(a.avgIn,0)+' kcal')}${stat('Súlytrend',sgn(a.slope)+' kg/hét')}${stat('Tényleges energiaigény',fmt(a.tdeeA,0)+' kcal')}</div>
  ${a.suspect?`<div class="hint" style="color:var(--kj-gold)">${L('A becsült energiaigény az alapanyagcseréd alatt van – valószínűleg nem minden étkezés került rögzítésre. Ilyenkor nem javaslok csökkentést.','The estimate is below your basal metabolic rate – probably not every meal was logged. In that case I don’t suggest lowering your target.')}</div>`:''}
  <div class="hint">${L(`Az elmúlt 4 hét ${a.days} rögzített napja és a súlytrend alapján. A célodhoz illő keret kb. ${fmt(a.ideal,0)} kcal; egyszerre legfeljebb 250 kcal-t javaslok módosítani.`,`Based on ${a.days} logged days in the last 4 weeks and your weight trend. The target for your goal is about ${fmt(a.ideal,0)} kcal; I suggest changing it by at most 250 kcal at a time.`)}</div>
  ${Math.abs(a.diff)>=50?`<div class="row" style="margin-top:10px"><span class="small" style="flex:1">${L('Javasolt keret','Suggested target')}: <b class="mono">${fmt(a.cur,0)} → ${fmt(a.step,0)} kcal</b></span><button class="btn p sm" data-click="applyAdapt()">Alkalmazás</button></div>`:`<div class="small" style="margin-top:8px;color:var(--kj-green)">${L('A mostani kereted rendben van.','Your current target is on track.')}</div>`}
  ${S.profile.kcalOverride?`<button class="linkbtn" style="justify-content:flex-start;padding:8px 0 0" data-click="resetKcal()">${L('Vissza a képlet szerinti értékre','Back to the formula value')}</button>`:''}</div>`}
function applyAdapt(){const a=adaptive();if(!a||!a.ready)return;const old=S.profile.kcalOverride??null,k0=targets().kcal;S.profile.kcalOverride=Math.max(KCAL_MIN,a.step);logProf('kcalOverride',old,S.profile.kcalOverride,k0,'adapt');S.settings.adaptSeen=weekKey();save();render();toast(L(`Új keret: ${fmt(a.step,0)} kcal`,`New target: ${fmt(a.step,0)} kcal`))}
function resetKcal(){const old=S.profile.kcalOverride??null,k0=targets().kcal;S.profile.kcalOverride=null;logProf('kcalOverride',old,null,k0);save();render();toast(L('A képlet szerinti érték van érvényben','Formula value restored'))}
function dismissAdapt(){S.settings.adaptSeen=weekKey();save();render()}
const weekKey=()=>ymd(new Date(weekStart(Date.now())));
/* ===== Számítási módszerek – nyílt kártyákkal. Az értékek (szorzók, arányok, korlátok) közvetlenül a számoló kódból jönnek,
   így ez az oldal mindig azt írja le, amit az app ténylegesen csinál. ===== */
function vMethods(){const en=LANG==='en',X=(h,e)=>en?e:h,f=v=>String(v).replace('.',en?'.':',');
  const sec=(t,body)=>`<div class="card meth"><h2>${t}</h2>${body}</div>`,fx=t=>`<pre class="fx">${t}</pre>`;
  const goals=GOALS.map(([g,l])=>`<tr><td>${esc(T(l))}</td><td>${ADJ[g].map(v=>(v>0?'+':'')+v).join(' / ')}</td><td>${f(PPK[g].toFixed(1))}</td><td>${Math.round(FATPCT[g]*100)}%</td></tr>`).join('');
  return`<div class="hint" style="margin:0 4px 12px">${X('Az Olupan minden számítása nyílt: alább a képletek, a szorzók és a korlátok, pontosan azokkal az értékekkel, amelyekkel az app számol. Ezek becslések, nem orvosi vagy dietetikai mérések.','Every calculation in Olupan is open: below are the formulas, factors and limits, with exactly the values the app uses. These are estimates, not medical or dietetic measurements.')}</div>`
  +sec(X('Energiaigény','Energy needs'),`<p>${X('Alapanyagcsere (BMR): Mifflin–St Jeor-egyenlet.','Basal metabolic rate (BMR): Mifflin–St Jeor equation.')}</p>
  ${fx(X('Férfi: BMR = 10 × súly (kg) + 6,25 × magasság (cm) − 5 × életkor + 5\nNő:    BMR = 10 × súly (kg) + 6,25 × magasság (cm) − 5 × életkor − 161\n\nNapi energiaigény (TDEE) = BMR × aktivitási szorzó','Male:   BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5\nFemale: BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age − 161\n\nDaily energy needs (TDEE) = BMR × activity factor'))}
  <table class="tbl"><tr><th>${X('Aktivitás','Activity')}</th><th>${X('Szorzó','Factor')}</th></tr>${ACT_LV.map(([v,l])=>`<tr><td>${esc(T(l))}</td><td class="mono">${f(v)}</td></tr>`).join('')}</table>
  <p>${X('A súly a legutóbbi mérés. A javaslat csak felnőttekre (18+) vonatkozik.','Weight is the latest measurement. The suggestion applies to adults (18+) only.')}</p>`)
  +sec(X('Napi keret és makrók','Daily target and macros'),`${fx(X('Javasolt napi érték = TDEE + célkorrekció, 50 kcal-ra kerekítve\nMinimum: nő 1200 kcal, férfi 1500 kcal\nSaját érték: legalább '+KCAL_MIN+' kcal; ha 500 kcal-lal a javasolt alatt van, megerősítést kér','Suggested daily value = TDEE + goal adjustment, rounded to 50 kcal\nMinimum: female 1200 kcal, male 1500 kcal\nCustom value: at least '+KCAL_MIN+' kcal; asks for confirmation if 500 kcal below the suggestion'))}
  <table class="tbl"><tr><th>${X('Cél','Goal')}</th><th>${X('Korrekció (kcal, enyhe/közepes/gyors)','Adjustment (kcal, mild/moderate/fast)')}</th><th>${X('Fehérje g/ttkg','Protein g/kg')}</th><th>${X('Zsír','Fat')}</th></tr>${goals}</table>
  ${fx(X('Fehérje = referencia-testsúly × g/ttkg\n  referencia-testsúly = min(súly, 27,5 × magasság(m)²)\nZsír = keret × zsírarány ÷ 9, de legalább 0,6 g/ttkg\nSzénhidrát = (keret − fehérje × 4 − zsír × 9) ÷ 4\nRost = keret ÷ 1000 × 14 g, de legalább 25 g\nEnergiatartalom: fehérje és szénhidrát 4, zsír 9 kcal/g','Protein = reference weight × g/kg\n  reference weight = min(weight, 27.5 × height(m)²)\nFat = target × fat share ÷ 9, but at least 0.6 g/kg\nCarbs = (target − protein × 4 − fat × 9) ÷ 4\nFiber = target ÷ 1000 × 14 g, but at least 25 g\nEnergy: protein and carbs 4, fat 9 kcal/g'))}
  <p>${X('A referencia-testsúly (BMI 27,5 felett) gyakorlati közelítés, hogy túlsúlynál ne a teljes testsúlyra számoljunk fehérjét. A napi bevitel a keret ±10%-án belül számít „rendben”-nek.','The reference weight (above BMI 27.5) is a practical approximation so protein isn’t calculated on total body weight when overweight. Daily intake within ±10% of the target counts as “on track”.')}</p>`)
  +sec(X('Adaptív keret','Adaptive target'),`${fx(X('Tényleges energiaigény = átlagos bevitel − súlytrend (kg/hét) × 7700 ÷ 7\n\nFeltétel: az elmúlt 28 napból ≥ 14 rögzített nap (≥ 800 kcal),\n          ≥ 8 mérés legalább 14 nap alatt\nÚj keret = tényleges energiaigény + célkorrekció\nLépésenként legfeljebb ±250 kcal; alsó korlát: a minimum és a képlet szerinti\nenergiaigény 70%-a közül a nagyobb\nHa a becslés a BMR alatt van (valószínűleg hiányos napló), nem javasol csökkentést','Actual energy needs = average intake − weight trend (kg/week) × 7700 ÷ 7\n\nRequires: in the last 28 days ≥ 14 logged days (≥ 800 kcal),\n          ≥ 8 weigh-ins over at least 14 days\nNew target = actual energy needs + goal adjustment\nAt most ±250 kcal per step; lower limit: the larger of the minimum and\n70% of the formula energy needs\nIf the estimate is below BMR (probably incomplete log), no decrease is suggested'))}
  <p>${X('A 7700 kcal/kg a testtömeg-változás szokásos közelítése; a valóságban a változás összetétele (zsír, víz, izom) miatt eltérhet, ezért lépésenként és hetente korrigálunk.','7700 kcal/kg is the usual approximation for body mass change; in reality it varies with what changes (fat, water, muscle), which is why adjustments are gradual and weekly.')}</p>`)
  +sec(X('Testsúly és testösszetétel','Body weight and composition'),`${fx(X('Trend (kg/hét) = a mérésekre illesztett lineáris regresszió meredeksége × 7\n  (legalább 3 mérés, legalább 6 nap alatt)\n7 napos átlag = az utolsó 7 nap méréseinek átlaga\nZsírtömeg = súly × testzsír% ÷ 100;  zsírmentes tömeg = súly − zsírtömeg','Trend (kg/week) = slope of a linear regression fitted to the measurements × 7\n  (at least 3 measurements over at least 6 days)\n7-day average = average of the last 7 days’ measurements\nFat mass = weight × body fat% ÷ 100;  lean mass = weight − fat mass'))}
  <p>${X('A testzsír pontossága a mérőeszköztől függ (otthoni mérlegnél akár több százalékpont); a trend megbízhatóbb, mint egy-egy mérés.','Body fat accuracy depends on the device (home scales can be several percentage points off); the trend is more reliable than single readings.')}</p>`)
  +sec(X('Edzés','Training'),`${fx(X('Becsült 1RM (Epley) = súly × (1 + ismétlés ÷ 30);  1 ismétlésnél a súly\nVolumen = Σ súly × ismétlés (a bemelegítő és a kardió sorozatok nélkül)\nRekord: max súly, becsült 1RM, ismétlés, sorozat-volumen','Estimated 1RM (Epley) = weight × (1 + reps ÷ 30);  for 1 rep, the weight\nVolume = Σ weight × reps (excluding warm-up and cardio sets)\nRecords: max weight, estimated 1RM, reps, set volume'))}
  ${fx(X('Javaslat (kettős progresszió) az előző alkalom munkasorozataiból:\n  ha minden sorozat megvolt a csúcssúllyal → +2,5 kg (kézisúlyzó +2 kg)\n  ha nem → ugyanaz a súly és ismétlés\n  saját testsúly és kettlebell → +1 ismétlés','Suggestion (double progression) from last time’s working sets:\n  if every set was done at the top weight → +2.5 kg (dumbbell +2 kg)\n  if not → same weight and reps\n  bodyweight and kettlebell → +1 rep'))}
  <p>${X('Az Epley-képlet 10 ismétlés felett egyre pontatlanabb; tájékoztató érték.','The Epley formula gets less accurate above 10 reps; it’s indicative.')}</p>
  ${fx(X('Sorozattípus: B = bemelegítő (nem számít a volumenbe, a rekordokba és a sorozatszámba)\n              D = drop, F = failure (munkasorozat, csak a jelölés más)\nMérés: súly × ismétlés · ismétlés (+ pluszsúly) · idő (mp) · kardió\n  az idő alapú gyakorlat nem számít a volumenbe; rekordja a leghosszabb idő\nBemelegítés-javaslat:\n  rúd: üres rúd × 10, ~40% × 5, ~60% × 3, ~80% × 2 (2,5 kg-ra kerekítve)\n  kézisúlyzó / gép / kettlebell: ~50% × 10, ~75% × 5','Set type: B = warm-up (not counted in volume, records or set counts)\n          D = drop, F = failure (working sets, only the label differs)\nMeasurement: weight × reps · reps (+ added weight) · time (s) · cardio\n  time-based exercises don’t count towards volume; their record is the longest time\nWarm-up suggestion:\n  barbell: empty bar × 10, ~40% × 5, ~60% × 3, ~80% × 2 (rounded to 2.5 kg)\n  dumbbell / machine / kettlebell: ~50% × 10, ~75% × 5'))}`)
  +sec(X('Izomcsoportok és relatív erő','Muscle groups and relative strength'),`${fx(X('Sorozatszám izomcsoportonként = Σ munkasorozat\n  elsődleges izom: 1 sorozat, másodlagos izom: 0,5 sorozat\n  (bemelegítő és kardió nélkül; a besorolatlan gyakorlat nem számít)\nIrányérték: heti 10–20 sorozat izomcsoportonként\nGyakoriság: hány edzésen kapott legalább 1 sorozatot (ajánlott: heti ≥ 2)\nIzomeloszlás: az utolsó 4 hét és az előző 4 hét heti átlagos sorozatszáma\n  javaslat, ha egy izomcsoport heti átlaga 5 sorozat alatt van','Sets per muscle group = Σ working sets\n  primary muscle: 1 set, secondary muscle: 0.5 set\n  (no warm-up or cardio; unassigned exercises don’t count)\nGuide: 10–20 sets per muscle group per week\nFrequency: number of workouts with at least 1 set (recommended: ≥ 2 a week)\nDistribution: average weekly sets, last 4 weeks vs previous 4 weeks\n  suggestion if a muscle group averages under 5 sets a week'))}
  ${fx(X('Relatív erő = becsült 1RM ÷ testsúly (a legközelebbi mérés, ±14 nap)\n  gyakorlatok: összetett (van másodlagos izom), rúd / kézisúlyzó / gép,\n  legalább 2 alkalom 90 nap alatt; a rudasok előnyben, legfeljebb 4\nVáltozás: az utolsó 4 hét legjobb 1RM-je vs. a 6–12 héttel ezelőtti\n  ±2,5% alatt nincs változás; testsúly-változás: ±1%','Relative strength = estimated 1RM ÷ body weight (nearest measurement, ±14 days)\n  exercises: compound (has a secondary muscle), barbell / dumbbell / machine,\n  at least 2 sessions in 90 days; barbell lifts first, up to 4\nChange: best 1RM of the last 4 weeks vs 6–12 weeks ago\n  under ±2.5% = no change; body-weight change: ±1%'))}
  <p>${X('A volumen-metaanalízisben a heti 10 vagy több sorozat izomcsoportonként adta a legnagyobb izomnövekedést; a 20-as felső határ gyakorlati irányérték. A gyakoriság-metaanalízis szerint a heti kétszeri terhelés jobb a heti egyszerinél. Egyénenként eltérhet, és a sorozatoknak közel kell lenniük az izomelégtelenséghez, hogy számítsanak.','In the volume meta-analysis, 10 or more weekly sets per muscle group gave the most growth; the upper limit of 20 is a practical guide. The frequency meta-analysis found training a muscle twice a week better than once. Individuals differ, and sets need to be reasonably close to failure to count.')}</p>`)
  +sec(X('Összesítő trend és összefüggések','Combined trend and correlations'),`${fx(X('Simítás: testsúly, étkezés, lépés 7 napos, testzsír 21 napos átlag\nÖsszevetés: z = (érték − átlag) ÷ szórás, ±2,5-re vágva\nÖsszefüggés: Pearson-féle korrelációs együttható (r), legalább 20 közös nap\n  |r| < 0,2 elhanyagolható · < 0,4 gyenge · < 0,6 közepes · ≥ 0,6 erős','Smoothing: weight, food, steps 7-day, body fat 21-day average\nComparison: z = (value − mean) ÷ standard deviation, clipped to ±2.5\nCorrelation: Pearson correlation coefficient (r), at least 20 shared days\n  |r| < 0.2 negligible · < 0.4 weak · < 0.6 moderate · ≥ 0.6 strong'))}
  <p>${X('Az együttmozgás nem bizonyít ok-okozati kapcsolatot.','Moving together doesn’t prove cause and effect.')}</p>`)
  +sec(X('Étkezés becslése Claude-dal','Food estimates with Claude'),`<p>${X('A fotó vagy leírás alapján becsült tápértékek akár 20–30%-kal is eltérhetnek a valóságtól. A receptfájlból számolt értékek egyenletesebbek, mert ugyanazokból a hozzávalókból, ugyanúgy számolnak; a csomagoláson szereplő tápérték megadásával pontosabbak lesznek.','Nutrition estimated from a photo or description can be 20–30% off. Values calculated from the recipe file are more consistent because they use the same ingredients the same way; giving the nutrition label values makes them more accurate.')}</p>`)
  +sec(X('Források','Sources'),`<ul class="refs">
  <li>Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. A new predictive equation for resting energy expenditure in healthy individuals. <i>Am J Clin Nutr</i> 1990;51(2):241–247. <a href="https://doi.org/10.1093/ajcn/51.2.241" target="_blank" rel="noopener">doi:10.1093/ajcn/51.2.241</a></li>
  <li>Jäger R, Kerksick CM, Campbell BI et al. International Society of Sports Nutrition Position Stand: protein and exercise. <i>J Int Soc Sports Nutr</i> 2017;14:20. <a href="https://doi.org/10.1186/s12970-017-0177-8" target="_blank" rel="noopener">doi:10.1186/s12970-017-0177-8</a></li>
  <li>EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on Dietary Reference Values for fats, including saturated fatty acids, polyunsaturated fatty acids, monounsaturated fatty acids, trans fatty acids, and cholesterol. <i>EFSA Journal</i> 2010;8(3):1461. <a href="https://doi.org/10.2903/j.efsa.2010.1461" target="_blank" rel="noopener">doi:10.2903/j.efsa.2010.1461</a></li>
  <li>Institute of Medicine. <i>Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids.</i> Washington, DC: The National Academies Press; 2005. <a href="https://doi.org/10.17226/10490" target="_blank" rel="noopener">doi:10.17226/10490</a></li>
  <li>Hall KD. What is the required energy deficit per unit weight loss? <i>Int J Obes</i> 2008;32(3):573–576. <a href="https://doi.org/10.1038/sj.ijo.0803720" target="_blank" rel="noopener">doi:10.1038/sj.ijo.0803720</a></li>
  <li>Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass: a systematic review and meta-analysis. <i>J Sports Sci</i> 2017;35(11):1073–1082. <a href="https://doi.org/10.1080/02640414.2016.1210197" target="_blank" rel="noopener">doi:10.1080/02640414.2016.1210197</a></li>
  <li>Schoenfeld BJ, Ogborn D, Krieger JW. Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis. <i>Sports Med</i> 2016;46(11):1689–1697. <a href="https://doi.org/10.1007/s40279-016-0543-8" target="_blank" rel="noopener">doi:10.1007/s40279-016-0543-8</a></li>
  <li>Epley B. Poundage Chart. In: <i>Boyd Epley Workout.</i> Lincoln, NE: Body Enterprises; 1985. p. 86.</li></ul>
  <p class="hint">${X('A források a módszerek eredetét jelölik; az app egyszerűsített, tájékoztató alkalmazásukat végzi, nem helyettesíti a szakember tanácsát.','The sources indicate where the methods come from; the app applies them in a simplified, informational way and doesn’t replace professional advice.')}</p>`);
}
/* ===== Telepítési ajánló: eszköz és böngésző szerinti lépések, amíg az app böngészőben fut ===== */
let installEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(tab==='home')render()});
window.addEventListener('appinstalled',()=>{installEvt=null;if(tab==='home')render()});
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
/* iPhone/iPad (az iPadOS asztali Safari-azonosítóval is) – az Egészség app csak itt érhető el */
const IS_IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function installHow(){const ua=navigator.userAgent,ios=IS_IOS,and=/Android/.test(ua);
  const share=I('share','sm'),B=t=>`<b>${t}</b>`;
  if(/FBAN|FBAV|Instagram|Messenger|Line\/|GSA\/|; wv\)/.test(ua))return L(`Ez egy alkalmazáson belüli böngésző. Nyisd meg az oldalt ${ios?'Safariban':'Chrome-ban'} (menü → ${B('Megnyitás böngészőben')}), és onnan telepítsd.`,`This is an in-app browser. Open the page in ${ios?'Safari':'Chrome'} (menu → ${B('Open in browser')}) and install it from there.`);
  if(ios)return /CriOS|FxiOS|EdgiOS/.test(ua)?L(`Koppints a címsorban a ${B('Megosztás')} ${share} ikonra, majd: ${B('Hozzáadás a Főképernyőhöz')}.`,`Tap ${B('Share')} ${share} in the address bar, then ${B('Add to Home Screen')}.`)
    :L(`Safariban: ${B('Megosztás')} ${share} → ${B('Főképernyőhöz adás')} → ${B('Hozzáadás')}.`,`In Safari: ${B('Share')} ${share} → ${B('Add to Home Screen')} → ${B('Add')}.`);
  if(installEvt)return L('Egy koppintással telepítheted:','Install it with one tap:');
  if(and)return /Firefox/.test(ua)?L(`Firefoxban: menü (⋮) → ${B('Telepítés')}.`,`In Firefox: menu (⋮) → ${B('Install')}.`):/SamsungBrowser/.test(ua)?L(`Samsung Internetben: menü → ${B('Oldal hozzáadása')} → ${B('Kezdőképernyő')}.`,`In Samsung Internet: menu → ${B('Add page to')} → ${B('Home screen')}.`)
    :L(`A böngésző menüjében (⋮): ${B('Alkalmazás telepítése')} vagy ${B('Hozzáadás a kezdőképernyőhöz')}.`,`In the browser menu (⋮): ${B('Install app')} or ${B('Add to Home screen')}.`);
  if(/Edg\//.test(ua)||/Chrome\//.test(ua))return L(`A címsor jobb oldalán a telepítés ikon, vagy menü → ${B('Telepítés')} / ${B('Alkalmazások')}.`,`The install icon at the right of the address bar, or menu → ${B('Install')} / ${B('Apps')}.`);
  if(/Firefox/.test(ua))return L('Asztali Firefoxban nincs telepítés; használd böngészőben, vagy telepítsd Chrome-ból, Edge-ből vagy Safariból.','Desktop Firefox can’t install web apps; use it in the browser, or install from Chrome, Edge or Safari.');
  if(/Safari/.test(ua))return L(`Safariban: ${B('Fájl')} → ${B('Hozzáadás a Dockhoz')}.`,`In Safari: ${B('File')} → ${B('Add to Dock')}.`);
  return L('A böngésző menüjében keresd a telepítés vagy a kezdőképernyőhöz adás lehetőséget.','Look for Install or Add to Home screen in the browser menu.')}
function installCard(){if(isStandalone())return'';const d=S.settings.installHide;if(d&&Date.now()-d<14*DAY)return'';
  return`<div class="card instcard"><div class="row" style="flex-wrap:nowrap;align-items:flex-start;gap:10px"><span class="instic">${I('smartphone','sm')}</span>
  <div style="flex:1;min-width:0"><b>Telepítsd az Olupant</b><div class="small mut" style="margin-top:2px">Ingyenes, nincs appon belüli vásárlás és fiók – az adatok az eszközödön maradnak, és offline is működik.</div>
  <div class="small" style="margin-top:8px;line-height:1.5">${installHow()}</div>
  <div class="row" style="margin-top:10px;gap:8px">${installEvt?`<button class="btn p sm" data-click="installApp()">${I('monitor-down','sm')} Telepítés</button>`:''}<button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="openSub('info')">Részletek ${I('chevron-right','sm')}</button></div></div>
  <button class="btn sm ico" data-click="hideInstall()" aria-label="Most nem">${I('x','sm')}</button></div></div>`}
async function installApp(){if(!installEvt)return;installEvt.prompt();try{await installEvt.userChoice}catch(e){}installEvt=null;render()}
function hideInstall(){S.settings.installHide=Date.now();save();render()}
function profileMissing(){const p=S.profile;return[[!p.sex,'nem'],[!p.birthYear,'születési év'],[!p.height,'magasság'],[!p.activity,'aktivitás'],[!S.body.some(b=>b.weight!=null),'testsúly']].filter(x=>x[0]).map(x=>x[1])}
function goProfile(){openSub('profile')}
function relDay(ts){const a=new Date(ts);a.setHours(0,0,0,0);const b=new Date();b.setHours(0,0,0,0);const n=Math.round((b-a)/DAY);
  if(LANG==='en'){const p=(k,u)=>k+' '+u+(k===1?'':'s')+' ago';return n<=0?'today':n===1?'yesterday':n<7?p(n,'day'):n<30?p(Math.floor(n/7),'week'):n<365?p(Math.floor(n/30),'month'):p(Math.floor(n/365),'year')}
  return n<=0?'ma':n===1?'tegnap':n<7?n+' napja':n<30?Math.floor(n/7)+' hete':n<365?Math.floor(n/30)+' hónapja':Math.floor(n/365)+' éve'}
function tplCard(t,last,uses){
  const nN=t.notes?.length||0,arc=last&&!t.archived?`<button class="btn sm ico" data-click="toggleArchive('${t.id}')" aria-label="Áthelyezés a sablonok közé" title="Áthelyezés a sablonok közé">${I('archive','sm')}</button>`:t.archived?`<button class="btn sm ico" data-click="toggleArchive('${t.id}')" aria-label="Vissza az Edzéseim közé" title="Vissza az Edzéseim közé">${I('archive-restore','sm')}</button>`:'';
  return `<div class="card"><div class="row" style="flex-wrap:nowrap"><h2 style="flex:1;margin:0;font-size:17px">${esc(t.name)}</h2>${arc}<button class="btn sm ico" data-click="editTemplate('${t.id}')" aria-label="Sablon szerkesztése">${I('pencil','sm')}</button></div>
  <div class="mut small" style="margin:8px 0 12px">${t.items.map(it=>`<span class="mono">${it.sets}×</span> ${esc(exName(it.exId))}`).join(' · ')||'Üres sablon'}</div>
  <div class="row" style="flex-wrap:nowrap"><span class="mut small" style="flex:1;min-width:0">${last&&tplKey(t)?TAGS[tplKey(t)][1].replace(' (otthon)','')+' · ':''}${last?`Utoljára: <b style="color:var(--kj-text)">${relDay(last)}</b> · ${fmtDate(last)} · ${uses}×`:'Még nem használt'}</span>${nN?`<button class="btn sm" data-click="openNotes('${t.id}')" aria-label="Jegyzetek">${I('notebook-pen','sm')} ${nN}</button>`:''}<button class="btn sm" data-click="startWorkout('${t.id}')">Indítás</button></div></div>`;
}
function vWorkout(){
  const lastOf={},uses={};for(const w of S.workouts)if(w.tplId){lastOf[w.tplId]=Math.max(lastOf[w.tplId]||0,w.start);uses[w.tplId]=(uses[w.tplId]||0)+1}
  const used=S.templates.filter(t=>lastOf[t.id]&&!t.archived).sort((a,b)=>lastOf[b.id]-lastOf[a.id]),arch=S.templates.filter(t=>t.archived).sort((a,b)=>(lastOf[b.id]||0)-(lastOf[a.id]||0)),fresh=S.templates.filter(t=>!lastOf[t.id]&&!t.archived).map((t,i)=>[t,i]).sort((a,b)=>tplRank(a[0])-tplRank(b[0])||a[1]-b[1]).map(x=>x[0]);
  const cu=!!S.settings.claudeUrl;
  let h=notices()+`<div class="card"><button class="btn p block" data-click="startWorkout()">${I('plus')} Üres edzés indítása</button><div class="hint" style="text-align:center;margin-top:8px">Befejezés után a dátummal és időponttal elmentődik az Edzéseim közé – onnan átnevezhető, módosítható, törölhető.</div></div>`;
  if(used.length){h+=`<h3 style="margin:8px 2px 10px">Edzéseim</h3>`;used.forEach(t=>h+=tplCard(t,lastOf[t.id],uses[t.id]))}
  const all=wSorted().reverse(),rec=all.slice(0,3);
  if(rec.length){h+=`<h3 style="margin:20px 2px 10px">Legutóbbi edzések</h3>`;rec.forEach(w=>h+=workoutCard(w));
    h+=`<button class="linkbtn" data-click="openHist()">${I('history','sm')} Edzéstörténet ${I('chevron-right','sm')}</button>`}
  h+=`<div class="row" style="margin:20px 2px 10px"><h3 style="margin:0">Sablonok</h3><span class="sp"></span><button class="btn sm gold" data-click="editTemplate()">${I('plus','sm')} Új sablon</button></div>
  <div class="card"><div class="row" style="flex-wrap:nowrap;margin-bottom:8px"><h2 style="flex:1;margin:0;font-size:17px">Edzésterv Claude-dal</h2></div><div class="grid2"><button class="btn" data-click="openPlanReq()" ${cu?'':'disabled'}>${I('external-link','sm')} Terv kérése</button><button class="btn" data-click="pastePlan()" ${cu?'':'disabled'}>${I('clipboard-paste','sm')} Beillesztés</button></div>${cu?'':`<div class="hint" style="margin-top:8px">Előbb add meg a Claude-projekt linkjét. A terv kérése ugyanabba a projektbe megy, mint az étkezésnapló.</div><button class="linkbtn" style="padding-bottom:0" data-click="openSub('food')">Claude-projekt beállítása ${I('chevron-right','sm')}</button>`}</div>`;
  const cats=tplCats();
  h+=cats.length?`<div class="card setcard">${cats.map(c=>`<button class="setrow" data-click="openTplCat('${c.id}')"><span>${esc(c.label)}</span><span class="sv">${c.list.length}</span>${I('chevron-right','sm')}</button>`).join('')}</div>`
    :`<div class="card mut small">${S.templates.length?'Minden sablon használatban van – fent, az Edzéseim között találod őket.':'Még nincs sablon.'}</div>`;
  return h;
}
/* Sablon-kategóriák: korábbi edzéseim, Claude-tervek, eszköz szerinti csoportok */
function tplCats(){const {lastOf}=lastUse(),cats=[];
  const arch=S.templates.filter(t=>t.archived).sort((a,b)=>(lastOf[b.id]||0)-(lastOf[a.id]||0));
  const fresh=S.templates.filter(t=>!lastOf[t.id]&&!t.archived).map((t,i)=>[t,i]).sort((a,b)=>tplRank(a[0])-tplRank(b[0])||a[1]-b[1]).map(x=>x[0]);
  if(arch.length)cats.push({id:'arch',label:'Korábbi edzéseim',list:arch});
  const plans=[...new Set(fresh.filter(t=>t.plan).map(t=>t.plan))].sort((a,b)=>a.localeCompare(b,'hu'));
  plans.forEach((p,i)=>cats.push({id:'p'+i,label:p,list:fresh.filter(t=>t.plan===p)}));
  for(const k of TAG_ORDER){const l=fresh.filter(t=>!t.plan&&tplKey(t)===k);if(l.length)cats.push({id:k,label:TAGS[k][1],list:l})}
  const o=fresh.filter(t=>!t.plan&&!tplKey(t));if(o.length)cats.push({id:'_',label:'Egyéb',list:o});
  return cats}
function openTplCat(id){tplCat=id;goFrom('tpls')}
function vTpls(){const {lastOf,uses}=lastUse(),c=tplCats().find(x=>x.id===tplCat);
  if(!c)return`<div class="card mut small">Ebben a csoportban már nincs sablon.</div>`;
  return c.list.map(t=>tplCard(t,lastOf[t.id]||0,uses[t.id]||0)).join('')}
/* Edzéstörténet: 12 edzés, 12-esével 60-ig bővíthető, a régebbiek a naptárban */
function openHist(){histN=12;goFrom('hist')}
function histMore(){histN=Math.min(60,histN+12);const y=scrollY;render();scrollTo(0,y)}
function vHist(){const all=wSorted().reverse(),n=Math.min(histN,60),list=all.slice(0,n);
  if(!all.length)return`<div class="card mut small">Még nincs befejezett edzés.</div>`;
  let h=list.map(w=>workoutCard(w)).join('');
  if(all.length>n&&n<60)h+=`<button class="linkbtn" data-click="histMore()">${L('További','More')} ${Math.min(12,Math.min(60,all.length)-n)} ${L('edzés','workouts')} ${I('chevron-down','sm')}</button>`;
  else if(all.length>n)h+=`<div class="hint" style="text-align:center;margin:4px 0 0">Régebbi edzések a Naptárban</div><button class="linkbtn" data-click="openCal()">${I('calendar-days','sm')} Naptár megnyitása</button>`;
  return h}
function workoutCard(w,actions=true){
  const mins=Math.max(1,Math.round((w.end-w.start)/60000)),nSets=w.exercises.reduce((a,e)=>a+e.sets.filter(x=>!x.wu).length,0);
  const wn=(S.templates.find(t=>t.id===w.tplId)?.notes||[]).filter(n=>n.wid===w.id);
  return `<div class="card" data-wid="${w.id}"><div class="row" style="flex-wrap:nowrap"><h2 style="flex:1;margin:0;font-size:17px">${esc(w.name)}</h2><span class="mut small mono">${fmtDate(w.start)} · ${fmtTime(w.start)}</span></div>
  <div class="sum"><span>${I('timer','sm')} ${mins} perc</span>·${wVolume(w)?`<span>${fmt(wVolume(w),0)} kg volumen</span>·`:''}${wCardioMin(w)?`<span>${fmt(wCardioMin(w),0)} perc kardió</span>·`:''}<span>${nSets} sorozat</span></div>
  ${w.exercises.map(e=>`<div class="exl"><span>${esc(exName(e.exId))}</span><span>${e.sets.map(x=>(x.wu?'<span class="wutag">B</span>':x.st?`<span class="wutag ${x.st}">${SET_TAG[x.st]}</span>`:'')+setStr(x,isCardio(e.exId),exKind(e.exId))).join(', ')}</span></div>`).join('')}
  ${wn.map(n=>`<div class="note">${I('notebook-pen','sm')}<span>${esc(n.text)}</span></div>`).join('')}
  ${w.prs?.length?`<div>${w.prs.map(p=>`<span class="badge">${I('trophy','sm')} ${esc(exName(p.exId))} – ${prLbl(p)[0]}: ${fmt(p.val)}${prLbl(p)[1]}</span>`).join('')}</div>`:''}
  ${actions?`<div class="row" style="margin-top:12px"><button class="btn sm" data-click="repeatWorkout('${w.id}')">${I('rotate-ccw','sm')} Ismétlés</button><button class="btn sm" data-click="saveAsTemplate('${w.id}')">${I('save','sm')} Sablonként</button><span class="sp"></span><button class="btn sm d ico" data-click="delWorkout('${w.id}')" aria-label="Edzés törlése">${I('trash-2','sm')}</button></div>`:''}</div>`;
}

/* ===== Jegyzetek – a sablonhoz tartoznak, dátummal és (ha edzés közben készült) az edzés azonosítójával ===== */
const tplNotes=id=>[...(S.templates.find(t=>t.id===id)?.notes||[])].sort((a,b)=>b.ts-a.ts);
const noteField=()=>[{id:'text',label:'Jegyzet',type:'textarea',rows:5,placeholder:L('pl. A 3. sorozatnál fájt a váll – legközelebb kisebb súllyal.','e.g. Shoulder hurt on set 3 – go lighter next time.')}];
async function addActiveNote(){const r=await form('Új jegyzet',noteField(),{intro:L('A jegyzet ennek az edzésnek a sablonjához kerül.','The note is saved to this workout’s template.')});if(!r||!r.text)return;
  const a=S.active;(a.notes=a.notes||[]).push({id:uid(),ts:Date.now(),text:r.text.slice(0,2000)});save();render()}
function rmActiveNote(id){const a=S.active;a.notes=(a.notes||[]).filter(n=>n.id!==id);save();render()}
function openNotes(tid){const t=S.templates.find(x=>x.id===tid);if(!t)return;const ns=tplNotes(tid);
  openModal(`<h2>${esc(T(t.name))} – ${L('jegyzetek','notes')}</h2>
  ${ns.map(n=>{const w=n.wid&&S.workouts.find(x=>x.id===n.wid);return`<div class="note"><span><span class="mut small">${fmtDate(n.ts)} · ${fmtTime(n.ts)}</span><br>${esc(n.text)}${w?`<br><button class="linkbtn" style="margin:4px 0 0;padding:0;display:inline-flex;width:auto;justify-content:flex-start;text-align:left" data-click="showWorkout('${w.id}')">${esc(T(w.name))} ${I('chevron-right','sm')}</button>`:''}</span><button class="btn sm ico d" data-click="delNote('${tid}','${n.id}')" aria-label="Jegyzet törlése">${I('trash-2','sm')}</button></div>`}).join('')||'<div class="mut small">Még nincs jegyzet.</div>'}
  <div class="row" style="margin-top:14px"><button class="btn" data-click="addTplNote('${tid}')">${I('notebook-pen','sm')} Új jegyzet</button><span class="sp"></span><button class="btn p" data-click="closeModal()">Bezárás</button></div>`)}
async function addTplNote(tid){const t=S.templates.find(x=>x.id===tid);if(!t)return;const r=await form('Új jegyzet',noteField());if(!r||!r.text)return;(t.notes=t.notes||[]).push({id:uid(),ts:Date.now(),text:r.text.slice(0,2000),wid:null});save();openNotes(tid);render()}
async function delNote(tid,id){const t=S.templates.find(x=>x.id===tid);if(!t)return;if(!await ask('Törlöd a jegyzetet?',{title:'Jegyzet törlése',ok:'Törlés',danger:true}))return;t.notes=(t.notes||[]).filter(n=>n.id!==id);save();openNotes(tid);render()}
function showWorkout(wid){const w=S.workouts.find(x=>x.id===wid);if(!w)return;closeModal();homeDay=ymd(new Date(w.start));go('home');
  setTimeout(()=>{const el=document.querySelector(`.card[data-wid="${wid}"]`);if(el){el.scrollIntoView({block:'center'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1600)}},60)}
function toggleArchive(id){const t=S.templates.find(x=>x.id===id);if(!t)return;if(t.archived){delete t.archived;toast('Visszakerült az Edzéseim közé')}else{t.archived=true;toast('Áthelyezve a sablonok közé')}save();render()}

/* ===== Aktív edzés ===== */
async function startWorkout(t){
  if(typeof t==='string')t=S.templates.find(x=>x.id===t);
  if(S.active&&!await ask('Már fut egy edzés. Elveted, és újat indítasz? A rögzített sorozatai elvesznek.',{title:'Futó edzés',ok:'Elvetés és új',danger:true}))return;
  const now=new Date(),autoName=`${L('Edzés','Workout')} – ${now.getFullYear()}.${z2(now.getMonth()+1)}.${z2(now.getDate())}. ${z2(now.getHours())}:${z2(now.getMinutes())}`;
  S.active={id:uid(),name:(t?T(t.name):'')||autoName,start:Date.now(),tplId:t?.id||null,
    exercises:(t?.items||[]).filter(it=>exById(it.exId)).map(it=>{const x={exId:it.exId,sets:Array.from({length:it.sets||3},()=>({w:'',r:'',done:false}))};if(it.ss)x.ss=true;if(it.reps)x.reps=it.reps;return x})};
  rest=null;save();go('workout');
}
function vActive(){
  const a=S.active;
  let h=`<div class="card"><input value="${esc(T(a.name))}" data-input="setWName(this.value)" style="font:600 17px var(--display)" aria-label="Edzés neve">
  <div class="row" style="margin-top:10px"><span class="mut">${I('timer','sm')} <b id="elapsed" class="mono" style="color:var(--kj-text)">0:00</b></span><span class="mut small" id="wakeInd" hidden title="A képernyő nem kapcsol ki edzés közben">${I('smartphone','sm')} ébren</span><span class="sp"></span><span class="mut small mono" id="avol"></span></div></div>`;
  {const tn=tplNotes(a.tplId),own=a.notes||[];
   h+=`<div class="card"><div class="row" style="flex-wrap:nowrap"><h2 style="flex:1;margin:0;font-size:17px">Jegyzetek</h2>${tn.length>2?`<button class="btn sm" data-click="openNotes('${a.tplId}')">${L('Mind','All')} (${tn.length})</button>`:''}<button class="btn sm" data-click="addActiveNote()">${I('notebook-pen','sm')} Új</button></div>
   ${own.map(n=>`<div class="note"><span><span class="mut small">${L('Ez az edzés','This workout')} · ${fmtTime(n.ts)}</span><br>${esc(n.text)}</span><button class="btn sm ico d" data-click="rmActiveNote('${n.id}')" aria-label="Jegyzet törlése">${I('x','sm')}</button></div>`).join('')}
   ${tn.slice(0,2).map(n=>`<div class="note"><span><span class="mut small">${fmtDate(n.ts)} · ${relDay(n.ts)}</span><br>${esc(n.text)}</span></div>`).join('')}
   ${!own.length&&!tn.length?`<div class="hint" style="margin-top:6px">A jegyzet az edzés sablonjához kerül, így a következő alkalommal itt olvashatod.</div>`:''}</div>`}
  const ssL={};{let g=0;a.exercises.forEach((e,i)=>{const inG=e.ss||(i>0&&a.exercises[i-1].ss);if(inG){if(!(i>0&&a.exercises[i-1].ss))g++;ssL[i]=String.fromCharCode(64+g)}})}
  a.exercises.forEach((e,i)=>{
    const prev=prevSets(e.exId),pb=bestsBefore(e.exId,Infinity),ex=exById(e.exId),custom=ex?.rest!=null,cd=ex?.kind==='cardio',kd=exKind(e.exId);
    h+=`<div class="card${ssL[i]?' ssc'+(e.ss?' sslink':''):''}"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div style="flex:1;min-width:0">${ssL[i]?`<span class="sstag">${I('link','sm')} ${L('Szuperszett','Superset')} ${ssL[i]}</span>`:''}<div class="ex-title">${esc(exName(e.exId))}</div>${e.reps?`<div class="small mut">${L('Cél','Target')}: ${esc(e.reps)} ${L('ismétlés','reps')}</div>`:''}
    <button class="restbtn ${custom?'custom':''}" data-click="setExRest('${e.exId}')" title="Pihenőidő ennél a gyakorlatnál">${I('timer','sm')} ${fmtSec(exRest(e.exId))}${custom?'':' · alap'}</button></div>
    <button class="btn sm ico" data-click="moveEx(${i},-1)" aria-label="Fel">${I('arrow-up','sm')}</button><button class="btn sm ico" data-click="moveEx(${i},1)" aria-label="Le">${I('arrow-down','sm')}</button><button class="btn sm ico d" data-click="rmEx(${i})" aria-label="Eltávolítás">${I('x','sm')}</button></div>
    ${(()=>{const sg=suggestFor(e.exId);return sg?`<div class="sugg">${I('trending-up','sm')}<span><span>Javaslat:</span> <b class="mono">${sg.txt}</b><br><span class="mut small">${sg.why}</span></span><button class="btn sm" data-click="applySugg(${i})">Kitöltés</button></div>`:''})()}
    <table class="sets"><tr><th>#</th><th>Előző</th><th>${cd?'km':kd==='strength'?'kg':'+kg'}</th><th>${cd?'Perc':kd==='time'?'Mp':'Ism.'}</th><th></th></tr>
    ${(()=>{let k=0,wi=0,ni=0;const pW=prev.filter(x=>x.wu),pN=prev.filter(x=>!x.wu);return e.sets.map((s,j)=>{const pj=s.wu?pW[wi++]:pN[ni++],p=pj||(s.wu?null:pN[pN.length-1]),no=s.wu?'B':(++k,SET_TAG[s.st]||k);return `<tr class="${s.done?'done':''}${s.wu?' wu':s.st==='d'?' dr':s.st==='f'?' fl':''}" id="r${i}_${j}"><td><button class="setno" data-click="toggleWu(${i},${j})" aria-label="${s.wu?L('Bemelegítő sorozat – koppints: drop','Warm-up set – tap: drop set'):s.st==='d'?L('Drop sorozat – koppints: failure','Drop set – tap: failure'):s.st==='f'?L('Failure sorozat – koppints: normál','Failure set – tap: normal'):L('Koppints: bemelegítő sorozat','Tap: warm-up set')}">${no}</button></td><td class="mut pvc"><span class="pv">${pj?setStr(pj,cd,kd):'–'}</span><button class="rmx" data-click="rmSetAt(${i},${j})" aria-label="${L('Sorozat törlése','Delete set')}">${I('x','sm')}</button></td>
      <td><input type="text" inputmode="decimal" autocomplete="off" value="${hu(s.w,2)}" placeholder="${p?hu(p.w,2):''}" data-input="setVal(${i},${j},'w',this.value)" aria-label="${cd?'Táv (km)':kd==='strength'?'Súly':'Pluszsúly'}"></td>
      <td><input type="number" inputmode="numeric" step="1" min="0" value="${s.r}" placeholder="${p?p.r:''}" data-input="setVal(${i},${j},'r',this.value)" aria-label="${cd?'Idő (perc)':kd==='time'?'Idő (mp)':'Ismétlés'}"></td>
      <td>${swRow===`${i}_${j}`?`<button class="chk rmsw" data-click="rmSetAt(${i},${j})" aria-label="${L('Sorozat törlése','Delete set')}">${I('trash-2','sm')}</button>`:`<button class="chk" data-click="toggleSet(${i},${j})" aria-label="Sorozat kész">${I('check','sm')}</button>`}</td></tr>`}).join('')})()}
    </table><div class="row" style="margin-top:8px"><button class="btn sm" data-click="addSet(${i})">${I('plus','sm')} Sorozat</button><button class="btn sm" data-click="rmSet(${i})">${I('minus','sm')} Sorozat</button>${isBarbell(e.exId)?`<button class="btn sm" data-click="plateCalc(${i})">${I('disc','sm')} Tárcsák</button>`:kd==='strength'&&!cd&&['db','mach','kb'].includes(exEquip(e.exId))?`<button class="btn sm" data-click="warmCalc(${i})">${I('flame','sm')} Bemelegítés</button>`:''}${i<a.exercises.length-1?`<button class="btn sm${e.ss?' sson':''}" data-click="toggleSS(${i})" aria-pressed="${!!e.ss}" aria-label="Szuperszett a következő gyakorlattal">${I('link','sm')}</button>`:''}<span class="sp"></span>
    <span class="mut small">${pb&&cd?`${I('trophy','sm')} <span class="mono">${pb.w?fmt(pb.w,1)+' km · ':''}${pb.r} perc</span>`:pb&&kd==='time'?`${I('trophy','sm')} <span class="mono">${pb.r} mp</span>`:pb&&kd==='reps'?`${I('trophy','sm')} <span class="mono">${pb.r} ism.${pb.w?' · +'+fmt(pb.w)+' kg':''}</span>`:pb?(pb.w?`${I('trophy','sm')} <span class="mono">${fmt(pb.w)} kg · 1RM ~${fmt(pb.e,0)}</span>`:`${I('trophy','sm')} <span class="mono">${pb.r} ism.</span>`):'Első alkalom'}</span></div></div>`;
  });
  h+=`<button class="btn block gold" data-click="pickForActive()">${I('plus')} Gyakorlat hozzáadása</button>
  <div class="row" style="margin-top:14px"><button class="btn d" data-click="discardWorkout()">${I('trash-2','sm')} Elvetés</button><span class="sp"></span><button class="btn g" data-click="finishWorkout()">${I('check')} Edzés befejezése</button></div>`;
  return h;
}
function setVal(i,j,k,v){v=String(v).replace(',','.').trim();const n=parseFloat(v);S.active.exercises[i].sets[j][k]=v===''||!isFinite(n)?'':n;save();updAvol()}
function toggleSet(i,j){
  const e=S.active.exercises[i],s=e.sets[j];
  if(!s.done){
    const prev=prevSets(e.exId),p=prev[j]||prev[prev.length-1];
    if(s.w===''&&p)s.w=p.w; if(s.r===''&&p)s.r=p.r;
    if(s.r===''||!(+s.r>0)){toast(isCardio(e.exId)?'Add meg az időt (perc)':'Add meg az ismétlésszámot');return}
    if(s.w==='')s.w=0;
    s.done=true;const nx=S.active.exercises[i+1];if(e.ss&&nx)toast(L('Szuperszett – következő: ','Superset – next: ')+exName(nx.exId));else startRest(e.exId);sfx('done');haptic();
  }else{s.done=false;sfx('tap')}
  save();
  const row=$('#r'+i+'_'+j);row.classList.toggle('done',s.done);const ins=row.querySelectorAll('input');ins[0].value=s.w;ins[1].value=s.r;updAvol();
}
function addSet(i){const sets=S.active.exercises[i].sets;const l=sets[sets.length-1];sets.push({w:l?l.w:'',r:l?l.r:'',done:false});save();render()}
/* Egy adott sorozat törlése (balra húzás / asztalon ×), visszavonással */
let lastRm=null,swRow=null;
function rmSetAt(i,j){const ex=S.active?.exercises[i];if(!ex||!ex.sets[j])return;lastRm={i,j,s:ex.sets[j],wid:S.active.id};ex.sets.splice(j,1);swRow=null;save();render();toastAct(L('Sorozat törölve','Set deleted'),`<button type="button" class="tact" data-click="undoRm()">${L('Visszavonás','Undo')}</button>`)}
function undoRm(){const u=lastRm;if(!u||!S.active||S.active.id!==u.wid)return;const ex=S.active.exercises[u.i];if(!ex)return;ex.sets.splice(Math.min(u.j,ex.sets.length),0,u.s);lastRm=null;save();render();$('#toast').classList.remove('on','act')}
function rmSet(i){const sets=S.active.exercises[i].sets;if(sets.length)sets.pop();save();render()}
function moveEx(i,d){const a=S.active.exercises,j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];save();render()}
async function rmEx(i){if(!await ask(`Eltávolítod a(z) <b>${esc(exName(S.active.exercises[i].exId))}</b> gyakorlatot az edzésből?`,{ok:'Eltávolítás',danger:true}))return;S.active.exercises.splice(i,1);save();render()}
function addExToActive(id){S.active.exercises.push({exId:id,sets:Array.from({length:3},()=>({w:'',r:'',done:false}))});save();render();setTimeout(()=>scrollTo(0,document.body.scrollHeight),30)}
function updAvol(){const el=$('#avol');if(!el||!S.active)return;let v=0,n=0;for(const e of S.active.exercises){const tk=exKind(e.exId)==='time'||isCardio(e.exId);for(const s of e.sets)if(s.done&&!s.wu){if(!tk)v+=(+s.w||0)*(+s.r||0);n++}}el.textContent=`${n} sorozat · ${fmt(v,0)} kg`}
async function discardWorkout(){if(!await ask('Biztosan elveted az edzést? A rögzített sorozatok elvesznek.',{title:'Edzés elvetése',ok:'Elvetés',danger:true}))return;
  {const a=S.active,tt=a.tplId&&S.templates.find(x=>x.id===a.tplId);if(tt&&a.notes?.length)tt.notes=(tt.notes||[]).concat(a.notes.map(n=>({id:n.id,ts:n.ts,text:n.text,wid:null})))} // a jegyzetek elvetéskor is megmaradnak a sablonnál
  S.active=null;rest=null;save();go('home')}
async function finishWorkout(){
  const a=S.active;
  const exs=a.exercises.map(e=>({exId:e.exId,...(e.ss?{ss:true}:{}),sets:e.sets.filter(s=>s.done).map(s=>{const x={w:+s.w||0,r:+s.r||0};if(s.wu)x.wu=true;else if(s.st)x.st=s.st;return x})})).filter(e=>e.sets.length);
  if(!exs.length){if(await ask('Nincs teljesített (pipált) sorozat. Elveted az edzést?',{title:'Üres edzés',ok:'Elvetés',danger:true})){S.active=null;rest=null;save();go('home')}return}
  const open=a.exercises.reduce((n,e)=>n+e.sets.filter(s=>!s.done).length,0);
  if(open&&!await ask(`${open} nem pipált sorozat van – ezek nem kerülnek mentésre. Befejezed az edzést?`,{title:'Befejezés',ok:'Befejezés'}))return;
  const cMin=exs.reduce((t,e)=>isCardio(e.exId)?t+e.sets.reduce((u,x)=>u+x.r,0):t,0); // utólag rögzített kardiónál az időtartam legalább a kardió ideje
  const w={id:a.id,name:(a.name||'').trim()||'Edzés',start:a.start,end:Math.max(Date.now(),a.start+cMin*60000),tplId:a.tplId,exercises:exs};
  w.prs=detectPRs(w);
  let created=false;
  if(!w.tplId||!S.templates.some(x=>x.id===w.tplId)){ // üres (vagy törölt sablonból indított) edzés: mentés az Edzéseim közé
    const nt={id:uid(),name:w.name,items:w.exercises.map(e=>({exId:e.exId,sets:e.sets.length,...(e.ss?{ss:true}:{})}))};S.templates.push(nt);w.tplId=nt.id;created=true}
  {const tt=S.templates.find(x=>x.id===w.tplId);if(tt){if(a.notes?.length)tt.notes=(tt.notes||[]).concat(a.notes.map(n=>({id:n.id,ts:n.ts,text:n.text,wid:w.id})));delete tt.archived}}
  S.workouts.push(w);S.active=null;rest=null;save();tab='home';homeDay=today();render();scrollTo(0,0);
  const t=!created&&S.templates.find(x=>x.id===w.tplId);
  openModal(`<h2>Edzés kész</h2>${workoutCard(w,false)}
  <div class="row">${t?`<button class="btn" data-click="updateTplFrom('${w.id}')">${I('save','sm')} Sablon frissítése</button>`:`<span class="small mut">${I('save','sm')} Elmentve az Edzéseim közé</span>`}<span class="sp"></span><button class="btn p" data-click="closeModal()">Rendben</button></div>`);
}
function updateTplFrom(wid){const w=S.workouts.find(x=>x.id===wid),t=S.templates.find(x=>x.id===w.tplId);if(!t)return;t.items=w.exercises.map(e=>({exId:e.exId,sets:e.sets.length,...(e.ss?{ss:true}:{}),...(t.items.find(i=>i.exId===e.exId)?.reps?{reps:t.items.find(i=>i.exId===e.exId).reps}:{})}));save();closeModal();toast('Sablon frissítve');render()}
function repeatWorkout(wid){const w=S.workouts.find(x=>x.id===wid);startWorkout({id:w.tplId&&S.templates.some(t=>t.id===w.tplId)?w.tplId:null,name:w.name,items:w.exercises.map(e=>({exId:e.exId,sets:e.sets.length,...(e.ss?{ss:true}:{})}))})}
async function saveAsTemplate(wid){const w=S.workouts.find(x=>x.id===wid);const r=await form('Mentés sablonként',[{id:'name',label:'Sablon neve',value:w.name}]);if(!r||!r.name)return;
  S.templates.push({id:uid(),name:r.name,items:w.exercises.map(e=>({exId:e.exId,sets:e.sets.length,...(e.ss?{ss:true}:{})}))});save();toast('Sablon mentve');render()}
async function delWorkout(wid){const w=S.workouts.find(x=>x.id===wid);if(!await ask(`Törlöd a(z) <b>${esc(w.name)}</b> edzést (${fmtDate(w.start)})?`,{title:'Edzés törlése',ok:'Törlés',danger:true}))return;S.workouts=S.workouts.filter(x=>x.id!==wid);save();render()}

/* ===== Pihenőidő ===== */
function startRest(exId){const t=exRest(exId);if(!t)return;rest={end:Date.now()+t*1000,total:t,ex:exName(exId)};tick()}
function adjRest(d){if(!rest)return;rest.end+=d*1000;rest.total=Math.max(rest.total+d,1);tick()}
async function setExRest(exId){
  const ex=exById(exId);if(!ex)return;
  const r=await form('Pihenőidő',[{id:'rest',label:'Pihenő sorozatok között (mp)',type:'number',min:0,step:5,value:ex.rest??'',placeholder:`alapértelmezett: ${S.settings.rest} mp`,hint:'Üresen hagyva a Beállításokban megadott alapértelmezést használja. 0 = nincs pihenőszámláló.'}],{intro:esc(ex.name)});
  if(!r)return;if(r.rest==='')delete ex.rest;else ex.rest=Math.max(0,Math.min(1800,parseInt(r.rest)||0));save();render();
}
/* Hang: iOS-en az AudioContext csak felhasználói érintésre indulhat el, ezért egyetlen
   kontextust használunk, amit minden érintéskor feloldunk (resume + néma puffer). */
let AC=null;
/* iOS (Safari 17+): „ambient” hangmunkamenet – az Olupan hangjai keverednek a háttérben szóló zenével (Spotify stb.),
   nem állítják le. A némító kapcsoló ilyenkor az app hangjait is némítja. */
try{if(navigator.audioSession)navigator.audioSession.type='ambient'}catch(e){}
function audioCtx(){if(!AC){const K=window.AudioContext||window.webkitAudioContext;if(!K)return null;try{AC=new K()}catch(e){return null}}return AC}
/* Csak érintésre (felhasználói gesztusban) fut: ha iOS-en a hang „megszakított” állapotban ragadt, új hangkörnyezetet nyit.
   A háttérbe tételt és a visszatérést szándékosan nem befolyásolja. */
/* iOS: háttérbe tétel után a hangkörnyezet „running”-nak mutathatja magát, mégis néma marad (és ilyenkor a következő
   háttérbe tételnél az időzítő sem fut). Ezért visszatérés után az első érintés mindig friss hangkörnyezetet nyit. */
let acStale=false;
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&AC)acStale=true});
function unlockAudio(){let ac=audioCtx();if(!ac)return;
  if(acStale||ac.state==='interrupted'||ac.state==='closed'){acStale=false;try{ac.close()}catch(e){}AC=null;ac=audioCtx();if(!ac)return}
  if(ac.state==='running')return;
  ac.resume().catch(()=>{try{AC.close()}catch(e){}AC=null});try{const b=ac.createBuffer(1,1,22050),src=ac.createBufferSource();src.buffer=b;src.connect(ac.destination);src.start(0)}catch(e){}}
['pointerdown','touchend','keydown'].forEach(t=>document.addEventListener(t,unlockAudio,{passive:true,capture:true}));
const VOL=[0,.35,.7,1];
function chime(level){
  const v=VOL[level??S.settings.sound??3];if(!v)return;const ac=audioCtx();if(!ac)return;if(ac.state!=='running')ac.resume().catch(()=>{});
  const t0=ac.currentTime+.03,master=ac.createGain(),comp=ac.createDynamicsCompressor();master.gain.value=v;master.connect(comp);comp.connect(ac.destination);
  [[880,0],[1174.66,.17],[1760,.34]].forEach(([f,dt])=>{for(const[type,amp]of[['sine',.9],['triangle',.15]]){
    const o=ac.createOscillator(),g=ac.createGain(),t=t0+dt;o.type=type;o.frequency.value=f;o.connect(g);g.connect(master);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);o.start(t);o.stop(t+1.15)}});
}
/* Visszajelző hangok (koppintás, gépelés, kész sorozat) és rezgés – a pihenő-hangjelzéstől függetlenül kapcsolhatók. */
function sfx(kind){
  const st=S.settings,on={tap:st.uiSound,type:st.typeSound,done:st.doneSound}[kind];if(on===false)return;
  const ac=audioCtx();if(!ac)return;if(ac.state!=='running')ac.resume().catch(()=>{});
  const t0=ac.currentTime+.005,out=ac.createGain();out.connect(ac.destination);
  const tone=(f,dt,len,amp,type='sine')=>{const o=ac.createOscillator(),g=ac.createGain(),t=t0+dt;o.type=type;o.frequency.value=f;o.connect(g);g.connect(out);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.start(t);o.stop(t+len+.02)};
  if(kind==='tap'){tone(1250,0,.045,.16);tone(2500,0,.02,.04,'triangle')}
  else if(kind==='type'){tone(1900*(.94+Math.random()*.12),0,.028,.07,'triangle')}
  else{tone(784,0,.32,.28);tone(1174.66,.085,.42,.26);tone(1568,.17,.5,.16);tone(2349,.17,.25,.04,'triangle')}
}
/* Rezgés: Androidon a Vibration API; iPhone-on (iOS 18+) egy rejtett „switch” jelölőnégyzet
   átbillentése ad rövid haptikus visszajelzést – csak érintésre indított műveletben működik. */
let HB=null;
function haptic(){
  if(S.settings.haptic===false)return;
  if(navigator.vibrate){try{navigator.vibrate(35)}catch(e){}return}
  if(!HB){HB=document.createElement('label');HB.setAttribute('aria-hidden','true');HB.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0';
    const i=document.createElement('input');i.type='checkbox';i.setAttribute('switch','');i.tabIndex=-1;HB.appendChild(i);document.body.appendChild(HB)}
  try{HB.click()}catch(e){}
}
document.addEventListener('click',e=>{
  const el=e.target.closest&&e.target.closest('button,.chip,a.btn,[data-click]');if(!el||el===HB||el.disabled)return;
  if((el.getAttribute('data-click')||'').startsWith('toggleSet('))return; // a pipálás saját hangot ad
  sfx('tap');
},true);
document.addEventListener('input',e=>{const t=e.target;if(t&&(t.tagName==='TEXTAREA'||t.tagName==='INPUT'&&/^(text|number|search|url|email|tel|password)$/.test(t.type)))sfx('type')},true);
/* Értesítés a pihenő végén, ha az app háttérben van (Android / asztali böngésző; iPhone-on a háttérbe
   tett webapp futását a rendszer felfüggeszti, ott visszatéréskor szól). */
let notifT=null;
const notifSupported=()=>'Notification' in window&&'serviceWorker' in navigator;
async function restNotif(){
  if(!S.settings.restNotify||!notifSupported()||Notification.permission!=='granted'||document.visibilityState==='visible')return;
  try{const reg=await navigator.serviceWorker.getRegistration();const body=(rest?.ex||lastRestEx)?'Következő sorozat: '+(rest?.ex||lastRestEx):'Következő sorozat';
    const o={body,tag:'olupan-rest',renotify:true,vibrate:[200,100,200],icon:'assets/icon-192.png',badge:'assets/icon-192.png'};
    o.body=T(o.body);if(reg)await reg.showNotification(T('Pihenő vége'),o);else new Notification(T('Pihenő vége'),o)}catch(e){}
}
let lastRestEx='';
document.addEventListener('visibilitychange',()=>{
  clearTimeout(notifT);notifT=null;
  if(document.visibilityState==='hidden'){if(rest&&S.settings.restNotify)notifT=setTimeout(tick,Math.max(0,rest.end-Date.now())+50)}
  else tick();
});
async function setRestNotify(v){
  if(v){if(!notifSupported()){toast('Ez a böngésző nem támogatja az értesítéseket');return}
    let p=Notification.permission;if(p==='default')p=await Notification.requestPermission().catch(()=>'denied');
    if(p!=='granted'){toast('Az értesítés nincs engedélyezve a böngésző/telefon beállításaiban');S.settings.restNotify=false;save();render();return}}
  S.settings.restNotify=v;save();render();
}
function setFx(k){if(!['uiSound','typeSound','doneSound','haptic'].includes(k))return;S.settings[k]=S.settings[k]===false;save();render();
  if(S.settings[k]!==false){if(k==='haptic')haptic();else sfx({uiSound:'tap',typeSound:'type',doneSound:'done'}[k])}}
/* Képernyő ébren tartása edzés közben (Screen Wake Lock API, iOS 16.4+).
   A rendszer elengedi a zárat, ha az app háttérbe kerül – visszatéréskor újrakérjük. */
let WL=null,wlPending=false;
const wakeSupported=()=>'wakeLock' in navigator;
async function wakeOn(){
  if(WL||wlPending||!wakeSupported()||document.visibilityState!=='visible')return;
  wlPending=true;
  try{WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null;updWakeUI()})}catch(e){WL=null}
  wlPending=false;
  if(WL&&!(S.active&&S.settings.wakeLock!==false))wakeOff(); // közben véget ért az edzés
  updWakeUI();
}
function wakeOff(){if(WL){const w=WL;WL=null;w.release().catch(()=>{})}updWakeUI()}
function syncWake(){if(S.active&&S.settings.wakeLock!==false)wakeOn();else if(WL)wakeOff()}
function updWakeUI(){const el=$('#wakeInd');if(el)el.hidden=!WL}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')syncWake()});
document.addEventListener('pointerdown',()=>{if(S.active&&!WL)syncWake()},{passive:true});
function setClaudeUrl(v){v=String(v||'').trim();if(v&&!/^https:\/\/claude\.ai\/[\w\-./?=&#%~]*$/.test(v)){toast('Csak https://claude.ai/ kezdetű link adható meg');render();return}S.settings.claudeUrl=v||null;save();{const y=scrollY;render();scrollTo(0,y)}toast(v?'Link mentve':'Link törölve')}
function setStepGoal(v){S.settings.stepGoal=Math.max(0,Math.min(100000,parseInt(v)||0));save();toast('Mentve')}
function setWake(v){S.settings.wakeLock=v;save();render()}
function setSound(v){S.settings.sound=v;save();render();if(v)chime(v)}
function testSound(){unlockAudio();chime()}
function tick(){
  if(S.active){const t=dur(Date.now()-S.active.start);const a=$('#elapsed'),b=$('#elapsed2');if(a)a.textContent=t;if(b)b.textContent=t}
  const rb=$('#rest');document.body.classList.toggle('resting',!!rest);
  if(rest){const left=Math.ceil((rest.end-Date.now())/1000);
    if(left<=0){const late=-left;lastRestEx=rest.ex||'';rest=null;rb.classList.remove('on');try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}chime();restNotif();toast(late>5?L(`Pihenő vége (${late<90?late+' mp':Math.round(late/60)+' perc'}e lejárt)`,`Rest ended ${late<90?late+' s':Math.round(late/60)+' min'} ago`):'Pihenő vége – következő sorozat')}
    else{rb.classList.add('on');$('#restt').textContent=dur(left*1000);$('#restex').textContent=rest.ex||'';$('#restbar').style.transform=`scaleX(${Math.min(1,left/rest.total).toFixed(4)})`}}
  else rb.classList.remove('on');
}
setInterval(tick,1000);

/* ===== Gyakorlatválasztó ===== */
function pickExercise(cb,onCancel){
  pickCb=cb;pickCancel=onCancel||null;
  openModal(`<h2>Gyakorlat választása</h2><input id="exq" placeholder="Keresés…" data-input="renderPick()" autocomplete="off"><div id="exlist" class="exlist"></div>
  <div class="row" style="margin-top:12px"><button class="btn sm gold" data-click="newExercise()">${I('plus','sm')} Új gyakorlat</button><span class="sp"></span><button class="btn sm" data-click="modalBg()">Mégse</button></div>`);
  renderPick();
}
const CAT_LAST=['Saját testsúly','Kettlebell'],catSort=(a,b)=>(CAT_LAST.indexOf(a)-CAT_LAST.indexOf(b))||a.localeCompare(b,'hu');
function renderPick(){
  const q=($('#exq').value||'').toLowerCase().trim();
  const list=S.exercises.filter(e=>e.name.toLowerCase().includes(q)||T(e.name).toLowerCase().includes(q)||exGroup(e).toLowerCase().includes(q)||lblOf(EQUIP,e.eq).toLowerCase().includes(q)).sort(byName);
  const cats=[...new Set(list.map(exGroup))].sort(groupSort);
  $('#exlist').innerHTML=cats.map(c=>`<div class="cat">${esc(c)}</div>`+list.filter(e=>exGroup(e)===c).map(e=>`<button class="exi" data-click="chooseEx('${e.id}')"><span>${esc(e.name)}</span>${e.rest!=null?`<span class="mut small mono">${I('timer','sm')} ${fmtSec(e.rest)}</span>`:''}</button>`).join('')).join('')||'<div class="mut" style="padding:12px 0">Nincs találat – hozd létre új gyakorlatként.</div>';
}
function chooseEx(id){const cb=pickCb;pickCb=pickCancel=null;closeModal();cb&&cb(id)}
function exFields(e={}){const ml=a=>a.map(m=>[m[0],LANG==='en'?m[2]:m[1]]);
  return[{id:'name',label:'Név',value:e.name||'',placeholder:'pl. KB egykezes evezés'},
    {id:'kind',label:'Mérés',type:'pills',value:[e.kind||'strength'],options:ml(KINDS)},
    {id:'mu',label:'Elsődleges izomcsoport',type:'pills',value:e.mu?[e.mu]:[],options:ml(MUSCLES),exmu:true},
    {id:'mu2',label:'Másodlagos izmok (nem kötelező)',type:'pills',multi:true,value:e.mu2||[],options:ml(MUSCLES),exmu:true},
    {id:'eq',label:'Eszköz',type:'pills',value:e.eq?[e.eq]:[],options:ml(EQUIP),exmu:true},
    {id:'rest',label:'Pihenőidő (mp)',type:'number',min:0,step:5,value:e.rest??'',placeholder:`alapértelmezett: ${S.settings.rest} mp`,hint:'Üresen: az alapértelmezett pihenőidőt használja.'}]}
function applyEx(e,r){e.name=r.name;const k=r.kind||'strength';if(k==='strength')delete e.kind;else e.kind=k;
  if(k==='cardio'){delete e.mu;delete e.mu2;delete e.eq;e.cat='Kardió'}else{if(r.mu)e.mu=r.mu;else delete e.mu;const m2=(r.mu2?r.mu2.split(','):[]).filter(x=>x&&x!==r.mu);if(m2.length)e.mu2=m2;else delete e.mu2;if(r.eq)e.eq=r.eq;else delete e.eq;e.cat=e.mu?MUSCLES.find(m=>m[0]===e.mu)[1]:'Egyéb'}
  e.m=1;if(r.rest==='')delete e.rest;else e.rest=Math.max(0,Math.min(1800,parseInt(r.rest)||0))}
async function createExercise(def=''){
  const r=await form('Új gyakorlat',exFields({name:def}));if(!r||!r.name)return null;
  if(S.exercises.some(e=>e.name.toLowerCase()===r.name.toLowerCase())){toast('Már létezik ilyen nevű gyakorlat');return null}
  const e={id:uid()};applyEx(e,r);S.exercises.push(e);save();return e;
}
async function newExercise(){const e=await createExercise($('#exq')?.value||'');if(e)chooseEx(e.id)}

/* ===== Sablonszerkesztő ===== */
function editTemplate(id){const t=id&&S.templates.find(x=>x.id===id);tplDraft=t?JSON.parse(JSON.stringify(t)):{id:null,name:'',items:[]};renderTpl()}
function renderTpl(){
  const t=tplDraft;
  openModal(`<h2>${t.id?'Sablon szerkesztése':'Új sablon'}</h2><label>Név</label><input value="${esc(T(t.name))}" data-input="setTplName(this.value)" placeholder="pl. Push nap">
  <label>Gyakorlatok · sorozatszám</label>
  ${t.items.map((it,i)=>`<div class="row li"><span style="flex:1;min-width:0">${esc(exName(it.exId))}<br><span class="mut small mono">${I('timer','sm')} ${fmtSec(exRest(it.exId))}</span></span><input type="number" min="1" max="30" value="${it.sets}" style="width:56px;text-align:center" data-input="setTplSets(${i},this.value)" aria-label="Sorozatok"><button class="btn sm ico" data-click="tplMove(${i},-1)" aria-label="Fel">${I('arrow-up','sm')}</button><button class="btn sm ico d" data-click="tplRemove(${i})" aria-label="Törlés">${I('x','sm')}</button></div>`).join('')||'<div class="mut small">Még nincs gyakorlat.</div>'}
  <button class="btn block gold" style="margin-top:12px" data-click="pickForTpl()">${I('plus','sm')} Gyakorlat hozzáadása</button>
  <div class="row" style="margin-top:16px">${t.id?`<button class="btn d" data-click="delTemplate('${t.id}')">${I('trash-2','sm')} Törlés</button>`:''}<span class="sp"></span><button class="btn" data-click="closeModal()">Mégse</button><button class="btn p" data-click="saveTpl()">${I('save','sm')} Mentés</button></div>`);
}
function tplAddEx(id){tplDraft.items.push({exId:id,sets:3});renderTpl()}
function tplMove(i,d){const a=tplDraft.items,j=i+d;if(j<0)return;[a[i],a[j]]=[a[j],a[i]];renderTpl()}
function saveTpl(){const t=tplDraft;t.name=(t.name||'').trim();if(!t.name){toast('Adj nevet a sablonnak');return}
  if(t.id){const i=S.templates.findIndex(x=>x.id===t.id);S.templates[i]=t}else{t.id=uid();S.templates.push(t)}save();closeModal();render()}
async function delTemplate(id){if(!await ask('Törlöd a sablont? A korábbi edzések megmaradnak.',{title:'Sablon törlése',ok:'Törlés',danger:true}))return;S.templates=S.templates.filter(t=>t.id!==id);save();closeModal();render()}

/* ===== Naptár ===== */
/* ===== Profil, célok, javasolt energia- és makrócél =====
   BMR: Mifflin–St Jeor. TDEE = BMR × aktivitási szorzó. Cél = TDEE + célhoz tartozó korrekció.
   Fehérje: g/ttkg a cél szerint (túlsúlynál BMI 27,5-höz tartozó referencia-testsúllyal), zsír: az energia 25–30%-a
   (legalább 0,6 g/ttkg), szénhidrát: a maradék. Alsó határ: nő 1200, férfi 1500 kcal. */
const ACT_LV=[[1.2,'Ülő – irodai munka, kevés mozgás'],[1.375,'Enyhén aktív – heti 1–3 edzés'],[1.55,'Mérsékelten aktív – heti 3–5 edzés'],[1.725,'Nagyon aktív – heti 6–7 edzés'],[1.9,'Extrém – fizikai munka + edzés']];
const GOALS=[['lose','Fogyás'],['maintain','Szinten tartás'],['muscle','Izomépítés'],['gain','Hízás']];
const ADJ={lose:[-300,-500,-750],maintain:[0,0,0],muscle:[150,250,400],gain:[300,500,700]};
const PACE=['Enyhe','Közepes','Gyors'];
const PPK={lose:2.0,maintain:1.6,muscle:1.9,gain:1.7},FATPCT={lose:.25,maintain:.30,muscle:.25,gain:.30};
const lastWeight=()=>{const s=series('weight');return s.length?s[s.length-1].y:null};
const r5=v=>Math.round(v/50)*50;
function targets(){
  const p=S.profile||{},w=lastWeight(),age=p.birthYear?new Date().getFullYear()-p.birthYear:null,goal=p.goal||'maintain';
  const missing=[];if(!p.sex)missing.push(L('nem','sex'));if(!p.birthYear)missing.push(L('születési év','birth year'));if(!p.height)missing.push(L('magasság','height'));if(!p.activity)missing.push(L('aktivitás','activity'));if(!w)missing.push(L('testsúly','body weight'));
  const t={missing,goal,w,age,adult:age==null||age>=18};
  if(!missing.length&&t.adult){
    t.bmr=Math.round(10*w+6.25*p.height-5*age+(p.sex==='m'?5:-161));
    t.tdee=Math.round(t.bmr*p.activity);
    t.adj=ADJ[goal][p.pace??1];
    t.suggested=r5(t.tdee+t.adj);t.floor=p.sex==='f'?1200:1500;
    if(t.suggested<t.floor){t.suggested=t.floor;t.floored=true}
  }
  t.kcal=p.kcalOverride||t.suggested||null;t.custom=!!p.kcalOverride;
  if(t.kcal){
    const refW=w?(p.height?Math.min(w,27.5*(p.height/100)**2):w):null;
    t.p=refW?Math.round(refW*PPK[goal]):Math.round(t.kcal*.25/4);
    t.f=Math.round(t.kcal*FATPCT[goal]/9);if(w)t.f=Math.max(t.f,Math.round(.6*w));
    t.c=Math.max(0,Math.round((t.kcal-t.p*4-t.f*9)/4));
    t.fib=Math.max(25,Math.round(t.kcal/1000*14));
  }
  return t;
}
/* Saját kalóriaérték: soha nem lehet a biztonsági minimum (1200 kcal) alatt, nemtől függetlenül; a képlet szerinti értéknél
   jóval alacsonyabb beállítás előtt az app megerősítést kér. Minden profilváltozás naplózódik (a felhasználónak, a mentésben is). */
const KCAL_MIN=1200;
async function setProf(k,v){
  const p=S.profile,before=targets().kcal,old=p[k]??null;
  if(k==='sex')p.sex=['m','f'].includes(v)?v:null;
  else if(k==='birthYear'){const y=parseInt(v);p.birthYear=y>=1900&&y<=new Date().getFullYear()?y:null}
  else if(k==='height'){const h=parseFloat(String(v).replace(',','.'));p.height=h>=100&&h<=250?h:null}
  else if(k==='activity'){const a=parseFloat(v);p.activity=ACT_LV.some(x=>x[0]===a)?a:null}
  else if(k==='goal')p.goal=GOALS.some(g=>g[0]===v)?v:null;
  else if(k==='pace')p.pace=[0,1,2].includes(+v)?+v:1;
  else if(k==='targetWeight'){const t=parseFloat(String(v).replace(',','.'));p.targetWeight=t>=30&&t<=300?t:null}
  else if(k==='kcalOverride'){const c=parseInt(v);
    if(v===''||v==null)p.kcalOverride=null;
    else if(!(c>=KCAL_MIN&&c<=6000)){toast(L(`${KCAL_MIN}–6000 kcal között adható meg`,`Must be between ${KCAL_MIN} and 6000 kcal`));render();return}
    else{const t=targets();
      if(t.suggested&&c<t.suggested-500&&!await ask(L(`A megadott ${fmt(c,0)} kcal jóval kevesebb, mint a profilod alapján javasolt ${fmt(t.suggested,0)} kcal. Tartósan alacsony bevitel egészségügyi kockázattal járhat; ilyen keretet orvossal vagy dietetikussal egyeztess.`,`${fmt(c,0)} kcal is far below the ${fmt(t.suggested,0)} kcal suggested for your profile. A persistently low intake can carry health risks; agree such a target with a doctor or dietitian.`),{title:L('Alacsony kalóriaérték','Low calorie target'),ok:L('Beállítom','Set it'),danger:true})){render();return}
      p.kcalOverride=c}}
  const nv=p[k]??null;if(String(nv)!==String(old))logProf(k,old,nv,before);
  save();render();
}
function logProf(f,a,b,k0,src){const k1=targets().kcal;(S.profileLog=S.profileLog||[]).push({ts:Date.now(),f,a,b,k0:k0||null,k1:k1||null,...(src?{src}:{})});if(S.profileLog.length>200)S.profileLog.splice(0,S.profileLog.length-200)}
const PROF_F={sex:'Nem',birthYear:'Születési év',height:'Magasság',activity:'Aktivitás',goal:'Cél',pace:'Tempó',targetWeight:'Célsúly',kcalOverride:'Saját napi érték'};
function profVal(f,v){if(v==null||v==='')return'–';if(f==='sex')return v==='m'?L('férfi','male'):L('nő','female');if(f==='activity')return(ACT_LV.find(x=>x[0]===v)?.[1]||String(v)).split(' – ')[0];
  if(f==='goal')return GOALS.find(g=>g[0]===v)?.[1]||v;if(f==='pace')return PACE[v]||v;if(f==='height')return hu(v)+' cm';if(f==='targetWeight')return hu(v)+' kg';if(f==='kcalOverride')return fmt(v,0)+' kcal';return String(v)}
function profLogCard(){const lg=(S.profileLog||[]).slice().reverse(),p=S.profile;
  const ss=series('steps'),avgS=ss.length>=7?avgLast(ss,30):null;
  const nudge=p.activity&&p.activity<=1.375&&avgS!=null&&avgS>=8000?`<div class="hint" style="color:var(--kj-gold)">${L(`Az elmúlt hónapban átlagosan ${fmt(avgS,0)} lépést tettél naponta – lehet, hogy az aktivitási szinted már magasabb a beállítottnál.`,`You averaged ${fmt(avgS,0)} steps a day last month – your activity level may now be higher than the one set.`)}</div>`:'';
  if(!lg.length&&!nudge)return'';
  return`<div class="card" id="proflog"><h2>Változásnapló</h2>${nudge}${lg.slice(0,profLogOpen?200:6).map(e=>`<div class="exl"><span><span class="small mut">${fmtDate(e.ts)}${e.src==='adapt'?' · '+L('adaptív keret','adaptive target'):''}</span><br>${esc(T(PROF_F[e.f]||e.f))}: ${esc(profVal(e.f,e.a))} → <b>${esc(profVal(e.f,e.b))}</b></span><span class="mono small mut">${e.k0&&e.k1&&e.k0!==e.k1?`${fmt(e.k0,0)} → ${fmt(e.k1,0)} kcal`:''}</span></div>`).join('')}
  ${lg.length>6?`<button class="linkbtn" data-click="toggleProfLog()">${profLogOpen?L('Kevesebb','Less'):L(`Mind (${lg.length})`,`All (${lg.length})`)}</button>`:''}</div>`}
let profLogOpen=false;function toggleProfLog(){profLogOpen=!profLogOpen;render()}
let kcalOpen=false,logOpen=false;
function openKcal(){kcalOpen=true;const y=scrollY;render();scrollTo(0,y);setTimeout(()=>$('#pkc')?.focus(),50)}
function toggleLog(){logOpen=!logOpen;const y=scrollY;render();scrollTo(0,y)}
/* Testsúly / testzsír a profilból: a mai napi testadatba kerül */
function setProfBody(k,v){const x=v===''?null:parseFloat(String(v).replace(',','.'));if(x!=null&&(isNaN(x)||(k==='weight'?(x<25||x>350):(x<2||x>70)))){toast(L('Érvénytelen érték','Invalid value'));return}
  let b=S.body.find(e=>e.date===today());if(!b){if(x==null)return;b={date:today()};S.body.push(b)}if(x==null)delete b[k];else b[k]=x;
  if(Object.keys(b).length===1)S.body=S.body.filter(e=>e!==b);save();const y=scrollY;render();scrollTo(0,y);toast('Mentve')}
function vProfile(){
  const p=S.profile,t=targets(),y=new Date().getFullYear();
  const chip=(k,v,l,on)=>`<button class="chip ${on?'on':''}" data-click="setProf('${k}','${v}')">${l}</button>`;
  let warn='';
  if(p.targetWeight&&t.w){const d=t.w-p.targetWeight;
    if(p.goal==='lose'&&d<=0)warn='A célsúly nem kisebb a jelenlegi súlynál, közben a cél fogyás.';
    if(p.goal==='gain'&&d>=0)warn='A célsúly nem nagyobb a jelenlegi súlynál, közben a cél hízás.';}
  let res='';
  if(!t.adult)res=`<div class="hint">A javasolt érték felnőttekre (18+) vonatkozik.</div>`;
  else if(t.missing.length&&!t.kcal)res=`<div class="hint khint">${L('A javasolt napi kalóriakerethez még hiányzik','For your suggested daily calorie target, still missing')}: <b>${t.missing.join(', ')}</b>.</div>`;
  else res=`<div class="khero"><span>${t.custom?L('Saját napi kereted','Your own daily target'):t.goal==='lose'?'Javasolt napi keret':'Javasolt napi bevitel'}</span><b class="mono">${fmt(t.kcal,0)} kcal</b>${t.custom&&t.tdee?`<small>${L('a javasolt helyett','instead of the suggested')}</small>`:''}</div>
    <div class="grid2" style="margin-top:8px">${stat('Alapanyagcsere (BMR)',t.bmr?fmt(t.bmr,0)+' kcal':null)}${stat('Napi energiaigény',t.tdee?fmt(t.tdee,0)+' kcal':null)}</div>
    <div class="grid4" style="margin-top:8px">${stat('Fehérje',fmt(t.p,0)+' g')}${stat('Szénhidrát',fmt(t.c,0)+' g')}${stat('Zsír',fmt(t.f,0)+' g')}${stat('Rost (min.)',fmt(t.fib,0)+' g')}</div>
    <div class="hint">${t.tdee?`Energiaigény: Mifflin–St Jeor × aktivitás. Korrekció a célhoz: ${t.adj>0?'+':''}${t.adj} kcal (${t.adj<0?'kb. '+fmt(-t.adj*7/7700,2)+' kg/hét fogyás':t.adj>0?'kb. '+fmt(t.adj*7/7700,2)+' kg/hét gyarapodás':'súlytartás'}).`:''}
    ${t.floored?` A javaslat elérte az alsó határt (${t.floor} kcal), ennél kevesebbet nem javaslok.`:''}
    ${L(`Fehérje: ${PPK[t.goal]} g/ttkg${p.height&&t.w&&t.w>27.5*(p.height/100)**2?' (referencia-testsúlyra)':''}, zsír: az energia ${Math.round(FATPCT[t.goal]*100)}%-a, szénhidrát: a maradék, rost: 14 g / 1000 kcal, de legalább 25 g (ebből a több is jó).`,`Protein: ${PPK[t.goal]} g/kg bw${p.height&&t.w&&t.w>27.5*(p.height/100)**2?' (for reference weight)':''}, fat: ${Math.round(FATPCT[t.goal]*100)}% of energy, carbs: the rest, fibre: 14 g / 1000 kcal, but at least 25 g (more is fine).`)} <button class="linkbtn" style="display:inline;width:auto;padding:0;margin:0" data-click="openSub('methods')">Számítási módszerek</button> · Tájékoztató becslés, nem orvosi tanács – egészségügyi állapot esetén egyeztesd szakemberrel.</div>`;
  return `<div class="card" id="profile" style="scroll-margin-top:72px"><h2>Profil és célok</h2>
  <label>Nem</label><div class="chips" style="margin:0">${chip('sex','m','Férfi',p.sex==='m')}${chip('sex','f','Nő',p.sex==='f')}</div>
  <div class="grid3" style="align-items:end"><div><label for="pby">Születési év${p.birthYear?` · ${y-p.birthYear} év`:''}</label><input id="pby" type="number" inputmode="numeric" min="1900" max="${y}" value="${p.birthYear??''}" placeholder="pl. 1980" data-change="setProf('birthYear',this.value)"></div>
  <div><label for="pht">Magasság (cm)</label><input id="pht" type="text" inputmode="decimal" autocomplete="off" value="${hu(p.height)}" placeholder="pl. 178" data-change="setProf('height',this.value)"></div>
  <div><label for="ptw">Célsúly (kg)</label><input id="ptw" type="text" inputmode="decimal" autocomplete="off" value="${hu(p.targetWeight)}" placeholder="pl. 80" data-change="setProf('targetWeight',this.value)"></div></div>
  ${(()=>{const tb=S.body.find(b=>b.date===today()),lw=series('weight').slice(-1)[0],lf=series('fat').slice(-1)[0];
    return`<div class="grid2" style="align-items:end"><div><label for="pbw">Testsúly (kg)</label><input id="pbw" type="text" inputmode="decimal" autocomplete="off" value="${tb?.weight!=null?hu(tb.weight):''}" placeholder="${lw?hu(lw.y):'pl. 82'}" data-change="setProfBody('weight',this.value)"></div>
    <div><label for="pbf">Testzsír % (nem kötelező)</label><input id="pbf" type="text" inputmode="decimal" autocomplete="off" value="${tb?.fat!=null?hu(tb.fat):''}" placeholder="${lf?hu(lf.y):'pl. 22'}" data-change="setProfBody('fat',this.value)"></div></div>
    <div class="hint">${lw&&!tb?.weight?L(`Legutóbbi mérés: ${hu(lw.y)} kg (${fmtDate(lw.x)}). Ha most mérsz, írd be – a mai napra kerül a testadatok közé.`,`Last measurement: ${hu(lw.y)} kg (${fmtDate(lw.x)}). If you weigh yourself now, enter it – it’s saved for today in your body data.`):L('A mai napra kerül a testadatok közé; később a Testadatok oldalon vezeted tovább.','Saved for today in your body data; later you keep logging it on the Body page.')}</div>`})()}
  <label for="pact">Aktivitás</label><select id="pact" data-change="setProf('activity',this.value)"><option value="">– válassz –</option>${ACT_LV.map(([v,l])=>`<option value="${v}" ${p.activity===v?'selected':''}>${l}</option>`).join('')}</select>
  <label>Cél</label><div class="chips" style="margin:0">${GOALS.map(([v,l])=>chip('goal',v,l,(p.goal||'maintain')===v)).join('')}</div>
  ${p.goal&&p.goal!=='maintain'?`<label>Tempó</label><div class="chips" style="margin:0">${PACE.map((l,i)=>`<button class="chip ${(p.pace??1)===i?'on':''}" data-click="setProf('pace',${i})">${l} (${ADJ[p.goal][i]>0?'+':''}${ADJ[p.goal][i]} kcal)</button>`).join('')}</div>`:''}
  ${warn?`<div class="hint" style="color:var(--kj-red)">${warn}</div>`:''}
  ${res}
  ${t.kcal||p.kcalOverride?(kcalOpen||p.kcalOverride?`<label for="pkc">Saját napi kalóriakeret (kcal)</label><input id="pkc" type="number" inputmode="numeric" value="${p.kcalOverride??''}" placeholder="${t.kcal&&!t.custom?fmt(t.kcal,0):''}" min="1200" max="6000" data-change="setProf('kcalOverride',this.value)"><div class="hint">Ha kitöltöd, a javasolt keret helyett ezzel számol az app; törölve visszaáll a javasoltra. Legalább 1200 kcal; a javasoltnál jóval alacsonyabb értéket csak orvossal vagy dietetikussal egyeztetve állíts be.</div>`
    :`<button class="linkbtn" style="padding-bottom:0" data-click="openKcal()">${L('Saját napi kalóriakeretet szeretnék megadni','I want to set my own daily calorie target')} ${I('chevron-down','sm')}</button>`):''}</div>`;
}

/* ===== Étkezés ===== */
const MEALS=[['reggeli','Reggeli'],['tizorai','Tízórai'],['ebed','Ebéd'],['uzsonna','Uzsonna'],['vacsora','Vacsora'],['nasi','Nasi / egyéb']];
const mealLbl=k=>(MEALS.find(m=>m[0]===k)||MEALS[5])[1];
const deacc=t=>String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function mealKey(t){t=deacc(t).trim();if(/^(regg|breakf)/.test(t))return'reggeli';if(/^(tiz|brunch|morning)/.test(t))return'tizorai';if(/^(ebed|lunch)/.test(t))return'ebed';if(/^(uzs|afternoon)/.test(t))return'uzsonna';if(/^(vacs|dinner|supper)/.test(t))return'vacsora';return'nasi'}
function guessMeal(){const h=new Date().getHours();return h<10?'reggeli':h<12?'tizorai':h<15?'ebed':h<18?'uzsonna':h<22?'vacsora':'nasi'}
let foodDate=today();
const dayMeals=d=>S.meals.filter(m=>m.date===d);
const sumMeals=l=>l.reduce((a,m)=>({kcal:a.kcal+m.kcal,p:a.p+m.p,c:a.c+m.c,f:a.f+m.f,fib:a.fib+(m.fib||0)}),{kcal:0,p:0,c:0,f:0,fib:0});
const DATE_HEAD=/^(\d{4})\s*[-./]\s*([0-9]{1,2}|[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]{3,10}\.?)\s*[-./]?\s*(\d{1,2})\.?/;
function parseDateStr(t){const m=DATE_HEAD.exec(String(t).trim());if(!m)return null;const mo=monthNum(m[2]);if(!mo||mo>12)return null;
  const d=`${m[1]}-${z2(mo)}-${z2(+m[3])}`,dt=pYmd(d);return dt.getMonth()===mo-1&&dt<=new Date()?d:null}
function parseMacro(t){t=String(t??'').replace(/[\s ]/g,'').replace(/^[^\d]+/,'').replace(/[^\d.,]+$/,'');if(!t)return null;if(/^\d{1,3}([.,]\d{3})+$/.test(t))t=t.replace(/[.,]/g,'');else t=t.replace(',','.');const v=parseFloat(t);return isFinite(v)?Math.round(v*10)/10:null}
/* Formátum soronként: ÉÉÉÉ-HH-NN;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír  (a dátum elhagyható) */
/* Formátum soronként: ÉÉÉÉ-HH-NN;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír;rost
   A dátum elhagyható (ilyenkor a kiválasztott nap), a rost is (régebbi, 7 mezős sorok). */
function parseMeals(text,defDate){
  const out=[];
  for(const raw of String(text||'').split(/\r?\n/)){
    const line=raw.trim().replace(/^[-*•]\s*/,'');if(!line||!line.includes(';'))continue;
    let parts=line.split(';').map(x=>x.trim());while(parts.length&&parts[parts.length-1]==='')parts.pop();
    let date=parseDateStr(parts[0]);const ex=!!date;if(date)parts=parts.slice(1);else date=defDate;
    // a sor végén lévő számmezők: 5 = kcal,F,Sz,Zs,rost; 4 = rost nélkül
    const isNum=t=>{const u=t.replace(/\s*(kcal|kj|gramm|gr|g)\.?$/i,'').trim();return /\d/.test(u)&&/^[\d\s.,\u00a0]+$/.test(u)};
    let k=0;for(let j=parts.length-1;j>=0&&k<5&&isNum(parts[j]);j--)k++;
    if(k<4||parts.length-k<2)continue;
    const nums=parts.slice(-k).map(parseMacro),[kcal,p,c,f]=nums,fib=k===5?nums[4]:null;
    const name=parts.slice(1,parts.length-k).join(' ').slice(0,100);
    if(!name||kcal<0||kcal>10000||[p,c,f].some(x=>x<0||x>1000)||(fib!=null&&(fib<0||fib>500)))continue;
    out.push({date,meal:mealKey(parts[0]),name,kcal:Math.round(kcal),p,c,f,fib,ex});
  }
  return out;
}
async function pasteMeals(){
  let text=null;
  try{if(navigator.clipboard&&navigator.clipboard.readText)text=await navigator.clipboard.readText()}catch(e){text=null}
  let items=parseMeals(text,foodDate);
  if(!items.length){
    const r=await form('Étkezés beillesztése',[{id:'t',label:'Claude válaszának kódblokkja',type:'textarea',placeholder:'2026-11-06;ebéd;Csirkemell 150 g;248;46;0;6;0',hint:'Nyomd hosszan a mezőt, majd Beillesztés. Soronként egy tétel: dátum;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír;rost'}],{ok:'Feldolgozás',intro:text?'A vágólap tartalmában nem találtam étkezés-sort.':''});
    if(!r)return;items=parseMeals(r.t,foodDate);
    if(!items.length){toast('Nem találtam felismerhető sort');return}
  }
  /* Korábbi napra szóló (dátummal kimásolt) tételek: rákérdezünk, mára vegyük-e fel a mostani napszak szerinti étkezésként. */
  const td=today(),old=items.filter(m=>m.ex&&m.date<td);
  if(old.length){const nm=guessMeal(),ds=[...new Set(old.map(m=>fmtDate(m.date)))].join(', ');
    const r=await form('Korábbi dátum',[{id:'mode',label:'Hova kerüljenek?',type:'select',value:'today',options:[['today',L(`Mára, ${mealLbl(nm).toLowerCase()} étkezésként`,`Today, as ${T(mealLbl(nm))}`)],['keep',L('Az eredeti napra','To the original day')]]}],
      {ok:'Tovább',intro:L(`${old.length} tétel korábbi napra szól (${ds}).`,`${old.length} item${old.length>1?'s are':' is'} dated to an earlier day (${ds}).`)});
    if(!r)return;if(r.mode==='today')for(const m of old){m.date=td;m.meal=nm}}
  /* Már rögzített tétel: figyelmeztetünk, de mégis felvehető (pl. ugyanazt kétszer etted). */
  const key=m=>[m.date,m.meal,deacc(m.name),m.kcal].join('|'),have=new Set(S.meals.map(key));
  const dups=items.filter(m=>have.has(key(m)));let fresh=items;
  if(dups.length){
    const ok=await ask(dups.slice(0,8).map(m=>`<div class="exl"><span>${esc(m.name)}<br><span class="mut small">${fmtDate(m.date)} · ${mealLbl(m.meal)}</span></span><span>${m.kcal} kcal</span></div>`).join('')+`<div class="hint">${L('Ugyanezzel a dátummal, étkezéssel és kalóriával már szerepel. Ha tényleg még egyszer etted, rögzítsd újra.','Already logged with the same date, meal and calories. If you really ate it again, log it again.')}</div>`,
      {title:L(`${dups.length} tétel már szerepel`,`${dups.length} item${dups.length>1?'s':''} already logged`),ok:'Mégis rögzítem',cancel:'Kihagyom'});
    if(!ok)fresh=items.filter(m=>!have.has(key(m)));
  }
  if(!fresh.length){toast('Nem maradt rögzítendő tétel');return}
  const sum=sumMeals(fresh);
  const list=fresh.slice(0,12).map(m=>`<div class="exl"><span>${esc(m.name)}<br><span class="mut small">${fmtDate(m.date)} · ${mealLbl(m.meal)}</span></span><span>${m.kcal} kcal</span></div>`).join('')+(fresh.length>12?`<div class="mut small">… és még ${fresh.length-12} tétel</div>`:'');
  if(!await ask(`${list}<div class="exl"><b>Összesen</b><span><b>${fmt(sum.kcal,0)} kcal</b> · F ${fmt(sum.p,0)} · Sz ${fmt(sum.c,0)} · Zs ${fmt(sum.f,0)} · R ${fmt(sum.fib,0)} g</span></div>`,{title:`${fresh.length} tétel mentése`,ok:'Mentés'}))return;
  for(const m of fresh){const x=Object.assign({id:uid()},m);delete x.ex;S.meals.push(x)}
  foodDate=fresh[fresh.length-1].date;save();go('food');toast(`${fresh.length} tétel mentve`);
}
function mealFields(m={}){return[{id:'meal',label:'Étkezés',type:'select',value:m.meal||guessMeal(),options:MEALS},{id:'name',label:'Megnevezés',value:m.name||'',placeholder:'pl. Zabkása 60 g banánnal'},
  {id:'kcal',label:'Energia (kcal)',type:'number',value:m.kcal??''},{id:'p',label:'Fehérje (g)',type:'number',value:m.p??''},{id:'c',label:'Szénhidrát (g)',type:'number',value:m.c??''},{id:'f',label:'Zsír (g)',type:'number',value:m.f??''},{id:'fib',label:'Rost (g)',type:'number',value:m.fib??''}]}
function readMeal(r){const n=k=>{const v=parseMacro(r[k]);return v==null?0:Math.min(k==='kcal'?10000:1000,v)};return{meal:MEALS.some(x=>x[0]===r.meal)?r.meal:'nasi',name:r.name.slice(0,100),kcal:Math.round(n('kcal')),p:n('p'),c:n('c'),f:n('f'),fib:String(r.fib??'').trim()===''?null:Math.min(500,n('fib'))}}
async function addMeal(){const r=await form('Új tétel',mealFields(),{intro:fmtDate(foodDate)});if(!r||!r.name){if(r)toast('Adj meg megnevezést');return}
  S.meals.push(Object.assign({id:uid(),date:foodDate},readMeal(r)));save();render()}
async function editMeal(id){const m=S.meals.find(x=>x.id===id);if(!m)return;const r=await form('Tétel szerkesztése',mealFields(m),{intro:fmtDate(m.date)});if(!r||!r.name)return;Object.assign(m,readMeal(r));save();render()}
async function delMeal(id){const m=S.meals.find(x=>x.id===id);if(!m)return;if(!await ask(`Törlöd: <b>${esc(m.name)}</b> (${m.kcal} kcal)?`,{title:'Tétel törlése',ok:'Törlés',danger:true}))return;S.meals=S.meals.filter(x=>x.id!==id);save();render()}
function copyMealToday(id){const m=S.meals.find(x=>x.id===id);if(!m)return;S.meals.push(Object.assign({},m,{id:uid(),date:today()}));save();toast('Hozzáadva a mai naphoz')}
function foodNav(d){const x=pYmd(foodDate);x.setDate(x.getDate()+d);const k=ymd(x);if(k>today())return;foodDate=k;render()}
function setFoodDate(v){foodDate=DATE_RE.test(v)&&v<=today()?v:today();render()}
function foodToday(){foodDate=today();render()}
function vFood(){
  const t=targets(),items=dayMeals(foodDate),s=sumMeals(items),isToday=foodDate===today();
  let h=`<div class="card"><div class="row" style="flex-wrap:nowrap"><button class="iconbtn" data-click="foodNav(-1)" aria-label="Előző nap">${I('chevron-left')}</button>
  <input type="date" value="${foodDate}" max="${today()}" data-change="setFoodDate(this.value)" style="flex:1;text-align:center" aria-label="Nap">
  <button class="iconbtn" data-click="foodNav(1)" aria-label="Következő nap" ${isToday?'disabled style="opacity:.35"':''}>${I('chevron-right')}</button>${isToday?'':`<button class="btn sm" data-click="foodToday()">Ma</button>`}</div>
  <div style="margin-top:14px">${kcalViz(items,`<span class="hk">${isToday?'Ma':esc(pYmd(foodDate).toLocaleDateString(LOC(),{weekday:'long'}))}</span>`)}</div>
  ${!t.kcal?`<div class="hint" style="margin-top:12px">A javasolt napi bevitelhez töltsd ki a profilodat. A Claude-projekt útmutatója és a menüjavaslat csak utána érhető el, mert a napi célok is belekerülnek.</div><button class="linkbtn" style="padding-bottom:0" data-click="openSub('profile')">Profil kitöltése ${I('chevron-right','sm')}</button>`:''}</div>
  <div class="row" style="margin-bottom:8px;flex-wrap:nowrap">${S.settings.claudeUrl?`<a class="btn" href="${esc(S.settings.claudeUrl)}" target="_blank" rel="noopener noreferrer">${I('external-link','sm')} Claude</a>`:''}<button class="btn p" style="flex:1;min-width:0" data-click="pasteMeals()">${I('clipboard-paste','sm')} Beillesztés${S.settings.claudeUrl?'':' Claude-ból'}</button><button class="btn ico" data-click="foodHelp()" aria-label="Súgó: Claude-projekt" ${t.kcal?'':'disabled'}>${I('circle-help','sm')}</button></div>
  <div class="row" style="margin-bottom:12px;flex-wrap:nowrap"><button class="btn" style="flex:1;min-width:0" data-click="quickLog()">${I('history','sm')} Gyors rögzítés</button><button class="btn" data-click="addMeal()">${I('plus','sm')} Kézi</button></div>`;
  h+=`<div class="card"><div class="row" style="flex-wrap:nowrap;margin-bottom:10px"><h2 style="flex:1;margin:0;font-size:17px">Menüjavaslat</h2><button class="btn sm ico" data-click="openSub('food','fprefs')" aria-label="Étkezési preferenciák">${I('settings','sm')}</button></div>
  <button class="btn block" data-click="askMenu('week')" ${t.kcal?'':'disabled'}>${I('calendar-days','sm')} Heti menü</button><div class="grid2" style="margin-top:8px"><button class="btn" data-click="askRest()" ${t.kcal?'':'disabled'}>Mit egyek még ma?</button><button class="btn" data-click="askMenu('ideas')" ${t.kcal?'':'disabled'}>${I('lightbulb','sm')} Receptötletek</button></div>${t.kcal?'':`<div class="hint" style="margin-top:8px">A profil kitöltése után érhető el.</div>`}</div>`;
  const trend=`<div class="card"><h2 style="font-size:17px">Utolsó 7 nap</h2>${foodTrend(7)}</div>`;
  for(const[k,l]of MEALS){const g=items.filter(m=>m.meal===k);if(!g.length)continue;const gs=sumMeals(g);
    h+=`<div class="card"><div class="row"><h2 style="flex:1;margin:0;font-size:17px">${l}</h2><span class="mono small mut">${fmt(gs.kcal,0)} kcal</span></div>
    ${g.map(m=>`<div class="row li" style="flex-wrap:nowrap"><button class="exi" style="flex:1;margin:0;display:block;background:none;border:0;padding:4px 0" data-click="editMeal('${m.id}')"><span>${esc(m.name)}</span><br><span class="mut small mono">F ${fmt(m.p,0)} · Sz ${fmt(m.c,0)} · Zs ${fmt(m.f,0)}${m.fib!=null?' · R '+fmt(m.fib,0):''} g</span></button><span class="mono small" style="white-space:nowrap">${m.kcal} kcal</span>${isToday?'':`<button class="btn sm ico" data-click="copyMealToday('${m.id}')" aria-label="Hozzáadás a mai naphoz">${I('copy','sm')}</button>`}<button class="btn sm ico d" data-click="delMeal('${m.id}')" aria-label="Törlés">${I('trash-2','sm')}</button></div>`).join('')}</div>`}
  h+=trend;
  return h;
}

/* Napi energia-ív: mutató és skálafeliratok nélkül, csak kitöltés. A jelölő a javasolt bevitel / napi keret.
   Színek: a javasolt ±10%-án belül zöld, alatta semleges kék, felette borostyán (jelzés, nem riasztás). */
const kcalOp=(v,T)=>!T||v>=T*.9?1:.45; // a javasolt érték 90%-a alatt halványabb – a szín mindig az étkezési energiáé
const kcalTerm=g=>g==='lose'?{noun:'napi keret',short:'keret'}:{noun:'javasolt bevitel',short:'javasolt'};
/* 7 vagy 30 napos kcal-oszlopdiagram célvonallal; 30 napnál 7 napos mozgóátlag, 7 napnál eltérés a céltól. */
function foodTrend(n){
  const t=targets(),byDay={};for(const m of S.meals)(byDay[m.date]=byDay[m.date]||[]).push(m);
  const days=[...Array(n)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(n-1)+i);return ymd(d)});
  const kc=d=>byDay[d]?Math.round(sumMeals(byDay[d]).kcal):0,vals=days.map(kc),T=t.kcal||0;
  const term=kcalTerm(t.goal);
  const logged=Object.keys(byDay).sort();
  const ma=n>7?days.map(d=>{const e=pYmd(d).getTime(),w=logged.filter(x=>{const q=pYmd(x).getTime();return q<=e&&q>e-7*DAY});return w.length?w.reduce((a,x)=>a+kc(x),0)/w.length:null}):null;
  const lbl=days.map(d=>n<=7?(s=>s.charAt(0).toUpperCase()+s.slice(1))(pYmd(d).toLocaleDateString(LOC(),{weekday:'short'}).replace('.','')):d.slice(5).replace('-','.'));
  const done=days.filter(d=>d!==today()&&byDay[d]).map(kc); // a mai, még tartó nap nem számít bele
  const above=T?done.filter(v=>v>T*1.1).length:0,below=T?done.filter(v=>v<T*.9).length:0,avgDev=T&&done.length?done.reduce((a,v)=>a+v-T,0)/done.length:null;
  const chart=barChart(lbl,vals,{color:C.kcal,opFn:v=>kcalOp(v,T),goal:T,goalColor:C.text,goalLabel:false,avgLine:ma,avgColor:C.text,h:n<=7?220:190,
    sub:n<=7&&T?(v=>v?{text:sgn(v-T,0)+(v>T*1.1?' ▲':''),color:C.text}:null):null,empty:`Az elmúlt ${n} napban nincs rögzített étkezés`});
  return chart+`<div class="legend" style="margin-top:6px">${T?`<span><i style="background:none;border-top:2px dashed ${C.text};height:0;border-radius:0;width:14px;vertical-align:3px"></i>${term.short}: ${fmt(T,0)} kcal</span><span><i style="background:${C.kcal}"></i>legalább 90%</span><span><i style="background:${C.kcal};opacity:.45"></i>alatta</span>`:''}${ma?`<span><i style="background:${C.text};height:3px;vertical-align:3px"></i>7 napos átlag</span>`:''}</div>
  <div class="grid3" style="margin-top:8px">${stat('Átl. eltérés · kcal/nap',avgDev==null?null:sgn(avgDev,0),avgDev==null?'':Math.abs(avgDev)<=T*.1?'neg':'')}${stat('Alatta / felette',T&&done.length?`${below} / ${above} nap`:null)}${stat('±10%-on belül',T&&done.length?`${done.length-above-below} / ${done.length} nap`:null)}</div>`;
}
function setFoodRng(n){foodRng=[7,30,90].includes(n)?n:30;render()}
let waistOpen=false;function toggleWaist(){waistOpen=!waistOpen;render()}
let foodRng=30;

/* ===== Claude-projekt útmutató ===== */
function claudeInstr(){
  if(LANG!=='en')return claudeInstrHu();
  const t=targets(),g=EN[GOALS.find(x=>x[0]===t.goal)?.[1]||'Szinten tartás']||'Maintain';
  return `This project is for logging my meals in the Olupan app.

My own recipes: if a food I mention is in the project's recipes.md file (by name or nickname), calculate from that recipe's ingredients instead of a general estimate, and don't ask about the preparation. Calculate each ingredient (raw weights), add them up, divide by the number of servings, then multiply by how much I ate. If I give a new recipe in the chat, use it from then on, and on request give back the full updated recipe file so I can replace the project file.

When I send a photo of food, or describe what I ate:
1. Identify the foods and estimate the portions. If a portion or the preparation (oil, butter, sauce, sugar) is genuinely uncertain, ask briefly first – at most 2 questions. If I give grams, use them.
2. For each item, calculate energy (kcal), macros (protein, carbs, fat) and fiber, in grams. Use standard European nutrient values, and take into account whether the weight is raw or cooked. If the product variant matters (e.g. 0% vs full-fat Greek yoghurt, light vs regular sour cream) and I don't say, use the usual variant and state it in the name (e.g. Greek yoghurt 10% 150 g).
3. Write a 1–3 sentence summary of what the estimate is based on.
4. At the END of the reply, give the items in a single code block, one item per line, exactly in this format:
YYYY-MM-DD;meal;name;kcal;protein;carbs;fat;fiber

Rules for the code block:
- date: today (my local time zone), unless I say otherwise (e.g. “dinner yesterday”)
- meal: breakfast, morning snack, lunch, afternoon snack, dinner or snack. If I don’t say, choose based on the time of day.
- name: short, including the portion, without semicolons (e.g. Grilled chicken breast 150 g)
- numbers are whole numbers, without units
- nothing else in the code block

Example:
2026-11-06;lunch;Grilled chicken breast 150 g;248;46;0;6;0
2026-11-06;lunch;Boiled jasmine rice 180 g;234;5;51;1;1
2026-11-06;lunch;Mixed salad with olive oil;120;2;6;10;3

My goal: ${g}.${t.kcal?` ${t.goal==='lose'?'My daily budget':'My suggested daily intake'} (informational): ${t.kcal} kcal, ${t.p} g protein, ${t.c} g carbs, ${t.f} g fat, at least ${t.fib} g fiber.`:''} If I send several meals in the same chat, total the daily intake on request. Be factual and non-judgemental.

Meal suggestions and menus: requests that start with "Meal suggestion" come from the Olupan app and contain my current daily targets, what I've eaten today and my food preferences. If I ask for a menu or meal idea WITHOUT these details, ask for them briefly or remind me to use the app's Meal suggestion buttons – don't work from assumptions.
- Strictly respect the diet and the foods to avoid. If a preference makes the targets hard to meet, say so.
- Keep the daily total within ±10% of the energy target, and protein not below the target by more than 10%. Never suggest substantially less than the given target, and give no crash-diet, fasting or "compensation" tips. Be factual and non-judgemental.
- Always state the exact product variant (fat content, type – e.g. light sour cream, 2% Greek yoghurt, skinless chicken breast), because it matters a lot.
- ${t.goal==='lose'?'Since my goal is to lose weight, where a lower-energy variant of the same product exists (e.g. light sour cream, low-fat quark, yoghurt instead of cream), use it in the recipe and note the original in brackets. Weigh fats (oil, butter) in grams rather than "a splash". Don’t sacrifice flavour or fullness: save on amounts and variants, not on the food.':'If an ingredient has a lower-energy variant that suits the dish, mention it as an option. Weigh fats (oil, butter) in grams.'}
- For big-batch recipes (e.g. cooking for the week), say how big one portion is for my target (grams) and how many portions it makes.
- For each dish give: name, servings, time, difficulty, ingredients in grams (raw), numbered steps matched to my cooking level, and per-serving kcal, protein, carbs, fat and fiber. For make-ahead dishes, say how long they keep and how to store them.
- Unless the request says otherwise (e.g. recipe ideas only need a short list). Weekly menu: follow the rules in the request (number of cooking sessions, simple breakfasts and snacks, familiar dishes), plan batch cooking and leftovers, reuse ingredients, and finish with a shopping list grouped by category with total quantities. “What should I eat today?”: suggest only from what I have at hand or can buy where I am.
- Offer to add new recipes to recipes.md in its format, and on request give back the full updated file.
- Do NOT put meal suggestions in the logging code block – that is only for what I actually ate.`;
}
function claudeInstrHu(){
  const t=targets(),g=GOALS.find(x=>x[0]===t.goal)?.[1]||'Szinten tartás';
  return `Ez a projekt az étkezéseim naplózására szolgál az Olupan appban.

Saját receptek: ha egy általam említett étel szerepel a projekt receptek.md fájljában (névvel vagy becenévvel), a recept hozzávalóiból számolj, ne általános becsléssel, és ne kérdezz vissza az elkészítésre. Számold ki a hozzávalókat egyenként (nyers tömegek), add össze, oszd el az adagszámmal, majd szorozd azzal, amennyit ettem. Ha a beszélgetésben új receptet adok meg, onnantól azzal is számolj, és kérésre add vissza a teljes, frissített receptfájlt, hogy lecserélhessem a projekt fájlját.

Amikor fotót küldök az ételről, vagy leírom/elmondom, mit ettem:
1. Azonosítsd az ételeket, és becsüld meg az adagokat. Ha egy adag vagy az elkészítés (olaj, vaj, szósz, cukor) érdemben bizonytalan, előbb kérdezz vissza röviden, legfeljebb 2 kérdéssel. Ha grammban megadom, azzal számolj.
2. Tételenként számold ki az energiát (kcal), a makrókat (fehérje, szénhidrát, zsír) és a rostot, grammban. Magyar/európai tápanyagértékekkel számolj, és vedd figyelembe, hogy nyers vagy főtt tömegről van-e szó. Ha a termék változata érdemben számít (pl. 12% vagy 20% tejföl, 0%-os vagy görög joghurt, sovány vagy zsíros túró) és nem mondom meg, a szokásos változattal számolj, és a megnevezésben jelöld (pl. Tejföl 20% 50 g).
3. Írj egy 1–3 mondatos összefoglalót arról, mire alapoztad a becslést.
4. A válasz VÉGÉN egyetlen kódblokkban add meg a tételeket, tételenként egy sorban, pontosan ebben a formátumban:
ÉÉÉÉ-HH-NN;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír;rost

Szabályok a kódblokkhoz:
- dátum: a mai nap (Magyarország, Europe/Budapest), kivéve, ha mást mondok (pl. „tegnap vacsorára”)
- étkezés: reggeli, tízórai, ebéd, uzsonna, vacsora vagy nasi. Ha nem mondom meg, a napszak alapján válassz.
- megnevezés: rövid, az adaggal együtt, pontosvessző nélkül (pl. Grillezett csirkemell 150 g)
- a számok egész számok, mértékegység nélkül
- a kódblokkban semmi más ne legyen

Példa:
2026-11-06;ebéd;Grillezett csirkemell 150 g;248;46;0;6;0
2026-11-06;ebéd;Főtt jázmin rizs 180 g;234;5;51;1;1
2026-11-06;ebéd;Vegyes saláta olívaolajjal;120;2;6;10;3

A célom: ${g}.${t.kcal?` ${t.goal==='lose'?'Napi keretem':'Javasolt napi bevitelem'} (tájékoztató): ${t.kcal} kcal, ${t.p} g fehérje, ${t.c} g szénhidrát, ${t.f} g zsír, legalább ${t.fib} g rost. Ha ugyanebben a beszélgetésben több étkezést is küldök, kérésre összesítsd a napi bevitelt. Ítélkezés nélkül, tárgyilagosan fogalmazz.`:''}

Menüjavaslat: a „Menüjavaslat” kezdetű kéréseket az Olupan app küldi, és benne van a napi keretem, az aznap már elfogyasztott étel és az étkezési preferenciáim. Ha ezek NÉLKÜL kérek menüt vagy ételötletet, röviden kérdezz rá, vagy emlékeztess, hogy használjam az app Menüjavaslat gombjait – ne feltételezésekből dolgozz.
- Az étrendet és a kerülendő összetevőket szigorúan tartsd be. Ha egy preferencia miatt a keret nehezen tartható, jelezd.
- A napi összeg az energiakerettől legfeljebb ±10%-kal térjen el, a fehérje legfeljebb 10%-kal maradjon el a céltól. Soha ne javasolj lényegesen kevesebbet a megadott keretnél, és ne adj villámdiétás, böjtölős vagy „kompenzáló” tanácsot. Tárgyilagosan, ítélkezés nélkül fogalmazz.
- A hozzávalóknál mindig add meg a pontos változatot (zsírtartalom, típus – pl. tejföl 12%, görög joghurt 2%, csirkemell bőr nélkül), mert ez sokat számít.
- ${t.goal==='lose'?'Mivel a célom a fogyás, ahol van ugyanannak a terméknek alacsonyabb energiatartalmú változata (pl. 12% tejföl 20% helyett, sovány túró, főzőtejszín helyett joghurt), azt írd a receptbe, és zárójelben jelezd az eredetit. A zsiradékot (olaj, vaj) mérd grammra, ne „egy löttyintésnyi” legyen. Az ízvilágot és a jóllakottságot ne áldozd fel: inkább a mennyiségen és a változaton spórolj, ne az ételen.':'Ha egy hozzávalónak van alacsonyabb energiatartalmú változata, és az illik az ételhez, említsd meg lehetőségként. A zsiradékot (olaj, vaj) mérd grammra.'}
- Nagy adagos (pl. egész hétre főzős) receptnél add meg, hogy az én keretemhez mekkora egy adag (gramm), és hány adag lesz belőle.
- Minden ételnél add meg: név, adagszám, idő, nehézség, hozzávalók grammban (nyers tömeg), a főzési gyakorlatomhoz illő számozott elkészítési lépések, és adagonként kcal, fehérje, szénhidrát, zsír és rost. Előre elkészíthető ételnél írd meg, meddig és hogyan tárolható.
- Mindez akkor, ha a kérés mást nem mond (pl. receptötleteknél elég a rövid lista). Heti menü: tartsd be a kérésben lévő szabályokat (főzések száma, egyszerű reggeli és snack, ismert ételek), tervezz előre főzéssel és maradékokkal, használd újra az összetevőket, a végén pedig adj kategóriák szerint csoportosított bevásárlólistát összesített mennyiségekkel. „Mit egyek még ma?”: csak abból javasolj, ami kéznél van, vagy ott megvehető, ahol vagyok.
- Ajánld fel, hogy az új recepteket a receptek.md formátumában hozzáadod, és kérésre add vissza a teljes, frissített fájlt.
- A menüjavaslatot NE tedd a naplózó kódblokkba – az csak arra való, amit ténylegesen megettem.`;
}
function recipesMd(){
  if(LANG==='en')return`# My recipes

If a food I mention is in this list (by name or nickname), calculate from the recipe's ingredients, not from a general estimate, and don't ask about the preparation.
- Calculate energy (kcal), protein, carbs, fat and fiber for each ingredient (raw weights, standard European nutrient values), add them up, then divide by the number of servings.
- If I give servings ("1 serving", "half a serving", "1.5 servings"), multiply the per-serving values.
- If I give grams, calculate against the finished weight; if the recipe has no finished weight, ask for it.
- If I give the nutrition values of an ingredient (e.g. from the label), use those.
- Always use the same ingredient values for the same recipe.
- In the summary, briefly list the values per ingredient and the per-serving total.
- In the code block, the name is the recipe name with the portion, e.g. "Breakfast porridge 1 serving", on a single line, not per ingredient.
- Time, difficulty and method are optional; for meal suggestions use them as given. New recipes you suggest should be written in this same format.

---

## Breakfast porridge
Nicknames: porridge, oats
Servings: 1
Time: 10 minutes · Difficulty: easy
Ingredients:
- 50 g rolled oats
- 250 ml water
- 28 g whey protein powder
- 60 g frozen blueberries
Method:
1. Bring the water to the boil, stir in the oats and simmer for 3–4 minutes.
2. Take off the heat, let it cool for a minute, then stir in the protein powder.
3. Top with the blueberries (thawed or straight from the freezer).

---

## [Recipe name]
Nicknames:
Servings:
Finished weight (optional, needed for portions given in grams):
Time: · Difficulty:
Ingredients:
- 
Method:
1. 
`;
  return`# Saját receptjeim

Ha egy általam említett étel szerepel ebben a listában (névvel vagy becenévvel), a recept hozzávalóiból számolj, ne általános becsléssel, és ne kérdezz vissza az elkészítésre.
- Számold ki hozzávalónként az energiát (kcal), a fehérjét, a szénhidrátot, a zsírt és a rostot (nyers tömegek, magyar/európai tápanyagértékek), add össze, majd oszd el az adagszámmal.
- Ha adagot mondok („1 adag”, „fél adag”, „1,5 adag”), az egy adagra jutó értéket szorozd fel.
- Ha grammot mondok, a kész tömegre vetítve számolj; ha a receptnél nincs kész tömeg, kérdezz rá.
- Ha egy hozzávalónál megadom a tápértéket (pl. a csomagolásról), azzal számolj.
- Ugyanarra a receptre mindig ugyanazokkal a hozzávaló-értékekkel számolj.
- Az összefoglalóban röviden írd ki a hozzávalónkénti értékeket és az egy adagra jutó összeget.
- A kódblokkban a megnevezés a recept neve legyen az adaggal, pl. „Reggeli zabkása 1 adag”, egyetlen sorban, nem hozzávalónként.
- Az idő, a nehézség és az elkészítés nem kötelező; menüjavaslatnál ezeket használd. Az általad javasolt új recepteket is ebben a formátumban írd meg.

---

## Reggeli zabkása
Becenevek: zabkása, zabi
Adag: 1
Idő: 10 perc · Nehézség: könnyű
Hozzávalók:
- 50 g zabpehely
- 250 ml víz
- 28 g tejsavó fehérjepor
- 60 g fagyasztott áfonya
Elkészítés:
1. A vizet forrald fel, keverd bele a zabpelyhet, és 3–4 percig főzd kis lángon.
2. Vedd le a tűzről, hagyd egy percig hűlni, majd keverd bele a fehérjeport.
3. Tedd rá az áfonyát (felengedve vagy fagyasztva).

---

## [Recept neve]
Becenevek:
Adag:
Kész tömeg (nem kötelező, a grammban megadott adaghoz kell):
Idő: · Nehézség:
Hozzávalók:
- 
Elkészítés:
1. 
`}
async function downloadRecipes(){if(await shareOrDownload(LANG==='en'?'recipes.md':'receptek.md',recipesMd(),'text/plain','Olupan – receptek'))toast('Receptfájl elkészült')}
/* ===== Menüjavaslat: az app állítja össze a kérést (keret, mai étkezés, preferenciák), a szabályok a projekt-utasításban vannak ===== */
const PREF_DIET=[['dairy','Tejmentes','Dairy-free'],['sugar','Hozzáadott cukor nélkül','No added sugar'],['meat','Húsmentes','Meat-free'],['vegetarian','Vegetáriánus','Vegetarian'],['vegan','Vegán','Vegan'],['pesc','Halat eszik, húst nem','Pescatarian'],['egg','Tojásmentes','Egg-free'],['pork','Sertéshúsmentes','Pork-free'],['gluten','Gluténmentes','Gluten-free']];
const PREF_EQUIP=[['oven','Sütő','Oven'],['stove','Tűzhely / főzőlap','Hob / stove'],['micro','Mikrohullámú sütő','Microwave'],['airfryer','Air fryer','Air fryer'],['robot','Konyhai robotgép','Food processor / stand mixer'],['blender','Turmix / botmixer','Blender / stick blender'],['pressure','Kukta / multicooker','Pressure cooker / multicooker'],['slow','Lassúfőző','Slow cooker'],['grill','Kontakt grill','Contact grill'],['toaster','Kenyérpirító','Toaster']];
const PREF_STYLE=[['budget','Takarékos','Budget-friendly'],['prep','Több napra előre elkészíthető','Make-ahead'],['quick','Gyors (20 perc alatt)','Quick (under 20 min)'],['handsoff','Otthagyhatós (kevés aktív munka)','Hands-off (little active time)'],['dishes','Kevés mosogatás','Few dishes'],['season','Szezonális','Seasonal'],['protein','Fehérjedús','High-protein']];
/* Konyhák régiók szerint. Napi/heti menünél az app 1–2-t választ közülük, a receptötleteknél mindet használja. */
const PREF_CUISINE=[['hu','Magyaros','Hungarian'],['it','Olaszos','Italian'],['es','Spanyol','Spanish'],['med','Mediterrán','Mediterranean'],['us','Amerikai','American'],['mx','Mexikói','Mexican'],['tr','Török','Turkish'],['me','Közel-keleti','Middle Eastern'],['ma','Marokkói','Moroccan'],['wa','Nyugat-afrikai','West African'],['za','Dél-afrikai','South African'],['in','Indiai','Indian'],['th','Thai','Thai'],['vn','Vietnami','Vietnamese'],['cn','Kínai','Chinese'],['kr','Koreai','Korean'],['jp','Japán','Japanese']];
/* Beszerezhetőség: nem használható / helyettesítővel (az eredeti is odaírva) / nyugodtan használható */
const CUISINE_RULES={
 wa:{no:[['teff liszt','teff flour'],['vörös pálmaolaj','red palm oil'],['egusi mag','egusi seeds'],['fonio','fonio']],sub:[['főzőbanán','édesburgonya','plantain','sweet potato'],['jamgyökér','burgonya vagy édesburgonya','yam','potato or sweet potato'],['scotch bonnet paprika','habanero vagy friss chili','scotch bonnet pepper','habanero or fresh chilli']],ok:[['mogyoróvaj','peanut butter'],['rizs','rice'],['bab','beans'],['gyömbér','ginger'],['paradicsompüré','tomato purée']]},
 za:{sub:[['boerewors','fűszeres sertés-marha kolbász','boerewors','spiced pork-and-beef sausage']],ok:[['baracklekvár','apricot jam'],['chutney','chutney'],['curry por','curry powder'],['édesburgonya','sweet potato']]},
 ma:{sub:[['ras el hanout','saját keverék: római kömény, koriandermag, fahéj, gyömbér, kurkuma, paprika','ras el hanout','own blend: cumin, coriander seed, cinnamon, ginger, turmeric, paprika'],['sózott citrom','citromhéj és só','preserved lemon','lemon zest and salt']],ok:[['kuszkusz','couscous'],['csicseriborsó','chickpeas'],['datolya','dates'],['aszalt sárgabarack','dried apricots'],['harissza paszta','harissa paste']]},
 me:{sub:[['szumák','citromhéj','sumac','lemon zest'],['za’atar','kakukkfű, szezámmag és citromhéj','za’atar','thyme, sesame seeds and lemon zest']],ok:[['tahini','tahini'],['gránátalma','pomegranate'],['bulgur','bulgur'],['csicseriborsó','chickpeas'],['római kömény','cumin']]},
 tr:{sub:[['pul biber','pirospaprika és chilipehely','pul biber','paprika and chilli flakes']],ok:[['bulgur','bulgur'],['joghurt','yoghurt'],['padlizsán','aubergine'],['vörös lencse','red lentils']]},
 in:{sub:[['paneer','halloumi vagy tofu','paneer','halloumi or tofu'],['curry levél','elhagyható','curry leaves','can be left out']],ok:[['kurkuma','turmeric'],['kardamom','cardamom'],['garam masala','garam masala'],['kókusztej','coconut milk'],['vörös lencse','red lentils'],['basmati rizs','basmati rice']]},
 th:{sub:[['galangal','gyömbér','galangal','ginger'],['kaffir lime levél','lime héja','kaffir lime leaves','lime zest'],['citromnád','lime héja','lemongrass','lime zest'],['thai bazsalikom','bazsalikom','Thai basil','basil']],ok:[['kókusztej','coconut milk'],['halszósz','fish sauce'],['curry paszta','curry paste'],['rizstészta','rice noodles']]},
 vn:{sub:[['vietnámi koriander','koriander és menta','Vietnamese coriander','coriander and mint']],ok:[['rizspapír','rice paper'],['rizstészta','rice noodles'],['halszósz','fish sauce'],['friss koriander és menta','fresh coriander and mint']]},
 cn:{sub:[['shaoxing bor','száraz sherry','Shaoxing wine','dry sherry'],['szecsuáni bors','fekete bors és kevés chili','Sichuan pepper','black pepper and a little chilli']],ok:[['szójaszósz','soy sauce'],['szezámolaj','sesame oil'],['osztrigaszósz','oyster sauce'],['tofu','tofu']]},
 kr:{sub:[['gochugaru','pirospaprika és chilipehely','gochugaru','paprika and chilli flakes']],ok:[['gochujang','gochujang'],['kimchi','kimchi'],['szezámolaj','sesame oil'],['szójaszósz','soy sauce']]},
 jp:{sub:[['mirin','rizsecet kevés cukorral','mirin','rice vinegar with a little sugar'],['dashi','zöldségalaplé és nori','dashi','vegetable stock and nori']],ok:[['miso','miso'],['nori','nori'],['rizsecet','rice vinegar'],['panko','panko']]},
 mx:{sub:[['tomatillo','zöld paradicsom','tomatillo','green tomato'],['chipotle','füstölt paprika és chili','chipotle','smoked paprika and chilli']],ok:[['tortilla','tortillas'],['fekete bab','black beans'],['avokádó','avocado'],['lime','lime'],['koriander','coriander']]}};
const PREF_SKILL=[['beginner','Kezdő','Beginner'],['intermediate','Haladó','Intermediate'],['confident','Rutinos','Confident']];
function fprefs(){const d={diet:[],cuisine:[],style:[],cook:2,avoid:'',wish:'',skill:'intermediate',people:1,meals:4,eq:[],equipment:''};return Object.assign(d,S.settings.foodPrefs||{})}
function setFPref(k,v){const p=fprefs();if(k==='cook')v=Math.max(1,Math.min(4,parseInt(v)||2));else if(k==='people'||k==='meals')v=Math.max(1,Math.min(k==='people'?8:6,parseInt(v)||1));else v=String(v||'').slice(0,300).trim();p[k]=v;S.settings.foodPrefs=p;save()}
function toggleFPref(k,v){const p=fprefs(),a=new Set(p[k]);a.has(v)?a.delete(v):a.add(v);p[k]=[...a];S.settings.foodPrefs=p;save();render()}
function vFoodPrefs(){const p=fprefs(),lbl=x=>LANG==='en'?x[2]:x[1];
  const chips=(k,list)=>`<div class="chips" style="margin:0">${list.map(x=>`<button class="chip${p[k].includes(x[0])?' on':''}" data-click="toggleFPref('${k}','${x[0]}')" aria-pressed="${p[k].includes(x[0])}" translate="no">${esc(lbl(x))}</button>`).join('')}</div>`;
  return `<div class="card" id="fprefs"><h2>Étkezési preferenciák</h2><div class="hint" style="margin-top:-4px">A Menüjavaslat gombok ezeket küldik el a Claude-projektednek, a kalóriakerettel együtt. Csak ezen a készüléken tárolódnak.</div>
  <label>Étrend</label>${chips('diet',PREF_DIET)}
  <label for="favoid">Kerülendő összetevők</label><input id="favoid" maxlength="300" value="${esc(p.avoid)}" placeholder="${esc(L('pl. gomba, koriander, földimogyoró','e.g. mushrooms, coriander, peanuts'))}" data-change="setFPref('avoid',this.value)">
  <label>Konyha</label><div class="hint" style="margin:-2px 0 6px">Napi és heti menünél az app 1–2 konyhát választ ki véletlenszerűen a bejelöltek közül, hogy az alapanyagok átfedjenek. A receptötleteknél mindet használja.</div>${chips('cuisine',PREF_CUISINE)}
  <label>Stílus</label>${chips('style',PREF_STYLE)}
  <label for="fwish">Egyéb kívánság vagy stílus</label><input id="fwish" maxlength="300" value="${esc(p.wish)}" placeholder="${esc(L('pl. indiai jellegű, kóser, mediterrán','e.g. Indian-style, kosher, Mediterranean'))}" data-change="setFPref('wish',this.value)">
  <label for="fskill">Főzési gyakorlat</label><select id="fskill" data-change="setFPref('skill',this.value)">${PREF_SKILL.map(x=>`<option value="${x[0]}" ${p.skill===x[0]?'selected':''}>${esc(lbl(x))}</option>`).join('')}</select>
  <div class="grid2" style="gap:10px"><div><label for="fpeople">Hány főre főzöl</label><input id="fpeople" type="number" inputmode="numeric" min="1" max="8" value="${p.people}" data-change="setFPref('people',this.value)"></div>
  <div><label for="fmeals">Étkezés naponta</label><input id="fmeals" type="number" inputmode="numeric" min="1" max="6" value="${p.meals}" data-change="setFPref('meals',this.value)"></div></div>
  <label for="fcook">Főzés hetente (heti menü)</label><select id="fcook" data-change="setFPref('cook',this.value)">${[1,2,3,4].map(n=>`<option value="${n}" ${p.cook===n?'selected':''}>${n} ${L('alkalommal','times')}</option>`).join('')}</select><div class="hint">A heti menü ennyi főzésből ad főtt ételt minden napra – ugyanaz az étel több napon is előjöhet.</div>
  <label>Konyhai eszközeim</label><div class="hint" style="margin:-2px 0 6px">Jelöld be, ami van. Ha bármit bejelölsz, Claude csak ezekkel számol, és a többit nem használja.</div>${chips('eq',PREF_EQUIP)}
  <label for="fequip">Egyéb eszköz (nem kötelező)</label><input id="fequip" maxlength="300" value="${esc(p.equipment)}" placeholder="${esc(L('pl. wok, sous-vide, gofrisütő','e.g. wok, sous-vide, waffle maker'))}" data-change="setFPref('equipment',this.value)"></div>`}
function menuPrompt(kind,ex={}){
  const p=fprefs(),t=targets(),en=LANG==='en',lbl=x=>en?x[2]:x[1],td=today(),items=dayMeals(td),s=sumMeals(items);
  const mac=o=>`${fmt(o.kcal,0)} kcal, ${en?'protein':'fehérje'} ${fmt(o.p,0)} g, ${en?'carbs':'szénhidrát'} ${fmt(o.c,0)} g, ${en?'fat':'zsír'} ${fmt(o.f,0)} g, ${en?'fiber':'rost'} ${fmt(o.fib,0)} g`;
  const pick=(k,list)=>list.filter(x=>p[k].includes(x[0])).map(lbl).join(', ');
  const L2=(h,e)=>en?e:h,lines=[];
  lines.push(kind==='ideas'?L2('Menüjavaslat – receptötletek','Meal suggestion – recipe ideas'):kind==='rest'?L2('Menüjavaslat – mit egyek még ma?','Meal suggestion – what should I eat for the rest of today?'):L2('Menüjavaslat – heti menü (7 nap)','Meal suggestion – weekly menu (7 days)'));
  lines.push('');
  lines.push(t.kcal?L2('Napi keret: ','Daily target: ')+mac(t):L2('Napi keret: nincs megadva – kérdezz rá, mielőtt javasolsz.','Daily target: not set – ask me before suggesting.'));
  if(kind==='rest'){const now=new Date();
    lines.push(L2(`Ma (${td}, ${fmtTime(now)}) eddig: `,`Today (${td}, ${fmtTime(now)}) so far: `)+(items.length?mac(s):L2('még semmi','nothing yet')));
    if(items.length)lines.push(L2('Amit ma ettem: ','What I ate today: ')+items.slice(0,12).map(m=>m.name).join('; '));
    if(t.kcal)lines.push(L2('Még hátra: ','Remaining: ')+mac({kcal:Math.max(0,t.kcal-s.kcal),p:Math.max(0,t.p-s.p),c:Math.max(0,t.c-s.c),f:Math.max(0,t.f-s.f),fib:Math.max(0,t.fib-s.fib)}));
    if(ex.have)lines.push(L2('Ami kéznél van: ','What I have at hand: ')+ex.have);
    if(ex.where)lines.push(L2('Hol vagyok, mit tudok venni: ','Where I am / what I can buy: ')+ex.where);}
  if(kind!=='rest')lines.push(kind==='ideas'?L2('Hány főre: ','Servings for: ')+p.people:L2('Étkezés naponta: ','Meals per day: ')+p.meals+' · '+L2('hány főre: ','servings for: ')+p.people+' · '+L2('főzés hetente: ','cooking sessions per week: ')+p.cook);
  lines.push(L2('Étrend: ','Diet: ')+(pick('diet',PREF_DIET)||L2('nincs megkötés','no restrictions')));
  if(p.avoid)lines.push(L2('Kerülendő: ','Avoid: ')+p.avoid);
  const cuAll=kind==='rest'?[]:p.cuisine,cu=kind==='ideas'?cuAll:[...cuAll].sort(()=>Math.random()-.5).slice(0,2);
  const cuName=k=>lbl(PREF_CUISINE.find(x=>x[0]===k));
  if(cu.length)lines.push(L2('Konyha: ','Cuisine: ')+cu.map(cuName).join(', ')+(kind==='ideas'&&cu.length>1?L2(' – válogass vegyesen',' – mix them'):kind==='week'?L2(' – csak a főételekre vonatkozik'+(cu.length>1?'; a kettő alapanyagai fedjék át egymást':''),' – applies to the main dishes only'+(cu.length>1?'; the two should share ingredients':'')):''));
  if(p.style.length&&kind!=='rest')lines.push(L2('Stílus: ','Style: ')+pick('style',PREF_STYLE));
  if(p.wish)lines.push(L2('Egyéb kívánság: ','Other wishes: ')+p.wish);
  lines.push(L2('Főzési gyakorlat: ','Cooking level: ')+lbl(PREF_SKILL.find(x=>x[0]===p.skill)||PREF_SKILL[1]));
  if(p.eq.length){const no=PREF_EQUIP.filter(x=>!p.eq.includes(x[0])).map(lbl).join(', ');
    lines.push(L2('Konyhai eszközeim: ','My kitchen equipment: ')+pick('eq',PREF_EQUIP)+(p.equipment?', '+p.equipment:''));
    if(no)lines.push(L2('Nincs (ne használd): ','I don’t have (don’t use): ')+no);}
  else if(p.equipment)lines.push(L2('Eszközök: ','Equipment: ')+p.equipment);
  lines.push('');
  if(kind==='rest'){lines.push(L2('Javasolj 2–3 lehetőséget csak abból, ami kéznél van, vagy amit ott meg tudok venni (akár készen), legfeljebb 15 perc munkával, hogy a nap hátralévő keretébe és makróiba beleférjek. Ismert, egyszerű dolgokat írj.','Suggest 2–3 options using only what I have at hand or can buy there (ready-made is fine), with at most 15 minutes of work, so they fit the rest of today’s target and macros. Keep it simple and familiar.'));return lines.join('\n')}
  if(kind==='week'){if(!cu.length)lines.push(L2('Ne csak a hagyományos magyar konyhára építs (pl. pörkölt, töltött vagy székelykáposzta) – ismert, hétköznapi, modern ételek legyenek.','Don’t rely only on traditional Hungarian dishes – keep to familiar, everyday, modern food.'))}
  else lines.push(cu.length?L2('Legyen változatos, ne ismételd a legtipikusabb fogásokat.','Keep it varied; don’t repeat the most typical dishes.')
    :L2('Ne a hagyományos magyar konyhára építs (pl. pörkölt, főzelék, töltött vagy székelykáposzta) – legyen változatos, modern, nemzetközi konyha, hacsak külön nem kérem.','Don’t default to traditional Hungarian dishes – keep it varied, modern and international unless I ask otherwise.'));
  lines.push(L2('Alapanyagok: átlagos szupermarketben kapható hozzávalókkal dolgozz. Ha egy hagyományos hozzávaló nehezen beszerezhető, írd oda az eredetit, és mellé a helyettesítőt – pl. „főzőbanán (helyette: édesburgonya)”. A régióból inkább olyan recepteket válassz, amelyek így is hitelesek maradnak.','Ingredients: use what an ordinary supermarket stocks. If a traditional ingredient is hard to find, name the original and the substitute next to it – e.g. “plantain (substitute: sweet potato)”. Prefer recipes from the region that stay authentic this way.'));
  {const R=cu.map(k=>CUISINE_RULES[k]).filter(Boolean),ix=en?1:0,uniq=a=>[...new Set(a)];
   const no=uniq(R.flatMap(r=>(r.no||[]).map(x=>x[ix]))),sub=uniq(R.flatMap(r=>(r.sub||[]).map(x=>en?`${x[2]} → ${x[3]}`:`${x[0]} → ${x[1]}`))),ok=uniq(R.flatMap(r=>(r.ok||[]).map(x=>x[ix]))).slice(0,20);
   if(no.length)lines.push(L2('– Ne használd: ','– Don’t use: ')+no.join(', '));
   if(sub.length)lines.push(L2('– Helyettesítővel (az eredetit is írd oda): ','– With a substitute (name the original too): ')+sub.join('; '));
   if(ok.length)lines.push(L2('– Nyugodtan használható (példák): ','– Fine to use (examples): ')+ok.join(', '));}
  if(kind==='week'){const pd=[];for(let i=0;i<7;i++){const d=ymd(new Date(Date.now()+i*DAY)),tp=plans()[d]&&S.templates.find(t=>t.id===plans()[d]);if(tp){const x=pYmd(d);pd.push(`${en?x.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):x.toLocaleDateString('hu-HU',{weekday:'short'})+' '+(x.getMonth()+1)+'.'+x.getDate()+'.'} (${en?T(tp.name):tp.name})`)}}
    if(pd.length)lines.push(L2('Tervezett edzésnapok: ','Planned training days: ')+pd.join(', ')+L2(' – ezeken a napokon az edzés utáni étkezés legyen a nap fő szénhidrátforrása.',' – on these days make the post-workout meal the main carb source of the day.'));
    lines.push(L2('Szabályok a heti menühöz:','Rules for the weekly menu:'));
    lines.push(L2(`– Legfeljebb ${p.cook} főzési alkalom a héten, alkalmanként 1–2 főétel nagyobb adagban. Ezekből minden napra jusson főtt étel; ugyanaz az étel több napon, akár egy nap kétszer is előjöhet – ez szándékos.`,`– At most ${p.cook} cooking session${p.cook>1?'s':''} a week, 1–2 main dishes in bigger batches each time. Every day should get a cooked meal from these; the same dish may repeat on several days, even twice a day – that’s intended.`));
    lines.push(L2('– Reggeli 2–3 egyszerű, ismert lehetőségből forogjon (pl. zabkása, rántotta, joghurt vagy túró gyümölccsel), legfeljebb 5–10 perc munkával.','– Breakfast rotates between 2–3 simple, familiar options (e.g. porridge, scrambled eggs, yoghurt or quark with fruit), 5–10 minutes of work at most.'));
    lines.push(L2('– Snack főzés nélkül, ismert dolgokból (pl. alma dióval, túró, skyr, fehérjeturmix, zöldség hummusszal).','– Snacks need no cooking and use familiar foods (e.g. apple with walnuts, quark, skyr, protein shake, vegetables with hummus).'));
    lines.push(L2('– Ismert, hétköznapi ételek, kevés hozzávalóval, speciális technika nélkül. Ha valami ismeretlenebb, adj mellé ismerős alternatívát.','– Familiar everyday dishes with few ingredients and no special techniques. If something is less familiar, offer a familiar alternative.'));
    lines.push(L2('– A válasz: heti áttekintő táblázat (nap × étkezés, kcal és fehérje), főzési terv (melyik nap mit főzök, hány adagot, mi meddig áll el), a főételek receptje, a többi röviden, végül bevásárlólista kategóriák szerint.','– Reply with: a weekly overview table (day × meal, kcal and protein), a cooking plan (which day I cook what, how many portions, how long each keeps), recipes for the main dishes, the rest briefly, and finally a shopping list by category.'));}
  if(p.style.includes('handsoff'))lines.push(L2('Otthagyhatós: kevés aktív munka (befűszerezem, összekeverem, felteszem vagy beteszem a sütőbe, és magától elkészül) – a teljes idő lehet hosszabb. Mindegyiknél add meg az aktív és a teljes időt.','Hands-off: little active work (season, mix, put on the hob or in the oven and it cooks itself) – total time can be longer. Give active and total time for each.'));
  lines.push(kind==='ideas'?L2('Adj 10 receptötletet: 5 melegen és 5 hidegen fogyasztható ételt, legyen köztük gyors, akár főzés nélkül elkészíthető is; és még 3 desszertet (fehérjebarát, ismert alapanyagokból, pl. túró, joghurt, gyümölcs, zab). Mindegyikhez: rövid leírás, fő hozzávalók, aktív és teljes idő, becsült kcal és makrók adagonként. Részletes receptet csak akkor írj, ha kérem.','Give me 10 recipe ideas: 5 served warm and 5 served cold, including some quick or no-cook ones; plus 3 desserts (protein-friendly, from familiar ingredients such as quark, yoghurt, fruit, oats). For each: a short description, main ingredients, active and total time, estimated kcal and macros per serving. Only write a full recipe if I ask.'):L2('Állíts össze egy 7 napos menüt a fenti szabályok szerint.','Put together a 7-day menu following the rules above.'));
  return lines.join('\n');
}
/* „Mit egyek még ma?”: csak abból javasol, ami kéznél van, vagy ott megvehető */
async function askRest(){if(!targets().kcal){toast('Előbb töltsd ki a profilodat');return}
  const r=await form('Mit egyek még ma?',[{id:'have',label:'Mi van kéznél?',type:'textarea',rows:3,placeholder:L('pl. tojás, túró, fagyasztott brokkoli, rizs, tonhalkonzerv','e.g. eggs, quark, frozen broccoli, rice, tinned tuna')},{id:'where',label:'Hol vagy, mit tudsz venni? (nem kötelező)',placeholder:L('pl. munkahely, Lidl a közelben','e.g. at work, Lidl nearby')}],{ok:'Tovább',intro:'Legalább az egyiket töltsd ki: Claude csak ebből javasol, a mai maradék kereted szerint.'});
  if(!r)return;if(!r.have&&!r.where){toast('Írd be, mi van kéznél, vagy hol vagy');return}askMenu('rest',r)}
function askMenu(kind,ex){if(!targets().kcal){toast('Előbb töltsd ki a profilodat');return}const txt=menuPrompt(kind,ex),url=S.settings.claudeUrl;
  openModal(`<h2>${kind==='ideas'?'Receptötletek':kind==='rest'?'Mit egyek még ma?':'Heti menü'}</h2>
  <div class="hint" style="margin-top:-4px">Ezt a kérést másolja ki az app a Claude-projektedbe. Beillesztés előtt átírhatod.</div>
  <textarea id="menuText" rows="12" style="width:100%;margin-top:8px;font:13px/1.45 var(--mono)">${esc(txt)}</textarea>
  ${url?'':`<div class="hint">Add meg a Claude-projekt linkjét a Beállítások → Étkezés részben, és a gomb meg is nyitja.</div>`}
  <div class="row" style="margin-top:12px"><button class="btn" data-click="closeModal()">Mégse</button><span class="sp"></span><button class="btn p" data-click="copyMenu()">${I(url?'external-link':'copy','sm')} ${url?'Másolás és Claude':'Másolás'}</button></div>`)}
function copyMenu(){const ta=$('#menuText'),url=S.settings.claudeUrl;
  // a másolást és a megnyitást ugyanabban a koppintásban indítjuk, különben a böngésző letilthatja
  try{navigator.clipboard.writeText(ta.value).then(()=>toast('Kérés a vágólapon – illeszd be a Claude-ba'),()=>{ta.focus();ta.select();toast('Jelöld ki és másold ki kézzel')})}catch(e){ta.focus();ta.select()}
  if(url){try{window.open(url,'_blank','noopener')}catch(e){}}}
async function copyInstr(){const ta=$('#instrText');try{await navigator.clipboard.writeText(ta.value);toast('Utasítás a vágólapon')}catch(e){ta.focus();ta.select();toast('Jelöld ki és másold ki kézzel')}}
function whyClaude(){openModal(`<h2>${L('Mire jó a Claude-projekt?','What is the Claude project for?')}</h2>
  <p class="small">${L('A kalóriaszámítás a legtöbb ember számára ott akad el, hogy minden ételt tételesen ki kell keresni egy adatbázisból. Egy mesterséges intelligenciával ez sokkal egyszerűbb: lefényképezed a tányért, elmondod vagy leírod, mit ettél, és Claude kiszámolja a kalóriát, a makrókat és a rostot – a saját receptjeidből is.','For most people, calorie counting stalls because every food has to be looked up in a database. With AI it’s much simpler: photograph your plate, say or type what you ate, and Claude works out the calories, macros and fibre – from your own recipes too.')}</p>
  <p class="small">${L('Az eredményt egy kódblokkban adja vissza, amit az Olupan Étkezés oldalán egy koppintással beillesztesz. A projekt ismeri a céljaidat és az étkezési preferenciáidat, ezért menü- és receptjavaslatot is tud adni. A saját Claude-fiókodat használod; az Olupanba csak a számok kerülnek.','It returns the result in a code block that you paste on Olupan’s Food page with one tap. The project knows your targets and food preferences, so it can suggest menus and recipes too. You use your own Claude account; only the numbers go into Olupan.')}</p>
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">${L('Értem','Got it')}</button></div>`)}
function foodHelp(){if(!targets().kcal){toast('Előbb töltsd ki a profilodat');return}
  openModal(`<h2>Étkezésnapló Claude-dal</h2>
  <p class="small">Lefényképezed vagy elmondod, mit ettél, Claude kiszámolja a kalóriát, a makrókat és a rostot, és egy kódblokkban adja vissza. Ezt itt egy gombnyomással átveszed. Az Olupanba csak a számok kerülnek, a fotó csak a Claude-ba megy.</p>
  <h3 style="margin-top:14px">1. A projekt létrehozása (egyszer)</h3>
  <ol class="small" style="padding-left:20px;line-height:1.6">
  <li>${L('Nyisd meg a <b>claude.ai</b> oldalt <b>ugyanabban a böngészőben</b>, amelyben az Olupant használod – ne a Claude appot, mert ott nincs kimásolható webcím. Ha a telefon mégis az appot nyitja meg, a linket hosszan nyomva válaszd a megnyitást a böngészőben.','Open <b>claude.ai</b> <b>in the same browser</b> you use Olupan in – not the Claude app, because it has no web address you can copy. If your phone opens the app anyway, long-press the link and choose to open it in the browser.')}</li>
  <li>Bal oldali menü → <b>Projektek</b> → <b>Új projekt</b>. Név: pl. <i>Étkezésnapló</i>.</li>
  <li>A projekt oldalán keresd az <b>Utasítások</b> (Instructions / „Projekt utasításainak beállítása”) részt, és illeszd be a lenti szöveget. A <b>Másolás</b> gomb a vágólapra teszi.</li>
  <li>A projekt Context (fájlok) részéhez add hozzá a receptfájlt, amelyet a lenti Receptfájl letöltése gombbal kapsz. Ebbe kerülnek a saját receptjeid: elég a hozzávalókat felsorolni, a kalóriát, a makrókat és a rostot Claude számolja ki.</li>
  <li>Mentsd. A projekt ezután a telefonos Claude appban is megjelenik a Projektek között.</li>
  <li>Másold ki a projekt címét a böngésző címsorából (<code class="mono">https://claude.ai/project/…</code>), és illeszd be a Beállítások → Étkezés → <b>Claude-projekt linkje</b> mezőbe. Ekkor az Étkezés fülön megjelenik a <b>Claude</b> gomb.</li></ol>
  <textarea id="instrText" rows="9" readonly style="font-size:13px">${esc(claudeInstr())}</textarea>
  <div class="row end" style="margin-top:8px;gap:8px"><button class="btn sm" data-click="downloadRecipes()">${I('download','sm')} Receptfájl letöltése</button><button class="btn p sm" data-click="copyInstr()">${I('copy','sm')} Másolás</button></div>
  <div class="hint">Az utasítás tartalmazza a mostani javasolt napi bevitelt is. Ha a Beállításokban módosítod a profilodat, másold ki és illeszd be újra.</div>
  <h3 style="margin-top:14px">2. Használat étkezésenként</h3>
  <ol class="small" style="padding-left:20px;line-height:1.6">
  <li>Claude app → <b>Projektek</b> → <b>Étkezésnapló</b> → új beszélgetés (vagy folytasd a napit).</li>
  <li><b>Fotó:</b> a + vagy kamera ikonnal készíts képet a tányérról. <b>Szöveg vagy hang:</b> írd be vagy diktáld, pl. „reggelire 60 g zabpehely 2 dl tejjel és egy banán”.</li>
  <li>Ha Claude visszakérdez az adagra, válaszolj. A válasz végén lévő kódblokk sarkában lévő <b>másolás</b> ikonnal másold ki.</li>
  <li>Olupan → <b>Étkezés</b> → <b>Beillesztés Claude-ból</b>. Mentés előtt megmutatja a tételeket; a már rögzítettekre és a korábbi napra szólókra rákérdez.</li></ol>
  <p class="hint">Saját recept: írd azt, hogy „reggelire 1 adag zabkása”, és Claude a receptfájl hozzávalóiból számol. Új receptet a beszélgetésben is megadhatsz; ha szeretnéd, hogy minden beszélgetésben elérhető legyen, kérd el a frissített receptfájlt, és cseréld le vele a projektben lévőt.</p>
  <p class="hint">Tipp: grammban vagy darabban megadott adaggal sokkal pontosabb a becslés, mint fotóval. A rejtett olaj, a szósz és az adagméret miatt a fotós becslés könnyen 20–30%-ot téved. Ha a vágólapról nem sikerül a beolvasás, a Beillesztés ablakba kézzel is bemásolhatod.</p>
  <div class="row end"><button class="btn p" data-click="closeModal()">Rendben</button></div>`);
}

/* ===== Testadatok ===== */
const BODY_X=[['chest','Mellkas','bch'],['arm','Felkar','bar'],['hip','Csípő','bhi'],['thigh','Comb','bth']];
const hasMeas=b=>!!b&&(b.weight!=null||b.fat!=null||b.waist!=null||BODY_X.some(([k])=>b[k]!=null));
/* Lépések átvétele vágólapról. Soronként: dátum + lépésszám, tetszőleges elválasztóval.
   Elfogadott dátum: 2026-11-06, 2026. 11. 06., 2026/11/06. Szám: 8432, 8 432, 8.432, 8,432, 8432,0 */
function parseStepNum(t){t=t.replace(/[\s  ']/g,'').replace(/[^\d.,]+$/,'');if(!/^\d/.test(t))return null;if(/^\d{1,3}([.,]\d{3})+$/.test(t))t=t.replace(/[.,]/g,'');else t=t.replace(',','.');const v=parseFloat(t);return isFinite(v)?Math.round(v):null}
const MONTHS={jan:1,febr:2,feb:2,'márc':3,marc:3,mar:3,'ápr':4,apr:4,'máj':5,maj:5,may:5,'jún':6,jun:6,'júl':7,jul:7,aug:8,szept:9,szep:9,sep:9,sept:9,okt:10,oct:10,nov:11,dec:12};
function monthNum(t){t=t.toLowerCase().replace(/\.$/,'');if(/^\d+$/.test(t))return +t;for(const k of Object.keys(MONTHS).sort((a,b)=>b.length-a.length))if(t.startsWith(k))return MONTHS[k];return null}
/* Dátum: 2026-11-06 | 2026. 11. 06. | 2026/11/06 | 2026. nov. 6. | 2026-11-06T00:00:00+01:00 | 2026. nov. 6. 0:00
   Utána elválasztó (; , tab |), majd a lépésszám. */
const STEP_LINE=/(\d{4})\s*[-./]\s*([0-9]{1,2}|[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]{3,10}\.?)\s*[-./]?\s*(\d{1,2})\.?(?:[T\s]+\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?\s*(?:Z|[+-]\d{2}:?\d{2})?)?\s*[;,\t|]\s*(.+)$/;
function parseSteps(text){
  const out={};
  for(const line of String(text||'').split(/\r?\n/)){
    const m=STEP_LINE.exec(line.trim());if(!m)continue;
    const mo=monthNum(m[2]);if(!mo||mo>12)continue;
    const d=`${m[1]}-${z2(mo)}-${z2(+m[3])}`,dt=pYmd(d);if(!DATE_RE.test(d)||dt.getMonth()!==mo-1||dt>new Date())continue;
    const v=parseStepNum(m[4]);if(v==null||v<=0||v>200000)continue; // 0: kitöltött hiányzó nap – kihagyjuk
   out[d]=(out[d]||0)+v; // ugyanaz a nap többször: összeadjuk
  }
  return out;
}
/* ===== Egészség app adatai: lépés, testsúly, testzsír – vágólapról vagy fájlból =====
   Soronként: típus;dátum;érték   (típus: lepes | suly | zsir – ékezettel, angolul is)
   A típus nélküli „dátum;érték” sor lépésszámnak számít (a korábbi, 30 napos parancs kimenete). */
const parseDec=t=>{t=String(t??'').replace(/[\s  ]/g,'').replace(/[^\d.,]+$/,'').replace(/^[^\d]+/,'');if(!t)return null;const v=parseFloat(t.replace(',','.'));return isFinite(v)?v:null};
function healthKind(t){t=deacc(t).trim();if(/^(lep|step)/.test(t))return'steps';if(/^(suly|testsuly|testtom|weight|body ?mass)/.test(t))return'weight';if(/^(zsir|testzsir|fat|body ?fat)/.test(t))return'fat';return null}
function parseHealth(text){
  const out={steps:{},weight:{},fat:{}},seen=new Set();let lines=0;
  for(const raw of String(text||'').split(/\r?\n/)){
    const key=raw.trim().replace(/\s+/g,' ');if(!key||seen.has(key))continue;seen.add(key); // pontosan azonos sor csak egyszer számít
    const parts=raw.trim().split(/[;\t|]/).map(x=>x.trim());while(parts.length&&parts[parts.length-1]==='')parts.pop();if(!parts.length)continue;
    let kind=healthKind(parts[0]),rest=kind?parts.slice(1):parts;if(!kind){if(!/^\d{4}/.test(parts[0]))continue;kind='steps'}
    if(rest.length<2){const m=/^(.+?)[,]\s*(\S+)$/.exec(rest[0]||'');if(!m)continue;rest=[m[1],m[2]]} // „dátum,érték”
    const d=parseDateStr(rest[0]);if(!d)continue;const valTxt=rest.slice(1).join(' ');
    if(kind==='steps'){const v=parseStepNum(valTxt);if(v==null||v<=0||v>200000)continue;out.steps[d]=(out.steps[d]||0)+v}
    else if(kind==='weight'){let v=parseDec(valTxt);if(v==null)continue;if(/lb/i.test(valTxt))v*=0.45359237;v=Math.round(v*10)/10;if(v<20||v>400)continue;if(out.weight[d]==null)out.weight[d]=v} // napon belül az első (reggeli) mérés
    else{let v=parseDec(valTxt);if(v==null)continue;if(v>0&&v<=1)v*=100;/* törtként (0,215) érkezett */v=Math.round(v*10)/10;if(v<2||v>70)continue;if(out.fat[d]==null)out.fat[d]=v}
    lines++;
  }
  return out;
}
async function applyHealth(text,source){
  const H=parseHealth(text),n=k=>Object.keys(H[k]).length;
  if(!n('steps')&&!n('weight')&&!n('fat'))return false;
  const cur=d=>S.body.find(b=>b.date===d);
  let add=0,same=0,diff=0;const tally=(k,key)=>{for(const[d,v]of Object.entries(H[k])){const c=cur(d)?.[key];if(c==null)add++;else if(Math.abs(c-v)<1e-9)same++;else diff++}};
  tally('steps','steps');tally('weight','weight');tally('fat','fat');
  if(!add&&!diff){toast('Nincs új adat – minden érték szerepel már');return true}
  const all=[...new Set([...Object.keys(H.steps),...Object.keys(H.weight),...Object.keys(H.fat)])].sort();
  const intro=`${source}: <b>${n('steps')}</b> nap lépésszám, <b>${n('weight')}</b> testsúly- és <b>${n('fat')}</b> testzsírmérés (${pYmd(all[0]).toLocaleDateString(LOC(),{year:'numeric',month:'short',day:'numeric'})} – ${pYmd(all[all.length-1]).toLocaleDateString(LOC(),{year:'numeric',month:'short',day:'numeric'})}).<br>${add} új érték${diff?`, ${diff} eltér a már rögzítettől`:''}${same?`, ${same} már szerepel`:''}.`;
  let over=true;
  if(diff){const r=await form('Egészség adatok átvétele',[{id:'mode',label:'Eltérő meglévő értékeknél',type:'select',value:'over',options:[['over','az Egészség app értéke legyen (felülírás)'],['keep','a már rögzített érték maradjon']]}],{ok:'Mentés',intro});if(!r)return true;over=r.mode==='over'}
  else if(!await ask(intro,{title:'Egészség adatok átvétele',ok:'Mentés'}))return true;
  let saved=0;
  const put=(k,key)=>{for(const[d,v]of Object.entries(H[k])){let b=cur(d);if(b&&b[key]!=null&&!over)continue;if(b&&b[key]===v)continue;if(!b){b={date:d};S.body.push(b)}b[key]=v;saved++}};
  put('steps','steps');put('weight','weight');put('fat','fat');
  save();render();toast(`${saved} érték mentve`);return true;
}
async function pasteSteps(){
  let text=null;try{if(navigator.clipboard&&navigator.clipboard.readText)text=await navigator.clipboard.readText()}catch(e){text=null}
  if(await applyHealth(text,'Vágólap'))return;
  const r=await form('Egészség adatok beillesztése',[{id:'t',label:'Parancs kimenete',type:'textarea',placeholder:'lepes;2026-11-05;9120\nsuly;2026-11-05 07:10;84,2\nzsir;2026-11-05 07:10;21,4',hint:'Nyomd hosszan a mezőt, majd Beillesztés. Hosszabb időszakhoz használd a Fájl gombot.'}],{ok:'Feldolgozás',intro:text?'A vágólap tartalmában nem találtam felismerhető sort.':''});
  if(!r)return;if(!await applyHealth(r.t,'Beillesztett szöveg'))toast('Nem találtam felismerhető sort');
}
function openHealthFile(){$('#impHealth').click()}
async function importHealthFile(inp){const f=inp.files[0];inp.value='';if(!f)return;let t;try{if(f.size>20e6)throw 0;t=await f.text()}catch(e){toast('A fájl nem olvasható');return}
  if(!await applyHealth(t,esc(f.name).slice(0,60)))toast('A fájlban nem találtam lépés-, súly- vagy testzsír-sort')}
function stepsHelp(){
  openModal(`<h2>Egészség app adatai iPhone-ról</h2>
  <p class="small">Egy <b>Parancsok</b>-parancs kiírja a lépésszámot, a testsúlyt és a testzsír-százalékot egy szövegfájlba; itt a <b>Fájl</b> gombbal beolvasod. A fájlnak nincs méretkorlátja, így akár több év is átjön (a vágólap kb. 200 napnál elakad). Az adat nem hagyja el a telefont.</p>
  <div class="stat small mono" style="line-height:1.7;margin-bottom:12px">Egészségügyi minták keresése (Steps)<br>Megismétlés … minden elemével<br>&nbsp;&nbsp;↳ Szöveg: lepes;Kezdési dátum;Elem ismétlése<br>&nbsp;&nbsp;↳ Hozzáadás változóhoz: Egeszseg<br>Ismétlés vége<br>… ugyanez Testtömeg (suly) és Testzsír (zsir) …<br>A(z) Egeszseg egyesítése Új sorok elválasztóval<br>Név beállítása: egeszseg.txt<br>Fájl mentése</div>
  <p class="small"><b>Új művelet:</b> a szerkesztő alján lévő <b>Keresés</b> mezőbe írd a nevét, koppints rá – a parancs <b>végére</b> kerül; a <b>nevénél</b> fogva húzható a helyére.</p>
  <ol class="small" style="padding-left:20px;line-height:1.6">
  <li><b>Lépések.</b> <i>Egészségügyi minták keresése</i>: Típus <b>Steps</b>, Kezdési dátum <b>benne van ebben: előző 365 nap</b> (első alkalommal akár több év), Csoportosítás szempontja: <b>Nap</b>, Rendezés: <b>Kezdési dátum, legrégebbi elöl</b>, Korlát: ki.</li>
  <li><i>Ismétlés mindegyikkel</i>, a ciklusba (a <i>Megismétlés…</i> és az <i>Ismétlés vége</i> közé) két művelet:
    <ol type="a" style="padding-left:18px"><li><b>Szöveg</b>: írd be: <code class="mono">lepes;</code> → <b>Elem ismétlése</b> változó → koppints rá → <b>Kezdési dátum</b> → <code class="mono">;</code> → <b>Elem ismétlése</b> (tulajdonság nélkül).</li>
    <li><b>Hozzáadás változóhoz</b> (Add to Variable): a Szöveget add hozzá egy új változóhoz, neve: <code class="mono">Egeszseg</code>.</li></ol></li>
  <li><b>Testsúly.</b> Újra <i>Egészségügyi minták keresése</i>: Típus <b>Testtömeg</b> (Body Mass), ugyanaz a dátumszűrő, Mértékegység: <b>kg</b>, Csoportosítás: <b>nincs</b>, Rendezés: legrégebbi elöl. Utána ugyanaz a ciklus, csak a szöveg eleje <code class="mono">suly;</code>, és ugyanahhoz az <code class="mono">Egeszseg</code> változóhoz add hozzá.</li>
  <li><b>Testzsír.</b> Ugyanígy, Típus <b>Testzsír-százalék</b> (Body Fat Percentage), a szöveg eleje <code class="mono">zsir;</code>.</li>
  <li>A ciklusok után: <b>Szöveg egyesítése</b> → bemenet: <b>Egeszseg</b> változó, elválasztó: <b>Új sorok</b>.</li>
  <li><b>Név beállítása</b> (Set Name) → az Egyesített szöveg neve: <code class="mono">egeszseg.txt</code></li>
  <li><b>Fontos:</b> a <b>Szöveg egyesítése</b>, a <b>Név beállítása</b> és a <b>Fájl mentése</b> a legutolsó <i>Ismétlés vége</i> <b>után</b> álljon, ne a cikluson belül – különben a teljes tartalom minden körben újra kiíródik (az app az azonos sorokat egyszer veszi figyelembe, de a fájl feleslegesen nagy lesz).</li>
  <li><b>Fájl mentése</b> (Save File) → pl. iCloud Drive / Shortcuts mappa; „Felülírás, ha létezik”: be. Ha a „Kérdezze meg, hová mentse” be van kapcsolva, minden futtatáskor választhatsz helyet.</li></ol>
  <p class="small">Futtatás után: Olupan → Test → <b>Fájl</b> → válaszd ki az <code class="mono">egeszseg.txt</code>-t. Mentés előtt megmutatja, hány új és hány eltérő érték van; eltérésnél választhatsz, melyik maradjon. Egy napon több mérésnél az elsőt (reggelit) veszi.</p>
  <p class="small"><b>Csak az utolsó ~30 nap jön át?</b> Az iOS adattípusonként korlátozhatja, mennyi régi adatot láthat a Parancsok app. Nézd meg: <b>Beállítások → Adatvédelem és biztonság → Egészség → Parancsok</b>, és minden használt típusnál (Lépések, Testtömeg, Testzsír) legyen engedélyezve a <b>teljes</b> előzmény. Ha a Lépések 30 napra van állítva, a Parancsok a régebbi napokat egyszerűen nem kapja meg, hiba nélkül.</p>
  <p class="hint">Napi frissítéshez elég a dátumszűrőt „előző 30 nap”-ra állítani – az újraolvasás nem duplikál. A korábbi, csak lépésszámos (vágólapos) parancsod is működik tovább a Beillesztés gombbal. A testzsírt az app akkor is helyesen kezeli, ha a parancs törtként (0,215) adja ki. A műveletnevek iOS-verziónként kicsit eltérhetnek.</p>
  <div class="row end"><button class="btn p" data-click="closeModal()">Rendben</button></div>`);
}

const bodySorted=()=>[...S.body].sort((a,b)=>a.date<b.date?-1:1);
function series(k){return bodySorted().filter(b=>b[k]!=null).map(b=>({x:pYmd(b.date).getTime(),y:b[k]}))}
function deltaN(s,n){if(s.length<2)return null;const l=s[s.length-1],t=l.x-n*DAY;let p=null;for(const q of s)if(q.x<=t)p=q;return p?l.y-p.y:null}
function avgLast(s,n){if(!s.length)return null;const l=s[s.length-1].x,a=s.filter(p=>p.x>l-n*DAY);return a.reduce((x,p)=>x+p.y,0)/a.length}
function movAvg(s,n=7){return s.map(p=>{const a=s.filter(q=>q.x<=p.x&&q.x>p.x-n*DAY);return{x:p.x,y:a.reduce((x,q)=>x+q.y,0)/a.length}})}
function slopeWeek(s){if(s.length<3||s[s.length-1].x-s[0].x<6*DAY)return null;const n=s.length,xs=s.map(p=>p.x/DAY),mx=xs.reduce((a,b)=>a+b)/n,my=s.reduce((a,p)=>a+p.y,0)/n;let nu=0,de=0;s.forEach((p,i)=>{nu+=(xs[i]-mx)*(p.y-my);de+=(xs[i]-mx)**2});return de?nu/de*7:null}
function lastDays(s,n){if(!s.length)return s;const l=s[s.length-1].x;return s.filter(p=>p.x>l-n*DAY)}
function stat(l,v,cls=''){return `<div class="stat ${cls}"><b>${v==null||v===''?'–':v}</b><span>${l}</span></div>`}
const dcls=v=>v==null||Math.abs(v)<1e-9?'':v>0?'pos':'neg';
function trendStat(label,s,unit,d=2){const v=slopeWeek(s);return stat(label+' · '+unit,v==null?null:sgn(v,d),dcls(v))}
function vBody(){
  const e=S.body.find(b=>b.date===bodyDate)||{},sorted=bodySorted(),lastW=[...sorted].reverse().find(b=>b.weight!=null),lastF=[...sorted].reverse().find(b=>b.fat!=null);
  const ws=series('weight'),fs=series('fat'),d30=deltaN(ws,30);
  let h=`<div class="card"><h2>Mérés rögzítése</h2><label for="bd">Dátum</label><input type="date" id="bd" value="${bodyDate}" max="${today()}" data-change="setBodyDate(this.value)">
  <div class="grid3"><div><label for="bw">Súly (kg)</label><input id="bw" type="text" inputmode="decimal" autocomplete="off" value="${hu(e.weight)}" placeholder="${lastW?hu(lastW.weight):''}"></div>
  <div><label for="bf">Testzsír (%)</label><input id="bf" type="text" inputmode="decimal" autocomplete="off" value="${hu(e.fat)}" placeholder="${lastF?hu(lastF.fat):''}"></div>
  <div><label for="bwa">Derék (cm)</label><input id="bwa" type="text" inputmode="decimal" autocomplete="off" value="${hu(e.waist)}"></div></div>
  <details class="morex" ${BODY_X.some(([k])=>e[k]!=null)?'open':''}><summary>További testméretek (cm)</summary><div class="grid2" style="margin-top:4px">${BODY_X.map(([k,l,id])=>{const lastX=[...sorted].reverse().find(b=>b[k]!=null);return `<div><label for="${id}">${l}</label><input id="${id}" type="text" inputmode="decimal" autocomplete="off" value="${hu(e[k])}" placeholder="${lastX?hu(lastX[k]):''}"></div>`}).join('')}</div></details>
  <label for="bst">Lépésszám</label><input id="bst" type="number" step="1" min="0" inputmode="numeric" value="${e.steps??''}" placeholder="pl. 8500">
  <div class="row" style="margin-top:14px">${e.date?`<button class="btn d" data-click="delBody('${e.date}')">${I('trash-2','sm')} Törlés</button>`:''}<span class="sp"></span><button class="btn p" data-click="saveBody()">${I('save','sm')} ${e.date?'Frissítés':'Mentés'}</button></div></div>
  ${IS_IOS?`  <div class="card"><div class="row" style="flex-wrap:nowrap"><h2 style="flex:1;margin:0">Egészség app</h2><button class="btn sm ico" data-click="stepsHelp()" aria-label="Súgó: lépések átvétele">${I('circle-help','sm')}</button></div>
  <div class="row" style="margin-top:10px;flex-wrap:nowrap"><button class="btn sm p" style="flex:1" data-click="openHealthFile()">${I('folder-open','sm')} Fájl</button><button class="btn sm" style="flex:1" data-click="pasteSteps()">${I('clipboard-paste','sm')} Beillesztés</button><input type="file" id="impHealth" accept=".txt,.csv,text/plain,text/csv" style="display:none" data-change="importHealthFile(this)"></div>
  <div class="hint" style="margin:6px 0 10px">Lépésszám, testsúly és testzsír az iPhone Egészség appjából, Parancsok segítségével (leírás a ? gomb alatt) – vagy rögzítsd kézzel fent.</div>
</div>`:''}
  <h3 style="margin:16px 2px 10px">Testsúly</h3>
  <div class="grid3" style="margin-bottom:8px">${stat('Utolsó súly',lastW?fmtF(lastW.weight)+' kg':null)}${stat('7 napos átlag',ws.length?fmtF(avgLast(ws,7))+' kg':null)}${stat('Δ 30 nap',d30==null?null:sgn(d30)+' kg',dcls(d30))}</div>
  <div class="grid3" style="margin-bottom:12px">${trendStat('Trend 14 nap',lastDays(ws,14),'kg/hét')}${trendStat('Trend 30 nap',lastDays(ws,30),'kg/hét')}${trendStat('Trend 90 nap',lastDays(ws,90),'kg/hét')}</div>
  <h3 style="margin:16px 2px 10px">Testzsír</h3>
  <div class="grid3" style="margin-bottom:12px">${stat('Utolsó testzsír',lastF?fmt(lastF.fat)+' %':null)}${trendStat('Trend 30 nap',lastDays(fs,30),'%p/hét')}${trendStat('Trend 90 nap',lastDays(fs,90),'%p/hét')}</div>
  ${(()=>{const xs=[['waist','Derék'],...BODY_X.map(([k,l])=>[k,l])].map(([k,l])=>{const ser=series(k);if(!ser.length)return'';const d90=deltaN(ser,90);return stat(l,fmt(ser[ser.length-1].y)+' cm'+(d90!=null&&Math.abs(d90)>=.1?` · ${sgn(d90)}`:''))}).filter(Boolean);return xs.length?`<h3 style="margin:16px 2px 10px">Testméretek</h3><div class="grid3" style="margin-bottom:12px">${xs.join('')}</div>`:''})()}
  <h3 style="margin:16px 2px 10px">Lépésszám</h3>
  <div class="grid3" style="margin-bottom:12px">${(()=>{const ss=series('steps'),t=S.body.find(b=>b.date===today())?.steps,g=S.settings.stepGoal;return stat('Ma'+(g?` · cél ${fmtShort(g)}`:''),t!=null?fmt(t,0):null)+stat('7 napos átlag',ss.length?fmt(avgLast(ss,7),0):null)+stat('30 napos átlag',ss.length?fmt(avgLast(ss,30),0):null)})()}</div>
  <div class="hint" style="margin:-4px 2px 14px">A trend a mérésekre illesztett lineáris regresszió meredeksége heti változásra vetítve – kevésbé érzékeny a napi ingadozásra, mint két mérés különbsége.</div>`;
  const rows=[];let pw=null;for(const b of sorted){rows.push({b,d:b.weight!=null&&pw!=null?b.weight-pw:null});if(b.weight!=null)pw=b.weight}
  h+=`<div class="card"><h2>Előzmények</h2>${rows.length?`<table class="tbl"><tr><th>Dátum</th><th>Súly</th><th>Δ</th><th>Zsír</th><th>Derék</th><th>Lépés</th></tr>
  ${rows.reverse().slice(0,90).map(({b,d})=>`<tr class="click" data-click="editBodyRow('${b.date}')"><td>${fmtDate(b.date)}</td><td>${fmtF(b.weight)}</td><td class="mut">${d==null?'':sgn(d)}</td><td>${fmt(b.fat)}</td><td>${fmt(b.waist)}</td><td>${b.steps!=null?fmtShort(b.steps):'–'}</td></tr>`).join('')}</table>`:'<div class="empty">Még nincs mérés.</div>'}</div>`;
  return h;
}
function saveBody(){
  const d=$('#bd').value;if(!d)return;
  const num=id=>{const v=$(id).value.replace(',','.');return v===''?null:+v};
  const w=num('#bw'),f=num('#bf'),wa=num('#bwa'),st=num('#bst'),xs=BODY_X.map(([k,,id])=>[k,$('#'+id)?num('#'+id):null]);
  if(w==null&&f==null&&wa==null&&st==null&&xs.every(x=>x[1]==null)){toast('Adj meg legalább egy értéket');return}
  if(xs.some(([,v])=>v!=null&&!(v>=10&&v<=250))){toast('A testméretek 10–250 cm között legyenek');return}
  if(st!=null&&!(st>=0&&st<=200000)){toast('A lépésszám 0–200 000 között legyen');return}
  if(w!=null&&!(w>=20&&w<=400)){toast('A súly 20–400 kg között legyen');return}
  if(f!=null&&!(f>=2&&f<=70)){toast('A testzsír 2–70% között legyen');return}
  if(wa!=null&&!(wa>=30&&wa<=250)){toast('A derékkerület 30–250 cm között legyen');return}
  S.body=S.body.filter(b=>b.date!==d);const e={date:d};if(w!=null)e.weight=w;if(f!=null)e.fat=f;if(wa!=null)e.waist=wa;for(const[k,v]of xs)if(v!=null)e[k]=v;if(st!=null)e.steps=Math.round(st);S.body.push(e);save();toast('Mentve');render();
}
async function delBody(d){if(!await ask(`Törlöd a(z) ${fmtDate(d)} mérést?`,{title:'Mérés törlése',ok:'Törlés',danger:true}))return;S.body=S.body.filter(b=>b.date!==d);save();render()}

/* ===== Statisztika ===== */
function weekStart(ts){const d=new Date(ts);d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getTime()}
function strSeries(exId,metric){const cd=isCardio(exId);return wSorted().map(w=>{const sets=w.exercises.filter(e=>e.exId===exId).flatMap(e=>e.sets).filter(s=>!s.wu);if(!sets.length)return null;
  if(cd){const km=sets.reduce((a,s)=>a+(s.w||0),0),mn=sets.reduce((a,s)=>a+(s.r||0),0),y=metric==='w'?km:metric==='r'?mn:km?mn/km:null;return y==null?null:{x:w.start,y:Math.round(y*100)/100}}
  if(metric==='b'){const bw=bwAt(w.start);if(!bw)return null;const y=Math.max(...sets.map(s=>e1rm(bw+(+s.w||0),s.r)));return{x:w.start,y:Math.round(y*10)/10}}
  const b=bests(sets);
  const y=metric==='v'?sets.reduce((a,s)=>a+s.w*s.r,0):metric==='w'?b.w:metric==='r'?b.r:b.e;return{x:w.start,y:Math.round(y*10)/10}}).filter(Boolean)}
/* ===== Izomcsoport-statisztika: sorozatszám (elsődleges izom 1, másodlagos 0,5), a bemelegítő sorozatok nélkül ===== */
function muSets(from,to){const sets={},freq={};for(const m of MUSCLES){sets[m[0]]=0;freq[m[0]]=0}
  for(const w of S.workouts){if(w.start<from||w.start>=to)continue;const hit={};
    for(const e of w.exercises){const ex=exById(e.exId);if(!ex||ex.kind==='cardio'||!ex.mu)continue;const n=e.sets.filter(s=>!s.wu).length;if(!n)continue;
      sets[ex.mu]+=n;hit[ex.mu]=(hit[ex.mu]||0)+n;for(const k of ex.mu2||[]){sets[k]+=n/2;hit[k]=(hit[k]||0)+n/2}}
    for(const k in hit)if(hit[k]>=1)freq[k]++}
  return{sets,freq}}
function radar(axes,series){const W=400,H=330,cx=200,cy=165,R=112,n=axes.length,top=Math.max(...series.flatMap(x=>x.v)),mx=Math.max(4,top*1.1),ang=i=>-Math.PI/2+i*2*Math.PI/n,pt=(i,v)=>[cx+Math.cos(ang(i))*R*v/mx,cy+Math.sin(ang(i))*R*v/mx];
  const ring=f=>axes.map((_,i)=>pt(i,mx*f).map(x=>x.toFixed(1)).join(',')).join(' ');
  let g=[.25,.5,.75,1].map(f=>`<polygon points="${ring(f)}" fill="none" stroke="var(--kj-border)" stroke-width="1"/>`).join('')+axes.map((_,i)=>{const[x,y]=pt(i,mx);return`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--kj-border)"/>`}).join('');
  if(mx>=10)g+=`<polygon points="${ring(10/mx)}" fill="none" stroke="var(--kj-green-line)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${cx+4}" y="${(cy-R*10/mx-4).toFixed(1)}" font-size="10" fill="var(--kj-green-line)">10</text>`;
  g+=series.map(x=>`<polygon points="${x.v.map((v,i)=>pt(i,v).map(q=>q.toFixed(1)).join(',')).join(' ')}" fill="${x.fill||'none'}" fill-opacity=".18" stroke="${x.color}" stroke-width="2" ${x.dash?'stroke-dasharray="5 4"':''} stroke-linejoin="round"/>`).join('');
  g+=axes.map((a,i)=>{const[x,y]=pt(i,mx*1.16),anc=Math.abs(x-cx)<8?'middle':x>cx?'start':'end';return`<text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="${anc}" font-size="12" fill="var(--kj-muted)">${esc(a)}</text>`}).join('');
  g+=`<text x="${W-4}" y="${H-4}" text-anchor="end" font-size="10" fill="var(--kj-muted)">${L('külső kör','outer ring')}: ${fmt(mx,1)} ${L('sorozat/hét','sets/wk')}</text>`;
  return`<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:440px;display:block;margin:0 auto" role="img" aria-label="${L('Izomeloszlás','Muscle distribution')}">${g}</svg>`}
function muscleCard(){const now=Date.now(),wk=muSets(now-7*DAY,now+1),c28=muSets(now-28*DAY,now+1),p28=muSets(now-56*DAY,now-28*DAY);
  const used=new Set(S.workouts.flatMap(w=>w.exercises.map(e=>e.exId))),un=S.exercises.filter(e=>e.kind!=='cardio'&&!e.mu&&used.has(e.id));
  let h=`<div class="card"><h2>${L('Izomcsoportok','Muscle groups')}</h2>`;
  if(!S.workouts.some(w=>w.start>=now-28*DAY))return h+`<div class="empty">${L('Az elmúlt 4 hétben nincs erőedzés.','No strength workouts in the last 4 weeks.')}</div></div>`;
  const rows=MUSCLES.filter(m=>m[0]!=='full'||wk.sets.full>0),mx=Math.max(24,...rows.map(m=>wk.sets[m[0]]));
  h+=`<h3>${L('Sorozatok az elmúlt 7 napban','Sets in the last 7 days')}</h3><div class="mubars">${rows.map(m=>{const v=wk.sets[m[0]],f=wk.freq[m[0]],col=v>=10&&v<=20?'var(--kj-green-line)':v>20?'var(--kj-violet)':'var(--c-carb)';
    return`<div class="murow click" data-click="muDetail('${m[0]}')" role="button" tabindex="0"><span class="mun">${esc(muName(m[0]))}</span><span class="mubar"><i class="muband" style="left:${(10/mx*100).toFixed(1)}%;width:${(10/mx*100).toFixed(1)}%"></i><i class="mufill" style="width:${(Math.min(v,mx)/mx*100).toFixed(1)}%;background:${col}"></i></span><b class="mono muv">${fmt(v,1)}</b><span class="mono mut muf">${f?f+'×':'–'}</span></div>`}).join('')}</div>
  <div class="row small" style="gap:12px;margin:2px 0 6px"><span><span class="lgd" style="background:var(--c-carb)"></span> ${L('10 alatt','under 10')}</span><span><span class="lgd" style="background:var(--kj-green-line)"></span> ${L('10–20 (ajánlott)','10–20 (recommended)')}</span><span><span class="lgd" style="background:var(--kj-violet)"></span> ${L('20 felett','over 20')}</span></div>
  <div class="hint">${L('A zöld sáv a heti 10–20 sorozat, az izomnövekedéshez szokásosan ajánlott tartomány. A jobb szélső szám, hogy hány edzésen kapott terhelést (ajánlott: legalább heti 2×). A másodlagos izom fél sorozatnak számít, a bemelegítő nem. Koppints egy izomcsoportra a javaslatokért.','The green band is 10–20 sets a week, the range commonly recommended for muscle growth. The right-hand number is how many workouts trained it (recommended: at least 2× a week). A secondary muscle counts as half a set; warm-ups don’t count. Tap a muscle group for suggestions.')}</div>`;
  const ax=MUSCLES.filter(m=>m[0]!=='full');
  h+=splitHtml();
  h+=`<h3 style="margin-top:16px">${L('Izomeloszlás: utolsó 4 hét vs. előző 4 hét','Distribution: last 4 weeks vs previous 4')}</h3>${radar(ax.map(m=>muName(m[0])),[{v:ax.map(m=>p28.sets[m[0]]/4),color:'var(--kj-muted)',dash:true},{v:ax.map(m=>c28.sets[m[0]]/4),color:C.workout,fill:C.workout}])}
  <div class="row small" style="justify-content:center;gap:16px;margin-top:4px"><span><span class="lgd" style="background:${C.workout}"></span> ${L('utolsó 4 hét','last 4 weeks')}</span><span><span class="lgd" style="background:var(--kj-muted)"></span> ${L('előző 4 hét','previous 4 weeks')}</span></div>
  <div class="hint">${L('Heti átlagos sorozatszám izomcsoportonként; a skála a legnagyobb értékhez igazodik, a zöld szaggatott kör a heti 10 sorozat. Ahol a forma behorpad, az az izom kevesebb munkát kap.','Average weekly sets per muscle group; the scale adapts to the largest value, the green dashed ring is 10 sets a week. Where the shape dips, that muscle gets less work.')}</div>`;
  {const lo=ax.filter(m=>c28.sets[m[0]]/4<5&&(c28.sets.chest+c28.sets.back+c28.sets.quads)>0).map(m=>muName(m[0]));
   if(lo.length&&lo.length<ax.length)h+=`<div class="hint" style="margin-top:6px"><b>${L('Javaslat','Suggestion')}:</b> ${L(`kevés munkát kap: ${lo.join(', ')}. Ha ez nem szándékos, tegyél be heti 1–2 gyakorlatot ezekre.`,`getting little work: ${lo.join(', ')}. If that isn’t intentional, add 1–2 exercises a week for them.`)}</div>`}
  if(un.length)h+=`<div class="hint" style="margin-top:8px">${L(`${un.length} edzésben használt gyakorlatnak nincs izomcsoportja, ezek nem számítanak bele.`,`${un.length} exercises used in workouts have no muscle group and aren’t counted.`)} <button class="linkbtn" style="display:inline;width:auto;padding:0" data-click="openSub('train','exlist')">${L('Besorolás','Assign')} ${I('chevron-right','sm')}</button></div>`;
  return h+'</div>'}
/* Izomcsoport részletei: a saját gyakorlataid és további lehetőségek, hány sorozat hiányzik a heti 10-hez */
function muExercises(mu){const now=Date.now(),cnt={},last={};for(const w of S.workouts){if(w.start<now-120*DAY)continue;for(const e of w.exercises){const ex=exById(e.exId);if(!ex||ex.kind==='cardio')continue;
    const role=ex.mu===mu?1:(ex.mu2||[]).includes(mu)?.5:0;if(!role)continue;cnt[ex.id]=(cnt[ex.id]||0)+role;if(!last[ex.id]||w.start>last[ex.id].t)last[ex.id]={t:w.start,sets:e.sets.filter(x=>!x.wu)}}}
  const mine=Object.keys(cnt).map(exById).filter(Boolean).sort((a,b)=>(b.mu===mu)-(a.mu===mu)||cnt[b.id]-cnt[a.id]);
  const more=S.exercises.filter(e=>e.mu===mu&&!cnt[e.id]&&e.kind!=='cardio').sort(byName);return{mine,more,cnt,last}}
function muDetail(mu){const now=Date.now(),wk=muSets(now-7*DAY,now+1),v=wk.sets[mu],f=wk.freq[mu],miss=Math.max(0,Math.ceil(10-v)),{mine,more,last}=muExercises(mu);
  const row=e=>{const l=last[e.id];return`<div class="exl"><span>${esc(T(e.name))}${e.mu!==mu?` <span class="mut small">(${L('másodlagos','secondary')})</span>`:''}</span><span class="mono small mut">${l?l.sets.length+' × '+(l.sets[0]?setStr(l.sets[0],false,e.kind):''):''}</span></div>`};
  const best=mine.find(e=>e.mu===mu)||more[0];
  openModal(`<h2>${esc(muName(mu))}</h2>
  <div class="grid3">${stat(L('Sorozat (7 nap)','Sets (7 days)'),fmt(v,1))}${stat(L('Edzésen','Workouts'),f+'×')}${stat(L('Hiány a 10-hez','Short of 10'),miss?String(miss):'–')}</div>
  <div class="hint" style="margin-top:10px">${miss?L(`Javaslat: heti +${miss} sorozat${best?`, például ${esc(T(best.name))} – ${miss>3?`két edzésen ${Math.ceil(miss/2)}-${Math.ceil(miss/2)} sorozat`:`a következő edzésen ${miss} sorozat`}`:''}. Ha szándékosan más testrészre koncentrálsz, ezt nyugodtan hagyd figyelmen kívül.`,`Suggestion: +${miss} sets a week${best?`, e.g. ${esc(T(best.name))} – ${miss>3?`${Math.ceil(miss/2)} sets in each of two workouts`:`${miss} sets next workout`}`:''}. If you’re deliberately focusing elsewhere, feel free to ignore this.`):f<2&&v>0?L('A sorozatszám rendben van; ha lehet, oszd el legalább két edzésre.','The set count is fine; if you can, spread it over at least two workouts.'):L('Ezen a héten rendben van.','On track this week.')}</div>
  ${mine.length?`<h3 style="margin-top:14px">${L('A te gyakorlataid erre','Your exercises for this')}</h3>${mine.slice(0,6).map(row).join('')}`:''}
  ${more.length?`<h3 style="margin-top:14px">${L('További gyakorlatok a listádból','More exercises from your list')}</h3>${more.slice(0,6).map(row).join('')}`:''}
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
/* Heti felosztás-javaslat: 2–3 nap teljes test, 4 nap felső/alsó; izomcsoportonként a saját leggyakoribb gyakorlatoddal */
let muDays=null;
const SPLITS={2:[['Teljes test A','Full body A',{chest:3,back:3,shoulders:2,quads:3,hams:2,glutes:2,biceps:1,triceps:1,core:2,calves:1}],['Teljes test B','Full body B',{chest:3,back:3,shoulders:2,quads:3,hams:2,glutes:2,biceps:1,triceps:1,core:2,calves:1}]],
  3:[['Teljes test A','Full body A',{chest:3,back:3,shoulders:2,quads:3,hams:2,biceps:1,triceps:1,core:2}],['Teljes test B','Full body B',{chest:3,back:3,shoulders:2,hams:3,glutes:2,biceps:1,triceps:1,calves:2}],['Teljes test C','Full body C',{chest:3,back:3,shoulders:2,quads:3,glutes:2,biceps:1,triceps:1,core:2,calves:1}]],
  4:[['Felső A','Upper A',{chest:4,back:4,shoulders:3,biceps:2,triceps:2}],['Alsó A','Lower A',{quads:4,hams:3,glutes:2,calves:3,core:3}],['Felső B','Upper B',{chest:4,back:4,shoulders:3,biceps:2,triceps:2}],['Alsó B','Lower B',{quads:4,hams:3,glutes:2,calves:3,core:3}]]};
function setMuDays(n){muDays=n;const y=scrollY;render();scrollTo(0,y)}
function splitHtml(){const now=Date.now(),avg=S.workouts.filter(w=>w.start>=now-28*DAY).length/4,d=muDays||Math.max(2,Math.min(4,Math.round(avg)||3));
  const pick=mu=>{const{mine,more}=muExercises(mu);const e=mine.find(x=>x.mu===mu)||more[0];return e?T(e.name):''};
  return`<h3 style="margin-top:16px">${L('Javasolt heti beosztás','Suggested weekly split')}</h3><div class="chips" style="margin:0 0 8px">${[2,3,4].map(n=>`<button class="chip${d===n?' on':''}" data-click="setMuDays(${n})">${n} ${L('nap','days')}</button>`).join('')}</div>
  ${SPLITS[d].map(([hu,en,m])=>`<div class="splitday"><b>${L(hu,en)}</b>${Object.entries(m).map(([k,n])=>`<div class="exl"><span>${esc(muName(k))} · <span class="mono">${n}</span></span><span class="small mut" style="text-align:right;font-family:var(--ui)">${esc(pick(k))}</span></div>`).join('')}</div>`).join('')}
  <div class="hint">${L('A számok munkasorozatok. A másodlagos izmokkal együtt (pl. a nyomó gyakorlatok a tricepszet és a vállat is dolgoztatják) így a legtöbb izomcsoport heti kb. 10 sorozatot kap. Mellette a saját leggyakoribb gyakorlatod az adott izomra. Pontos tervet a Edzések oldalon kérhetsz Claude-tól – a kérés már tartalmazza a mostani izomeloszlásodat.','Numbers are working sets. Counting secondary muscles too (e.g. pressing also works triceps and shoulders), most muscle groups get about 10 sets a week this way. Next to each is your most frequent exercise for that muscle. For a full plan, ask Claude on the Workouts page – the request already includes your current muscle distribution.')}</div>`}
/* Relatív erő: becsült 1RM (Epley) ÷ testsúly, és a változás iránya alapján javaslat */
function bwAt(t){const w=series('weight');let best=null;for(const p of w){const d=Math.abs(p.x-t);if(!best||d<best.d)best={d,y:p.y}}return best?.y??null}
function bwNear(t){const w=series('weight');let best=null;for(const p of w){const d=Math.abs(p.x-t);if(d<=14*DAY&&(!best||d<best.d))best={d,y:p.y}}return best?.y??null}
function relStrengthCard(){const now=Date.now(),bw=bwNear(now)??(series('weight').slice(-1)[0]?.y||null);
  const cand=S.exercises.filter(e=>!e.kind&&e.mu2?.length&&['bar','db','mach'].includes(e.eq)&&['chest','back','quads','hams','glutes','shoulders'].includes(e.mu)).map(e=>{const pts=strSeries(e.id,'e');return{e,pts,n:pts.filter(p=>p.x>=now-90*DAY).length}}).filter(x=>x.n>=2).sort((a,b)=>(a.e.eq==='bar'?0:1)-(b.e.eq==='bar'?0:1)||b.n-a.n).slice(0,4);
  let h=`<div class="card"><h2>${L('Relatív erő','Relative strength')}</h2>`;
  if(!bw)return h+`<div class="empty">${L('Rögzíts testsúlyt a relatív erőhöz.','Log your body weight to see relative strength.')}</div></div>`;
  if(!cand.length)return h+`<div class="empty">${L('Legalább 2 edzés kell egy összetett gyakorlatból az elmúlt 90 napban.','You need at least 2 sessions of a compound lift in the last 90 days.')}</div></div>`;
  const t=targets();
  h+=cand.map(({e,pts})=>{const rec=pts.filter(p=>p.x>=now-28*DAY),old=pts.filter(p=>p.x>=now-84*DAY&&p.x<now-42*DAY);const cur=(rec.length?rec:pts.slice(-1)).reduce((m,p)=>Math.max(m,p.y),0),ratio=cur/bw;
    let tip='',chg='';
    if(old.length){const o=old.reduce((m,p)=>Math.max(m,p.y),0),bo=bwNear(old[old.length-1].x),de=(cur-o)/o*100,db=bo?(bw-bo)/bo*100:0,ro=bo?o/bo:null;
      chg=ro?`<span class="mut small">${L('6–12 hete','6–12 weeks ago')}: ${fmt(ro,2)}× → <b class="${ratio>=ro?'up':'down'}">${fmt(ratio,2)}×</b></span>`:'';
      tip=de>2.5?(db<-1?L('Fogyás mellett is nő az erőd – így tovább.','Strength is rising even while you lose weight – keep it up.'):L('Nő az erőd – a progresszív terhelés működik.','Strength is rising – progressive overload is working.'))
        :de>=-2.5?(db<-1?L('Fogyás közben megtartottad az erőt – pont ez a cél.','You kept your strength while losing weight – exactly the goal.'):L('Az erő 6–12 hete nem nő: válts ismétléstartományt vagy gyakorlatváltozatot, és kövesd a Javaslat sávot az edzésen.','Strength hasn’t moved in 6–12 weeks: change the rep range or exercise variation, and follow the Suggestion bar during workouts.'))
        :db<-1?L(`Fogyás közben csökken az erőd: ellenőrizd, hogy a fehérje eléri-e a napi célt${t.p?` (${t.p} g)`:''}, a heti sorozatszám ne csökkenjen, és ha gyors a fogyás, mérsékeld a deficitet.`,`Strength is dropping while you lose weight: check that protein reaches your target${t.p?` (${t.p} g)`:''}, keep weekly sets up, and if you’re losing fast, ease the deficit.`)
        :L('Csökken az erőd: lehet halmozott fáradtság – egy könnyebb hét (deload) és elég alvás segíthet.','Strength is dropping: it may be accumulated fatigue – a lighter week (deload) and enough sleep can help.')}
    else tip=L('Változáshoz 6–12 héttel ezelőtti adat is kell ebből a gyakorlatból.','Data from 6–12 weeks ago for this lift is needed to show change.');
    return`<div class="relrow"><div class="row" style="flex-wrap:nowrap"><span style="flex:1;min-width:0">${esc(T(e.name))}<br><span class="mut small mono">1RM ~${fmt(cur,0)} kg · ${fmt(bw,1)} kg ${L('testsúly','body weight')}</span></span><b class="mono" style="font-size:20px">${fmt(ratio,2)}×</b></div>${chg?`<div>${chg}</div>`:''}<div class="small" style="margin-top:4px">${tip}</div></div>`}).join('');
  return h+`<div class="hint">${L('Relatív erő = becsült 1RM (Epley) ÷ testsúly. A változás az utolsó 4 hét legjobbját veti össze a 6–12 héttel ezelőttivel; ±2,5% alatt nem számít változásnak.','Relative strength = estimated 1RM (Epley) ÷ body weight. Change compares the best of the last 4 weeks with 6–12 weeks ago; under ±2.5% counts as no change.')}</div></div>`}
function vStats(){
  const cut=statRange?Date.now()-statRange*DAY:-Infinity,inR=p=>p.x>=cut;
  const chips=[[30,'30 nap'],[90,'90 nap'],[365,'1 év'],[0,'Mind']].map(([v,l])=>`<button class="chip ${statRange===v?'on':''}" data-click="setRange(${v})">${l}</button>`).join('');
  const wAll=series('weight'),w=wAll.filter(inR),ma=movAvg(wAll).filter(inR),d7=deltaN(wAll,7),d30=deltaN(wAll,30),d90=deltaN(wAll,90),sl=slopeWeek(w);
  let h=vTrend()+`<h3 style="margin:18px 2px 6px">Részletes nézet</h3><div class="rangebar"><span class="small mut">${L('Időszak','Period')}</span><div class="chips" style="margin:0">${chips}</div></div>
  <div class="card"><h2>Testsúly</h2>${lineChart([{name:'Mérés',color:C.weight,points:w,dots:true,w:1.2},{name:'7 napos átlag',color:C.weight,points:ma,w:3.4}],{unit:' kg'})}
  <div class="grid3" style="margin-top:12px">${stat('Jelenlegi',wAll.length?fmtF(wAll[wAll.length-1].y)+' kg':null)}${stat('Δ 7 nap',d7==null?null:sgn(d7)+' kg',dcls(d7))}${stat('Δ 30 nap',d30==null?null:sgn(d30)+' kg',dcls(d30))}
  ${stat('Δ 90 nap',d90==null?null:sgn(d90)+' kg',dcls(d90))}${stat('Trend (kg/hét)',sl==null?null:sgn(sl,2),dcls(sl))}${stat('Min – max (kg)',w.length?fmt(Math.min(...w.map(p=>p.y)),0)+'–'+fmt(Math.max(...w.map(p=>p.y)),0):null)}</div>
  ${(()=>{const tw=S.profile.targetWeight;if(!tw||!wAll.length)return '';const cur=wAll[wAll.length-1].y,rem=cur-tw,toward=sl!=null&&Math.abs(sl)>.01&&Math.sign(sl)===-Math.sign(rem);
    return `<h3 style="margin-top:16px">Célsúly</h3><div class="grid3">${stat('Célsúly',fmt(tw)+' kg')}${stat(rem>0?'Hátra (fogyás)':'Hátra (gyarapodás)',Math.abs(rem)<.05?'Elérted':fmt(Math.abs(rem))+' kg')}${stat('Becsült idő (trend)',Math.abs(rem)<.05?'–':toward?'~'+Math.ceil(Math.abs(rem/sl))+' hét':'–')}</div>${!toward&&Math.abs(rem)>=.05?'<div class="hint">A becsült időhöz a kiválasztott időszak súlytrendjének a cél felé kell mutatnia.</div>':''}`})()}</div>`;
  const f=series('fat'),wa=series('waist'),fr=f.filter(inR),f30=deltaN(f,30),fsl=slopeWeek(fr),w30=deltaN(wa,30),w90=deltaN(wa,90);
  h+=`<div class="card"><h2>Testzsír %</h2>${lineChart([{name:'Testzsír',color:C.fat,points:fr,dots:true}],{unit:' %',h:190})}
  <div class="grid3" style="margin-top:12px">${stat('Jelenlegi',f.length?fmt(f[f.length-1].y)+' %':null)}${stat('Δ 30 nap',f30==null?null:sgn(f30)+' %p',dcls(f30))}${stat('Trend (%p/hét)',fsl==null?null:sgn(fsl,2),dcls(fsl))}</div></div>
  <div class="card"><button class="row" style="width:100%;background:none;border:0;padding:0;color:inherit;cursor:pointer;flex-wrap:nowrap" data-click="toggleWaist()" aria-expanded="${waistOpen}"><h2 style="flex:1;margin:0;text-align:left">Derékbőség</h2><span class="mut small mono">${wa.length?fmt(wa[wa.length-1].y)+' cm':''}</span>${I(waistOpen?'arrow-up':'arrow-down','sm')}</button>
  ${waistOpen?`<div style="margin-top:10px">${lineChart([{name:'Derékbőség',color:C.waist,points:wa.filter(inR),dots:true}],{unit:' cm',h:190})}
  <div class="grid3" style="margin-top:12px">${stat('Jelenlegi',wa.length?fmt(wa[wa.length-1].y)+' cm':null)}${stat('Δ 30 nap',w30==null?null:sgn(w30)+' cm',dcls(w30))}${stat('Δ 90 nap',w90==null?null:sgn(w90)+' cm',dcls(w90))}</div></div>`:''}</div>`;
  {const t=targets(),days=[...new Set(S.meals.map(m=>m.date))].sort(),byDay={};for(const m of S.meals)(byDay[m.date]=byDay[m.date]||[]).push(m);
   const last30=[...Array(30)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-29+i);return ymd(d)});
   const rd=days.filter(d=>pYmd(d).getTime()>=cut&&d!==today()),sums=rd.map(d=>sumMeals(byDay[d])); // a mai (még tartó) napot kihagyjuk az átlagból
   const avg=k=>sums.length?sums.reduce((a,s)=>a+s[k],0)/sums.length:null;
   const inBand=t.kcal&&sums.length?Math.round(sums.filter(s=>Math.abs(s.kcal-t.kcal)<=t.kcal*.1).length/sums.length*100):null;
   let bal='';
   if(t.tdee&&sums.length>=7){const exp=(avg('kcal')-t.tdee)*7/7700,wsr=series('weight').filter(inR),act=slopeWeek(wsr);
     bal=`<h3 style="margin-top:14px">Energiaegyenleg</h3><div class="grid3">${stat('Átl. egyenleg · kcal/nap',sgn(avg('kcal')-t.tdee,0))}${stat('Várható · kg/hét',sgn(exp,2))}${stat('Mért trend · kg/hét',act==null?null:sgn(act,2))}</div>
     <div class="hint">A „várható” az átlagos bevitel és a becsült napi energiaigény (${fmt(t.tdee,0)} kcal) különbségéből számol (7700 kcal ≈ 1 kg). Ha nagyon eltér a mért trendtől, valószínűleg nem minden étkezés került rögzítésre, vagy az energiaigény becslése pontatlan.</div>`}
   h+=`<div class="card"><h2>Étkezés</h2>
   <div class="row" style="margin-bottom:6px"><h3 style="margin:0;flex:1">Napi energia</h3><div class="chips" style="margin:0">${[7,30,90].map(n=>`<button class="chip ${foodRng===n?'on':''}" data-click="setFoodRng(${n})">${n} nap</button>`).join('')}</div></div>
   ${foodTrend(foodRng)}
   <h3 style="margin-top:14px">A kiválasztott időszak (${statRange?statRange+' nap':'mind'}) átlagai</h3>
   <div class="grid3" style="margin-top:10px">${stat('Átlag kcal (időszak)',avg('kcal')==null?null:fmt(avg('kcal'),0))}${stat('Átlag fehérje',avg('p')==null?null:fmt(avg('p'),0)+' g')}${stat(t.kcal?'±10%-on belüli nap':'Rögzített nap',t.kcal?(inBand==null?null:inBand+' %'):rd.length)}</div>
   <div class="grid3" style="margin-top:8px">${stat('Átlag szénhidrát',avg('c')==null?null:fmt(avg('c'),0)+' g')}${stat('Átlag zsír',avg('f')==null?null:fmt(avg('f'),0)+' g')}${stat('Átlag rost',avg('fib')==null?null:fmt(avg('fib'),0)+' g')}</div>
   ${bal}</div>`;}
  {const ssAll=series('steps'),goal=S.settings.stepGoal||0,sr=ssAll.filter(inR),ma7=movAvg(ssAll).filter(inR);
   const last30=[...Array(30)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-29+i);return ymd(d)});
   const bm={};for(const b of S.body)if(b.steps!=null)bm[b.date]=b.steps;
   const avg=sr.length?sr.reduce((a,p)=>a+p.y,0)/sr.length:null,best=sr.length?sr.reduce((a,p)=>p.y>a.y?p:a):null;
   h+=`<div class="card"><h2>Lépések</h2>
   <h3>Utolsó 30 nap</h3>${barChart(last30.map(d=>d.slice(5).replace('-','.')),last30.map(d=>bm[d]||0),{color:C.steps,opFn:v=>!goal||v>=goal?1:.45,goal,goalColor:C.text,empty:'Az elmúlt 30 napban nincs lépésadat'})}
   ${sr.length>1?`<h3 style="margin-top:14px">7 napos átlag (időszak)</h3>${lineChart([{name:'7 napos átlag',color:C.steps,points:ma7,w:3}],{h:170})}`:''}
   <div class="grid3" style="margin-top:12px">${stat('Átlag (időszak)',avg==null?null:fmt(avg,0))}${stat('Legjobb nap',best?fmt(best.y,0):null)}${goal?stat('Cél teljesítve',sr.length?Math.round(sr.filter(p=>p.y>=goal).length/sr.length*100)+' %':null):stat('Rögzített nap',sr.length)}</div></div>`;}
  const ws0=weekStart(Date.now()),weeks=[...Array(12)].map((_,i)=>{const d=new Date(ws0);d.setDate(d.getDate()-(11-i)*7);return d.getTime()}),cnt=weeks.map(()=>0),vol=weeks.map(()=>0);
  for(const x of S.workouts){const i=weeks.indexOf(weekStart(x.start));if(i>=0){cnt[i]++;vol[i]+=wVolume(x)}}
  const lbl=weeks.map(t=>{const d=new Date(t);return z2(d.getMonth()+1)+'.'+z2(d.getDate())});
  const nm=new Date(),thisM=S.workouts.filter(x=>{const d=new Date(x.start);return d.getMonth()===nm.getMonth()&&d.getFullYear()===nm.getFullYear()}).length;
  h+=`<div class="card"><h2>Edzések</h2><div class="grid3" style="margin-bottom:12px">${stat('Összes edzés',S.workouts.length)}${stat('Ebben a hónapban',thisM)}${stat('Átlag / hét (12 hét)',fmt(cnt.reduce((a,b)=>a+b,0)/12,1))}</div>
  <h3>Edzésszám hetente</h3>${barChart(lbl,cnt,{color:C.workout})}</div>`;
  {const wv=S.workouts.map(x=>({x:x.start,y:wVolume(x)})).filter(p=>p.y>0).sort((a,b)=>a.x-b.x),wr=wv.filter(inR);
   const avgW=vol.reduce((a,b)=>a+b,0)/12,avgS=wr.length?wr.reduce((a,p)=>a+p.y,0)/wr.length:null,best=wr.reduce((m,p)=>!m||p.y>m.y?p:m,null);
   const l4=vol.slice(8).reduce((a,b)=>a+b,0),p4=vol.slice(4,8).reduce((a,b)=>a+b,0),ch4=p4?(l4-p4)/p4*100:null;
   const ma=wr.map((p,i)=>{const a=wr.slice(Math.max(0,i-4),i+1);return{x:p.x,y:a.reduce((s,q)=>s+q.y,0)/a.length}});
   h+=`<div class="card"><h2>Volumen</h2>
   <div class="grid3" style="margin-bottom:12px">${stat('Átlag / hét (12 hét)',avgW?fmtShort(avgW)+' kg':null)}${stat('Átlag / edzés (időszak)',avgS==null?null:fmtShort(avgS)+' kg')}${stat('Utolsó 4 hét vs. előző 4',ch4==null?null:sgn(ch4,0)+' %')}</div>
   <h3>Heti volumen (kg)</h3>${barChart(lbl,vol,{color:C.volume,empty:'Az elmúlt 12 hétben nincs erőedzés-volumen'})}
   ${wr.length>1?`<h3 style="margin-top:14px">Edzésenként (időszak)</h3>${lineChart([{name:'Edzés',color:C.volume,points:wr,dots:true,w:1.2},{name:'5 edzéses átlag',color:C.volume,points:ma,w:3.2}],{unit:' kg',h:190})}`:''}
   ${best?`<div class="hint">Legnagyobb volumenű edzés az időszakban: <b>${fmt(best.y,0)} kg</b> (${fmtDate(ymd(new Date(best.x)))}).</div>`:''}
   <div class="hint">Volumen = súly × ismétlés, a pipált erősorozatokra összeadva. A saját testsúlyos (0 kg) és a kardió sorozatok nem számítanak bele.</div></div>`;}
  h+=muscleCard()+relStrengthCard();
  const used=[...new Set(S.workouts.flatMap(x=>x.exercises.map(e=>e.exId)))].filter(exById);
  if(!used.includes(strEx))strEx=[...used].sort((a,b)=>strSeries(b,'e').length-strSeries(a,'e').length)[0]||null;
  used.sort((a,b)=>exName(a).localeCompare(exName(b),'hu'));
  h+=`<div class="card" id="strcard"><h2>Edzéstrend</h2>`;
  if(!used.length)h+=`<div class="empty">Rögzíts edzéseket a trendekhez.</div>`;
  else{
    const cdx=isCardio(strEx),kx=exKind(strEx),isBW=!cdx&&(kx!=='strength'||strSeries(strEx,'w').every(p=>!p.y)),hasW=kx==='reps'&&strSeries(strEx,'w').some(p=>p.y>0),hasBW=kx==='reps'&&series('weight').length>0;
    const mets=cdx?[['w','Táv (km)'],['r','Idő (perc)'],['p','Tempó (perc/km)']]:kx==='time'?[['r','Max idő (mp)']]:kx==='reps'?[...(hasBW?[['b',L('Becs. 1RM (testsúllyal)','Est. 1RM (incl. body weight)')]]:[]),['r','Max ismétlés'],...(hasW?[['w',L('Max pluszsúly','Max added weight')]]:[])]:isBW?[['r','Max ismétlés']]:[['e','Becs. 1RM'],['w','Max súly'],['r','Max ismétlés'],['v','Volumen']];
    if(!mets.some(m=>m[0]===strMetric))strMetric=mets[0][0];
    const unit=cdx?{w:' km',r:' perc',p:' perc/km'}[strMetric]:strMetric==='r'?(kx==='time'?' mp':' ism.'):' kg',sr=strSeries(strEx,strMetric).filter(inR);
    const first=sr[0],last=sr[sr.length-1],ch=first&&last&&first.y?(last.y-first.y)/first.y*100:null;
    h+=`<select data-change="setStrEx(this.value)" aria-label="Gyakorlat">${used.map(id=>`<option value="${id}" ${id===strEx?'selected':''}>${esc(exName(id))}</option>`).join('')}</select>
    <div class="chips" style="margin-top:12px">${mets.map(([k,l])=>`<button class="chip ${strMetric===k?'on':''}" data-click="setStrMetric('${k}')">${l}</button>`).join('')}</div>
    ${lineChart([{name:mets.find(m=>m[0]===strMetric)[1],color:cdx?C.cardio:C.workout,points:sr,dots:true}],{unit,h:210})}
    <div class="grid3" style="margin-top:12px">${stat('Alkalom (időszak)',sr.length)}${stat('Legutóbbi',last?fmt(last.y)+unit:null)}${stat('Változás (időszak)',ch==null?null:sgn(ch,1)+' %')}</div>`;
  }
  h+=`</div>`;
  const pr=allPRs(),allIds=Object.keys(pr).filter(exById).sort((a,b)=>exName(a).localeCompare(exName(b),'hu')),ids=allIds.filter(id=>!isCardio(id)),cids=allIds.filter(isCardio);
  h+=`<div class="card"><h2>Személyes rekordok</h2>${ids.length?`<table class="tbl"><tr><th>Gyakorlat</th><th>Max súly</th><th>Becs. 1RM</th><th>Max ism.</th><th>Legjobb sorozat</th></tr>
  ${ids.map(id=>{const r=pr[id];return `<tr class="click" data-click="showStr('${id}')"><td>${esc(exName(id))}<small>${r.n} alkalom</small></td>
  <td>${r.w.v?fmt(r.w.v)+' kg<small>'+fmtDate(r.w.d)+'</small>':'–'}</td><td>${r.e.v?fmt(r.e.v,1)+' kg<small>'+fmtDate(r.e.d)+'</small>':'–'}</td>
  <td>${r.r.v}${exKind(id)==='time'?' mp':''}<small>${fmtDate(r.r.d)}</small></td><td>${r.v.v?setStr(r.v.s)+'<small>'+fmtDate(r.v.d)+'</small>':setStr(r.r.s,false,exKind(id))}</td></tr>`}).join('')}</table>
  ${cids.length?`<h3 style="margin-top:16px;color:var(--c-cardio)">Kardió</h3><table class="tbl"><tr><th>Gyakorlat</th><th>Leghosszabb táv</th><th>Leghosszabb idő</th><th>Összesen</th></tr>
  ${cids.map(id=>{const r=pr[id],tot=S.workouts.reduce((a,w)=>a+w.exercises.filter(e=>e.exId===id).reduce((b,e)=>b+e.sets.reduce((c,s)=>c+(s.w||0),0),0),0);
    return `<tr class="click" data-click="showStr('${id}')"><td>${esc(exName(id))}<small>${r.n} alkalom</small></td><td>${r.w.v?fmt(r.w.v,2)+' km<small>'+fmtDate(r.w.d)+'</small>':'–'}</td><td>${r.r.v?r.r.v+' perc<small>'+fmtDate(r.r.d)+'</small>':'–'}</td><td>${tot?fmt(tot,1)+' km':'–'}</td></tr>`}).join('')}</table>`:''}
  <div class="hint" style="margin-top:10px">Becsült 1RM: Epley-képlet (súly × (1 + ism./30)). Koppints egy sorra az erőtrendhez.</div>`:'<div class="empty">Még nincs rekord.</div>'}</div>`;
  return h;
}

/* ===== Összesítő trend: minden adatsor a saját átlagához mért eltérésként (z-pontszám), simítva ===== */
let trendRng=90;const trendHide=new Set();
const TRENDS=[
  {k:'weight',dash:'',name:'Testsúly',color:C.weight,win:7,unit:' kg',dec:1},
  {k:'fat',dash:'10 6',name:'Testzsír',color:C.fat,win:21,unit:' %',dec:1},
  {k:'kcal',dash:'1 6',name:'Étkezési energia',color:C.kcal,win:7,unit:' kcal',dec:0},
  {k:'steps',dash:'16 5 3 5',name:'Lépések',color:C.steps,win:7,unit:'',dec:0},
  {k:'wk',dash:'5 5',name:'Edzések / hét',color:C.workout,win:7,unit:'',dec:0},
  {k:'vol',dash:'9 3 2 3 2 3',name:'Volumen / hét',color:C.volume,win:7,unit:' kg',dec:0}];
function trendData(n){
  const raw={weight:{},fat:{},kcal:{},steps:{},wk:{},vol:{}},td=today();
  for(const b of S.body){if(b.weight!=null)raw.weight[b.date]=b.weight;if(b.fat!=null)raw.fat[b.date]=b.fat;if(b.steps!=null)raw.steps[b.date]=b.steps}
  for(const m of S.meals)if(m.date!==td)raw.kcal[m.date]=(raw.kcal[m.date]||0)+m.kcal; // a mai, még tartó nap kimarad
  for(const w of S.workouts){const d=ymd(new Date(w.start));raw.wk[d]=(raw.wk[d]||0)+1;raw.vol[d]=(raw.vol[d]||0)+wVolume(w)}
  const pre=35,N=n+pre,days=[...Array(N)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(N-1)+i);return ymd(d)});
  const sm={};
  for(const T of TRENDS){const m=raw[T.k];
    sm[T.k]=days.map((d,i)=>{
      if(T.k==='wk'||T.k==='vol'){if(i<6||!S.workouts.length)return null;let c=0;for(let j=i-6;j<=i;j++)c+=m[days[j]]||0;return c} // gördülő 7 napos edzésszám
      let s=0,c=0;for(let j=Math.max(0,i-T.win+1);j<=i;j++)if(m[days[j]]!=null){s+=m[days[j]];c++}return c?s/c:null})}
  const chg=(a,lag)=>a.map((v,i)=>i>=lag&&v!=null&&a[i-lag]!=null?v-a[i-lag]:null);
  const wch=chg(sm.weight,7),fch=chg(sm.fat,14),cut=a=>a.slice(pre);
  const o={days:cut(days),sm:{},wch:cut(wch),fch:cut(fch)};for(const k in sm)o.sm[k]=cut(sm[k]);return o;
}
function zNorm(a){const v=a.filter(x=>x!=null);if(v.length<5)return null;const m=v.reduce((x,y)=>x+y,0)/v.length,sd=Math.sqrt(v.reduce((x,y)=>x+(y-m)**2,0)/v.length);
  if(sd<1e-9)return null;return a.map(x=>x==null?null:Math.max(-2.5,Math.min(2.5,(x-m)/sd)))}
function pearson(a,b){const xs=[],ys=[];for(let i=0;i<a.length;i++)if(a[i]!=null&&b[i]!=null){xs.push(a[i]);ys.push(b[i])}
  const n=xs.length;if(n<20)return{n,r:null};const mx=xs.reduce((p,q)=>p+q,0)/n,my=ys.reduce((p,q)=>p+q,0)/n;let sxy=0,sxx=0,syy=0;
  for(let i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)**2;syy+=(ys[i]-my)**2}return{n,r:sxx&&syy?sxy/Math.sqrt(sxx*syy):null}}
const rWord=r=>{const a=Math.abs(r);return a<.2?'elhanyagolható':a<.4?'gyenge':a<.6?'közepes':'erős'};
function setTrendRng(n){trendRng=[30,90,120].includes(n)?n:90;render()}
function toggleTrend(k){trendHide.has(k)?trendHide.delete(k):trendHide.add(k);render()}
/* Testösszetétel: a tartomány első és utolsó testzsír-mérésénél a testsúllyal együtt -> zsírtömeg / zsírmentes tömeg */
function composition(n){
  const from=ymd(new Date(Date.now()-n*DAY)),fats=bodySorted().filter(b=>b.fat!=null&&b.date>=from);if(fats.length<2)return null;
  const ws=series('weight'),wAt=d=>{const t=pYmd(d).getTime();let best=null;for(const p of ws)if(Math.abs(p.x-t)<=3*DAY&&(!best||Math.abs(p.x-t)<Math.abs(best.x-t)))best=p;return best?.y??null};
  const a=fats[0],b=fats[fats.length-1],w0=a.weight??wAt(a.date),w1=b.weight??wAt(b.date);if(w0==null||w1==null||a.date===b.date)return null;
  const fm0=w0*a.fat/100,fm1=w1*b.fat/100;return{d0:a.date,d1:b.date,dw:w1-w0,dfm:fm1-fm0,dlean:(w1-fm1)-(w0-fm0),f0:a.fat,f1:b.fat};
}
let infoOpen=new Set();
function infoBtn(k){return `<button class="btn sm ico" data-click="toggleInfo('${k}')" aria-label="Magyarázat" aria-expanded="${infoOpen.has(k)}">${I('circle-help','sm')}</button>`}
function toggleInfo(k){if(!['trend','corr'].includes(k))return;infoOpen.has(k)?infoOpen.delete(k):infoOpen.add(k);render()}
function vTrend(){
  const n=trendRng,D=trendData(n),xs=D.days.map(d=>pYmd(d).getTime());
  const series=[],chips=[];
  for(const T of TRENDS){const z=zNorm(D.sm[T.k]),off=trendHide.has(T.k);
    chips.push(`<button class="chip tchip ${off||!z?'off':''}" style="${off||!z?'':`color:${T.color};border-color:${T.color}`}" aria-pressed="${!(off||!z)}" data-click="toggleTrend('${T.k}')" ${z?'':'disabled'} title="${z?'':'Kevés adat'}"><svg width="22" height="8" aria-hidden="true" style="vertical-align:1px;margin-right:5px"><line x1="2" y1="4" x2="20" y2="4" style="stroke:currentColor;stroke-width:2.6;stroke-linecap:round${T.dash?';stroke-dasharray:'+T.dash.split(' ').map(x=>x/2).join(' '):''}"/></svg>${T.name}</button>`);
    if(!z||off)continue;
    const pts=[];let prev=false;z.forEach((v,i)=>{if(v==null){prev=false;return}pts.push({x:xs[i],y:v,gap:false,t:fmt(D.sm[T.k][i],T.dec)+T.unit});prev=true});
    series.push({name:T.name,color:T.color,points:pts,w:T.k==='kcal'?3.6:T.k==='weight'?3:2.6,dash:T.dash});}
  let h=`<div class="card"><div class="row" style="flex-wrap:nowrap;margin-bottom:12px"><h2 style="flex:1;margin:0">Összesítő trend</h2>${infoBtn('trend')}</div>
  <div class="chips" style="margin-bottom:8px">${[30,90,120].map(v=>`<button class="chip ${n===v?'on':''}" data-click="setTrendRng(${v})">${v} nap</button>`).join('')}</div>
  ${lineChart(series,{h:250,yMin:-2.5,yMax:2.5,ticks:[-2,-1,0,1,2],yFmt:t=>t===0?'átl.':(t>0?'+':'−')+Math.abs(t),noLegend:true})}
  ${infoOpen.has('trend')?`<div class="hint">Minden vonal a saját átlagához képest mutatja a le-fel mozgást (0 = az időszak átlaga, ±1 = egy szórásnyi eltérés), simítva: testsúly, étkezés, lépés 7 napos, testzsír 21 napos átlag, edzés és volumen: az előző 7 nap edzésszáma, illetve megmozgatott összsúlya. Mérés nélküli napokon a vonal a következő értékig összeköt. Így a különböző mértékegységű adatok egy grafikonon összevethetők; a pontos értéket koppintásra mutatja. A lenti gombokkal ki-be kapcsolhatod az adatsorokat.</div>`:''}
  <div class="chips" style="margin-top:10px">${chips.join('')}</div>`;
  // összefüggések
  const drv=[['kcal','Étkezési energia (7 napos átlag)'],['steps','Lépések (7 napos átlag)'],['wk','Edzések az előző 7 napban'],['vol','Edzésvolumen az előző 7 napban']];
  const rows=drv.map(([k,l])=>({k,l,w:pearson(D.sm[k],D.wch),f:pearson(D.sm[k],D.fch)}));
  const cell=x=>x.r==null?`<td class="mut">kevés adat</td>`:`<td><b style="color:${Math.abs(x.r)<.2?'var(--kj-muted)':'var(--kj-text)'}">${sgn(x.r,2)}</b><small>${rWord(x.r)}</small></td>`;
  const best=rows.filter(r=>r.w.r!=null).sort((a,b)=>Math.abs(b.w.r)-Math.abs(a.w.r))[0];
  h+=`<div class="row" style="flex-wrap:nowrap;margin:16px 0 4px"><h3 style="flex:1;margin:0">Összefüggések (${n} nap)</h3>${infoBtn('corr')}</div>
  <table class="tbl"><tr><th>Tényező</th><th>Testsúly heti változása</th><th>Testzsír 2 heti változása</th></tr>${rows.map(r=>`<tr><td>${r.l}</td>${cell(r.w)}${cell(r.f)}</tr>`).join('')}</table>
  ${best&&Math.abs(best.w.r)>=.2?`<div class="small" style="margin-top:10px">Ebben az időszakban a testsúly változásával leginkább a(z) <b>${T(best.l).split(' (')[0].toLowerCase()}</b> mozgott együtt (r = ${sgn(best.w.r,2)}, ${rWord(best.w.r)}${best.w.r>0?' – ha nőtt, a testsúly is inkább nőtt':' – ha nőtt, a testsúly inkább csökkent'}).</div>`:''}
  ${infoOpen.has('corr')?`<div class="hint">Korrelációs együttható (r, −1…+1): az adott tényező szintje és az ugyanarra az időszakra eső súly-, illetve zsírváltozás együttmozgása. Pozitív: együtt nőnek; negatív: ellentétesen mozognak. Legalább 20 közös nap kell hozzá, és az együttmozgás nem bizonyít ok-okozatot – egy-egy rendhagyó hét (betegség, utazás) is erősen befolyásolhatja. A testzsír-mérés (főleg otthoni mérlegnél) zajos, ott a jelzés óvatosabban értelmezendő.</div>`:''}`;
  // testösszetétel
  const c=composition(n);
  if(c){const share=Math.abs(c.dw)>=.5?Math.round(c.dfm/c.dw*100):null;
    let msg='';
    if(c.dw<=-.5)msg=share>100?`A zsírtömeg többel csökkent, mint a testsúly – a zsírmentes tömeg (izom, víz) közben nőtt.`:share<0?`A testsúly csökkent, de a zsírtömeg nem – a fogyás zsírmentes tömegből (izom, víz) származott.`:`A fogyás kb. <b>${share}%-a</b> zsírból származott${share<60?' – ez arra utalhat, hogy izom is fogyott; a fehérjebevitel és az erőedzés segít megőrizni.':'.'}`;
    else if(c.dw>=.5)msg=share<0?`A testsúly nőtt, a zsírtömeg csökkent – a gyarapodás zsírmentes tömeg.`:`A gyarapodás kb. <b>${100-Math.min(100,share)}%-a</b> zsírmentes tömeg (izom, víz), ${Math.min(100,share)}%-a zsír.`;
    else msg=c.dfm<-.3?`A testsúly alig változott, a zsírtömeg csökkent – testösszetétel-javulás.`:c.dfm>.3?`A testsúly alig változott, a zsírtömeg nőtt.`:`A testösszetétel érdemben nem változott.`;
    h+=`<h3 style="margin-top:16px">Testösszetétel változása</h3><div class="hint" style="margin:0 0 8px">${fmtDate(c.d0)} → ${fmtDate(c.d1)} · testzsír ${fmt(c.f0)}% → ${fmt(c.f1)}%</div>
    <div class="grid3">${stat('Testsúly',sgn(c.dw)+' kg',dcls(c.dw))}${stat('Zsírtömeg',sgn(c.dfm)+' kg',dcls(c.dfm))}${stat('Zsírmentes tömeg',sgn(c.dlean)+' kg')}</div><div class="small" style="margin-top:8px">${msg}</div>`}
  else h+=`<div class="hint" style="margin-top:12px">A testösszetétel-változáshoz legalább két testzsír-mérés kell az időszakban.</div>`;
  return h+`</div>`;
}

/* ===== Grafikonok (SVG, külső könyvtár nélkül) ===== */
const CH={};let chN=0;
function niceTicks(a,b,n){const raw=(b-a)/n||1,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p,st=(f<1.5?1:f<3?2:f<7?5:10)*p,t=[];for(let v=Math.floor(a/st)*st;v<b+st*.999;v+=st){t.push(+v.toFixed(6));if(t.length>12)break}if(t.length<2)t.push(t[0]+st);return t}
function xLbl(x,span){const d=new Date(x);return span>400*DAY?d.getFullYear()+'.'+z2(d.getMonth()+1):z2(d.getMonth()+1)+'.'+z2(d.getDate())+'.'}
function lineChart(series,o={}){
  series=series.filter(s=>s.points.length);
  if(!series.length)return '<div class="empty">Ebben az időszakban nincs adat</div>';
  const W=600,H=o.h||230,pl=52,pr=14,pt=12,pb=30,all=series.flatMap(s=>s.points);
  let x0=Math.min(...all.map(p=>p.x)),x1=Math.max(...all.map(p=>p.x));if(x1-x0<DAY){x0-=3*DAY;x1+=3*DAY}
  let y0=Math.min(...all.map(p=>p.y)),y1=Math.max(...all.map(p=>p.y));const sp=y1-y0||Math.max(1,Math.abs(y1)*.04);y0-=sp*.12;y1+=sp*.12;
  if(o.yMin!=null){y0=o.yMin;y1=o.yMax}
  const tk=o.ticks||niceTicks(y0,y1,4);if(o.yMin==null){y0=tk[0];y1=tk[tk.length-1]}
  const sx=x=>pl+(x-x0)/(x1-x0)*(W-pl-pr),sy=y=>pt+(1-(y-y0)/(y1-y0))*(H-pt-pb);
  let g='';
  tk.forEach(t=>g+=`<line x1="${pl}" x2="${W-pr}" y1="${sy(t)}" y2="${sy(t)}" class="gl"/><text x="${pl-8}" y="${sy(t)+5}" text-anchor="end" class="ax">${o.yFmt?o.yFmt(t):Math.abs(t)>=1000?fmtShort(t):fmt(t,1)}</text>`);
  for(let i=0;i<=4;i++){const x=x0+(x1-x0)*i/4;g+=`<text x="${sx(x)}" y="${H-8}" text-anchor="${i===0?'start':i===4?'end':'middle'}" class="ax">${xLbl(x,x1-x0)}</text>`}
  series.forEach(s=>{const d=s.points.map((p,i)=>(i&&!p.gap?'L':'M')+sx(p.x).toFixed(1)+' '+sy(p.y).toFixed(1)).join('');
    g+=`<path d="${d}" style="fill:none;stroke:${s.color};stroke-width:${s.w||2.5};stroke-linejoin:round;stroke-linecap:round${s.dash?';stroke-dasharray:'+s.dash:''}"/>`;
    if(s.dots&&s.points.length<=120)s.points.forEach(p=>g+=`<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="${s.points.length>50?2.2:3.4}" style="fill:${s.color}"/>`)});
  const id='c'+(chN++);CH[id]={series,sx,sy,x0,x1,W,H,pl,pr,pt,pb,unit:o.unit||''};
  const legend=series.length>1&&!o.noLegend?`<div class="legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`:'';
  return `${legend}<svg class="chart" data-ch="${id}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(series.map(s=>s.name).join(', '))} grafikon">${g}<g class="tt"></g></svg>`;
}
function attachCharts(){
  document.querySelectorAll('svg.chart[data-ch]').forEach(svg=>{const c=CH[svg.dataset.ch];if(!c)return;const tt=svg.querySelector('.tt');
    const show=ev=>{const r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*c.W,xv=c.x0+(x-c.pl)/(c.W-c.pl-c.pr)*(c.x1-c.x0);
      const near=(pts,t)=>{let q=null;for(const p of pts)if(!q||Math.abs(p.x-t)<Math.abs(q.x-t))q=p;return q};
      const b=near(c.series.reduce((a,s)=>a.length>=s.points.length?a:s.points,[]),xv);if(!b)return;const px=c.sx(b.x);
      const lines=[fmtDate(b.x)];c.series.forEach(s=>{const q=near(s.points,b.x);if(q&&Math.abs(q.x-b.x)<DAY*1.5)lines.push((c.series.length>1?s.name+': ':'')+(q.t??fmt(q.y,1)+c.unit))});
      const bw=Math.max(...lines.map(l=>l.length))*9.2+20,bh=lines.length*21+12;let bx=px+12;if(bx+bw>c.W-c.pr)bx=px-12-bw;
      tt.innerHTML=`<line x1="${px}" x2="${px}" y1="${c.pt}" y2="${c.H-c.pb}" style="stroke:var(--kj-muted);stroke-dasharray:3 3"/><circle cx="${px}" cy="${c.sy(b.y)}" r="6" style="fill:${c.series[0].color};stroke:var(--kj-tt);stroke-width:2.5"/><rect x="${bx}" y="${c.pt}" width="${bw}" height="${bh}" rx="9" style="fill:var(--kj-tt);stroke:var(--kj-border-strong)"/>`+lines.map((l,i)=>`<text x="${bx+10}" y="${c.pt+24+i*21}" class="ttx">${esc(l)}</text>`).join('')};
    svg.addEventListener('pointermove',show);svg.addEventListener('pointerdown',show);svg.addEventListener('pointerleave',()=>tt.innerHTML='')});
}
function barChart(labels,vals,o={}){
  const W=600,H=o.h||180,pl=48,pr=8,pt=o.sub?42:22,pb=28,max=Math.max(...vals,0,...(o.avgLine||[]).filter(x=>x!=null));
  if(!max)return `<div class="empty">${o.empty||'Az elmúlt 12 hétben nincs edzés'}</div>`;
  const step=vals.length<=8?1:Math.max(2,Math.ceil(vals.length/6)),dense=vals.length>16;
  const tk=niceTicks(0,Math.max(max,o.goal||0),3),top=tk[tk.length-1],bw=(W-pl-pr)/vals.length,ih=H-pt-pb;let g='',sb;
  tk.forEach(t=>{const y=pt+(1-t/top)*ih;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" class="gl"/><text x="${pl-8}" y="${y+5}" text-anchor="end" class="ax">${fmtShort(t)}</text>`});
  if(o.goal){const y=pt+(1-o.goal/top)*ih;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}" style="stroke:${o.goalColor};stroke-width:2;stroke-dasharray:6 5"/>${o.goalLabel===false?'':`<text x="${W-pr}" y="${y-6}" text-anchor="end" class="bv" style="fill:${o.goalColor}">cél ${fmtShort(o.goal)}</text>`}`}
  vals.forEach((v,i)=>{const h=v/top*ih,x=pl+i*bw+bw*.18,cx=x+bw*.32;
    if(v)g+=`<rect x="${x}" y="${H-pb-h}" width="${bw*.64}" height="${h}" rx="${dense?3:5}" style="fill:${o.colorFn?o.colorFn(v):o.color};opacity:${o.opFn?o.opFn(v):1}"/>`+(dense?'':`<text x="${cx}" y="${H-pb-h-6}" text-anchor="middle" class="bv">${fmtShort(v)}</text>`)+(o.sub&&!dense&&(sb=o.sub(v))?`<text x="${cx}" y="${H-pb-h-24}" text-anchor="middle" class="bv" style="fill:${sb.color};font-weight:700">${esc(sb.text)}</text>`:'');
    if((vals.length-1-i)%step===0){const edge=cx+28>W-pr;g+=`<text x="${edge?W-pr:cx}" y="${H-8}" text-anchor="${edge?'end':'middle'}" class="ax">${labels[i]}</text>`}});
  if(o.avgLine){let d='';o.avgLine.forEach((a,i)=>{if(a==null)return;const x=pl+i*bw+bw*.5,y=pt+(1-a/top)*ih;d+=(d?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)});if(d)g+=`<path d="${d}" style="fill:none;stroke:${o.avgColor};stroke-width:3;stroke-linejoin:round;stroke-linecap:round"/>`}
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ===== Import a Strong appból (CSV export) =====
   Oszlopok név szerint: Date, Workout Name, Duration, Exercise Name, Set Order, Weight, Reps, Distance, Seconds, (Weight Unit), RPE.
   Elválasztó: vessző vagy pontosvessző. A gyakorlatneveket a meglévő magyar gyakorlatokhoz rendeli, ismeretlennél újat hoz létre. */
const STRONG_MAP={
'Pull Up':'Húzódzkodás','Pull Up (Assisted)':'Húzódzkodás','Chin Up':['Húzódzkodás (fordított fogás)','Hát'],'Push Up':'Fekvőtámasz',
'Lateral Raise (Dumbbell)':'Oldalemelés (kézisúlyzó)','Hammer Curl (Dumbbell)':'Kalapács hajlítás','Bent Over Row (Dumbbell)':'Evezés (kézisúlyzó)',
'Bent Over Row (Barbell)':'Evezés (rúd)','Floor Press (Barbell)':['Padlón nyomás (rúd)','Mell'],'Floor Press (Dumbbell)':'Padlón nyomás (kézisúlyzó)',
'Concentration Curl (Dumbbell)':'Koncentrált bicepszhajlítás (kézisúlyzó)','Squat (Dumbbell)':['Guggolás (kézisúlyzó)','Láb'],'Squat (Barbell)':'Guggolás (rúd)',
'Squat (Bodyweight)':'Guggolás (saját testsúly)','Bulgarian Split Squat':'Bolgár guggolás (kézisúlyzó)','Goblet Squat (Kettlebell)':'KB goblet guggolás',
'Goblet Squat (Dumbbell)':'Goblet guggolás (kézisúlyzó)','Romanian Deadlift (Dumbbell)':'Román felhúzás (kézisúlyzó)','Romanian Deadlift (Barbell)':'Román felhúzás (rúd)',
'Deadlift (Barbell)':'Felhúzás (rúd)','Lunge (Dumbbell)':'Kitörés (kézisúlyzó)','Lunge (Bodyweight)':'Kitörés (saját testsúly)',
'Upright Row (Barbell)':['Állig húzás (rúd)','Váll'],'Upright Row (Dumbbell)':['Állig húzás (kézisúlyzó)','Váll'],
'Bicep Curl (Dumbbell)':'Bicepsz hajlítás (kézisúlyzó)','Bicep Curl (Barbell)':'Bicepsz hajlítás (rúd)','Incline Bench Press (Dumbbell)':'Ferde fekvenyomás (kézisúlyzó)',
'Bench Press (Barbell)':'Fekvenyomás (rúd)','Bench Press (Dumbbell)':'Fekvenyomás (kézisúlyzó)','Overhead Press (Barbell)':'Katonai nyomás (rúd)',
'Shoulder Press (Dumbbell)':'Vállból nyomás (kézisúlyzó)','Arnold Press (Dumbbell)':['Arnold-nyomás (kézisúlyzó)','Váll'],'Front Raise (Dumbbell)':['Előreemelés (kézisúlyzó)','Váll'],
'Incline Curl (Dumbbell)':['Ferde pados bicepszhajlítás (kézisúlyzó)','Kar'],'Triceps Extension (Barbell)':['Tricepsz nyújtás (rúd)','Kar'],
'Triceps Extension (Dumbbell)':['Tricepsz nyújtás (kézisúlyzó)','Kar'],'Triceps Pushdown (Cable - Straight Bar)':'Tricepsz letolás (kábel)',
'Standing Calf Raise (Dumbbell)':['Vádliemelés állva (kézisúlyzó)','Láb'],'Calf Press on Leg Press':'Vádliemelés (gép)','Leg Press':'Lábtolás (gép)',
'Lat Pulldown (Cable)':'Mellhez húzás (kábel)','Seated Row (Cable)':'Evezés ülve (kábel)','Face Pull (Cable)':'Face pull (kábel)','Chest Fly (Cable)':'Tárogatás (kábel)',
'Hip Thrust (Barbell)':'Csípőemelés (rúd)','Glute Bridge':'Csípőemelés (saját testsúly)','Leg Extension (Machine)':'Lábnyújtás (gép)','Lying Leg Curl (Machine)':'Lábhajlítás (gép)',
'Plank':'Plank (mp)','Crunch':'Hasprés','Hanging Leg Raise':'Lábemelés függésben','Ab Wheel':'Hasgörgő','Burpee':'Burpee','Mountain Climber':'Hegymászó',
'Kettlebell Swing':'KB swing (kétkezes)','Kettlebell Turkish Get Up':'KB török felállás (get-up)','Dips':'Tolódzkodás','Inverted Row':'Ausztrál húzódzkodás',
'Running':'Futás (aszfalt)','Running (Outdoor)':'Futás (aszfalt)','Trail Running':'Futás (terep)','Running (Treadmill)':'Futópad','Treadmill':'Futópad',
'Cycling':'Kerékpár (kültéri)','Cycling (Outdoor)':'Kerékpár (kültéri)','Cycling (Indoor)':'Terembicikli','Stationary Bike':'Terembicikli','Rowing (Machine)':'Evezőgép',
'Elliptical Trainer':'Elliptikus tréner','Stair Stepper':'Lépcsőzőgép','Walking':'Gyaloglás','Hiking':'Túrázás','Swimming':'Úszás','Jump Rope':'Ugrókötél'};
const STRONG_GENERIC=['Workout','Morning Workout','Afternoon Workout','Evening Workout','Night Workout','Extra Workout','Quick Workout','New Workout'];
function csvParse(text){
  text=text.replace(/^﻿/,'');const first=text.slice(0,text.indexOf('\n')),sep=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';
  const rows=[];let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){const ch=text[i];
    if(q){if(ch==='"'){if(text[i+1]==='"'){cur+='"';i++}else q=false}else cur+=ch}
    else if(ch==='"')q=true;else if(ch===sep){row.push(cur);cur=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cur);rows.push(row);row=[];cur=''}else cur+=ch}
  if(cur||row.length){row.push(cur);rows.push(row)}
  return rows.filter(r=>r.some(c=>c.trim()!==''));
}
const strongDur=t=>{const h=/(\d+)\s*h/.exec(t||''),m=/(\d+)\s*m/.exec(t||'');return((h?+h[1]*60:0)+(m?+m[1]:0))*60000};
function parseStrong(text,lbs){
  const rows=csvParse(text);if(rows.length<2)throw new Error('üres');
  const hd=rows[0].map(h=>h.trim().toLowerCase()),col=n=>hd.indexOf(n);
  const C={date:col('date'),name:col('workout name'),dur:col('duration'),ex:col('exercise name'),ord:col('set order'),w:col('weight'),r:col('reps'),sec:col('seconds'),dist:col('distance'),unit:col('weight unit')};
  if(C.date<0||C.ex<0||C.w<0||C.r<0)throw new Error('hibás szerkezet');
  const num=v=>{const x=parseFloat(String(v??'').replace(',','.'));return isFinite(x)?x:0};
  const wk=new Map();let sets=0,skipped=0;
  for(const r of rows.slice(1)){
    const m=/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/.exec((r[C.date]||'').trim());if(!m){skipped++;continue}
    const ord=(r[C.ord]||'').trim();if(/rest/i.test(ord)){continue} // „Rest Timer” sorok
    const exName=(r[C.ex]||'').trim().slice(0,100);if(!exName){skipped++;continue}
    let w=num(r[C.w]),reps=Math.round(num(r[C.r]));const sec=Math.round(num(r[C.sec]));
    const dist=C.dist>=0?num(r[C.dist]):0;
    if(!reps&&sec)reps=sec; // időre végzett gyakorlat: a másodperc kerül az ismétlés helyére
    if(!reps&&!dist){skipped++;continue}
    const unitLbs=C.unit>=0?/lb/i.test(r[C.unit]||''):lbs;if(unitLbs)w=Math.round(w*0.45359237*2)/2;
    const key=r[C.date].trim()+'|'+(r[C.name]||'');
    if(!wk.has(key)){const start=new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+(m[6]||0)).getTime();
      wk.set(key,{name:((r[C.name]||'').trim()||'Edzés').slice(0,100),start,end:start+(strongDur(r[C.dur])||3600000),ex:new Map()})}
    const W=wk.get(key);if(!W.ex.has(exName))W.ex.set(exName,[]);W.ex.get(exName).push({w:Math.max(0,Math.min(2000,w)),r:Math.min(10000,reps),dist,sec,wu:/^w$/i.test(ord),st:/^d$/i.test(ord)?'d':/^f$/i.test(ord)?'f':undefined});sets++;
  }
  return{workouts:[...wk.values()].sort((a,b)=>a.start-b.start),sets,skipped};
}
let REV=null;const revEN=()=>REV||(REV=Object.fromEntries(Object.entries(EN).map(([k,v])=>[v,k])));
function strongHu(n){const t=STRONG_MAP[n];if(t)return Array.isArray(t)?t[0]:t;return revEN()[n]||null}
function strongExId(name,created){
  const target=STRONG_MAP[name],hu=strongHu(name),cat=Array.isArray(target)?target[1]:null;
  const find=n=>S.exercises.find(e=>e.name.toLowerCase()===n.toLowerCase());
  let e=hu?find(hu):find(name);
  if(!e){const nm=hu||name,eq=/\((Barbell|Machine|Cable)/i.test(name)?'Egyéb':'Egyéb';e=fillMeta({id:uid(),name:nm,cat:cat||(hu?'Egyéb':eq)});S.exercises.push(e);created.add(nm)}
  return e.id;
}
async function importStrong(inp){
  const f=inp.files[0];inp.value='';if(!f)return;
  let text;try{if(f.size>20e6)throw 0;text=await f.text()}catch(e){toast('A fájl nem olvasható');return}
  let P;try{P=parseStrong(text,false)}catch(e){toast('A fájl szerkezete nem megfelelő – nézd meg a Minta fájlt');return}
  if(!P.workouts.length){toast('Nem találtam edzést a fájlban');return}
  const have=new Set(S.workouts.map(w=>Math.floor(w.start/60000))),fresh=P.workouts.filter(w=>!have.has(Math.floor(w.start/60000)));
  const exNames=[...new Set(P.workouts.flatMap(w=>[...w.ex.keys()]))],known=exNames.filter(n=>{const hu=strongHu(n)||n;return S.exercises.some(e=>e.name.toLowerCase()===hu.toLowerCase())}).length;
  if(!fresh.length){toast(`Mind a(z) ${P.workouts.length} edzés szerepel már – nincs mit importálni`);return}
  const fd=ts=>new Date(ts).toLocaleDateString(LOC(),{year:'numeric',month:'short',day:'numeric'});
  const hasUnitCol=/weight unit/i.test(text.slice(0,300));
  const r=await form('Edzések importálása',hasUnitCol?[]:[{id:'unit',label:'A súlyok mértékegysége az exportban',type:'select',value:'kg',options:[['kg','kg'],['lbs','font (lbs) – átváltom kg-ra']]}],
    {ok:'Importálás',intro:`<b>${P.workouts.length}</b> edzés (${fd(P.workouts[0].start)} – ${fd(P.workouts[P.workouts.length-1].start)}), <b>${P.sets}</b> sorozat, <b>${exNames.length}</b> gyakorlat – ebből ${known} a meglévőkhöz rendelve, ${exNames.length-known} új lesz.${fresh.length<P.workouts.length?`<br>${P.workouts.length-fresh.length} edzés már szerepel (azonos kezdési idő), ezeket kihagyom.`:''}${P.skipped?`<br>${P.skipped} üres sort (0 ismétlés) kihagyok.`:''}`});
  if(!r)return;
  if(r.unit==='lbs')P=parseStrong(text,true);
  const keep=new Set(fresh.map(w=>w.start)),created=new Set(),cnt={};
  const list=P.workouts.filter(w=>keep.has(w.start));list.forEach(w=>{if(!STRONG_GENERIC.includes(w.name))cnt[w.name]=(cnt[w.name]||0)+1});
  const out=list.map(w=>({id:uid(),name:w.name,start:w.start,end:w.end,tplId:null,exercises:[...w.ex.entries()].map(([n,sets])=>{const id=strongExId(n,created),cd=isCardio(id);return{exId:id,sets:sets.map(x=>cd?{w:Math.round((x.dist||0)*100)/100,r:Math.max(1,Math.round((x.sec||x.r*60||0)/60))}:(x.wu?{w:x.w,r:x.r,wu:true}:x.st?{w:x.w,r:x.r,st:x.st}:{w:x.w,r:x.r})).filter(x=>x.r>0)}}).filter(e=>e.sets.length)}));
  // sablon a legalább 3-szor használt, nem általános nevű edzésekből (a legutóbbi felépítéssel); azonos nevű meglévő sablonhoz kapcsol
  let tplNew=0;
  for(const[name,c]of Object.entries(cnt)){if(c<3)continue;const last=out.filter(w=>w.name===name).at(-1);
    let t=S.templates.find(x=>x.name===name);if(!t){t={id:uid(),name,items:last.exercises.map(e=>({exId:e.exId,sets:e.sets.length,...(e.ss?{ss:true}:{})}))};S.templates.push(t);tplNew++}
    out.forEach(w=>{if(w.name===name)w.tplId=t.id})}
  S.workouts.push(...out);
  for(const w of wSorted())w.prs=detectPRs(w); // rekordok újraszámolása időrendben
  save();go('workout');
  dlg(`<h2>Import kész</h2><p><b>${out.length}</b> edzés és <b>${out.reduce((a,w)=>a+w.exercises.reduce((b,e)=>b+e.sets.length,0),0)}</b> sorozat importálva.${tplNew?`<br>${tplNew} sablon jött létre a gyakran használt edzésnevekből (az Edzéseim között).`:''}${created.size?`<br>Új gyakorlatok: ${[...created].map(esc).join(', ')}.`:''}</p><p class="hint">Az új gyakorlatokat a Beállítások → Gyakorlatok listában átnevezheted, kategorizálhatod.</p><div class="row end"><button class="btn p" data-click="dlgBackdrop()">Rendben</button></div>`,null);
}

/* ===== Beállítások: gyakorlatok, adatok ===== */
function vPrivacy(){
  const inst=matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const off=!!(navigator.serviceWorker&&navigator.serviceWorker.controller);
  const li=(ic,t)=>`<li class="privli"><span class="privic">${I(ic,'sm')}</span><span>${t}</span></li>`;
  return `<div class="card"><h2>Adatvédelem és offline működés</h2>
  <div class="row" style="gap:6px;margin-bottom:10px"><span class="chip ${inst?'on':''}" style="cursor:default">${I(inst?'check':'smartphone','sm')} ${inst?'Főképernyős appként fut':'Böngészőben fut'}</span><span class="chip ${off?'on':''}" style="cursor:default">${I(off?'check':'wifi-off','sm')} ${off?'Offline is elérhető':'Offline mód még nem aktív'}</span></div>
  <ul class="privlist small">
  ${li('hard-drive','<b>Minden adat csak ezen az eszközön van.</b> Nincs regisztráció, fiók, szerver, analitika, süti vagy követés. Az edzések, testadatok, étkezések és a profil a böngésző helyi tárhelyén maradnak; az app semmit nem küld el sehova.')}
  ${li('wifi-off','<b>Internet nélkül is működik.</b> Az első megnyitás után a teljes app a telefonon tárolódik, edzőteremben, térerő nélkül is használható. Ha van net, a frissítés automatikusan letöltődik.')}
  ${li('square-plus','<b>Natív appként is használható.</b> iPhone-on Safariban: <b>Megosztás</b> '+I('share','sm')+' → <b>Főképernyőhöz adás</b>. Androidon Chrome-ban: menü → <b>Alkalmazás telepítése</b>. Utána saját ikonról, teljes képernyőn, címsor nélkül indul, mint egy letöltött app.')}
  ${li('smartphone','<b>iPhone-on érdemes telepíteni.</b> A Safari a sokáig nem látogatott oldalak helyi adatait törölheti, a főképernyős appokra ez nem vonatkozik. A főképernyős app és a Safari <b>külön tárhelyet</b> használ: ami az egyikben van, az a másikban nem látszik – áthozni Mentés + Import segítségével lehet.')}
  ${li('save','<b>A mentés a te kezedben van.</b> Mivel nincs szerver, eszközcsere vagy az app törlése esetén csak a saját mentésedből állítható vissza minden. A <b>Mentés / megosztás</b> fájlt a Drive-ra, iCloudba vagy a Fájlokba teheted.')}
  ${li('external-link','<b>Étkezésnaplózás Claude-dal:</b> a gomb a Claude appot nyitja meg; amit ott leírsz vagy lefényképezel, az Anthropic szolgáltatásához kerül. Az Olupanba csak az kerül, amit vágólapról beillesztesz.')}
  </ul></div>`;
}
/* ===== Beállítások: témák szerinti főmenü, almenük (vissza: almenü → Beállítások → Ma) ===== */
const SUBS={methods:['Számítási módszerek'],profile:['Profil és célok'],look:['Megjelenés'],train:['Edzés'],food:['Étkezés'],data:['Adatok'],info:['Adatvédelem és offline működés']};
function openSub(k,anchor){const b=tab!=='more'?{tab,sub:null,y:scrollY}:back;setSub=k;tab='more';back=b;render();scrollTo(0,0);if(anchor)setTimeout(()=>{const el=document.getElementById(anchor);el&&el.scrollIntoView({block:'start'})},30)}
function vMore(){
  if(setSub==='profile')return vProfile()+`<div class="card" id="stepgoalc">
  <label for="stepgoal" style="margin-top:0">Napi lépéscél (nem kötelező)</label>
  <input id="stepgoal" type="number" min="0" max="100000" step="500" inputmode="numeric" value="${S.settings.stepGoal||''}" placeholder="${L('pl. 8000','e.g. 8000')}" data-change="setStepGoal(this.value)">
  <div class="hint">A statisztikában szaggatott vonal jelzi, a célt elérő napok zöldek. Üresen hagyva nincs cél.</div>
</div>`+adaptCard()+((S.profileLog||[]).length?`<button class="linkbtn" data-click="toggleLog()">${I('history','sm')} ${L('Változásnapló','Change log')} ${I(logOpen?'chevron-up':'chevron-down','sm')}</button>${logOpen?profLogCard():''}`:'');
  if(setSub==='look')return `<div class="card">
  <label translate="no">Nyelv · Language</label>
  <div class="chips" style="margin:0" translate="no">${[['hu','Magyar'],['en','English']].map(([v,l])=>`<button class="chip ${LANG===v?'on':''}" data-click="setLang('${v}')">${l}</button>`).join('')}</div>
  <label>Megjelenés</label>
  <div class="chips" style="margin:0">${[[null,'Rendszer szerint'],['light','Világos'],['dark','Sötét']].map(([v,l])=>`<button class="chip ${S.settings.theme===v?'on':''}" data-click="setTheme(${v?`'${v}'`:'null'})">${l}</button>`).join('')}</div>
  <label>Kiemelőszín</label>
  <div class="chips" style="margin:0">${[['cyan','Ciánkék'],['orange','Sötétnarancs'],['pink','Rózsaszín']].map(([v,l])=>`<button class="chip ${(S.settings.accent||'cyan')===v?'on':''}" data-click="setAccent('${v}')"><span class="sw sw-${v}"></span>${l}</button>`).join('')}</div>
  <div class="hint">A gombok, a kiválasztott elemek és az aktív menüpont színe, világos és sötét módban is.</div>
</div>`;
  if(setSub==='train'){const cats=[...new Set(S.exercises.map(exGroup))].sort(groupSort);
    const usage={};for(const w of S.workouts)for(const e of w.exercises)usage[e.exId]=(usage[e.exId]||0)+1;
    return `<div class="card">
  <label for="defrest" id="restset">Alapértelmezett pihenőidő (mp)</label>
  <input id="defrest" type="number" min="0" max="1800" step="15" value="${S.settings.rest??90}" data-change="setDefRest(this.value)">
  <div class="hint">Pipálás után indul. Gyakorlatonként felülírható (edzés közben a gyakorlat neve alatti időre koppintva, vagy lent a listában). 0 = kikapcsolva.</div>
  <label>Hangjelzés a pihenő végén</label>
  <div class="row" style="gap:6px">${[[0,'Ki'],[1,'Halk'],[2,'Közepes'],[3,'Hangos']].map(([v,l])=>`<button class="chip ${(S.settings.sound??3)===v?'on':''}" data-click="setSound(${v})">${l}</button>`).join('')}<button class="btn sm" data-click="testSound()">Teszt</button></div>
  <div class="hint">iPhone-on a némítás (csengő ki / Action gomb) a hangot is elnémítja, és a hangerőt a médiahangerő szabályozza. Lezárt képernyőnél vagy háttérben a böngésző szünetelteti az időzítőt – ezt a lenti ébren tartás megelőzi.</div>
  <label>Visszajelző hangok és rezgés</label>
  <div class="chips" style="margin:0">${[['uiSound','Gombok'],['typeSound','Gépelés'],['doneSound','Kész sorozat'],['haptic','Rezgés']].map(([k,l])=>`<button class="chip ${S.settings[k]!==false?'on':''}" data-click="setFx('${k}')" aria-pressed="${S.settings[k]!==false}">${S.settings[k]!==false?I('check','sm')+' ':''}${l}</button>`).join('')}</div>
  <div class="hint">Koppintásra halk kattanás, gépeléskor finom tikk, sorozat kipipálásakor rövid „siker” dallam és enyhe rezgés. A pihenő-hangjelzéstől függetlenül kapcsolhatók. A rezgés Androidon és iPhone-on iOS 18-tól működik; iPhone-on a némító kapcsoló a hangokat is elnémítja, és ha a billentyűzet kattanása be van kapcsolva az iOS-ben, a gépelés-hangot érdemes kikapcsolni.</div>
  <label>Értesítés a pihenő végén, ha az app háttérben van</label>
  ${notifSupported()?`<div class="chips" style="margin:0">${[[true,'Be'],[false,'Ki']].map(([v,l])=>`<button class="chip ${(S.settings.restNotify===true&&Notification.permission==='granted')===v?'on':''}" data-click="setRestNotify(${v})">${l}</button>`).join('')}</div>`:''}
  <div class="hint">Ha pihenő közben másik appra váltasz, a pihenő végén értesítés jelenik meg. Androidon, számítógépen és újabb iPhone-okon (iPhone 17-en kipróbálva) működik; régebbi iOS-en a rendszer a háttérbe tett webappot felfüggesztheti – ott visszatéréskor azonnal szól, és jelzi, mennyi ideje járt le. iPhone-on csak a főképernyőre telepített app küldhet értesítést.</div>
  <label>Képernyő ébren tartása edzés közben</label>
  ${wakeSupported()?`<div class="chips" style="margin:0">${[[true,'Be'],[false,'Ki']].map(([v,l])=>`<button class="chip ${(S.settings.wakeLock!==false)===v?'on':''}" data-click="setWake(${v})">${l}</button>`).join('')}</div>
  <div class="hint">Futó edzés alatt a képernyő nem sötétül el és nem zár le, így a pihenő-visszaszámlálás és a hangjelzés is működik. Az edzés befejezésekor automatikusan kikapcsol. Több akkumulátort fogyaszt.</div>`
  :`<div class="hint">Ez a böngésző nem támogatja (iPhone-on iOS 16.4 vagy újabb kell).</div>`}
</div>
  <div class="card" id="exlist"><div class="row" style="margin-bottom:4px"><h2 style="margin:0;flex:1">Gyakorlatok <span class="mut mono" style="font-size:14px">${S.exercises.length}</span></h2><button class="btn sm gold" data-click="newExFromList()">${I('plus','sm')} Új</button></div>
  ${cats.map(c=>`<h3 style="margin-top:16px">${esc(c)}</h3>`+S.exercises.filter(e=>exGroup(e)===c).sort(byName).map(e=>`<div class="row li"><span style="flex:1;min-width:0">${esc(e.name)}<br><span class="mut small mono">${e.eq?esc(lblOf(EQUIP,e.eq))+' · ':''}${e.rest!=null?`<span style="color:var(--kj-violet)">${I('timer','sm')} ${fmtSec(e.rest)}</span>`:`${I('timer','sm')} alap`}${usage[e.id]?` · ${usage[e.id]} edzés`:''}</span></span><button class="btn sm ico" data-click="editEx('${e.id}')" aria-label="Szerkesztés">${I('pencil','sm')}</button><button class="btn sm ico d" data-click="delEx('${e.id}')" aria-label="Törlés">${I('trash-2','sm')}</button></div>`).join('')).join('')}</div>
`}
  if(setSub==='food')return (S.settings.claudeUrl?'':`<div class="card notice"><div class="row li"><span class="nd"></span><span class="small" style="flex:1">${L('Étkezésnapló Claude-dal, két lépésben: <b>1.</b> állítsd be lent az étkezési preferenciáidat (ezekből készül a menü- és receptjavaslat), <b>2.</b> hozd létre a Claude-projektet az útmutató alapján, és másold be a linkjét.','Food log with Claude in two steps: <b>1.</b> set your food preferences below (meal and recipe suggestions are built from them), <b>2.</b> create the Claude project following the guide and paste its link.')} <button class="linkbtn" style="display:inline;width:auto;padding:0" data-click="whyClaude()">${L('Mire jó ez?','What is this for?')}</button></span></div></div>`)+vFoodPrefs()+(S.settings.foodPrefs&&!S.settings.claudeUrl&&targets().kcal?`<div class="card" style="border-color:color-mix(in srgb,var(--kj-blue) 50%,transparent)"><div class="small" style="margin-bottom:10px">${L('Ha készen vagy a preferenciákkal, nyisd meg a Claude-projekt létrehozásának útmutatóját.','When you’re done with your preferences, open the guide to creating the Claude project.')}</div><button class="btn p block" data-click="foodHelp()">${I('external-link','sm')} ${L('Claude-projekt útmutató','Claude project guide')}</button></div>`:'')+`<div class="card">
  <label for="claudeurl">Claude-projekt linkje (étkezésnapló)</label>
  <div class="row" style="flex-wrap:nowrap;gap:8px"><input id="claudeurl" style="flex:1;min-width:0" type="url" inputmode="url" autocomplete="off" value="${esc(S.settings.claudeUrl||'')}" placeholder="https://claude.ai/project/…" data-change="setClaudeUrl(this.value)">${S.settings.claudeUrl?`<a class="btn" href="${esc(S.settings.claudeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Claude-projekt megnyitása">${I('external-link','sm')} Megnyitás</a>`:''}</div>
  <div class="hint">${S.settings.claudeUrl?'A Megnyitás gomb új böngészőlapon nyitja meg a projektet – itt cserélheted az utasítást vagy a receptfájlt.':'Nyisd meg a Claude-ot ugyanabban a böngészőben, amelyben az Olupant használod (ne a Claude appot – ott nincs kimásolható webcím), jelentkezz be vagy regisztrálj, hozz létre egy projektet, és másold be ide a linkjét a címsorból.'}${targets().kcal?'':' Az útmutató a profil kitöltése után érhető el, mert a projekt utasításába a napi célok is belekerülnek.'}</div>
  ${S.settings.claudeUrl?'':`<a class="btn block" style="margin-top:10px" href="https://claude.ai/" target="_blank" rel="noopener noreferrer">${I('external-link','sm')} Claude megnyitása (claude.ai)</a>`}
  <div class="row" style="margin-top:12px"><button class="btn" data-click="foodHelp()" ${targets().kcal?'':'disabled'}>${I('external-link','sm')} Claude-projekt útmutató</button><button class="btn" data-click="downloadRecipes()">${I('download','sm')} Receptfájl letöltése</button></div></div>`;
  if(setSub==='data')return storeCard()+`
  <div class="card"><h2>Mentés</h2><div class="hint" style="margin:0 0 12px">Minden adat csak ezen az eszközön, a böngésző helyi tárhelyén van – semmi nem kerül szerverre. A <b>Mentés / megosztás</b> a telefon megosztás menüjét nyitja meg: innen menthetsz Google Drive-ra, a Fájlok appba vagy iCloud Drive-ra. Visszatöltés: <b>Import</b>, majd a fájl kiválasztása (a Drive is megjelenik a fájlválasztóban, ha telepítve van).</div>
  <div class="stat" style="margin-bottom:12px"><b style="font-size:16px">${S.settings.lastBackup?fmtDate(S.settings.lastBackup)+' · '+fmtTime(S.settings.lastBackup):'Még nem volt'}</b><span>Utolsó mentés</span></div>
  <label for="bkev">${L('Emlékeztető, ha nincs mentés','Reminder if there’s no backup')}</label><select id="bkev" data-change="setBackupEvery(this.value)" style="margin-bottom:12px">${[[1,L('naponta','daily')],[7,L('hetente','weekly')],[14,L('kéthetente','every two weeks')],[0,L('kikapcsolva','off')]].map(([v,l])=>`<option value="${v}" ${S.settings.backupEvery===v?'selected':''}>${l}</option>`).join('')}</select>
  <div class="row"><button class="btn p" data-click="exportData()">${I(canShareFiles()?'share':'download','sm')} Mentés / megosztás</button><button class="btn" data-click="openImport()">${I('folder-open','sm')} Import</button><input type="file" id="imp" accept=".json,application/json" style="display:none" data-change="importData(this)"></div>
  <h3 style="margin-top:16px" id="csv">Export CSV-ben</h3>
  <div class="csvgrid">${[['workouts','Edzések','sorozatonként'],['body','Testadatok','napi'],['steps','Lépések','napi'],['meals','Étkezés – tételek','makrók, rost'],['mealdays','Étkezés – napi','összesítő']].map(([k,l,h])=>`<button class="btn sm" data-click="exportCsv('${k}')">${I('download','sm')} <span style="text-align:left">${l}<br><small class="mut">${h}</small></span></button>`).join('')}</div>
  <div class="hint">A magyar táblázatok pontosvesszővel és tizedesvesszővel készülnek (Excel, Numbers közvetlenül megnyitja). Az edzések sorozatonként egy sorban, így ide vissza is importálhatók.</div>
  <h3 style="margin-top:16px" id="strong">Import</h3>
  <div class="row" style="margin-top:6px"><button class="btn" data-click="openStrong()">${I('upload','sm')} Edzések importálása (CSV)</button><button class="btn" data-click="importSample()">${I('download','sm')} Minta</button><input type="file" id="impStrong" accept=".csv,text/csv,text/comma-separated-values" style="display:none" data-change="importStrong(this)"></div>
  <div class="hint">Soronként egy sorozat. Kötelező oszlopok: <b>Date</b> (ÉÉÉÉ-HH-NN ÓÓ:PP), <b>Exercise Name</b>, <b>Weight</b> (kg), <b>Reps</b>; ajánlott: <b>Workout Name</b>, <b>Set Order</b>, <b>Duration</b> (pl. 55m), kardióhoz <b>Distance</b> (km) és <b>Seconds</b>. Az azonos dátumú és nevű sorokból lesz egy edzés. Elválasztó: vessző vagy pontosvessző. A <b>Minta</b> gomb egy kitölthető példafájlt ad. Az edzéseket hozzáadja a meglévőkhöz; az azonos kezdési idejűeket kihagyja.</div>
  <div class="row" style="margin-top:10px">${S.settings.demo?`<button class="btn d" data-click="clearDemo()">${L('Mintaadatok törlése','Delete sample data')}</button>`:S.workouts.length||S.meals.length?'':`<button class="btn gold" data-click="demoData()">Mintaadatok</button>`}<span class="sp"></span><button class="btn d" data-click="resetAll()">${I('trash-2','sm')} Minden törlése</button></div></div>
`;
  if(setSub==='info')return vPrivacy();
  if(setSub==='methods')return vMethods();
  return vSetMenu();
}
function vSetMenu(){
  const t=targets(),st=S.settings,onoff=v=>v?L('Be','On'):L('Ki','Off');
  const row=(label,val,attr,cls='')=>`<button class="setrow${cls}" ${attr}><span>${label}</span>${val?`<span class="sv">${val}</span>`:''}${I('chevron-right','sm')}</button>`;
  const grp=(title,rows)=>`<h3 class="setgrp">${title}</h3><div class="card setcard">${rows}</div>`;
  const p=S.profile||{},pages=LANG==='en'?[['guide.html','Felhasználói útmutató'],['privacy.html','Adatkezelési tájékoztató'],['disclaimer.html','Jogi nyilatkozat']]:[['utmutato.html','Felhasználói útmutató'],['adatvedelem.html','Adatkezelési tájékoztató'],['jogi-nyilatkozat.html','Jogi nyilatkozat']];
  const base=location.protocol==='file:'?'https://olupan.com/':'/';
  const acc=st.accent||'cyan';
  return grp('Profil és célok',row('Profil',[p.height?p.height+' cm':'',p.birthYear||''].filter(Boolean).join(' · ')||(profileMissing().length?L('hiányos','incomplete'):''),`data-click="openSub('profile')"`)+row('Kalória- és makrócélok',t.kcal?fmt(t.kcal,0)+' kcal':'',`data-click="openSub('profile','pkc')"`)+row('Napi lépéscél',st.stepGoal?fmt(st.stepGoal,0):'',`data-click="openSub('profile','stepgoal')"`))
  +grp('Megjelenés',row('Téma',{light:L('Világos','Light'),dark:L('Sötét','Dark')}[st.theme]||L('Rendszer szerint','System'),`data-click="openSub('look')"`)
    +`<div class="setrow sw3"><span>Kiemelőszín</span>${[['cyan','Ciánkék'],['orange','Sötétnarancs'],['pink','Rózsaszín']].map(([v,l])=>`<button class="swb sw-${v}${acc===v?' on':''}" data-click="setAccent('${v}')" aria-label="${l}" aria-pressed="${acc===v}"></button>`).join('')}</div>`
    +row('Nyelv',LANG==='en'?'English':'Magyar',`data-click="openSub('look')"`))
  +grp('Edzés',row('Alapértelmezett pihenőidő',fmtSec(st.rest??90),`data-click="openSub('train','restset')"`)+row('Hangok és rezgés',onoff((st.sound??3)>0||st.uiSound!==false),`data-click="openSub('train')"`)+row('Értesítés a pihenő végén',onoff(st.restNotify===true&&notifSupported()&&Notification.permission==='granted'),`data-click="openSub('train')"`)+row('Képernyő ébren tartása',onoff(st.wakeLock!==false),`data-click="openSub('train')"`)+row('Gyakorlatok',String(S.exercises.length),`data-click="openSub('train','exlist')"`))
  +grp('Étkezés',row('Étkezési preferenciák',(()=>{const f=fprefs(),n=f.diet.length+f.style.length+(f.avoid?1:0);return n?String(n):''})(),`data-click="openSub('food','fprefs')"`)+row('Claude-projekt és receptfájl',st.claudeUrl?L('beállítva','set'):'',`data-click="openSub('food')"`))
  +grp('Egészség',row('Lépés, súly, testzsír az iPhone-ról','',`data-click="stepsHelp()"`))
  +grp('Adatok',row('Mentés',st.lastBackup?fmtDate(st.lastBackup):L('még nem volt','never'),`data-click="openSub('data')"`)+row('Export CSV-be','',`data-click="openSub('data','csv')"`)+row('Importálás','',`data-click="openSub('data','strong')"`)+row('Minden adat törlése','',`data-click="resetAll()"`,' danger'))
  +grp('Tudnivalók',pages.map(([h,l])=>`<a class="setrow" href="${base}${h}"><span>${l}</span>${I('chevron-right','sm')}</a>`).join('')+row('Adatvédelem és offline működés','',`data-click="openSub('info')"`)+row('Számítási módszerek','',`data-click="openSub('methods')"`))
  +`<div class="hint" style="text-align:center;margin:16px 0 4px">Az Olupan nem orvosi alkalmazás; a javasolt értékek tájékoztató becslések.</div><div class="hint" style="text-align:center;margin:4px 0">© 2026 Rácz Zoltán · Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)</div>`;
}
async function editEx(id){const e=exById(id);const r=await form('Gyakorlat szerkesztése',exFields(e));if(!r||!r.name)return;
  if(S.exercises.some(x=>x.id!==id&&x.name.toLowerCase()===r.name.toLowerCase())){toast('Már létezik ilyen nevű gyakorlat');return}applyEx(e,r);save();render()}
async function delEx(id){if(S.workouts.some(w=>w.exercises.some(e=>e.exId===id))){toast('Edzésben már szerepel – csak szerkeszthető');return}
  if(!await ask(`Törlöd a(z) <b>${esc(exName(id))}</b> gyakorlatot? A sablonokból is kikerül.`,{title:'Gyakorlat törlése',ok:'Törlés',danger:true}))return;
  S.exercises=S.exercises.filter(e=>e.id!==id);S.templates.forEach(t=>t.items=t.items.filter(i=>i.exId!==id));save();render()}
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function canShareFiles(){try{return !!(navigator.canShare&&navigator.canShare({files:[new File(['{}'],'t.json',{type:'application/json'})]}))}catch(e){return false}}
async function shareOrDownload(name,text,type,title){title=T(title);
  const file=new File([text],name,{type});
  if(canShareFiles()){
    try{await navigator.share({files:[file],title});return true}
    catch(e){if(e&&e.name==='AbortError')return false} // a felhasználó bezárta a menüt
  }
  download(name,text,type);return true;
}
async function exportData(){
  const now=Date.now(),snap=JSON.stringify(Object.assign({},S,{settings:Object.assign({},S.settings,{lastBackup:now})}));
  if(await shareOrDownload('olupan-'+today()+'.json',snap,'application/json','Olupan mentés')){S.settings.lastBackup=now;save();if(tab==='more'||tab==='workout')render();toast('Mentés kész')}
}
/* ===== CSV-export =====
   Magyar táblázatok: pontosvessző, tizedesvessző, UTF-8 BOM (Excel/Numbers helyesen nyitja).
   Edzések: a Strong app formátumában (vessző, tizedespont, angol fejléc) – ugyanígy vissza is importálható. */
function csvCell(v,sep){if(v==null)return'';let s=String(v);if(/^[=+\-@\t\r]/.test(s)&&isNaN(+s))s="'"+s; // képletbefecskendezés ellen
  return /["\n\r]/.test(s)||s.includes(sep)?'"'+s.replace(/"/g,'""')+'"':s}
function csvBuild(head,rows,sep=LANG==='en'?',':';'){return'﻿'+[head,...rows].map(r=>r.map(c=>csvCell(c,sep)).join(sep)).join('\r\n')}
const hu=(v,d=1)=>v==null||v===''||isNaN(v)?'':String(Math.round(v*10**d)/10**d).replace('.',LANG==='en'?'.':',');
const CSVH=(h,e)=>LANG==='en'?e:h;
const CSVN_EN={edzesek:'workouts',testadatok:'body-data',lepesek:'steps','etkezes-tetelek':'food-items','etkezes-napi':'food-daily'};
const csvName=n=>`olupan-${LANG==='en'?CSVN_EN[n]||n:n}-${today()}.csv`;
function csvWorkouts(){
  const z=n=>String(n).padStart(2,'0'),dt=ts=>{const d=new Date(ts);return`${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`};
  const durS=w=>{const m=Math.max(1,Math.round((w.end-w.start)/60000)),h=Math.floor(m/60);return(h?h+'h ':'')+(m%60)+'m'};
  const rows=[];for(const w of wSorted())for(const e of w.exercises){const cd=isCardio(e.exId);let k=0;e.sets.forEach(s=>rows.push([dt(w.start),T(w.name),durS(w),T(exName(e.exId)),s.wu?'W':s.st?SET_TAG[s.st]:++k,cd?0:s.w,cd?0:s.r,cd?s.w||0:0,cd?(s.r||0)*60:0,'','','']))}
  return csvBuild(['Date','Workout Name','Duration','Exercise Name','Set Order','Weight','Reps','Distance','Seconds','Notes','Workout Notes','RPE'],rows,',');
}
function csvBody(){const rows=bodySorted().filter(hasMeas).map(b=>{const fm=b.weight!=null&&b.fat!=null?b.weight*b.fat/100:null;return[b.date,hu(b.weight),hu(b.fat),hu(fm),fm==null?'':hu(b.weight-fm),hu(b.waist),hu(b.chest),hu(b.arm),hu(b.hip),hu(b.thigh)]});
  return csvBuild(CSVH(['datum','testsuly_kg','testzsir_szazalek','zsirtomeg_kg','zsirmentes_tomeg_kg','derekboseg_cm','mellkas_cm','felkar_cm','csipo_cm','comb_cm'],['date','weight_kg','body_fat_pct','fat_mass_kg','lean_mass_kg','waist_cm','chest_cm','arm_cm','hip_cm','thigh_cm']),rows)}
function csvSteps(){return csvBuild(CSVH(['datum','lepes'],['date','steps']),bodySorted().filter(b=>b.steps!=null).map(b=>[b.date,b.steps]))}
function csvMealItems(){const ord=k=>MEALS.findIndex(m=>m[0]===k);
  const rows=[...S.meals].sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:ord(a.meal)-ord(b.meal)).map(m=>[m.date,T(mealLbl(m.meal)),m.name,m.kcal,hu(m.p),hu(m.c),hu(m.f),hu(m.fib)]);
  return csvBuild(CSVH(['datum','etkezes','megnevezes','energia_kcal','feherje_g','szenhidrat_g','zsir_g','rost_g'],['date','meal','name','energy_kcal','protein_g','carbs_g','fat_g','fiber_g']),rows)}
function csvMealDays(){const by={};for(const m of S.meals)(by[m.date]=by[m.date]||[]).push(m);const t=targets();
  const rows=Object.keys(by).sort().map(d=>{const s=sumMeals(by[d]);return[d,by[d].length,Math.round(s.kcal),hu(s.p),hu(s.c),hu(s.f),hu(s.fib),t.kcal||'',t.kcal?Math.round(s.kcal-t.kcal):'']});
  return csvBuild(CSVH(['datum','tetelek','energia_kcal','feherje_g','szenhidrat_g','zsir_g','rost_g','javasolt_kcal','elteres_kcal'],['date','items','energy_kcal','protein_g','carbs_g','fat_g','fiber_g','suggested_kcal','difference_kcal']),rows)}
const CSV_EXP={workouts:['edzesek',csvWorkouts,()=>S.workouts.length],body:['testadatok',csvBody,()=>S.body.filter(hasMeas).length],steps:['lepesek',csvSteps,()=>S.body.filter(b=>b.steps!=null).length],
  meals:['etkezes-tetelek',csvMealItems,()=>S.meals.length],mealdays:['etkezes-napi',csvMealDays,()=>new Set(S.meals.map(m=>m.date)).size]};
async function exportCsv(k){const x=CSV_EXP[k];if(!x)return;if(!x[2]()){toast('Ehhez még nincs adat');return}
  if(await shareOrDownload(csvName(x[0]),x[1](),'text/csv','Olupan – '+x[0]))toast('CSV elkészült')}

async function importData(inp){const f=inp.files[0];inp.value='';if(!f)return;
  let d;try{if(f.size>20e6)throw 0;d=sanitizeState(JSON.parse(await f.text()))}catch(e){toast('Hibás vagy nem támogatott fájl');return}
  if(!await ask(`A fájlban ${d.workouts.length} edzés és ${d.body.length} mérés van. Felülírja a jelenlegi adatokat?`,{title:'Importálás',ok:'Felülírás',danger:true}))return;
  if(d.v<DATA_V){addDefaults(d);d.v=DATA_V}S=d;save();applyTheme();render();toast('Importálva')}
function obSkip(k){if(k==='obSteps'||k==='obClaude'){S.settings[k]=true;save();render()}}
function setBackupEvery(v){S.settings.backupEvery=[0,1,7,14].includes(+v)?+v:7;save();toast(L('Mentve','Saved'))}
async function resetAll(){if(!await ask('Minden edzés, mérés, sablon és saját gyakorlat törlődik erről az eszközről. Érdemes előtte exportálni.',{title:'Minden adat törlése',ok:'Tovább',danger:true}))return;
  if(!await ask('Ez nem vonható vissza. Biztosan törlöd?',{title:'Utolsó megerősítés',ok:'Végleges törlés',danger:true}))return;const th=S.settings.theme,ac=S.settings.accent;S=defaults();S.settings.theme=th;S.settings.accent=ac;rest=null;save();homeDay=today();go('home')}
async function demoData(){
  if(S.workouts.length||S.meals.length){toast('Mintaadat csak üres naplóba tölthető be');return}
  if(!await ask(L('Kb. 4 hónapnyi mintaadatot (edzéseket, méréseket és étkezéseket) töltök be, hogy lásd, hogyan működik az app. Mielőtt valódi használatba veszed, töröld őket: a figyelmeztető kártyán vagy a Beállítások → Adatok alatt.','I’ll load about 4 months of sample data (workouts, measurements and meals) so you can see how the app works. Delete it before you start using the app for real: on the notice card or under Settings → Data.'),{title:'Mintaadatok',ok:'Betöltés'}))return;
  const base={'Fekvenyomás (rúd)':70,'Ferde fekvenyomás (kézisúlyzó)':24,'Katonai nyomás (rúd)':42,'Oldalemelés (kézisúlyzó)':9,'Tricepsz letolás (kábel)':30,'Felhúzás (rúd)':110,'Evezés (rúd)':60,'Húzódzkodás':0,'Mellhez húzás (kábel)':55,'Bicepsz hajlítás (kézisúlyzó)':12,'Guggolás (rúd)':90,'Román felhúzás (rúd)':80,'Lábtolás (gép)':160,'Kitörés (kézisúlyzó)':18,'Vádliemelés (gép)':70,
    'KB swing (egykezes)':20,'KB swing (kétkezes)':24,'KB török felállás (get-up)':16,'KB goblet guggolás':24,'KB clean & press':16,'KB evezés':24,'KB halo':12,'KB clean':20,'KB snatch':16,'KB front rack guggolás':20,'KB windmill':12};
  const kb=n=>n.startsWith('KB ');
  const t0=new Date();t0.setHours(0,0,0,0);let wt=88,fat=23.5,waist=94,k=0;const tpls=S.templates.filter(t=>t.items.length);
  for(let i=120;i>=1;i--){const d=new Date(t0);d.setDate(d.getDate()-i);const key=ymd(d);
    wt+=-0.03+(Math.random()-.5)*.55;fat-=.018;waist-=.03;
    if(Math.random()<.8&&!S.body.some(b=>b.date===key)){const e={date:key,weight:+wt.toFixed(1)};if(d.getDay()===1){e.fat=+(fat+(Math.random()-.5)*.6).toFixed(1);e.waist=+(waist+(Math.random()-.5)).toFixed(1)}S.body.push(e)}
    {let b=S.body.find(x=>x.date===key);if(!b){b={date:key};S.body.push(b)}if(b.steps==null)b.steps=Math.round(4500+Math.random()*9500)}
    if(tpls.length&&[1,2,4,6].includes(d.getDay())&&Math.random()<.85){const t=tpls[k++%tpls.length],prog=1+(120-i)*.0011;
      const st=new Date(d);st.setHours(17,30+Math.floor(Math.random()*40));
      const w={id:uid(),name:t.name,tplId:t.id,start:st.getTime(),end:st.getTime()+(45+Math.random()*30)*60000,exercises:t.items.map(it=>{const n=exName(it.exId),b=base[n]??20;
        return{exId:it.exId,sets:Array.from({length:it.sets},(_,j)=>isCardio(it.exId)?{w:Math.round((4+Math.random()*6+(120-i)/40)*10)/10,r:Math.round(25+Math.random()*25)}:kb(n)?{w:b+(i<50?4:0),r:n.includes('get-up')?1:n.includes('halo')||n.includes('windmill')?5:10}:b?{w:Math.round(b*prog*(Math.random()<.15?1.03:1)/2.5)*2.5,r:Math.max(3,8-j-Math.floor(Math.random()*2))}:{w:0,r:Math.round(6+(120-i)/30+Math.random()*2-j)})}})};
      w.prs=detectPRs(w);S.workouts.push(w)}}
  {const F=[['reggeli','Zabkása 60 g tejjel, banán',420,16,68,9,8],['reggeli','Rántotta 3 tojásból, kenyér',480,26,30,27,3],['tizorai','Görög joghurt 200 g',190,18,8,9,0],['ebed','Csirkemell 150 g, rizs 180 g',490,51,52,7,2],['ebed','Bolognai spagetti',680,34,82,22,7],['uzsonna','Alma, mandula 30 g',260,7,27,15,8],['vacsora','Lazac 150 g, zöldség',430,34,12,27,6],['vacsora','Túrós tészta',620,30,80,19,3],['nasi','Fehérjeszelet',210,20,22,7,4]];
   const t0=new Date();t0.setHours(0,0,0,0);
   for(let i=60;i>=1;i--){if(Math.random()<.15)continue;const d=new Date(t0);d.setDate(d.getDate()-i);const key=ymd(d);if(S.meals.some(m=>m.date===key))continue;
     for(const mk of['reggeli','ebed','uzsonna','vacsora']){if(mk==='uzsonna'&&Math.random()<.4)continue;const o=F.filter(x=>x[0]===mk||(mk==='uzsonna'&&x[0]==='tizorai')),x=o[Math.floor(Math.random()*o.length)],k=.85+Math.random()*.3;
       S.meals.push({id:uid(),date:key,meal:mk,name:x[1],kcal:Math.round(x[2]*k),p:Math.round(x[3]*k),c:Math.round(x[4]*k),f:Math.round(x[5]*k),fib:Math.round(x[6]*k)})}}}
  S.settings.demo=true;save();toast('Mintaadatok betöltve');render();
}
/* Mintaadatok törlése: edzések, mérések, étkezések, tervek; a beállítások, a profil, a sablonok és a gyakorlatok maradnak */
async function clearDemo(){if(!await ask(L('A mintaadatok (edzések, mérések, étkezések) törlődnek. A beállításaid, a profilod és a sablonok megmaradnak.','The sample data (workouts, measurements, meals) will be deleted. Your settings, profile and templates stay.'),{title:L('Mintaadatok törlése','Delete sample data'),ok:L('Törlés','Delete'),danger:true}))return;
  S.workouts=[];S.body=[];S.meals=[];S.plans={};S.active=null;delete S.settings.demo;rest=null;save();homeDay=today();toast(L('Mintaadatok törölve','Sample data deleted'));go('home')}

S=load();
LANG=S.settings.lang||detectLang();
tab=S.active?'workout':'home';
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){
  const had=!!navigator.serviceWorker.controller;
  addEventListener('load',()=>navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(e=>console.warn('Service worker:',e)));
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)toast(L('Új verzió telepítve – a következő indításkor aktív','New version installed – active from the next start'))});
}
applyTheme();applyLang();render();bootStore();
