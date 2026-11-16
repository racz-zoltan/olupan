/* Olupan vonalkód-olvasó – diagnosztikai tesztoldal. Ugyanaz a felismerési út, mint a scanner.js-ben, lépésenként naplózva. */
(()=>{'use strict';
const $=s=>document.querySelector(s),v=$('#v'),logEl=$('#log'),hit=$('#hit'),t0=performance.now(),lines=[];
const ms=()=>Math.round(performance.now()-t0)+' ms';
function log(cls,msg){lines.push(`[${ms()}] ${msg}`);const li=document.createElement('li');li.className=cls;li.textContent=`[${ms()}] ${msg}`;logEl.appendChild(li)}
let stream=null,det=null,zx=false,busy=false,timer=0,frames=0,decodeMs=0,first=0,last='',hits=0,seen=new Set(),camAt=0;
function valid(c){if(!/^(\d{8}|\d{12,14})$/.test(c))return false;const d=[...c].map(Number),k=d.pop();let s=0;d.reverse().forEach((x,i)=>s+=x*(i%2?1:3));return(10-s%10)%10===k}
/* 1. környezet */
log('inf','Böngésző: '+navigator.userAgent);
log(window.isSecureContext?'ok':'bad','Biztonságos környezet (isSecureContext): '+window.isSecureContext+(window.isSecureContext?'':' – getUserMedia csak HTTPS-en vagy localhoston érhető el'));
log(navigator.mediaDevices?'ok':'bad','navigator.mediaDevices: '+(navigator.mediaDevices?'van':'NINCS – a webview nem ad kamera-hozzáférést (iOS: WKWebView 14.3+, HTTPS kell)'));
log(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?'ok':'bad','getUserMedia: '+(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?'van':'NINCS'));
log(typeof WebAssembly==='object'?'ok':'bad','WebAssembly: '+(typeof WebAssembly==='object'?'van':'NINCS'));
(async()=>{if('BarcodeDetector' in window){try{const f=await BarcodeDetector.getSupportedFormats();log(f.includes('ean_13')?'ok':'warn','BarcodeDetector: van, formátumok: '+(f.join(', ')||'(üres)'))}catch(e){log('warn','BarcodeDetector: van, de hibát dob: '+e)}}else log('inf','BarcodeDetector: nincs (iOS-en ez a normális) – a zxing-wasm fog felismerni')})();
async function initDecoder(){det=null;zx=false;
  if(!$('#force').checked&&'BarcodeDetector' in window){try{const f=await BarcodeDetector.getSupportedFormats();if(f.includes('ean_13')){det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});log('ok','Felismerő: beépített BarcodeDetector');return true}}catch(e){log('warn','BarcodeDetector nem használható: '+e)}}
  if(!window.ZXingWASM){log('bad','zxing-reader.js nem töltődött be (CSP vagy hálózat?)');return false}
  const a=performance.now();log('inf','zxing-wasm betöltése (/assets/zxing_reader.wasm)…');
  try{ZXingWASM.prepareZXingModule({overrides:{locateFile:(p,pre)=>p.endsWith('.wasm')?'/assets/'+p:pre+p},fireImmediately:true});await ZXingWASM.getZXingModule();zx=true;log('ok',`Felismerő: zxing-wasm, betöltve ${Math.round(performance.now()-a)} ms alatt`);return true}
  catch(e){log('bad','zxing-wasm nem indult: '+(e&&e.message||e)+" – ha CSP-hiba, a script-src-ben kell a 'wasm-unsafe-eval'");return false}}
async function start(){stop();frames=0;decodeMs=0;first=0;hits=0;last='';
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){log('bad','Nincs getUserMedia – a kamera itt nem érhető el');return}
  log('inf','getUserMedia({video:{facingMode:environment, 1280×720}}) hívása…');const a=performance.now();
  try{stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}})}
  catch(e){log('bad',`getUserMedia hiba: ${e&&e.name} – ${e&&e.message}`+(e&&e.name==='NotAllowedError'?' (engedély megtagadva: iOS-en NSCameraUsageDescription, a WKUIDelegate engedélykezelése, Androidon onPermissionRequest)':e&&e.name==='NotFoundError'?' (nincs kamera)':''));return}
  const tr=stream.getVideoTracks()[0],st=tr&&tr.getSettings?tr.getSettings():{};
  log('ok',`Kamera megvan ${Math.round(performance.now()-a)} ms alatt: ${tr&&tr.label||'?'}, ${st.width||'?'}×${st.height||'?'}, facingMode=${st.facingMode||'?'}`);
  v.srcObject=stream;try{await v.play();log('ok','Videó lejátszás elindult (playsinline)')}catch(e){log('bad','video.play() hiba: '+e+' – iOS WKWebView: allowsInlineMediaPlayback=true, mediaTypesRequiringUserActionForPlayback=[]')}
  setTimeout(()=>{if(stream&&(!v.videoWidth||v.readyState<2))log('bad',`A videó 2 mp után sem ad képkockát (readyState=${v.readyState}, ${v.videoWidth}×${v.videoHeight}) – fekete kép: inline lejátszás tiltva?`);else if(stream)log('ok',`Képkockák jönnek: ${v.videoWidth}×${v.videoHeight}`)},2000);
  if(!await initDecoder())return;camAt=performance.now();log('inf','Tartsd a vonalkódot a keretbe…');loop()}
function stop(){clearTimeout(timer);if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
const cv=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true});
async function scan(){
  if(det){const r=await det.detect(v);return r.map(b=>b.rawValue)}
  const w=v.videoWidth,h=v.videoHeight;if(!w||!h)return[];
  const cw=Math.round(w*.86),ch=Math.round(Math.min(h,cw/1.6));cv.width=cw;cv.height=ch;cx.drawImage(v,(w-cw)/2,(h-ch)/2,cw,ch,0,0,cw,ch);
  const r=await ZXingWASM.readBarcodes(cx.getImageData(0,0,cw,ch),{formats:['EAN13','EAN8','UPCA','UPCE'],tryHarder:true,maxNumberOfSymbols:1});
  return r.filter(b=>b.isValid).map(b=>b.text)}
async function loop(){if(!stream)return;
  if(!busy&&v.readyState>=2){busy=true;const a=performance.now();
    try{const codes=(await scan()).map(c=>String(c).replace(/\D/g,'')).filter(valid);frames++;decodeMs+=performance.now()-a;
      if(frames===20)log('inf',`20 képkocka feldolgozva, átlag ${Math.round(decodeMs/frames)} ms/képkocka`);
      if(codes.length){const c=codes[0];hits=c===last?hits+1:1;last=c;
        if((hits>=2||det)&&!seen.has(c)){seen.add(c);if(!first)first=performance.now()-camAt;hit.textContent=c;try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}
          log('ok',`KÓD: ${c} (${det?'BarcodeDetector':'zxing-wasm'}, ${frames}. képkocka, első találat ${Math.round(first)} ms-mal az indulás után)`)}}}
    catch(e){log('bad','Felismerési hiba: '+(e&&e.message||e))}busy=false}
  timer=setTimeout(loop,det?120:180)}
$('#go').addEventListener('click',()=>{start();$('#go').textContent='Újraindítás'});
$('#force').addEventListener('change',()=>{if(stream)start()});
$('#copy').addEventListener('click',async()=>{const t=lines.join('\n');try{await navigator.clipboard.writeText(t);log('ok','Napló a vágólapon')}catch(e){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');log('ok','Napló a vágólapon')}catch(e2){log('warn','Másolás nem sikerült – jelöld ki a naplót kézzel')}ta.remove()}});
addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&stream){stop();log('inf','Háttérbe került – kamera leállítva')}});
})();
