// Locate original CHR font candidates. No generated replacement glyphs.
import fs from'node:fs';import{PNG}from'pngjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),r=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));
const chr=16+r[4]*16384;const pixels=t=>Array.from({length:64},(_,k)=>((r[chr+t*16+(k>>3)]>>(7-(k&7)))&1)|(((r[chr+t*16+8+(k>>3)]>>(7-(k&7)))&1)<<1));
const candidates=[];
for(let t=0;t<r[5]*8192/16;t++){
 const p=pixels(t),rows=Array.from({length:8},(_,y)=>p.slice(y*8,y*8+8).map(v=>v?1:0));
 const ys=rows.map((a,y)=>a.some(v=>v)?y:-1).filter(y=>y>=0);if(ys.length<6||ys.length>7)continue;
 const left=Math.min(...p.map((v,k)=>v?k%8:8)),right=Math.max(...p.map((v,k)=>v?k%8:-1));if(right-left<4||right-left>7)continue;
 // Capital-A-like stems/crossbar; visual identification still required.
 const bar=ys.find(y=>rows[y].slice(left,right+1).every(v=>v));if(bar===undefined||bar<ys[0]+2||bar>ys.at(-1)-1)continue;
 if(!ys.filter(y=>y>bar).every(y=>rows[y][left]&&rows[y][right]&&rows[y].slice(left+2,right-1).every(v=>!v)))continue;
 if(rows[ys[0]][left]||rows[ys[0]][right])continue;
 candidates.push(t);
}
const unique=[...new Set(candidates.map(t=>t>>8))];console.log('A candidates',candidates.map(t=>t.toString(16)),'banks',unique.map(t=>t.toString(16)));
for(const bank of unique){const p=new PNG({width:128,height:128});for(let i=0;i<256;i++)for(let k=0;k<64;k++){const v=pixels(bank*256+i)[k]?255:0;const x=(i%16)*8+(k%8),y=Math.floor(i/16)*8+(k>>3);p.data.set([v,v,v,255],(y*128+x)*4);}fs.writeFileSync(new URL(`mm5-font-bank-${bank.toString(16)}.png`,work),PNG.sync.write(p));}
fs.writeFileSync(new URL('mm5-font-candidates.json',work),JSON.stringify({chr,candidates,banks:unique}));
