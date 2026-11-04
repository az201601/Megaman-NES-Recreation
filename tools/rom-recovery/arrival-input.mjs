// Original arrival handler, natural snapshot. Inputs changed only.
import {NES,Controller} from 'jsnes';import fs from 'node:fs';import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),ss=JSON.parse(fs.readFileSync(new URL('mm5-arrival-snapshots.json',work)));
const out=[];
for(const key of ['RIGHT','A','B','DOWN'])for(const press of [573,690,691]){
 const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(structuredClone(ss.find(s=>s.t===572).snapshot));for(let b=0;b<8;b++)n.buttonUp(1,b);
 const rows=[],sounds=[];let t=573;const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t,cmd:n.cpu.REG_ACC});return em();};
 for(;t<=696;t++){if(t===press)n.buttonDown(1,Controller['BUTTON_'+key]);n.frame();const m=n.cpu.mem;rows.push({t,state:m[0x30],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,charge:m[0x38],pose:m[0x33]});}
 out.push({key,press,sounds,rows});
 assert.ok(rows.filter(r=>r.t<=690).every(r=>r.x===128&&r.charge===0&&r.pose===0));
 console.log(key,press,rows.filter(r=>r.t>=689),sounds);
}
fs.writeFileSync(new URL('arrival-input.json',work),JSON.stringify(out,null,2));
for(const c of out){
 const r=c.rows.find(r=>r.t===691);
 if(c.key==='RIGHT')assert.equal(r.x,129.296875);
 if(c.key==='A')assert.equal(r.y,c.press===691?175.5:180.5);
 if(c.key==='B'){
  assert.equal(r.charge,c.press===691?0:1);assert.equal(r.pose,c.press===691?16:0);
  assert.deepEqual(c.sounds.map(s=>s.cmd),c.press===691?[45,26]:[45]);
 }
}
console.log('PASS:12 independently cloned arrival input cases; no buffering fresh A/B, held B begins charging without initial shot after unlock.');
