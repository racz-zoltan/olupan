/* Olupan vonalkód-olvasó (külön oldal). Beépített BarcodeDetector, ha van; különben zxing-wasm (saját tárhelyről). */
(()=>{'use strict';
const $=s=>document.querySelector(s),v=$('#v'),st=$('#st');
const EN=(document.documentElement.lang=(new URLSearchParams(location.search).get('lang')==='en'?'en':'hu'))==='en';
const T=(hu,en)=>EN?en:hu;
$('#lbl').textContent=T('Vagy írd be a vonalkód számát','Or type the barcode number');$('#ok').textContent=T('Keresés','Search');$('#x').setAttribute('aria-label',T('Bezárás','Close'));
let stream=null,det=null,zx=false,busy=false,done=false,last='',hits=0,timer=0;
const post=m=>{if(parent!==window)parent.postMessage(Object.assign({src:'olupan-scan'},m),location.origin)};
function stop(){clearTimeout(timer);if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
function finish(code){if(done)return;done=true;stop();try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}post({type:'code',code})}
/* EAN-8/12/13/14 ellenőrző számjegy */
function valid(c){if(!/^(\d{8}|\d{12,14})$/.test(c))return false;const d=[...c].map(Number),k=d.pop();let s=0;d.reverse().forEach((x,i)=>s+=x*(i%2?1:3));return(10-s%10)%10===k}
$('#x').addEventListener('click',()=>{stop();post({type:'close'})});
$('#man').addEventListener('submit',e=>{e.preventDefault();const c=$('#code').value.replace(/\D/g,'');if(!valid(c)){st.textContent=T('Ez nem érvényes vonalkód – ellenőrizd a számokat.','That isn’t a valid barcode – check the digits.');return}finish(c)});
addEventListener('pagehide',stop);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!done&&!stream)start()});
async function start(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){st.textContent=T('A kamera itt nem érhető el – írd be a számot.','The camera isn’t available here – type the number.');return}
  try{stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}})}
  catch(e){st.textContent=e&&e.name==='NotAllowedError'?T('Nincs engedély a kamerához – engedélyezd a böngészőben, vagy írd be a számot.','No camera permission – allow it in the browser, or type the number.'):T('A kamera nem indult el – írd be a számot.','The camera didn’t start – type the number.');return}
  v.srcObject=stream;try{await v.play()}catch(e){}
  if(!det&&!zx){
    try{if('BarcodeDetector' in window){const f=await BarcodeDetector.getSupportedFormats();if(f.includes('ean_13'))det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']})}}catch(e){det=null}
    if(!det){if(!window.ZXingWASM){st.textContent=T('A vonalkód-olvasó nem töltődött be – írd be a számot.','The barcode reader didn’t load – type the number.');return}
      st.textContent=T('Olvasó betöltése…','Loading reader…');
      try{ZXingWASM.prepareZXingModule({overrides:{locateFile:(p,pre)=>p.endsWith('.wasm')?'/assets/'+p:pre+p},fireImmediately:true});await ZXingWASM.getZXingModule();zx=true}
      catch(e){st.textContent=T('Az olvasó nem indult el – írd be a számot.','The reader didn’t start – type the number.');return}}
  }
  st.textContent=T('Tartsd a vonalkódot a keretbe','Hold the barcode inside the frame');loop()}
const cv=document.createElement('canvas'),cx=cv.getContext('2d',{willReadFrequently:true});
async function scan(){
  if(det){const r=await det.detect(v);return r.map(b=>b.rawValue)}
  const w=v.videoWidth,h=v.videoHeight;if(!w||!h)return[];
  const cw=Math.round(w*.86),ch=Math.round(Math.min(h,cw/1.6));cv.width=cw;cv.height=ch;cx.drawImage(v,(w-cw)/2,(h-ch)/2,cw,ch,0,0,cw,ch);
  const r=await ZXingWASM.readBarcodes(cx.getImageData(0,0,cw,ch),{formats:['EAN13','EAN8','UPCA','UPCE'],tryHarder:true,maxNumberOfSymbols:1});
  return r.filter(b=>b.isValid).map(b=>b.text)}
async function loop(){if(done||!stream)return;
  if(!busy&&v.readyState>=2){busy=true;try{const codes=(await scan()).map(c=>String(c).replace(/\D/g,'')).filter(valid);
      if(codes.length){const c=codes[0];hits=c===last?hits+1:1;last=c;if(hits>=2||det)return finish(c)}}catch(e){}busy=false}
  timer=setTimeout(loop,det?120:180)}
post({type:'ready'});start();
})();
