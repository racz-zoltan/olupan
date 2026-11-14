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
const addDays=(s,n)=>{const d=pYmd(s);d.setDate(d.getDate()+n);return ymd(d)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* ===== Nyelv / i18n: magyar a forrásnyelv; angolnál a DOM-ot fordítjuk szótár alapján ===== */
const EN={"Fekvenyomás (rúd)":"Bench press (barbell)","Ferde fekvenyomás (kézisúlyzó)":"Incline bench press (dumbbell)","Fekvenyomás (kézisúlyzó)":"Bench press (dumbbell)","Tárogatás (kábel)":"Chest fly (cable)","Tolódzkodás":"Dips","Felhúzás (rúd)":"Deadlift (barbell)","Hát":"Back","Evezés (rúd)":"Bent-over row (barbell)","Húzódzkodás":"Pull-up","Mellhez húzás (kábel)":"Lat pulldown (cable)","Evezés ülve (kábel)":"Seated row (cable)","Evezés (kézisúlyzó)":"Row (dumbbell)","Guggolás (rúd)":"Squat (barbell)","Láb":"Legs","Román felhúzás (rúd)":"Romanian deadlift (barbell)","Lábtolás (gép)":"Leg press (machine)","Kitörés (kézisúlyzó)":"Lunge (dumbbell)","Lábhajlítás (gép)":"Leg curl (machine)","Lábnyújtás (gép)":"Leg extension (machine)","Csípőemelés (rúd)":"Hip thrust (barbell)","Vádliemelés (gép)":"Calf raise (machine)","Katonai nyomás (rúd)":"Overhead press (barbell)","Váll":"Shoulders","Vállból nyomás (kézisúlyzó)":"Shoulder press (dumbbell)","Oldalemelés (kézisúlyzó)":"Lateral raise (dumbbell)","Face pull (kábel)":"Face pull (cable)","Bicepsz hajlítás (kézisúlyzó)":"Biceps curl (dumbbell)","Bicepsz hajlítás (rúd)":"Biceps curl (barbell)","Kalapács hajlítás":"Hammer curl","Tricepsz letolás (kábel)":"Triceps pushdown (cable)","Francia nyomás":"Skull crusher","Hasprés":"Crunch","Törzs":"Core","Lábemelés függésben":"Hanging leg raise","Hasgörgő":"Ab wheel rollout","Kettlebell swing (kétkezes)":"Kettlebell swing (two-handed)","Kettlebell swing (egykezes)":"Kettlebell swing (one-handed)","Kettlebell goblet guggolás":"Kettlebell goblet squat","Kettlebell török felállás (get-up)":"Kettlebell Turkish get-up","Kettlebell nyomás (egykezes)":"Kettlebell press (one-handed)","Kettlebell evezés":"Kettlebell row","Kettlebell felhúzás":"Kettlebell deadlift","Kettlebell front rack guggolás":"Kettlebell front rack squat","Fekvőtámasz":"Push-up","Saját testsúly":"Bodyweight","Pike fekvőtámasz":"Pike push-up","Ausztrál húzódzkodás":"Inverted row","Guggolás (saját testsúly)":"Squat (bodyweight)","Kitörés (saját testsúly)":"Lunge (bodyweight)","Bolgár guggolás (saját testsúly)":"Bulgarian split squat (bodyweight)","Csípőemelés (saját testsúly)":"Glute bridge (bodyweight)","Plank (mp)":"Plank (s)","Hegymászó":"Mountain climber","Futás (terep)":"Running (trail)","Kardió":"Cardio","Futás (aszfalt)":"Running (road)","Futópad":"Treadmill","Kerékpár (kültéri)":"Cycling (outdoor)","Terembicikli":"Stationary bike","Evezőgép":"Rowing machine","Elliptikus tréner":"Elliptical","Lépcsőzőgép":"Stair climber","Gyaloglás":"Walking","Túrázás":"Hiking","Úszás":"Swimming","Ugrókötél":"Jump rope","Koncentrált bicepszhajlítás (kézisúlyzó)":"Concentration curl (dumbbell)","Bolgár guggolás (kézisúlyzó)":"Bulgarian split squat (dumbbell)","Padlón nyomás (kézisúlyzó)":"Floor press (dumbbell)","Román felhúzás (kézisúlyzó)":"Romanian deadlift (dumbbell)","Goblet guggolás (kézisúlyzó)":"Goblet squat (dumbbell)","Lábemelés fekve":"Lying leg raise","Push – mell, váll, tricepsz":"Push – chest, shoulders, triceps","Pull – hát, bicepsz":"Pull – back, biceps","Kettlebell – teljes test":"Kettlebell – full body","Kettlebell – ballisztikus":"Kettlebell – ballistic","Saját testsúly – teljes test":"Bodyweight – full body","Saját testsúly – felsőtest":"Bodyweight – upper body","Saját testsúly – láb és törzs":"Bodyweight – legs and core","Kardió – gépek (terem)":"Cardio – machines (gym)","Kardió – szabadtéri":"Cardio – outdoor","Kézisúlyzó A – húzó + láb":"Dumbbell A – pull + legs","Kézisúlyzó B – nyomó + láb":"Dumbbell B – push + legs","Kézisúlyzó":"Dumbbell","Húzódzkodás (fordított fogás)":"Chin-up","Mell":"Chest","Kar":"Arms","Padlón nyomás (rúd)":"Floor press (barbell)","Guggolás (kézisúlyzó)":"Squat (dumbbell)","Állig húzás (rúd)":"Upright row (barbell)","Állig húzás (kézisúlyzó)":"Upright row (dumbbell)","Arnold-nyomás (kézisúlyzó)":"Arnold press (dumbbell)","Előreemelés (kézisúlyzó)":"Front raise (dumbbell)","Ferde pados bicepszhajlítás (kézisúlyzó)":"Incline curl (dumbbell)","Tricepsz nyújtás (rúd)":"Triceps extension (barbell)","Tricepsz nyújtás (kézisúlyzó)":"Triceps extension (dumbbell)","Vádliemelés állva (kézisúlyzó)":"Standing calf raise (dumbbell)","Edzés":"Workout","Étkezés":"Food","Naptár":"Calendar","Test":"Body","Statisztika":"Stats","Beállítások":"Settings","Edzőterem":"Gym","Kézisúlyzó (otthon)":"Dumbbell (home)","(otthon)":"(home)","Betöltési hiba":"Loading error","Mentés sikertelen (tárhely?)":"Saving failed (storage full?)","(törölt gyakorlat)":"(deleted exercise)","leghosszabb táv":"longest distance","leghosszabb idő":"longest time","max súly":"max weight","ismétlés":"reps","becs. 1RM":"est. 1RM","Megerősítés":"Confirm","Mégse":"Cancel","Mentés":"Save","Rendben":"OK","Ismeretlen művelet:":"Unknown action:","Hibás argumentum:":"Invalid argument:","Mentve":"Saved","Egyéb":"Other","Edzés folyamatban":"Workout in progress","Edzés folytatása":"Resume workout","Testadatok":"Body data","Edzésnapló":"Olupan","Pihenő":"Rest","Pihenő leállítása":"Stop rest timer","A személyes egészségcélok elérése érdekében töltsd ki a profiladatokat":"Fill in your profile to get personal health targets","napja nem mentettél":"days since your last backup","Még nem készült mentés":"No backup yet","– az adatok csak ezen az eszközön vannak":"– your data exists only on this device","születési év":"birth year","magasság":"height","aktivitás":"activity","hónapja":"months ago","éve":"years ago","Sablon szerkesztése":"Edit template","Indítás":"Start","Üres sablon":"Empty template","Utoljára:":"Last:","Még nem használt":"Not used yet","Üres edzés indítása":"Start empty workout","Befejezés után a dátummal és időponttal elmentődik az Edzéseim közé – onnan átnevezhető, módosítható, törölhető.":"When finished, it’s saved under My workouts with its date and time – you can rename, edit or delete it there.","Edzéseim":"My workouts","Legutóbbi edzések":"Recent workouts","Kevesebb mutatása":"Show less","Edzéstörténet":"Workout history","· további":"·","további":"more","Régebbi edzések a Naptárban":"Older workouts are in the Calendar","Új sablon":"New template","Sablonok":"Templates","Minden sablon használatban van – fent, az Edzéseim között találod őket.":"All templates are in use – you’ll find them above, under My workouts.","Még nincs sablon.":"No templates yet.","perc kardió":"min cardio","kg volumen":"kg volume","Ismétlés":"Repeat","Sablonként":"As template","Edzés törlése":"Delete workout","Már fut egy edzés. Elveted, és újat indítasz? A rögzített sorozatai elvesznek.":"A workout is already running. Discard it and start a new one? Its logged sets will be lost.","Futó edzés":"Running workout","Elvetés és új":"Discard and start new","Edzés –":"Workout –","Edzés neve":"Workout name","A képernyő nem kapcsol ki edzés közben":"The screen stays on during the workout","ébren":"awake","Pihenőidő ennél a gyakorlatnál":"Rest time for this exercise","Eltávolítás":"Remove","Előző":"Previous","Fel":"Up","Le":"Down","Sorozat kész":"Set done","Sorozat":"Set","· alap":"· default","alap":"default","Táv (km)":"Distance (km)","Súly":"Weight","Idő (perc)":"Time (min)","Perc":"Min","Ism.":"Reps","ism.":"reps","Első alkalom":"First time","Gyakorlat hozzáadása":"Add exercise","Elvetés":"Discard","Edzés befejezése":"Finish workout","Add meg az időt (perc)":"Enter the time (min)","Add meg az ismétlésszámot":"Enter the reps","Eltávolítod a(z)":"Remove","gyakorlatot az edzésből?":"from the workout?","Biztosan elveted az edzést? A rögzített sorozatok elvesznek.":"Discard this workout? Logged sets will be lost.","Edzés elvetése":"Discard workout","Nincs teljesített (pipált) sorozat. Elveted az edzést?":"No completed (checked) sets. Discard the workout?","Üres edzés":"Empty workout","nem pipált sorozat van – ezek nem kerülnek mentésre. Befejezed az edzést?":"unchecked set(s) – these won’t be saved. Finish the workout?","Befejezés":"Finish","Edzés kész":"Workout complete","Sablon frissítése":"Update template","Elmentve az Edzéseim közé":"Saved to My workouts","Sablon frissítve":"Template updated","Mentés sablonként":"Save as template","Sablon neve":"Template name","Sablon mentve":"Template saved","Törlöd a(z)":"Delete the","edzést (":"workout (","Törlés":"Delete","Pihenőidő":"Rest time","Pihenő sorozatok között (mp)":"Rest between sets (s)","alapértelmezett:":"default:","Üresen hagyva a Beállításokban megadott alapértelmezést használja. 0 = nincs pihenőszámláló.":"Leave empty to use the default from Settings. 0 = no rest timer.","Következő sorozat:":"Next set:","Következő sorozat":"Next set","Pihenő vége":"Rest over","Ez a böngésző nem támogatja az értesítéseket":"This browser doesn’t support notifications","Az értesítés nincs engedélyezve a böngésző/telefon beállításaiban":"Notifications are not allowed in the browser/phone settings","Csak https://claude.ai/ kezdetű link adható meg":"Only links starting with https://claude.ai/ are allowed","Link törölve":"Link removed","Link mentve":"Link saved","Pihenő vége – következő sorozat":"Rest over – next set","Keresés…":"Search…","Gyakorlat választása":"Choose exercise","Új gyakorlat":"New exercise","Nincs találat – hozd létre új gyakorlatként.":"No match – create it as a new exercise.","Név":"Name","pl. KB egykezes evezés":"e.g. KB one-arm row","Izomcsoport / kategória":"Muscle group / category","pl. Hát, Kettlebell":"e.g. Back, Kettlebell","Típus":"Type","Erőedzés (súly × ismétlés)":"Strength (weight × reps)","Kardió (táv km × idő perc)":"Cardio (distance km × time min)","Pihenőidő (mp)":"Rest time (s)","Üresen: az alapértelmezett pihenőidőt használja.":"Empty: uses the default rest time.","Már létezik ilyen nevű gyakorlat":"An exercise with this name already exists","Gyakorlatok · sorozatszám":"Exercises · sets","Sorozatok":"Sets","pl. Push nap":"e.g. Push day","Még nincs gyakorlat.":"No exercises yet.","Adj nevet a sablonnak":"Give the template a name","Törlöd a sablont? A korábbi edzések megmaradnak.":"Delete the template? Past workouts are kept.","Sablon törlése":"Delete template","Előző hónap":"Previous month","Következő hónap":"Next month","Testmérés":"Measurement","Lépés":"Steps","Ma":"Today","Volumen":"Volume","Edzés a hónapban":"Workouts this month","Súlyváltozás":"Weight change","Szerkesztés":"Edit","Rögzítés":"Log","Testzsír":"Body fat","Derék":"Waist","· cél:":"· goal:","Nincs mérés erre a napra":"No measurement on this day","Megnyitás":"Open","tétel:":"items:","Rost:":"Fiber:","Fehérje":"Protein","Szénh.":"Carbs","Zsír":"Fat","Nincs rögzített étkezés":"No food logged","Nincs edzés erre a napra":"No workout on this day","Ülő – irodai munka, kevés mozgás":"Sedentary – desk job, little movement","Enyhén aktív – heti 1–3 edzés":"Lightly active – 1–3 workouts/week","Mérsékelten aktív – heti 3–5 edzés":"Moderately active – 3–5 workouts/week","Nagyon aktív – heti 6–7 edzés":"Very active – 6–7 workouts/week","Extrém – fizikai munka + edzés":"Extreme – physical job + training","Fogyás":"Lose weight","Szinten tartás":"Maintain","Izomépítés":"Build muscle","Hízás":"Gain weight","Enyhe":"Gentle","Közepes":"Moderate","Gyors":"Fast","800–6000 kcal között adható meg":"Enter a value between 800 and 6000 kcal","A célsúly nem kisebb a jelenlegi súlynál, közben a cél fogyás.":"The target weight isn’t below your current weight, but the goal is to lose weight.","A célsúly nem nagyobb a jelenlegi súlynál, közben a cél hízás.":"The target weight isn’t above your current weight, but the goal is to gain weight.","A javasolt érték felnőttekre (18+) vonatkozik.":"The suggested value applies to adults (18+).","A javasolt értékhez hiányzik:":"Missing for the suggested value:","Fehérje:":"Protein:",", zsír: az energia":", fat:","%-a, szénhidrát: a maradék, rost: 14 g / 1000 kcal, de legalább 25 g (ebből a több is jó). Tájékoztató becslés, nem orvosi tanács – egészségügyi állapot esetén egyeztesd szakemberrel.":"% of energy, carbs: the rest, fiber: 14 g / 1000 kcal, at least 25 g (more is fine). An informational estimate, not medical advice – with a health condition, consult a professional.","Napi energiaigény":"Daily energy need","Saját napi érték":"Custom daily value","Szénhidrát":"Carbs","Alapanyagcsere (BMR)":"Basal metabolic rate (BMR)","Javasolt napi keret":"Suggested daily budget","Javasolt napi bevitel":"Suggested daily intake","Rost (min.)":"Fiber (min.)","kb.":"approx.","g/ttkg":"g/kg bw","Energiaigény: Mifflin–St Jeor × aktivitás. Korrekció a célhoz:":"Energy need: Mifflin–St Jeor × activity. Adjustment for the goal:","kg/hét fogyás":"kg/week loss","kg/hét gyarapodás":"kg/week gain","súlytartás":"maintenance","A javaslat elérte az alsó határt (":"The suggestion hit the lower limit (","kcal), ennél kevesebbet nem javaslok.":"kcal); I don’t suggest less than that.","(referencia-testsúlyra)":"(for a reference body weight)","Profil és célok":"Profile and goals","Nem":"Sex","Születési év":"Birth year","Magasság (cm)":"Height (cm)","Célsúly (kg)":"Target weight (kg)","Aktivitás":"Activity","– válassz –":"– choose –","Cél":"Goal","Saját napi kalóriaérték (kcal)":"Custom daily calories (kcal)","üresen: a javasolt érték":"empty: the suggested value","Férfi":"Male","Nő":"Female","év":"years","Tempó":"Pace","pl. 1980":"e.g. 1980","pl. 178":"e.g. 178","pl. 80":"e.g. 80","kcal (":"kcal (","kcal)":"kcal)","Reggeli":"Breakfast","Tízórai":"Morning snack","Ebéd":"Lunch","Uzsonna":"Afternoon snack","Vacsora":"Dinner","Nasi / egyéb":"Snack / other","Étkezés beillesztése":"Paste food","Claude válaszának kódblokkja":"Code block from Claude’s reply","2026-11-06;ebéd;Csirkemell 150 g;248;46;0;6;0":"2026-11-06;lunch;Chicken breast 150 g;248;46;0;6;0","Nyomd hosszan a mezőt, majd Beillesztés. Soronként egy tétel: dátum;étkezés;megnevezés;kcal;fehérje;szénhidrát;zsír;rost":"Long-press the field, then Paste. One item per line: date;meal;name;kcal;protein;carbs;fat;fiber","Feldolgozás":"Process","A vágólap tartalmában nem találtam étkezés-sort.":"No food lines found on the clipboard.","Nem találtam felismerhető sort":"No recognizable lines found","Ezek a tételek már szerepelnek":"These items are already logged","… és még":"… and","tétel":"items","Összesen":"Total","tétel már szerepelt, azt kihagyom.":"item(s) already logged – skipping them.","tétel mentése":"items – save","tétel mentve":"items saved","Megnevezés":"Name","pl. Zabkása 60 g banánnal":"e.g. Oatmeal 60 g with banana","Energia (kcal)":"Energy (kcal)","Fehérje (g)":"Protein (g)","Szénhidrát (g)":"Carbs (g)","Zsír (g)":"Fat (g)","Rost (g)":"Fiber (g)","Új tétel":"New item","Adj meg megnevezést":"Enter a name","Tétel szerkesztése":"Edit item","Törlöd:":"Delete:","Tétel törlése":"Delete item","Hozzáadva a mai naphoz":"Added to today","Előző nap":"Previous day","Következő nap":"Next day","Nap":"Day","Beillesztés":"Paste","Súgó: Claude-projekt":"Help: Claude project","Kézi":"Manual","Erre a napra még nincs étkezés":"No food logged for this day","A javasolt napi bevitelhez töltsd ki a profilodat a Beállításokban.":"Fill in your profile in Settings to get a suggested daily intake.","Claude-ból":"from Claude","Utolsó 7 nap":"Last 7 days","Hozzáadás a mai naphoz":"Add to today","Rost":"Fiber","Még":"","kcal fér bele a napi keretbe":"kcal left in today’s budget","A javasolt bevitelig még":"To the suggested intake:","kcal-lal a napi keret felett":"kcal over today’s budget","kcal a javasolt bevitelig":"kcal to the suggested intake","kcal-lal a javasolt bevitel felett":"kcal over the suggested intake","A javasolt bevitel megvan":"Suggested intake reached","napi keret":"daily budget","javasolt bevitel":"suggested intake","Az elmúlt":"In the last","napban nincs rögzített étkezés":"days no food was logged","legalább 90%":"at least 90%","7 napos átlag":"7-day average","Átl. eltérés · kcal/nap":"Avg. difference · kcal/day","Alatta / felette":"Under / over","±10%-on belül":"Within ±10%","Napi energia:":"Daily energy:","(tájékoztató):":"(informational):","g fehérje,":"g protein,","g szénhidrát,":"g carbs,","g zsír, legalább":"g fat, at least","Napi keretem":"My daily budget","Javasolt napi bevitelem":"My suggested daily intake","Utasítás a vágólapon":"Instructions copied","Jelöld ki és másold ki kézzel":"Select and copy it manually","Étkezésnapló Claude-dal":"Food log with Claude","Lefényképezed vagy elmondod, mit ettél, Claude kiszámolja a kalóriát, a makrókat és a rostot, és egy kódblokkban adja vissza. Ezt itt egy gombnyomással átveszed. Az Olupanba csak a számok kerülnek, a fotó csak a Claude-ba megy.":"You take a photo or describe what you ate, Claude works out the calories, macros and fiber and returns them in a code block. You bring it in here with one tap. Only the numbers end up in Olupan; the photo goes to Claude only.","1. A projekt létrehozása (egyszer)":"1. Create the project (once)","Nyisd meg a Claude-ot. A projektet legkényelmesebb a":"Open Claude. The project is easiest to create on the","weboldalon létrehozni, de a mobilappban is megy, ha ott is elérhető.":"website, but the mobile app works too if it’s available there.","Bal oldali menü →":"Left menu →","Új projekt":"New project",". Név: pl.":". Name: e.g.","Étkezésnapló":"Food log","A projekt oldalán keresd az":"On the project page, find the","Utasítások":"Instructions","(Instructions / „Projekt utasításainak beállítása”) részt, és illeszd be a lenti szöveget. A":"section (“Set project instructions”) and paste the text below. The","Másolás":"Copy","gomb a vágólapra teszi.":"button puts it on the clipboard.","Mentsd. A projekt ezután a telefonos Claude appban is megjelenik a Projektek között.":"Save it. The project then also appears under Projects in the Claude phone app.","Projektek":"Projects","Másold ki a projekt címét a böngésző címsorából (":"Copy the project’s address from the browser’s address bar (","), és illeszd be a Beállítások →":"), and paste it into Settings →","Claude-projekt linkje":"Claude project link","mezőbe. Ekkor az Étkezés fülön megjelenik a":"field. A","gomb.":"button then appears on the Food tab.","Az utasítás tartalmazza a mostani javasolt napi bevitelt is. Ha a Beállításokban módosítod a profilodat, másold ki és illeszd be újra.":"The instructions include your current suggested daily intake. If you change your profile in Settings, copy and paste them again.","2. Használat étkezésenként":"2. Use for each meal","Claude app →":"Claude app →","→ új beszélgetés (vagy folytasd a napit).":"→ new chat (or continue today’s).","Fotó:":"Photo:","a + vagy kamera ikonnal készíts képet a tányérról.":"use the + or camera icon to photograph your plate.","Szöveg vagy hang:":"Text or voice:","írd be vagy diktáld, pl. „reggelire 60 g zabpehely 2 dl tejjel és egy banán”.":"type or dictate, e.g. “60 g oats with 200 ml milk and a banana for breakfast”.","Ha Claude visszakérdez az adagra, válaszolj. A válasz végén lévő kódblokk sarkában lévő":"If Claude asks about the portion, answer. Copy the code block at the end of the reply with the","másolás":"copy","ikonnal másold ki.":"icon in its corner.","Olupan →":"Olupan →","Beillesztés Claude-ból":"Paste from Claude","Tipp: grammban vagy darabban megadott adaggal sokkal pontosabb a becslés, mint fotóval. A rejtett olaj, a szósz és az adagméret miatt a fotós becslés könnyen 20–30%-ot téved. Ha a vágólapról nem sikerül a beolvasás, a Beillesztés ablakba kézzel is bemásolhatod.":"Tip: portions given in grams or pieces are much more accurate than photos. Hidden oil, sauces and portion size easily make photo estimates 20–30% off. If reading the clipboard fails, you can paste into the Paste window manually.","Nincs új adat – minden érték szerepel már":"No new data – all values are already logged","nap lépésszám,":"days of steps,","testsúly- és":"weight and","testzsírmérés (":"body fat measurements (","új érték":"new values","eltér a már rögzítettől":"differ from what’s logged","már szerepel":"already logged","Egészség adatok átvétele":"Import Health data","Eltérő meglévő értékeknél":"Where existing values differ","az Egészség app értéke legyen (felülírás)":"use the Health app value (overwrite)","a már rögzített érték maradjon":"keep the logged value","érték mentve":"values saved","Vágólap":"Clipboard","Parancs kimenete":"Shortcut output","Egészség adatok beillesztése":"Paste Health data","Nyomd hosszan a mezőt, majd Beillesztés. Hosszabb időszakhoz használd a Fájl gombot.":"Long-press the field, then Paste. For longer periods, use the File button.","A vágólap tartalmában nem találtam felismerhető sort.":"No recognizable lines found on the clipboard.","Beillesztett szöveg":"Pasted text","A fájl nem olvasható":"The file can’t be read","A fájlban nem találtam lépés-, súly- vagy testzsír-sort":"No step, weight or body fat lines found in the file","Egészség app adatai iPhone-ról":"Health app data from iPhone","Egy":"A","Parancsok":"Shortcuts","-parancs kiírja a lépésszámot, a testsúlyt és a testzsír-százalékot egy szövegfájlba; itt a":" shortcut writes your steps, weight and body fat percentage to a text file; here you read it with the","Fájl":"File","gombbal beolvasod. A fájlnak nincs méretkorlátja, így akár több év is átjön (a vágólap kb. 200 napnál elakad). Az adat nem hagyja el a telefont.":"button. The file has no size limit, so even several years come through (the clipboard stops at about 200 days). The data never leaves your phone.","Egészségügyi minták keresése (Steps)":"Find Health Samples (Steps)","Megismétlés … minden elemével":"Repeat with Each …","↳ Szöveg: lepes;Kezdési dátum;Elem ismétlése":"↳ Text: steps;Start Date;Repeat Item","↳ Hozzáadás változóhoz: Egeszseg":"↳ Add to Variable: Health","Ismétlés vége":"End Repeat","… ugyanez Testtömeg (suly) és Testzsír (zsir) …":"… same for Body Mass (weight) and Body Fat (fat) …","A(z) Egeszseg egyesítése Új sorok elválasztóval":"Combine Health with New Lines","Név beállítása: egeszseg.txt":"Set Name: health.txt","Fájl mentése":"Save File","Új művelet:":"New action:","a szerkesztő alján lévő":"type its name into the","Keresés":"Search","mezőbe írd a nevét, koppints rá – a parancs":"field at the bottom of the editor and tap it – it goes to the","végére":"end","kerül; a":"of the shortcut; drag it by its","nevénél":"name","fogva húzható a helyére.":"to move it.","Lépések.":"Steps.","Egészségügyi minták keresése":"Find Health Samples",": Típus":": Type",", Kezdési dátum":", Start Date","benne van ebben: előző 365 nap":"is in the last 365 days","(első alkalommal akár több év), Csoportosítás szempontja:":"(the first time, even several years), Group By:",", Rendezés:":", Sort by:","Kezdési dátum, legrégebbi elöl":"Start Date, oldest first",", Korlát: ki.":", Limit: off.","Ismétlés mindegyikkel":"Repeat with Each","Megismétlés…":"Repeat…","és az":"and","közé) két művelet:":") two actions:","Szöveg":"Text",": írd be:":": type:","Elem ismétlése":"Repeat Item","változó → koppints rá →":"variable → tap it →","Kezdési dátum":"Start Date","(tulajdonság nélkül).":"(no property).","Hozzáadás változóhoz":"Add to Variable","(Add to Variable): a Szöveget add hozzá egy új változóhoz, neve:":": add the Text to a new variable named:","Testsúly.":"Weight.","Újra":"Again","Testtömeg":"Body Mass","(Body Mass), ugyanaz a dátumszűrő, Mértékegység:":", same date filter, Unit:",", Csoportosítás:":", Group By:",", Rendezés: legrégebbi elöl. Utána ugyanaz a ciklus, csak a szöveg eleje":", Sort: oldest first. Then the same loop, only the text starts with",", és ugyanahhoz az":", and add it to the same","változóhoz add hozzá.":"variable.","Testzsír.":"Body fat.","Ugyanígy, Típus":"Same again, Type","Testzsír-százalék":"Body Fat Percentage","(Body Fat Percentage), a szöveg eleje":", the text starts with","A ciklusok után:":"After the loops:","Szöveg egyesítése":"Combine Text","változó, elválasztó:":"variable, separator:","Új sorok":"New Lines","Név beállítása":"Set Name","(Set Name) → az Egyesített szöveg neve:":"→ name the Combined Text:","és a":"and","a legutolsó":"after the last","után":"","álljon, ne a cikluson belül – különben a teljes tartalom minden körben újra kiíródik (az app az azonos sorokat egyszer veszi figyelembe, de a fájl feleslegesen nagy lesz).":"must come after the last loop, not inside it – otherwise the whole content is written again on every pass (the app counts identical lines only once, but the file gets needlessly large).","(Save File) → pl. iCloud Drive / Shortcuts mappa; „Felülírás, ha létezik”: be. Ha a „Kérdezze meg, hová mentse” be van kapcsolva, minden futtatáskor választhatsz helyet.":"→ e.g. iCloud Drive / Shortcuts folder; “Overwrite If File Exists”: on. If “Ask Where to Save” is on, you can pick a location each time.","Futtatás után: Olupan → Test →":"After running it: Olupan → Body →","→ válaszd ki az":"→ choose","-t. Mentés előtt megmutatja, hány új és hány eltérő érték van; eltérésnél választhatsz, melyik maradjon. Egy napon több mérésnél az elsőt (reggelit) veszi.":". Before saving it shows how many values are new or different; for differences you choose which to keep. With several measurements on one day, the first (morning) one is used.","Csak az utolsó ~30 nap jön át?":"Only the last ~30 days come through?","Az iOS adattípusonként korlátozhatja, mennyi régi adatot láthat a Parancsok app. Nézd meg:":"iOS can limit how much past data the Shortcuts app may see, per data type. Check:","Beállítások → Adatvédelem és biztonság → Egészség → Parancsok":"Settings → Privacy & Security → Health → Shortcuts",", és minden használt típusnál (Lépések, Testtömeg, Testzsír) legyen engedélyezve a":", and allow the","teljes":"full","előzmény. Ha a Lépések 30 napra van állítva, a Parancsok a régebbi napokat egyszerűen nem kapja meg, hiba nélkül.":"history for every type used (Steps, Body Mass, Body Fat). If Steps is set to 30 days, Shortcuts simply won’t get older days – with no error.","Fontos:":"Important:","Steps":"Steps","Egeszseg":"Health","egeszseg.txt":"health.txt","→ bemenet:":"→ input:","Mérés rögzítése":"Log measurement","Dátum":"Date","Súly (kg)":"Weight (kg)","Testzsír (%)":"Body fat (%)","Derék (cm)":"Waist (cm)","Lépésszám":"Steps","pl. 8500":"e.g. 8500","Súgó: lépések átvétele":"Help: importing steps","Egészség app":"Health app","Lépésszám, testsúly és testzsír az iPhone Egészség appjából, Parancsok segítségével (leírás a ? gomb alatt) – vagy rögzítsd kézzel fent.":"Steps, weight and body fat from the iPhone Health app via Shortcuts (guide under the ? button) – or log them manually above.","Testsúly":"Body weight","A trend a mérésekre illesztett lineáris regresszió meredeksége heti változásra vetítve – kevésbé érzékeny a napi ingadozásra, mint két mérés különbsége.":"The trend is the slope of a linear regression fitted to the measurements, as a weekly change – less sensitive to daily fluctuation than the difference of two measurements.","Frissítés":"Update","Utolsó súly":"Latest weight","kg/hét":"kg/week","Utolsó testzsír":"Latest body fat","%p/hét":"pp/week","· cél":"· goal","30 napos átlag":"30-day average","Előzmények":"History","Még nincs mérés.":"No measurements yet.","Adj meg legalább egy értéket":"Enter at least one value","A lépésszám 0–200 000 között legyen":"Steps must be between 0 and 200,000","A súly 20–400 kg között legyen":"Weight must be between 20 and 400 kg","A testzsír 2–70% között legyen":"Body fat must be between 2 and 70%","A derékkerület 30–250 cm között legyen":"Waist must be between 30 and 250 cm","mérést?":"measurement?","Mérés törlése":"Delete measurement","Δ 30 nap":"Δ 30 days","Trend 14 nap":"Trend 14 days","Trend 30 nap":"Trend 30 days","Trend 90 nap":"Trend 90 days","30 nap":"30 days","90 nap":"90 days","120 nap":"120 days","Mind":"All","1 év":"1 year","Részletes nézet":"Detailed view","Mérés":"Measurement","Jelenlegi":"Current","Δ 7 nap":"Δ 7 days","Δ 90 nap":"Δ 90 days","Min – max (kg)":"Min – max (kg)","Trend (kg/hét)":"Trend (kg/week)","Célsúly":"Target weight","Hátra (fogyás)":"To go (loss)","Hátra (gyarapodás)":"To go (gain)","Elérted":"Reached","Becsült idő (trend)":"Estimated time (trend)","hét":"weeks","A becsült időhöz a kiválasztott időszak súlytrendjének a cél felé kell mutatnia.":"For an estimated time, the weight trend of the selected period must point towards the goal.","Testzsír %":"Body fat %","Derékbőség":"Waist","Trend (%p/hét)":"Trend (pp/week)","%p":"pp","Energiaegyenleg":"Energy balance","A „várható” az átlagos bevitel és a becsült napi energiaigény (":"“Expected” is calculated from the difference between average intake and estimated daily energy need (","kcal) különbségéből számol (7700 kcal ≈ 1 kg). Ha nagyon eltér a mért trendtől, valószínűleg nem minden étkezés került rögzítésre, vagy az energiaigény becslése pontatlan.":"kcal) (7700 kcal ≈ 1 kg). If it differs a lot from the measured trend, probably not every meal was logged, or the energy need estimate is off.","Átl. egyenleg · kcal/nap":"Avg. balance · kcal/day","Várható · kg/hét":"Expected · kg/week","Mért trend · kg/hét":"Measured trend · kg/week","Napi energia":"Daily energy","A kiválasztott időszak (":"Averages for the selected period (",") átlagai":")","Átlag kcal (időszak)":"Avg. kcal (period)","Átlag fehérje":"Avg. protein","±10%-on belüli nap":"Days within ±10%","Rögzített nap":"Days logged","Átlag szénhidrát":"Avg. carbs","Átlag zsír":"Avg. fat","Átlag rost":"Avg. fiber","Legjobb nap":"Best day","Lépések":"Steps","Utolsó 30 nap":"Last 30 days","Az elmúlt 30 napban nincs lépésadat":"No step data in the last 30 days","7 napos átlag (időszak)":"7-day average (period)","Átlag (időszak)":"Average (period)","Cél teljesítve":"Goal met","Edzések":"Workouts","Edzésszám hetente":"Workouts per week","Összes edzés":"Total workouts","Ebben a hónapban":"This month","Átlag / hét (12 hét)":"Avg. / week (12 weeks)","Heti volumen (kg)":"Weekly volume (kg)","Volumen = súly × ismétlés, a pipált erősorozatokra összeadva. A saját testsúlyos (0 kg) és a kardió sorozatok nem számítanak bele.":"Volume = weight × reps, summed over checked strength sets. Bodyweight (0 kg) and cardio sets are not included.","Átlag / edzés (időszak)":"Avg. / workout (period)","Utolsó 4 hét vs. előző 4":"Last 4 weeks vs. previous 4","Az elmúlt 12 hétben nincs erőedzés-volumen":"No strength volume in the last 12 weeks","Edzésenként (időszak)":"Per workout (period)","5 edzéses átlag":"5-workout average","Legnagyobb volumenű edzés az időszakban:":"Highest-volume workout in the period:","Edzéstrend":"Training trend","Rögzíts edzéseket a trendekhez.":"Log workouts to see trends.","Becs. 1RM":"Est. 1RM","Tempó (perc/km)":"Pace (min/km)","perc/km":"min/km","Max ismétlés":"Max reps","Max súly":"Max weight","Gyakorlat":"Exercise","Alkalom (időszak)":"Sessions (period)","Legutóbbi":"Latest","Változás (időszak)":"Change (period)","Személyes rekordok":"Personal records","Becsült 1RM: Epley-képlet (súly × (1 + ism./30)). Koppints egy sorra az erőtrendhez.":"Estimated 1RM: Epley formula (weight × (1 + reps/30)). Tap a row for the strength trend.","Max ism.":"Max reps","Legjobb sorozat":"Best set","Leghosszabb táv":"Longest distance","Leghosszabb idő":"Longest time","Még nincs rekord.":"No records yet.","Étkezési energia":"Food energy","Edzések / hét":"Workouts / week","Volumen / hét":"Volume / week","elhanyagolható":"negligible","gyenge":"weak","közepes":"moderate","erős":"strong","Magyarázat":"Explanation","Kevés adat":"Not enough data","kevés adat":"not enough data","Összesítő trend":"Combined trend","átl.":"avg.","Minden vonal a saját átlagához képest mutatja a le-fel mozgást (0 = az időszak átlaga, ±1 = egy szórásnyi eltérés), simítva: testsúly, étkezés, lépés 7 napos, testzsír 21 napos átlag, edzés és volumen: az előző 7 nap edzésszáma, illetve megmozgatott összsúlya. Mérés nélküli napokon a vonal a következő értékig összeköt. Így a különböző mértékegységű adatok egy grafikonon összevethetők; a pontos értéket koppintásra mutatja. A lenti gombokkal ki-be kapcsolhatod az adatsorokat.":"Each line shows movement relative to its own average (0 = the period average, ±1 = one standard deviation), smoothed: weight, food and steps as 7-day, body fat as 21-day averages; workouts and volume as the previous 7 days’ count and total weight lifted. On days without data the line connects to the next value. This lets data in different units be compared on one chart; tap for the exact value. Use the buttons below to toggle series.","Étkezési energia (7 napos átlag)":"Food energy (7-day average)","Lépések (7 napos átlag)":"Steps (7-day average)","Edzések az előző 7 napban":"Workouts in the previous 7 days","Edzésvolumen az előző 7 napban":"Training volume in the previous 7 days","Összefüggések (":"Correlations (","nap)":"days)","Tényező":"Factor","Testsúly heti változása":"Weekly weight change","Testzsír 2 heti változása":"2-week body fat change","Ebben az időszakban a testsúly változásával leginkább a(z)":"In this period, weight change moved most closely with","mozgott együtt (r =":"(r =","– ha nőtt, a testsúly is inkább nőtt":"– when it rose, weight tended to rise too","– ha nőtt, a testsúly inkább csökkent":"– when it rose, weight tended to fall","Korrelációs együttható (r, −1…+1): az adott tényező szintje és az ugyanarra az időszakra eső súly-, illetve zsírváltozás együttmozgása. Pozitív: együtt nőnek; negatív: ellentétesen mozognak. Legalább 20 közös nap kell hozzá, és az együttmozgás nem bizonyít ok-okozatot – egy-egy rendhagyó hét (betegség, utazás) is erősen befolyásolhatja. A testzsír-mérés (főleg otthoni mérlegnél) zajos, ott a jelzés óvatosabban értelmezendő.":"Correlation coefficient (r, −1…+1): how the factor’s level moves together with the weight or fat change in the same period. Positive: they rise together; negative: they move in opposite directions. It needs at least 20 shared days, and correlation doesn’t prove causation – a single unusual week (illness, travel) can have a strong effect. Body fat measurements (especially on home scales) are noisy, so read that column with more caution.","A zsírtömeg többel csökkent, mint a testsúly – a zsírmentes tömeg (izom, víz) közben nőtt.":"Fat mass fell more than body weight – lean mass (muscle, water) increased meanwhile.","A testsúly csökkent, de a zsírtömeg nem – a fogyás zsírmentes tömegből (izom, víz) származott.":"Body weight fell but fat mass didn’t – the loss came from lean mass (muscle, water).","A fogyás kb.":"About","zsírból származott":"of the loss came from fat","%-a":"%","– ez arra utalhat, hogy izom is fogyott; a fehérjebevitel és az erőedzés segít megőrizni.":"– this may mean some muscle was lost too; protein intake and strength training help preserve it.","A testsúly nőtt, a zsírtömeg csökkent – a gyarapodás zsírmentes tömeg.":"Body weight rose while fat mass fell – the gain is lean mass.","A gyarapodás kb.":"About","zsírmentes tömeg (izom, víz),":"of the gain is lean mass (muscle, water),","%-a zsír.":"% is fat.","A testsúly alig változott, a zsírtömeg csökkent – testösszetétel-javulás.":"Body weight barely changed while fat mass fell – improved body composition.","A testsúly alig változott, a zsírtömeg nőtt.":"Body weight barely changed while fat mass rose.","A testösszetétel érdemben nem változott.":"Body composition didn’t change meaningfully.","Testösszetétel változása":"Body composition change","· testzsír":"· body fat","Zsírtömeg":"Fat mass","Zsírmentes tömeg":"Lean mass","A testösszetétel-változáshoz legalább két testzsír-mérés kell az időszakban.":"Body composition change needs at least two body fat measurements in the period.","Ebben az időszakban nincs adat":"No data in this period","Az elmúlt 12 hétben nincs edzés":"No workouts in the last 12 weeks","cél":"goal","üres":"empty","nem Strong-formátum":"not Strong format","Ez nem Strong CSV-exportnak tűnik":"This doesn’t look like a Strong CSV export","Nem találtam edzést a fájlban":"No workouts found in the file","Mind a(z)":"All","edzés szerepel már – nincs mit importálni":"workouts are already logged – nothing to import","Import a Strong appból":"Import from the Strong app","A súlyok mértékegysége az exportban":"Weight unit in the export","font (lbs) – átváltom kg-ra":"pounds (lbs) – convert to kg","Importálás":"Import","edzés (":"workouts (","sorozat,":"sets,","gyakorlat – ebből":"exercises – of these","a meglévőkhöz rendelve,":"matched to existing ones,","új lesz.":"will be new.","edzés már szerepel (azonos kezdési idő), ezeket kihagyom.":"workouts already logged (same start time) – skipping them.","üres sort (0 ismétlés) kihagyok.":"empty rows (0 reps) skipped.","Import kész":"Import complete","edzés és":"workouts and","sorozat importálva.":"sets imported.","Az új gyakorlatokat a Beállítások → Gyakorlatok listában átnevezheted, kategorizálhatod.":"You can rename and categorize new exercises under Settings → Exercises.","sablon jött létre a gyakran használt edzésnevekből (az Edzéseim között).":"templates were created from frequently used workout names (under My workouts).","Új gyakorlatok:":"New exercises:","Adatvédelem és offline működés":"Privacy and offline use","Főképernyős appként fut":"Running as a home screen app","Böngészőben fut":"Running in the browser","Offline is elérhető":"Available offline","Offline mód még nem aktív":"Offline mode not active yet","Minden adat csak ezen az eszközön van.":"All data stays on this device.","Nincs regisztráció, fiók, szerver, analitika, süti vagy követés. Az edzések, testadatok, étkezések és a profil a böngésző helyi tárhelyén maradnak; az app semmit nem küld el sehova.":"No sign-up, account, server, analytics, cookies or tracking. Workouts, body data, food and your profile stay in the browser’s local storage; the app sends nothing anywhere.","Internet nélkül is működik.":"Works without internet.","Az első megnyitás után a teljes app a telefonon tárolódik, edzőteremben, térerő nélkül is használható. Ha van net, a frissítés automatikusan letöltődik.":"After the first visit the whole app is stored on your phone, so it works in the gym without signal. Updates download automatically when you’re online.","Natív appként is használható.":"Use it like a native app.","iPhone-on Safariban:":"On iPhone in Safari:","Megosztás":"Share","Főképernyőhöz adás":"Add to Home Screen",". Androidon Chrome-ban: menü →":". On Android in Chrome: menu →","Alkalmazás telepítése":"Install app",". Utána saját ikonról, teljes képernyőn, címsor nélkül indul, mint egy letöltött app.":". It then starts from its own icon, full screen, without an address bar, like a downloaded app.","iPhone-on érdemes telepíteni.":"On iPhone, install it.","A Safari a sokáig nem látogatott oldalak helyi adatait törölheti, a főképernyős appokra ez nem vonatkozik. A főképernyős app és a Safari":"Safari may delete local data of sites you haven’t visited for a while; this doesn’t apply to home screen apps. The home screen app and Safari use","külön tárhelyet":"separate storage","használ: ami az egyikben van, az a másikban nem látszik – áthozni Mentés + Import segítségével lehet.":": what’s in one doesn’t show in the other – move it with Save + Import.","A mentés a te kezedben van.":"Backups are in your hands.","Mivel nincs szerver, eszközcsere vagy az app törlése esetén csak a saját mentésedből állítható vissza minden. A":"As there’s no server, after changing devices or deleting the app, everything can only be restored from your own backup. Put the","Mentés / megosztás":"Save / share","fájlt a Drive-ra, iCloudba vagy a Fájlokba teheted.":"file on Drive, iCloud or in Files.","Étkezésnaplózás Claude-dal:":"Food logging with Claude:","a gomb a Claude appot nyitja meg; amit ott leírsz vagy lefényképezel, az Anthropic szolgáltatásához kerül. Az Olupanba csak az kerül, amit vágólapról beillesztesz.":"the button opens the Claude app; what you describe or photograph there goes to Anthropic’s service. Only what you paste from the clipboard ends up in Olupan.","Indulási nézet":"Start screen","Ez a fül nyílik meg az app indításakor. Ha edzés van folyamatban, mindig az Edzés nyílik.":"This tab opens when the app starts. If a workout is in progress, Workout always opens.","Megjelenés":"Appearance","Rendszer szerint":"System","Világos":"Light","Sötét":"Dark","Kiemelőszín sötét módban":"Accent colour in dark mode","Ciánkék":"Cyan","Sötétnarancs":"Dark orange","A gombok, a kiválasztott elemek és az aktív menüpont színe. Világos módban mindig ciánkék.":"Colour of buttons, selected items and the active tab. Always cyan in light mode.","Alapértelmezett pihenőidő (mp)":"Default rest time (s)","Pipálás után indul. Gyakorlatonként felülírható (edzés közben a gyakorlat neve alatti időre koppintva, vagy lent a listában). 0 = kikapcsolva.":"Starts when you check a set. Can be set per exercise (tap the time under the exercise name during a workout, or in the list below). 0 = off.","Hangjelzés a pihenő végén":"Sound at the end of rest","Ki":"Off","Halk":"Quiet","Hangos":"Loud","Teszt":"Test","Be":"On","iPhone-on a némító kapcsoló (csengő ki) a hangot is elnémítja. Lezárt képernyőnél vagy háttérben a böngésző szünetelteti az időzítőt – ezt a lenti ébren tartás megelőzi.":"On iPhone the silent switch also mutes the sound. With the screen locked or in the background the browser pauses the timer – keeping the screen awake (below) prevents this.","Visszajelző hangok és rezgés":"Feedback sounds and haptics","Gombok":"Buttons","Gépelés":"Typing","Kész sorozat":"Set done","Rezgés":"Haptics","Koppintásra halk kattanás, gépeléskor finom tikk, sorozat kipipálásakor rövid „siker” dallam és enyhe rezgés. A pihenő-hangjelzéstől függetlenül kapcsolhatók. A rezgés Androidon és iPhone-on iOS 18-tól működik; iPhone-on a némító kapcsoló a hangokat is elnémítja, és ha a billentyűzet kattanása be van kapcsolva az iOS-ben, a gépelés-hangot érdemes kikapcsolni.":"A soft click on taps, a gentle tick when typing, and a short “success” chime with a light vibration when you check a set. Independent of the rest sound. Haptics work on Android and on iPhone from iOS 18; on iPhone the silent switch also mutes these, and if keyboard clicks are on in iOS, turn off the typing sound.","Értesítés a pihenő végén, ha az app háttérben van":"Notify at the end of rest when the app is in the background","Androidon és számítógépen értesítés jelenik meg, ha pihenő közben másik appra váltasz. iPhone-on a rendszer a háttérbe tett webappot felfüggeszti, és szerver nélkül nem lehet időzített értesítést küldeni – ott visszatéréskor azonnal szól, és jelzi, mennyi ideje járt le. Megbízható megoldás iPhone-on: a képernyő ébren tartása és az app előtérben hagyása.":"On Android and desktop a notification appears if you switch to another app during rest. On iPhone the system suspends background web apps and timed notifications aren’t possible without a server – there it alerts you as soon as you return and shows how long ago rest ended. Reliable on iPhone: keep the screen awake and the app in front.","Képernyő ébren tartása edzés közben":"Keep screen awake during workouts","Futó edzés alatt a képernyő nem sötétül el és nem zár le, így a pihenő-visszaszámlálás és a hangjelzés is működik. Az edzés befejezésekor automatikusan kikapcsol. Több akkumulátort fogyaszt.":"During a workout the screen doesn’t dim or lock, so the rest countdown and sound keep working. Turns off automatically when the workout ends. Uses more battery.","Ez a böngésző nem támogatja (iPhone-on iOS 16.4 vagy újabb kell).":"Not supported by this browser (iPhone needs iOS 16.4 or later).","Claude-projekt linkje (étkezésnapló)":"Claude project link (food log)","A claude.ai-on nyisd meg a projektet, és másold be a címsorból. Az Étkezés fülön a „Claude” gomb ezt nyitja meg új böngészőlapon.":"Open the project on claude.ai and copy it from the address bar. The “Claude” button on the Food tab opens it in a new tab.","Napi lépéscél":"Daily step goal","nincs cél":"no goal","A statisztikában szaggatott vonal jelzi, a célt elérő napok zöldek. Üresen hagyva nincs cél.":"Shown as a dashed line in stats; days reaching the goal are green. Leave empty for no goal.","Minden adat csak ezen az eszközön, a böngésző helyi tárhelyén van – semmi nem kerül szerverre. A":"All data is only on this device, in the browser’s local storage – nothing goes to a server.","a telefon megosztás menüjét nyitja meg: innen menthetsz Google Drive-ra, a Fájlok appba vagy iCloud Drive-ra. Visszatöltés:":"opens your phone’s share menu: save to Google Drive, the Files app or iCloud Drive from there. Restore:",", majd a fájl kiválasztása (a Drive is megjelenik a fájlválasztóban, ha telepítve van).":", then pick the file (Drive also shows in the file picker if installed).","Utolsó mentés":"Last backup","Még nem volt":"Never","Export CSV-ben":"Export as CSV","Strong-formátum":"Strong format","Étkezés – tételek":"Food – items","makrók, rost":"macros, fiber","Étkezés – napi":"Food – daily","összesítő":"summary","Import":"Import","A magyar táblázatok pontosvesszővel és tizedesvesszővel készülnek (Excel, Numbers közvetlenül megnyitja). Az edzések a Strong app CSV-formátumában, így ide vagy más appba vissza is importálhatók.":"Files use commas and decimal points (Excel and Numbers open them directly). Workouts are in the Strong app’s CSV format, so they can be imported back here or into other apps.","Import Strong appból (CSV)":"Import from Strong (CSV)","Strong app → Profil → Beállítások → Adatok exportálása. Az edzéseket hozzáadja a meglévőkhöz; az újraimportált (azonos kezdési idejű) edzéseket kihagyja.":"Strong app → Profile → Settings → Export data. Workouts are added to existing ones; re-imported workouts (same start time) are skipped.","Mintaadatok":"Sample data","Gyakorlatok":"Exercises","Minden törlése":"Delete everything","Új":"New","Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)":"Icons: Lucide (ISC) · Fonts: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)","edzés":"workouts","Mentés kész":"Backup ready","Gyakorlat szerkesztése":"Edit exercise","Edzésben már szerepel – csak szerkeszthető":"Already used in workouts – edit only","gyakorlatot? A sablonokból is kikerül.":"exercise? It’s also removed from templates.","Gyakorlat törlése":"Delete exercise","Ehhez még nincs adat":"No data for this yet","CSV elkészült":"CSV ready","Hibás vagy nem támogatott fájl":"Invalid or unsupported file","A fájlban":"The file contains","mérés van. Felülírja a jelenlegi adatokat?":"measurements. Overwrite the current data?","Felülírás":"Overwrite","Importálva":"Imported","Minden edzés, mérés, sablon és saját gyakorlat törlődik erről az eszközről. Érdemes előtte exportálni.":"All workouts, measurements, templates and custom exercises will be deleted from this device. Consider exporting first.","Minden adat törlése":"Delete all data","Tovább":"Continue","Ez nem vonható vissza. Biztosan törlöd?":"This can’t be undone. Delete everything?","Utolsó megerősítés":"Final confirmation","Végleges törlés":"Delete permanently","Kb. 4 hónapnyi mintaadatot (edzéseket és méréseket) adok hozzá a meglévőkhöz. Később a „Minden törlése” gombbal eltávolítható.":"Adds about 4 months of sample data (workouts and measurements) to your existing data. Remove it later with “Delete everything”.","Hozzáadás":"Add","Mintaadatok betöltve":"Sample data loaded","Zabkása 60 g tejjel, banán":"Oatmeal 60 g with milk, banana","Rántotta 3 tojásból, kenyér":"Scrambled eggs (3), bread","Görög joghurt 200 g":"Greek yogurt 200 g","Lazac 150 g, zöldség":"Salmon 150 g, vegetables","Túrós tészta":"Pasta with cottage cheese","Fehérjeszelet":"Protein bar","Csirkemell 150 g, rizs 180 g":"Chicken breast 150 g, rice 180 g","Bolognai spagetti":"Spaghetti bolognese","Alma, mandula 30 g":"Apple, almonds 30 g","Energia":"Energy","kcal fér bele":"kcal left","Nincs új adat":"No new data","perc":"min","mp":"s","nap":"days","sorozat":"sets","nincs":"None","keret":"budget","javasolt":"suggested","alatta":"below","felette":"over",", a ciklusba (a":", into the loop (between","alkalom":"sessions","napi":"daily","lepes;":"steps;","suly;":"weight;","zsir;":"fat;","sorozatonként":"one row per set","A magyar táblázatok pontosvesszővel és tizedesvesszővel készülnek (Excel, Numbers közvetlenül megnyitja). Az edzések sorozatonként egy sorban, így ide vissza is importálhatók.":"Files use commas and decimal points (Excel and Numbers open them directly). Workouts have one row per set, so they can be imported back here.","Edzések importálása (CSV)":"Import workouts (CSV)","Minta":"Sample","Edzések importálása":"Import workouts","Soronként egy sorozat. Kötelező oszlopok:":"One set per row. Required columns:","(ÉÉÉÉ-HH-NN ÓÓ:PP),":"(YYYY-MM-DD HH:MM),","(kg),":"(kg),","; ajánlott:":"; recommended:","(pl. 55m), kardióhoz":"(e.g. 55m), for cardio","(km) és":"(km) and",". Az azonos dátumú és nevű sorokból lesz egy edzés. Elválasztó: vessző vagy pontosvessző. A":". Rows with the same date and name form one workout. Separator: comma or semicolon. The","gomb egy kitölthető példafájlt ad. Az edzéseket hozzáadja a meglévőkhöz; az azonos kezdési idejűeket kihagyja.":"button gives you an example file to fill in. Workouts are added to existing ones; ones with the same start time are skipped.","A fájl szerkezete nem megfelelő – nézd meg a Minta fájlt":"The file structure isn’t valid – see the Sample file","hibás szerkezet":"invalid structure","Edzés-import minta":"Workout import sample","Ha pihenő közben másik appra váltasz, a pihenő végén értesítés jelenik meg. Androidon, számítógépen és újabb iPhone-okon (iPhone 17-en kipróbálva) működik; régebbi iOS-en a rendszer a háttérbe tett webappot felfüggesztheti – ott visszatéréskor azonnal szól, és jelzi, mennyi ideje járt le. iPhone-on csak a főképernyőre telepített app küldhet értesítést.":"If you switch to another app during rest, a notification appears when rest ends. Works on Android, desktop and newer iPhones (tested on iPhone 17); on older iOS the system may suspend background web apps – there it alerts you as soon as you return and shows how long ago rest ended. On iPhone only the home-screen app can send notifications.","Napi frissítéshez elég a dátumszűrőt „előző 30 nap”-ra állítani – az újraolvasás nem duplikál. A korábbi, csak lépésszámos (vágólapos) parancsod is működik tovább a Beillesztés gombbal. A testzsírt az app akkor is helyesen kezeli, ha a parancs törtként (0,215) adja ki. A műveletnevek iOS-verziónként kicsit eltérhetnek.":"For daily updates, setting the date filter to “last 30 days” is enough – re-reading doesn’t duplicate. An older steps-only (clipboard) shortcut keeps working with the Paste button. Body fat is handled correctly even if the shortcut outputs it as a fraction (0.215). Action names can differ slightly between iOS versions.","Kiemelőszín":"Accent colour","A gombok, a kiválasztott elemek és az aktív menüpont színe, világos és sötét módban is.":"Colour of buttons, selected items and the active tab, in both light and dark mode.","Mintaadat csak üres naplóba tölthető be":"Sample data can only be loaded into an empty log","iPhone-on a némítás (csengő ki / Action gomb) a hangot is elnémítja, és a hangerőt a médiahangerő szabályozza. Lezárt képernyőnél vagy háttérben a böngésző szünetelteti az időzítőt – ezt a lenti ébren tartás megelőzi.":"On iPhone, silent mode (ring switch / Action button) also mutes the sound, and the level follows the media volume. With the screen locked or in the background the browser pauses the timer – keeping the screen awake (below) prevents this.","Olupan mentés":"Olupan backup","Tudnivalók":"About","Felhasználói útmutató":"User guide","Adatkezelési tájékoztató":"Privacy Policy","Jogi nyilatkozat":"Disclaimer","Az Olupan nem orvosi alkalmazás; a javasolt értékek tájékoztató becslések.":"Olupan is not a medical app; suggested values are informational estimates.","© 2026 Rácz Zoltán · Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)":"© 2026 Zoltán Rácz · Icons: Lucide (ISC) · Fonts: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)","A projekt Context (fájlok) részéhez add hozzá a receptfájlt, amelyet a lenti Receptfájl letöltése gombbal kapsz. Ebbe kerülnek a saját receptjeid: elég a hozzávalókat felsorolni, a kalóriát, a makrókat és a rostot Claude számolja ki.":"Add the recipe file to the project’s Context (files) section – you get it with the Download recipe file button below. Your own recipes go in it: just list the ingredients, and Claude calculates the calories, macros and fiber.","Receptfájl letöltése":"Download recipe file","Receptfájl elkészült":"Recipe file ready","Olupan – receptek":"Olupan – recipes","Saját recept: írd azt, hogy „reggelire 1 adag zabkása”, és Claude a receptfájl hozzávalóiból számol. Új receptet a beszélgetésben is megadhatsz; ha szeretnéd, hogy minden beszélgetésben elérhető legyen, kérd el a frissített receptfájlt, és cseréld le vele a projektben lévőt.":"Own recipes: write “1 serving of breakfast porridge for breakfast”, and Claude calculates from the recipe file’s ingredients. You can also give a new recipe in the chat; to make it available in every chat, ask for the updated recipe file and replace the one in the project.","Korábbi dátum":"Earlier date","Hova kerüljenek?":"Where should they go?","Mégis rögzítem":"Log anyway","Kihagyom":"Skip","Nem maradt rögzítendő tétel":"Nothing left to log","Áthelyezés a sablonok közé":"Move to templates","Vissza az Edzéseim közé":"Back to My workouts","Jegyzetek":"Notes","Korábbi edzéseim":"Earlier workouts","A jegyzet az edzés sablonjához kerül, így a következő alkalommal itt olvashatod.":"Notes are saved to the workout’s template, so you can read them here next time.","Új jegyzet":"New note","Jegyzet":"Note","Jegyzet törlése":"Delete note","Bezárás":"Close","Még nincs jegyzet.":"No notes yet.","Törlöd a jegyzetet?":"Delete this note?","Visszakerült az Edzéseim közé":"Moved back to My workouts","Áthelyezve a sablonok közé":"Moved to templates","Előző bejegyzés":"Previous entry","Következő bejegyzés":"Next entry",". Mentés előtt megmutatja a tételeket; a már rögzítettekre és a korábbi napra szólókra rákérdez.":". Before saving, it shows the items and asks about ones already logged or dated to an earlier day.","Naptár megnyitása":"Open calendar","Vissza a beállításokhoz":"Back to settings","Vissza a mai naphoz":"Back to today","Edzések és sablonok":"Workouts and templates","Vissza a mai napra":"Back to today","Vissza a futó edzéshez":"Back to the running workout","Vissza az edzéshez":"Back to workout","kcal maradt":"kcal left","a keretből":"of target","Étkezés megnyitása":"Open food","kcal elfogyasztva":"kcal eaten","Kalóriakeret: Beállítások → Profil és célok.":"Calorie target: Settings → Profile and goals.","Testadatok megnyitása":"Open body data","% testzsír":"% body fat","cm derék":"cm waist","lépés":"steps","Mai edzés":"Today’s workout","Tervezett edzés":"Planned workout","Csere":"Change","Edzés indítása":"Start workout","Nem volt edzés":"No workout","Pihenőnap":"Rest day","Erre a napra nincs tervezett edzés.":"No workout planned for this day.","Ma nincs tervezett edzés.":"No workout planned for today.","Tervezd meg a mai edzést":"Plan today’s workout","Edzés tervezése":"Plan a workout","Még egy edzés":"One more workout","Válaszd ki, mit edzel – a főképernyőn csak ez látszik.":"Choose what you’ll train – only this shows on the home screen.","Terv törlése":"Remove plan","Mai tervnek":"Plan for today","Tervbe":"Plan","Indítás most":"Start now","Minden adat ezen a készüléken marad.":"All data stays on this device.","Adatok":"Data","Profil":"Profile","Kalória- és makrócélok":"Calorie and macro targets","Téma":"Theme","Nyelv":"Language","Alapértelmezett pihenőidő":"Default rest time","Hangok és rezgés":"Sounds and haptics","Értesítés a pihenő végén":"Rest-end notification","Képernyő ébren tartása":"Keep screen awake","Claude-projekt és receptfájl":"Claude project and recipe file","Egészség":"Health","Lépés, súly, testzsír az iPhone-ról":"Steps, weight, body fat from iPhone","Export CSV-be":"Export to CSV","Rózsaszín":"Pink","Claude-projekt útmutató":"Claude project guide","A claude.ai-on nyisd meg a projektet, és másold be a címsorból. Az Étkezés oldalon a „Claude” gomb ezt nyitja meg új böngészőlapon.":"Open the project on claude.ai and copy it from the address bar. The “Claude” button on the Food page opens it in a new tab.","testsúly (Test kártya)":"body weight (Body card)","), és illeszd be a Beállítások → Étkezés →":"), and paste it into Settings → Food →","Tárolás":"Storage","Adatok mérete":"Data size","Hely":"Location","Tartós tárolás":"Persistent storage","Minden adat ezen a készüléken marad. A rendszeres mentés ettől függetlenül fontos: eszközcserénél vagy az app törlésekor csak abból állítható vissza minden.":"All data stays on this device. Regular backups still matter: when you change devices or delete the app, they are the only way to restore everything.","Étkezési preferenciák":"Food preferences","A Menüjavaslat gombok ezeket küldik el a Claude-projektednek, a kalóriakerettel együtt. Csak ezen a készüléken tárolódnak.":"The Meal suggestion buttons send these to your Claude project, together with your calorie target. They are stored only on this device.","Étrend":"Diet","Kerülendő összetevők":"Foods to avoid","Stílus":"Style","Főzési gyakorlat":"Cooking level","Hány főre főzöl":"Cooking for","Étkezés naponta":"Meals per day","Konyhai eszközök (nem kötelező)":"Kitchen equipment (optional)","Menüjavaslat":"Meal suggestion","Mit egyek még ma?":"What should I eat today?","Napi menü":"Daily menu","Heti menü":"Weekly menu","Ezt a kérést másolja ki az app a Claude-projektedbe. Beillesztés előtt átírhatod.":"The app copies this request for your Claude project. You can edit it before pasting.","Add meg a Claude-projekt linkjét a Beállítások → Étkezés részben, és a gomb meg is nyitja.":"Add your Claude project link in Settings → Food and the button will open it too.","Másolás és Claude":"Copy and open Claude","Kérés a vágólapon – illeszd be a Claude-ba":"Request copied – paste it into Claude","Bemelegítő sorozat – koppints a munkasorozathoz":"Warm-up set – tap to make it a working set","Koppints: bemelegítő sorozat":"Tap: warm-up set","Javaslat:":"Suggestion:","Kitöltés":"Fill in","Tárcsák":"Plates","Tárcsakalkulátor":"Plate calculator","Rúd (kg)":"Bar (kg)","Elérhető tárcsák":"Available plates","Oldalanként":"Per side","Gyors rögzítés":"Quick log","Korábbi étkezések":"Earlier meals","Gyakori tételek":"Frequent items","Kész":"Done","Ismét":"Again","Még nincs korábbi étkezés.":"No earlier meals yet.","További testméretek (cm)":"More body measurements (cm)","Mellkas":"Chest","Felkar":"Upper arm","Csípő":"Hips","Comb":"Thigh","Testméretek":"Body measurements","A testméretek 10–250 cm között legyenek":"Body measurements must be between 10 and 250 cm","Szuperszett a következő gyakorlattal":"Superset with the next exercise","Alkalmazás":"Apply","Megnézem":"View","Később":"Later","Adaptív keret":"Adaptive target","A tényleges energiaigényedet az étkezéseidből és a súlyod változásából számolom. Ehhez az elmúlt 4 hétből kell legalább 14 rögzített nap (napi 800 kcal felett) és legalább 8 mérés 2 hét alatt.":"I estimate your actual energy needs from your meals and weight change. This needs at least 14 logged days (above 800 kcal) in the last 4 weeks and at least 8 weigh-ins over 2 weeks.","Időtáv":"Time span","Átlagos bevitel":"Average intake","Súlytrend":"Weight trend","Tényleges energiaigény":"Actual energy needs","Edzésterv Claude-dal":"Training plan with Claude","Terv kérése":"Request a plan","Edzésterv beillesztése":"Paste training plan","Az app összeállít egy kérést a gyakorlataid listájával; a válasz kódblokkját az":"The app builds a request with your exercise list; add the code block from the reply with","gombbal sablonokként veheted fel.":"as templates.","Nap hetente":"Days per week","Edzés hossza":"Session length","Eszközök":"Equipment","Gyakorlottság":"Experience","Kerülendő gyakorlatok (nem kötelező)":"Exercises to avoid (optional)","Változásnapló":"Change log","Magasság":"Height","Legalább 1200 kcal; a javasoltnál jóval alacsonyabb értéket csak orvossal vagy dietetikussal egyeztetve állíts be.":"At least 1200 kcal; only set a value far below the suggested one after agreeing it with a doctor or dietitian.","Számítási módszerek":"Calculation methods","Telepítsd az Olupant":"Install Olupan","Ingyenes, nincs appon belüli vásárlás és fiók – az adatok az eszközödön maradnak, és offline is működik.":"Free, no in-app purchases or account – your data stays on your device, and it works offline.","Telepítés":"Install","Részletek":"Details","Most nem":"Not now","Terpeszugrás (jumping jack)":"Jumping jacks","Guggolásos felugrás":"Jump squat","Magastérd-emelés helyben":"High knees","Kitöréses váltóugrás":"Jumping lunges","Tabata (HIIT) – saját testsúly":"Tabata (HIIT) – bodyweight","Tabata: gyakorlatonként 8 kör – 20 mp maximális tempó, 10 mp pihenő (a pihenőidő 10 mp-re van állítva). A gyakorlatok között 1 perc pihenő. Sorozatonként a 20 mp alatt elért ismétlésszámot rögzítsd.":"Tabata: 8 rounds per exercise – 20 s at maximum effort, 10 s rest (the rest timer is set to 10 s). Rest 1 minute between exercises. For each set, log the reps you did in the 20 s.","Előbb add meg a Claude-projekt linkjét. A terv kérése ugyanabba a projektbe megy, mint az étkezésnapló.":"Add your Claude project link first. Plan requests go to the same project as your food log.","Claude-projekt beállítása":"Set up Claude project","Ebben a csoportban már nincs sablon.":"There are no templates left in this group.","Még nincs befejezett edzés.":"No finished workouts yet.","A javasolt napi bevitelhez töltsd ki a profilodat. A Claude-projekt útmutatója és a menüjavaslat csak utána érhető el, mert a napi célok is belekerülnek.":"Fill in your profile to get a suggested daily intake. The Claude project guide and meal suggestions become available after that, because they include your daily targets.","Profil kitöltése":"Fill in profile","A profil kitöltése után érhető el.":"Available once your profile is filled in.","Az útmutató a profil kitöltése után érhető el, mert a projekt utasításába a napi célok is belekerülnek.":"The guide becomes available once your profile is filled in, because the project instructions include your daily targets.","Előbb töltsd ki a profilodat":"Fill in your profile first","Előbb add meg a Claude-projekt linkjét":"Add your Claude project link first","Vissza":"Back","Egyéb kívánság vagy stílus":"Other wishes or style","Konyhai eszközeim":"My kitchen equipment","Jelöld be, ami van. Ha bármit bejelölsz, Claude csak ezekkel számol, és a többit nem használja.":"Select what you have. If you select anything, Claude only plans with these and leaves out the rest.","Egyéb eszköz (nem kötelező)":"Other equipment (optional)","Bemelegítő":"Warm-up","Egyéb receptötletek":"Other recipe ideas","Konyha":"Cuisine","Napi és heti menünél az app 1–2 konyhát választ ki véletlenszerűen a bejelöltek közül, hogy az alapanyagok átfedjenek. A receptötleteknél mindet használja.":"For daily and weekly menus the app randomly picks 1–2 of the selected cuisines so the ingredients overlap. Recipe ideas use all of them.","Receptötletek":"Recipe ideas","Főzés hetente (heti menü)":"Cooking per week (weekly menu)","A heti menü ennyi főzésből ad főtt ételt minden napra – ugyanaz az étel több napon is előjöhet.":"The weekly menu gives a cooked meal for every day from this many cooking sessions – the same dish may come up on several days.","Mi van kéznél?":"What do you have at hand?","Hol vagy, mit tudsz venni? (nem kötelező)":"Where are you, what can you buy? (optional)","Legalább az egyiket töltsd ki: Claude csak ebből javasol, a mai maradék kereted szerint.":"Fill in at least one: Claude only suggests from this, within what’s left of today’s target.","Írd be, mi van kéznél, vagy hol vagy":"Enter what you have at hand or where you are","A Megnyitás gomb új böngészőlapon nyitja meg a projektet – itt cserélheted az utasítást vagy a receptfájlt.":"The Open button opens the project in a new browser tab – that’s where you can replace the instructions or the recipe file.","Claude megnyitása (claude.ai)":"Open Claude (claude.ai)","Claude-projekt megnyitása":"Open Claude project","Elsődleges izomcsoport":"Primary muscle group","Másodlagos izmok (nem kötelező)":"Secondary muscles (optional)","Eszköz":"Equipment","Bemelegítés":"Warm-up","Pluszsúly":"Added weight","Idő (mp)":"Time (s)","Mp":"Sec","Nyisd meg a Claude-ot ugyanabban a böngészőben, amelyben az Olupant használod (ne a Claude appot – ott nincs kimásolható webcím), jelentkezz be vagy regisztrálj, hozz létre egy projektet, és másold be ide a linkjét a címsorból.":"Open Claude in the same browser you use Olupan in (not the Claude app – it has no web address to copy), sign in or sign up, create a project and paste its link from the address bar here.","Testsúly (kg)":"Body weight (kg)","Testzsír % (nem kötelező)":"Body fat % (optional)","Napi lépéscél (nem kötelező)":"Daily step goal (optional)","Saját napi kalóriakeret (kcal)":"Own daily calorie target (kcal)","Ha kitöltöd, a javasolt keret helyett ezzel számol az app; törölve visszaáll a javasoltra. Legalább 1200 kcal; a javasoltnál jóval alacsonyabb értéket csak orvossal vagy dietetikussal egyeztetve állíts be.":"If you fill it in, the app uses it instead of the suggested target; clear it to go back to the suggestion. At least 1200 kcal; only set a value well below the suggestion after consulting a doctor or dietitian.","Tájékoztató becslés, nem orvosi tanács – egészségügyi állapot esetén egyeztesd szakemberrel.":"An indicative estimate, not medical advice – if you have a health condition, check with a professional.","Hangok és kijelző":"Sounds and display","Receptjeim":"My recipes","Összefoglaló":"Summary","Titkosított mentés":"Encrypted backup","Visszaállítás mentésből":"Restore from backup"};
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
['Kettlebell swing (kétkezes)','Kettlebell'],['Kettlebell swing (egykezes)','Kettlebell'],['Kettlebell goblet guggolás','Kettlebell'],['Kettlebell török felállás (get-up)','Kettlebell'],
['Kettlebell clean','Kettlebell'],['Kettlebell clean & press','Kettlebell'],['Kettlebell snatch','Kettlebell'],['Kettlebell nyomás (egykezes)','Kettlebell'],['Kettlebell evezés','Kettlebell'],
['Kettlebell felhúzás','Kettlebell'],['Kettlebell front rack guggolás','Kettlebell'],['Kettlebell halo','Kettlebell'],['Kettlebell windmill','Kettlebell'],['Kettlebell thruster','Kettlebell'],['Kettlebell high pull','Kettlebell'],
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
 ['Kettlebell – swing & get-up',[['Kettlebell swing (egykezes)',10],['Kettlebell török felállás (get-up)',5]]],
 ['Kettlebell – teljes test',[['Kettlebell goblet guggolás',3],['Kettlebell clean & press',3],['Kettlebell evezés',3],['Kettlebell swing (kétkezes)',3],['Kettlebell halo',2]]],
 ['Kettlebell – ballisztikus',[['Kettlebell swing (kétkezes)',5],['Kettlebell clean',4],['Kettlebell snatch',4],['Kettlebell front rack guggolás',3],['Kettlebell windmill',2]]],
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
/* A korábbi „KB …” beépített gyakorlatnevek átnevezése „Kettlebell …”-re (régi mentéseknél is) */
const KB_RENAME=new Set(['swing (kétkezes)','swing (egykezes)','goblet guggolás','török felállás (get-up)','clean','clean & press','snatch','nyomás (egykezes)','evezés','felhúzás','front rack guggolás','halo','windmill','thruster','high pull']);
const EX_META={
'Fekvenyomás (rúd)':['chest',['triceps','shoulders'],'bar'],'Ferde fekvenyomás (kézisúlyzó)':['chest',['shoulders','triceps'],'db'],'Fekvenyomás (kézisúlyzó)':['chest',['triceps','shoulders'],'db'],'Tárogatás (kábel)':['chest',[],'mach'],'Tolódzkodás':['chest',['triceps','shoulders'],'bw','reps'],'Padlón nyomás (kézisúlyzó)':['chest',['triceps'],'db'],'Padlón nyomás (rúd)':['chest',['triceps'],'bar'],
'Felhúzás (rúd)':['back',['glutes','hams'],'bar'],'Evezés (rúd)':['back',['biceps'],'bar'],'Húzódzkodás':['back',['biceps'],'bw','reps'],'Húzódzkodás (fordított fogás)':['back',['biceps'],'bw','reps'],'Mellhez húzás (kábel)':['back',['biceps'],'mach'],'Evezés ülve (kábel)':['back',['biceps'],'mach'],'Evezés (kézisúlyzó)':['back',['biceps'],'db'],
'Guggolás (rúd)':['quads',['glutes'],'bar'],'Román felhúzás (rúd)':['hams',['glutes','back'],'bar'],'Lábtolás (gép)':['quads',['glutes'],'mach'],'Kitörés (kézisúlyzó)':['quads',['glutes'],'db'],'Lábhajlítás (gép)':['hams',[],'mach'],'Lábnyújtás (gép)':['quads',[],'mach'],'Csípőemelés (rúd)':['glutes',['hams'],'bar'],'Vádliemelés (gép)':['calves',[],'mach'],
'Bolgár guggolás (kézisúlyzó)':['quads',['glutes'],'db'],'Román felhúzás (kézisúlyzó)':['hams',['glutes'],'db'],'Goblet guggolás (kézisúlyzó)':['quads',['glutes'],'db'],'Guggolás (kézisúlyzó)':['quads',['glutes'],'db'],
'Katonai nyomás (rúd)':['shoulders',['triceps'],'bar'],'Vállból nyomás (kézisúlyzó)':['shoulders',['triceps'],'db'],'Oldalemelés (kézisúlyzó)':['shoulders',[],'db'],'Face pull (kábel)':['shoulders',['back'],'mach'],
'Bicepsz hajlítás (kézisúlyzó)':['biceps',[],'db'],'Bicepsz hajlítás (rúd)':['biceps',[],'bar'],'Kalapács hajlítás':['biceps',[],'db'],'Koncentrált bicepszhajlítás (kézisúlyzó)':['biceps',[],'db'],'Tricepsz letolás (kábel)':['triceps',[],'mach'],'Francia nyomás':['triceps',[],'bar'],
'Hasprés':['core',[],'bw','reps'],'Lábemelés függésben':['core',[],'bw','reps'],'Hasgörgő':['core',[],'other','reps'],'Lábemelés fekve':['core',[],'bw','reps'],'Dead bug':['core',[],'bw','reps'],
'Kettlebell swing (kétkezes)':['glutes',['hams','back'],'kb'],'Kettlebell swing (egykezes)':['glutes',['hams','back'],'kb'],'Kettlebell goblet guggolás':['quads',['glutes'],'kb'],'Kettlebell török felállás (get-up)':['full',['shoulders','core'],'kb'],'Kettlebell clean':['full',['glutes','back'],'kb'],'Kettlebell clean & press':['shoulders',['glutes','triceps'],'kb'],'Kettlebell snatch':['full',['glutes','shoulders'],'kb'],'Kettlebell nyomás (egykezes)':['shoulders',['triceps'],'kb'],'Kettlebell evezés':['back',['biceps'],'kb'],'Kettlebell felhúzás':['hams',['glutes','back'],'kb'],'Kettlebell front rack guggolás':['quads',['glutes','core'],'kb'],'Kettlebell halo':['shoulders',['core'],'kb'],'Kettlebell windmill':['core',['shoulders','hams'],'kb'],'Kettlebell thruster':['quads',['shoulders','glutes'],'kb'],'Kettlebell high pull':['back',['shoulders','glutes'],'kb'],
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
function exEq(e){if(!e)return null;const n=e.name;if(e.kind==='cardio')return'KA';if(e.eq){const t={kb:'KB',bw:'ST',bar:'ET',mach:'ET',db:'KS'}[e.eq];if(t)return t}if(e.cat==='Kettlebell'||/^(KB|Kettlebell) /.test(n))return'KB';if(/\((rúd|gép|kábel)\)/.test(n))return'ET';
  if(e.cat==='Saját testsúly'||BW_NAMES.includes(n))return'ST';if(/kézisúlyzó|Kalapács/i.test(n))return'KS';return null}
const START_TABS=[['workout','Edzés'],['food','Étkezés'],['body','Test'],['history','Naptár'],['stats','Statisztika']];
const TAGS={ET:['et','Edzőterem'],KS:['ks','Kézisúlyzó (otthon)'],ST:['st','Saját testsúly'],KB:['kb','Kettlebell'],KA:['ka','Kardió']}; // ez a sorrend a sablonlistában is
const TAG_ORDER=Object.keys(TAGS);
function tplKey(t){let eq=t.items.map(i=>exEq(exById(i.exId))).filter(Boolean);if(!eq.length)return null;
  if(eq.every(x=>x==='KA'))return'KA';eq=eq.filter(x=>x!=='KA');
  return eq.includes('ET')?'ET':eq.every(x=>x==='KB'||x==='ST')&&eq.includes('KB')?'KB':eq.every(x=>x==='ST')?'ST':eq.every(x=>x==='KS'||x==='ST')?'KS':'ET'}
const tplRank=t=>{const k=tplKey(t);return k?TAG_ORDER.indexOf(k):TAG_ORDER.length};
const DEF_REST={'Terpeszugrás (jumping jack)':10,'Guggolásos felugrás':10,'Magastérd-emelés helyben':10,'Kitöréses váltóugrás':10,'Kettlebell swing (egykezes)':45,'Kettlebell swing (kétkezes)':60,'Kettlebell snatch':60,'Kettlebell török felállás (get-up)':60};
function addDefaults(st){
  for(const[name,cat,kind]of DEF_EX){let e=st.exercises.find(x=>x.name===name);if(!e){e={id:uid(),name,cat};if(DEF_REST[name])e.rest=DEF_REST[name];st.exercises.push(e)}if(kind&&!e.kind)e.kind=kind}
  st.exercises.forEach(fillMeta);
  const f=n=>st.exercises.find(e=>e.name===n)?.id;
  for(const[name,items]of DEF_TPL)if(!st.templates.some(t=>t.name===name)&&(st.v===0||TPL_VER(name)>st.v))
    st.templates.push({id:uid(),name,items:items.filter(([n])=>f(n)).map(([n,s])=>({exId:f(n),sets:s})),...(TPL_NOTE[name]?{notes:[{id:uid(),ts:Date.now(),text:TPL_NOTE[name],wid:null}]}:{})});
}
function defaults(){const st={v:0,exercises:[],templates:[],workouts:[],body:[],meals:[],foods:[],recipes:[],shop:[],profile:{pace:1},active:null,settings:{rest:90,backupEvery:7,theme:null,sound:3,wakeLock:true,stepGoal:0,uiSound:true,typeSound:true,doneSound:true,haptic:true,restNotify:false,startTab:'workout',accent:'cyan',lang:null}};addDefaults(st);st.v=DATA_V;return st}
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
function applyTheme(){const t=curTheme(),de=document.documentElement;de.dataset.theme=t;de.dataset.accent=['orange','pink'].includes(S.settings.accent)?S.settings.accent:'cyan';$('#themeColor').content=t==='dark'?'#06080b':'#dfe5ee'}
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
  openModal(`<h2>Edzésterv Claude-dal</h2><div class="hint" style="margin-top:-4px">Az app összeállít egy kérést a gyakorlataid listájával; a gomb kimásolja és megnyitja a Claude-ot. Visszatérve a felső sáv <b>Beillesztés</b> gombjával veheted fel a választ sablonokként.</div>
  <label>Cél</label><div class="chips" style="margin:0">${TP_GOAL.map(x=>`<button class="chip${p.goal===x[0]?' on':''}" data-click="tpSet('goal','${x[0]}')">${esc(lbl(x))}</button>`).join('')}</div>
  <div class="grid2"><div><label for="tpd">Nap hetente</label><select id="tpd" data-change="tpSet('days',this.value)">${[2,3,4,5,6].map(n=>`<option ${p.days===n?'selected':''}>${n}</option>`).join('')}</select></div>
  <div><label for="tpm">Edzés hossza</label><select id="tpm" data-change="tpSet('mins',this.value)">${[30,45,60,75,90].map(n=>`<option value="${n}" ${p.mins===n?'selected':''}>${n} ${L('perc','min')}</option>`).join('')}</select></div></div>
  <label>Eszközök</label><div class="chips" style="margin:0">${TP_EQ.map(x=>`<button class="chip${p.eq.includes(x[0])?' on':''}" data-click="tpSet('eq','${x[0]}')">${esc(lbl(x))}</button>`).join('')}</div>
  <label for="tpl">Gyakorlottság</label><select id="tpl" data-change="tpSet('level',this.value)">${PREF_SKILL.map(x=>`<option value="${x[0]}" ${p.level===x[0]?'selected':''}>${esc(lbl(x))}</option>`).join('')}</select>
  <label for="tpa">Kerülendő gyakorlatok (nem kötelező)</label><input id="tpa" maxlength="200" value="${esc(p.avoid)}" placeholder="${esc(L('pl. guggolás rúddal, fej fölé nyomás','e.g. barbell squat, overhead press'))}" data-change="tpSet('avoid',this.value)">
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">Mégse</button><span class="sp"></span><button class="btn p" data-click="copyPlanReq()">${I('external-link','sm')} ${L('Megnyitás Claude-ban','Open in Claude')}</button></div>`)}
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
function copyPlanReq(){claudeGo('plan',planPrompt())}
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
function pastePlan(){return claudePaste()}
async function pastePlanGo(P){
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

/* ===== Élelmiszer-adattár: alapkészlet (USDA + magyar becslés, EU-s számítás) és saját tételek =====
   Értékek 100 g-ra vagy 100 ml-re. kcal = 4·F + 4·Sz + 9·Zs + 2·rost + 7·alkohol (EU 1169/2011). */
const FOODDB=[[1,"tej","Tej, 3,5%","Milk, whole (3.5%)",63,3.2,4.9,3.4,0,0,1,1077,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[2,"tej","Tej, 2,8%","Milk, 2.8%",57,3.3,4.8,2.8,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[3,"tej","Tej, 1,5%","Milk, 1.5%",46,3.4,4.9,1.5,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[4,"tej","Tej, sovány (0,1%)","Milk, skimmed",35,3.5,5.1,0.1,0,0,1,1085,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[5,"tej","Laktózmentes tej, 1,5%","Lactose-free milk, 1.5%",46,3.4,4.8,1.5,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[6,"tej","Kakaós tej","Chocolate milk",81,3.2,12.1,2,0.7,0,1,1103,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[7,"tej","Író","Buttermilk",42,3.4,5,0.9,0,0,1,1088,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[8,"tej","Kefir","Kefir",41,3.8,4.5,0.9,0,0,1,1289,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[9,"tej","Joghurt, natúr, 3,5%","Yoghurt, plain, whole milk",62,3.5,4.7,3.2,0,0,0,1116,[]],[10,"tej","Joghurt, natúr, zsírszegény","Yoghurt, plain, low-fat",48,4,5,1.5,0,0,0,0,[]],[11,"tej","Görög joghurt, natúr, 0%","Greek yoghurt, plain, 0%",59,10.2,3.6,0.4,0,0,0,1256,[]],[12,"tej","Görög joghurt, natúr, 10%","Greek yoghurt, plain, 10%",130,5,4,10,0,0,0,0,[]],[13,"tej","Gyümölcsjoghurt","Fruit yoghurt",100,4,18.6,1.1,0,0,0,1120,[]],[14,"tej","Skyr, natúr","Skyr, plain",63,11,4,0.2,0,0,0,0,[]],[15,"tej","Túró, zsírszegény","Quark (cottage cheese), low-fat",75,13,4,0.5,0,0,0,0,[]],[16,"tej","Túró, félzsíros","Quark (cottage cheese), medium-fat",115,16,3.5,4,0,0,0,0,[]],[17,"tej","Túró, zsíros","Quark (cottage cheese), full-fat",145,14,3,8.5,0,0,0,0,[]],[18,"tej","Cottage cheese","Cottage cheese",97,11.1,3.4,4.3,0,0,0,1012,[]],[19,"tej","Tejföl, 12%","Sour cream, 12%",135,3,4,12,0,0,1,0,[["1 evőkanál","1 tbsp",15]]],[20,"tej","Tejföl, 20%","Sour cream, 20%",203,2.5,4.7,19.3,0,0,1,1056,[["1 evőkanál","1 tbsp",15]]],[21,"tej","Tejszín, 30% (habtejszín)","Whipping cream, 30%",290,2.2,3.2,30,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[22,"tej","Főzőtejszín, 20%","Cooking cream, 20%",198,3,2.9,19.4,0,0,1,1050,[["1 evőkanál","1 tbsp",15]]],[23,"tej","Kávétejszín, 10%","Coffee cream, 10%",127,3.2,4.8,10.6,0,0,1,1049,[["1 evőkanál","1 tbsp",15]]],[24,"tej","Mascarpone","Mascarpone",430,4.6,4,44,0,0,0,0,[]],[25,"tej","Krémsajt","Cream cheese",356,6.2,5.5,34.4,0,0,0,1017,[["1 evőkanál","1 tbsp",14]]],[26,"tej","Ricotta","Ricotta",174,11.3,3,13,0,0,0,1036,[]],[27,"tej","Mozzarella","Mozzarella",299,22.2,2.2,22.4,0,0,0,1026,[]],[28,"tej","Mozzarella, light","Mozzarella, light",296,23.8,5.6,19.8,0,0,0,1029,[]],[29,"tej","Trappista sajt","Trappista cheese",355,25,1,28,0,0,0,0,[]],[30,"tej","Edami sajt","Edam cheese",356,25,1.4,27.8,0,0,0,1018,[]],[31,"tej","Gouda sajt","Gouda cheese",355,24.9,2.2,27.4,0,0,0,1022,[]],[32,"tej","Cheddar sajt","Cheddar cheese",404,22.9,3.1,33.3,0,0,0,1009,[]],[33,"tej","Ementáli sajt","Emmental cheese",393,27,1.4,31,0,0,0,1040,[]],[34,"tej","Parmezán","Parmesan",388,35.8,3.2,25.8,0,0,0,1033,[]],[35,"tej","Feta","Feta",265,14.2,4.1,21.3,0,0,0,1019,[]],[36,"tej","Camembert","Camembert",300,19.8,0.5,24.3,0,0,0,1007,[]],[37,"tej","Brie","Brie",334,20.8,0.5,27.7,0,0,0,1006,[]],[38,"tej","Kéksajt (rokfort típusú)","Blue cheese",353,21.4,2.3,28.7,0,0,0,1004,[]],[39,"tej","Ömlesztett sajt","Processed cheese",368,18.1,4.8,30.7,0,0,0,1042,[["1 szelet","1 slice",28]]],[40,"tej","Halloumi","Halloumi",320,21,2,25,0,0,0,0,[]],[41,"tej","Juhtúró","Sheep's milk curd cheese (bryndza)",290,17,2,24,0,0,0,0,[]],[42,"tej","Tojás, egész (nyers)","Egg, whole (raw)",139,12.6,0.7,9.5,0,0,0,1123,[["1 db (M)","1 egg (M)",55],["1 db (L)","1 egg (L)",65]]],[43,"tej","Tojás, főtt","Egg, hard-boiled",150,12.6,1.1,10.6,0,0,0,1129,[["1 db (M)","1 egg (M)",50]]],[44,"tej","Tojásfehérje","Egg white",48,10.9,0.7,0.2,0,0,0,1124,[["1 tojásé","from 1 egg",33]]],[45,"tej","Tojássárgája","Egg yolk",316,15.9,3.6,26.5,0,0,0,1125,[["1 tojásé","from 1 egg",17]]],[46,"tej","Rántotta (vajon)","Scrambled eggs (in butter)",145,10,1.6,11,0,0,0,1132,[["1 nagy db","1 large",61],["1 evőkanál","1 tbsp",14]]],[47,"tej","Tükörtojás","Fried egg",191,13.6,0.8,14.8,0,0,0,1128,[["1 nagy db","1 large",46]]],[48,"tej","Tojásfehérje, folyékony (dobozos)","Liquid egg white (carton)",48,10,2,0,0,0,0,1226,[]],[49,"hus","Csirkemell, nyers","Chicken breast, raw",113,22.5,0,2.6,0,0,0,5062,[["1 darab","1 piece",272]]],[50,"hus","Csirkemell, sült","Chicken breast, roasted",156,31,0,3.6,0,0,0,5064,[]],[51,"hus","Csirkecomb, bőr nélkül, nyers","Chicken thigh, skinless, raw",116,19.7,0,4.1,0,0,0,5096,[]],[52,"hus","Csirkecomb, bőrrel, sült","Chicken thigh with skin, roasted",226,23.3,0,14.7,0,0,0,5094,[]],[53,"hus","Csirkeszárny, sült","Chicken wings, roasted",247,23.8,0,16.9,0,0,0,5103,[["1 darab","1 piece",85]]],[54,"hus","Egész csirke, sült","Whole chicken, roasted",232,27.3,0,13.6,0,0,0,5009,[]],[55,"hus","Csirkemáj","Chicken liver",114,16.9,0.7,4.8,0,0,0,5027,[]],[56,"hus","Pulykamell, nyers","Turkey breast, raw",114,23.3,0,2.3,0,0,0,5710,[]],[57,"hus","Pulykamell, sült","Turkey breast, roasted",136,29.5,0,2,0,0,0,5711,[]],[58,"hus","Pulykacomb, nyers","Turkey thigh, raw",108,21.3,0.1,2.5,0,0,0,5740,[]],[59,"hus","Pulyka darált hús","Ground turkey",148,19.7,0,7.7,0,0,0,5305,[["1 db","1 patty",114]]],[60,"hus","Kacsamell, bőrrel","Duck breast with skin",400,11.5,0,39.3,0,0,0,5139,[]],[61,"hus","Kacsamell, bőr nélkül","Duck breast, skinless",131,18.3,0.9,6,0,0,0,5141,[]],[62,"hus","Liba, hús","Goose meat",155,22.8,0,7.1,0,0,0,5148,[]],[63,"hus","Sertéskaraj, nyers","Pork loin, raw",137,21.4,0,5.7,0,0,0,10024,[]],[64,"hus","Sertéskaraj, sült","Pork loin, roasted",201,28.6,0,9.6,0,0,0,10027,[]],[65,"hus","Sertésszűz, nyers","Pork tenderloin, raw",103,20.9,0,2.2,0,0,0,10060,[]],[66,"hus","Sertéstarja, nyers","Pork neck/shoulder, raw",181,17.4,0,12.4,0,0,0,10080,[]],[67,"hus","Sertéscomb, nyers","Pork leg, raw",131,20.5,0,5.4,0,0,0,10010,[]],[68,"hus","Sertésoldalas","Pork spare ribs",273,15.5,0,23.4,0,0,0,10088,[]],[69,"hus","Sertés darált hús","Ground pork",258,16.9,0,21.2,0,0,0,10219,[]],[70,"hus","Sertésmáj","Pork liver",128,21.4,2.5,3.6,0,0,0,10110,[]],[71,"hus","Bacon, nyers","Bacon, raw",413,12.6,1.3,39.7,0,0,0,10123,[["1 szelet","1 slice",28]]],[72,"hus","Bacon, sült","Bacon, cooked",458,33.9,1.7,35.1,0,0,0,10862,[["1 szelet","1 slice",12]]],[73,"hus","Marhalábszár, nyers","Beef shank, raw",122,21.8,0,3.9,0,0,0,13227,[]],[74,"hus","Marhahátszín, nyers","Beef sirloin, raw",125,22.1,0,4.1,0,0,0,23611,[]],[75,"hus","Marhabélszín, nyers","Beef tenderloin, raw",147,22.1,0,6.5,0,0,0,23601,[]],[76,"hus","Marhafelsál, nyers","Beef round, raw",124,23.5,0,3.3,0,0,0,23324,[]],[77,"hus","Marha darált hús, 10% zsír","Ground beef, 10% fat",170,20,0,10,0,0,0,23562,[]],[78,"hus","Marha darált hús, 20% zsír","Ground beef, 20% fat",249,17.2,0,20,0,0,0,23572,[]],[79,"hus","Marhasteak, sült","Beef steak, grilled",170,29.4,0,5.8,0,0,0,23610,[]],[80,"hus","Bárányhús","Lamb",123,20.6,0,4.5,0,0,0,17013,[]],[81,"hus","Borjúhús","Veal",101,21.3,0,1.8,0,0,0,17099,[]],[82,"hus","Nyúlhús","Rabbit",130,20.1,0,5.5,0,0,0,17177,[]],[83,"hus","Vaddisznóhús","Wild boar",116,21.5,0,3.3,0,0,0,17158,[]],[84,"hus","Szarvashús","Venison",114,23,0,2.4,0,0,0,17164,[]],[85,"hal","Lazac, nyers","Salmon, raw",202,20.4,0,13.4,0,0,0,15236,[]],[86,"hal","Lazac, sült","Salmon, baked",199,22.1,0,12.3,0,0,0,15237,[]],[87,"hal","Füstölt lazac","Smoked salmon",112,18.3,0,4.3,0,0,0,15077,[]],[88,"hal","Tonhal, konzerv, saját lében","Tuna, canned in water",87,19.4,0,1,0,0,0,15121,[]],[89,"hal","Tonhal, konzerv, olajban","Tuna, canned in oil",190,29.1,0,8.2,0,0,0,15119,[]],[90,"hal","Tonhal, friss","Tuna, fresh",102,24.4,0,0.5,0,0,0,15127,[]],[91,"hal","Pisztráng","Trout",135,19.9,0,6.2,0,0,0,15240,[]],[92,"hal","Ponty","Carp",122,17.8,0,5.6,0,0,0,15008,[]],[93,"hal","Harcsa","Catfish",114,15.2,0,5.9,0,0,0,15234,[]],[94,"hal","Tőkehal","Cod",78,17.8,0,0.7,0,0,0,15015,[]],[95,"hal","Alaszkai tőkehal (pollock)","Alaska pollock",52,12.2,0,0.4,0,0,0,15066,[]],[96,"hal","Tilápia","Tilapia",96,20.1,0,1.7,0,0,0,15261,[]],[97,"hal","Pangasius (cápaharcsa)","Pangasius",90,15,0,3,0,0,0,0,[]],[98,"hal","Makréla","Mackerel",200,18.6,0,13.9,0,0,0,15046,[]],[99,"hal","Füstölt makréla","Smoked mackerel",300,19,0,25,0,0,0,0,[]],[100,"hal","Hering","Herring",153,18,0,9,0,0,0,15039,[]],[101,"hal","Szardínia, olajban","Sardines in oil",201,24.6,0,11.4,0,0,0,15088,[]],[102,"hal","Rántott halrudacska","Fish fingers",274,11,20.2,16.2,1.5,0,0,15027,[["1 darab","1 piece",57]]],[103,"hal","Garnélarák","Prawns",85,20.1,0,0.5,0,0,0,15270,[]],[104,"hal","Kagyló (fekete)","Mussels",82,11.9,3.7,2.2,0,0,0,15164,[]],[105,"hal","Tintahal","Squid",87,15.6,3.1,1.4,0,0,0,15175,[]],[106,"hal","Surimi rák","Surimi sticks",96,15.2,6.8,0.9,0,0,0,15109,[]],[107,"felv","Pulykasonka","Turkey ham",124,19.6,2.9,3.8,0,0,0,42128,[]],[108,"felv","Csirkemellsonka","Chicken breast ham",98,17.4,2.9,1.9,0,0,0,7961,[["1 szelet","1 slice",12]]],[109,"felv","Főtt sonka (sertés)","Cooked ham (pork)",156,16.6,2.5,8.6,1.3,0,0,7029,[["1 szelet","1 slice",28]]],[110,"felv","Sonka, extra sovány","Ham, extra lean",101,16.9,0.6,3.4,0,0,0,7028,[["1 szelet","1 slice",23]]],[111,"felv","Füstölt sonka (prosciutto típusú)","Cured ham (prosciutto type)",250,26,0.5,16,0,0,0,0,[]],[112,"felv","Párizsi","Bologna (párizsi)",304,15.2,5.5,24.6,0,0,0,7008,[]],[113,"felv","Pulykapárizsi","Turkey bologna",208,11.4,4.2,16.1,0.5,0,0,7011,[]],[114,"felv","Szalámi (téli szalámi típusú)","Salami (winter salami type)",372,21.1,0.7,31.6,0,0,0,7072,[["1 szelet","1 slice",10]]],[115,"felv","Csemege szalámi","Mild salami",420,22,1,37,0,0,0,0,[]],[116,"felv","Szárazkolbász (csabai típusú)","Dry sausage (Csabai type)",498,19.2,1.2,46.3,0,0,0,7057,[["1 darab","1 piece",2]]],[117,"felv","Kolbász, nyers (sütni való)","Fresh sausage (for frying)",288,15.4,0.9,24.8,0,0,0,7063,[["1 db","1 item",25]]],[118,"felv","Debreceni","Debreceni sausage",300,14,1,27,0,0,0,0,[["1 pár","1 pair",140]]],[119,"felv","Virsli","Frankfurter (virsli)",290,10.3,4.2,25.8,0,0,0,7950,[["1 pár","1 pair",100]]],[120,"felv","Pulykavirsli","Turkey frankfurter",220,12.2,3.8,17.3,0,0,0,7025,[["1 pár","1 pair",100]]],[121,"felv","Lecsókolbász","Lecsó sausage",290,13,2,26,0,0,0,0,[]],[122,"felv","Hurka (májas)","Liver sausage (hurka)",250,10,15,17,0.5,0,0,0,[]],[123,"felv","Véres hurka","Blood sausage",374,14.6,1.3,34.5,0,0,0,7005,[]],[124,"felv","Májpástétom","Liver pâté",315,14.2,1.5,28,0,0,0,7055,[["1 evőkanál","1 tbsp",13]]],[125,"felv","Kenőmájas","Liverwurst",302,12.4,5.9,25.4,0.0,0,0,7911,[]],[126,"felv","Szalonna (füstölt)","Smoked pork fat (szalonna)",640,9,0,67,0,0,0,0,[]],[127,"felv","Tepertő","Pork cracklings",590,28,0,53,0,0,0,0,[]],[128,"felv","Disznósajt","Brawn (head cheese)",153,13.8,0,10.9,0,0,0,7034,[["1 szelet","1 slice",28]]],[129,"felv","Löncshús (konzerv)","Luncheon meat (canned)",331,12.5,2.1,30.3,0,0,0,7045,[["1 szelet","1 slice",21]]],[130,"felv","Mortadella","Mortadella",306,16.4,3,25.4,0,0,0,7050,[["1 szelet","1 slice",15]]],[131,"felv","Chorizo","Chorizo",449,24.1,1.9,38.3,0,0,0,7019,[["1 db","1 item",60]]],[132,"gab","Fehér kenyér","White bread",257,8.8,46.7,3.3,2.7,0,0,18069,[["1 szelet","1 slice",35]]],[133,"gab","Félbarna kenyér","Wheat-rye bread",258,10.7,44.7,3.2,4,0,0,18064,[["1 szelet","1 slice",35]]],[134,"gab","Rozskenyér","Rye bread",245,8.5,42.5,3.3,5.8,0,0,18060,[["1 szelet","1 slice",35]]],[135,"gab","Teljes kiőrlésű kenyér","Wholemeal bread",240,12.4,36.7,3.5,6,0,0,18075,[["1 szelet","1 slice",35]]],[136,"gab","Magvas kenyér","Seeded bread",270,10,40,7,6,0,0,0,[["1 szelet","1 slice",35]]],[137,"gab","Toastkenyér","Toast bread",284,9,51.6,4,2.9,0,0,18070,[["1 szelet","1 slice",25]]],[138,"gab","Teljes kiőrlésű toastkenyér","Wholemeal toast bread",292,16.3,43.7,4.1,7.5,0,0,18076,[["1 szelet","1 slice",27]]],[139,"gab","Zsemle","Bread roll (zsemle)",284,9.9,50.4,4.3,2.3,0,0,18353,[["1 db","1 roll",60]]],[140,"gab","Kifli","Crescent roll (kifli)",300,9,55,4.5,2.5,0,0,0,[["1 db","1 roll",45]]],[141,"gab","Kakaós csiga","Cocoa swirl pastry",390,7,52,17,2,0,0,0,[["1 db","1 piece",110]]],[142,"gab","Croissant","Croissant",400,8.2,43.2,21,2.6,0,0,18239,[["1 db","1 croissant",60]]],[143,"gab","Bagel","Bagel",260,10.6,50.8,1.3,1.6,0,0,18001,[["1 db","1 item",99]]],[144,"gab","Hamburgerzsemle","Burger bun",271,9.8,48.3,3.9,1.8,0,0,18350,[["1 db","1 item",44]]],[145,"gab","Tortilla lap (búza)","Flour tortilla",295,8.2,45.9,8,3.5,0,0,18364,[["1 db","1 item",48]]],[146,"gab","Pita","Pitta bread",266,9.1,53.5,1.2,2.2,0,0,18041,[["1 db","1 item",60]]],[147,"gab","Puffasztott rizs szelet","Rice cakes",376,8.2,77.3,2.8,4.2,0,0,19816,[["1 db","1 cake",8]]],[148,"gab","Kétszersült","Rusks",363,12.9,69.0,2.3,7.4,0,0,18222,[]],[149,"gab","Ropi","Pretzel sticks",381,10,77.0,2.9,3.4,0,0,19047,[]],[150,"gab","Sós keksz (kréker)","Crackers",505,6.6,59.0,26.4,2.3,0,0,18229,[]],[151,"gab","Pogácsa (tepertős)","Savoury scone (pogácsa)",430,9,45,24,2,0,0,0,[["1 db","1 piece",35]]],[152,"gab","Pogácsa (sajtos)","Cheese scone (pogácsa)",400,11,45,19,2,0,0,0,[["1 db","1 piece",35]]],[153,"gab","Lángos (sima)","Lángos (fried dough)",300,6,40,13,2,0,0,0,[["1 db","1 piece",180]]],[154,"gab","Zabpehely","Rolled oats",362,13.2,57.6,6.5,10.1,0,0,8120,[["1 evőkanál","1 tbsp",8],["1 bögre (2,5 dl)","1 cup (250 ml)",90]]],[155,"gab","Zabkorpa","Oat bran",366,17.3,50.8,7,15.4,0,0,20033,[]],[156,"gab","Búzakorpa","Wheat bran",274,15.6,21.7,4.3,42.8,0,0,20077,[]],[157,"gab","Müzli (natúr)","Muesli (plain)",365,10,62,6,8,0,0,0,[]],[158,"gab","Granola","Granola",471,13.7,45.0,24.3,8.9,0,0,8037,[]],[159,"gab","Kukoricapehely","Cornflakes",363,7.5,80.8,0.4,3.3,0,0,8020,[]],[160,"gab","Gabonapehely, csokis","Chocolate cereal",386,3.3,83.4,3.5,3.8,0,0,8204,[]],[161,"gab","Búzaliszt (BL55)","Wheat flour (white)",350,10.3,73.6,1,2.7,0,0,20081,[]],[162,"gab","Teljes kiőrlésű liszt","Wholemeal flour",342,13.2,61.3,2.5,10.7,0,0,20080,[]],[163,"gab","Rozsliszt","Rye flour",335,10.9,63.6,1.5,11.8,0,0,20064,[]],[164,"gab","Zabliszt","Oat flour",390,14.7,59.2,9.1,6.5,0,0,20132,[]],[165,"gab","Kukoricaliszt","Corn flour",358,8.1,69.6,3.6,7.3,0,0,20020,[]],[166,"gab","Rizsliszt","Rice flour",352,6,77.7,1.4,2.4,0,0,20061,[]],[167,"gab","Kukoricadara (puliszka)","Polenta (cornmeal)",355,7.1,75.6,1.8,3.9,0,0,20022,[]],[168,"gab","Búzadara","Semolina",344,12.7,68.9,1.1,3.9,0,0,20066,[]],[169,"gab","Kuszkusz, száraz","Couscous, dry",356,12.8,72.4,0.6,5,0,0,20028,[]],[170,"gab","Kuszkusz, főtt","Couscous, cooked",107,3.8,21.8,0.2,1.4,0,0,20029,[]],[171,"gab","Bulgur, száraz","Bulgur, dry",340,12.3,63.4,1.3,12.5,0,0,20012,[]],[172,"gab","Bulgur, főtt","Bulgur, cooked",80,3.1,14.1,0.2,4.5,0,0,20013,[["1 evőkanál","1 tbsp",8]]],[173,"gab","Quinoa, száraz","Quinoa, dry",354,14.1,57.2,6.1,7,0,0,20035,[]],[174,"gab","Quinoa, főtt","Quinoa, cooked",114,4.4,18.5,1.9,2.8,0,0,20137,[]],[175,"gab","Hajdina, száraz","Buckwheat, dry",351,11.7,64.7,2.7,10.3,0,0,20009,[]],[176,"gab","Köles, száraz","Millet, dry",356,11,64.3,4.2,8.5,0,0,20031,[]],[177,"gab","Árpagyöngy, száraz","Pearl barley, dry",330,9.9,62.1,1.2,15.6,0,0,20005,[]],[178,"gab","Zsemlemorzsa","Breadcrumbs",380,13.3,67.5,5.3,4.5,0,0,18079,[]],[179,"gab","Chia mag","Chia seeds",442,16.5,7.7,30.7,34.4,0,0,12006,[]],[180,"koret","Rizs, fehér, nyers","White rice, uncooked",352,7.1,78.7,0.7,1.3,0,0,20044,[["1 bögre (2,5 dl)","1 cup (250 ml)",200]]],[181,"koret","Rizs, fehér, főtt","White rice, cooked",126,2.7,27.8,0.3,0.4,0,0,20045,[]],[182,"koret","Basmati rizs, nyers","Basmati rice, uncooked",352,7.1,78.7,0.7,1.3,0,0,20044,[]],[183,"koret","Jázmin rizs, nyers","Jasmine rice, uncooked",352,7.1,78.7,0.7,1.3,0,0,20044,[]],[184,"koret","Barna rizs, nyers","Brown rice, uncooked",356,7.5,72.6,3.2,3.6,0,0,20036,[]],[185,"koret","Barna rizs, főtt","Brown rice, cooked",119,2.7,24.0,1,1.6,0,0,20037,[]],[186,"koret","Rizottó rizs (arborio), nyers","Arborio rice, uncooked",346,6.6,77.9,0.6,1.4,0,0,20050,[]],[187,"koret","Vadrizs, nyers","Wild rice, uncooked",356,14.7,68.7,1.1,6.2,0,0,20088,[]],[188,"koret","Száraztészta, nyers","Dry pasta, uncooked",358,13,71.5,1.5,3.2,0,0,20120,[]],[189,"koret","Száraztészta, főtt","Pasta, cooked",151,5.8,29.1,0.9,1.8,0,0,20121,[]],[190,"koret","Teljes kiőrlésű tészta, nyers","Wholewheat pasta, uncooked",357,13.9,64.2,2.9,9.2,0,0,20124,[]],[191,"koret","Teljes kiőrlésű tészta, főtt","Wholewheat pasta, cooked",152,6,26.2,1.7,3.9,0,0,20125,[]],[192,"koret","Tojásos száraztészta (pl. cérnametélt, tarhonya), nyers","Egg pasta, dry (e.g. vermicelli, tarhonya)",375,14.2,68.0,4.4,3.3,0,0,20109,[]],[193,"koret","Tojásos tészta, főtt","Egg noodles, cooked",135,4.5,24.0,2.1,1.2,0,0,20310,[]],[194,"koret","Friss tészta (tojásos)","Fresh egg pasta",281,11.3,52.7,2.3,2,0,0,20093,[]],[195,"koret","Rizstészta, nyers","Rice noodles, uncooked",347,6,78.6,0.6,1.6,0,0,20133,[]],[196,"koret","Rizstészta, főtt","Rice noodles, cooked",103,1.8,23,0.2,1,0,0,20134,[]],[197,"koret","Nokedli (galuska)","Hungarian dumplings (nokedli)",160,5,29,2.5,1,0,0,0,[]],[198,"koret","Gnocchi","Gnocchi",150,4,32,0.5,1.5,0,0,0,[]],[199,"koret","Burgonya, nyers","Potato, raw",75,2,15.4,0.1,2.1,0,0,11352,[["1 közepes","1 medium",170]]],[200,"koret","Burgonya, főtt (héj nélkül)","Potato, boiled (peeled)",84,1.7,18.2,0.1,1.8,0,0,11367,[["1 nagy db","1 large",300]]],[201,"koret","Burgonya, sült (héjában)","Potato, baked (in skin)",91,2.5,18.9,0.1,2.2,0,0,11674,[]],[202,"koret","Burgonyapüré (tejjel, vajjal)","Mashed potatoes (milk, butter)",110,1.9,15.3,4.2,1.5,0,0,11934,[]],[203,"koret","Hasábburgonya (sütve)","French fries",167,2.7,26.1,5.2,2.6,0,0,11841,[]],[204,"koret","Hasábburgonya (gyorsétterem)","French fries (fast food)",304,3.4,37.6,14.7,3.8,0,0,21138,[]],[205,"koret","Édesburgonya, nyers","Sweet potato, raw",82,1.6,17.1,0.1,3,0,0,11507,[]],[206,"koret","Édesburgonya, sült","Sweet potato, baked",85,2,17.4,0.1,3.3,0,0,11508,[["1 nagy db","1 large",180]]],[207,"koret","Krokett (sütve)","Potato croquettes",196,2.1,25.3,9.1,2,0,0,11399,[]],[208,"huv","Vörös lencse, száraz","Red lentils, dry",346,23.9,52.3,2.2,10.8,0,0,16144,[]],[209,"huv","Barna lencse, száraz","Brown lentils, dry",340,24.6,52.7,1.1,10.7,0,0,16069,[]],[210,"huv","Lencse, főtt","Lentils, cooked",104,9,12.2,0.4,7.9,0,0,16070,[["1 evőkanál","1 tbsp",12]]],[211,"huv","Csicseriborsó, száraz","Chickpeas, dry",364,20.5,50.8,6,12.2,0,0,16056,[["1 evőkanál","1 tbsp",12]]],[212,"huv","Csicseriborsó, főtt/konzerv","Chickpeas, cooked/canned",153,8.9,19.8,2.6,7.6,0,0,16057,[]],[213,"huv","Fehér bab, száraz","White beans, dry",312,23.4,45.1,0.8,15.2,0,0,16049,[["1 evőkanál","1 tbsp",13]]],[214,"huv","Fehér bab, főtt/konzerv","White beans, cooked/canned",129,9.7,18.8,0.3,6.3,0,0,16050,[["1 evőkanál","1 tbsp",11]]],[215,"huv","Vörösbab, konzerv","Red kidney beans, canned",117,8,16.0,1.1,5.5,0,0,16145,[]],[216,"huv","Fekete bab, főtt","Black beans, cooked",118,8.9,15.0,0.5,8.7,0,0,16015,[]],[217,"huv","Tarkabab, főtt","Pinto beans, cooked",129,9,17.2,0.7,9,0,0,16043,[["1 evőkanál","1 tbsp",11]]],[218,"huv","Sült bab paradicsomszószban","Baked beans in tomato sauce",99,4.8,17.0,0.4,4.1,0,0,16006,[]],[219,"huv","Sárgaborsó (hasított), száraz","Split peas, dry",310,23.8,38.2,1.2,25.5,0,0,16085,[]],[220,"huv","Edamame","Edamame",120,11.9,3.7,5.2,5.2,0,0,11212,[]],[221,"huv","Szójabab, száraz","Soybeans, dry",427,36.5,20.9,19.9,9.3,0,0,16108,[]],[222,"huv","Tofu, natúr","Tofu, plain",154,17.3,0.5,8.7,2.3,0,0,16426,[]],[223,"huv","Tofu, füstölt","Tofu, smoked",150,16,2,9,1,0,0,0,[]],[224,"huv","Tempeh","Tempeh",199,20.3,2.6,10.8,5,0,0,16114,[]],[225,"huv","Szójagranulátum, száraz","Textured soy protein, dry",317,51.5,16.4,1.2,17.5,0,0,16117,[["1 evőkanál","1 tbsp",7]]],[226,"huv","Seitan","Seitan",120,24,4,1.5,0.5,0,0,0,[]],[227,"huv","Hummusz","Hummus",163,7.9,8.3,9.6,6,0,0,16158,[["1 evőkanál","1 tbsp",15]]],[228,"huv","Falafel","Falafel",331,13.3,26.8,17.8,5.0,0,0,16138,[["1 db","1 patty",17]]],[229,"mag","Mandula","Almonds",595,21.1,9.1,49.9,12.5,0,0,12061,[]],[230,"mag","Dió","Walnuts",689,15.2,7.0,65.2,6.7,0,0,12155,[]],[231,"mag","Földimogyoró, pörkölt","Peanuts, roasted",613,24.4,12.9,49.7,8.4,0,0,16390,[]],[232,"mag","Földimogyoró, sós","Peanuts, salted",613,24.4,12.9,49.7,8.4,0,0,16090,[]],[233,"mag","Mogyoróvaj","Peanut butter",631,22.2,17.3,51.4,5,0,0,16398,[["1 evőkanál","1 tbsp",16]]],[234,"mag","Mandulavaj","Almond butter",638,21,8.5,55.5,10.3,0,0,12195,[["1 evőkanál","1 tbsp",16]]],[235,"mag","Kesudió","Cashews",582,18.2,26.9,43.9,3.3,0,0,12087,[]],[236,"mag","Pisztácia","Pistachios",576,20.2,16.6,45.3,10.6,0,0,12151,[]],[237,"mag","Mogyoró (törökmogyoró)","Hazelnuts",654,14.9,7.0,60.8,9.7,0,0,12120,[]],[238,"mag","Brazil dió","Brazil nuts",693,14.3,4.2,67.1,7.5,0,0,12078,[]],[239,"mag","Pekándió","Pecans",721,9.2,4.3,72,9.6,0,0,12142,[]],[240,"mag","Makadámdió","Macadamia nuts",752,7.9,5.2,75.8,8.6,0,0,12131,[]],[241,"mag","Kókuszreszelék","Desiccated coconut",670,6.9,7.3,64.5,16.3,0,0,12108,[]],[242,"mag","Napraforgómag","Sunflower seeds",610,20.8,11.4,51.5,8.6,0,0,12036,[]],[243,"mag","Tökmag","Pumpkin seeds",593,30.2,4.7,49,6,0,0,12014,[]],[244,"mag","Lenmag","Flaxseed",514,18.3,1.6,42.2,27.3,0,0,12220,[["1 evőkanál","1 tbsp",10]]],[245,"mag","Szezámmag","Sesame seeds",588,17.7,11.6,49.7,11.8,0,0,12023,[["1 evőkanál","1 tbsp",9]]],[246,"mag","Tahini (szezámkrém)","Tahini",618,17,11.9,53.8,9.3,0,0,12166,[["1 evőkanál","1 tbsp",15]]],[247,"mag","Kendermag (hántolt)","Hemp seeds (hulled)",592,31.6,4.7,48.8,4,0,0,12012,[]],[248,"mag","Mák","Poppy seeds",520,18,8.6,41.6,19.5,0,0,2033,[["1 teáskanál","1 tsp",3],["1 evőkanál","1 tbsp",9]]],[249,"mag","Gesztenye (sült)","Chestnuts, roasted",234,3.2,47.9,2.2,5.1,0,0,12167,[]],[250,"mag","Gesztenyepüré","Chestnut purée",220,2,47,2,4,0,0,0,[]],[251,"zsir","Vaj","Butter",734,0.8,0.1,81.1,0,0,0,1145,[["1 kávéskanál","1 tsp",5],["1 evőkanál","1 tbsp",14]]],[252,"zsir","Margarin (80%)","Margarine (80%)",730,0.2,0.7,80.7,0,0,0,4617,[["1 kávéskanál","1 tsp",5]]],[253,"zsir","Light margarin / kenőkrém","Light spread",547,0.1,0.7,60.4,0,0,0,4612,[["1 kávéskanál","1 tsp",5]]],[254,"zsir","Olívaolaj","Olive oil",822,0,0,91.3,0,0,1,4053,[["1 evőkanál","1 tbsp",15],["1 teáskanál","1 tsp",5]]],[255,"zsir","Napraforgóolaj","Sunflower oil",828,0,0,92,0,0,1,4060,[["1 evőkanál","1 tbsp",15]]],[256,"zsir","Repceolaj","Rapeseed oil",852,0,0,94.7,0,0,1,4582,[["1 evőkanál","1 tbsp",15]]],[257,"zsir","Kókuszzsír / kókuszolaj","Coconut oil",892,0,0,99.1,0,0,0,4047,[["1 evőkanál","1 tbsp",14]]],[258,"zsir","Sertészsír","Lard",900,0,0,100,0,0,0,4002,[["1 evőkanál","1 tbsp",13]]],[259,"zsir","Libazsír","Goose fat",898,0,0,99.8,0,0,0,4576,[["1 evőkanál","1 tbsp",13]]],[260,"zsir","Ghí (tisztított vaj)","Ghee (clarified butter)",897,0.3,0,99.5,0,0,0,1003,[["1 evőkanál","1 tbsp",13]]],[261,"zsir","Szezámolaj","Sesame oil",829,0,0,92.1,0,0,1,4058,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[262,"zsir","Lenmagolaj","Linseed oil",828,0.1,0,92,0,0,1,42231,[["1 evőkanál","1 tbsp",14]]],[263,"zold","Paradicsom","Tomato",19,0.9,2.7,0.2,1.2,0,0,11529,[["1 közepes","1 medium",120]]],[264,"zold","Koktélparadicsom","Cherry tomatoes",19,0.9,2.7,0.2,1.2,0,0,11529,[]],[265,"zold","Zöldpaprika (TV, hegyes)","Green pepper (Hungarian wax type)",20,0.9,2.9,0.2,1.7,0,0,11333,[["1 db","1 piece",100]]],[266,"zold","Paprika, piros (kápia, kaliforniai)","Red pepper (bell/kápia)",26,1,3.9,0.3,2.1,0,0,11821,[]],[267,"zold","Paprika, sárga (kaliforniai)","Yellow bell pepper",29,1,5.4,0.2,0.9,0,0,11951,[]],[268,"zold","Erős paprika (chili)","Chilli pepper",43,1.9,7.3,0.4,1.5,0,0,11819,[]],[269,"zold","Uborka","Cucumber",17,0.7,3.1,0.1,0.5,0,0,11205,[["1 közepes","1 medium",300]]],[270,"zold","Saláta (fejes)","Lettuce",14,1.4,1.1,0.2,1.1,0,0,11250,[]],[271,"zold","Jégsaláta","Iceberg lettuce",14,0.9,1.8,0.1,1.2,0,0,11252,[]],[272,"zold","Római saláta","Romaine lettuce",16,1.2,1.2,0.3,2.1,0,0,11251,[["1 levél","1 leaf",6]]],[273,"zold","Rukkola","Rocket",28,2.6,2.0,0.7,1.6,0,0,11959,[["1 levél","1 leaf",2]]],[274,"zold","Spenót, friss","Spinach, fresh",25,2.9,1.4,0.4,2.2,0,0,11457,[]],[275,"zold","Spenót, fagyasztott","Spinach, frozen",31,3.6,1.3,0.6,2.9,0,0,11463,[]],[276,"zold","Vöröshagyma","Onion",39,1.1,7.6,0.1,1.7,0,0,11282,[["1 fej (közepes)","1 medium onion",110]]],[277,"zold","Lilahagyma","Red onion",39,1.1,7.6,0.1,1.7,0,0,11282,[]],[278,"zold","Újhagyma","Spring onion",33,1.8,4.7,0.2,2.6,0,0,11291,[["1 evőkanál","1 tbsp",6]]],[279,"zold","Fokhagyma","Garlic",158,6.4,31.0,0.5,2.1,0,0,11215,[["1 gerezd","1 clove",4]]],[280,"zold","Póréhagyma","Leek",62,1.5,12.4,0.3,1.8,0,0,11246,[]],[281,"zold","Sárgarépa","Carrot",38,0.9,6.8,0.2,2.8,0,0,11124,[["1 közepes","1 medium",70]]],[282,"zold","Petrezselyemgyökér","Parsley root",70,1.2,13.1,0.3,4.9,0,0,11298,[]],[283,"zold","Zeller (gumó)","Celeriac",42,1.5,7.4,0.3,1.8,0,0,11141,[]],[284,"zold","Szárzeller","Celery stalk",13,0.7,1.4,0.2,1.6,0,0,11143,[]],[285,"zold","Cékla","Beetroot",41,1.6,6.8,0.2,2.8,0,0,11080,[]],[286,"zold","Cékla, savanyított (üveges)","Pickled beetroot (jar)",68,0.8,15.5,0.1,0.8,0,0,11609,[]],[287,"zold","Retek","Radish",14,0.7,1.8,0.1,1.6,0,0,11429,[["1 nagy db","1 large",9]]],[288,"zold","Káposzta, fehér","White cabbage",24,1.3,3.3,0.1,2.5,0,0,11109,[]],[289,"zold","Lilakáposzta","Red cabbage",33,1.4,5.3,0.2,2.1,0,0,11112,[]],[290,"zold","Kelkáposzta","Savoy cabbage",27,2,3.0,0.1,3.1,0,0,11114,[]],[291,"zold","Savanyú káposzta","Sauerkraut",16,0.9,1.4,0.1,2.9,0,0,11439,[]],[292,"zold","Kínai kel","Chinese cabbage",17,1.2,2.0,0.2,1.2,0,0,11119,[]],[293,"zold","Brokkoli","Broccoli",36,2.8,4.0,0.4,2.6,0,0,11090,[]],[294,"zold","Brokkoli, fagyasztott","Broccoli, frozen",27,2.8,1.8,0.3,3,0,0,11092,[]],[295,"zold","Karfiol","Cauliflower",26,1.9,3,0.3,2,0,0,11135,[]],[296,"zold","Kelbimbó","Brussels sprouts",44,3.4,5.1,0.3,3.8,0,0,11098,[]],[297,"zold","Fodros kel (kale)","Kale",53,4.3,5.2,0.9,3.6,0,0,11233,[]],[298,"zold","Karalábé","Kohlrabi",25,1.7,2.6,0.1,3.6,0,0,11241,[["1 szelet","1 slice",16]]],[299,"zold","Cukkini","Courgette",18,1.2,2.1,0.3,1,0,0,11477,[]],[300,"zold","Padlizsán","Aubergine",23,1,2.9,0.2,3,0,0,11209,[]],[301,"zold","Sütőtök","Butternut squash",48,1,9.7,0.1,2,0,0,11485,[]],[302,"zold","Spárgatök/patiszon","Summer squash",18,1.2,2.3,0.2,1.1,0,0,11641,[["1 nagy db","1 large",323]]],[303,"zold","Zöldborsó, friss/fagyasztott","Green peas",70,5.2,9.1,0.4,4.5,0,0,11312,[]],[304,"zold","Zöldborsó, konzerv","Green peas, canned",64,4.3,7.3,0.9,4.5,0,0,11311,[]],[305,"zold","Zöldbab","Green beans",32,1.8,4.3,0.2,2.7,0,0,11052,[]],[306,"zold","Zöldbab, fagyasztott","Green beans, frozen",34,1.8,4.9,0.2,2.6,0,0,11060,[]],[307,"zold","Csemegekukorica, konzerv","Sweetcorn, canned",73,2.3,12.3,1.2,2,0,0,11172,[]],[308,"zold","Csemegekukorica, főtt (cső)","Corn on the cob, boiled",106,3.4,18.6,1.5,2.4,0,0,11168,[]],[309,"zold","Spárga","Asparagus",21,2.2,1.8,0.1,2.1,0,0,11011,[]],[310,"zold","Gomba (csiperke)","Mushrooms (button)",26,3.1,2.3,0.3,1,0,0,11260,[]],[311,"zold","Gomba, konzerv","Mushrooms, canned",26,1.9,2.7,0.3,2.4,0,0,11264,[]],[312,"zold","Laskagomba","Oyster mushrooms",37,3.3,3.8,0.4,2.3,0,0,11987,[["1 nagy db","1 large",148],["1 kis db","1 small",15]]],[313,"zold","Shiitake","Shiitake",36,2.2,4.3,0.5,2.5,0,0,11238,[["1 darab","1 piece",19]]],[314,"zold","Avokádó","Avocado",161,2,1.8,14.7,6.7,0,0,9037,[["1 db (hús)","1 piece (flesh)",140]]],[315,"zold","Olajbogyó (zöld)","Olives, green",150,1,0.5,15.3,3.3,0,0,9195,[]],[316,"zold","Olajbogyó (fekete)","Olives, black",118,0.8,3.1,10.7,3.2,0,0,9193,[["1 evőkanál","1 tbsp",8],["1 nagy db","1 large",4]]],[317,"zold","Csemegeuborka (savanyú)","Pickled gherkins",12,0.5,1.4,0.3,1,0,0,11937,[["1 szelet","1 slice",7]]],[318,"zold","Csalamádé / vegyes savanyúság","Mixed pickles",45,0.8,9.5,0.2,1.5,0,0,0,[]],[319,"zold","Fagyasztott zöldségkeverék","Frozen mixed vegetables",64,3.3,9.5,0.5,4,0,0,11583,[]],[320,"zold","Lecsó (paprika, paradicsom, hagyma)","Lecsó (pepper-tomato stew)",45,1.2,6,1.8,1.8,0,0,0,[]],[321,"zold","Petrezselyem (zöld)","Parsley (leaves)",38,3,3.0,0.8,3.3,0,0,11297,[["1 evőkanál","1 tbsp",4]]],[322,"zold","Kapor","Dill",48,3.5,4.9,1.1,2.1,0,0,2045,[]],[323,"zold","Bazsalikom, friss","Basil, fresh",25,3.1,1.0,0.6,1.6,0,0,2044,[]],[324,"zold","Koriander, friss","Coriander, fresh",22,2.1,0.9,0.5,2.8,0,0,11165,[]],[325,"zold","Gyömbér, friss","Ginger, fresh",82,1.8,15.8,0.8,2,0,0,11216,[["1 teáskanál","1 tsp",2]]],[326,"zold","Torma","Horseradish",50,1.2,8.0,0.7,3.3,0,0,2055,[["1 teáskanál","1 tsp",5],["1 evőkanál","1 tbsp",15]]],[327,"zold","Vöröshagyma, pirított","Fried onions",120,1.5,10,8,2,0,0,0,[]],[328,"zold","Napon szárított paradicsom (olajban)","Sun-dried tomatoes (in oil)",229,5.1,17.5,14.1,5.8,0,0,11956,[["1 darab","1 piece",3]]],[329,"zold","Sült paprika (üveges)","Roasted peppers (jar)",19,0.8,2.7,0.3,1.2,0,0,11916,[]],[330,"gyum","Alma","Apple",53,0.3,11.4,0.2,2.4,0,0,9003,[["1 közepes","1 medium",180]]],[331,"gyum","Körte","Pear",57,0.4,12.1,0.1,3.1,0,0,9252,[["1 közepes","1 medium",180]]],[332,"gyum","Banán","Banana",93,1.1,20.2,0.3,2.6,0,0,9040,[["1 közepes (héj nélkül)","1 medium (peeled)",120]]],[333,"gyum","Narancs","Orange",47,0.9,9.4,0.1,2.4,0,0,9200,[["1 közepes (héj nélkül)","1 medium (peeled)",140]]],[334,"gyum","Mandarin","Mandarin",56,0.8,11.5,0.3,1.8,0,0,9218,[["1 db (héj nélkül)","1 piece (peeled)",75]]],[335,"gyum","Grapefruit","Grapefruit",44,0.8,9.1,0.1,1.6,0,0,9112,[]],[336,"gyum","Citrom","Lemon",29,1.1,6.5,0.3,2.8,0,0,9150,[["1 db","1 item",58]]],[337,"gyum","Lime","Lime",30,0.7,7.7,0.2,2.8,0,0,9159,[["1 db","1 item",67]]],[338,"gyum","Szőlő","Grapes",75,0.7,17.2,0.2,0.9,0,0,9132,[]],[339,"gyum","Eper","Strawberries",32,0.7,5.7,0.3,2,0,0,9316,[]],[340,"gyum","Málna","Raspberries",46,1.2,5.4,0.7,6.5,0,0,9302,[]],[341,"gyum","Áfonya (kék)","Blueberries",59,0.7,12.1,0.3,2.4,0,0,9050,[]],[342,"gyum","Szeder","Blackberries",38,1.4,4.3,0.5,5.3,0,0,9042,[]],[343,"gyum","Ribizli (piros)","Redcurrants",54,1.4,9.5,0.2,4.3,0,0,9084,[]],[344,"gyum","Fekete ribizli","Blackcurrants",57,1.4,8.6,0.4,6.8,0,0,9083,[]],[345,"gyum","Egres","Gooseberries",41,0.9,5.9,0.6,4.3,0,0,9107,[]],[346,"gyum","Erdei gyümölcs, fagyasztott","Frozen mixed berries",61,1.2,10.7,0.4,5,0,0,9048,[]],[347,"gyum","Cseresznye","Cherries (sweet)",66,1.1,13.9,0.2,2.1,0,0,9070,[]],[348,"gyum","Meggy","Sour cherries",52,1,10.6,0.3,1.6,0,0,9063,[]],[349,"gyum","Őszibarack","Peach",40,0.9,8.0,0.2,1.5,0,0,9236,[["1 közepes","1 medium",150]]],[350,"gyum","Nektarin","Nectarine",46,1.1,8.9,0.3,1.7,0,0,9191,[["1 kis db","1 small",129]]],[351,"gyum","Sárgabarack","Apricot",50,1.4,9.1,0.4,2,0,0,9021,[]],[352,"gyum","Szilva","Plum",48,0.7,10.0,0.3,1.4,0,0,9279,[["1 db","1 item",66]]],[353,"gyum","Görögdinnye","Watermelon",32,0.6,7.1,0.1,0.4,0,0,9326,[]],[354,"gyum","Sárgadinnye","Melon (cantaloupe)",36,0.8,7.3,0.2,0.9,0,0,9181,[]],[355,"gyum","Mézdinnye","Honeydew melon",38,0.5,8.3,0.1,0.8,0,0,9184,[]],[356,"gyum","Kivi","Kiwi",62,1.1,11.7,0.5,3,0,0,9148,[["1 db (héj nélkül)","1 piece (peeled)",70]]],[357,"gyum","Ananász","Pineapple",52,0.5,11.7,0.1,1.4,0,0,9266,[["1 db","1 item",905]]],[358,"gyum","Mangó","Mango",64,0.8,13.4,0.4,1.6,0,0,9176,[["1 db","1 item",336]]],[359,"gyum","Papaya","Papaya",44,0.5,9.1,0.3,1.7,0,0,9226,[]],[360,"gyum","Gránátalma","Pomegranate",84,1.7,14.7,1.2,4,0,0,9286,[]],[361,"gyum","Füge, friss","Fig, fresh",77,0.8,16.3,0.3,2.9,0,0,9089,[["1 nagy db","1 large",64],["1 közepes db","1 medium",50]]],[362,"gyum","Licsi","Lychee",70,0.8,15.2,0.4,1.3,0,0,9164,[["1 db","1 item",10]]],[363,"gyum","Maracuja","Passion fruit",88,2.2,13.0,0.7,10.4,0,0,9231,[["1 db","1 item",18]]],[364,"gyum","Birs","Quince",60,0.4,13.4,0.1,1.9,0,0,9296,[["1 db","1 item",92]]],[365,"gyum","Kaki (datolyaszilva)","Persimmon (kaki)",71,0.6,15.0,0.2,3.6,0,0,9263,[["1 db","1 item",168]]],[366,"gyum","Mazsola","Raisins",326,3.1,75.5,0.5,3.7,0,0,9298,[]],[367,"gyum","Aszalt szilva","Prunes",254,2.2,56.8,0.4,7.1,0,0,9291,[]],[368,"gyum","Aszalt sárgabarack","Dried apricots",254,3.4,55.3,0.5,7.3,0,0,9032,[]],[369,"gyum","Datolya (aszalt)","Dates (dried)",295,1.8,68.3,0.1,6.7,0,0,9421,[]],[370,"gyum","Aszalt füge","Dried figs",257,3.3,54.1,0.9,9.8,0,0,9094,[]],[371,"gyum","Aszalt vörösáfonya","Dried cranberries",331,0.2,77.5,1.1,5.3,0,0,9079,[]],[372,"gyum","Banánchips","Banana chips",365,3.9,78.4,1.8,9.9,0,0,9041,[["1 evőkanál","1 tbsp",6]]],[373,"gyum","Ananászkonzerv (lében)","Canned pineapple (in juice)",64,0.4,14.9,0.1,0.8,0,0,9268,[["1 szelet","1 slice",47]]],[374,"gyum","Őszibarack-befőtt (szirupban)","Canned peaches (in syrup)",80,0.5,18.6,0.1,1.3,0,0,9241,[]],[375,"gyum","Mandarinkonzerv","Canned mandarins",66,0.5,15.5,0.1,0.7,0,0,9220,[]],[376,"gyum","Almapüré, cukrozatlan","Apple purée, unsweetened",45,0.2,10.2,0.1,1.1,0,0,9019,[]],[377,"konz","Paradicsomsűrítmény (püré)","Tomato paste (concentrate)",89,4.3,14.8,0.5,4.1,0,0,11546,[]],[378,"konz","Passata (szűrt paradicsom)","Passata (strained tomatoes)",40,1.6,7.1,0.2,1.9,0,0,11547,[]],[379,"konz","Darabolt paradicsom (konzerv)","Chopped tomatoes (canned)",15,0.8,1.6,0.2,1.9,0,0,11531,[["1 evőkanál","1 tbsp",15]]],[380,"konz","Hámozott paradicsom (konzerv)","Peeled tomatoes (canned)",15,0.8,1.6,0.2,1.9,0,0,11531,[["1 evőkanál","1 tbsp",15]]],[381,"konz","Paradicsomlé","Tomato juice",20,0.9,3.2,0.3,0.4,0,1,11886,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[382,"konz","Ketchup","Ketchup",114,1,27.1,0.1,0.3,0,0,11935,[["1 evőkanál","1 tbsp",17]]],[383,"konz","Majonéz","Mayonnaise",680,1,0.6,74.8,0,0,0,4025,[["1 evőkanál","1 tbsp",14]]],[384,"konz","Majonéz, light","Light mayonnaise",238,0.4,9.2,22.2,0,0,0,4641,[]],[385,"konz","Mustár","Mustard",60,3.7,1.8,3.3,4,0,0,2046,[["1 teáskanál","1 tsp",5]]],[386,"konz","Dijoni mustár","Dijon mustard",150,7,6,11,3,0,0,0,[]],[387,"konz","Tartármártás","Tartare sauce",206,1,12.8,16.7,0.5,0,0,27049,[]],[388,"konz","BBQ szósz","BBQ sauce",170,0.8,39.9,0.6,0.9,0,0,6150,[["1 evőkanál","1 tbsp",17]]],[389,"konz","Szójaszósz","Soy sauce",60,8.8,4.4,0.6,0.9,0,1,16123,[["1 evőkanál","1 tbsp",16],["1 teáskanál","1 tsp",5]]],[390,"konz","Csípős szósz (chili)","Hot sauce",88,1.9,17.0,0.9,2.2,0,0,6631,[["1 teáskanál","1 tsp",6]]],[391,"konz","Sweet chili szósz","Sweet chilli sauce",200,0.5,48,0.5,1,0,0,0,[]],[392,"konz","Pesto (bazsalikomos)","Pesto (basil)",423,5,4.4,42.4,1.7,0,0,6627,[]],[393,"konz","Bolognai szósz (üveges)","Bolognese sauce (jar)",85,4.5,6,4.5,1.2,0,0,0,[]],[394,"konz","Paradicsomos tésztaszósz","Tomato pasta sauce",46,1.4,5.6,1.6,1.8,0,0,6931,[]],[395,"konz","Sajtszósz","Cheese sauce",173,6.7,6.3,13.3,0.5,0,0,6930,[]],[396,"konz","Salsa","Salsa",30,1.5,4.7,0.2,1.9,0,0,6164,[]],[397,"konz","Ajvár","Ajvar",90,1.5,8,5.5,2.5,0,0,0,[]],[398,"konz","Guacamole","Guacamole",155,2,2.5,14,6,0,0,0,[]],[399,"konz","Tzatziki","Tzatziki",110,4,4,8.5,0.3,0,0,0,[]],[400,"konz","Salátaöntet (vinaigrette)","Vinaigrette dressing",240,0.4,12.1,21.1,0,0,0,4114,[["1 evőkanál","1 tbsp",15]]],[401,"konz","Caesar öntet","Caesar dressing",542,2.2,2.8,57.9,0.5,0,0,43015,[["1 evőkanál","1 tbsp",15]]],[402,"konz","Ecet","Vinegar",18,0,0,0,0,0,1,2053,[["1 evőkanál","1 tbsp",15]]],[403,"konz","Balzsamecet","Balsamic vinegar",95,0.5,18.4,0,0,0,1,2069,[["1 evőkanál","1 tbsp",16]]],[404,"konz","Kókusztej (konzerv)","Coconut milk (canned)",198,1.9,0.7,20.4,2,0,1,12118,[["1 evőkanál","1 tbsp",15]]],[405,"konz","Kókusztej, light","Coconut milk, light",75,0.7,1.5,7.5,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[406,"konz","Húsleves kockából (elkészítve)","Bouillon from stock cube (prepared)",3,0.2,0.3,0.1,0,0,1,6475,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[407,"konz","Zöldségleves alaplé","Vegetable stock",5,0.2,0.9,0.1,0,0,1,6700,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[408,"konz","Pirospaprika (őrölt)","Ground paprika",319,14.1,19.1,12.9,34.9,0,0,2028,[["1 teáskanál","1 tsp",2],["1 evőkanál","1 tbsp",7]]],[409,"konz","Fahéj","Cinnamon",243,4,27.5,1.2,53.1,0,0,2010,[["1 teáskanál","1 tsp",3],["1 evőkanál","1 tbsp",8]]],[410,"konz","Kakaópor (cukrozatlan)","Cocoa powder (unsweetened)",359,19.6,20.9,13.7,37,0,0,19165,[["1 evőkanál","1 tbsp",5]]],[411,"konz","Só","Salt",0,0,0,0,0,0,0,2047,[["1 teáskanál","1 tsp",6],["1 evőkanál","1 tbsp",18]]],[412,"konz","Élesztő","Yeast",107,8.4,10.0,1.9,8.1,0,0,18374,[["1 db","1 item",17]]],[413,"konz","Sütőpor","Baking powder",53,0,27.5,0,0.2,0,0,18369,[["1 teáskanál","1 tsp",5]]],[414,"konz","Kukoricakeményítő","Cornstarch",366,0.3,90.4,0.1,0.9,0,0,20027,[]],[415,"konz","Zselatin","Gelatine",343,85.6,0,0.1,0,0,0,19177,[]],[416,"edes","Cukor (kristálycukor)","Sugar",400,0,100,0,0,0,0,19335,[["1 teáskanál","1 tsp",5],["1 kockacukor","1 sugar cube",4]]],[417,"edes","Barna cukor","Brown sugar",393,0.1,98.1,0,0,0,0,19334,[["1 teáskanál","1 tsp",3]]],[418,"edes","Porcukor","Icing sugar",399,0,99.8,0,0,0,0,19336,[]],[419,"edes","Méz","Honey",330,0.3,82.2,0,0.2,0,0,19296,[["1 teáskanál","1 tsp",7],["1 evőkanál","1 tbsp",21]]],[420,"edes","Juharszirup","Maple syrup",269,0,67,0.1,0,0,0,19353,[["1 evőkanál","1 tbsp",20]]],[421,"edes","Agavé szirup","Agave syrup",310,0.1,76.2,0.5,0.2,0,0,19912,[["1 teáskanál","1 tsp",7]]],[422,"edes","Eritrit / édesítő","Erythritol / sweetener",0,0,0.0,0,0,0,0,0,[]],[423,"edes","Lekvár","Jam",276,0.4,67.8,0.1,1.1,0,0,19297,[["1 evőkanál","1 tbsp",20]]],[424,"edes","Lekvár, csökkentett cukor","Reduced-sugar jam",160,0.4,39,0.1,1.2,0,0,0,[]],[425,"edes","Kakaós mogyorókrém (pl. Nutella)","Chocolate hazelnut spread (e.g. Nutella)",527,5.4,56.8,29.7,5.4,0,0,19125,[["1 evőkanál","1 tbsp",19]]],[426,"edes","Étcsokoládé (70%)","Dark chocolate (70%)",576,7.8,35.0,42.6,10.9,0,0,19904,[["1 db","1 item",101]]],[427,"edes","Tejcsokoládé","Milk chocolate",529,7.7,56.0,29.7,3.4,0,0,19120,[["1 db","1 item",7]]],[428,"edes","Fehércsokoládé","White chocolate",549,5.9,59.0,32.1,0.2,0,0,19087,[["1 db","1 item",85],["1 evőkanál","1 tbsp",14]]],[429,"edes","Mogyorós csokiszelet (pl. Snickers)","Peanut chocolate bar (e.g. Snickers)",486,7.5,59.2,23.9,2.3,0,0,19155,[["1 db","1 item",57]]],[430,"edes","Ostyás csokiszelet (pl. Kit Kat)","Wafer bar (e.g. Kit Kat)",516,6.5,63.6,26,1,0,0,19109,[["1 db","1 item",42]]],[431,"edes","Túró Rudi (csokis túródesszert)","Túró Rudi (chocolate-coated quark bar)",415,9,36,26,0.5,0,0,0,[["1 db","1 bar",30]]],[432,"edes","Gumicukor","Gummy sweets",395,0,98.8,0,0.1,0,0,19106,[]],[433,"edes","Kemény cukorka","Hard candy",394,0,98,0.2,0,0,0,19107,[["1 darab","1 piece",6]]],[434,"edes","Mályvacukor","Marshmallows",334,1.8,81.2,0.2,0.1,0,0,19116,[]],[435,"edes","Vajas keksz","Butter biscuits",468,6.1,68.1,18.8,0.8,0,0,18155,[["1 db","1 item",5]]],[436,"edes","Zabkeksz","Oat biscuits",457,6.2,65.9,18.1,2.8,0,0,18178,[["1 db","1 item",25]]],[437,"edes","Csokis keksz","Chocolate chip cookies",500,5.1,63.4,24.7,2,0,0,18159,[["1 db","1 item",13]]],[438,"edes","Linzer / omlós keksz","Shortbread",510,5.4,62.5,26.2,1.3,0,0,18192,[["1 db","1 item",12]]],[439,"edes","Ostya","Wafers",503,3.8,69.0,23.2,1.6,0,0,18209,[["1 db","1 item",10]]],[440,"edes","Piskóta (babapiskóta)","Sponge fingers",289,5.4,60.5,2.7,0.5,0,0,18133,[["1 darab","1 piece",38]]],[441,"edes","Müzliszelet","Muesli bar",444,7.4,62.7,17.2,4.6,0,0,19020,[["1 db","1 bar",25]]],[442,"edes","Fehérjeszelet","Protein bar",360,30,35,11,6,0,0,0,[["1 db","1 bar",60]]],[443,"edes","Puding (elkészítve, tejjel)","Pudding (made with milk)",113,2.8,18.8,2.9,0.1,0,0,19207,[]],[444,"edes","Tejberizs","Rice pudding",105,3.2,18.1,2.1,0.3,0,0,19193,[]],[445,"edes","Fagylalt (tejes)","Ice cream",206,3.5,22.9,11,0.7,0,0,19095,[]],[446,"edes","Jégkrém (gyümölcs)","Fruit ice lolly",28,0.5,6.2,0.1,0,0,0,19217,[["1 db","1 item",51]]],[447,"edes","Fagyasztott joghurt","Frozen yoghurt",163,4,24.2,5.6,0,0,0,19293,[]],[448,"edes","Piskótatorta / tortaszelet","Layer cake slice",402,3.5,50.6,20.1,2.2,0,0,18096,[["1 darab","1 piece",138],["1 db","1 item",1660]]],[449,"edes","Sajttorta","Cheesecake",326,5.5,25.1,22.5,0.4,0,0,18147,[["1 darab","1 piece",80]]],[450,"edes","Almás pite","Apple pie",274,3.3,38.9,11.2,2.2,0,0,18354,[["1 darab","1 piece",71]]],[451,"edes","Túrós táska","Quark pastry",330,9,40,15,1,0,0,0,[]],[452,"edes","Fánk","Doughnut",416,6.1,45.8,22.7,2.1,0,0,18255,[["1 db","1 doughnut",60]]],[453,"edes","Palacsinta (natúr)","Pancake (crêpe), plain",200,7,25,8,0.8,0,0,0,[]],[454,"edes","Gofri","Waffle",285,7.9,30.4,14.1,2.5,0,0,18367,[]],[455,"edes","Muffin","Muffin",373,4.5,51.9,16.1,1.1,0,0,18274,[]],[456,"edes","Brownie","Brownie",420,5,60,18,2,0,0,0,[]],[457,"edes","Bejgli (diós/mákos)","Bejgli (walnut/poppy roll)",400,8,50,18,3,0,0,0,[]],[458,"edes","Mákos guba","Poppy seed bread pudding",250,8,38,8,3,0,0,0,[]],[459,"edes","Burgonyachips","Potato crisps",541,6.4,50.7,34,3.1,0,0,19411,[]],[460,"edes","Tortilla chips","Tortilla chips",475,7.1,62.4,20.7,5.4,0,0,19056,[]],[461,"edes","Popcorn (sós, olajos)","Popcorn (salted, oil)",585,7.3,37.0,43.5,8.1,0,0,19035,[]],[462,"edes","Popcorn (natúr)","Popcorn (air-popped)",374,12.9,63.3,4.5,14.5,0,0,19034,[]],[463,"edes","Sós perec","Pretzels",381,10,77.0,2.9,3.4,0,0,19047,[]],[464,"edes","Puffasztott sajtos snack","Cheese puffs",558,5.8,52.1,36,1.4,0,0,19008,[]],[465,"ital","Víz","Water",0,0,0,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[466,"ital","Ásványvíz","Mineral water",0,0,0,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[467,"ital","Kávé (fekete)","Coffee (black)",1,0.1,0,0,0,0,1,14209,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[468,"ital","Eszpresszó","Espresso",9,0.1,1.7,0.2,0,0,1,14210,[["1 csésze (3 cl)","1 cup (30 ml)",30]]],[469,"ital","Cappuccino","Cappuccino",40,2.2,3.5,2,0,0,1,0,[["1 csésze (2 dl)","1 cup (200 ml)",200]]],[470,"ital","Caffè latte","Caffè latte",55,3,4.5,2.8,0,0,1,0,[["1 pohár (3 dl)","1 glass (300 ml)",300]]],[471,"ital","Tea (cukor nélkül)","Tea (unsweetened)",1,0,0.3,0,0,0,1,14355,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[472,"ital","Narancslé (100%)","Orange juice (100%)",52,0.7,11.8,0.1,0.3,0,1,9209,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[473,"ital","Almalé (100%)","Apple juice (100%)",48,0.1,11.6,0.1,0.2,0,1,9016,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[474,"ital","Multivitamin gyümölcslé","Multivitamin juice",50,0,12.6,0,0,0,1,14264,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[475,"ital","Szörp (hígítva)","Fruit cordial (diluted)",30,0,7.5,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[476,"ital","Smoothie (gyümölcs)","Fruit smoothie",55,0.6,12.5,0.2,1,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[477,"ital","Kóla","Cola",46,0,10.8,0.3,0,0,1,14148,[["1 doboz (0,33 l)","1 can (330 ml)",330]]],[478,"ital","Kóla (cukormentes)","Cola (sugar-free)",0,0,0.1,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[479,"ital","Szénsavas üdítő (narancs)","Orange soda",52,0,12.9,0,0,0,1,14150,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[480,"ital","Jeges tea","Iced tea",46,0,10.8,0.3,0,0,1,14199,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[481,"ital","Energiaital","Energy drink",43,0.5,10.2,0,0,0,1,14154,[["1 doboz (0,25 l)","1 can (250 ml)",250]]],[482,"ital","Energiaital (cukormentes)","Energy drink (sugar-free)",4,0.4,0.4,0,0,0,1,14061,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[483,"ital","Izotóniás ital","Isotonic drink",26,0,6.4,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[484,"ital","Sör (világos)","Beer (lager)",44,0.5,3.6,0,0,3.9,1,14003,[["1 korsó (0,5 l)","1 pint (500 ml)",500],["1 pohár (0,3 l)","1 glass (300 ml)",300]]],[485,"ital","Sör (alkoholmentes)","Beer (alcohol-free)",37,0.2,8.1,0.1,0,0.4,1,14305,[["1 üveg (0,5 l)","1 bottle (500 ml)",500]]],[486,"ital","Bor (fehér)","Wine (white)",77,0.1,2.6,0,0,9.5,1,14106,[["1 pohár (1,5 dl)","1 glass (150 ml)",150]]],[487,"ital","Bor (vörös)","Wine (red)",83,0.1,2.6,0,0,10.3,1,14096,[["1 pohár (1,5 dl)","1 glass (150 ml)",150]]],[488,"ital","Pezsgő / habzóbor","Sparkling wine",72,0.2,2,0,0,9.1,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[489,"ital","Pálinka (40%)","Pálinka (fruit brandy, 40%)",221,0,0,0,0,31.6,1,14037,[["1 kupica (4 cl)","1 shot (40 ml)",40]]],[490,"ital","Fröccs (bor + szóda 1:1)","Spritzer (wine + soda 1:1)",38,0,1.3,0,0,4.7,1,0,[["1 nagyfröccs (3 dl)","1 large spritzer (300 ml)",300]]],[491,"ital","Likőr","Liqueur",362,0.1,55.1,0.4,0,19.7,1,14414,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[492,"ital","Szójaital","Soy drink",54,3.4,5.8,1.8,0.6,0,1,16120,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[493,"ital","Mandulaital","Almond drink",16,0.7,0.6,1.2,0,0,1,14091,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[494,"ital","Zabital","Oat drink",45,0.8,6.5,1.5,0.8,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[495,"ital","Rizsital","Rice drink",47,0.3,9.0,1,0.3,0,1,14639,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[496,"ital","Kókuszital","Coconut drink",32,0.2,3,2.1,0,0,1,14171,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[497,"ital","Kakaó (tejjel, elkészítve)","Hot chocolate (with milk)",80,3.5,10.5,3,0.8,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[498,"sport","Tejsavófehérje-por (koncentrátum)","Whey protein (concentrate)",390,75,8,6,0,0,0,0,[["1 adagolókanál","1 scoop",30]]],[499,"sport","Tejsavófehérje-izolátum","Whey protein isolate",370,88,2,1,0,0,0,0,[["1 adagolókanál","1 scoop",30]]],[500,"sport","Kazeinpor","Casein powder",360,80,5,1.5,0,0,0,0,[["1 adagolókanál","1 scoop",30]]],[501,"sport","Növényi fehérjepor","Plant protein powder",380,75,6,7,4,0,0,0,[["1 adagolókanál","1 scoop",30]]],[502,"sport","Tömegnövelő (gainer) por","Mass gainer powder",380,20,70,3,1,0,0,0,[["1 adag","1 serving",100]]],[503,"sport","Kreatin","Creatine",0,0,0,0,0,0,0,0,[["1 adag","1 serving",5]]],[504,"sport","Fehérjepuding","Protein pudding",80,10,6,1.5,0,0,0,0,[]],[505,"sport","Fehérjeital (kész)","Protein shake (ready)",60,8,4,1.2,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[506,"kesz","Pizza (sonkás, fagyasztott)","Pizza (ham, frozen)",271,11.3,22.9,14.4,2.2,0,0,21226,[]],[507,"kesz","Pizza (margherita)","Pizza (margherita)",264,10.4,26.8,12.3,2.2,0,0,21224,[]],[508,"kesz","Hamburger (gyorsétterem)","Hamburger (fast food)",297,16.5,29.8,12,1.7,0,0,21107,[["1 db","1 burger",110]]],[509,"kesz","Sajtburger (gyorsétterem)","Cheeseburger (fast food)",306,16.5,26,14.7,2,0,0,21089,[["1 db","1 burger",120]]],[510,"kesz","Hot dog","Hot dog",246,10.6,16.9,14.8,1.5,0,0,21118,[]],[511,"kesz","Gyros pitában","Gyros in pitta",215,11,20,10,1.5,0,0,0,[]],[512,"kesz","Kebab (döner)","Doner kebab",215,11,20,10,1.5,0,0,0,[]],[513,"kesz","Csirkefalatok (rántott)","Chicken nuggets",268,19.2,16.0,13.9,1.2,0,0,21401,[]],[514,"kesz","Rántott csirkemell","Breaded chicken breast",253,24.8,8.7,13.2,0.3,0,0,5058,[]],[515,"kesz","Rántott sertésszelet","Breaded pork schnitzel",270,18,13,16,0.7,0,0,0,[]],[516,"kesz","Fasírt","Meatballs (fasírt)",250,15,10,16,0.7,0,0,0,[]],[517,"kesz","Sushi (maki)","Sushi (maki)",145,4,29,1,1,0,0,0,[]],[518,"kesz","Lasagne","Lasagne",126,6.5,12.1,5.3,1.7,0,0,22910,[]],[519,"kesz","Spagetti bolognai","Spaghetti bolognese",150,7,19,5,1.5,0,0,0,[]],[520,"kesz","Rakott krumpli","Layered potato bake",170,7,12,10,1,0,0,0,[]],[521,"kesz","Töltött káposzta","Stuffed cabbage",120,6,6,8,1.5,0,0,0,[]],[522,"kesz","Töltött paprika","Stuffed peppers",110,6,9,5.5,1.2,0,0,0,[]],[523,"kesz","Pörkölt (sertés)","Pork stew (pörkölt)",170,15,3,11,0.5,0,0,0,[]],[524,"kesz","Csirkepaprikás","Chicken paprikash",140,13,3,8,0.5,0,0,0,[]],[525,"kesz","Gulyásleves","Goulash soup",75,5.5,6,3.5,1,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[526,"kesz","Babgulyás","Bean goulash",95,6,8,4,3,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[527,"kesz","Húsleves (tésztával)","Chicken soup (with noodles)",45,3,4.5,1.5,0.3,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[528,"kesz","Krémleves (zöldség)","Cream of vegetable soup",55,1.5,6,3,1,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[529,"kesz","Lencsefőzelék","Lentil stew (főzelék)",110,6,14,3,4,0,0,0,[]],[530,"kesz","Tökfőzelék","Marrow stew (főzelék)",70,1.5,6.5,4,1,0,0,0,[]],[531,"kesz","Borsófőzelék","Pea stew (főzelék)",95,4.5,12,3,4,0,0,0,[]],[532,"kesz","Krumplifőzelék","Potato stew (főzelék)",90,1.8,13,3.5,1.3,0,0,0,[]],[533,"kesz","Spenótfőzelék","Spinach stew (főzelék)",75,3,6,4.5,2,0,0,0,[]],[534,"kesz","Rántott sajt","Breaded fried cheese",330,15,17,23,1,0,0,0,[]],[535,"kesz","Rántott gomba","Breaded mushrooms",200,5,17,12,2,0,0,0,[]],[536,"kesz","Sült kolbász","Fried sausage",330,15,2,29,0,0,0,0,[]],[537,"kesz","Melegszendvics","Toasted sandwich",260,12,27,11,2,0,0,0,[]],[538,"kesz","Szendvics (sonkás-sajtos)","Ham and cheese sandwich",240,13,25,9.5,1.8,0,0,0,[["1 db","1 sandwich",150]]],[539,"kesz","Wrap (csirkés)","Chicken wrap",200,12,20,8,2,0,0,0,[]],[540,"kesz","Saláta, görög","Greek salad",110,3.5,4.5,9,1.5,0,0,0,[]],[541,"kesz","Cézár saláta (csirkével)","Caesar salad (with chicken)",130,10,5,8,1.2,0,0,0,[]],[542,"kesz","Tejbegríz","Semolina pudding",110,4,17,3,0.3,0,0,0,[]],[543,"kesz","Zabkása (tejjel)","Porridge (with milk)",105,4.5,15,3,1.5,0,0,0,[]],[544,"kesz","Zabkása (vízzel)","Porridge (with water)",68,2.5,10.3,1.5,1.7,0,0,8121,[["1 evőkanál","1 tbsp",15]]],[545,"kesz","Túrós csusza","Pasta with quark and bacon",230,10,24,10,1,0,0,0,[]],[546,"kesz","Sajtos tészta","Pasta with cheese",250,10,30,9,1.5,0,0,0,[]],[547,"kesz","Rántotta szalonnával","Scrambled eggs with bacon",230,13,1,19,0,0,0,0,[]],[548,"tej","Tejszínhab (spray)","Whipped cream (spray)",263,3.2,12.5,22.2,0,0,0,1054,[["1 evőkanál","1 tbsp",3]]],[549,"tej","Kecsketej","Goat milk",72,3.7,4.6,4.3,0,0,1,1106,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[550,"tej","Kecskesajt (friss)","Goat cheese (soft)",264,18.5,0,21.1,0,0,0,1159,[]],[551,"tej","Vaníliás joghurt","Vanilla yoghurt",86,4.9,13.8,1.2,0,0,0,1119,[]],[552,"tej","Ivójoghurt (gyümölcsös)","Drinking yoghurt (fruit)",75,3,12,1.5,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[553,"tej","Sajtkrém (kenhető)","Cheese spread",240,10,6,20,0,0,0,0,[]],[554,"tej","Túrókrém (ízesített)","Flavoured quark dessert",150,7,15,7,0,0,0,0,[]],[555,"tej","Tejpor (teljes)","Whole milk powder",499,26.3,38.4,26.7,0,0,0,1090,[]],[556,"tej","Sűrített tej (cukrozott)","Sweetened condensed milk",328,7.9,54.4,8.7,0,0,0,1095,[]],[557,"hus","Marhalapocka, nyers","Beef chuck (shoulder), raw",140,21.1,0.3,6.1,0,0,0,13293,[]],[558,"hus","Vegyes darált hús (sertés-marha)","Mixed minced meat (pork-beef)",240,17,0,19,0,0,0,0,[]],[559,"hus","Csirkemell, főtt","Chicken breast, boiled",143,29,0,3,0,0,0,5065,[]],[560,"hus","Csirkecomb, bőr nélkül, sült","Chicken thigh, skinless, roasted",173,24.8,0,8.2,0,0,0,5098,[]],[561,"hus","Sertéskaraj, rántva","Pork loin, breaded",270,18,13,16,0.7,0,0,0,[]],[562,"hus","Sertéstarja, sült","Pork neck, roasted",260,25.1,0,17.7,0,0,0,10081,[]],[563,"hus","Pulykamell, grillezett","Turkey breast, grilled",136,29.5,0,2,0,0,0,5711,[]],[564,"hus","Marha darált hús, sütve","Ground beef, fried",248,27.7,0,15.3,0,0,0,23570,[]],[565,"hus","Húsgombóc (fagyasztott)","Meatballs (frozen)",285,14.4,5.8,22.2,2.3,0,0,7972,[]],[566,"hal","Hekk","Hake",85,18.3,0,1.3,0,0,0,15132,[]],[567,"hal","Lazackonzerv","Canned salmon",137,23.1,0,5,0,0,0,15260,[]],[568,"hal","Halászlé","Fisherman's soup (halászlé)",70,7,2.5,3.5,0.5,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[569,"hal","Rántott hal","Fried breaded fish",230,14,13,13,0.7,0,0,0,[]],[570,"hal","Tonhalsaláta (majonézes)","Tuna salad (with mayo)",190,13,5,13,0.3,0,0,0,[]],[571,"zold","Mángold","Swiss chard",21,1.8,2.1,0.2,1.6,0,0,11147,[["1 levél","1 leaf",48]]],[572,"zold","Csicsóka","Jerusalem artichoke",74,2,15.8,0,1.6,0,0,11226,[]],[573,"zold","Fehérrépa","Turnip",26,0.9,4.6,0.1,1.8,0,0,11564,[["1 nagy db","1 large",183]]],[574,"zold","Paszternák","Parsnip",70,1.2,13.1,0.3,4.9,0,0,11298,[]],[575,"zold","Tök (főzőtök)","Pumpkin",30,1,6.0,0.1,0.5,0,0,11422,[]],[576,"zold","Articsóka","Artichoke",45,3.3,5.1,0.1,5.4,0,0,11007,[]],[577,"zold","Pak choi (bok choy)","Pak choi",15,1.5,1.2,0.2,1,0,0,11116,[]],[578,"zold","Babcsíra (mungó)","Bean sprouts (mung)",34,3,4.1,0.2,1.8,0,0,11043,[]],[579,"zold","Jalapeño","Jalapeño",28,0.9,3.7,0.4,2.8,0,0,11979,[]],[580,"zold","Padlizsánkrém","Aubergine dip",110,1.5,6,9,2.5,0,0,0,[]],[581,"zold","Zöldborsó, főtt","Green peas, cooked",72,5.2,9.8,0.3,4.5,0,0,11313,[]],[582,"zold","Hagyma, fagyasztott (kockázott)","Onion, frozen (diced)",28,0.8,5.0,0.1,1.8,0,0,11287,[]],[583,"zold","Sóska","Sorrel",22,2,0.3,0.7,2.9,0,0,0,[]],[584,"zold","Csírák (lucerna)","Alfalfa sprouts",27,4,0.2,0.7,1.9,0,0,11001,[["1 evőkanál","1 tbsp",3]]],[585,"gyum","Vörösáfonya (friss)","Cranberries (fresh)",44,0.5,8.4,0.1,3.6,0,0,9078,[]],[586,"gyum","Ringló","Greengage plum",48,0.7,10.0,0.3,1.4,0,0,9279,[["1 db","1 item",66]]],[587,"gyum","Kókusz (friss)","Coconut (fresh)",358,3.3,6.2,33.5,9,0,0,12104,[["1 közepes db","1 medium",397]]],[588,"gyum","Citromlé","Lemon juice",23,0.4,6.8,0.2,0.3,0,1,9152,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[589,"gyum","Áfonya, fagyasztott","Blueberries, frozen",50,0.4,9.5,0.6,2.7,0,0,9054,[]],[590,"gyum","Eper, fagyasztott","Strawberries, frozen",35,0.4,7.0,0.1,2.1,0,0,9318,[]],[591,"gyum","Málna, fagyasztott","Raspberries, frozen",46,1.2,5.4,0.7,6.5,0,0,9302,[]],[592,"gyum","Meggy, fagyasztott","Sour cherries, frozen",48,0.9,9.4,0.4,1.6,0,0,9068,[]],[593,"gyum","Gyümölcssaláta (konzerv)","Fruit cocktail (canned)",48,0.5,10.9,0,1,0,0,9097,[]],[594,"gab","Puffasztott rizs (gabonapehely)","Puffed rice cereal",385,6.3,88.1,0.5,1.7,0,0,8156,[]],[595,"gab","Ropogós rozskenyér (pl. Wasa)","Rye crispbread (e.g. Wasa)",322,9.6,57.5,0.9,22.9,0,0,18226,[["1 szelet","1 slice",11]]],[596,"gab","Kukorica tortilla","Corn tortilla",215,5.7,38.3,2.9,6.3,0,0,18363,[]],[597,"gab","Bagett / francia kenyér","Baguette",268,10.8,49.7,2.4,2.2,0,0,18029,[["1 szelet","1 slice",139]]],[598,"gab","Kalács / fonott kalács","Sweet braided bread (kalács)",279,9.5,45.5,6,2.3,0,0,18027,[["1 szelet","1 slice",40]]],[599,"gab","Kovászos kenyér","Sourdough bread",268,10.8,49.7,2.4,2.2,0,0,18029,[["1 szelet","1 slice",40]]],[600,"gab","Ciabatta","Ciabatta",260,9,48,3.5,2.5,0,0,0,[]],[601,"gab","Naan","Naan",300,9,50,7,2,0,0,0,[]],[602,"gab","Hot dog kifli / buci","Hot dog bun",271,9.8,48.3,3.9,1.8,0,0,18350,[["1 db","1 item",44]]],[603,"gab","Briós","Brioche",360,8,50,14,2,0,0,0,[]],[604,"gab","Zabpehely, instant","Instant oats",368,11.9,59.5,6.9,10,0,0,8122,[]],[605,"gab","Puffasztott kenyér (pl. Abonett)","Puffed crispbread (e.g. Abonett)",380,10,75,3,8,0,0,0,[]],[606,"edes","Kürtőskalács","Chimney cake (kürtőskalács)",390,7,70,9,2,0,0,0,[]],[607,"edes","Mézeskalács","Gingerbread",400,5,75,9,2,0,0,0,[]],[608,"edes","Csokoládés kekszszelet (pl. Twix)","Chocolate biscuit bar (e.g. Twix)",501,4.9,63.7,24.9,1.1,0,0,19160,[]],[609,"edes","Kókuszos csokiszelet (pl. Bounty)","Coconut chocolate bar (e.g. Bounty)",485,4.6,54.9,26.6,3.7,0,0,19142,[["1 db","1 item",19]]],[610,"edes","Karamellás csokiszelet (pl. Mars)","Caramel chocolate bar (e.g. Mars)",450,4,70,17,1,0,0,0,[]],[611,"edes","Csokis ostyaszelet (pl. Balaton)","Chocolate wafer bar (e.g. Balaton)",530,6,60,29,2,0,0,0,[]],[612,"edes","Rumos csokiszelet (pl. Sport szelet)","Rum-flavoured chocolate bar (e.g. Sport)",470,4,62,23,2,0,0,0,[]],[613,"edes","Háztartási keksz","Household biscuits",430,8,75,10,2,0,0,0,[]],[614,"edes","Krémes (pudingos sütemény)","Custard slice (krémes)",250,5,30,12,0.5,0,0,0,[]],[615,"edes","Rétes (túrós/mákos)","Strudel (quark/poppy)",290,7,38,12,1.5,0,0,0,[]],[616,"edes","Csokoládéfagylalt","Chocolate ice cream",225,3.8,27.0,11,1.2,0,0,19270,[]],[617,"edes","Jégkrém, csokibevonatos (pálcikás)","Chocolate-coated ice cream bar",300,4,28,19,1,0,0,0,[]],[618,"edes","Zselé (desszert)","Jelly (dessert)",62,1.2,14.2,0,0,0,0,19173,[]],[619,"edes","Kandírozott gyümölcs","Candied fruit",320,0.3,81,0.1,1.5,0,0,0,[]],[620,"edes","Cukrozott gesztenyekrém","Sweetened chestnut cream",270,1.5,63,1.5,3,0,0,0,[]],[621,"ital","Tonik","Tonic water",36,0,9.1,0,0,0,1,14155,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[622,"ital","Szóda","Soda water",0,0,0,0,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[623,"ital","Limonádé","Lemonade",44,0.1,10.9,0,0,0,1,14293,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[624,"ital","Jegeskávé (dobozos)","Iced coffee (ready-to-drink)",65,2.5,10,1.5,0,0,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[625,"ital","Kombucha","Kombucha",17,0,3.5,0,0,0.4,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[626,"ital","Prosecco","Prosecco",67,0.1,1.5,0,0,8.7,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[627,"ital","Vodka (37,5%)","Vodka (37.5%)",207,0,0,0,0,29.6,1,14051,[["1 kupica (4 cl)","1 shot (40 ml)",40]]],[628,"ital","Whisky (40%)","Whisky (40%)",222,0,0.1,0,0,31.6,1,14052,[["1 adag (4 cl)","1 shot (40 ml)",40]]],[629,"ital","Koktél (pl. mojito)","Cocktail (e.g. mojito)",115,0,15,0,0,7.9,1,0,[["1 pohár (2,5 dl)","1 glass (250 ml)",250],["1 bögre (3 dl)","1 mug (300 ml)",300]]],[630,"kesz","Instant tészta (száraz)","Instant noodles (dry)",435,10.2,57.4,17.6,2.9,0,0,6583,[]],[631,"kesz","Tavaszi tekercs","Spring roll",218,9.9,27.4,7.2,2.1,0,0,22953,[["1 db","1 item",85]]],[632,"kesz","Kínai pirított tészta (zöldséges)","Chow mein (noodles with vegetables)",84,6.8,7.3,2.8,1,0,0,36623,[]],[633,"kesz","Chili con carne","Chili con carne",100,5.8,9.8,3.5,3.3,0,0,22904,[]],[634,"kesz","Paradicsomleves","Tomato soup",50,1.2,8.5,1.3,0.8,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[635,"kesz","Jókai bableves","Jókai bean soup",85,5,7,4,2.5,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[636,"kesz","Gombaleves","Mushroom soup",50,1.5,4.5,3,0.6,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[637,"kesz","Zöldborsóleves","Green pea soup",55,2.5,5.2,2,1.8,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[638,"kesz","Gyümölcsleves (hideg)","Cold fruit soup",70,1.5,13,1.5,0.8,0,1,0,[["1 tányér (3 dl)","1 bowl (300 ml)",300]]],[639,"kesz","Csirkés curry","Chicken curry",140,11,6,8,1.2,0,0,0,[]],[640,"kesz","Rizibizi","Rice with peas",140,3,26,2.5,1.5,0,0,0,[]],[641,"kesz","Párolt rizs (zöldséges)","Vegetable rice",130,2.8,24,2.5,1.2,0,0,0,[]],[642,"kesz","Hortobágyi palacsinta","Meat-filled pancakes",180,10,14,9,0.8,0,0,0,[]],[643,"kesz","Túrós palacsinta","Quark pancake",200,9,25,7,0.6,0,0,0,[]],[644,"kesz","Lekváros palacsinta","Jam pancake",220,5,38,5,1,0,0,0,[]],[645,"kesz","Sült csirkecomb burgonyával","Roast chicken leg with potatoes",170,12,10,9,1,0,0,0,[]],[646,"kesz","Bécsi szelet köret nélkül","Wiener schnitzel (no side)",260,19,12,15,0.6,0,0,0,[]],[647,"kesz","Paprikás krumpli","Paprika potatoes",110,3.5,12,5.5,1.3,0,0,0,[]],[648,"kesz","Sólet","Hungarian cholent (sólet)",160,9,15,7,4,0,0,0,[]],[649,"kesz","Lecsó kolbásszal","Lecsó with sausage",120,4,6,9,1.5,0,0,0,[]],[650,"kesz","Pizza szelet (pékségi)","Pizza slice (bakery)",260,10,30,11,2,0,0,0,[]],[651,"kesz","Virslis kifli (pékségi hot dog)","Hot dog roll (bakery)",300,10,30,16,1.5,0,0,0,[]],[652,"kesz","Sonkás-sajtos csiga","Ham and cheese pastry swirl",330,11,32,17,1.5,0,0,0,[]],[653,"kesz","Pogácsa, burgonyás","Potato scone (pogácsa)",380,8,42,20,1.8,0,0,0,[]]];
const DBF=FOODDB.map(r=>({id:'d'+r[0],hu:r[2],en:r[3],kcal:r[4],p:r[5],c:r[6],f:r[7],fib:r[8],alc:r[9]||0,unit:r[10]?'ml':'g',usda:r[11]||0,portions:r[12]||[]}));
const DB_BY=new Map(DBF.map(x=>[x.id,x]));
const NUT=['kcal','p','c','f','fib','alc'];
const foodName=x=>x.own||x.off||x.blank?x.name:(LANG==='en'?x.en:x.hu);
const foodById=id=>id?(DB_BY.get(id)||(S.foods||[]).find(x=>x.id===id)||null):null;
const ownFoods=()=>(S.foods||[]).map(x=>Object.assign({own:true},x));
const euKcal=v=>Math.round(4*(v.p||0)+4*(v.c||0)+9*(v.f||0)+2*(v.fib||0)+7*(v.alc||0));
function foodSrc(x){if(!x)return'';if(x.off)return L('Open Food Facts (ODbL), közösségi adat – ellenőrizd a címkével','Open Food Facts (ODbL), community data – check against the label');if(x.blank)return L('saját rögzítés a címke alapján','own entry from the label');if(x.own)return x.src==='off'?L('saját rögzítés (Open Food Facts alapján)','own entry (based on Open Food Facts)'):L('saját rögzítés','own entry');return x.usda?L('USDA (európai kalóriaszámítási módszerrel)','USDA (European calorie calculation method)'):L('becslés (magyar termékátlag)','estimate (Hungarian product average)')}
function foodSearch(q,n=12){const toks=deacc(q).split(/[\s,]+/).filter(Boolean);if(!toks.length)return[];
  const res=[];for(const x of[...ownFoods(),...DBF]){const nm=deacc(foodName(x)),hay=x.own?nm:deacc(x.hu+' '+x.en);
    if(!toks.every(t=>hay.includes(t)))continue;const words=nm.split(/[\s,()/]+/);
    const sc=(x.own?0:10)+(nm.startsWith(toks[0])?0:words.some(w=>w.startsWith(toks[0]))?2:5)+toks.filter(t=>!nm.includes(t)).length*3+nm.length/100;res.push([sc,x])}
  return res.sort((a,b)=>a[0]-b[0]).slice(0,n).map(r=>r[1])}

/* ===== Kézi felvétel: két fül – Keresés (adattár, saját tételek, vonalkód) és Új tétel (szabad kitöltés) =====
   Új tételnél a modal mentés után nyitva marad a következő tételhez; szerkesztésnél bezárul. */
let mf=null,mfRes=[];
const dv=v=>v===''||v==null?'':typeof v==='number'?hu(v,1):String(v); // iPhone: a begépelt szöveg (pl. „7,5”) változatlanul marad
function mfNew(m){const x={id:m?.id||null,meal:m?.meal||(foodDate===today()?guessMeal():'ebed'),tab:'search',q:'',food:null,mult:'1',name:m?.name||'',qty:'',u:'g',per:null,base:null,msg:'',added:[],
    tot:{kcal:m?.kcal??'',p:m?.p??'',c:m?.c??'',f:m?.f??'',fib:m?.fib??'',alc:m?.alc??0},date:m?.date||foodDate};
  const fd=m&&foodById(m.fid);if(fd&&m.qty){mfPick(x,fd);x.u=m.u||x.u;x.qty=String(m.qty);x.name=m.fname||x.name}else if(m)x.tab='new';return x}
function mfPick(x,fd){x.tab='search';x.food=fd;x.name=foodName(fd);x.u=fd.unit;x.qty=x.qty||(fd.portions?.length?'':'100');if(fd.portions?.length&&!x.qty){x.u='p0';x.qty='1'}
  x.per={};for(const k of NUT)x.per[k]=fd[k]??0;x.base=Object.assign({},x.per)}
function openFoodEntry(m){closeScanner();mf=mfNew(m);renderMF();mfFocus()}
function mfFocus(){setTimeout(()=>{const i=mf.tab==='new'?(mf.id?null:$('#mfname')):(!mf.food?$('#mfq'):null);i&&i.focus()},60)}
function mfGrams(){const x=mf;if(!x.food)return null;const q=parseMacro(x.qty);if(q==null)return null;
  if(x.u==='g'||x.u==='ml')return q;const p=x.food.portions?.[+x.u.slice(1)];return p?q*p[2]:null}
function mfTotals(){if(!mf.food||mf.tab==='new'){const m=parseMacro(mf.mult)??1,t={};for(const k of NUT){const v=parseMacro(mf.tot[k]);t[k]=v==null?0:(k==='kcal'?Math.round(v*m):Math.round(v*m*10)/10)}return t}
  const g=mfGrams(),t={};for(const k of NUT){const v=parseMacro(mf.per[k]);t[k]=g==null||v==null?0:v*g/100}t.kcal=Math.round(t.kcal);for(const k of['p','c','f','fib','alc'])t[k]=Math.round(t[k]*10)/10;return t}
const mfEdited=()=>!!mf.food&&NUT.some(k=>{const a=parseMacro(mf.per[k]),b=mf.base[k]??0;return(a??0)!==b});
function mfUnitOpts(){const fd=mf.food,u=fd.unit;if(fd.blank)return[['g','g'],['ml','ml']];return[[u,u],...(fd.portions||[]).map((p,i)=>['p'+i,LANG==='en'?p[1]:p[0]])]}
function mfQtyLbl(){const x=mf,q=parseMacro(x.qty);if(q==null)return'';if(x.u==='g'||x.u==='ml')return`${hu(q,1)} ${x.u}`;const p=x.food.portions[+x.u.slice(1)],pl=LANG==='en'?p[1]:p[0];return q===1?pl:`${hu(q,2)} × ${pl}`}
const MF_L5=()=>[['kcal',L('Energia (kcal)','Energy (kcal)')],['p',L('Fehérje (g)','Protein (g)')],['c',L('Szénhidrát (g)','Carbs (g)')],['f',L('Zsír (g)','Fat (g)')],['fib',L('Rost (g)','Fibre (g)')]];
function renderMF(){const x=mf,fd=x.food,isS=x.tab==='search';
  const nf=(k,l,val,per)=>`<div><label for="mf_${k}">${l}</label><input id="mf_${k}" type="text" inputmode="decimal" class="mono" autocomplete="off" value="${esc(dv(val))}" ${per?`data-input="mfPer('${k}',this.value)"`:`data-input="mfTot('${k}',this.value)"`}></div>`;
  const tabs=`<div class="seg mftabs" role="tablist"><button role="tab" aria-selected="${isS}" class="${isS?'on':''}" data-click="mfTab('search')">${I('search','sm')} ${L('Keresés','Search')}</button><button role="tab" aria-selected="${!isS}" class="${!isS?'on':''}" data-click="mfTab('new')">${I('plus','sm')} ${L('Új tétel','New item')}</button></div>`;
  let body='';
  if(isS&&!fd){body=`<div class="row" style="flex-wrap:nowrap;gap:8px"><input id="mfq" type="search" style="flex:1;min-width:0" autocomplete="off" enterkeyhint="search" aria-label="${L('Keresés','Search')}" placeholder="${L('pl. túró, csirkemell, passata','e.g. quark, chicken breast, passata')}" value="${esc(x.q)}" data-input="mfSearch(this.value)">${canScan()?`<button class="btn ico" data-click="openScanner()" aria-label="${L('Vonalkód beolvasása','Scan barcode')}" title="${L('Vonalkód','Barcode')}">${I('scan-barcode','sm')}</button>`:''}</div>
    <div id="mfres"></div>${x.q?'':`<div class="hint">${L('Keress az élelmiszerek és a saját tételeid között, vagy olvasd be a csomagolás vonalkódját. Ha nincs a listában, válts az <b>Új tétel</b> fülre.','Search the food list and your own items, or scan a package’s barcode. If it’s not listed, switch to the <b>New item</b> tab.')}</div>`}`}
  else if(isS){const u=fd.unit,showAlc=x.base.alc>0||(parseMacro(x.per.alc)||0)>0;
    body=`${x.msg?`<div class="hint" style="margin:0 0 8px">${esc(x.msg)}</div>`:''}<div class="mfsel"><div class="row" style="flex-wrap:nowrap;gap:8px"><input id="mfname" style="flex:1;min-width:0;font-weight:600" autocomplete="off" aria-label="${L('Megnevezés','Name')}" value="${esc(x.name)}" placeholder="${L('Termék neve','Product name')}" data-input="mfName(this.value)"><button class="btn sm" data-click="mfClear()">${I('search','sm')} ${L('Másik','Other')}</button></div>
    <div class="grid2"><div><label for="mfqty">${L('Mennyiség','Amount')}</label><input id="mfqty" type="text" inputmode="decimal" class="mono" autocomplete="off" value="${esc(x.qty)}" data-input="mfQty(this.value)"></div>
    <div><label for="mfu">${L('Egység','Unit')}</label><select id="mfu" data-change="mfUnit(this.value)">${mfUnitOpts().map(([k,l])=>`<option value="${k}" ${k===x.u?'selected':''}>${esc(l)}</option>`).join('')}</select></div></div>
    <div id="mftot" class="mftot">${mfTotHtml(mfTotals())}</div></div>
    <div class="grp" style="margin-top:14px">${L(`Tápérték 100 ${u}-ben`,`Nutrition per 100 ${u}`)}</div>
    <div class="grid3 mfgrid">${MF_L5().map(([k,l])=>nf(k,l,x.per[k],1)).join('')}${showAlc?nf('alc',L('Alkohol (g)','Alcohol (g)'),x.per.alc,1):''}</div>
    <div class="row" style="margin-top:8px"><button class="btn sm" data-click="mfRecalc()">${L('Kalória újraszámítása','Recalculate calories')}</button></div>
    <div id="mfnote" class="hint">${mfNote()}</div><div class="mfsrc">${L('Forrás: ','Source: ')}${esc(foodSrc(fd))}</div>`}
  else{body=`<label for="mfname">${L('Megnevezés','Name')}</label><input id="mfname" autocomplete="off" value="${esc(x.name)}" placeholder="${L('pl. Zabkása 60 g banánnal','e.g. Porridge 60 g with banana')}" data-input="mfName(this.value)">
    <div class="grid3 mfgrid">${MF_L5().map(([k,l])=>nf(k,l,x.tot[k],0)).join('')}</div>
    <div class="row" style="margin-top:8px"><button class="btn sm" data-click="mfRecalc()">${L('Kalória újraszámítása','Recalculate calories')}</button></div>
    <label for="mfmult">${L('Mennyiség (szorzó)','Amount (multiplier)')}</label><div class="row" style="flex-wrap:nowrap;gap:6px"><input id="mfmult" type="text" inputmode="decimal" class="mono" style="width:76px" autocomplete="off" value="${esc(x.mult)}" data-input="mfMult(this.value)">${[['0,5','½'],['1','1'],['1,5','1½'],['2','2']].map(([v,l])=>`<button class="chip${x.mult===v?' on':''}" data-click="mfMultSet('${v}')">× ${l}</button>`).join('')}</div>
    <div id="mftot" class="mftot">${mfTotHtml(mfTotals())}</div>
    <div class="hint">${L('A mezők egy adag értékei; a szorzóval (pl. fél adag, dupla adag) a mentett mennyiség módosul. A kalória a makrókból is kiszámolható (EU-s módszer).','The fields are values for one portion; the multiplier (e.g. half, double) changes the amount saved. Calories can be calculated from the macros (EU method).')}</div>`}
  const done=x.added.length?`<div class="mfadded">${I('check','sm')} ${L(`Hozzáadva: ${x.added.length} tétel`,`Added: ${x.added.length} item${x.added.length>1?'s':''}`)} <span class="mut">· ${esc(x.added.slice(-2).join(', '))}</span></div>`:'';
  openModal(`<h2>${x.id?L('Tétel szerkesztése','Edit item'):L('Étkezés rögzítése','Log food')}</h2><div class="hint" style="margin-top:-4px">${esc(fmtDate(x.date))}</div>
  <div class="grid2" style="align-items:end"><div><label for="mfmeal">${L('Étkezés','Meal')}</label><select id="mfmeal" data-change="mfMeal(this.value)">${MEALS.map(([k,l])=>`<option value="${k}" ${k===x.meal?'selected':''}>${l}</option>`).join('')}</select></div><div>${x.id?'':tabs}</div></div>
  <div style="margin-top:12px">${body}</div>${done}
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${x.id?L('Mégse','Cancel'):x.added.length?L('Kész','Done'):L('Bezárás','Close')}</button><span class="sp"></span>${isS&&!fd?'':`<button class="btn p" data-click="mfSave()">${x.id?L('Mentés','Save'):`${I('plus','sm')} ${L('Hozzáadás','Add')}`}</button>`}</div>`);
  if(isS&&!fd&&x.q)mfSearch(x.q)}
function mfTotHtml(t){const q=mf.food&&mf.tab==='search'?mfQtyLbl():((parseMacro(mf.mult)??1)!==1?'× '+hu(parseMacro(mf.mult),2):'');return`<b class="mono">${fmt(t.kcal,0)} kcal</b>${q?` <span class="mut small">· ${esc(q)}</span>`:''}<br><span class="small mut mono">${L(`F ${hu(t.p,1)} · Sz ${hu(t.c,1)} · Zs ${hu(t.f,1)} · R ${hu(t.fib,1)} g`,`P ${hu(t.p,1)} · C ${hu(t.c,1)} · F ${hu(t.f,1)} · Fib ${hu(t.fib,1)} g`)}</span>`}
function mfNote(){if(mf.food&&(mf.food.off||mf.food.blank))return L('Mentéskor saját élelmiszerként, a vonalkóddal együtt elmentődik – legközelebb a beolvasás internet nélkül is megtalálja.','On save it’s stored as your own food with its barcode – next time a scan finds it even offline.');if(!mf.food||!mfEdited())return'';const own=mf.food.own;
  return own?L('Módosított értékek: mentéskor a saját tételed is frissül.','Changed values: your own item is updated on save.')
    :L(`Módosított értékek: mentéskor saját tételként is elmentődik${mf.name===foodName(mf.food)?` „${esc(mf.name)} (saját rögzítés)” néven – fent átnevezheted`:` „${esc(mf.name)}” néven`}.`,`Changed values: saved as your own item too${mf.name===foodName(mf.food)?`, as “${esc(mf.name)} (own entry)” – you can rename it above`:`, as “${esc(mf.name)}”`}.`)}
function mfLive(){const t=$('#mftot');if(t)t.innerHTML=mfTotHtml(mfTotals());const n=$('#mfnote');if(n)n.innerHTML=mfNote()}
function mfTab(t){if(mf.tab===t)return;mf.tab=t;mf.msg='';if(t==='new'&&mf.food){mf.name='';mf.food=null}renderMF();mfFocus()}
function mfClear(){mf.food=null;mf.msg='';mf.qty='';mf.name='';renderMF();mfFocus()}
function mfMeal(v){mf.meal=v}
function mfName(v){mf.name=String(v).slice(0,100);mfLive()}
function mfQty(v){mf.qty=v;mfLive()}
function mfUnit(v){if(mf.food.blank){mf.food.unit=v;mf.u=v;renderMF();return}const old=mfGrams();mf.u=v;mf.qty=v===mf.food.unit?(old!=null?String(Math.round(old)):'100'):'1';renderMF()}
function mfPer(k,v){mf.per[k]=v;mfLive()}
function mfTot(k,v){mf.tot[k]=v;mfLive()}
function mfMult(v){mf.mult=v;mfLive()}
function mfMultSet(v){mf.mult=v;renderMF()}
function mfRecalc(){const isF=mf.food&&mf.tab==='search',src=isF?mf.per:mf.tot,v={};for(const k of NUT)v[k]=parseMacro(src[k])||0;if(!isF)v.alc=+mf.tot.alc||0;
  src.kcal=euKcal(v);const i=$('#mf_kcal');if(i)i.value=dv(src.kcal);mfLive();toast(L('Kalória újraszámolva: ','Calories recalculated: ')+src.kcal+' kcal')}
/* Keresés: elgépelésnél vagy túlgépelésnél a közeli találatok, végső esetben az előző találatok maradnak */
function mfSearch(q){mf.q=q;const box=$('#mfres');if(!box)return;const t=q.trim();if(!t){mfRes=[];box.innerHTML='';return}
  let r=foodSearch(t),note='';
  if(!r.length){let s=t;while(s.length>2&&!r.length){s=s.slice(0,-1).trim();r=foodSearch(s)}
    if(r.length)note=L(`Nincs pontos találat – közeli találatok erre: „${esc(s)}”`,`No exact match – close matches for “${esc(s)}”`);
    else if(mfRes.length){r=mfRes;note=L('Nincs találat – az előző találatok:','No match – previous results:')}}
  mfRes=r;
  box.innerHTML=r.length?`${note?`<div class="mut small" style="margin:8px 0 2px">${note}</div>`:''}<div class="exlist" style="max-height:46vh">${r.map((x,i)=>`<button class="exi" data-click="mfChoose(${i})"><span>${esc(foodName(x))}${x.own?` <span class="tag">${L('saját','own')}</span>`:''}</span><span class="mut small mono" style="white-space:nowrap">${fmt(x.kcal,0)} kcal/100 ${x.unit}</span></button>`).join('')}</div>`
    :`<div class="mut small" style="padding:10px 0">${L('Nincs találat.','No match.')} <button class="linkbtn" style="display:inline;width:auto;padding:0" data-click="mfTab('new')">${L('Felvétel új tételként','Add as a new item')}</button></div>`}
function mfChoose(i){const fd=mfRes[i];if(!fd)return;mf.qty='';mf.msg='';mfPick(mf,fd);renderMF();setTimeout(()=>{const q=$('#mfqty');if(q){q.focus();q.select&&q.select()}},60)}
function mfSave(){const x=mf,isF=x.food&&x.tab==='search',t=mfTotals();if(!x.name.trim()){toast(L('Adj meg megnevezést','Enter a name'));return}
  if(isF&&mfGrams()==null){toast(L('Adj meg mennyiséget','Enter an amount'));return}
  let fd=isF?x.food:null,fname=x.name.trim();
  if(fd&&(fd.off||fd.blank)){const per={};for(const k of NUT)per[k]=Math.max(0,Math.min(k==='kcal'?1000:100,parseMacro(x.per[k])||0));
    if(fd.blank&&!per.kcal&&!per.p&&!per.c&&!per.f){toast(L('Add meg a címke tápértékeit','Enter the nutrition values from the label'));return}
    if(!per.kcal)per.kcal=euKcal(per);
    const o=Object.assign({id:'f'+uid(),name:fname.slice(0,80),unit:fd.unit,ean:fd.ean},fd.off?{src:'off'}:{},per);if(fd.portions?.length)o.portions=fd.portions.map(p=>[p[0],p[1],p[2]]);
    S.foods=S.foods||[];S.foods=S.foods.filter(y=>y.ean!==fd.ean);S.foods.push(o);fd=Object.assign({own:true},o)}
  else if(fd&&mfEdited()){const per={};for(const k of NUT)per[k]=Math.max(0,Math.min(k==='kcal'?1000:100,parseMacro(x.per[k])||0));
    if(fd.own){const o=S.foods.find(y=>y.id===fd.id);if(o){Object.assign(o,per);if(fname!==foodName(fd))o.name=fname.slice(0,80)}fd=o?Object.assign({own:true},o):fd}
    else{if(fname===foodName(fd))fname=fname+L(' (saját rögzítés)',' (own entry)');
      const o=Object.assign({id:'f'+uid(),name:fname.slice(0,80),unit:fd.unit,base:fd.id},per);if(fd.portions?.length)o.portions=fd.portions.map(p=>[p[0],p[1],p[2]]);
      S.foods=S.foods||[];S.foods.push(o);fd=Object.assign({own:true},o);toast(L('Saját tételként is mentve','Also saved as your own item'))}}
  const rec={meal:MEALS.some(m=>m[0]===x.meal)?x.meal:'nasi',name:(fd?`${fname} ${mfQtyLbl()}`:fname).slice(0,100),kcal:Math.min(10000,t.kcal),p:Math.min(1000,t.p),c:Math.min(1000,t.c),f:Math.min(1000,t.f),
    fib:fd?t.fib:(String(x.tot.fib??'').trim()===''?null:Math.min(500,t.fib))};
  if(t.alc>0)rec.alc=Math.min(500,t.alc);
  if(fd){rec.fid=fd.id;rec.qty=Math.round((parseMacro(x.qty)||0)*100)/100;rec.u=x.u;rec.fname=fname.slice(0,80)}
  if(x.id){const m=S.meals.find(y=>y.id===x.id);if(m){for(const k of['alc','fid','qty','u','fname'])delete m[k];Object.assign(m,rec)}closeModal();save();render();return}
  S.meals.push(Object.assign({id:uid(),date:x.date},rec));save();render();
  /* a modal nyitva marad a következő tételhez */
  const keep={meal:x.meal,tab:x.tab,q:x.tab==='search'?x.q:'',added:[...x.added,rec.name]};mf=mfNew();Object.assign(mf,keep);renderMF();mfFocus()}

/* ===== Vonalkód: beolvasás külön oldalon (scanner.html, saját CSP), lekérés az Open Food Facts adatbázisából =====
   Csak a vonalkód száma kerül ki (az OFF szerverére), a lekérés csak gombnyomásra és csak internettel indul. */
const canScan=()=>location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
let scanReady=false,scanWD=0;
function openScanner(){if(!canScan()){toast(L('A vonalkód-olvasó csak az olupan.com-on érhető el','The barcode reader is only available on olupan.com'));return}
  closeScanner();scanReady=false;const ov=document.createElement('div');ov.id='scanov';ov.className='scanov';
  const f=document.createElement('iframe');f.src='/scanner.html'+(LANG==='en'?'?lang=en':'');f.setAttribute('allow','camera');f.title=L('Vonalkód-olvasó','Barcode reader');
  const x=document.createElement('button');x.className='scanx';x.type='button';x.textContent='✕ '+L('Bezárás','Close');x.addEventListener('click',closeScanner);
  ov.append(f,x);document.body.appendChild(ov);
  /* ha a beolvasó oldal 6 mp alatt nem jelentkezik (blokkolt keret, hálózati hiba), kézi beírás a főappban */
  scanWD=setTimeout(()=>{if(!scanReady&&$('#scanov'))scanFallback()},6000)}
function scanFallback(){const ov=$('#scanov');if(!ov)return;const fr=ov.querySelector('iframe');if(fr)fr.remove();
  const d=document.createElement('div');d.className='scanfb';
  d.innerHTML=`<b>${L('A kamerás beolvasó nem indult el.','The camera reader didn’t start.')}</b><div class="hint">${L('Írd be a vonalkód alatti számot:','Type the number under the barcode:')}</div><div class="row" style="flex-wrap:nowrap;gap:8px;margin-top:8px"><input id="scanman" inputmode="numeric" maxlength="14" class="mono" style="flex:1;min-width:0" autocomplete="off"><button class="btn p" id="scanmanok" type="button">${L('Keresés','Search')}</button></div>`;
  ov.appendChild(d);const go=()=>{const c=$('#scanman').value.replace(/\D/g,'');if(!/^(\d{8}|\d{12,14})$/.test(c)){toast(L('Ez nem érvényes vonalkód','That isn’t a valid barcode'));return}closeScanner();barcodeFound(c)};
  $('#scanmanok').addEventListener('click',go);$('#scanman').addEventListener('keydown',e=>{if(e.key==='Enter')go()});setTimeout(()=>$('#scanman')?.focus(),50)}
function closeScanner(){clearTimeout(scanWD);const o=$('#scanov');if(o)o.remove()}
addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||e.data.src!=='olupan-scan')return;if(e.data.type==='ready'){scanReady=true;return}closeScanner();if(e.data.type==='qr'&&typeof e.data.text==='string'){if(e.data.text.includes('#i=1.'))shareImportText(e.data.text.slice(0,300000));else toast(L('Ez a QR-kód nem Olupan-megosztás','This QR code isn’t an Olupan share'));return}if(e.data.type==='code'&&/^\d{8,14}$/.test(e.data.code))barcodeFound(e.data.code)});
const offN=v=>{v=+v;return isFinite(v)&&v>=0?Math.round(v*10)/10:null};
async function barcodeFound(code){if(!mf)openFoodEntry();
  const alt=code.length===12?'0'+code:code.length===13&&code[0]==='0'?code.slice(1):null;
  const own=ownFoods().find(x=>x.ean===code||(alt&&x.ean===alt));
  if(own){mf.qty='';mfPick(mf,own);renderMF();toast(L('Megvan a saját tételeid között','Found in your own items'));return}
  if(!navigator.onLine){mfBlank(code,L('Nincs internetkapcsolat, így nem tudtam lekérdezni. Add meg a címkéről a 100 g-ra vagy 100 ml-re vonatkozó értékeket: a terméket a vonalkóddal együtt mentem.','You’re offline, so I couldn’t look it up. Enter the per-100 g or per-100 ml values from the label: I’ll save the product with its barcode.'));return}
  if(!S.settings.offOk){if(!await ask(L('A termék adatait az <b>Open Food Facts</b> nyílt, közösségi adatbázisából kérem le. Ehhez csak a vonalkód száma kerül el a szerverükre (az internetes kapcsolat miatt az IP-címed is látszik nekik); a naplódból semmi. Ez csak most, egyszer jelenik meg.','I’ll look the product up in the <b>Open Food Facts</b> open, community database. Only the barcode number is sent to their server (they also see your IP address, as with any connection) – nothing from your log. This message appears only once.'),{title:L('Vonalkód-lekérdezés','Barcode lookup'),ok:L('Rendben','OK')}))return;S.settings.offOk=true;save()}
  toast(L('Keresés az Open Food Facts adatbázisában…','Searching Open Food Facts…'));
  let p=null;
  for(const c of[code,alt].filter(Boolean)){try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),9000);
      const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${c}.json?fields=product_name,product_name_hu,product_name_en,brands,quantity,product_quantity,product_quantity_unit,serving_size,serving_quantity,nutriments&app_name=Olupan`,{signal:ctl.signal,credentials:'omit',referrerPolicy:'no-referrer'});clearTimeout(t);
      if(r.ok){const j=await r.json();if(j&&j.status===1&&j.product){p=j.product;break}}}catch(e){}}
  const n=p&&p.nutriments||{};
  const kcal=offN(n['energy-kcal_100g'])??(offN(n.energy_100g)!=null?Math.round(n.energy_100g/4.184):null);
  if(!p||(kcal==null&&offN(n.proteins_100g)==null)){mfBlank(code,L('Ez a termék nincs benne az Open Food Facts adatbázisában (vagy nincs megadva a tápértéke). Add meg a címkéről a 100 g-ra vagy 100 ml-re vonatkozó értékeket: a terméket a vonalkóddal együtt mentem, és legközelebb internet nélkül is megtalálom.','This product isn’t in Open Food Facts (or has no nutrition data). Enter the per-100 g or per-100 ml values from the label: I’ll save the product with its barcode and find it next time, even offline.'),p&&(p.product_name_hu||p.product_name||'')||'');return}
  const nm=String((LANG==='en'?p.product_name_en||p.product_name:p.product_name_hu||p.product_name)||p.product_name_en||p.product_name_hu||'').trim(),br=String(p.brands||'').split(',')[0].trim();
  const ml=/\b(ml|cl|dl|l)\b/i.test(String(p.product_quantity_unit||p.quantity||''));
  const fd={off:true,ean:code,unit:ml?'ml':'g',name:((nm||L('Termék','Product'))+(br&&!deacc(nm).includes(deacc(br))?` (${br})`:'')).slice(0,80),
    p:offN(n.proteins_100g)??0,c:offN(n.carbohydrates_100g)??0,f:offN(n.fat_100g)??0,fib:offN(n.fiber_100g)??0,alc:offN(n.alcohol_100g)!=null?Math.round(n.alcohol_100g*0.789*10)/10:0,portions:[]};
  fd.kcal=kcal??euKcal(fd);
  const sq=offN(p.serving_quantity);if(sq&&sq>0&&sq<5000){const ss=String(p.serving_size||'').slice(0,40)||`${sq} ${fd.unit}`;const own=/[a-zá-ű]/i.test(ss.replace(/\b(g|ml|gr|gramm)\b/gi,''));fd.portions.push(own?[ss,ss,sq]:[`1 adag (${ss})`,`1 serving (${ss})`,sq])}
  const pq=offN(p.product_quantity);if(pq&&pq>0&&pq<5000&&pq!==sq)fd.portions.push([`1 csomag (${pq} ${fd.unit})`,`1 pack (${pq} ${fd.unit})`,pq]);
  mf.qty='';mfPick(mf,fd);mf.name=fd.name;renderMF()}
function mfBlank(code,msg,name=''){const fd={blank:true,ean:code,unit:'g',name:String(name).slice(0,80),kcal:null,p:null,c:null,f:null,fib:null,alc:0,portions:[]};
  mf.qty='100';mfPick(mf,fd);mf.qty='100';mf.u='g';for(const k of NUT)mf.per[k]='';mf.per.alc='';mf.msg=msg;renderMF();setTimeout(()=>{const i=$(name?'#mf_kcal':'#mfname');i&&i.focus()},80)}

/* ===== Saját élelmiszerek kezelése (Beállítások → Étkezés); az alapkészlet nem törölhető ===== */
function ownFoodsCard(){const l=(S.foods||[]).slice().sort((a,b)=>a.name.localeCompare(b.name,'hu'));
  return`<div class="card" id="ownfoods"><h2 style="font-size:17px;margin-top:0">${L('Saját élelmiszerek','Own foods')}${l.length?` <span class="mut small">· ${l.length}</span>`:''}</h2>
  ${l.length?l.map(x=>`<div class="row li" style="flex-wrap:nowrap"><span style="flex:1;min-width:0">${esc(x.name)}<br><span class="mut small mono">${x.ean?`${I('scan-barcode','sm')} `:''}${fmt(x.kcal,0)} kcal · ${L(`F ${hu(x.p,1)} · Sz ${hu(x.c,1)} · Zs ${hu(x.f,1)}`,`P ${hu(x.p,1)} · C ${hu(x.c,1)} · F ${hu(x.f,1)}`)} g / 100 ${x.unit}</span></span><button class="btn sm ico" data-click="editOwnFood('${x.id}')" aria-label="${L('Szerkesztés','Edit')}">${I('pencil','sm')}</button><button class="btn sm ico d" data-click="delOwnFood('${x.id}')" aria-label="${L('Törlés','Delete')}">${I('trash-2','sm')}</button></div>`).join('')
  :`<div class="hint">${L('Ha kézi felvételkor módosítod egy élelmiszer tápértékét (pl. a te termékedé light változat), az új értékek saját tételként mentődnek, és itt szerkesztheted vagy törölheted őket. Az alapkészlet tételei nem törölhetők.','If you change a food’s nutrition values when adding an item manually (e.g. your product is a light version), the new values are saved as your own item; you can edit or delete them here. Built-in foods can’t be deleted.')}</div>`}
  <button class="btn sm" style="margin-top:10px" data-click="newOwnFood()">${I('plus','sm')} ${L('Új saját élelmiszer','New own food')}</button></div>`}
function ownFoodFields(x={}){return[{id:'name',label:L('Megnevezés','Name'),value:x.name||''},{id:'ean',label:L('Vonalkód (nem kötelező)','Barcode (optional)'),type:'number',value:x.ean||''},{id:'unit',label:L('Egység','Unit'),type:'select',value:x.unit||'g',options:[['g',L('100 g-ra','per 100 g')],['ml',L('100 ml-re','per 100 ml')]]},
  ...[['kcal',L('Energia (kcal)','Energy (kcal)')],['p',L('Fehérje (g)','Protein (g)')],['c',L('Szénhidrát (g)','Carbs (g)')],['f',L('Zsír (g)','Fat (g)')],['fib',L('Rost (g)','Fibre (g)')],['alc',L('Alkohol (g)','Alcohol (g)')]].map(([k,l])=>({id:k,label:l,type:'number',value:x[k]!=null?hu(x[k],1):'',hint:k==='kcal'?L('Üresen hagyva a makrókból számolom (EU-s módszer).','Leave empty to calculate from the macros (EU method).'):''}))]}
function readOwnFood(r){const o={name:r.name.slice(0,80),unit:r.unit==='ml'?'ml':'g'};const e=String(r.ean||'').replace(/\D/g,'');if(/^\d{8,14}$/.test(e))o.ean=e;for(const k of['p','c','f','fib','alc'])o[k]=Math.max(0,Math.min(100,parseMacro(r[k])||0));const k=parseMacro(r.kcal);o.kcal=k==null?euKcal(o):Math.max(0,Math.min(1000,Math.round(k)));return o}
async function newOwnFood(){const r=await form(L('Új saját élelmiszer','New own food'),ownFoodFields(),{intro:L('Tápérték 100 g-ra vagy 100 ml-re, a termék címkéje alapján.','Nutrition per 100 g or 100 ml, from the product label.')});if(!r)return;if(!r.name){toast(L('Adj meg megnevezést','Enter a name'));return}
  S.foods=S.foods||[];S.foods.push(Object.assign({id:'f'+uid()},readOwnFood(r)));save();render()}
async function editOwnFood(id){const x=(S.foods||[]).find(y=>y.id===id);if(!x)return;const r=await form(L('Saját élelmiszer','Own food'),ownFoodFields(x));if(!r||!r.name)return;const y=readOwnFood(r);if(!y.ean)delete x.ean;Object.assign(x,y);save();render()}
async function delOwnFood(id){const x=(S.foods||[]).find(y=>y.id===id);if(!x)return;if(!await ask(L(`Törlöd: <b>${esc(x.name)}</b>? A már rögzített étkezéseid nem változnak.`,`Delete <b>${esc(x.name)}</b>? Meals you’ve already logged don’t change.`),{title:L('Saját élelmiszer törlése','Delete own food'),ok:L('Törlés','Delete'),danger:true}))return;S.foods=S.foods.filter(y=>y.id!==id);save();render()}

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
  <input id="qq" type="search" autocomplete="off" style="margin-top:10px" placeholder="${L('Keresés a korábbi tételeid között…','Search your earlier items…')}" data-input="qSearch(this.value)"><div id="qlist">${qRows(qFreq)}</div>`:''}
  ${!qGroups.length&&!qFreq.length?'<div class="empty">Még nincs korábbi étkezés.</div>':''}
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">Kész</button></div>`)}
function qRows(l){qList=l;return l.map((m,i)=>`<div class="qrow"><span>${esc(m.name)}<br><span class="small mut mono">F ${fmt(m.p,0)} · Sz ${fmt(m.c,0)} · Zs ${fmt(m.f,0)} g</span></span><span class="mono small">${fmt(m.kcal,0)}</span><button class="btn sm ico" data-click="addFreq(${i})" aria-label="Hozzáadás">${I('plus','sm')}</button></div>`).join('')}
let qList=[];
/* Keresés az összes korábbi (egyedi név+kcal) tétel között, nem csak a 12 leggyakoribb között */
function qSearch(q){const box=$('#qlist');if(!box)return;const toks=deacc(q).split(/\s+/).filter(Boolean);if(!toks.length){box.innerHTML=qRows(qFreq);return}
  const seen=new Map();for(const m of S.meals){const n=deacc(m.name);if(!toks.every(t=>n.includes(t)))continue;const k=n+'|'+m.kcal,c=seen.get(k);if(c){c.n++;if(m.date>c.m.date)c.m=m}else seen.set(k,{n:1,m})}
  const l=[...seen.values()].sort((a,b)=>b.n-a.n||(a.m.date<b.m.date?1:-1)).slice(0,30).map(x=>x.m);
  box.innerHTML=l.length?qRows(l):`<div class="mut small" style="padding:10px 0">${L('Nincs ilyen korábbi tétel.','No such earlier item.')} <button class="linkbtn" style="display:inline;width:auto;padding:0" data-click="qToEntry()">${L('Keresés az élelmiszerek között','Search the food list')}</button></div>`}
function qToEntry(){const q=($('#qq')||{}).value||'';openFoodEntry();const i=$('#mfq');if(i&&q){i.value=q;mfSearch(q)}}
function qMealSet(v){qMeal=v}
function copyGroup(i){const g=qGroups[i];if(!g)return;for(const m of g.items){const x=Object.assign({},m,{id:uid(),date:foodDate});S.meals.push(x)}save();render();toast(L(`${g.items.length} tétel hozzáadva`,`${g.items.length} item(s) added`))}
function addFreq(i){const m=qList[i];if(!m)return;S.meals.push(Object.assign({},m,{id:uid(),date:foodDate,meal:qMeal||m.meal}));save();render();toast(L('Hozzáadva: ','Added: ')+m.name)}

/* ===== Saját párbeszédablakok (alert/confirm/prompt helyett) ===== */
let dlgResolve=null,dlgDefault=null;
function dlg(html,def=null){if(dlgResolve)dlgClose(dlgDefault);return new Promise(res=>{dlgResolve=res;dlgDefault=def;$('#dlgBox').innerHTML=html;$('#dlg').classList.add('on');setTimeout(()=>{const f=$('#dlgBox [autofocus]')||$('#dlgBox .btn.p,#dlgBox .btn.danger');f&&f.focus()},40)})}
function dlgClose(v){$('#dlg').classList.remove('on');const r=dlgResolve;dlgResolve=null;r&&r(v)}
function ask(msg,{title='Megerősítés',ok='Rendben',cancel='Mégse',danger=false}={}){
  return dlg(`<h2>${esc(title)}</h2><p>${msg}</p><div class="row end">${cancel===false?'':`<button class="btn" data-click="dlgClose(false)">${cancel}</button>`}<button class="btn ${danger?'danger':'p'}" data-click="dlgClose(true)">${ok}</button></div>`,false)}
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
const ACT=new Set(["addActiveNote", "addFreq", "addMeal", "addSet", "addTplNote", "addWarm", "adjRest", "applyAdapt", "applySugg", "calMove", "calPick", "chooseEx", "claudeBack", "claudeBox", "claudeGo", "claudePaste", "claudePasteTa", "claudeWaitOff", "clearDemo", "clearPlan", "closeModal", "cookDay", "copyGroup", "copyInstr", "copyMealToday", "copyPlanReq", "delBody", "delEx", "delMeal", "delNote", "delOwnFood", "delTemplate", "delWorkout", "demoData", "discardWorkout", "dismissAdapt", "dlgBackdrop", "dlgClose", "editBodyRow", "editEx", "editMeal", "editOwnFood", "editTemplate", "encAskGo", "encChange", "encForgot", "encGen", "encImportGo", "encPlainGo", "encPwIn", "encSetupGo", "encShow", "exportCsv", "exportData", "fbGo", "finishWorkout", "foodHelp", "foodNav", "foodToday", "formSubmit", "go", "goBack", "goFrom", "goProfile", "hideInstall", "histMore", "importData", "importHealthFile", "importSample", "importStrong", "installApp", "legalAccept", "menuDel", "menuGo", "menuLog", "menuManualNew", "menuOptMeal", "menuOptSet", "menuReqBox", "menuSwap", "menuToShop", "mfChoose", "mfClear", "mfMeal", "mfMult", "mfMultSet", "mfName", "mfPer", "mfQty", "mfRecalc", "mfSave", "mfSearch", "mfTab", "mfTot", "mfUnit", "modalBg", "moveEx", "muDetail", "newExFromList", "newExercise", "newOwnFood", "obSkip", "openBody", "openCal", "openFood", "openHealthFile", "openHist", "openImport", "openKcal", "openNotes", "openPlan", "openPlanReq", "openRecipe", "openScanner", "openShop", "openStrong", "openSub", "openTplCat", "pastePlan", "pasteSteps", "pickForActive", "pickForTpl", "pickPlan", "pillPick", "planEmpty", "planEmptyNow", "planManage", "plateCalc", "plateSet", "plateToggle", "qMealSet", "qSearch", "qToEntry", "quickLog", "recDel", "recDelDown", "recFClear", "recFClearM", "recFav", "recFilt", "recFiltM", "recFilterBox", "recIdeasGo", "recLog", "recNote", "recSearch", "recServAdd", "recServSet", "recSetMeal", "recShare", "recStyleMode", "recToShop", "recVote", "renderPick", "repNote", "repPrint", "repSet", "repeatWorkout", "resetAll", "resetKcal", "restBox", "restGo", "rmActiveNote", "rmEx", "rmSet", "rmSetAt", "saveAsTemplate", "saveBody", "savePlan", "saveTpl", "scanFood", "setAccent", "setBackupEvery", "setBodyDate", "setClaudeUrl", "setDay", "setDefRest", "setExRest", "setFPref", "setFoodDate", "setFoodRng", "setFx", "setLang", "setMuDays", "setProf", "setProfBody", "setRange", "setRestNotify", "setSound", "setStepGoal", "setStrEx", "setStrMetric", "setTheme", "setTplName", "setTplSets", "setTrendRng", "setVal", "setWName", "setWake", "shareCopy", "shareImportGo", "sharePasteBox", "sharePasteGo", "shareSys", "shopAdd", "shopClear", "shopClearDone", "shopDelRec", "shopPanT", "shopToggle", "showStr", "showWorkout", "startPick", "startPlanned", "startWorkout", "stepsHelp", "stopRest", "swapAnyT", "swapClear", "swapGo", "swapMode", "swapSearch", "testSound", "toggleArchive", "toggleFPref", "toggleInfo", "toggleLog", "toggleProfLog", "toggleSS", "toggleSet", "toggleTrend", "toggleWaist", "toggleWu", "tpSet", "tplMove", "tplRemove", "tplShareBox", "tplShareGo", "tplShareTg", "undoRm", "updateTplFrom", "warmCalc", "warmToggle", "whyClaude"]);
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
  o.exercises.forEach(e=>{if(/^KB /.test(e.name)&&KB_RENAME.has(e.name.slice(3)))e.name='Kettlebell '+e.name.slice(3)});o.exercises.forEach(fillMeta);
  o.settings.backupEvery=[0,1,7,14].includes(d.settings?.backupEvery)?d.settings.backupEvery:7;if(d.settings?.demo===true)o.settings.demo=true;for(const k of['obSteps','obClaude','offOk'])if(d.settings?.[k]===true)o.settings[k]=true;if(DATE_RE.test(d.settings?.legalOk))o.settings.legalOk=d.settings.legalOk;if(DATE_RE.test(d.settings?.plainOk))o.settings.plainOk=d.settings.plainOk;if(typeof d.settings?.repNote==='string')o.settings.repNote=str(d.settings.repNote,2000);
  {const w=d.settings?.cWait;if(w&&['meals','ideas','menu','plan'].includes(w.k)&&num(w.at,0,9e15)){o.settings.cWait={k:w.k,at:+w.at};if(DATE_RE.test(w.start))o.settings.cWait.start=w.start;if(w.prep)o.settings.cWait.prep=true}
   const mo=d.settings?.menuOpt;if(mo&&typeof mo==='object')o.settings.menuOpt={days:[3,5,7].includes(mo.days)?mo.days:7,cook:[1,2,3,7].includes(mo.cook)?mo.cook:2,meals:(Array.isArray(mo.meals)?mo.meals:[]).filter(k=>REC_MEAL.some(x=>x[0]===k)),start:['today','tomorrow','week'].includes(mo.start)?mo.start:'today'}}
  {const e=d.settings?.enc,b=v=>typeof v==='string'&&/^[A-Za-z0-9+/=]{8,200}$/.test(v),i=(v,a,z)=>Number.isInteger(v)&&v>=a&&v<=z;
   if(e&&e.v===1&&b(e.salt)&&b(e.civ)&&b(e.cct)&&i(e.m,8192,1048576)&&i(e.t,1,20)&&i(e.p,1,8))o.settings.enc={v:1,salt:e.salt,m:e.m,t:e.t,p:e.p,civ:e.civ,cct:e.cct,since:DATE_RE.test(e.since)?e.since:today(),n:i(e.n,0,10000)?e.n:0}}
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
  {const src=(Array.isArray(d.meals)?d.meals:[]).filter(m=>m&&DATE_RE.test(m.date)&&m.name);o.meals.forEach((x,i)=>{const m=src[i];const a=num(m.alc,0,500);if(a)x.alc=a;if(typeof m.fid==='string'&&/^(d\d{1,5}|f[A-Za-z0-9_-]{1,40})$/.test(m.fid)){const q=num(m.qty,0,100000);if(q!=null){x.fid=m.fid;x.qty=q;x.u=/^(g|ml|p\d{1,2})$/.test(m.u)?m.u:'g';x.fname=str(m.fname||'',80)}}})}
  o.recipes=(Array.isArray(d.recipes)?d.recipes:[]).slice(0,2000).map(recSan).filter(Boolean);
  {const m=d.menu;if(m&&DATE_RE.test(m.start)&&Array.isArray(m.slots)){const ids=new Set(o.recipes.map(r=>r.id)),mids=new Set(o.meals.map(x=>x.id)),days=Math.max(1,Math.min(14,Math.round(num(m.days,1,14)||7)));
    const sl=m.slots.slice(0,120).filter(x=>x&&REC_MEAL.some(y=>y[0]===x.meal)&&num(x.d,1,days)).map(x=>({d:Math.round(x.d),meal:x.meal,rid:typeof x.rid==='string'&&ids.has(x.rid)?x.rid:null,name:str(x.name||'',100),cook:num(x.cook,0,100)||0,log:typeof x.log==='string'&&mids.has(fix(x.log))?fix(x.log):null}));
    const msh=(Array.isArray(m.shop)?m.shop:[]).slice(0,200).filter(x=>x&&x.n).map(x=>({n:str(x.n,80),q:num(x.q,0,100000),u:str(x.u||'',20),cat:SHOP_CAT_KEYS.includes(x.cat)?x.cat:null,pack:str(x.pack||'',40),pantry:x.pantry===true}));
    const mpl=(Array.isArray(m.plan)?m.plan:[]).slice(0,14).filter(x=>x&&Array.isArray(x.steps)).map(x=>({d:Math.round(num(x.d,0,14)??1),recipes:(Array.isArray(x.recipes)?x.recipes:[]).slice(0,8).map(r=>str(r,100)),rids:(Array.isArray(x.rids)?x.rids:[]).slice(0,8).map(r=>typeof r==='string'&&ids.has(r)?r:null),time:num(x.time,0,900),steps:x.steps.slice(0,40).map(t=>str(t,400)),store:(Array.isArray(x.store)?x.store:[]).slice(0,20).map(t=>str(t,300)),...(x.stale===true?{stale:true}:{})}));
    if(sl.length)o.menu={manual:m.manual===true,shopStale:m.shopStale===true,shop:msh,plan:mpl,start:m.start,days,prep:!!m.prep,people:Math.max(1,Math.min(8,Math.round(num(m.people,1,8)||1))),slots:sl,at:num(m.at,0,9e15)||Date.now()}}}
  o.shop=(Array.isArray(d.shop)?d.shop:[]).filter(x=>x&&x.n).slice(0,1000).map(x=>({id:typeof x.id==='string'?str(x.id,40):uid(),n:str(x.n,120),q:num(x.q,0,100000),u:str(x.u||'',20),rid:typeof x.rid==='string'&&/^r[A-Za-z0-9_-]{1,40}$/.test(x.rid)?x.rid:null,rn:str(x.rn||'',140),done:x.done===true,...(SHOP_CAT_KEYS.includes(x.cat)?{cat:x.cat}:{}),...(x.pantry===true?{pantry:true}:{}),...(typeof x.pack==='string'&&x.pack?{pack:str(x.pack,40)}:{})}));
  o.foods=(Array.isArray(d.foods)?d.foods:[]).filter(x=>x&&x.name&&typeof x.id==='string'&&/^f[A-Za-z0-9_-]{1,40}$/.test(x.id)).slice(0,2000).map(x=>{const y={id:x.id,name:str(x.name,80),unit:x.unit==='ml'?'ml':'g',kcal:Math.round(num(x.kcal,0,1000)??0)};for(const k of['p','c','f','fib','alc'])y[k]=num(x[k],0,100)??0;if(typeof x.base==='string'&&/^d\d{1,5}$/.test(x.base))y.base=x.base;if(typeof x.ean==='string'&&/^\d{8,14}$/.test(x.ean))y.ean=x.ean;if(x.src==='off')y.src='off';
    if(Array.isArray(x.portions)){const p=x.portions.filter(q=>Array.isArray(q)&&num(q[2],0.1,5000)).slice(0,6).map(q=>[str(q[0],60),str(q[1],60),+q[2]]);if(p.length)y.portions=p}return y});
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
const BACK_LBL={home:'Ma',food:'Étkezés',workout:'Edzések',body:'Test',stats:'Statisztika',more:'Beállítások',hist:'Edzéstörténet',recipes:'Receptjeim',report:'Összefoglaló',menu:'Heti menü'};
function render(){
  const home=tab==='home';
  if(home){const d=pYmd(homeDay),wd=d.toLocaleDateString(LOC(),{weekday:'long'});
    $('#hl').innerHTML=`<button class="hbtn" data-click="openCal()" aria-label="Naptár megnyitása">${I('calendar-days','sm')}<span>Ma</span></button>`;
    $('#title').innerHTML=`<span class="hd1">${esc(wd.charAt(0).toUpperCase()+wd.slice(1))}</span><span class="hd2">${esc(d.toLocaleDateString(LOC(),{year:'numeric',month:'long',day:'numeric'}))}</span>`;
    $('#hdr').innerHTML=`${(S.shop||[]).some(x=>!x.done)?`<button class="hico" data-click="openShop()" aria-label="${L('Bevásárlólista','Shopping list')}">${I('shopping-basket','sm')}</button>`:''}<button class="hico" data-click="go('stats')" aria-label="Statisztika">${I('chart-no-axes-combined','sm')}</button><button class="hico" data-click="go('more')" aria-label="Beállítások">${I('settings','sm')}</button>`;
  }else{
    const toSet=tab==='more'&&setSub,bl=back?(back.sub?'Beállítások':BACK_LBL[back.tab]||'Vissza'):toSet?'Beállítások':'Ma';
    $('#hl').innerHTML=`<button class="hbtn" data-click="goBack()" aria-label="Vissza">${I('chevron-left','sm')}<span>${bl}</span></button>`;
    $('#title').textContent=toSet?SUBS[setSub][0]:tab==='tpls'?(tplCats().find(c=>c.id===tplCat)?.label||'Sablonok'):{workout:S.active?'Edzés folyamatban':'Edzések és sablonok',food:'Étkezés',body:'Testadatok',stats:'Statisztika',more:'Beállítások',hist:'Edzéstörténet',recipes:'Receptjeim',report:'Összefoglaló',menu:'Heti menü'}[tab];
    $('#hdr').innerHTML=S.active&&tab!=='workout'?`<button class="pill" data-click="go('workout')" aria-label="Edzés folytatása">${I('flame','sm')}<span id="elapsed2"></span></button>`:'';
  }
  document.body.classList.toggle('home',home);
  for(const k in CH)delete CH[k];
  $('main').innerHTML=(['home','food','recipes','menu','workout','tpls'].includes(tab)?claudeBar():'')+({report:vReport,recipes:vRecipes,menu:vMenu,home:vHome,workout:S.active?vActive:vWorkout,food:vFood,body:vBody,stats:vStats,more:vMore,hist:vHist,tpls:vTpls})[tab]();
  attachCharts();tick();updAvol();syncWake();updWakeUI();
}
function goBack(){if(back){const b=back;back=null;tab=b.tab;setSub=b.sub;render();scrollTo(0,b.y||0);return}if(tab==='more'&&setSub){setSub=null;render();scrollTo(0,0)}else go('home')}
document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.closest&&t.closest('#sheet')&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))setTimeout(()=>{try{t.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(_){}},350)});
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
    h+=`<button class="d${k===td?' t':''}${k===homeDay?' sel':''}${k>td?' f':''}" data-click="setDay('${k}')" aria-label="${esc(x.toLocaleDateString(LOC(),{month:'long',day:'numeric',weekday:'long'}))}" aria-current="${k===homeDay?'date':'false'}"><span class="dw">${dn[i]}</span><span class="dn">${x.getDate()}</span></button>`}
  h+=`</div>`;
  if(!isT)h+=`<button class="linkbtn" style="margin:-4px 0 10px" data-click="setDay('${td}')">${I('chevron-left','sm')} Vissza a mai napra</button>`;
  if(isT)h+=installCard()+notices();
  if(S.active&&isT)h+=activeCard();
  h+=kcalCard(M);
  h+=bodyCard(M);
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
  ${!g?`<div class="hint" style="margin-top:10px">Kalóriakeret: Beállítások → Profil és célok.</div>`:''}${todayMenuCard(homeDay,true)}</div>`;
}
function bodyCard(M){const b=M.bMap[homeDay],list=S.body.filter(x=>hasMeas(x)||x.steps!=null).map(x=>x.date);
  const st=b?.steps,goal=S.settings.stepGoal||0;
  const stepC=`<div><div class="midnum">${st!=null?fmt(st,0):'–'}</div><div class="small mut">${goal?`/ ${fmt(goal,0)} `:''}lépés</div></div>`;

  let inner;
  if(hasMeas(b)){const prev=S.body.filter(x=>x.date<homeDay&&x.weight!=null).sort((x,y)=>x.date<y.date?1:-1)[0];
    const dw=b.weight!=null&&prev?b.weight-prev.weight:null;
    const c=(v,u,extra='')=>`<div><div class="midnum">${v==null?'–':hu(v,1)}</div><div class="small mut">${u}${extra}</div></div>`;
    inner=`<div class="grid3h">${c(b.weight,'kg',dw!=null&&Math.abs(dw)>=.05?` · <span style="color:${dw<0?'var(--kj-green)':'var(--kj-gold)'}">${sgn(dw)}</span>`:'')}${c(b.fat,'% testzsír')}${stepC}</div>`}
  else{const lw=lastWeight();inner=`<div class="grid3h"><div style="grid-column:span 2"><div class="midnum" style="color:var(--kj-muted)">${lw?hu(lw,1):'–'}</div><div class="small mut">${lw?L('kg · utolsó mérés','kg · last weigh-in'):L('nincs mérés','no weigh-in')}</div></div>${stepC}</div>`}

  return`<div class="card hcard" data-click="openBody()" role="button" tabindex="0" aria-label="Testadatok megnyitása"><div class="row" style="flex-wrap:nowrap;margin-bottom:16px"><span class="hk" style="flex:1">Test</span>${dayNav(list)}</div>${inner}</div>`}
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
  <div class="row" style="margin:12px 0 4px;gap:14px"><button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="planEmpty()">${I('plus','sm')} ${L('Új edzés összeállítása','Build a new workout')}</button>${isT?`<button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="planEmptyNow()">${L('Üres edzés indítása','Start an empty workout')}</button>`:''}<button class="linkbtn" style="margin:0;padding:0;width:auto" data-click="planManage()">Edzések és sablonok</button></div>
  <div class="row" style="position:sticky;bottom:calc(-20px - env(safe-area-inset-bottom));margin:14px -16px calc(-20px - env(safe-area-inset-bottom));padding:12px 16px calc(14px + env(safe-area-inset-bottom));border-top:1px solid var(--kj-border);background:var(--kj-sheet)">${plans()[homeDay]?`<button class="btn d" data-click="clearPlan()">Terv törlése</button>`:''}<span class="sp"></span><button class="btn" data-click="savePlan()" ${planPick?'':'disabled'}>${isT?'Mai tervnek':'Tervbe'}</button>${isT?`<button class="btn p" data-click="startPick()" ${planPick?'':'disabled'}>Indítás most</button>`:''}</div>`)}
function savePlan(){if(!planPick)return;plans()[homeDay]=planPick;prunePlans();save();closeModal();render()}
function clearPlan(){delete plans()[homeDay];save();closeModal();render()}
function startPick(){if(!planPick)return;plans()[homeDay]=planPick;prunePlans();save();closeModal();startWorkout(planPick)}
function startPlanned(){const id=plans()[homeDay];if(id)startWorkout(id)}
function planEmpty(){editTemplate();tplDraft.name=L('Edzés','Workout')+' – '+fmtDate(homeDay);tplDraft.planDay=homeDay;renderTpl()}
function planEmptyNow(){closeModal();startWorkout()}
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
  if(!miss.length&&!S.settings.legalOk)rows.push([L('Kérlek, olvasd el és fogadd el a jogi nyilatkozatot és az adatkezelési tájékoztatót.','Please read and accept the disclaimer and the privacy notice.'),`<button class="btn sm" data-click="goProfile()">${L('Megnyitás','Open')}</button>`]);
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
  +sec(X('Étkezés becslése Claude-dal','Food estimates with Claude'),`<p>${X('A fotó vagy leírás alapján becsült tápértékek akár 20–30%-kal is eltérhetnek a valóságtól. A Receptjeim közül rögzített ételek értékei egyenletesebbek, mert mindig ugyanabból a receptből számolnak; a csomagoláson szereplő tápérték megadásával a becslés is pontosabb lesz.','Nutrition estimated from a photo or description can be 20–30% off. Values logged from My recipes are more consistent because they always come from the same recipe; giving the nutrition label values makes estimates more accurate too.')}</p>`)
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
  h+=`<div class="row" style="gap:8px;margin-top:4px">${S.templates.length?`<button class="btn" data-click="tplShareBox()">${I('share','sm')} ${L('Sablonok megosztása','Share templates')}</button>`:''}<button class="btn" data-click="sharePasteBox()">${I('download','sm')} ${L('Megosztott tartalom','Shared content')}</button></div>`;
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
  return[{id:'name',label:'Név',value:e.name||'',placeholder:'pl. Kettlebell egykezes evezés'},
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
  openModal(`<h2>${t.id?'Sablon szerkesztése':t.planDay?L('Új edzés tervezése','Plan a new workout'):'Új sablon'}</h2>${t.planDay?`<div class="hint" style="margin-top:-4px">${t.planDay===today()?L('Mentés után sablonként elmentődik, és a mai napra kerül.','On save it’s stored as a template and set for today.'):L(`Mentés után sablonként elmentődik, és erre a napra kerül: ${esc(fmtDate(t.planDay))}.`,`On save it’s stored as a template and set for ${esc(fmtDate(t.planDay))}.`)}</div>`:''}<label>Név</label><input value="${esc(T(t.name))}" data-input="setTplName(this.value)" placeholder="pl. Push nap">
  <label>Gyakorlatok · sorozatszám</label>
  ${t.items.map((it,i)=>`<div class="row li"><span style="flex:1;min-width:0">${esc(exName(it.exId))}<br><span class="mut small mono">${I('timer','sm')} ${fmtSec(exRest(it.exId))}</span></span><input type="number" min="1" max="30" value="${it.sets}" style="width:56px;text-align:center" data-input="setTplSets(${i},this.value)" aria-label="Sorozatok"><button class="btn sm ico" data-click="tplMove(${i},-1)" aria-label="Fel">${I('arrow-up','sm')}</button><button class="btn sm ico d" data-click="tplRemove(${i})" aria-label="Törlés">${I('x','sm')}</button></div>`).join('')||'<div class="mut small">Még nincs gyakorlat.</div>'}
  <button class="btn block gold" style="margin-top:12px" data-click="pickForTpl()">${I('plus','sm')} Gyakorlat hozzáadása</button>
  <div class="row" style="margin-top:16px">${t.id?`<button class="btn d" data-click="delTemplate('${t.id}')">${I('trash-2','sm')} Törlés</button>`:''}<span class="sp"></span><button class="btn" data-click="closeModal()">Mégse</button><button class="btn p" data-click="saveTpl()">${I('save','sm')} Mentés</button></div>`);
}
function tplAddEx(id){tplDraft.items.push({exId:id,sets:3});renderTpl()}
function tplMove(i,d){const a=tplDraft.items,j=i+d;if(j<0)return;[a[i],a[j]]=[a[j],a[i]];renderTpl()}
function saveTpl(){const t=tplDraft;t.name=(t.name||'').trim();if(!t.name){toast('Adj nevet a sablonnak');return}
  const pd=t.planDay;delete t.planDay;
  if(t.id){const i=S.templates.findIndex(x=>x.id===t.id);S.templates[i]=t}else{t.id=uid();S.templates.push(t)}
  if(pd){plans()[pd]=t.id;prunePlans();toast(pd===today()?L('Sablon mentve, a mai napra tervezve','Template saved and planned for today'):L('Sablon mentve és betervezve','Template saved and planned'))}save();closeModal();render()}
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
const KCAL_MIN=1200;let profAgeWarn=false;
function legalAccept(){if(!$('#legalck')?.checked){toast(L('Előbb pipáld ki az elfogadást','Tick the acceptance box first'));return}S.settings.legalOk=today();save();render();toast(L('Köszönöm! Most már kitöltheted a profilodat.','Thank you! You can now fill in your profile.'))}
async function setProf(k,v){
  const p=S.profile,before=targets().kcal,old=p[k]??null;
  if(k==='sex')p.sex=['m','f'].includes(v)?v:null;
  else if(k==='birthYear'){const y=parseInt(v),cy=new Date().getFullYear();if(y>=1900&&y<=cy&&cy-y<18){profAgeWarn=true;await ask(L('Az Olupant 18 év felettiek használhatják. A megadott születési év alapján még nem vagy 18 éves, ezért nem mentettem.','Olupan is for people aged 18 and over. Based on the birth year you entered you are under 18, so it wasn’t saved.'),{title:L('Korhatár','Age limit'),ok:'OK',cancel:false});render();return}profAgeWarn=false;p.birthYear=y>=1900&&y<=cy?y:null}
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
  let warn='';const ageWarn=profAgeWarn?L('Az Olupant 18 év felettiek használhatják; a születési évet nem mentettem.','Olupan is for people aged 18 and over; the birth year wasn’t saved.'):'';
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
  const base=location.protocol==='file:'?'https://olupan.com/':'/',lg=LANG==='en'?['disclaimer.html','privacy.html']:['jogi-nyilatkozat.html','adatvedelem.html'];
  if(!S.settings.legalOk)return `<div class="card" id="profile" style="scroll-margin-top:72px"><h2>Profil és célok</h2>
  <div class="hint" style="margin-top:0">${L('A profil kitöltése előtt kérlek, olvasd el és fogadd el a jogi nyilatkozatot és az adatkezelési tájékoztatót. Az Olupant 18 év felettiek használhatják.','Before filling in your profile, please read and accept the disclaimer and the privacy notice. Olupan is for people aged 18 and over.')}</div>
  <div class="stack" style="margin-top:10px"><a class="btn block" href="${base}${lg[0]}" target="_blank" rel="noopener">${I('external-link','sm')} ${L('Jogi nyilatkozat','Disclaimer')}</a><a class="btn block" href="${base}${lg[1]}" target="_blank" rel="noopener">${I('external-link','sm')} ${L('Adatkezelési tájékoztató','Privacy notice')}</a></div>
  <label class="ckrow" style="margin-top:14px"><input type="checkbox" id="legalck"> <span>${L('Elolvastam és elfogadom a jogi nyilatkozatot és az adatkezelési tájékoztatót, és elmúltam 18 éves.','I have read and accept the disclaimer and the privacy notice, and I am 18 or over.')}</span></label>
  <button class="btn p block" id="legalok" style="margin-top:10px" data-click="legalAccept()">${L('Elfogadom','I accept')}</button></div>`;
  return `<div class="card" id="profile" style="scroll-margin-top:72px"><h2>Profil és célok</h2>
  <label>Nem</label><div class="chips" style="margin:0">${chip('sex','m','Férfi',p.sex==='m')}${chip('sex','f','Nő',p.sex==='f')}</div>
  <div class="grid2" style="align-items:end"><div><label for="pby">Születési év${p.birthYear?` · ${y-p.birthYear} év`:''}</label><input id="pby" type="number" inputmode="numeric" min="1900" max="${y}" value="${p.birthYear??''}" placeholder="pl. 1980" data-change="setProf('birthYear',this.value)"></div>
  <div><label for="pht">Magasság (cm)</label><input id="pht" type="text" inputmode="decimal" autocomplete="off" value="${hu(p.height)}" placeholder="pl. 178" data-change="setProf('height',this.value)"></div>
</div>${ageWarn?`<div class="hint" style="color:var(--kj-red)">${ageWarn}</div>`:''}
  ${(()=>{const tb=S.body.find(b=>b.date===today()),lw=series('weight').slice(-1)[0],lf=series('fat').slice(-1)[0];
    return`<div class="grid2" style="align-items:end"><div><label for="pbw">Testsúly (kg)</label><input id="pbw" type="text" inputmode="decimal" autocomplete="off" value="${tb?.weight!=null?hu(tb.weight):''}" placeholder="${lw?hu(lw.y):'pl. 82'}" data-change="setProfBody('weight',this.value)"></div>
    <div><label for="pbf">Testzsír % (nem kötelező)</label><input id="pbf" type="text" inputmode="decimal" autocomplete="off" value="${tb?.fat!=null?hu(tb.fat):''}" placeholder="${lf?hu(lf.y):'pl. 22'}" data-change="setProfBody('fat',this.value)"></div></div>
    <div class="hint">${lw&&!tb?.weight?L(`Legutóbbi mérés: ${hu(lw.y)} kg (${fmtDate(lw.x)}). Ha most mérsz, írd be – a mai napra kerül a testadatok közé.`,`Last measurement: ${hu(lw.y)} kg (${fmtDate(lw.x)}). If you weigh yourself now, enter it – it’s saved for today in your body data.`):L('A mai napra kerül a testadatok közé; később a Testadatok oldalon vezeted tovább.','Saved for today in your body data; later you keep logging it on the Body page.')}</div>`})()}
  <label for="pact">Aktivitás</label><select id="pact" data-change="setProf('activity',this.value)"><option value="">– válassz –</option>${ACT_LV.map(([v,l])=>`<option value="${v}" ${p.activity===v?'selected':''}>${l}</option>`).join('')}</select>
  <label>Cél</label><div class="chips" style="margin:0">${GOALS.map(([v,l])=>chip('goal',v,l,(p.goal||'maintain')===v)).join('')}</div>
  <label for="ptw">Célsúly (kg)</label><input id="ptw" type="text" inputmode="decimal" autocomplete="off" value="${hu(p.targetWeight)}" placeholder="pl. 80" data-change="setProf('targetWeight',this.value)">
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
function pasteMeals(){return claudePaste()}
async function pasteMealsGo(text){
  let items=parseMeals(text,foodDate);if(!items.length)return;
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
function addMeal(){openFoodEntry()}
function editMeal(id){const m=S.meals.find(x=>x.id===id);if(m)openFoodEntry(m)}
async function delMeal(id){const m=S.meals.find(x=>x.id===id);if(!m)return;if(!await ask(`Törlöd: <b>${esc(m.name)}</b> (${m.kcal} kcal)?`,{title:'Tétel törlése',ok:'Törlés',danger:true}))return;S.meals=S.meals.filter(x=>x.id!==id);save();render()}
function copyMealToday(id){const m=S.meals.find(x=>x.id===id);if(!m)return;S.meals.push(Object.assign({},m,{id:uid(),date:today()}));save();toast('Hozzáadva a mai naphoz')}
function foodNav(d){const x=pYmd(foodDate);x.setDate(x.getDate()+d);const k=ymd(x);if(k>today())return;foodDate=k;render()}
function setFoodDate(v){foodDate=DATE_RE.test(v)&&v<=today()?v:today();render()}
function foodToday(){foodDate=today();render()}

/* ===== Receptjeim: Claude-ból betöltött saját receptek, adagszámítás, szavazás, megjegyzés, bevásárlólista ===== */
const REC_MEAL=[['breakfast','Reggeli','Breakfast'],['lunch','Ebéd','Lunch'],['dinner','Vacsora','Dinner'],['snack','Nassolnivaló','Snack']];
const REC_TAG=[['soup','Leves','Soup'],['salad','Saláta','Salad'],['protein','Magas fehérjetartalmú','High protein'],['fiber','Magas rosttartalmú','High fibre'],['dessert','Desszert','Dessert']];
const REC_STYLE=[['quick','Gyors','Quick'],['few','Kevés hozzávalóból','Few ingredients'],['prep','Előre elkészíthető','Make-ahead'],['handsoff','Otthagyhatós','Hands-off'],['seasonal','Szezonális','Seasonal']];
const REC_SEASON=[['spring','Tavasz','Spring'],['summer','Nyár','Summer'],['autumn','Ősz','Autumn'],['winter','Tél','Winter']];
const lblL=(arr,k)=>{const x=arr.find(a=>a[0]===k);return x?(LANG==='en'?x[2]:x[1]):k};
const curSeason=()=>['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'][new Date().getMonth()];
const recStyles=r=>[...r.style,...(r.season.length&&r.season.length<4?['seasonal']:[])];
/* A Claude-nak adott formátum (betöltéshez és a receptötletekhez is) */
function recipeFormat(L2){return L2(`Formátum: egyetlen kódblokk, amelynek első sora \`olupan-recipes\`, utána egy JSON-tömb. Receptenként:
{"name": "Recept neve", "aliases": ["becenév"], "servings": 2, "time": 25, "difficulty": "könnyű",
 "meal": ["breakfast"|"lunch"|"dinner"|"snack"], "cuisine": ["hu"|"it"|"es"|"med"|"us"|"mx"|"tr"|"me"|"ma"|"in"|"cn"|"jp"|"kr"|"th"|"vn"|"fr"|"gr"|"af"],
 "tags": ["soup"|"salad"|"protein"|"fiber"|"dessert"], "style": ["quick"|"few"|"prep"|"handsoff"], "season": ["spring"|"summer"|"autumn"|"winter"],
 "ingredients": [{"name": "zabpehely", "qty": 50, "unit": "g", "cat": "dry"}], "steps": ["1. lépés szövege", "2. lépés szövege"],
 "per_serving": {"kcal": 420, "protein": 30, "carbs": 45, "fat": 12, "fiber": 6}}
A nevek, hozzávalók és lépések magyarul legyenek; a mennyiségek számok (g, ml, db, ek, tk, csipet). A "time" percben értendő. Szezonális receptnél a "season" az évszak(ok), egész évben elkészíthetőnél üres. A "protein" címke 25 g feletti, a "fiber" 8 g feletti adagonkénti értéknél jár. A szénhidrát rost nélkül értendő (EU-s címke szerint). A "cat" a hozzávaló áruházi csoportja: ${SHOP_CAT_HELP_HU}.`,
`Format: a single code block whose first line is \`olupan-recipes\`, followed by a JSON array. For each recipe:
{"name": "Recipe name", "aliases": ["nickname"], "servings": 2, "time": 25, "difficulty": "easy",
 "meal": ["breakfast"|"lunch"|"dinner"|"snack"], "cuisine": ["hu"|"it"|"es"|"med"|"us"|"mx"|"tr"|"me"|"ma"|"in"|"cn"|"jp"|"kr"|"th"|"vn"|"fr"|"gr"|"af"],
 "tags": ["soup"|"salad"|"protein"|"fiber"|"dessert"], "style": ["quick"|"few"|"prep"|"handsoff"], "season": ["spring"|"summer"|"autumn"|"winter"],
 "ingredients": [{"name": "rolled oats", "qty": 50, "unit": "g", "cat": "dry"}], "steps": ["Step 1 text", "Step 2 text"],
 "per_serving": {"kcal": 420, "protein": 30, "carbs": 45, "fat": 12, "fiber": 6}}
Write names, ingredients and steps in English; quantities as numbers (g, ml, pcs, tbsp, tsp, pinch). "time" is in minutes. For seasonal recipes "season" lists the season(s); leave it empty for all-year recipes. The "protein" tag needs over 25 g, "fiber" over 8 g per serving. Carbohydrates exclude fibre (as on EU labels). "cat" is the ingredient's supermarket section: ${SHOP_CAT_HELP_EN}.`)}
function recSan(o){if(!o||typeof o!=='object')return null;const name=str(o.name||'',100).trim();if(!name)return null;
  const arr=(v,ok,n=12)=>(Array.isArray(v)?v:[]).map(x=>String(x).toLowerCase().trim()).filter(x=>!ok||ok.includes(x)).slice(0,n);
  const st0=arr(o.style,null).map(x=>({'few-ingredients':'few','make-ahead':'prep','hands-off':'handsoff'}[x]||x));
  const tg0=arr(o.tags,null).map(x=>({'high-protein':'protein','high-fiber':'fiber','high-fibre':'fiber'}[x]||x));
  const ps=o.per_serving||o.ps||{};const n=v=>{v=num(v,0,5000);return v==null?null:Math.round(v*10)/10};
  return{id:typeof o.id==='string'&&/^r[A-Za-z0-9_-]{1,40}$/.test(o.id)?o.id:'r'+uid(),name,aliases:arr(o.aliases,null,6).map(x=>str(x,60)),serv:Math.max(1,Math.min(50,Math.round(num(o.servings??o.serv,1,50)||1))),
    time:num(o.time,0,1440)!=null?Math.round(o.time):null,diff:str(o.difficulty||o.diff||'',30),
    meal:arr(o.meal,REC_MEAL.map(a=>a[0])),cuisine:arr(o.cuisine,PREF_CUISINE.map(a=>a[0])),tags:[...new Set(tg0.filter(x=>REC_TAG.some(a=>a[0]===x)))],
    style:[...new Set(st0.filter(x=>['quick','few','prep','handsoff'].includes(x)))],season:arr(o.season,REC_SEASON.map(a=>a[0]),4),
    ing:(Array.isArray(o.ingredients??o.ing)?(o.ingredients??o.ing):[]).slice(0,60).map(i=>typeof i==='string'?{n:str(i,120),q:null,u:''}:((c)=>Object.assign({n:str(i.name??i.n??'',120),q:num(i.qty??i.q,0,100000),u:str(i.unit??i.u??'',20)},SHOP_CAT_KEYS.includes(c)?{cat:c}:{}))(i.cat??i.aisle)).filter(i=>i.n),
    steps:(Array.isArray(o.steps)?o.steps:[]).slice(0,40).map(x=>str(String(x).replace(/^\s*\d+[.)]\s*/,''),600)).filter(Boolean),
    kcal:n(ps.kcal??o.kcal),p:n(ps.protein??o.p),c:n(ps.carbs??o.c),f:n(ps.fat??o.f),fib:n(ps.fiber??ps.fibre??o.fib),
    vote:o.vote===1||o.vote===-1?o.vote:0,note:str(o.note||'',1000),added:DATE_RE.test(o.added)?o.added:today()}}
function parseRecipes(t){t=String(t||'');const m=t.match(/```\s*olupan-recipes\s*\n([\s\S]*?)```/)||t.match(/olupan-recipes\s*\n([\s\S]*)/);let j=m?m[1]:t;
  const a=j.indexOf('['),b=j.lastIndexOf(']');if(a<0||b<a)return null;try{const d=JSON.parse(j.slice(a,b+1));return Array.isArray(d)?d.map(recSan).filter(Boolean):null}catch(e){return null}}
const REC_MAX=500;
function importRecipes(list){S.recipes=S.recipes||[];let add=0,upd=0,skip=0;
  for(const r of list){const k=deacc(r.name),ex=S.recipes.find(x=>deacc(x.name)===k);
    if(ex){Object.assign(ex,r,{id:ex.id,vote:ex.vote,note:ex.note,added:ex.added});upd++}else if(S.recipes.length<REC_MAX){S.recipes.push(r);add++}else skip++}
  save();if(skip)setTimeout(()=>toast(L(`${skip} recept nem fért el (legfeljebb ${REC_MAX})`,`${skip} recipe${skip>1?'s':''} didn’t fit (max ${REC_MAX})`)),1600);return[add,upd]}
/* Receptkeret: új kérés előtt legyen hely; ha nincs, a felhasználó előbb töröl */
function recRoom(need){const n=(S.recipes||[]).length;if(n+need<=REC_MAX)return true;closeModal();const dn=(S.recipes||[]).filter(r=>r.vote===-1).length;
  ask(L(`${n} recepted van, legfeljebb ${REC_MAX} fér el. Az új kérés előtt törölj olyanokat, amelyeket nem használsz vagy nem tetszenek${dn?` – például a ${dn} leszavazottat egyszerre`:''}.`,`You have ${n} recipes; at most ${REC_MAX} fit. Before a new request, delete ones you don’t use or don’t like${dn?` – e.g. the ${dn} disliked ones at once`:''}.`),{title:L('Betelt a receptek helye','Recipe storage is full'),ok:L('Receptjeim','My recipes'),cancel:L('Mégse','Cancel')}).then(v=>{if(v){recTab='all';goFrom('recipes')}});return false}
async function recDelDown(){const l=(S.recipes||[]).filter(r=>r.vote===-1);if(!l.length)return;if(!await ask(L(`Törlöd a ${l.length} leszavazott receptet?`,`Delete the ${l.length} disliked recipe${l.length>1?'s':''}?`),{title:L('Leszavazottak törlése','Delete disliked'),ok:L('Törlés','Delete'),danger:true}))return;
  const ids=new Set(l.map(r=>r.id));S.recipes=S.recipes.filter(r=>!ids.has(r.id));S.shop=(S.shop||[]).filter(x=>!ids.has(x.rid));if(S.menu)for(const x of S.menu.slots)if(ids.has(x.rid))x.rid=null;save();render();toast(L('Törölve','Deleted'))}
function recDone(list){if(!list||!list.length){toast(L('Nem találtam olupan-recipes kódblokkot','No olupan-recipes code block found'));return}const[a,u]=importRecipes(list);closeModal();recTab='all';recQ='';recF.clear();recMeal='';if(tab!=='recipes')goFrom('recipes');else render();toast(L(`${a} új, ${u} frissített recept`,`${a} new, ${u} updated recipe${a+u>1?'s':''}`))}
/* Lista nézet */
let recTab='all',recQ='',recF=new Set(),recMeal='',recStyleAll=false;
function recMatch(r,toks){if(!toks.length)return true;const hay=deacc([r.name,...r.aliases,...r.ing.map(i=>i.n),...r.cuisine.map(c=>lblL(PREF_CUISINE,c)),...recStyles(r).map(s=>lblL(REC_STYLE,s)),...r.tags.map(t=>lblL(REC_TAG,t)),...r.meal.map(m=>lblL(REC_MEAL,m)),...r.season.map(s=>lblL(REC_SEASON,s))].join(' '));return toks.every(t=>hay.includes(t))}
/* Csoporton belül VAGY (egy étel ritkán török és japán is), a csoportok között ÉS; a stílusnál választható ÉS kapcsolat is */
function recFilterOk(r){if(recMeal&&!r.meal.includes(recMeal))return false;const G={t:[],s:[],c:[]};for(const f of recF){const[g,k]=f.split(':');G[g]&&G[g].push(k)}
  const st=k=>k==='seasonal'?r.season.includes(curSeason()):r.style.includes(k);
  if(G.t.length&&!G.t.some(k=>r.tags.includes(k)))return false;
  if(G.c.length&&!G.c.some(k=>r.cuisine.includes(k)))return false;
  if(G.s.length&&!(recStyleAll?G.s.every(st):G.s.some(st)))return false;return true}
function recShown(){const toks=deacc(recQ).split(/\s+/).filter(Boolean);return(S.recipes||[]).filter(r=>(recTab!=='fav'||r.vote===1)&&recFilterOk(r)&&recMatch(r,toks))}
const recFLabel=f=>{const[g,k]=f.split(':');return g==='t'?lblL(REC_TAG,k):g==='s'?(k==='seasonal'?`${lblL(REC_STYLE,k)} (${lblL(REC_SEASON,curSeason()).toLowerCase()})`:lblL(REC_STYLE,k)):lblL(PREF_CUISINE,k)};
function recRow(r){const meta=[r.time?`<span>${I('timer','sm')}${r.time} ${L('perc','min')}</span>`:'',r.kcal!=null?`<span>${I('flame','sm')}${fmt(r.kcal,0)} kcal</span>`:'',r.cuisine.length?`<span>${esc(r.cuisine.map(c=>lblL(PREF_CUISINE,c)).join(', '))}</span>`:'',r.tags[0]?`<span>${esc(lblL(REC_TAG,r.tags[0]))}</span>`:''].filter(Boolean).join('');
  return`<button class="recrow" data-click="openRecipe('${r.id}')"><span style="flex:1;min-width:0"><span class="rn" translate="no">${esc(r.name)}</span><span class="rm">${meta}</span></span>${r.vote===1?`<span class="rv">${I('thumbs-up','sm')}</span>`:r.vote===-1?`<span class="mut">${I('thumbs-down','sm')}</span>`:''}<span class="mut">${I('chevron-right','sm')}</span></button>`}
function recListHtml(){const all=S.recipes||[],l=recShown().sort((a,b)=>(b.vote-a.vote)||a.name.localeCompare(b.name,'hu'));
  if(!l.length)return`<div class="card hint" style="margin-top:14px">${all.length?L('Nincs a szűrésnek megfelelő recept.','No recipes match the filter.'):''}</div>`;
  const dn=all.filter(r=>r.vote===-1).length;
  const cnt=`<div class="reccnt row" style="flex-wrap:nowrap"><span style="flex:1">${L(`${l.length} recept`,`${l.length} recipe${l.length>1?'s':''}`)}${all.length>=REC_MAX-50?` · <span style="color:var(--kj-amber,#d97706)">${all.length}/${REC_MAX}</span>`:''}</span>${dn?`<button class="linkbtn" style="width:auto;padding:0;font-size:13px" data-click="recDelDown()">${I('thumbs-down','sm')} ${L(`${dn} leszavazott törlése`,`Delete ${dn} disliked`)}</button>`:''}</div>`;
  if(recMeal||recQ.trim()||recTab==='fav')return cnt+`<div class="card reclist" style="margin-top:8px">${l.map(recRow).join('')}</div>`;
  const grp=[...REC_MEAL.map(a=>a[0]),''].map(m=>[m,l.filter(r=>(r.meal[0]||'')===m)]).filter(([,x])=>x.length);
  return cnt+grp.map(([m,x])=>`<div class="grp">${m?lblL(REC_MEAL,m):L('Egyéb','Other')} <span class="mono small">${x.length}</span></div><div class="card reclist">${x.map(recRow).join('')}</div>`).join('')}
function vRecipes(){const all=S.recipes||[],open=(S.shop||[]).filter(x=>!x.done).length;
  const m=menuActive(),td=today(),mrows=m?menuDayRows(m,td,true)||menuDayRows(m,addDays(td,1),true):'';
  const newCard=(m?`<div class="card mcard"><div class="row" style="flex-wrap:nowrap;margin-bottom:${mrows?'6px':'0'}"><span style="flex:1;min-width:0"><span class="hk">${L('Heti menü','Weekly menu')}</span><span class="small mut" style="display:block">${fmtDate(m.start)} – ${fmtDate(addDays(m.start,m.days-1))}</span></span><button class="btn sm" data-click="goFrom('menu')">${L('Megnyitás','Open')} ${I('chevron-right','sm')}</button></div>${mrows}</div>`:'')
    +`<div class="card"><h2 style="margin-top:0">${all.length?L('Claude-dal','With Claude'):L('Még nincs mentett recepted','No saved recipes yet')}</h2>${all.length?'':`<div class="small mut" style="margin-bottom:12px">${L('Kérj receptötleteket vagy egy heti menüt: a receptek egyből ide kerülnek, itt válogathatsz, szavazhatsz és törölhetsz.','Ask for recipe ideas or a weekly menu: the recipes land here, where you can sort, vote and delete.')}</div>`}
    <div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn${m?'':' p'}" style="flex:1 1 0;min-width:0" data-click="menuReqBox()">${I('calendar-days','sm')} ${m?L('Új menü','New menu'):L('Heti menü','Weekly menu')}</button><button class="btn${all.length?'':' p'}" style="flex:1 1 0;min-width:0" data-click="recIdeasGo()">${I('lightbulb','sm')} ${L('Receptötletek','Recipe ideas')}</button></div>
    <button class="linkbtn" style="margin-top:8px;padding-bottom:0" data-click="claudePaste()">${I('clipboard-paste','sm')} ${L('Válasz vagy link beillesztése','Paste a reply or link')}</button></div>`;
  const shopBtn=`<button class="btn ico ibtn" data-click="openShop()" aria-label="${L('Bevásárlólista','Shopping list')}">${I('shopping-basket','sm')}${open?`<span class="bdg">${open}</span>`:''}</button>`;
  if(!all.length)return`<div class="row" style="justify-content:flex-end;margin-bottom:12px">${shopBtn}</div>`+newCard;
  const top=newCard;
  const nf=recF.size,chip=(on,act,l)=>`<button class="chip ${on?'on':''}" ${act}>${l}</button>`;
 return top+`<div class="rectop" style="margin-top:4px"><input id="recq" type="search" autocomplete="off" placeholder="${L('Étel, összetevő, konyha…','Dish, ingredient, cuisine…')}" value="${esc(recQ)}" data-input="recSearch(this.value)"><button class="btn ico ibtn" data-click="recFilterBox()" aria-label="${L('Szűrők','Filters')}">${I('sliders-horizontal','sm')}${nf?`<span class="bdg">${nf}</span>`:''}</button>${shopBtn}</div>
  <div class="chips recchips recmeal">${chip(recTab==='fav','data-click="recFav()"',`${I('thumbs-up','sm')} ${L('Kedvencek','Favourites')}`)}${chip(!recMeal,'data-click="recSetMeal(\'\')"',L('Mind','All'))}${REC_MEAL.filter(([k])=>all.some(r=>r.meal.includes(k))).map(([k,h,e])=>chip(recMeal===k,`data-click="recSetMeal('${k}')"`,LANG==='en'?e:h)).join('')}</div>
  ${nf?`<div class="recact">${[...recF].map(f=>`<button class="chip on" data-click="recFilt('${f}')" aria-label="${L('Szűrő törlése','Remove filter')}">${esc(recFLabel(f))} ${I('x','sm')}</button>`).join('')}<button class="linkbtn" style="width:auto;padding:4px 6px" data-click="recFClear()">${L('Mind törlése','Clear all')}</button></div>`:''}
  <div id="reclist">${recListHtml()}</div>`}
function recSetTab(t){recTab=t;render()}
function recFav(){recTab=recTab==='fav'?'all':'fav';render()}
function recSetMeal(k){recMeal=k;render()}
function recSearch(v){recQ=v;const b=$('#reclist');if(b)b.innerHTML=recListHtml()}
function recFilt(k){recF.has(k)?recF.delete(k):recF.add(k);render()}
function recFClear(){recF.clear();render()}
function recFilterBox(){const all=S.recipes||[],ch=(k,l)=>`<button class="chip ${recF.has(k)?'on':''}" data-click="recFiltM('${k}')">${l}</button>`;
  const tags=REC_TAG.filter(([k])=>all.some(r=>r.tags.includes(k))),sty=REC_STYLE.filter(([k])=>k==='seasonal'||all.some(r=>r.style.includes(k))),cus=PREF_CUISINE.filter(([k])=>all.some(r=>r.cuisine.includes(k)));
  const sec=(t,x,extra)=>x?`<div class="fsec"><h3>${t}</h3><div class="chips">${x}</div>${extra||''}</div>`:'';
  const nS=[...recF].filter(f=>f.startsWith('s:')).length;
  openModal(`<h2>${L('Szűrők','Filters')}</h2><div class="hint" style="margin:-6px 0 14px">${L('Egy csoporton belül bármelyik egyezés elég, a különböző csoportoknak egyszerre kell teljesülniük.','Within a group any match is enough; different groups must all match.')}</div>
  ${sec(L('Fogás','Dish type'),tags.map(([k,h,e])=>ch('t:'+k,LANG==='en'?e:h)).join(''))}
  ${sec(L('Stílus','Style'),sty.map(([k])=>ch('s:'+k,esc(recFLabel('s:'+k)))).join(''),nS>1?`<div class="seg mftabs" role="group" aria-label="${L('Stílusok kapcsolata','How styles combine')}" style="margin-top:10px;max-width:260px"><button class="${recStyleAll?'':'on'}" data-click="recStyleMode(0)">${L('Bármelyik','Any')}</button><button class="${recStyleAll?'on':''}" data-click="recStyleMode(1)">${L('Mindegyik','All')}</button></div>`:'')}
  ${sec(L('Konyha','Cuisine'),cus.map(([k])=>ch('c:'+k,esc(lblL(PREF_CUISINE,k)))).join(''))}
  <div class="row" style="margin-top:6px">${recF.size?`<button class="btn" data-click="recFClearM()">${L('Szűrők törlése','Clear filters')}</button>`:''}<span class="sp"></span><button class="btn p" data-click="closeModal()">${L(`${recShown().length} recept mutatása`,`Show ${recShown().length} recipes`)}</button></div>`)}
function recStyleMode(v){recStyleAll=!!v;render();recFilterBox()}
function recFiltM(k){recF.has(k)?recF.delete(k):recF.add(k);render();recFilterBox()}
function recFClearM(){recF.clear();render();recFilterBox()}
/* Recept részletei: adagszám, hozzávalók, elkészítés, szavazás, megjegyzés */
let recCur=null,recServ=1;
const fmtQ=q=>q==null?'':q>=100?String(Math.round(q)):q>=10?hu(Math.round(q*2)/2,1):hu(Math.round(q*10)/10,1);
function openRecipe(id){const r=(S.recipes||[]).find(x=>x.id===id);if(!r)return;recCur=r;recServ=r.serv;renderRecipe()}
function renderRecipe(){const r=recCur,k=recServ/r.serv;
  const chips=[...r.meal.map(m=>lblL(REC_MEAL,m)),...r.cuisine.map(c=>lblL(PREF_CUISINE,c)),...r.tags.map(t=>lblL(REC_TAG,t)),...r.style.map(s=>lblL(REC_STYLE,s)),...r.season.map(s=>lblL(REC_SEASON,s))];
  openModal(`<h2 style="margin-bottom:4px">${esc(r.name)}</h2>${r.aliases.length?`<div class="hint" style="margin-top:0">${esc(r.aliases.join(', '))}</div>`:''}
  <div class="rtags">${chips.map((c,i)=>`<span class="rtag${i<r.meal.length?' m':''}">${esc(c)}</span>`).join('')}</div>
  <div class="small mut">${[r.time?`${I('timer','sm')} ${r.time} ${L('perc','min')}`:'',r.diff?esc(r.diff):'',r.kcal!=null?`${fmt(r.kcal,0)} kcal · ${L(`F ${hu(r.p??0,0)} · Sz ${hu(r.c??0,0)} · Zs ${hu(r.f??0,0)} g`,`P ${hu(r.p??0,0)} · C ${hu(r.c??0,0)} · F ${hu(r.f??0,0)} g`)} / ${L('adag','serving')}`:''].filter(Boolean).join(' · ')}</div>
  <div class="row" style="margin-top:12px;align-items:center"><b style="flex:1">${L('Hozzávalók','Ingredients')}</b><button class="btn sm ico" data-click="recServAdd(-1)" aria-label="${L('Kevesebb adag','Fewer servings')}">${I('minus','sm')}</button><span class="mono" style="min-width:74px;text-align:center">${recServ} ${L('adag','serv.')}</span><button class="btn sm ico" data-click="recServAdd(1)" aria-label="${L('Több adag','More servings')}">${I('plus','sm')}</button></div>
  <div class="chips" style="margin:6px 0 0;justify-content:flex-end">${[...new Set([1,2,4,r.serv])].sort((a,b)=>a-b).map(n=>`<button class="chip${recServ===n?' on':''}" data-click="recServSet(${n})">${n===r.serv?L(`${n} (eredeti)`,`${n} (original)`):L(`${n} fő`,`${n}`)}</button>`).join('')}</div>
  <div class="hint" style="margin-top:4px;text-align:right">${L('1 adag = 1 fő egy étkezése','1 serving = one person’s meal')}</div>
  <ul class="recing" translate="no">${r.ing.map(i=>`<li><span class="mono">${i.q!=null?fmtQ(i.q*k)+' '+esc(i.u):''}</span> ${esc(i.n)}</li>`).join('')}</ul>
  ${r.steps.length?`<b>${L('Elkészítés','Method')}</b><ol class="steps">${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:''}
  <div class="row" style="gap:8px;margin-top:10px;flex-wrap:nowrap"><button class="btn ${r.vote===1?'p':''}" data-click="recVote(1)" aria-pressed="${r.vote===1}" aria-label="${L('Tetszik','Like')}">${I('thumbs-up','sm')}</button><button class="btn ${r.vote===-1?'d':''}" data-click="recVote(-1)" aria-pressed="${r.vote===-1}" aria-label="${L('Nem tetszik','Dislike')}">${I('thumbs-down','sm')}</button><span class="sp"></span><button class="btn" data-click="recToShop()">${I('shopping-basket','sm')} ${L('Bevásárlólistához','To shopping list')}</button></div>
  <label for="recnote">${L('Megjegyzés','Note')}</label><textarea id="recnote" rows="2" placeholder="${L('pl. kevesebb sóval, dupla zöldséggel','e.g. less salt, double veg')}" data-change="recNote(this.value)">${esc(r.note)}</textarea>
  <div class="row" style="margin-top:14px">${r.kcal!=null?`<button class="btn" data-click="recLog()">${I('plus','sm')} ${L('Rögzítés','Log')}</button>`:''}<span class="sp"></span><button class="btn ico" data-click="recShare()" aria-label="${L('Megosztás','Share')}">${I('share','sm')}</button><button class="btn ico d" data-click="recDel()" aria-label="${L('Recept törlése','Delete recipe')}">${I('trash-2','sm')}</button><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
function recServSet(n){recServ=Math.max(1,Math.min(50,n|0));renderRecipe()}
function recServAdd(d){recServ=Math.max(1,Math.min(50,recServ+d));renderRecipe()}
function recVote(v){recCur.vote=recCur.vote===v?0:v;save();renderRecipe();render()}
function recNote(v){recCur.note=String(v).slice(0,1000);save()}
async function recLog(){const r=recCur;const f=await form(L('Rögzítés','Log'),[{id:'n',label:L('Hány adagot ettél?','How many servings did you eat?'),type:'number',value:'1'},{id:'meal',label:L('Étkezés','Meal'),type:'select',value:foodDate===today()?guessMeal():'ebed',options:MEALS}],{ok:L('Rögzítés','Log'),intro:esc(r.name)+(r.kcal!=null?` · ${fmt(r.kcal,0)} kcal / ${L('adag','serving')}`:'')});if(!f)return;
  const n=Math.max(.1,Math.min(20,parseMacro(f.n)||1)),q=v=>v==null?null:Math.round(v*n*10)/10;
  S.meals.push({id:uid(),date:foodDate,meal:MEALS.some(x=>x[0]===f.meal)?f.meal:'ebed',name:(r.name+' '+hu(n,1)+' '+L('adag','serving'+(n===1?'':'s'))).slice(0,100),kcal:Math.round((r.kcal||0)*n),p:q(r.p)||0,c:q(r.c)||0,f:q(r.f)||0,fib:q(r.fib)});save();closeModal();toast(L('Rögzítve az étkezések közé','Added to meals'));render()}
async function recDel(){const r=recCur;if(!await ask(L(`Törlöd ezt a receptet: <b>${esc(r.name)}</b>?`,`Delete this recipe: <b>${esc(r.name)}</b>?`),{title:L('Recept törlése','Delete recipe'),ok:L('Törlés','Delete'),danger:true}))return;S.recipes=S.recipes.filter(x=>x.id!==r.id);S.shop=(S.shop||[]).filter(x=>x.rid!==r.id);save();closeModal();render()}
/* ===== Bevásárlólista: egy aktív lista; azonos hozzávalók összevonva, receptenként törölhető ===== */
/* ===== Bevásárlólista: áruházi csoportok, összevonás, otthon lévő alapok összecsukva ===== */
const SHOP_CATS=[['veg','Zöldség, gyümölcs','Fruit & veg'],['meat','Hús, hal','Meat & fish'],['dairy','Tejtermék, tojás','Dairy & eggs'],['bakery','Pékáru','Bakery'],['dry','Száraz áru','Dry goods'],['can','Konzerv, üveges','Tins & jars'],['spice','Fűszer, olaj, sütés','Spices, oil, baking'],['frozen','Fagyasztott','Frozen'],['other','Egyéb','Other']];
const SHOP_CAT_KEYS=SHOP_CATS.map(x=>x[0]);
const SHOP_CAT_HELP_HU='"veg" zöldség-gyümölcs és friss fűszernövény, "meat" hús-hal, "dairy" tejtermék-tojás, "bakery" pékáru, "dry" liszt, rizs, tészta, zab, száraz hüvelyes, dió, "can" konzerv, üveges, szósz, lekvár, "spice" fűszer, olaj, ecet, sütőpor, szódabikarbóna, cukor, "frozen" fagyasztott, "other" egyéb';
const SHOP_CAT_HELP_EN='"veg" fruit, veg and fresh herbs, "meat" meat and fish, "dairy" dairy and eggs, "bakery" bread, "dry" flour, rice, pasta, oats, dried pulses, nuts, "can" tins, jars, sauces, jam, "spice" spices, oil, vinegar, baking powder, bicarbonate, sugar, "frozen" frozen, "other" other';
// tartalék a kategória nélküli tételekhez (ékezet nélküli kulcsszavak), az első találat nyer
const SHOP_GUESS=[['frozen',/fagyaszt|frozen/],
 ['can',/konzerv|passata|suritett|lekvar|hummusz|pesto|kokusztej|baked beans|\bin tin|tinned|canned|\bjam\b/],
 ['spice',/(^|\s)so(\s|$)|(^|\s)bors|olaj|ecet|fuszer|orolt|szaritott|curry|kurkuma|komeny|oregano|fahej|szerecsendio|baberlevel|chilipehely|fustolt paprika|sutopor|szodabikarbona|eleszto|cukor|(^|\s)mez(\s|$)|kemenyito|szojaszosz|mustar|(^|\s)salt|pepper|(^|\s)oil|vinegar|spice|dried|ground|baking|sugar|honey/],
 ['dairy',/tej|joghurt|turo|sajt|parmezan|mozzarella|feta|tejfol|tejszin|(^|\s)vaj(\s|$)|skyr|kefir|tojas|ricotta|milk|yog|cheese|cream|butter|(^|\s)eggs?(\s|$)/],
 ['meat',/csirke|pulyka|serte|marha|daralt|sonka|szalonna|kolbasz|(^|\s)hal(\s|$)|lazac|tonhal|tokehal|garnela|(^|\s)hus|chicken|turkey|pork|beef|salmon|fish|(^|\s)ham(\s|$)|bacon/],
 ['bakery',/kenyer|zsemle(?!morzsa)|kifli|bagett|tortilla|pita|bread|(^|\s)buns?(\s|$)|wrap/],
 ['dry',/liszt|rizs|teszta|zab|lencse|quinoa|bulgur|kuszkusz|dio|mandula|mogyoro|chia|morzsa|flour|rice|pasta|oat|lentil|(^|\s)nuts?|seed|couscous/],
 ['veg',/./]];
const SHOP_PANTRY=/(^|\s)so(\s|$)|(^|\s)bors|olaj|ecet|orolt|szaritott|fuszer|curry|kurkuma|komeny|oregano|fahej|szerecsendio|baberlevel|chilipehely|fustolt paprika|sutopor|szodabikarbona|szojaszosz|(^|\s)salt|pepper|(^|\s)oil|vinegar|dried|ground|baking/;
function shopGuess(n){const d=deacc(n);return(SHOP_GUESS.find(([,re])=>re.test(d))||['other'])[0]}
// összevonáshoz: zárójeles megjegyzés és a vessző utáni elkészítési mód le, mértékegység közösre (g, ml)
function shopBase(n){return String(n).replace(/\([^)]*\)/g,' ').replace(/,\s+\D.*$/,'').replace(/\s+,/g,',').replace(/\s+/g,' ').trim()||String(n).trim()}
function shopNorm(q,u){const k=deacc(u||'').trim();if(q==null)return[null,u||''];if(k==='kg')return[q*1000,'g'];if(k==='l')return[q*1000,'ml'];if(k==='dl')return[q*100,'ml'];if(k==='cl')return[q*10,'ml'];return[q,u||'']}
function shopItem(n,q,u,extra){const[nq,nu]=shopNorm(q,u),base=shopBase(n);return Object.assign({id:uid(),n:base.slice(0,80),q:nq!=null?Math.round(nq*100)/100:null,u:String(nu).slice(0,20),cat:shopGuess(String(n).replace(/\(eredeti[^)]*\)/g,'')),pantry:SHOP_PANTRY.test(deacc(base)),done:false},extra||{})}
const fmtShopQ=(q,u)=>{if(!q)return'';if(u==='g'&&q>=1000)return fmtQ(q/1000)+' kg';if(u==='ml'&&q>=1000)return fmtQ(q/1000)+' l';return fmtQ(q)+' '+esc(u)};
function recToShop(){const r=recCur,k=recServ/r.serv;S.shop=(S.shop||[]).filter(x=>x.rid!==r.id);
  for(const i of r.ing)S.shop.push(shopItem(i.n,i.q!=null?i.q*k:null,i.u,Object.assign({rid:r.id,rn:`${r.name} (${recServ} ${L('adag','serv.')})`},i.cat?{cat:i.cat}:{})));
  save();toast(L('Hozzáadva a bevásárlólistához','Added to the shopping list'));render()}
const shopKey=x=>deacc(x.n).replace(/\s+/g,' ').trim()+'|'+deacc(x.u||'');
function shopGroups(){const m=new Map();for(const x of S.shop||[]){const k=shopKey(x);let g=m.get(k);if(!g){g={k,n:x.n,u:x.u,q:0,qn:false,items:[],done:true,cat:x.cat||shopGuess(x.n),pantry:!!x.pantry,pack:x.pack||''};m.set(k,g)}g.items.push(x);if(x.q!=null)g.q+=x.q;else g.qn=true;if(!x.done)g.done=false;if(!x.pantry)g.pantry=false;if(x.pack&&!g.pack)g.pack=x.pack}
  const ci=c=>{const i=SHOP_CAT_KEYS.indexOf(c);return i<0?99:i};
  return[...m.values()].sort((a,b)=>(a.pantry-b.pantry)||(ci(a.cat)-ci(b.cat))||(a.done-b.done)||a.n.localeCompare(b.n,'hu'))}
function openShop(){renderShop()}
function renderShop(){const sh=S.shop||[],gs=shopGroups(),recs=[...new Map(sh.filter(x=>x.rid).map(x=>[x.rid,x.rn])).entries()];
  openModal(`<h2>${L('Bevásárlólista','Shopping list')}</h2>
  ${gs.length?shopListHtml(gs)
    :`<div class="hint">${L('Üres. Receptet a recept lapján adhatsz hozzá, vagy vegyél fel lent saját tételt.','Empty. Add a recipe from its page, or add your own item below.')}</div>`}
  <div class="row" style="gap:6px;margin-top:12px;flex-wrap:nowrap"><input id="shn" style="flex:1;min-width:0" autocomplete="off" placeholder="${L('Tétel, pl. kenyér','Item, e.g. bread')}"><input id="shq" style="width:86px" autocomplete="off" placeholder="${L('pl. 2 db','e.g. 2 pcs')}"><button class="btn ico p" data-click="shopAdd()" aria-label="${L('Hozzáadás','Add')}">${I('plus','sm')}</button></div>
  ${recs.length?`<div class="grp" style="margin-top:16px">${L('Receptek a listán','Recipes on the list')}</div>${recs.map(([id,n])=>`<div class="row li" style="flex-wrap:nowrap"><span style="flex:1;min-width:0" class="small">${esc(n)}</span><button class="btn sm ico" data-click="shopDelRec('${id}')" aria-label="${L('Recept hozzávalóinak törlése','Remove this recipe’s ingredients')}">${I('x','sm')}</button></div>`).join('')}`:''}
  <div class="row" style="margin-top:14px">${sh.length?`<button class="btn d" data-click="shopClear()">${L('Lista törlése','Clear list')}</button>`:''}${sh.some(x=>x.done)?`<button class="btn" data-click="shopClearDone()">${L('Kipipáltak törlése','Remove ticked')}</button>`:''}<span class="sp"></span><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
function shopListHtml(gs){const row=(g,i)=>`<button class="shoprow${g.done?' done':''}" data-click="shopToggle(${i})"><span class="ck">${g.done?I('check','sm'):''}</span><span style="flex:1;min-width:0"><span translate="no">${esc(g.n)}</span>${g.pack?` <span class="mut small">· ${esc(g.pack)}</span>`:g.items.length>1?` <span class="mut small">· ${g.items.length} ${L('receptből','recipes')}</span>`:''}</span><span class="mono small">${fmtShopQ(g.q,g.u)}${g.qn&&g.q?' +':''}</span></button>`;
  let h='',cur=null,open=false;const ix=gs.map((g,i)=>[g,i]),main=ix.filter(([g])=>!g.pantry),pan=ix.filter(([g])=>g.pantry);
  for(const[g,i]of main){if(g.cat!==cur){if(open)h+='</div>';cur=g.cat;h+=`<div class="shcat">${esc(lblL(SHOP_CATS,cur))}</div><div class="shoplist">`;open=true}h+=row(g,i)}
  if(open)h+='</div>';
  if(pan.length){const left=pan.filter(([g])=>!g.done).length;h+=`<button class="shpanh" data-click="shopPanT()" aria-expanded="${shopPanOpen}"><span class="chev${shopPanOpen?' on':''}">${I('chevron-right','sm')}</span><span style="flex:1;text-align:left">${L('Fűszerek és alapok – ellenőrizd, otthon van-e','Spices and basics – check you have them')}</span><span class="mono small">${left}/${pan.length}</span></button>${shopPanOpen?`<div class="shoplist">${pan.map(([g,i])=>row(g,i)).join('')}</div>`:''}`}
  return h}
let shopPanOpen=false;function shopPanT(){shopPanOpen=!shopPanOpen;renderShop()}
function shopToggle(i){const g=shopGroups()[i];if(!g)return;const v=!g.done;for(const x of g.items)x.done=v;save();renderShop()}
function shopAdd(){const n=($('#shn').value||'').trim();if(!n)return;const qs=($('#shq').value||'').trim(),m=qs.match(/^([\d.,]+)\s*(.*)$/);
  S.shop=S.shop||[];S.shop.push(Object.assign(shopItem(n,m?parseMacro(m[1]):null,m?m[2]:'',{rid:null,rn:''}),m||!qs?{n:n.slice(0,80)}:{n:`${n} (${qs})`.slice(0,80)},{pantry:false}));save();renderShop();render();setTimeout(()=>$('#shn')?.focus(),50)}
function shopDelRec(id){S.shop=(S.shop||[]).filter(x=>x.rid!==id);save();renderShop();render()}
function shopClearDone(){S.shop=(S.shop||[]).filter(x=>!x.done);save();renderShop();render()}
async function shopClear(){if(!await ask(L('Törlöd a teljes bevásárlólistát?','Clear the whole shopping list?'),{title:L('Lista törlése','Clear list'),ok:L('Törlés','Clear'),danger:true}))return;S.shop=[];save();closeModal();render()}

/* ===== Megosztás: recept vagy 1–5 edzéssablon linkben / QR-kódban =====
   A tartalom tömörítve (deflate) a link # utáni részébe kerül: a böngésző ezt nem küldi el a szervernek, így az adat
   csak a két készülék között utazik. Megnyitáskor (vagy QR-beolvasáskor, link beillesztésekor) előnézet és jóváhagyás. */
const SHARE_PFX='#i=1.',SHARE_MAX_TPL=5,QR_MAX=2300;
const b64u=u=>b64e(u).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64ud=s=>b64d(String(s).replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((String(s).length+3)%4));
async function deflU(u){if(!window.CompressionStream)return null;return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer())}
async function inflU(u){return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}
const shareBase=()=>location.protocol==='file:'?'https://olupan.com/':location.origin+'/';
async function shareLink(obj){const u=te.encode(JSON.stringify(obj)),z=await deflU(u);return shareBase()+(z?SHARE_PFX+'z'+b64u(z):SHARE_PFX+'j'+b64u(u))}
async function shareDecode(txt){const i=String(txt||'').indexOf('#i=1.');if(i<0)return null;const p=txt.slice(i+5).trim(),k=p[0],d=b64ud(p.slice(1));
  if(d.length>200000)return null;const u=k==='z'?await inflU(d):k==='j'?d:null;if(!u||u.length>500000)return null;return JSON.parse(td.decode(u))}
/* Csomagok */
const recShareObj=r=>({name:r.name,aliases:r.aliases,servings:r.serv,time:r.time,difficulty:r.diff,meal:r.meal,cuisine:r.cuisine,tags:r.tags,style:r.style,season:r.season,
  ingredients:r.ing.map(i=>Object.assign({name:i.n,qty:i.q,unit:i.u},i.cat?{cat:i.cat}:{})),steps:r.steps,per_serving:{kcal:r.kcal,protein:r.p,carbs:r.c,fat:r.f,fiber:r.fib}});
function tplShareObj(t){return{name:T(t.name),items:t.items.map(it=>{const e=exById(it.exId)||{};return{sets:it.sets,ex:{name:T(e.name||''),cat:e.cat||'',mu:e.mu||'',mu2:e.mu2||[],eq:e.eq||'',kind:e.kind||'reps',rest:e.rest??null}}})}}
async function shareOpen(obj,title){let url;try{url=await shareLink(obj)}catch(e){toast(L('A megosztás nem sikerült','Sharing failed'));return}
  const canQr=url.length<=QR_MAX;
  openModal(`<h2>${I('share','sm')} ${esc(title)}</h2>
  <div class="hint" style="margin-top:0">${L('A tartalom a linkben van, tömörítve; szerverre nem kerül. A címzett megnyitja a linket vagy beolvassa a QR-kódot az Olupanban, és jóváhagyás után importálja.','The content is inside the link, compressed; it doesn’t go to any server. The recipient opens the link or scans the QR code in Olupan, and imports it after confirming.')}</div>
  <div class="stack" style="margin-top:10px">${navigator.share?`<button class="btn p block" data-click="shareSys()">${I('share','sm')} ${L('Küldés…','Send…')}</button>`:''}<button class="btn block" data-click="shareCopy()">${I('copy','sm')} ${L('Link másolása','Copy link')}</button></div>
  <div id="qrbox" class="qrbox">${canQr?`<span class="mut small">${L('QR-kód készül…','Making QR code…')}</span>`:`<span class="mut small">${L('Ez a tartalom túl hosszú QR-kódhoz – küldd linkként.','This content is too long for a QR code – send it as a link.')}</span>`}</div>
  <div class="hint">${L(`A link hossza: ${url.length} karakter.`,`Link length: ${url.length} characters.`)} ${L('iPhone-on a főképernyőre telepített app külön tárhelyet használ, mint a Safari: ott a linket inkább az appban illeszd be (Beállítások → Adatok → Megosztott tartalom), vagy olvasd be a QR-kódot az app vonalkód-olvasójával.','On iPhone the home-screen app uses separate storage from Safari: there, paste the link inside the app (Settings → Data → Shared content) or scan the QR code with the app’s barcode reader.')}</div>
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`);
  shareCur={url,title};
  if(canQr)try{const q=await loadJs('/assets/qrcode.js','sha384-e9EFD6BGC90bkW9aDV5xbbBfzwN7G8YImHao2lfLVKV/hPB0E0go+H3I64h7oHtA','qrcode');const qr=q(0,'L');qr.addData(url,'Byte');qr.make();const b=$('#qrbox');if(b)b.innerHTML=qr.createSvgTag({cellSize:4,margin:4,scalable:true})}catch(e){const b=$('#qrbox');if(b)b.innerHTML=`<span class="mut small">${L('A QR-kód nem készült el – küldd linkként.','The QR code couldn’t be made – send it as a link.')}</span>`}}
let shareCur=null;
async function shareSys(){if(!shareCur)return;try{await navigator.share({title:'Olupan – '+shareCur.title,text:'Olupan – '+shareCur.title,url:shareCur.url})}catch(e){}}
async function shareCopy(){if(!shareCur)return;try{await navigator.clipboard.writeText(shareCur.url);toast(L('Link a vágólapon','Link copied'))}catch(e){toast(L('Nem sikerült másolni','Couldn’t copy'))}}
function recShare(){const r=recCur;if(r)shareOpen({t:'recipes',v:1,recipes:[recShareObj(r)]},L('Recept megosztása','Share recipe')+': '+r.name)}
/* Sablonok kiválasztása (legfeljebb 5) */
let tplSel=new Set();
function tplShareBox(){tplSel=new Set();renderTplShare()}
function renderTplShare(){const l=S.templates.slice().sort((a,b)=>T(a.name).localeCompare(T(b.name),'hu'));
  openModal(`<h2>${I('share','sm')} ${L('Sablonok megosztása','Share templates')}</h2><div class="hint" style="margin-top:0">${L(`Válassz legfeljebb ${SHARE_MAX_TPL} sablont (pl. egy heti tervet). A saját gyakorlatok is velük mennek.`,`Pick up to ${SHARE_MAX_TPL} templates (e.g. a weekly plan). Your own exercises go with them.`)}</div>
  <div class="shoplist" style="margin-top:8px;max-height:50vh;overflow:auto">${l.map(t=>`<button class="shoprow${tplSel.has(t.id)?' done':''}" style="text-decoration:none" data-click="tplShareTg('${t.id}')"><span class="ck">${tplSel.has(t.id)?I('check','sm'):''}</span><span style="flex:1;min-width:0;text-decoration:none">${esc(T(t.name))}</span><span class="mut small">${t.items.length} ${L('gyak.','ex.')}</span></button>`).join('')}</div>
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" data-click="tplShareGo()" ${tplSel.size?'':'disabled'}>${I('share','sm')} ${L(`Megosztás (${tplSel.size})`,`Share (${tplSel.size})`)}</button></div>`)}
function tplShareTg(id){if(tplSel.has(id))tplSel.delete(id);else{if(tplSel.size>=SHARE_MAX_TPL){toast(L(`Legfeljebb ${SHARE_MAX_TPL} sablon`,`At most ${SHARE_MAX_TPL} templates`));return}tplSel.add(id)}renderTplShare()}
function tplShareGo(){const ts=S.templates.filter(t=>tplSel.has(t.id));if(!ts.length)return;shareOpen({t:'templates',v:1,templates:ts.map(tplShareObj)},ts.length===1?L('Sablon megosztása','Share template')+': '+T(ts[0].name):L(`${ts.length} sablon megosztása`,`Share ${ts.length} templates`))}
/* Import: előnézet és jóváhagyás */
let shareIn=null;
async function shareImportText(txt){let o=null;try{o=await shareDecode(txt)}catch(e){o=null}
  if(!o||!['recipes','templates'].includes(o.t)){toast(L('Ez nem Olupan-megosztás, vagy sérült','This isn’t an Olupan share, or it’s damaged'));return}
  if(o.t==='recipes'){const rs=(Array.isArray(o.recipes)?o.recipes:[]).slice(0,50).map(recSan).filter(Boolean);if(!rs.length){toast(L('Üres megosztás','Empty share'));return}shareIn={t:'recipes',rs};
    openModal(`<h2>${I('cooking-pot','sm')} ${L('Megosztott recept','Shared recipe')}</h2><div class="hint" style="margin-top:0">${L('Valaki receptet küldött neked. Ellenőrizd, és ha rendben van, mentsd a Receptjeim közé.','Someone sent you a recipe. Check it and, if it looks fine, save it to My recipes.')}</div>
    ${rs.map(r=>`<div class="mfsel" style="margin-top:10px"><b>${esc(r.name)}</b><div class="small mut">${r.serv} ${L('adag','servings')} · ${r.ing.length} ${L('hozzávaló','ingredients')} · ${r.steps.length} ${L('lépés','steps')}${r.kcal!=null?` · ${fmt(r.kcal,0)} kcal/${L('adag','serving')}`:''}</div><div class="small" style="margin-top:6px">${esc(r.ing.slice(0,8).map(i=>i.n).join(', '))}${r.ing.length>8?'…':''}</div></div>`).join('')}
    <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" data-click="shareImportGo()">${L('Mentés a Receptjeim közé','Save to My recipes')}</button></div>`);return}
  const ts=(Array.isArray(o.templates)?o.templates:[]).slice(0,SHARE_MAX_TPL).map(t=>({name:str(t&&t.name||'',80).trim(),items:(Array.isArray(t&&t.items)?t.items:[]).slice(0,40).map(it=>({sets:Math.max(1,Math.min(30,Math.round(num(it&&it.sets,1,30)||3))),ex:it&&it.ex||{}})).filter(it=>str(it.ex.name||'',80).trim())})).filter(t=>t.name&&t.items.length);
  if(!ts.length){toast(L('Üres megosztás','Empty share'));return}
  const exKey=n=>deacc(String(n).trim()),have=new Map(S.exercises.map(e=>[exKey(T(e.name)),e]).concat(S.exercises.map(e=>[exKey(e.name),e])));
  const newEx=[...new Set(ts.flatMap(t=>t.items.map(it=>str(it.ex.name,80).trim())).filter(n=>!have.has(exKey(n))))];
  shareIn={t:'templates',ts};
  openModal(`<h2>${I('dumbbell','sm')} ${L('Megosztott sablonok','Shared templates')}</h2><div class="hint" style="margin-top:0">${L('Valaki edzéssablont küldött neked. Ellenőrizd, és ha rendben van, add hozzá a sablonjaidhoz.','Someone sent you workout templates. Check them and, if they look fine, add them to your templates.')}</div>
  ${ts.map(t=>`<div class="mfsel" style="margin-top:10px"><b>${esc(t.name)}</b><div class="small mut">${esc(t.items.map(it=>`${it.ex.name} ×${it.sets}`).join(' · '))}</div></div>`).join('')}
  ${newEx.length?`<div class="hint">${L(`${newEx.length} új gyakorlat is létrejön: `,`${newEx.length} new exercise${newEx.length>1?'s are':' is'} also created: `)}${esc(newEx.join(', '))}</div>`:''}
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" data-click="shareImportGo()">${L('Hozzáadás a sablonokhoz','Add to templates')}</button></div>`)}
function shareImportGo(){const x=shareIn;if(!x)return;
  if(x.t==='recipes'){const[a,u]=importRecipes(x.rs.map(r=>Object.assign(r,{vote:0,note:''})));closeModal();toast(L(`${a} új, ${u} frissített recept`,`${a} new, ${u} updated recipe${a+u>1?'s':''}`));shareIn=null;goFrom('recipes');return}
  const exKey=n=>deacc(String(n).trim()),have=new Map(S.exercises.map(e=>[exKey(T(e.name)),e]).concat(S.exercises.map(e=>[exKey(e.name),e])));let nn=0;
  for(const t of x.ts){const items=[];for(const it of t.items){const nm=str(it.ex.name,80).trim();let e=have.get(exKey(nm));
      if(!e){e={id:uid(),name:nm,cat:str(it.ex.cat||'',40)||'Egyéb',m:1};const mu=str(it.ex.mu||'',30);if(mu)e.mu=mu;if(Array.isArray(it.ex.mu2))e.mu2=it.ex.mu2.slice(0,4).map(v=>str(v,30));
        if(['bar','db','mach','bw','kb','other'].includes(it.ex.eq))e.eq=it.ex.eq;if(['reps','time','cardio'].includes(it.ex.kind))e.kind=it.ex.kind;const rs=num(it.ex.rest,0,1800);if(rs!=null)e.rest=rs;
        S.exercises.push(e);have.set(exKey(nm),e);nn++}
      items.push({exId:e.id,sets:it.sets})}
    let name=t.name;if(S.templates.some(y=>T(y.name)===name))name+=L(' (megosztott)',' (shared)');S.templates.push({id:uid(),name,items})}
  S=sanitizeState(S);save();closeModal();shareIn=null;toast(L(`${x.ts.length} sablon hozzáadva`,`${x.ts.length} template${x.ts.length>1?'s':''} added`)+(nn?L(`, ${nn} új gyakorlat`,`, ${nn} new exercise${nn>1?'s':''}`):''));render()}
function sharePasteBox(){openModal(`<h2>${I('download','sm')} ${L('Megosztott tartalom','Shared content')}</h2><div class="hint" style="margin-top:0">${L('Illeszd be a kapott Olupan-linket, vagy olvasd be a QR-kódot.','Paste the Olupan link you received, or scan the QR code.')}</div>
  <textarea id="sharein" rows="3" class="mono" style="font-size:12px" placeholder="https://olupan.com/#i=1.…"></textarea>
  <div class="row" style="gap:8px;margin-top:8px">${canScan()?`<button class="btn" data-click="openScanner()">${I('scan-barcode','sm')} ${L('QR-kód beolvasása','Scan QR code')}</button>`:''}<span class="sp"></span><button class="btn p" data-click="sharePasteGo()">${L('Megnyitás','Open')}</button></div>
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
function sharePasteGo(){const t=($('#sharein')||{}).value||'';if(!t.trim())return;shareImportText(t)}
/* Indításkor: link a címsorban */
function shareFromHash(){if(!location.hash.startsWith('#i=1.'))return;const h=location.hash;try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}setTimeout(()=>shareImportText(h),300)}

/* ===== Étkezés oldal: tematikus kártyasáv (vízszintesen görgethető), mindegyik egy modalt vagy funkciót nyit ===== */
function foodTiles(){const k=!!targets().kcal;
  const tile=(act,ic,t,sub,dis)=>`<button class="ftile${dis?' dim':''}" ${act}><span class="fti">${I(ic)}</span><b>${t}</b><span>${sub}</span></button>`;
  return`<div class="ftiles" role="list">${[
    tile('data-click="addMeal()"','search',L('Keresés','Search'),L('Élelmiszer vagy saját tétel','A food or your own item')),
    tile('data-click="quickLog()"','history',L('Gyors rögzítés','Quick log'),L('Korábbi és gyakori ételek','Earlier and frequent meals')),
    tile('data-click="claudeBox()"','sparkles',L('Claude-dal','With Claude'),L('Fotóból vagy leírásból','From a photo or description')),
    tile('data-click="restBox()"','utensils',L('Mit egyek még ma?','What else today?'),L('Abból, ami kéznél van','From what you have'),!k),
    tile('data-click="goFrom(\'recipes\')"','cooking-pot',L('Receptjeim','My recipes'),menuActive()?L('Heti menü, receptek','Weekly menu, recipes'):(S.recipes||[]).length?L(`${S.recipes.length} recept`,`${S.recipes.length} recipe${S.recipes.length>1?'s':''}`):L('Heti menü, receptötletek','Weekly menu, recipe ideas')),
    canScan()?tile('data-click="scanFood()"','scan-barcode',L('Vonalkód','Barcode'),L('Csomagolt termékhez','For packaged food')):''].join('')}</div><div class="fdots" aria-hidden="true"><i class="on"></i><i></i></div>`}
document.addEventListener('scroll',e=>{const t=e.target;if(!t.classList||!t.classList.contains('ftiles'))return;const pg=t.scrollLeft>(t.scrollWidth-t.clientWidth)/2?1:0;t.nextElementSibling?.querySelectorAll('i').forEach((x,i)=>x.classList.toggle('on',i===pg))},true);
function fbGo(k){closeModal();({paste:claudePaste,help:foodHelp,prefs:()=>openSub('food','fprefs'),profile:()=>openSub('profile')})[k]?.()}
function scanFood(){openFoodEntry();openScanner()}
/* ===== Heti menü: Claude olupan-menu blokkban adja vissza; egy aktív menü, napokra bontva, rögzíthető, bevásárlólistát ad ===== */
function menuOpt(){const o=Object.assign({days:7,cook:2,meals:['breakfast','lunch','dinner','snack'],start:'today'},S.settings.menuOpt||{});o.days=[3,5,7].includes(o.days)?o.days:7;o.cook=[1,2,3,7].includes(o.cook)?o.cook:2;o.meals=REC_MEAL.map(x=>x[0]).filter(k=>Array.isArray(o.meals)&&o.meals.includes(k));if(!o.meals.length)o.meals=['lunch'];if(!['today','tomorrow','week'].includes(o.start))o.start='today';return o}
function menuStartDate(k){const td=today();if(k==='tomorrow')return addDays(td,1);if(k==='week'){const d=pYmd(td),off=(8-d.getDay())%7||7;return addDays(td,off)}return td}
/* Főzőnapok: a „jövő hét” vasárnapi előfőzéssel indul (a munkahétre készülünk), a többi főzés egyenletesen oszlik el; 3 napra egy főzés elég */
function menuCookDays(o){if(o.cook>=7)return null;const n=o.days<=3?1:Math.min(o.cook,3),D=o.days;
  if(o.start==='week'){const T={7:{2:[[3,4]],3:[[2],[4]]},5:{2:[[2,3]],3:[[2],[3,4]]}};return[[0],...(n>1?(T[D]||T[7])[n]||[]:[])]}
  const out=[[1]];for(let i=1;i<n;i++)out.push([1+Math.round(i*D/n)]);return out}
function menuCookText(o,L2,start){const cd=menuCookDays(o);if(!cd)return'';const wd=d=>{const x=pYmd(addDays(start,d-1));return x.toLocaleDateString(L2('hu-HU','en-GB'),{weekday:'long'})};
  return cd.map(a=>a[0]===0?L2('az 1. nap előtti vasárnap (előfőzés a hétre; az itt főzött ételek "cook" jelölése az első előfordulásuknál legyen)','the Sunday before day 1 (prep for the week; put the "cook" mark on the first occurrence of these dishes)'):a.map(d=>L2(`${d}. nap (${wd(d)})`,`day ${d} (${wd(d)})`)).join(L2(' vagy ',' or '))).join('; ')}
function menuFormat(L2,people,days,prep){const rf=recipeFormat(L2).replace(/^[^\n]*\n/,'');return L2(`A válasz végén egyetlen kódblokk legyen, amelynek első sora \`olupan-menu\`, utána egy JSON-objektum:
{"days": ${days}, "slots": [{"day": 1, "meal": "lunch", "recipe": "Lencsefőzelék", "cook": 4}, {"day": 2, "meal": "lunch", "recipe": "Lencsefőzelék"}], "recipes": [ ... ], "shopping": [ ... ], "cookplan": [ ... ]}
- "day": 1-től számozva (1 = a fenti kezdőnap). "meal": "breakfast"|"lunch"|"dinner"|"snack", csak a kért étkezésekre, minden napra.
- ${people>1?`${people} főre főzök, de én csak 1 adagot eszem: minden hely ${people} adag, a "per_serving" és a napi keret viszont 1 főre (1 adagra) vonatkozik. A "cook" adagszámba számold bele mind a ${people} főt.`:'Minden hely 1 adag.'}
- "cook": annál a helynél add meg, ahol az étel elkészül: hány adagot készítek el (a maradékokkal együtt). Maradéknál ne legyen "cook". Reggelinél és snacknél is add meg, ha aznap készül.
- "recipe": a recept pontos neve. Ha a mentett receptjeim közül választasz, pontosan azt a nevet írd; minden más használt recept kerüljön a "recipes" tömbbe (a receptek formátuma lent).
- "shopping": a teljes menü bevásárlólistája, a "cook" adagszámokkal számolva: az azonos termékek összevonva (pl. két 2%-os görög joghurt egy tételben, a 0%-os külön), megjegyzések nélkül, a boltban kapható formában (nyers, nem főtt mennyiség), egységesen g, ml vagy db. Tételenként: {"name": "görög joghurt 2%", "qty": 850, "unit": "g", "cat": "dairy", "pack": "2 × 500 g", "pantry": false}. A "cat": ${SHOP_CAT_HELP_HU}. A "pack" nem kötelező, csak ha segít (szokásos kiszerelés). "pantry": true annál, ami jellemzően otthon van (só, bors, olaj, ecet, szárított fűszerek, sütőpor); a friss fűszernövény (pl. korianderlevél) nem az.
- "cookplan": főzőnaponként egy útmutató: {"day": 1, "recipes": ["receptnév"], "time": 120, "steps": ["Sütő 220 °C-ra; amíg melegszik, …"], "store": ["Curry: 3 doboz hűtőbe, 3 fagyasztóba, a rizs külön"]}. A "day" a főzés napja${prep?" (0 = az 1. nap előtti vasárnapi előfőzés)":", 1-től számozva, ugyanúgy, mint a slotoknál (1 = a kezdőnap, ekkor főzök először)"}. A lépések párhuzamosítva vezessék végig az egész főzést (mit mikor tegyek fel, mit csináljak közben), ne ismételjék szó szerint a receptek lépéseit. A "time" a teljes idő percben. Csak a főzőnapokra adj útmutatót, a reggelikhez és snackekhez nem kell.
Receptenként:
${rf}`,`At the end of the reply give a single code block whose first line is \`olupan-menu\`, followed by a JSON object:
{"days": ${days}, "slots": [{"day": 1, "meal": "lunch", "recipe": "Lentil stew", "cook": 4}, {"day": 2, "meal": "lunch", "recipe": "Lentil stew"}], "recipes": [ ... ], "shopping": [ ... ], "cookplan": [ ... ]}
- "day": numbered from 1 (1 = the start day above). "meal": "breakfast"|"lunch"|"dinner"|"snack", only for the requested meals, every day.
- ${people>1?`I cook for ${people} people but eat 1 serving myself: each slot is ${people} servings, while "per_serving" and the daily target are for 1 person (1 serving). Count all ${people} people in the "cook" servings.`:'Each slot is 1 serving.'}
- "cook": give it on the slot where the dish is prepared: how many servings I make (including leftovers). Leftover slots have no "cook". Give it for breakfasts and snacks too when they are made that day.
- "recipe": the exact recipe name. If you pick one of my saved recipes, use exactly that name; every other recipe used goes into the "recipes" array (format below).
- "shopping": the shopping list for the whole menu, using the "cook" servings: identical products merged (e.g. two 2% Greek yoghurts in one item, the 0% one separate), without notes, in the form sold in shops (raw, not cooked amounts), consistently in g, ml or pcs. Each item: {"name": "Greek yoghurt 2%", "qty": 850, "unit": "g", "cat": "dairy", "pack": "2 × 500 g", "pantry": false}. "cat": ${SHOP_CAT_HELP_EN}. "pack" is optional, only when it helps (usual pack size). "pantry": true for things usually at home (salt, pepper, oil, vinegar, dried spices, baking powder); fresh herbs (e.g. coriander) are not.
- "cookplan": one guide per cooking day: {"day": 1, "recipes": ["recipe name"], "time": 120, "steps": ["Oven to 220 °C; while it heats, …"], "store": ["Curry: 3 boxes in the fridge, 3 in the freezer, rice separate"]}. "day" is the cooking day${prep?" (0 = the Sunday prep before day 1)":", numbered from 1 like the slots (1 = the start day, when I cook first)"}. Steps run the whole session in parallel (what to start when, what to do meanwhile) rather than repeating each recipe's steps word for word. "time" is the total minutes. Guides only for cooking days, not for breakfasts and snacks.
Each recipe:
${rf}`)}
function parseMenu(t){t=String(t||'');const m=t.match(/olupan-menu\s*\n([\s\S]*?)(```|$)/);const j=m?m[1]:t,a=j.indexOf('{'),b=j.lastIndexOf('}');if(a<0||b<a)return null;let o;try{o=JSON.parse(j.slice(a,b+1))}catch(e){return null}
  const days=Math.max(1,Math.min(14,Math.round(num(o.days,1,14)||7))),mk=REC_MEAL.map(x=>x[0]);
  const slots=(Array.isArray(o.slots)?o.slots:[]).slice(0,120).map(x=>({d:Math.round(num(x&&x.day,1,14)||0),meal:mk.includes(x&&x.meal)?x.meal:null,name:str(x&&x.recipe||'',100).trim(),cook:num(x&&x.cook,0,100)})).filter(x=>x.d>=1&&x.d<=days&&x.meal&&x.name);
  if(!slots.length)return null;
  const shop=(Array.isArray(o.shopping)?o.shopping:[]).slice(0,200).filter(x=>x&&(x.name||x.n)).map(x=>({n:str(x.name??x.n,80).trim(),q:num(x.qty??x.q,0,100000),u:str(x.unit??x.u??'',20),cat:SHOP_CAT_KEYS.includes(x.cat)?x.cat:null,pack:str(x.pack||'',40),pantry:x.pantry===true})).filter(x=>x.n);
  const plan=(Array.isArray(o.cookplan)?o.cookplan:[]).slice(0,14).filter(x=>x&&Array.isArray(x.steps)).map(x=>({d:Math.round(num(x.day,0,14)??1),recipes:(Array.isArray(x.recipes)?x.recipes:[]).slice(0,8).map(r=>str(r,100)),time:num(x.time,0,900),steps:x.steps.slice(0,40).map(t=>str(t,400)).filter(Boolean),store:(Array.isArray(x.store)?x.store:[]).slice(0,20).map(t=>str(t,300)).filter(Boolean)})).filter(x=>x.steps.length);
  return{days,slots,shop,plan,recipes:(Array.isArray(o.recipes)?o.recipes:[]).slice(0,60).map(recSan).filter(Boolean)}}
const recByName=n=>{const k=deacc(n);return(S.recipes||[]).find(r=>deacc(r.name)===k||r.aliases.some(a=>deacc(a)===k))};
async function menuImport(m){closeModal();const cur=menuActive();
  if(cur&&cur.slots.some(x=>!x.log&&addDays(cur.start,x.d-1)>=today())&&!await ask(L('Az új menü lecseréli a mostanit. A már rögzített étkezéseid megmaradnak.','The new menu replaces the current one. Meals you already logged stay.'),{title:L('Új heti menü','New weekly menu'),ok:L('Csere','Replace')}))return;
  if(m.recipes.length)importRecipes(m.recipes);
  const w=S.settings.cWait,start=w&&DATE_RE.test(w.start)?w.start:(S.settings.menuStartNext||today());
  S.menu={start,days:m.days,prep:!!(w&&w.prep),people:fprefs().people,shop:m.shop,plan:m.plan.map(x=>Object.assign(x,{d:!(w&&w.prep)&&x.d<1?1:x.d,rids:x.recipes.map(n=>(recByName(n)||{}).id||null)})),slots:m.slots.map(x=>{const r=recByName(x.name);return{d:x.d,meal:x.meal,rid:r?r.id:null,name:r?r.name:x.name,cook:x.cook&&x.cook>0?Math.round(x.cook*10)/10:0,log:null}}).sort((a,b)=>a.d-b.d||REC_MEAL.findIndex(y=>y[0]===a.meal)-REC_MEAL.findIndex(y=>y[0]===b.meal)),at:Date.now()};
  delete S.settings.cWait;save();goFrom('menu');toast(L(`Heti menü mentve${m.recipes.length?`, ${m.recipes.length} recept a Receptjeim közé`:''}`,`Weekly menu saved${m.recipes.length?`, ${m.recipes.length} recipe${m.recipes.length>1?'s':''} added to My recipes`:''}`))}
function menuActive(){const m=S.menu;return m&&m.slots&&m.slots.length&&addDays(m.start,m.days-1)>=today()?m:null}
const MEAL_OF={breakfast:'reggeli',lunch:'ebed',dinner:'vacsora',snack:'uzsonna'};
const slotDate=(m,x)=>addDays(m.start,x.d-1);
function menuDayRows(m,date,compact){const xs=m.slots.map((x,i)=>[x,i]).filter(([x])=>slotDate(m,x)===date);if(!xs.length)return'';const canLog=date<=today();
  return xs.map(([x,i])=>{const r=x.rid&&(S.recipes||[]).find(y=>y.id===x.rid),logged=x.log&&S.meals.some(y=>y.id===x.log);
    const pp=m.people||1,meta=[lblL(REC_MEAL,x.meal),!x.name?'':x.cook?L(`főzés: ${fmt(x.cook,0)} adag`,`cook ${fmt(x.cook,0)} servings`)+(pp>1?L(` (${pp} főre)`,` (for ${pp})`):''):L('maradék','leftovers'),r&&r.kcal!=null&&!compact?`${fmt(r.kcal,0)} kcal`:''].filter(Boolean).join(' · ');
    if(!x.name)return compact?'':`<div class="mrow"><button class="mname" data-click="menuSwap(${i})"><span class="small mut" style="display:block">${lblL(REC_MEAL,x.meal)}</span><span class="rn" translate="no" style="color:var(--kj-blue-line)">${I('plus','sm')} ${L('Recept választása','Choose a recipe')}</span></button></div>`;
    return`<div class="mrow${logged?' done':''}"><button class="mname" ${r?`data-click="openRecipe('${r.id}')"`:'disabled'}><span class="rn" translate="no">${esc(x.name)}</span><span class="small mut" style="display:block">${meta}</span></button>${!compact&&!logged&&date>=today()?`<button class="btn sm ico" data-click="menuSwap(${i})" aria-label="${L('Csere saját receptre','Swap for one of my recipes')}">${I('arrow-left-right','sm')}</button>`:''}${canLog&&r?`<button class="btn sm${logged?' p':''}" data-click="menuLog(${i})" aria-pressed="${!!logged}" aria-label="${logged?L('Rögzítve – visszavonás','Logged – undo'):L('Rögzítés','Log')}">${logged?I('check','sm'):I('plus','sm')+' '+((m.people||1)>1?L('1 adag','1 serving'):L('Rögzítés','Log'))}</button>`:''}</div>`}).join('')}
/* Menü szerkesztése: csere a saját receptekre (azonos étkezéstípus), saját menü összeállítása */
let swapI=-1,swapQ='',swapAll=true,swapAny=false;
const sameDish=(a,b)=>a.rid&&b.rid?a.rid===b.rid:deacc(a.name)===deacc(b.name);
function menuSwap(i){const m=S.menu;if(!m||!m.slots[i])return;swapI=i;swapQ='';swapAny=false;swapAll=true;renderSwap()}
function renderSwap(){const m=S.menu,x=m.slots[swapI],rs=S.recipes||[];if(!x)return;
  const toks=deacc(swapQ).split(/\s+/).filter(Boolean),fit=rs.filter(r=>r.meal.includes(x.meal));
  const base=swapAny||!fit.length?rs:fit,l=base.filter(r=>r.vote!==-1&&recMatch(r,toks)&&r.id!==x.rid).sort((a,b)=>(b.vote-a.vote)||a.name.localeCompare(b.name,'hu'));
  const same=x.name?m.slots.filter(y=>sameDish(y,x)&&!y.log&&slotDate(m,y)>=today()).length:0;
  openModal(`<h2 style="margin-bottom:4px">${x.name?L('Csere saját receptre','Swap for my recipe'):L('Recept választása','Choose a recipe')}</h2><div class="small mut">${lblL(REC_MEAL,x.meal)} · ${fmtDate(slotDate(m,x))}${x.name?' · '+esc(x.name):''}</div>
  ${same>1?`<div class="seg mftabs" role="group" style="margin-top:12px"><button class="${swapAll?'on':''}" data-click="swapMode(1)">${L(`Minden előfordulás (${same})`,`All occurrences (${same})`)}</button><button class="${swapAll?'':'on'}" data-click="swapMode(0)">${L('Csak ez','Just this')}</button></div>`:''}
  <input id="swq" type="search" autocomplete="off" style="margin-top:12px" placeholder="${L('Keresés a receptjeim között','Search my recipes')}" value="${esc(swapQ)}" data-input="swapSearch(this.value)">
  ${fit.length&&fit.length<rs.length?`<label class="ckrow" style="margin-top:8px"><input type="checkbox" ${swapAny?'checked':''} data-change="swapAnyT()"> <span class="small">${L('Más étkezéshez mentett receptek is','Include recipes saved for other meals')}</span></label>`:''}
  <div id="swl" class="card reclist" style="margin-top:10px;max-height:46dvh;overflow:auto">${swapList(l)}</div>
  <div class="row" style="margin-top:12px">${x.name&&m.manual?`<button class="btn d" data-click="swapClear()">${L('Hely ürítése','Clear slot')}</button>`:''}<span class="sp"></span><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button></div>`)}
function swapList(l){return l.length?l.slice(0,80).map(r=>`<button class="recrow" data-click="swapGo('${r.id}')"><span style="flex:1;min-width:0"><span class="rn" translate="no">${esc(r.name)}</span><span class="rm">${r.kcal!=null?`<span>${fmt(r.kcal,0)} kcal</span>`:''}${r.time?`<span>${r.time} ${L('perc','min')}</span>`:''}${r.vote===1?`<span class="rv">${I('thumbs-up','sm')}</span>`:''}</span></span></button>`).join(''):`<div class="hint" style="padding:14px 16px;margin:0">${(S.recipes||[]).length?L('Nincs találat.','No match.'):L('Még nincs mentett recepted.','No saved recipes yet.')}</div>`}
function swapSearch(v){swapQ=v;const m=S.menu,x=m.slots[swapI],rs=S.recipes||[],toks=deacc(v).split(/\s+/).filter(Boolean),fit=rs.filter(r=>r.meal.includes(x.meal)),base=swapAny||!fit.length?rs:fit;
  const b=$('#swl');if(b)b.innerHTML=swapList(base.filter(r=>r.vote!==-1&&recMatch(r,toks)&&r.id!==x.rid).sort((a,c)=>(c.vote-a.vote)||a.name.localeCompare(c.name,'hu')))}
function swapMode(v){swapAll=!!v;renderSwap()}
function swapAnyT(){swapAny=!swapAny;renderSwap()}
// főzési adagszám újraszámolása az érintett ételeknél: az első előfordulásnál főzzük az összes előfordulás × fő adagot
function recalcCook(m,keys){const pp=m.people||1;for(const k of keys){if(!k)continue;const xs=m.slots.filter(y=>(y.rid||('n:'+deacc(y.name)))===k&&y.name);xs.forEach((y,j)=>y.cook=j===0?xs.length*pp:0)}}
function menuDirty(m,oldName,newName){m.shopStale=true;for(const p of m.plan||[]){const j=p.recipes.findIndex(n=>deacc(n)===deacc(oldName));if(j>=0){p.recipes[j]=newName||p.recipes[j];if(p.rids)p.rids[j]=null;p.stale=true}}}
function swapGo(rid){const m=S.menu,x=m&&m.slots[swapI],r=(S.recipes||[]).find(y=>y.id===rid);if(!x||!r)return;
  const oldKey=x.rid||(x.name?'n:'+deacc(x.name):''),oldName=x.name;
  const tg=x.name&&swapAll?m.slots.filter(y=>sameDish(y,x)&&!y.log&&slotDate(m,y)>=today()):[x];
  for(const y of tg){y.rid=r.id;y.name=r.name;y.cook=0}
  if(m.manual)recalcCook(m,[oldKey,r.id]);
  else{// a Claude-menü főzési adagjait megtartjuk: a cserélt helyek külön főzést kapnak, a régi étel maradék helyei igazodnak
    tg[0].cook=tg.length*(m.people||1);const rest=m.slots.filter(y=>y.name&&(y.rid||('n:'+deacc(y.name)))===oldKey);
    if(rest.length&&!rest.some(y=>y.cook>0))recalcCook(m,[oldKey]);
    else if(rest.length){const c=rest.find(y=>y.cook>0);c.cook=Math.max(m.people||1,c.cook-tg.length*(m.people||1))}}if(oldName)menuDirty(m,oldName,r.name);else m.shopStale=true;save();closeModal();render();toast(L('Menü módosítva','Menu updated'))}
function swapClear(){const m=S.menu,x=m&&m.slots[swapI];if(!x)return;const k=x.rid||('n:'+deacc(x.name)),old=x.name;x.rid=null;x.name='';x.cook=0;recalcCook(m,[k]);menuDirty(m,old,'');save();closeModal();render()}
async function menuManualNew(){const o=menuOpt(),cur=menuActive();
  if(cur&&!await ask(L('Az új menü lecseréli a mostanit. A már rögzített étkezéseid megmaradnak.','The new menu replaces the current one. Meals you already logged stay.'),{title:L('Saját heti menü','My own weekly menu'),ok:L('Csere','Replace')}))return;
  const start=menuStartDate(o.start),slots=[];for(let d=1;d<=o.days;d++)for(const meal of o.meals)slots.push({d,meal,rid:null,name:'',cook:0,log:null});
  S.menu={start,days:o.days,manual:true,people:fprefs().people,shop:[],plan:[],slots,at:Date.now()};save();closeModal();goFrom('menu');toast(L('Válassz receptet az üres helyekre','Pick recipes for the empty slots'))}
function menuLog(i){const m=S.menu,x=m&&m.slots[i];if(!x)return;const r=(S.recipes||[]).find(y=>y.id===x.rid);if(!r)return;
  if(x.log&&S.meals.some(y=>y.id===x.log)){S.meals=S.meals.filter(y=>y.id!==x.log);x.log=null;save();render();toast(L('Rögzítés visszavonva','Log undone'));return}
  const id=uid();S.meals.push({id,date:slotDate(m,x),meal:MEAL_OF[x.meal]||'ebed',name:(r.name+' '+L('1 adag','1 serving')).slice(0,100),kcal:Math.round(r.kcal||0),p:r.p||0,c:r.c||0,f:r.f||0,fib:r.fib});x.log=id;save();render();toast(L('Rögzítve','Logged'))}
/* Főzőnapi útmutató: a Claude cookplan-je; a 0. nap a menü előtti vasárnapi előfőzés */
const planDate=(m,x)=>addDays(m.start,x.d-1);
function cookLine(m,date){const i=(m.plan||[]).findIndex(x=>planDate(m,x)===date);if(i<0)return'';const x=m.plan[i];
  return`<button class="cookln" data-click="cookDay(${i})"><span class="cwi">${I('cooking-pot','sm')}</span><span style="flex:1;min-width:0;text-align:left"><b>${date===today()?L('Ma főzés','Cooking today'):L('Főzés','Cooking')}${x.time?` · ${L('kb.','approx.')} ${fmtMin(x.time)}`:''}</b><span class="small mut" style="display:block">${esc(x.recipes.join(', '))}</span></span>${I('chevron-right','sm')}</button>`}
const fmtMin=n=>n>=60?(Math.floor(n/60)+L(' óra',' h')+(n%60?' '+(n%60)+L(' perc',' min'):'')):n+L(' perc',' min');
function cookDay(i){const m=menuActive(),x=m&&m.plan&&m.plan[i];if(!x)return;const date=planDate(m,x),wd=pYmd(date).toLocaleDateString(LOC(),{weekday:'long',month:'short',day:'numeric'});
  openModal(`<h2 style="margin-bottom:4px">${I('cooking-pot','sm')} ${L('Főzőnap','Cooking day')}</h2><div class="small mut">${esc(wd)}${x.d===0?' · '+L('előfőzés a hétre','prep for the week'):''}${x.time?` · ${L('kb.','approx.')} ${fmtMin(x.time)}`:''}</div>
  <div class="grp" style="margin-top:14px">${L('Receptek','Recipes')}</div><div class="card reclist" style="margin-bottom:12px">${x.recipes.map((n,j)=>{const r=(x.rids&&x.rids[j]&&(S.recipes||[]).find(y=>y.id===x.rids[j]))||recByName(n);return r?`<button class="recrow" data-click="openRecipe('${r.id}')"><span class="rn" translate="no" style="flex:1;min-width:0">${esc(r.name)}</span><span class="mut">${I('chevron-right','sm')}</span></button>`:`<div class="recrow"><span class="rn" translate="no">${esc(n)}</span></div>`}).join('')}</div>
  ${x.stale?`<div class="hint">${L('A menüt módosítottad: a lépések még a csere előtti receptekre szólnak.','You changed the menu: the steps still refer to the recipes before the swap.')}</div>`:''}
  <div class="grp">${L('Menet','Plan')}</div><ol class="steps">${x.steps.map(t=>`<li>${esc(t.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>
  ${x.store.length?`<div class="grp">${L('Tárolás','Storage')}</div><ul class="recing" style="padding-left:18px">${x.store.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
function todayMenuCard(date,inCard){const m=menuActive();if(!m)return'';const rows=menuDayRows(m,date,true),ck=cookLine(m,date);if(!rows&&!ck)return'';
  return inCard?`<div class="tmenu"><div class="hk" style="margin-bottom:6px">${L('Mai menü','Today’s menu')}</div>${ck}${rows}</div>`:`<div class="card tmc"><div class="row" style="flex-wrap:nowrap;margin-bottom:6px"><h2 style="flex:1;margin:0;font-size:17px">${date===today()?L('Mai menü','Today’s menu'):L('Menü erre a napra','Menu for this day')}</h2><button class="linkbtn" style="width:auto;padding:0" data-click="goFrom('menu')">${L('Heti menü','Weekly menu')} ${I('chevron-right','sm')}</button></div>${ck}${rows}</div>`}
function vMenu(){const m=menuActive(),t=targets();
  if(!m)return`<div class="card"><h2 style="margin-top:0">${L('Nincs aktív heti menü','No active weekly menu')}</h2><div class="small mut" style="margin-bottom:12px">${L('Claude a kereted, a preferenciáid és a kedvenc receptjeid alapján összeállít egy menüt, amelyből az app bevásárlólistát készít.','Claude builds a menu from your target, preferences and favourite recipes, and the app turns it into a shopping list.')}</div><button class="btn p block" data-click="menuReqBox()">${I('calendar-days','sm')} ${L('Heti menü kérése','Request a weekly menu')}</button></div>`;
  const end=addDays(m.start,m.days-1),prepN=m.prep&&!(m.plan&&m.plan.length)?[...new Set(m.slots.filter(x=>x.d===1&&x.cook&&(x.meal==='lunch'||x.meal==='dinner')).map(x=>x.name))]:[];
  let h=`<div class="card"><div class="small mut">${fmtDate(m.start)} – ${fmtDate(end)} · ${L(`${m.days} nap`,`${m.days} days`)}</div>${(m.people||1)>1?`<div class="hint" style="margin-top:8px">${L(`${m.people} főre főzöl: a főzés és a bevásárlólista ${m.people} főre szól, a kalória és a Rögzítés a te 1 adagodra.`,`You cook for ${m.people}: cooking and the shopping list are for ${m.people}, calories and Log are for your 1 serving.`)}</div>`:''}${prepN.length?`<div class="hint" style="margin-top:8px">${I('cooking-pot','sm')} ${L('Vasárnapi főzés','Sunday prep')} (${fmtDate(addDays(m.start,-1))}): <b>${prepN.map(esc).join(', ')}</b></div>`:''}
  ${m.manual&&m.slots.some(x=>!x.name)?`<div class="hint" style="margin-top:8px">${L(`Saját menü: ${m.slots.filter(x=>!x.name).length} hely vár receptre. Ugyanazt a receptet több napra is választhatod; az első napon főzöd, utána maradék.`,`Own menu: ${m.slots.filter(x=>!x.name).length} slots need a recipe. You can pick the same recipe for several days; you cook it on the first day, then it’s leftovers.`)}</div>`:''}
  <div class="row" style="gap:8px;margin-top:12px;flex-wrap:nowrap"><button class="btn p" style="flex:1 1 0;min-width:0" data-click="menuToShop()">${I('shopping-basket','sm')} ${L('Bevásárlólista','Shopping list')}</button><button class="btn" style="flex:1 1 0;min-width:0" data-click="menuReqBox()">${I('calendar-days','sm')} ${L('Új menü','New menu')}</button><button class="btn ico d" data-click="menuDel()" aria-label="${L('Menü törlése','Delete menu')}">${I('trash-2','sm')}</button></div></div>`;
  if(m.plan&&m.plan.length)h+=`<div class="grp">${L('Főzőnapok','Cooking days')}</div><div class="card reclist">${m.plan.map((x,i)=>{const dt=planDate(m,x),wd=pYmd(dt).toLocaleDateString(LOC(),{weekday:'long',month:'short',day:'numeric'});return`<button class="recrow" data-click="cookDay(${i})"><span class="cwi">${I('cooking-pot','sm')}</span><span style="flex:1;min-width:0"><span class="rn" translate="no">${esc(wd)}${dt===today()?' · '+L('ma','today'):''}</span><span class="rm"><span>${esc(x.recipes.join(', '))}</span>${x.time?`<span>${I('timer','sm')}${fmtMin(x.time)}</span>`:''}</span></span><span class="mut">${I('chevron-right','sm')}</span></button>`}).join('')}</div>`;
  for(let d=1;d<=m.days;d++){const date=addDays(m.start,d-1),rows=menuDayRows(m,date,false);if(!rows)continue;
    const kc=m.slots.filter(x=>x.d===d).reduce((a,x)=>{const r=x.rid&&(S.recipes||[]).find(y=>y.id===x.rid);return a+(r&&r.kcal||0)},0),wd=pYmd(date).toLocaleDateString(LOC(),{weekday:'long',month:'short',day:'numeric'});
    h+=`<div class="grp${date===today()?' today':''}">${date===today()?L('Ma','Today')+' · ':''}${esc(wd)}${kc?` <span class="mono small">${fmt(kc,0)}${t.kcal?' / '+fmt(t.kcal,0):''} kcal</span>`:''}</div><div class="card reclist">${rows}</div>`}
  return h}
async function menuDel(){if(!await ask(L('Törlöd a heti menüt? A receptek és a rögzített étkezések megmaradnak.','Delete the weekly menu? Recipes and logged meals stay.'),{title:L('Heti menü törlése','Delete weekly menu'),ok:L('Törlés','Delete'),danger:true}))return;S.menu=null;S.shop=(S.shop||[]).filter(x=>x.rid!=='rmenu');save();render()}
function menuToShop(){const m=menuActive();if(!m)return;S.shop=(S.shop||[]).filter(x=>x.rid!=='rmenu');let n=0;const rn=L('Heti menü','Weekly menu');
  // ha a Claude adott összevont listát, azt használjuk (érti, hogy a két 2%-os joghurt ugyanaz); különben receptenként számolunk
  if(m.shop&&m.shop.length&&!m.shopStale){for(const x of m.shop){const it=shopItem(x.n,x.q,x.u,{rid:'rmenu',rn,pack:x.pack||'',pantry:x.pantry});it.n=x.n.slice(0,80);if(x.cat)it.cat=x.cat;S.shop.push(it);n++}save();openShop();return}
  for(const x of m.slots){if(!x.cook||slotDate(m,x)<today())continue;const r=(S.recipes||[]).find(y=>y.id===x.rid);if(!r)continue;const k=x.cook/r.serv;
    for(const i of r.ing){S.shop.push(shopItem(i.n,i.q!=null?i.q*k:null,i.u,Object.assign({rid:'rmenu',rn},i.cat?{cat:i.cat}:{})));n++}}
  save();if(!n){toast(L('A menü receptjeiben nincs hozzávaló','The menu’s recipes have no ingredients'));return}openShop()}
function menuReqBox(){if(!targets().kcal){toast(L('Előbb töltsd ki a profilodat','Fill in your profile first'));return}const o=menuOpt();
  const sel=(id,k,opts)=>`<select id="${id}" data-change="menuOptSet('${k}',this.value)">${opts.map(([v,l])=>`<option value="${v}" ${String(o[k])===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
  openModal(`<div class="row" style="flex-wrap:nowrap"><h2 style="flex:1;margin:0">${L('Heti menü Claude-dal','Weekly menu with Claude')}</h2><button class="btn sm ico" data-click="fbGo('prefs')" aria-label="${L('Étkezési preferenciák','Food preferences')}">${I('settings','sm')}</button></div>
  <div class="hint">${L('A kérésbe bekerül a kereted, az étkezési preferenciáid és a kedvenc receptjeid. A válasz kódblokkját a felső sáv Beillesztés gombjával veheted át.','Your target, food preferences and favourite recipes go into the request. Paste the reply’s code block with the Paste button in the top bar.')}</div>
  <div class="grid2"><div><label for="mos">${L('Kezdőnap','Start')}</label>${sel('mos','start',[['today',L('Ma','Today')],['tomorrow',L('Holnap','Tomorrow')],['week',L('Jövő hét','Next week')]])}</div>
  <div><label for="mod">${L('Hány napra','Days')}</label>${sel('mod','days',[[3,'3'],[5,'5'],[7,'7']])}</div></div>
  <label for="mop">${L('Hány főre főzöl és vásárolsz?','How many people do you cook and shop for?')}</label><select id="mop" data-change="setFPref('people',this.value)">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${fprefs().people===n?'selected':''}>${n===1?L('1 fő (csak magamra)','1 (just me)'):L(`${n} fő`,`${n} people`)}</option>`).join('')}</select>
  <div class="hint">${L('Te mindig 1 adagot eszel: a kalória és a Rögzítés erre vonatkozik, a főzés és a bevásárlás az összes főre.','You always eat 1 serving: calories and Log refer to that, cooking and shopping to everyone.')}</div>
  <label for="moc">${L('Hány napon tudsz főzni egy héten?','How many days a week can you cook?')}</label>${sel('moc','cook',[[1,L('1 napon','1 day')],[2,L('2 napon','2 days')],[3,L('3 napon','3 days')],[7,L('Minden nap','Every day')]])}
  <div class="hint" id="mocHint">${menuCookHint(o)}</div>
  <label>${L('Étkezések','Meals')}</label><div class="chips" style="margin:0">${REC_MEAL.map(([k,h,e])=>`<button class="chip${o.meals.includes(k)?' on':''}" data-click="menuOptMeal('${k}')" aria-pressed="${o.meals.includes(k)}">${LANG==='en'?e:h}</button>`).join('')}</div>
  <div class="row" style="margin-top:16px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" data-click="menuGo()">${I('external-link','sm')} ${L('Megnyitás Claude-ban','Open in Claude')}</button></div>
  ${(S.recipes||[]).length?`<button class="linkbtn" style="margin-top:10px" data-click="menuManualNew()">${I('list-plus','sm')} ${L('Inkább összeállítom a receptjeimből','I’d rather put it together from my recipes')}</button>`:''}`)}
function menuCookHint(o){const cd=menuCookDays(o);if(!cd)return L('Minden nap főzöl, maradékkal ott, ahol egy étel két napra is jó.','You cook every day, with leftovers where a dish lasts two days.');
  const wd=d=>pYmd(addDays(menuStartDate(o.start),d-1)).toLocaleDateString(LOC(),{weekday:'long'});
  return L('Főzés: ','Cooking: ')+cd.map(a=>a[0]===0?L('vasárnap (előfőzés)','Sunday (prep)'):a.map(wd).join(L(' vagy ',' or '))).join(', ')+(o.days<=3&&o.cook>1?L(' – 3 napra egy főzés elég',' – one cooking session is enough for 3 days'):'')+L('. A többi napon maradék.','. Leftovers on the other days.')}
function menuOptSet(k,v){const o=menuOpt();o[k]=k==='start'?v:parseInt(v)||o[k];S.settings.menuOpt=o;save();const h=$('#mocHint');if(h)h.textContent=menuCookHint(menuOpt())}
function menuOptMeal(k){const o=menuOpt(),a=new Set(o.meals);a.has(k)?a.size>1&&a.delete(k):a.add(k);o.meals=REC_MEAL.map(x=>x[0]).filter(x=>a.has(x));S.settings.menuOpt=o;save();menuReqBox()}
function menuGo(){const o=menuOpt(),start=menuStartDate(o.start),prep=o.start==='week'&&o.cook<7;if(!recRoom(12))return;claudeGo('menu',menuPrompt('week',{start,prep}),prep?{start,prep:true}:{start})}
function claudeBox(){const k=!!targets().kcal,url=S.settings.claudeUrl;
  openModal(`<h2>${L('Rögzítés Claude-dal','Logging with Claude')}</h2>
  <ol class="steps"><li>${L('Nyisd meg a Claude-projektedet, és fotózd le vagy írd le, mit ettél.','Open your Claude project and photograph or describe what you ate.')}</li><li>${L('Másold ki a válasz végén lévő kódblokkot (a sarkában lévő gombbal).','Copy the code block at the end of the reply (with the button in its corner).')}</li><li>${L('Gyere vissza, és nyomd meg a <b>Beillesztés</b> gombot (itt vagy a felső sávban).','Come back and tap <b>Paste</b> (here or in the bar at the top).')}</li></ol>
  ${url?'':`<div class="hint">${k?L('Még nincs beállítva a Claude-projekted. Az útmutató lépésről lépésre végigvezet a létrehozásán.','Your Claude project isn’t set up yet. The guide walks you through it.'):L('A Claude-projekt útmutatója a profil kitöltése után érhető el, mert a napi célok is belekerülnek.','The Claude project guide is available after you fill in your profile, as your daily targets go into it.')}</div>`}
  <div class="stack" style="margin-top:14px">${url?`<button class="btn p block" data-click="claudeGo('meals')">${I('external-link','sm')} ${L('Megnyitás Claude-ban','Open in Claude')}</button><button class="btn block" data-click="claudePaste()">${I('clipboard-paste','sm')} ${L('Beillesztés','Paste')}</button>`:''}
  <button class="btn block${url?'':' p'}" data-click="fbGo('help')" ${k?'':'disabled'}>${I('circle-help','sm')} ${url?L('Útmutató és projekt-utasítás','Guide and project instructions'):L('Claude-projekt beállítása','Set up a Claude project')}</button></div>
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn" data-click="closeModal()">${L('Bezárás','Close')}</button></div>`)}
/* ===== Egységes Claude-kezelés: egy gomb másol és megnyit; az app megjegyzi, mire vár; egy Beillesztés mindent felismer ===== */
const CW_KIND={meals:['ételnaplót','a food log'],ideas:['receptötleteket','recipe ideas'],menu:['heti menüt','a weekly menu'],plan:['edzéstervet','a training plan']};
function claudeReady(){if(S.settings.claudeUrl)return true;closeModal();if(targets().kcal){toast(L('Előbb hozd létre a Claude-projektedet','Set up your Claude project first'));foodHelp()}else{toast(L('Előbb töltsd ki a profilodat','Fill in your profile first'));openSub('profile')}return false}
function claudeGo(kind,txt,extra){if(!claudeReady())return;
  // a másolást és a megnyitást ugyanabban a koppintásban indítjuk, különben a böngésző letilthatja
  if(txt){try{navigator.clipboard.writeText(txt).then(()=>toast(L('Kérés a vágólapon – illeszd be a Claude-ba','Request copied – paste it into Claude')),()=>toast(L('A másolás nem sikerült','Copy failed')))}catch(e){}}
  claudeOpen(S.settings.claudeUrl);
  if(CW_KIND[kind]){S.settings.cWait=Object.assign({k:kind,at:Date.now()},extra||{});save()}
  closeModal();render()}
/* A Claude-lapot névvel nyitjuk, hogy a „Vissza a Claude-hoz” gomb ugyanarra a lapra (a folyamatban lévő csevegésre) vigyen vissza */
const CL_WIN='olupan_claude';
function claudeOpen(url){try{const w=window.open(url,CL_WIN);if(w)try{w.opener=null}catch(e){}}catch(e){}}
function claudeBack(){const url=S.settings.claudeUrl;if(!url)return;let w=null;try{w=window.open('',CL_WIN)}catch(e){}
  if(!w){try{window.open(url,'_blank','noopener')}catch(e){}return}
  let blank=false;try{blank=w.location.href==='about:blank'}catch(e){blank=false}
  if(blank){try{w.opener=null}catch(e){}w.location.href=url}try{w.focus()}catch(e){}}
function claudeWait(){const w=S.settings.cWait;return w&&CW_KIND[w.k]&&Date.now()-w.at<48*3600e3?w:null}
function claudeWaitOff(){delete S.settings.cWait;save();render()}
function claudeBar(){const w=claudeWait();if(!w)return'';const k=CW_KIND[w.k];
  return`<div class="cwbar"><span class="cwi">${I('sparkles','sm')}</span><span style="min-width:0"><b class="small">${L(`Claude-tól ${k[0]} vársz`,`Waiting for ${k[1]} from Claude`)}</b><span class="small mut" style="display:block">${L('Másold ki a válasz kódblokkját, majd illeszd be.','Copy the reply’s code block, then paste it.')}</span></span><span class="cwbtns">${S.settings.claudeUrl?`<button class="btn sm" data-click="claudeBack()">${I('external-link','sm')} ${L('Vissza a Claude-hoz','Back to Claude')}</button>`:''}<button class="btn sm p" data-click="claudePaste()">${I('clipboard-paste','sm')} ${L('Beillesztés','Paste')}</button></span><button class="cwx" data-click="claudeWaitOff()" aria-label="${L('Elrejtés','Dismiss')}">${I('x','sm')}</button></div>`}
async function claudePaste(){let t='';try{if(navigator.clipboard&&navigator.clipboard.readText)t=await navigator.clipboard.readText()}catch(e){t=''}
  if(!claudeHandle(t))claudePasteBox(t.trim()?L('A vágólapon nem találtam Olupan-tartalmat. Ellenőrizd, hogy a kódblokkot másoltad-e ki.','I found no Olupan content on the clipboard. Check that you copied the code block.'):'')}
function claudePasteBox(msg){openModal(`<h2>${I('clipboard-paste','sm')} ${L('Beillesztés','Paste')}</h2>${msg?`<div class="hint" style="margin-top:0">${msg}</div>`:''}
  <label for="cpta">${L('Claude válaszának kódblokkja vagy egy kapott Olupan-link','The code block from Claude’s reply, or an Olupan link you received')}</label><textarea id="cpta" rows="6" class="mono" style="font-size:12px" placeholder="${L('Nyomd hosszan, majd Beillesztés','Long-press, then Paste')}"></textarea>
  <div class="hint">${L('Felismeri az ételnaplót, a recepteket, a heti menüt, az edzéstervet és a megosztott linket.','It recognises food logs, recipes, weekly menus, training plans and shared links.')}</div>
  <div class="row" style="margin-top:12px">${canScan()?`<button class="btn" data-click="openScanner()">${I('scan-barcode','sm')} ${L('QR-kód','QR code')}</button>`:''}<span class="sp"></span><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><button class="btn p" data-click="claudePasteTa()">${L('Feldolgozás','Process')}</button></div>`)}
function claudePasteTa(){const t=($('#cpta')||{}).value||'';if(!claudeHandle(t))toast(L('Nem ismertem fel a tartalmat','Content not recognised'))}
function claudeHandle(t){t=String(t||'');if(!t.trim())return false;
  const done=()=>{delete S.settings.cWait;save()};
  const hi=t.indexOf('#i=1.');if(hi>=0){done();closeModal();shareImportText(t.slice(hi).trim());return true}
  // a Claude kódblokk-másoló gombja a ```olupan-menu címkét nem másolja, ezért a JSON alakjából is felismerjük
  if(/olupan-menu|"slots"\s*:/.test(t)){const m=parseMenu(t);if(m){menuImport(m);return true}}
  if(/olupan-recipes|"ingredients"\s*:/.test(t)){const rl=parseRecipes(t);if(rl&&rl.length){done();recDone(rl);return true}}
  if(/(^|\n)\s*(SABLON|TEMPLATE)\s*;/i.test(t)){const P=parsePlan(t);if(P.tpls.length){done();closeModal();pastePlanGo(P);return true}}
  if(parseMeals(t,foodDate).length){done();closeModal();pasteMealsGo(t);return true}
  return false}
/* „Mit egyek még ma?”: a válasz csak olvasnivaló, beillesztés nincs */
function restBox(){if(!targets().kcal){toast(L('Előbb töltsd ki a profilodat','Fill in your profile first'));return}
  openModal(`<h2>${L('Mit egyek még ma?','What should I eat for the rest of today?')}</h2><div class="hint" style="margin-top:-4px">${L('Claude a mai maradék kereted szerint javasol, csak abból, amit itt megadsz. Legalább az egyiket töltsd ki.','Claude suggests within today’s remaining target, only from what you give here. Fill in at least one.')}</div>
  <label for="rhave">${L('Mi van kéznél?','What do you have at hand?')}</label><textarea id="rhave" rows="3" placeholder="${L('pl. tojás, túró, fagyasztott brokkoli, rizs, tonhalkonzerv','e.g. eggs, quark, frozen broccoli, rice, tinned tuna')}"></textarea>
  <label for="rwhere">${L('Hol vagy, mit tudsz venni? (nem kötelező)','Where are you, what can you buy? (optional)')}</label><input id="rwhere" placeholder="${L('pl. munkahely, Lidl a közelben','e.g. at work, Lidl nearby')}">
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" data-click="restGo()">${I('external-link','sm')} ${L('Megnyitás Claude-ban','Open in Claude')}</button></div>`)}
function restGo(){const have=(($('#rhave')||{}).value||'').trim().slice(0,500),where=(($('#rwhere')||{}).value||'').trim().slice(0,200);if(!have&&!where){toast(L('Írd be, mi van kéznél, vagy hol vagy','Enter what you have or where you are'));return}claudeGo('rest',menuPrompt('rest',{have,where}))}
function recIdeasGo(){if(!targets().kcal){toast(L('Előbb töltsd ki a profilodat','Fill in your profile first'));return}if(!recRoom(15))return;claudeGo('ideas',menuPrompt('ideas'))}
function vFood(){
  const t=targets(),items=dayMeals(foodDate),s=sumMeals(items),isToday=foodDate===today();
  let h=`<div class="card"><div class="row" style="flex-wrap:nowrap"><button class="iconbtn" data-click="foodNav(-1)" aria-label="Előző nap">${I('chevron-left')}</button>
  <input type="date" value="${foodDate}" max="${today()}" data-change="setFoodDate(this.value)" style="flex:1;text-align:center" aria-label="Nap">
  <button class="iconbtn" data-click="foodNav(1)" aria-label="Következő nap" ${isToday?'disabled style="opacity:.35"':''}>${I('chevron-right')}</button>${isToday?'':`<button class="btn sm" data-click="foodToday()">Ma</button>`}</div>
  <div style="margin-top:14px">${kcalViz(items,`<span class="hk">${isToday?'Ma':esc(pYmd(foodDate).toLocaleDateString(LOC(),{weekday:'long'}))}</span>`)}</div>
  ${!t.kcal?`<div class="hint" style="margin-top:12px">A javasolt napi bevitelhez töltsd ki a profilodat. A Claude-projekt útmutatója és a menüjavaslat csak utána érhető el, mert a napi célok is belekerülnek.</div><button class="linkbtn" style="padding-bottom:0" data-click="openSub('profile')">Profil kitöltése ${I('chevron-right','sm')}</button>`:''}</div>
  ${foodTiles()}${todayMenuCard(foodDate,false)}`;
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

When I send a photo of food, or describe what I ate:
1. Identify the foods and estimate the portions. If a portion or the preparation (oil, butter, sauce, sugar) is genuinely uncertain, ask briefly first – at most 2 questions. If I give grams, use them.
2. For each item, calculate energy (kcal), macros (protein, carbs, fat) and fiber, in grams. Use standard European nutrient values, and take into account whether the weight is raw or cooked. If the product variant matters (e.g. 0% vs full-fat Greek yoghurt, light vs regular sour cream) and I don't say, use the usual variant and state it in the name (e.g. Greek yoghurt 10% 150 g).
   Give carbohydrates as on EU labels, excluding fibre; calories: 4 × protein + 4 × carbs + 9 × fat + 2 × fibre.
   Alcohol: for alcoholic drinks, include the energy from alcohol in the calories (7 kcal/g; 1% ABV ≈ 0.79 g alcohol per 100 ml, e.g. 500 ml of 5% beer ≈ 20 g alcohol ≈ 140 kcal). Alcohol is not a macro and needs no column of its own, but it must be in the kcal.
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

Meal suggestions and menus: requests that start with "Meal suggestion" come from the Olupan app and contain my current daily targets, what I've eaten today and my food preferences. If I ask for a menu or meal idea WITHOUT these details, ask for them briefly or remind me to use the app's Weekly menu, Recipe ideas or What should I eat today? buttons – don't work from assumptions.
- Strictly respect the diet and the foods to avoid. If a preference makes the targets hard to meet, say so.
- Keep the daily total within ±10% of the energy target, and protein not below the target by more than 10%. Never suggest substantially less than the given target, and give no crash-diet, fasting or "compensation" tips. Be factual and non-judgemental.
- Always state the exact product variant (fat content, type – e.g. light sour cream, 2% Greek yoghurt, skinless chicken breast), because it matters a lot.
- ${t.goal==='lose'?'Since my goal is to lose weight, where a lower-energy variant of the same product exists (e.g. light sour cream, low-fat quark, yoghurt instead of cream), use it in the recipe and note the original in brackets. Weigh fats (oil, butter) in grams rather than "a splash". Don’t sacrifice flavour or fullness: save on amounts and variants, not on the food.':'If an ingredient has a lower-energy variant that suits the dish, mention it as an option. Weigh fats (oil, butter) in grams.'}
- For big-batch recipes (e.g. cooking for the week), say how big one portion is for my target (grams) and how many portions it makes.
- For each dish give: name, servings, time, difficulty, ingredients in grams (raw), numbered steps matched to my cooking level, and per-serving kcal, protein, carbs, fat and fiber. For make-ahead dishes, say how long they keep and how to store them.
- Unless the request says otherwise (e.g. recipe ideas only need a short list). Weekly menu: follow the rules in the request (number of cooking days, simple breakfasts and snacks, familiar dishes), plan batch cooking and leftovers, and reuse ingredients. The app builds the shopping list from the code block, so don't write one unless I ask. “What should I eat today?”: suggest only from what I have at hand or can buy where I am.
- If the request asks for an olupan-recipes or olupan-menu code block, give it exactly in the format described in the request, at the very end of the reply.
- Do NOT put meal suggestions in the logging code block – that is only for what I actually ate.`;
}
function claudeInstrHu(){
  const t=targets(),g=GOALS.find(x=>x[0]===t.goal)?.[1]||'Szinten tartás';
  return `Ez a projekt az étkezéseim naplózására szolgál az Olupan appban.

Amikor fotót küldök az ételről, vagy leírom/elmondom, mit ettem:
1. Azonosítsd az ételeket, és becsüld meg az adagokat. Ha egy adag vagy az elkészítés (olaj, vaj, szósz, cukor) érdemben bizonytalan, előbb kérdezz vissza röviden, legfeljebb 2 kérdéssel. Ha grammban megadom, azzal számolj.
2. Tételenként számold ki az energiát (kcal), a makrókat (fehérje, szénhidrát, zsír) és a rostot, grammban. Magyar/európai tápanyagértékekkel számolj, és vedd figyelembe, hogy nyers vagy főtt tömegről van-e szó. Ha a termék változata érdemben számít (pl. 12% vagy 20% tejföl, 0%-os vagy görög joghurt, sovány vagy zsíros túró) és nem mondom meg, a szokásos változattal számolj, és a megnevezésben jelöld (pl. Tejföl 20% 50 g).
   A szénhidrátot az EU-s címkék szerint rost nélkül add meg; a kalória: 4 × fehérje + 4 × szénhidrát + 9 × zsír + 2 × rost.
   Alkohol: alkoholos italnál a kalóriába számold bele az alkohol energiáját is (7 kcal/g; 1 tf% ≈ 0,79 g alkohol 100 ml-ben, pl. 5 dl 5%-os sör ≈ 20 g alkohol ≈ 140 kcal). Az alkohol nem makró, külön oszlopban nem kell megadni, de a kcal-ban benne legyen.
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

Menüjavaslat: a „Menüjavaslat” kezdetű kéréseket az Olupan app küldi, és benne van a napi keretem, az aznap már elfogyasztott étel és az étkezési preferenciáim. Ha ezek NÉLKÜL kérek menüt vagy ételötletet, röviden kérdezz rá, vagy emlékeztess, hogy használjam az app Heti menü, Receptötletek vagy Mit egyek még ma? gombját – ne feltételezésekből dolgozz.
- Az étrendet és a kerülendő összetevőket szigorúan tartsd be. Ha egy preferencia miatt a keret nehezen tartható, jelezd.
- A napi összeg az energiakerettől legfeljebb ±10%-kal térjen el, a fehérje legfeljebb 10%-kal maradjon el a céltól. Soha ne javasolj lényegesen kevesebbet a megadott keretnél, és ne adj villámdiétás, böjtölős vagy „kompenzáló” tanácsot. Tárgyilagosan, ítélkezés nélkül fogalmazz.
- A hozzávalóknál mindig add meg a pontos változatot (zsírtartalom, típus – pl. tejföl 12%, görög joghurt 2%, csirkemell bőr nélkül), mert ez sokat számít.
- ${t.goal==='lose'?'Mivel a célom a fogyás, ahol van ugyanannak a terméknek alacsonyabb energiatartalmú változata (pl. 12% tejföl 20% helyett, sovány túró, főzőtejszín helyett joghurt), azt írd a receptbe, és zárójelben jelezd az eredetit. A zsiradékot (olaj, vaj) mérd grammra, ne „egy löttyintésnyi” legyen. Az ízvilágot és a jóllakottságot ne áldozd fel: inkább a mennyiségen és a változaton spórolj, ne az ételen.':'Ha egy hozzávalónak van alacsonyabb energiatartalmú változata, és az illik az ételhez, említsd meg lehetőségként. A zsiradékot (olaj, vaj) mérd grammra.'}
- Nagy adagos (pl. egész hétre főzős) receptnél add meg, hogy az én keretemhez mekkora egy adag (gramm), és hány adag lesz belőle.
- Minden ételnél add meg: név, adagszám, idő, nehézség, hozzávalók grammban (nyers tömeg), a főzési gyakorlatomhoz illő számozott elkészítési lépések, és adagonként kcal, fehérje, szénhidrát, zsír és rost. Előre elkészíthető ételnél írd meg, meddig és hogyan tárolható.
- Mindez akkor, ha a kérés mást nem mond (pl. receptötleteknél elég a rövid lista). Heti menü: tartsd be a kérésben lévő szabályokat (főzőnapok száma, egyszerű reggeli és snack, ismert ételek), tervezz előre főzéssel és maradékokkal, és használd újra az összetevőket. A bevásárlólistát az app a kódblokkból állítja össze, ezért csak akkor írj, ha kérem. „Mit egyek még ma?”: csak abból javasolj, ami kéznél van, vagy ott megvehető, ahol vagyok.
- Ha a kérés olupan-recipes vagy olupan-menu kódblokkot kér, pontosan a kérésben leírt formátumban add meg, a válasz legvégén.
- A menüjavaslatot NE tedd a naplózó kódblokkba – az csak arra való, amit ténylegesen megettem.`;
}
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
  return `<div class="card" id="fprefs"><h2>Étkezési preferenciák</h2><div class="hint" style="margin-top:-4px">${L('A Heti menü, a Receptötletek és a Mit egyek még ma? kérés ezeket küldi el a Claude-projektednek, a kalóriakerettel együtt. Csak ezen a készüléken tárolódnak.','The Weekly menu, Recipe ideas and What else today? requests send these to your Claude project, together with your calorie target. They are stored only on this device.')}</div>
  <label>Étrend</label>${chips('diet',PREF_DIET)}
  <label for="favoid">Kerülendő összetevők</label><input id="favoid" maxlength="300" value="${esc(p.avoid)}" placeholder="${esc(L('pl. gomba, koriander, földimogyoró','e.g. mushrooms, coriander, peanuts'))}" data-change="setFPref('avoid',this.value)">
  <label>Konyha</label><div class="hint" style="margin:-2px 0 6px">Napi és heti menünél az app 1–2 konyhát választ ki véletlenszerűen a bejelöltek közül, hogy az alapanyagok átfedjenek. A receptötleteknél mindet használja.</div>${chips('cuisine',PREF_CUISINE)}
  <label>Stílus</label>${chips('style',PREF_STYLE)}
  <label for="fwish">Egyéb kívánság vagy stílus</label><input id="fwish" maxlength="300" value="${esc(p.wish)}" placeholder="${esc(L('pl. indiai jellegű, kóser, mediterrán','e.g. Indian-style, kosher, Mediterranean'))}" data-change="setFPref('wish',this.value)">
  <label for="fskill">Főzési gyakorlat</label><select id="fskill" data-change="setFPref('skill',this.value)">${PREF_SKILL.map(x=>`<option value="${x[0]}" ${p.skill===x[0]?'selected':''}>${esc(lbl(x))}</option>`).join('')}</select>
  <div class="grid2" style="gap:10px"><div><label for="fpeople">Hány főre főzöl</label><input id="fpeople" type="number" inputmode="numeric" min="1" max="8" value="${p.people}" data-change="setFPref('people',this.value)"></div>
  <div><label for="fmeals">Étkezés naponta</label><input id="fmeals" type="number" inputmode="numeric" min="1" max="6" value="${p.meals}" data-change="setFPref('meals',this.value)"></div></div>
  <label>Konyhai eszközeim</label><div class="hint" style="margin:-2px 0 6px">Jelöld be, ami van. Ha bármit bejelölsz, Claude csak ezekkel számol, és a többit nem használja.</div>${chips('eq',PREF_EQUIP)}
  <label for="fequip">Egyéb eszköz (nem kötelező)</label><input id="fequip" maxlength="300" value="${esc(p.equipment)}" placeholder="${esc(L('pl. wok, sous-vide, gofrisütő','e.g. wok, sous-vide, waffle maker'))}" data-change="setFPref('equipment',this.value)"></div>`}
function menuPrompt(kind,ex={}){
  const p=fprefs(),t=targets(),en=LANG==='en',lbl=x=>en?x[2]:x[1],td=today(),items=dayMeals(td),s=sumMeals(items);
  const mac=o=>`${fmt(o.kcal,0)} kcal, ${en?'protein':'fehérje'} ${fmt(o.p,0)} g, ${en?'carbs':'szénhidrát'} ${fmt(o.c,0)} g, ${en?'fat':'zsír'} ${fmt(o.f,0)} g, ${en?'fiber':'rost'} ${fmt(o.fib,0)} g`;
  const pick=(k,list)=>list.filter(x=>p[k].includes(x[0])).map(lbl).join(', ');
  const L2=(h,e)=>en?e:h,lines=[];
  const mo=menuOpt(),mStart=ex.start||today(),mDays=mo.days,dlab=d=>{const x=pYmd(d);return en?x.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'}):(x.getMonth()+1)+'.'+x.getDate()+'. '+x.toLocaleDateString('hu-HU',{weekday:'long'})};
  lines.push(kind==='ideas'?L2('Menüjavaslat – receptötletek','Meal suggestion – recipe ideas'):kind==='rest'?L2('Menüjavaslat – mit egyek még ma?','Meal suggestion – what should I eat for the rest of today?'):L2(`Menüjavaslat – heti menü (${mDays} nap, 1. nap: ${dlab(mStart)})`,`Meal suggestion – weekly menu (${mDays} days, day 1: ${dlab(mStart)})`));
  lines.push('');
  lines.push(t.kcal?L2('Napi keret: ','Daily target: ')+mac(t):L2('Napi keret: nincs megadva – kérdezz rá, mielőtt javasolsz.','Daily target: not set – ask me before suggesting.'));
  if(kind==='rest'){const now=new Date();
    lines.push(L2(`Ma (${td}, ${fmtTime(now)}) eddig: `,`Today (${td}, ${fmtTime(now)}) so far: `)+(items.length?mac(s):L2('még semmi','nothing yet')));
    if(items.length)lines.push(L2('Amit ma ettem: ','What I ate today: ')+items.slice(0,12).map(m=>m.name).join('; '));
    if(t.kcal)lines.push(L2('Még hátra: ','Remaining: ')+mac({kcal:Math.max(0,t.kcal-s.kcal),p:Math.max(0,t.p-s.p),c:Math.max(0,t.c-s.c),f:Math.max(0,t.f-s.f),fib:Math.max(0,t.fib-s.fib)}));
    if(ex.have)lines.push(L2('Ami kéznél van: ','What I have at hand: ')+ex.have);
    if(ex.where)lines.push(L2('Hol vagyok, mit tudok venni: ','Where I am / what I can buy: ')+ex.where);}
  if(kind==='ideas')lines.push(L2('Hány főre: ','Servings for: ')+p.people);
  if(kind==='week')lines.push(L2('Étkezések, amelyekre menü kell: ','Meals to plan: ')+REC_MEAL.filter(x=>mo.meals.includes(x[0])).map(x=>en?x[2].toLowerCase():x[1].toLowerCase()).join(', ')+' · '+(p.people>1?L2(`${p.people} főre főzök és vásárolok, én 1 adagot eszem`,`I cook and shop for ${p.people}, I eat 1 serving`):L2('1 főre főzök','I cook for 1'))+' · '+(mo.cook>=7?L2('minden nap főzök','I cook every day'):(n=>L2(`${n} alkalommal főzök`,`I cook ${n} time${n>1?'s':''}`))(menuCookDays(mo).length)));
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
  if(kind==='week'){const pd=[];for(let i=0;i<mDays;i++){const d=addDays(mStart,i),tp=plans()[d]&&S.templates.find(t=>t.id===plans()[d]);if(tp){const x=pYmd(d);pd.push(`${en?x.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}):x.toLocaleDateString('hu-HU',{weekday:'short'})+' '+(x.getMonth()+1)+'.'+x.getDate()+'.'} (${en?T(tp.name):tp.name})`)}}
    if(pd.length)lines.push(L2('Tervezett edzésnapok: ','Planned training days: ')+pd.join(', ')+L2(' – ezeken a napokon az edzés utáni étkezés legyen a nap fő szénhidrátforrása.',' – on these days make the post-workout meal the main carb source of the day.'));
    lines.push(L2('Szabályok a heti menühöz:','Rules for the weekly menu:'));
    lines.push(mo.cook>=7?L2('– Minden nap főzök: naponta egy főétel, hétköznap legfeljebb 30–40 perc munkával. Ha egy étel két napra is jó, nyugodtan tervezz maradékot.','– I cook every day: one main dish a day, at most 30–40 minutes of work on weekdays. If a dish works for two days, plan leftovers.')
      :L2(`– Főzőnapjaim: ${menuCookText(mo,L2,mStart)}. Alkalmanként 1–2 főételt főzök nagyobb adagban, a többi napon ezek maradékát eszem; ugyanaz az étel több napon, akár egy nap kétszer is előjöhet – ez szándékos. Figyelj arra, meddig áll el, és a reggeli és a snack kivételével máskor ne tervezz főzést.`,`– My cooking days: ${menuCookText(mo,L2,mStart)}. Each time I cook 1–2 main dishes in bigger batches and eat the leftovers on the other days; the same dish may repeat on several days, even twice a day – that’s intended. Mind how long things keep, and apart from breakfast and snacks don’t plan cooking on other days.`));
    if(mo.meals.includes('breakfast'))lines.push(L2('– Reggeli 2–3 egyszerű, ismert lehetőségből forogjon (pl. zabkása, rántotta, joghurt vagy túró gyümölccsel), legfeljebb 5–10 perc munkával.','– Breakfast rotates between 2–3 simple, familiar options (e.g. porridge, scrambled eggs, yoghurt or quark with fruit), 5–10 minutes of work at most.'));
    if(mo.meals.includes('snack'))lines.push(L2('– Snack főzés nélkül, ismert dolgokból (pl. alma dióval, túró, skyr, fehérjeturmix, zöldség hummusszal).','– Snacks need no cooking and use familiar foods (e.g. apple with walnuts, quark, skyr, protein shake, vegetables with hummus).'));
    {const rs=S.recipes||[],nm=a=>a.slice(0,30).map(r=>r.name).join('; '),fav=rs.filter(r=>r.vote===1),dis=rs.filter(r=>r.vote===-1),oth=rs.filter(r=>!r.vote);
     if(fav.length)lines.push(L2('– Kedvenc receptjeim, ezekből építs, ahol illenek: ','– My favourite recipes; build on these where they fit: ')+nm(fav));
     if(oth.length)lines.push(L2('– Egyéb mentett receptjeim (használhatod őket): ','– My other saved recipes (you may use them): ')+nm(oth));
     if(dis.length)lines.push(L2('– Ezeket ne javasold: ','– Don’t suggest these: ')+nm(dis));}
    lines.push(L2('– Ismert, hétköznapi ételek, kevés hozzávalóval, speciális technika nélkül. Ha valami ismeretlenebb, adj mellé ismerős alternatívát.','– Familiar everyday dishes with few ingredients and no special techniques. If something is less familiar, offer a familiar alternative.'));
    lines.push(L2('– A válasz: rövid áttekintés (naponként 1–2 mondat), a végén a kódblokk. A bevásárlólista és a főzőnapi útmutató a kódblokkba kerül, a szövegben ne ismételd meg őket.','– Reply with: a short overview (1–2 sentences per day), then the code block at the end. The shopping list and the cooking-day guide go into the code block; don’t repeat them in the text.'));}
  if(p.style.includes('handsoff'))lines.push(L2('Otthagyhatós: kevés aktív munka (befűszerezem, összekeverem, felteszem vagy beteszem a sütőbe, és magától elkészül) – a teljes idő lehet hosszabb. Mindegyiknél add meg az aktív és a teljes időt.','Hands-off: little active work (season, mix, put on the hob or in the oven and it cooks itself) – total time can be longer. Give active and total time for each.'));
  lines.push(kind==='ideas'?L2(`Adj 15 receptötletet az évszaknak (${lblL(REC_SEASON,curSeason()).toLowerCase()}) megfelelően: 2 reggelit, 3 meleg főételt, 2 könnyű vacsorát, 2 levest, 2 salátát, 1 hidegen fogyasztható, főzés nélkül is elkészíthető ételt, és 3 desszertet (fehérjebarát, ismert alapanyagokból, pl. túró, joghurt, gyümölcs, zab). Legyen köztük gyors is. Mindegyikhez: rövid leírás, aktív és teljes idő, becsült kcal és makrók adagonként.
A válasz végén add meg mind a 15-öt egy olupan-recipes kódblokkban, hozzávalókkal és rövid elkészítési lépésekkel, címkékkel és évszakkal, hogy elmenthessem őket az Olupan Receptjeim közé.
`+recipeFormat(L2),`Give me 15 recipe ideas suited to the season (${lblL(REC_SEASON,curSeason()).toLowerCase()}): 2 breakfasts, 3 warm main dishes, 2 light dinners, 2 soups, 2 salads, 1 cold no-cook dish, and 3 desserts (protein-friendly, from familiar ingredients such as quark, yoghurt, fruit, oats). Include some quick ones. For each: a short description, active and total time, estimated kcal and macros per serving.
At the end of your reply, give all 15 in an olupan-recipes code block with ingredients, short method steps, tags and season, so I can save them to My recipes in Olupan.
`+recipeFormat(L2)):L2(`Állíts össze egy ${mDays} napos menüt a fenti szabályok szerint.`,`Put together a ${mDays}-day menu following the rules above.`)+'\n'+menuFormat(L2,p.people,mDays,!!ex.prep&&mo.cook<7));
  return lines.join('\n');
}
async function copyInstr(){const ta=$('#instrText');try{await navigator.clipboard.writeText(ta.value);toast('Utasítás a vágólapon')}catch(e){ta.focus();ta.select();toast('Jelöld ki és másold ki kézzel')}}
function whyClaude(){openModal(`<h2>${L('Mire jó a Claude-projekt?','What is the Claude project for?')}</h2>
  <p class="small">${L('A kalóriaszámítás a legtöbb ember számára ott akad el, hogy minden ételt tételesen ki kell keresni egy adatbázisból. Egy mesterséges intelligenciával ez sokkal egyszerűbb: lefényképezed a tányért, elmondod vagy leírod, mit ettél, és Claude kiszámolja a kalóriát, a makrókat és a rostot.','For most people, calorie counting stalls because every food has to be looked up in a database. With AI it’s much simpler: photograph your plate, say or type what you ate, and Claude works out the calories, macros and fibre.')}</p>
  <p class="small">${L('Az eredményt egy kódblokkban adja vissza, amit az Olupan Étkezés oldalán egy koppintással beillesztesz. A projekt ismeri a céljaidat, és az app kéréseivel heti menüt és receptötleteket is ad, amelyek egyből a Receptjeid közé kerülnek. A saját Claude-fiókodat használod; az Olupanba csak a számok kerülnek.','It returns the result in a code block that you paste on Olupan’s Food page with one tap. The project knows your targets, and with the app’s requests it also gives weekly menus and recipe ideas that go straight into My recipes. You use your own Claude account; only the numbers go into Olupan.')}</p>
  <div class="row" style="margin-top:14px"><span class="sp"></span><button class="btn p" data-click="closeModal()">${L('Értem','Got it')}</button></div>`)}
function foodHelp(){if(!targets().kcal){toast('Előbb töltsd ki a profilodat');return}
  openModal(`<h2>Étkezésnapló Claude-dal</h2>
  <p class="small">Lefényképezed vagy elmondod, mit ettél, Claude kiszámolja a kalóriát, a makrókat és a rostot, és egy kódblokkban adja vissza. Ezt itt egy gombnyomással átveszed. Az Olupanba csak a számok kerülnek, a fotó csak a Claude-ba megy.</p>
  <h3 style="margin-top:14px">1. A projekt létrehozása (egyszer)</h3>
  <ol class="small" style="padding-left:20px;line-height:1.6">
  <li>${L('Nyisd meg a <b>claude.ai</b> oldalt <b>ugyanabban a böngészőben</b>, amelyben az Olupant használod – ne a Claude appot, mert ott nincs kimásolható webcím. Ha a telefon mégis az appot nyitja meg, a linket hosszan nyomva válaszd a megnyitást a böngészőben.','Open <b>claude.ai</b> <b>in the same browser</b> you use Olupan in – not the Claude app, because it has no web address you can copy. If your phone opens the app anyway, long-press the link and choose to open it in the browser.')}</li>
  <li>Bal oldali menü → <b>Projektek</b> → <b>Új projekt</b>. Név: pl. <i>Étkezésnapló</i>.</li>
  <li>A projekt oldalán keresd az <b>Utasítások</b> (Instructions / „Projekt utasításainak beállítása”) részt, és illeszd be a lenti szöveget. A <b>Másolás</b> gomb a vágólapra teszi.</li>
  <li>Mentsd. A projekt ezután a telefonos Claude appban is megjelenik a Projektek között.</li>
  <li>Másold ki a projekt címét a böngésző címsorából (<code class="mono">https://claude.ai/project/…</code>), és illeszd be a Beállítások → Étkezés → <b>Claude-projekt linkje</b> mezőbe. Ekkor az Étkezés fülön megjelenik a <b>Claude</b> gomb.</li></ol>
  <textarea id="instrText" rows="9" readonly style="font-size:13px">${esc(claudeInstr())}</textarea>
  <div class="row end" style="margin-top:8px;gap:8px"><button class="btn p sm" data-click="copyInstr()">${I('copy','sm')} Másolás</button></div>
  <div class="hint">Az utasítás tartalmazza a mostani javasolt napi bevitelt is. Ha a Beállításokban módosítod a profilodat, másold ki és illeszd be újra.</div>
  <h3 style="margin-top:14px">2. Használat étkezésenként</h3>
  <ol class="small" style="padding-left:20px;line-height:1.6">
  <li>Claude app → <b>Projektek</b> → <b>Étkezésnapló</b> → új beszélgetés (vagy folytasd a napit).</li>
  <li><b>Fotó:</b> a + vagy kamera ikonnal készíts képet a tányérról. <b>Szöveg vagy hang:</b> írd be vagy diktáld, pl. „reggelire 60 g zabpehely 2 dl tejjel és egy banán”.</li>
  <li>Ha Claude visszakérdez az adagra, válaszolj. A válasz végén lévő kódblokk sarkában lévő <b>másolás</b> ikonnal másold ki.</li>
  <li>${L('Olupan → a felső sávban vagy az Étkezés → <b>Claude-dal</b> ablakban: <b>Beillesztés</b>. Mentés előtt megmutatja a tételeket; a már rögzítettekre és a korábbi napra szólókra rákérdez.','Olupan → in the bar at the top or in Food → <b>With Claude</b>: <b>Paste</b>. Before saving, it shows the items and asks about ones already logged or dated to an earlier day.')}</li></ol>
  <p class="hint">${L('Saját recept: a Receptjeim között nyisd meg, és a <b>Rögzítés</b> gombbal vedd fel, a megadott adagszámmal. Ez pontosabb, mint a becslés.','Your own recipe: open it in My recipes and log it with <b>Log</b>, with the number of servings. This is more accurate than an estimate.')}</p>
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
/* ===== Összefoglaló az edzőmnek: egy képernyő a választott időszakról (étkezés, test, edzés), nyomtatható / PDF-be menthető ===== */
let repWeeks=4;
function repData(){const now=Date.now(),days=repWeeks*7,from=now-days*DAY,fromD=ymd(new Date(from+DAY)),toD=today(),pFrom=from-days*DAY;
  const t=targets(),inD=d=>d>=fromD&&d<=toD;
  const byDay={};for(const m of S.meals)if(inD(m.date))(byDay[m.date]=byDay[m.date]||[]).push(m);
  const dl=Object.keys(byDay).sort(),sums=dl.map(d=>sumMeals(byDay[d])),n=sums.length,avg=k=>n?sums.reduce((a,s)=>a+s[k],0)/n:null;
  const inK=t.kcal?sums.filter(s=>Math.abs(s.kcal-t.kcal)<=t.kcal*.1).length:null,pOk=t.p?sums.filter(s=>s.p>=t.p*.9).length:null;
  const alc=dl.reduce((a,d)=>a+byDay[d].reduce((b,m)=>b+(m.alc||0),0),0);
  const ser=k=>series(k).filter(p=>p.x>=from),w=ser('weight'),fat=ser('fat'),waist=ser('waist');
  const steps=S.body.filter(b=>inD(b.date)&&b.steps!=null).map(b=>b.steps);
  const ws=S.workouts.filter(x=>x.start>=from),wsP=S.workouts.filter(x=>x.start>=pFrom&&x.start<from);
  const perWk=Array.from({length:repWeeks},(_,i)=>ws.filter(x=>x.start>=from+i*7*DAY&&x.start<from+(i+1)*7*DAY));
  const vol=ws.reduce((a,x)=>a+wVolume(x),0),volP=wsP.reduce((a,x)=>a+wVolume(x),0),cardio=ws.reduce((a,x)=>a+wCardioMin(x),0);
  const mu=muSets(from,now+1),muP=muSets(pFrom,from);
  /* az időszak rekordjai: gyakorlatonként a legjobb */
  const prs={};for(const x of ws.slice().sort((a,b)=>a.start-b.start))for(const p of detectPRs(x)){const k=p.exId+p.type;if(!prs[k]||p.val>prs[k].val)prs[k]=Object.assign({d:x.start},p)}
  /* fő gyakorlatok: becsült 1RM az időszak előtt és alatt */
  const cnt={};for(const x of ws)for(const e of x.exercises)if(!isCardio(e.exId)&&exKind(e.exId)==='strength')cnt[e.exId]=(cnt[e.exId]||0)+1;
  const best=(exId,a,b)=>{let m=0;for(const x of S.workouts){if(x.start<a||x.start>=b)continue;for(const e of x.exercises)if(e.exId===exId)for(const s of e.sets)if(!s.wu)m=Math.max(m,e1rm(s.w,s.r))}return m};
  const lifts=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([id,c])=>({id,c,now:best(id,from,now+1),before:best(id,-Infinity,from)}));
  return{t,days,fromD,toD,n,dl,avg:{kcal:avg('kcal'),p:avg('p'),c:avg('c'),f:avg('f'),fib:avg('fib')},inK,pOk,alc,w,fat,waist,steps,ws,perWk,vol,volP,cardio,mu,muP,prs:Object.values(prs),lifts}}
function vReport(){const d=repData(),t=d.t,chips=[2,4,8].map(v=>`<button class="chip ${repWeeks===v?'on':''}" data-click="repSet(${v})">${L(`${v} hét`,`${v} weeks`)}</button>`).join('');
  const kv=(l,v,sub)=>`<div class="stat"><b class="mono" style="font-size:18px">${v}</b><span>${l}${sub?`<br><small class="mut">${sub}</small>`:''}</span></div>`;
  const vs=(v,tg,u)=>v==null?'–':`${fmt(v,0)}${u}${tg?` <small class="mut">/ ${fmt(tg,0)}</small>`:''}`;
  const first=a=>a.length?a[0]:null,last=a=>a.length?a[a.length-1]:null;
  const wF=first(d.w),wL=last(d.w),wkCh=wF&&wL&&wL.x>wF.x?(wL.y-wF.y)/((wL.x-wF.x)/(7*DAY)):null;
  const fF=first(d.fat),fL=last(d.fat),zF=first(d.waist),zL=last(d.waist);
  const goal=(GOALS.find(g=>g[0]===(S.profile.goal||'maintain'))||[])[1];
  const ax=MUSCLES.filter(m=>m[0]!=='full'),wkN=d.days/7;
  let h=`<div class="rangebar noprint"><span class="small mut">${L('Időszak','Period')}</span><div class="chips" style="margin:0">${chips}</div></div>
  <div class="card repcard"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div style="flex:1"><h2 style="margin:0">${L('Összefoglaló az edzőmnek','Summary for my coach')}</h2><div class="mut small">${esc(fmtDate(d.fromD))} – ${esc(fmtDate(d.toD))} · ${L(`${repWeeks} hét`,`${repWeeks} weeks`)}</div></div><span class="small mut" style="text-align:right">Olupan</span></div>
  <div class="small" style="margin-top:8px">${[goal?L('Cél: ','Goal: ')+esc(T(goal)):'',t.kcal?L(`Napi keret: ${fmt(t.kcal,0)} kcal · F ${fmt(t.p,0)} g`,`Daily target: ${fmt(t.kcal,0)} kcal · P ${fmt(t.p,0)} g`):'',S.profile.targetWeight?L(`Célsúly: ${hu(S.profile.targetWeight)} kg`,`Target weight: ${hu(S.profile.targetWeight)} kg`):''].filter(Boolean).join(' · ')}</div></div>`;
  /* Étkezés */
  h+=`<div class="card repcard"><h3 style="margin-top:0">${L('Étkezés','Food')}</h3>`+(d.n?`<div class="grid3">${kv(L('átlag kcal/nap','avg kcal/day'),vs(d.avg.kcal,t.kcal,''))}${kv(L('rögzített nap','days logged'),`${d.n}<small class="mut">/${d.days}</small>`)}${kv(L('keretben (±10%)','on target (±10%)'),d.inK==null?'–':`${d.inK}<small class="mut">/${d.n}</small>`)}</div>
    <div class="grid4" style="margin-top:8px">${kv(L('fehérje','protein'),vs(d.avg.p,t.p,' g'),d.pOk!=null?L(`${d.pOk} napon elég`,`enough on ${d.pOk} days`):'')}${kv(L('szénhidrát','carbs'),vs(d.avg.c,t.c,' g'))}${kv(L('zsír','fat'),vs(d.avg.f,t.f,' g'))}${kv(L('rost','fibre'),vs(d.avg.fib,t.fib,' g'))}</div>
    ${d.alc>0?`<div class="hint">${L(`Alkohol az időszakban: összesen ${fmt(d.alc,0)} g (kb. ${fmt(d.alc*7,0)} kcal), a kalóriában benne van.`,`Alcohol in the period: ${fmt(d.alc,0)} g in total (about ${fmt(d.alc*7,0)} kcal), included in the calories.`)}</div>`:''}
    <div class="hint">${L('Az átlag a rögzített napokra vonatkozik.','Averages are over logged days.')}</div>`:`<div class="empty">${L('Ebben az időszakban nincs rögzített étkezés.','No meals logged in this period.')}</div>`)+`</div>`;
  /* Test */
  h+=`<div class="card repcard"><h3 style="margin-top:0">${L('Test','Body')}</h3><div class="grid3">
    ${kv(L('testsúly','weight'),wL?`${hu(wL.y)} kg`:'–',wF&&wL&&wL!==wF?L(`${wL.y-wF.y>0?'+':''}${hu(wL.y-wF.y)} kg (kezdet: ${hu(wF.y)})`,`${wL.y-wF.y>0?'+':''}${hu(wL.y-wF.y)} kg (start: ${hu(wF.y)})`):'')}
    ${kv(L('heti változás','weekly change'),wkCh==null?'–':`${wkCh>0?'+':''}${hu(wkCh,2)} kg`,d.w.length?L(`${d.w.length} mérés`,`${d.w.length} weigh-ins`):'')}
    ${kv(L('átlag lépés/nap','avg steps/day'),d.steps.length?fmt(d.steps.reduce((a,b)=>a+b,0)/d.steps.length,0):'–',d.steps.length?L(`${d.steps.length} napról`,`from ${d.steps.length} days`):'')}</div>
    ${fL||zL?`<div class="grid2" style="margin-top:8px">${fL?kv(L('testzsír','body fat'),`${hu(fL.y)}%`,fF&&fF!==fL?`${fL.y-fF.y>0?'+':''}${hu(fL.y-fF.y)} ${L('százalékpont','pts')}`:''):''}${zL?kv(L('derékbőség','waist'),`${hu(zL.y)} cm`,zF&&zF!==zL?`${zL.y-zF.y>0?'+':''}${hu(zL.y-zF.y)} cm`:''):''}</div>`:''}</div>`;
  /* Edzés */
  h+=`<div class="card repcard"><h3 style="margin-top:0">${L('Edzés','Training')}</h3>`+(d.ws.length?`<div class="grid3">${kv(L('edzés','workouts'),d.ws.length,L(`${hu(d.ws.length/wkN,1)} / hét`,`${hu(d.ws.length/wkN,1)} / week`))}${kv(L('volumen/hét','volume/week'),`${fmt(d.vol/wkN/1000,1)} t`,d.volP?L(`előtte: ${fmt(d.volP/wkN/1000,1)} t`,`before: ${fmt(d.volP/wkN/1000,1)} t`):'')}${kv(L('kardió','cardio'),d.cardio?`${fmt(d.cardio,0)} ${L('perc','min')}`:'–')}</div>
    <div class="repwk">${d.perWk.map((l,i)=>`<div><i style="height:${Math.min(100,l.length*20)}%"></i><span>${l.length}</span><small>${L(`${i+1}. hét`,`wk ${i+1}`)}</small></div>`).join('')}</div>
    <h3>${L('Heti sorozat izomcsoportonként','Weekly sets per muscle group')}</h3>
    ${radar(ax.map(m=>muName(m[0])),[{v:ax.map(m=>d.muP.sets[m[0]]/wkN),color:'var(--kj-muted)',dash:true},{v:ax.map(m=>d.mu.sets[m[0]]/wkN),color:C.workout,fill:C.workout}])}
    <div class="row small" style="justify-content:center;gap:16px;margin-top:4px"><span><span class="lgd" style="background:${C.workout}"></span> ${L('ez az időszak','this period')}</span><span><span class="lgd" style="background:var(--kj-muted)"></span> ${L('előző időszak','previous period')}</span></div>
    ${d.lifts.length?`<h3>${L('Fő gyakorlatok – becsült 1RM','Main lifts – estimated 1RM')}</h3>${d.lifts.map(x=>`<div class="row li" style="flex-wrap:nowrap"><span style="flex:1;min-width:0">${esc(exName(x.id))}<br><span class="mut small">${x.c}× ${L('az időszakban','in the period')}</span></span><b class="mono">${x.now?fmt(x.now,1)+' kg':'–'}</b><span class="mono small" style="width:76px;text-align:right;color:${x.before&&x.now>x.before?'var(--kj-green-line)':'var(--kj-muted)'}">${x.before?(Math.abs(x.now-x.before)<0.05?'±0':`${x.now-x.before>0?'+':''}${fmt(x.now-x.before,1)}`):L('új','new')}</span></div>`).join('')}<div class="hint">${L('A jobb oldali szám a változás az időszak előtti legjobbhoz képest.','The right-hand number is the change from the best before the period.')}</div>`:''}
    ${d.prs.length?`<h3>${L('Rekordok az időszakban','Records in the period')} <span class="mut mono small">${d.prs.length}</span></h3><div class="small">${d.prs.slice(0,12).map(p=>{const[l,u]=prLbl(p);return`${esc(exName(p.exId))}: ${esc(T(l))} ${fmt(p.val,1)}${u}`}).join('<br>')}</div>`:''}`
    :`<div class="empty">${L('Ebben az időszakban nincs edzés.','No workouts in this period.')}</div>`)+`</div>`;
  h+=`<div class="card repcard"><label for="repnote" style="margin-top:0">${L('Megjegyzés az edzőnek (alvás, fájdalom, stressz, kérdések)','Note for the coach (sleep, pain, stress, questions)')}</label><textarea id="repnote" rows="3" class="noprint" data-change="repNote(this.value)">${esc(S.settings.repNote||'')}</textarea><div class="printonly" style="white-space:pre-wrap">${esc(S.settings.repNote||'–')}</div></div>
  <div class="row noprint" style="gap:8px;margin:4px 0 16px"><button class="btn p" data-click="repPrint()">${I('download','sm')} ${L('Mentés PDF-be / nyomtatás','Save as PDF / print')}</button></div>
  <div class="hint noprint">${L('Edzésen elég megmutatni a telefonon. A PDF a nyomtatás menüből menthető (iPhone-on: Megosztás → Nyomtatás → kétujjas nagyítás az előnézeten → Megosztás).','At a session it’s enough to show it on the phone. Save a PDF from the print menu (on iPhone: Share → Print → pinch out on the preview → Share).')}</div>`;
  return h}
function repSet(v){repWeeks=v;render()}
function repNote(v){S.settings.repNote=String(v).slice(0,2000);save()}
function repPrint(){document.body.classList.add('printrep');setTimeout(()=>{try{print()}finally{setTimeout(()=>document.body.classList.remove('printrep'),500)}},50)}

function vStats(){
  const cut=statRange?Date.now()-statRange*DAY:-Infinity,inR=p=>p.x>=cut;
  const chips=[[30,'30 nap'],[90,'90 nap'],[365,'1 év'],[0,'Mind']].map(([v,l])=>`<button class="chip ${statRange===v?'on':''}" data-click="setRange(${v})">${l}</button>`).join('');
  const wAll=series('weight'),w=wAll.filter(inR),ma=movAvg(wAll).filter(inR),d7=deltaN(wAll,7),d30=deltaN(wAll,30),d90=deltaN(wAll,90),sl=slopeWeek(w);
  let h=`<button class="setrow repbtn" data-click="goFrom('report')"><span>${I('clipboard-list','sm')} <b>${L('Összefoglaló az edzőmnek','Summary for my coach')}</b><br><span class="mut small">${L('Étkezés, test, edzés egy képernyőn – mutasd meg, vagy mentsd PDF-be','Food, body, training on one screen – show it or save it as a PDF')}</span></span>${I('chevron-right','sm')}</button>`+vTrend()+`<h3 style="margin:18px 2px 6px">Részletes nézet</h3><div class="rangebar"><span class="small mut">${L('Időszak','Period')}</span><div class="chips" style="margin:0">${chips}</div></div>
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
'Squat (Bodyweight)':'Guggolás (saját testsúly)','Bulgarian Split Squat':'Bolgár guggolás (kézisúlyzó)','Goblet Squat (Kettlebell)':'Kettlebell goblet guggolás',
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
'Kettlebell Swing':'Kettlebell swing (kétkezes)','Kettlebell Turkish Get Up':'Kettlebell török felállás (get-up)','Dips':'Tolódzkodás','Inverted Row':'Ausztrál húzódzkodás',
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
const SUBS={methods:['Számítási módszerek'],profile:['Profil és célok'],look:['Megjelenés'],fx:['Hangok és kijelző'],train:['Edzés'],food:['Étkezés'],data:['Adatok'],info:['Adatvédelem és offline működés']};
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
  if(setSub==='fx')return `<div class="card" style="padding-top:4px">
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
</div>`;
  if(setSub==='train'){const cats=[...new Set(S.exercises.map(exGroup))].sort(groupSort);
    const usage={};for(const w of S.workouts)for(const e of w.exercises)usage[e.exId]=(usage[e.exId]||0)+1;
    return `<div class="card">
  <label for="defrest" id="restset">Alapértelmezett pihenőidő (mp)</label>
  <input id="defrest" type="number" min="0" max="1800" step="15" value="${S.settings.rest??90}" data-change="setDefRest(this.value)">
  <div class="hint">Pipálás után indul. Gyakorlatonként felülírható (edzés közben a gyakorlat neve alatti időre koppintva, vagy lent a listában). 0 = kikapcsolva.</div>
</div>
  <div class="card" id="exlist"><div class="row" style="margin-bottom:4px"><h2 style="margin:0;flex:1">Gyakorlatok <span class="mut mono" style="font-size:14px">${S.exercises.length}</span></h2><button class="btn sm gold" data-click="newExFromList()">${I('plus','sm')} Új</button></div>
  ${cats.map(c=>`<h3 style="margin-top:16px">${esc(c)}</h3>`+S.exercises.filter(e=>exGroup(e)===c).sort(byName).map(e=>`<div class="row li"><span style="flex:1;min-width:0">${esc(e.name)}<br><span class="mut small mono">${e.eq?esc(lblOf(EQUIP,e.eq))+' · ':''}${e.rest!=null?`<span style="color:var(--kj-violet)">${I('timer','sm')} ${fmtSec(e.rest)}</span>`:`${I('timer','sm')} alap`}${usage[e.id]?` · ${usage[e.id]} edzés`:''}</span></span><button class="btn sm ico" data-click="editEx('${e.id}')" aria-label="Szerkesztés">${I('pencil','sm')}</button><button class="btn sm ico d" data-click="delEx('${e.id}')" aria-label="Törlés">${I('trash-2','sm')}</button></div>`).join('')).join('')}</div>
`}
  if(setSub==='food')return (S.settings.claudeUrl?'':`<div class="card notice"><div class="row li"><span class="nd"></span><span class="small" style="flex:1">${L('Étkezésnapló Claude-dal, két lépésben: <b>1.</b> állítsd be lent az étkezési preferenciáidat (ezekből készül a menü- és receptjavaslat), <b>2.</b> hozd létre a Claude-projektet az útmutató alapján, és másold be a linkjét.','Food log with Claude in two steps: <b>1.</b> set your food preferences below (meal and recipe suggestions are built from them), <b>2.</b> create the Claude project following the guide and paste its link.')} <button class="linkbtn" style="display:inline;width:auto;padding:0" data-click="whyClaude()">${L('Mire jó ez?','What is this for?')}</button></span></div></div>`)+vFoodPrefs()+ownFoodsCard()+(S.settings.foodPrefs&&!S.settings.claudeUrl&&targets().kcal?`<div class="card" style="border-color:color-mix(in srgb,var(--kj-blue) 50%,transparent)"><div class="small" style="margin-bottom:10px">${L('Ha készen vagy a preferenciákkal, nyisd meg a Claude-projekt létrehozásának útmutatóját.','When you’re done with your preferences, open the guide to creating the Claude project.')}</div><button class="btn p block" data-click="foodHelp()">${I('external-link','sm')} ${L('Claude-projekt útmutató','Claude project guide')}</button></div>`:'')+`<div class="card">
  <label for="claudeurl">Claude-projekt linkje (étkezésnapló)</label>
  <div class="row" style="flex-wrap:nowrap;gap:8px"><input id="claudeurl" style="flex:1;min-width:0" type="url" inputmode="url" autocomplete="off" value="${esc(S.settings.claudeUrl||'')}" placeholder="https://claude.ai/project/…" data-change="setClaudeUrl(this.value)">${S.settings.claudeUrl?`<a class="btn" href="${esc(S.settings.claudeUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Claude-projekt megnyitása">${I('external-link','sm')} Megnyitás</a>`:''}</div>
  <div class="hint">${S.settings.claudeUrl?L('A Megnyitás gomb új böngészőlapon nyitja meg a projektet – itt cserélheted az utasítást.','The Open button opens the project in a new browser tab – you can replace the instructions there.'):'Nyisd meg a Claude-ot ugyanabban a böngészőben, amelyben az Olupant használod (ne a Claude appot – ott nincs kimásolható webcím), jelentkezz be vagy regisztrálj, hozz létre egy projektet, és másold be ide a linkjét a címsorból.'}${targets().kcal?'':' Az útmutató a profil kitöltése után érhető el, mert a projekt utasításába a napi célok is belekerülnek.'}</div>
  ${S.settings.claudeUrl?'':`<a class="btn block" style="margin-top:10px" href="https://claude.ai/" target="_blank" rel="noopener noreferrer">${I('external-link','sm')} Claude megnyitása (claude.ai)</a>`}
  <div class="row" style="margin-top:12px"><button class="btn" data-click="foodHelp()" ${targets().kcal?'':'disabled'}>${I('external-link','sm')} Claude-projekt útmutató</button></div></div>`;
  if(setSub==='data')return storeCard()+`
  <div class="card"><h2>Mentés</h2><div class="hint" style="margin:0 0 12px">Minden adat csak ezen az eszközön, a böngésző helyi tárhelyén van – semmi nem kerül szerverre. A <b>Titkosított mentés</b> a telefon megosztás menüjét nyitja meg: innen menthetsz Google Drive-ra, a Fájlok appba vagy iCloud Drive-ra. Visszatöltés: <b>Visszaállítás mentésből</b>, majd a fájl kiválasztása (a Drive is megjelenik a fájlválasztóban, ha telepítve van).</div>
  <div class="stat" style="margin-bottom:12px"><b style="font-size:16px">${S.settings.lastBackup?fmtDate(S.settings.lastBackup)+' · '+fmtTime(S.settings.lastBackup):'Még nem volt'}</b><span>Utolsó mentés</span></div>
  <label for="bkev">${L('Emlékeztető, ha nincs mentés','Reminder if there’s no backup')}</label><select id="bkev" data-change="setBackupEvery(this.value)" style="margin-bottom:12px">${[[1,L('naponta','daily')],[7,L('hetente','weekly')],[14,L('kéthetente','every two weeks')],[0,L('kikapcsolva','off')]].map(([v,l])=>`<option value="${v}" ${S.settings.backupEvery===v?'selected':''}>${l}</option>`).join('')}</select>
  ${encCard()}
  <div class="bkact"><button class="btn p block" data-click="exportData()">${I(canEnc()?'lock':canShareFiles()?'share':'download','sm')} ${canEnc()?L('Titkosított mentés','Encrypted backup'):'Mentés / megosztás'}</button><button class="btn block" data-click="openImport()">${I('folder-open','sm')} ${L('Visszaállítás mentésből','Restore from backup')}</button><input type="file" id="imp" accept=".json,application/json" style="display:none" data-change="importData(this)"></div></div>
  <div class="card"><h2>${L('Megosztott tartalom','Shared content')}</h2><div class="hint" style="margin:0 0 12px">${L('Ha valaki receptet vagy edzéssablont küldött neked linkben vagy QR-kóddal, itt nyithatod meg és veheted át. Ez nem a mentésed visszaállítása.','If someone sent you a recipe or workout template by link or QR code, open and import it here. This isn’t restoring your backup.')}</div>
  <button class="btn block" data-click="sharePasteBox()">${I('link','sm')} ${L('Megosztott tartalom megnyitása','Open shared content')}</button></div>
  <div class="card" style="padding-top:4px">
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
  +grp('Hangok és kijelző',row('Hangok és rezgés',onoff((st.sound??3)>0||st.uiSound!==false),`data-click="openSub('fx')"`)+row('Értesítés a pihenő végén',onoff(st.restNotify===true&&notifSupported()&&Notification.permission==='granted'),`data-click="openSub('fx')"`)+row('Képernyő ébren tartása',onoff(st.wakeLock!==false),`data-click="openSub('fx')"`))
  +grp('Edzés',row('Alapértelmezett pihenőidő',fmtSec(st.rest??90),`data-click="openSub('train','restset')"`)+row('Gyakorlatok',String(S.exercises.length),`data-click="openSub('train','exlist')"`))
  +grp('Étkezés',row('Étkezési preferenciák',(()=>{const f=fprefs(),n=f.diet.length+f.style.length+(f.avoid?1:0);return n?String(n):''})(),`data-click="openSub('food','fprefs')"`)+row('Claude-projekt',st.claudeUrl?L('beállítva','set'):'',`data-click="openSub('food')"`))
  +grp('Egészség',row('Lépés, súly, testzsír az iPhone-ról','',`data-click="stepsHelp()"`))
  +grp('Adatok',row('Mentés',st.lastBackup?fmtDate(st.lastBackup):L('még nem volt','never'),`data-click="openSub('data')"`)+row('Export CSV-be','',`data-click="openSub('data','csv')"`)+row('Importálás','',`data-click="openSub('data','strong')"`)+row('Minden adat törlése','',`data-click="resetAll()"`,' danger'))
  +grp('Tudnivalók',pages.map(([h,l])=>`<a class="setrow" href="${base}${h}"><span>${l}</span>${I('chevron-right','sm')}</a>`).join('')+row('Adatvédelem és offline működés','',`data-click="openSub('info')"`)+row('Számítási módszerek','',`data-click="openSub('methods')"`))
  +`<div class="hint" style="text-align:center;margin:16px 0 4px">Az Olupan nem orvosi alkalmazás; a javasolt értékek tájékoztató becslések.</div><div class="hint" style="text-align:center;margin:4px 0">© 2026 Rácz Zoltán · Ikonok: Lucide (ISC) · Betűk: Instrument Sans, Bricolage Grotesque, JetBrains Mono (OFL)<br>Titkosítás: hash-wasm (MIT) · Jelszómérő: zxcvbn-ts (MIT) és magyar Diceware-szólisták (Rácz Zoltán, CC BY-SA 4.0) · Vonalkód: zxing-wasm (MIT) · QR: qrcode-generator (MIT) · Élelmiszer-adatok: USDA FoodData Central (CC0), Open Food Facts (ODbL)</div>`;
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

/* ===== Mentés titkosítása =====
   Védelem: a külső szolgáltatóhoz (felhő, e-mail, üzenet) kerülő mentésfájl elolvasása és módosítása ellen.
   Jelszó → Argon2id (hash-wasm; m = 64 MiB, t = 3, p = 1, 16 bájtos só) → nem kinyerhető AES-256-GCM kulcs, amelyet az IndexedDB tárol;
   a kulcs bájtjait a JavaScript sem tudja kiolvasni. Mentésenként új, véletlen 96 bites IV; AAD = a fájl fejléce (tartomány-azonosítóval).
   A jelszót az app nem tárolja; időnként a teljes jelszót kéri (ellenőrző blob), hogy kiderüljön, ha a felhasználó elfelejtette. */
const ENC_P={m:65536,t:3,p:1},ENC_MIN_BITS=64,ENC_GOOD_BITS=75,ENC_DOM='olupan-backup-v1',ENC_CHK='olupan-check-v1';
let encKeyMem=null,encPwState=null;
const canEnc=()=>!!(window.crypto&&crypto.subtle&&window.WebAssembly)&&location.protocol!=='file:';
const te=new TextEncoder(),td=new TextDecoder();
function b64e(u){let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
function b64d(s){const b=atob(String(s||''));const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function loadJs(src,integrity,glob){return new Promise((res,rej)=>{if(window[glob])return res(window[glob]);const s=document.createElement('script');s.src=src;s.integrity=integrity;s.crossOrigin='anonymous';
  s.onload=()=>window[glob]?res(window[glob]):rej(new Error('load'));s.onerror=()=>rej(new Error('load'));document.head.appendChild(s)})}
const loadArgon=()=>loadJs('/assets/argon2.js','sha384-ucC4sxuigvSaLeyhcJawckwyUdeGYHVtI5thKde7BmbSVGOVAfMvEilREY/G+pHi','hashwasm'),loadPw=()=>loadJs('/assets/pwcheck.js','sha384-d0jZD2BUmV8KZjTbLUC/PiCbr5h/6F5ykVC9VmWji4Vjw3xl1nIVQcjvlmUnMVVU','OlupanPw');
async function encDerive(pw,salt,P){const hw=await loadArgon();
  const raw=await hw.argon2id({password:String(pw).normalize('NFC'),salt,parallelism:P.p,iterations:P.t,memorySize:P.m,hashLength:32,outputType:'binary'});
  try{return await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt'])}finally{raw.fill(0)}}
async function keyGet(){if(encKeyMem)return encKeyMem;try{if(IDB.db){const k=await idbGet('bkey');if(k&&k.type==='secret'){encKeyMem=k;return k}}}catch(e){}return null}
async function keyPut(k){encKeyMem=k;try{if(IDB.db)await idbPut('bkey',k)}catch(e){console.warn('A kulcs nem menthető az IndexedDB-be',e)}}
async function keyDel(){encKeyMem=null;try{if(IDB.db)await idbReq('readwrite',st=>st.delete('bkey'))}catch(e){}}
const chkAad=salt=>te.encode(ENC_CHK+'|'+salt);
async function encCheckBlob(key,salt){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:chkAad(salt)},key,te.encode(ENC_CHK)));return{civ:b64e(iv),cct:b64e(ct)}}
async function encVerify(key,e){try{const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(e.civ),additionalData:chkAad(e.salt)},key,b64d(e.cct));return td.decode(pt)===ENC_CHK}catch(_){return false}}
/* Fájlformátum: {olupan:"backup-enc", v, kdf, m, t, p, salt, iv, z, app, data}; AAD = tartomány + a fejlécmezők rögzített sorrendben */
const hdrAad=h=>te.encode(ENC_DOM+'|'+JSON.stringify([h.v,h.kdf,h.m,h.t,h.p,h.salt,h.iv,h.z,h.app]));
async function gzipU(u){if(!window.CompressionStream)return null;return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer())}
async function gunzipU(u){return new Uint8Array(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer())}
async function encFile(key,json,e){let u=te.encode(json),z='';const g=await gzipU(u);if(g){u=g;z='gzip'}
  const iv=crypto.getRandomValues(new Uint8Array(12)),h={olupan:'backup-enc',v:1,kdf:'argon2id',m:e.m,t:e.t,p:e.p,salt:e.salt,iv:b64e(iv),z,app:DATA_V};
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:hdrAad(h)},key,u));
  return JSON.stringify(Object.assign(h,{data:b64e(ct)}))}
function encHdrOk(h){return h&&h.olupan==='backup-enc'&&h.v===1&&h.kdf==='argon2id'&&Number.isInteger(h.m)&&h.m>=8192&&h.m<=1048576&&Number.isInteger(h.t)&&h.t>=1&&h.t<=20&&Number.isInteger(h.p)&&h.p>=1&&h.p<=8&&typeof h.salt==='string'&&typeof h.iv==='string'&&typeof h.data==='string'}
async function decFile(h,pw){const key=await encDerive(pw,b64d(h.salt),h);let u;
  try{u=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(h.iv),additionalData:hdrAad(h)},key,b64d(h.data)))}catch(_){return null}
  if(h.z==='gzip'){if(!window.DecompressionStream)throw new Error('gzip');u=await gunzipU(u)}return{key,json:td.decode(u)}}
/* Ellenőrző jelszókérés gyakorisága a mentési emlékeztetőhöz igazítva (mentések száma) */
const encVerifyEvery=()=>({1:14,7:6,14:4}[S.settings.backupEvery]||6);
/* --- Beállítás --- */
function encSetup(after){if(!canEnc()){toast(L('A titkosított mentés az olupan.com-on érhető el','Encrypted backup is available on olupan.com'));return}
  encPwState={pw:'',pw2:'',bits:null,score:null,show:false,after:after||null,busy:false};renderEncSetup();loadPw().then(()=>encPwIn()).catch(()=>{const m=$('#encmeter');if(m)m.innerHTML=`<span class="mut small">${L('Az erősségmérő nem töltődött be (offline?) – a jelszót így is beállíthatod.','The strength meter didn’t load (offline?) – you can still set the password.')}</span>`})}
function renderEncSetup(){const s=encPwState,ty=s.show?'text':'password';
  openModal(`<h2>${I('lock','sm')} ${L('Mentés titkosítása','Backup encryption')}</h2>
  <div class="hint" style="margin-top:0">${L('A mentésfájl jelszóval titkosítva készül, így ha felhőbe, e-mailbe vagy üzenetbe kerül, a jelszó nélkül nem olvasható és nem módosítható. A jelszót az app nem tárolja: a készüléken csak egy kiolvashatatlan kulcs marad, így a következő mentésekhez nem kell beírnod. Visszatöltéskor és időnként ellenőrzésként a jelszót kérem.','The backup file is encrypted with a password, so if it ends up in the cloud, an email or a message, it can’t be read or changed without the password. The app doesn’t store the password: only an unreadable key stays on the device, so you don’t have to type it for later backups. I ask for it when restoring and now and then as a check.')}</div>
  <label for="encpw">${L('Jelszó vagy jelmondat','Password or passphrase')}</label>
  <div class="row" style="flex-wrap:nowrap;gap:8px"><input id="encpw" type="${ty}" autocomplete="new-password" autocapitalize="off" spellcheck="false" style="flex:1;min-width:0" value="${esc(s.pw)}" data-input="encPwIn()"><button class="btn ico" data-click="encShow()" aria-label="${s.show?L('Elrejtés','Hide'):L('Megjelenítés','Show')}">${I(s.show?'eye-off':'eye','sm')}</button></div>
  <label for="encpw2">${L('Jelszó újra','Password again')}</label><input id="encpw2" type="${ty}" autocomplete="new-password" autocapitalize="off" spellcheck="false" value="${esc(s.pw2)}" data-input="encPwIn()">
  <div id="encmeter" class="encmeter">${encMeterHtml()}</div>
  <div class="row" style="gap:8px;margin-top:8px"><button class="btn sm" data-click="encGen()">${I('dices','sm')} ${L('Jelmondat generálása','Generate a passphrase')}</button><a class="btn sm" href="https://kockajelszo.hu/" target="_blank" rel="noopener noreferrer">${I('external-link','sm')} kockajelszo.hu</a></div>
  <div class="hint">${L('Ajánlott: 6 szavas jelmondat (kb. 78 bit), amit le is írsz. A generálás a készüléken, a magyar Diceware-szólistából történik; dobókockával a kockajelszo.hu-n is készíthetsz.','Recommended: a 6-word passphrase (about 78 bits) that you also write down. It’s generated on the device from the Hungarian Diceware word list; you can also make one with dice at kockajelszo.hu.')}</div>
  <label class="ckrow" style="margin-top:14px"><input type="checkbox" id="encck1"> <span>${L('A jelszót biztonságosan lejegyeztem vagy elmentettem (pl. jelszókezelőbe). Tudomásul veszem, hogy elfelejtett jelszó esetén helyreállításra nincs lehetőség: az azzal készült mentések nem importálhatók, új jelszóval új mentést kell készíteni.','I have written down or stored the password securely (e.g. in a password manager). I understand that if I forget it there is no recovery: backups made with it can’t be imported, and I need to make a new backup with a new password.')}</span></label>
  <div id="encweak">${encWeakHtml()}</div>
  <div class="row" style="margin-top:14px"><button class="btn" data-click="closeModal()">${L('Mégse','Cancel')}</button><span class="sp"></span><button class="btn p" id="encgo" data-click="encSetupGo()">${I('lock','sm')} ${L('Titkosítás bekapcsolása','Turn on encryption')}</button></div>`)}
function encMeterHtml(){const s=encPwState;if(!s||!s.pw)return`<span class="mut small">${L('Az erősséget beíráskor mérem.','Strength is measured as you type.')}</span>`;if(s.bits==null)return'';
  const lv=s.bits>=ENC_GOOD_BITS?2:s.bits>=ENC_MIN_BITS?1:0,pct=Math.min(100,Math.round(s.bits/ENC_GOOD_BITS*100));
  return`<div class="encbar l${lv}"><i style="width:${pct}%"></i></div><span class="small">${L(`kb. ${s.bits} bit · `,`about ${s.bits} bits · `)}<b>${[L('gyenge','weak'),L('elfogadható','acceptable'),L('erős','strong')][lv]}</b>${lv===0?L(` – legalább ${ENC_MIN_BITS} bit ajánlott`,` – at least ${ENC_MIN_BITS} bits recommended`):''}</span>${s.pw2&&s.pw2!==s.pw?`<div class="small" style="color:var(--kj-red)">${L('A két jelszó nem egyezik.','The passwords don’t match.')}</div>`:''}`}
const encWeak=()=>encPwState&&encPwState.pw&&encPwState.bits!=null&&encPwState.bits<ENC_MIN_BITS;
function encWeakHtml(){return encWeak()?`<label class="ckrow" style="margin-top:10px"><input type="checkbox" id="encck2"> <span>${L('Tudomásul veszem, hogy ez gyenge jelszó, és nem alkalmas arra, hogy a mentésfájlt offline támadás (jelszópróbálgatás) ellen megvédje.','I understand that this is a weak password and is not suitable for protecting the backup file against an offline attack (password guessing).')}</span></label>`:''}
let encPwT=0;
function encPwIn(){const s=encPwState;if(!s)return;s.pw=($('#encpw')||{}).value||'';s.pw2=($('#encpw2')||{}).value||'';clearTimeout(encPwT);
  encPwT=setTimeout(()=>{if(window.OlupanPw&&s.pw){const r=OlupanPw.check(s.pw,['olupan',S.profile?.birthYear||'']);s.bits=r.bits;s.score=r.score}else s.bits=null;
    const m=$('#encmeter');if(m)m.innerHTML=encMeterHtml();const w=$('#encweak');if(w){const had=!!$('#encck2'),now=encWeak();if(had!==now)w.innerHTML=encWeakHtml()}},120)}
function encShow(){const s=encPwState;encPwIn();s.show=!s.show;renderEncSetup()}
function encGen(){if(!window.OlupanPw){toast(L('A szólista még töltődik…','The word list is still loading…'));return}const p=OlupanPw.generate(6);const s=encPwState;s.pw=s.pw2=p;s.show=true;const r=OlupanPw.check(p);s.bits=r.bits;renderEncSetup()}
async function encSetupGo(){const s=encPwState;encPwIn();clearTimeout(encPwT);
  if(window.OlupanPw&&s.pw){const r=OlupanPw.check(s.pw);s.bits=r.bits}
  if(!s.pw){toast(L('Adj meg jelszót','Enter a password'));return}if(s.pw!==s.pw2){toast(L('A két jelszó nem egyezik','The passwords don’t match'));return}
  if(!$('#encck1')?.checked){toast(L('Erősítsd meg, hogy a jelszót biztonságosan elmentetted','Confirm that you’ve stored the password securely'));return}
  if(encWeak()&&!$('#encck2')?.checked){const w=$('#encweak');if(w&&!$('#encck2'))w.innerHTML=encWeakHtml();toast(L('Gyenge jelszónál a második nyilatkozat is kell','A weak password needs the second confirmation too'));return}
  if(s.busy)return;s.busy=true;const b=$('#encgo');if(b){b.disabled=true;b.textContent=L('Kulcs számítása…','Deriving key…')}
  try{const salt=crypto.getRandomValues(new Uint8Array(16)),sb=b64e(salt),key=await encDerive(s.pw,salt,ENC_P);
    const e=Object.assign({v:1,salt:sb},ENC_P,await encCheckBlob(key,sb),{since:today(),n:0});
    await keyPut(key);S.settings.enc=e;delete S.settings.plainOk;save();s.pw=s.pw2='';closeModal();render();
    toast(L('Titkosítás bekapcsolva','Encryption turned on'));
    if(s.after==='backup'){exportData();return}
    if(await ask(L('Készítsünk most egy titkosított mentést? A korábbi, titkosítatlan mentésfájljaidat érdemes törölni onnan, ahová feltöltötted őket.','Shall we make an encrypted backup now? It’s worth deleting your earlier unencrypted backup files from wherever you uploaded them.'),{title:L('Titkosított mentés','Encrypted backup'),ok:L('Mentés most','Back up now'),cancel:L('Később','Later')}))exportData()}
  catch(err){console.warn(err);toast(L('A titkosítás beállítása nem sikerült','Setting up encryption failed'));s.busy=false;if(b){b.disabled=false;b.textContent=L('Titkosítás bekapcsolása','Turn on encryption')}}}
/* --- Jelszókérés: feloldás (nincs tárolt kulcs) vagy időszakos ellenőrzés --- */
function encAskPw(mode){const e=S.settings.enc;return dlg(`<h2>${I('lock','sm')} ${mode==='verify'?L('Emlékszel még a jelszóra?','Do you still remember the password?'):L('Mentés jelszava','Backup password')}</h2>
  <p>${mode==='verify'?L('Időnként ellenőrzöm, hogy megvan-e még a mentések jelszava – ha elfelejtenéd, a mentéseid nem lennének visszaállíthatók.','Now and then I check that you still have the backup password – if you forgot it, your backups couldn’t be restored.'):L('A titkosított mentéshez add meg a jelszót. Ezen a készüléken nincs (már) meg a kulcs, utána a következő mentéseknél nem kell.','Enter the password for the encrypted backup. The key isn’t (or is no longer) on this device; after this you won’t need it for later backups.')}</p>
  <input id="encask" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" autofocus><div id="encaskerr" class="small" style="color:var(--kj-red);min-height:18px;margin-top:4px"></div>
  <button class="linkbtn" style="padding:0;width:auto" data-click="encForgot()">${L('Elfelejtettem a jelszót','I forgot the password')}</button>
  <div class="row end" style="margin-top:12px"><button class="btn" data-click="dlgClose(null)">${L('Mégse','Cancel')}</button><button class="btn p" id="encaskok" data-click="encAskGo()">${L('Tovább','Continue')}</button></div>`,null)}
let encAskBusy=false;
async function encAskGo(){if(encAskBusy)return;const pw=($('#encask')||{}).value||'',e=S.settings.enc,err=$('#encaskerr'),b=$('#encaskok');if(!pw||!e)return;
  encAskBusy=true;if(b){b.disabled=true;b.textContent=L('Ellenőrzés…','Checking…')}
  try{const key=await encDerive(pw,b64d(e.salt),e);if(await encVerify(key,e)){await keyPut(key);encAskBusy=false;dlgClose(key);return}
    if(err)err.textContent=L('Ez nem a mentések jelszava. Próbáld újra.','That isn’t the backup password. Try again.')}
  catch(x){if(err)err.textContent=L('Az ellenőrzés nem sikerült.','The check failed.')}
  encAskBusy=false;if(b){b.disabled=false;b.textContent=L('Tovább','Continue')}}
async function encForgot(){dlgClose(null);
  if(!await ask(L('Új jelszót állítasz be, és rögtön új, teljes mentés készül vele. A korábbi titkosított mentéseid csak a régi jelszóval nyithatók meg – ha az nincs meg, azok nem állíthatók vissza.','You’ll set a new password and a new full backup is made with it right away. Your earlier encrypted backups can only be opened with the old password – without it they can’t be restored.'),{title:L('Elfelejtett jelszó','Forgotten password'),ok:L('Új jelszó beállítása','Set a new password')}))return;
  await keyDel();delete S.settings.enc;save();encSetup('backup')}
async function encChange(){if(!await ask(L('Új jelszót állítasz be. A korábbi titkosított mentéseid továbbra is csak a régi jelszóval nyithatók meg.','You’ll set a new password. Your earlier encrypted backups still open only with the old password.'),{title:L('Jelszó módosítása','Change password'),ok:L('Tovább','Continue')}))return;encSetup('backup')}
/* Titkosítás nélküli mentés előtt egyszeri nyilatkozat */
function encPlainAsk(){return dlg(`<h2>${I('lock-open','sm')} ${L('Titkosítás nélküli mentés','Unencrypted backup')}</h2>
  <p>${L('A mentésfájl olvasható formában készül: aki hozzáfér (pl. a felhőtárhelyhez vagy egy továbbított e-mailhez), látja az edzéseidet, étkezéseidet és testadataidat. Jelszavas titkosítást a Beállítások → Adatok alatt kapcsolhatsz be.','The backup file is made in readable form: anyone with access to it (e.g. to the cloud storage or a forwarded email) can see your workouts, meals and body data. You can turn on password encryption under Settings → Data.')}</p>
  <label class="ckrow"><input type="checkbox" id="plainck"> <span>${L('Tudomásul veszem, hogy az adataim titkosítás nélkül mentődnek.','I understand that my data is saved without encryption.')}</span></label>
  <div class="row end" style="margin-top:12px"><button class="btn" data-click="dlgClose('setup')">${I('lock','sm')} ${L('Titkosítás beállítása','Set up encryption')}</button><button class="btn p" data-click="encPlainGo()">${L('Mentés titkosítás nélkül','Back up unencrypted')}</button></div>`,null)}
function encPlainGo(){if(!$('#plainck')?.checked){toast(L('Előbb pipáld ki a nyilatkozatot','Tick the statement first'));return}S.settings.plainOk=today();save();dlgClose('plain')}
function encCard(){const e=S.settings.enc;
  if(!canEnc())return`<div class="hint" style="margin:0 0 12px">${L('A mentés az olupan.com-on mindig jelszóval titkosított. Ebben az offline fájlváltozatban a titkosítás nem fut, ezért itt olvasható mentés készül.','On olupan.com backups are always password-encrypted. Encryption can’t run in this offline file version, so backups here are readable.')}</div>`;
  return e?`<div class="encst on"><span>${I('lock','sm')} <b>${L('Titkosított mentés: bekapcsolva','Encrypted backup: on')}</b><br><span class="mut small">${L(`Beállítva: ${fmtDate(e.since)} · Argon2id + AES-256-GCM`,`Set: ${fmtDate(e.since)} · Argon2id + AES-256-GCM`)}</span></span></div>
    <div class="row" style="gap:8px;margin:8px 0 12px"><button class="btn sm" data-click="encChange()">${I('key-round','sm')} ${L('Jelszó módosítása','Change password')}</button></div>`
  :`<div class="encst"><span>${I('lock','sm')} <b>${L('A mentés mindig titkosított','Backups are always encrypted')}</b><br><span class="mut small">${L('Az első mentés előtt jelszót állítasz be; így a felhőbe vagy e-mailbe kerülő mentésfájl nem olvasható.','Before the first backup you set a password, so a backup file in the cloud or an email can’t be read.')}</span></span></div>`}

/* Visszaállítás titkosított fájlból: mindig a teljes jelszó kell */
let encImpH=null,encImpBusy=false;
function encImportPw(h){encImpH=h;return dlg(`<h2>${I('lock','sm')} ${L('Titkosított mentés','Encrypted backup')}</h2><p>${L('Add meg a mentés jelszavát.','Enter the backup’s password.')}</p>
  <input id="encimp" type="password" autocomplete="current-password" autocapitalize="off" spellcheck="false" autofocus><div id="encimperr" class="small" style="color:var(--kj-red);min-height:18px;margin-top:4px"></div>
  <div class="hint">${L('Elfelejtett jelszóval a mentés nem nyitható meg, és helyreállításra sincs lehetőség.','Without the password the backup can’t be opened, and there’s no way to recover it.')}</div>
  <div class="row end" style="margin-top:12px"><button class="btn" data-click="dlgClose(null)">${L('Mégse','Cancel')}</button><button class="btn p" id="encimpok" data-click="encImportGo()">${L('Megnyitás','Open')}</button></div>`,null)}
async function encImportGo(){if(encImpBusy)return;const pw=($('#encimp')||{}).value||'',err=$('#encimperr'),b=$('#encimpok');if(!pw)return;encImpBusy=true;if(b){b.disabled=true;b.textContent=L('Visszafejtés…','Decrypting…')}
  try{const r=await decFile(encImpH,pw);if(r){encImpBusy=false;dlgClose(r);return}if(err)err.textContent=L('Hibás jelszó, vagy a fájl sérült, illetve módosították.','Wrong password, or the file is damaged or was modified.')}
  catch(x){if(err)err.textContent=x&&x.message==='gzip'?L('Ez a böngésző nem tudja kicsomagolni a fájlt – frissítsd, vagy próbáld másik böngészőben.','This browser can’t unpack the file – update it or try another browser.'):L('A visszafejtés nem sikerült.','Decryption failed.')}
  encImpBusy=false;if(b){b.disabled=false;b.textContent=L('Megnyitás','Open')}}

async function exportData(){
  const e=S.settings.enc;
  if(!e&&canEnc()){encSetup('backup');return}
  if(!e){if(!S.settings.plainOk){const r=await encPlainAsk();if(r==='setup'){encSetup();return}if(r!=='plain')return}
    const now=Date.now(),snap=JSON.stringify(Object.assign({},S,{settings:Object.assign({},S.settings,{lastBackup:now})}));
    if(await shareOrDownload('olupan-'+today()+'.json',snap,'application/json','Olupan mentés')){S.settings.lastBackup=now;save();if(tab==='more'||tab==='workout')render();toast('Mentés kész')}return}
  if(!canEnc()){toast(L('A titkosított mentés az olupan.com-on készíthető','Encrypted backups can be made on olupan.com'));return}
  let key=await keyGet();const due=(e.n||0)>=encVerifyEvery();
  if(!key||due){key=await encAskPw(key?'verify':'unlock');if(!key)return;e.n=0}
  const now=Date.now();let text;
  try{text=await encFile(key,JSON.stringify(Object.assign({},S,{settings:Object.assign({},S.settings,{lastBackup:now})})),e)}catch(x){console.warn(x);toast(L('A titkosított mentés nem sikerült','The encrypted backup failed'));return}
  if(await shareOrDownload((LANG==='en'?'olupan-encrypted-':'olupan-titkositott-')+today()+'.json',text,'application/json','Olupan mentés')){e.n=(e.n||0)+1;S.settings.lastBackup=now;save();if(tab==='more'||tab==='workout')render();toast(L('Titkosított mentés kész','Encrypted backup done'))}
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
  let obj,hdr=null,dk=null;try{if(f.size>40e6)throw 0;obj=JSON.parse(await f.text())}catch(e){toast('Hibás vagy nem támogatott fájl');return}
  if(obj&&obj.olupan==='backup-enc'){if(!encHdrOk(obj)){toast('Hibás vagy nem támogatott fájl');return}
    if(!canEnc()){toast(L('Titkosított mentés csak az olupan.com-on állítható vissza','Encrypted backups can only be restored on olupan.com'));return}
    hdr=obj;const r=await encImportPw(obj);if(!r)return;dk=r.key;try{obj=JSON.parse(r.json)}catch(e){toast('Hibás vagy nem támogatott fájl');return}}
  let d;try{d=sanitizeState(obj)}catch(e){toast('Hibás vagy nem támogatott fájl');return}
  if(!await ask(L(`A fájlban ${d.workouts.length} edzés, ${d.meals.length} étkezési tétel és ${d.body.length} mérés van. Felülírja a jelenlegi adatokat?`,`The file has ${d.workouts.length} workouts, ${d.meals.length} food items and ${d.body.length} measurements. Overwrite your current data?`),{title:'Importálás',ok:'Felülírás',danger:true}))return;
  if(d.v<DATA_V){addDefaults(d);d.v=DATA_V}S=d;await keyDel();if(dk&&S.settings.enc&&hdr&&S.settings.enc.salt===hdr.salt)await keyPut(dk);save();applyTheme();render();toast('Importálva')}
function obSkip(k){if(k==='obSteps'||k==='obClaude'){S.settings[k]=true;save();render()}}
function setBackupEvery(v){S.settings.backupEvery=[0,1,7,14].includes(+v)?+v:7;save();toast(L('Mentve','Saved'))}
async function resetAll(){if(!await ask('Minden edzés, mérés, sablon és saját gyakorlat törlődik erről az eszközről. Érdemes előtte exportálni.',{title:'Minden adat törlése',ok:'Tovább',danger:true}))return;
  if(!await ask('Ez nem vonható vissza. Biztosan törlöd?',{title:'Utolsó megerősítés',ok:'Végleges törlés',danger:true}))return;await keyDel();const th=S.settings.theme,ac=S.settings.accent;S=defaults();S.settings.theme=th;S.settings.accent=ac;rest=null;save();homeDay=today();go('home')}
async function demoData(){
  if(S.workouts.length||S.meals.length){toast('Mintaadat csak üres naplóba tölthető be');return}
  if(!await ask(L('Kb. 4 hónapnyi mintaadatot (edzéseket, méréseket és étkezéseket) töltök be, hogy lásd, hogyan működik az app. Mielőtt valódi használatba veszed, töröld őket: a figyelmeztető kártyán vagy a Beállítások → Adatok alatt.','I’ll load about 4 months of sample data (workouts, measurements and meals) so you can see how the app works. Delete it before you start using the app for real: on the notice card or under Settings → Data.'),{title:'Mintaadatok',ok:'Betöltés'}))return;
  const base={'Fekvenyomás (rúd)':70,'Ferde fekvenyomás (kézisúlyzó)':24,'Katonai nyomás (rúd)':42,'Oldalemelés (kézisúlyzó)':9,'Tricepsz letolás (kábel)':30,'Felhúzás (rúd)':110,'Evezés (rúd)':60,'Húzódzkodás':0,'Mellhez húzás (kábel)':55,'Bicepsz hajlítás (kézisúlyzó)':12,'Guggolás (rúd)':90,'Román felhúzás (rúd)':80,'Lábtolás (gép)':160,'Kitörés (kézisúlyzó)':18,'Vádliemelés (gép)':70,
    'Kettlebell swing (egykezes)':20,'Kettlebell swing (kétkezes)':24,'Kettlebell török felállás (get-up)':16,'Kettlebell goblet guggolás':24,'Kettlebell clean & press':16,'Kettlebell evezés':24,'Kettlebell halo':12,'Kettlebell clean':20,'Kettlebell snatch':16,'Kettlebell front rack guggolás':20,'Kettlebell windmill':12};
  const kb=n=>n.startsWith('Kettlebell ');
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
applyTheme();applyLang();render();bootStore().finally(shareFromHash);
