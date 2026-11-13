/* Olupan jelszóerősség-mérés és jelmondat-generálás (csak a jelszó beállításakor töltődik be).
   zxcvbn-ts (MIT) + a magyar Diceware-szólisták (Rácz Zoltán, CC BY-SA 4.0) saját szótárként,
   így a magyar szavakból álló jelmondatok erősségét nem becsüli túl. */
import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as common from '@zxcvbn-ts/language-common';
import longTxt from '../data/diceware_magyar_7776.txt';
import shortTxt from '../data/diceware_magyar_1296.txt';
const parse = t => t.split('\n').map(l => l.trim().split(/\s+/)).filter(a => a.length === 2 && /^[1-6]+$/.test(a[0])).map(a => a[1]);
const LONG = parse(longTxt), SHORT = parse(shortTxt);
const deacc = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const hu = [...new Set([...SHORT, ...LONG, ...LONG.map(deacc)])];
const DS = new Set([...SHORT, ...LONG].map(deacc)), SS = new Set(SHORT.map(deacc));
const z = new ZxcvbnFactory({ dictionary: { 'passwords-common': common.dictionary['passwords-common'], huDiceware: hu }, graphs: common.adjacencyGraphs, useLevenshteinDistance: true });
function generate(n = 6, sep = ' ') {
  const out = [], buf = new Uint32Array(1), lim = Math.floor(2 ** 32 / LONG.length) * LONG.length; // torzítás nélküli mintavétel
  while (out.length < n) { crypto.getRandomValues(buf); if (buf[0] < lim) out.push(LONG[buf[0] % LONG.length]); }
  return out.join(sep);
}
self.OlupanPw = {
  check(pw, inputs) {
    pw = String(pw || '').slice(0, 256); const r = z.check(pw, inputs || []); let bits = r.guessesLog10 * Math.log2(10);
    /* Csak listaszavakból álló jelmondat: a pontos érték szószám × log2(listaméret) – a zxcvbn ezt túlbecsülné */
    const t = deacc(pw.toLowerCase()).split(/[\s\-_.,;:+]+/).filter(Boolean);
    if (t.length >= 2 && t.every(w => DS.has(w))) bits = Math.min(bits, t.length * Math.log2(t.every(w => SS.has(w)) ? SHORT.length : LONG.length));
    return { score: r.score, bits: Math.round(bits) };
  },
  generate, words: LONG.length, bitsPerWord: Math.log2(LONG.length)
};
