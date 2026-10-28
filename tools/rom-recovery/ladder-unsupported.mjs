// Controlled ROM ladder [96,160), optional removable floor [160,176).
// Raw class injection feeds original movement AND body lookup paths.
// This simulates terrain support removal, NOT the game's object pickup routine.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 {name:'down off end',y:140,down:1},
 {name:'neutral at foot level without support',y:148,down:7},
 {name:'remove support while attached then descend',y:148,down:7,remove:3},
 {name:'last upper probe still inside',y:170,down:7},
 {name:'no body probe inside',y:171,down:99},
];
const results=[];
for(const c of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let t=0;t<30;t++)n.frame();for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=c.y;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
 let update=0,reads=0;const soundRequests=[];
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{
  const pc=n.cpu.REG_PC;
  if(pc===0xec5c)soundRequests.push({update,command:n.cpu.REG_ACC});
  if(n.cpu.REG_X===0&&(pc===0xc550||pc===0xc658)){
   assert.equal(n.mmap.load(pc+1),0x29);assert.equal(n.mmap.load(pc+2),0xf0);
   const py=m[0x11];
   const solid=c.remove&&update<c.remove&&py>=160&&py<176;
   n.cpu.REG_ACC=solid?0x10:py>=96&&py<160?0x20:0;reads++;
  }
  return emulate();
 };
 const rows=[];
 for(update=1;update<=(c.y>=170?12:30);update++){
  if(update===c.down)n.buttonDown(1,Controller.BUTTON_DOWN);
  n.frame();rows.push({t:update,y:m[0x378]+m[0x360]/256,state:m[0x30],fall:-(m[0x3f0]>127?m[0x3f0]-256:m[0x3f0])-m[0x3d8]/256});
 }
 assert.ok(reads>0);assert.deepEqual(soundRequests,[]);
 results.push({name:c.name,rows});
 console.log(c.name,JSON.stringify(rows.filter((r,i)=>i<8||r.state!==rows[i-1].state)));
}
fs.writeFileSync(new URL('./.work/ladder-unsupported.json',import.meta.url),JSON.stringify(results,null,2));

const get=name=>results.find(r=>r.name===name).rows;
for(const name of ['neutral at foot level without support','remove support while attached then descend']){
 const rows=get(name);assert.ok(rows.slice(0,6).every(r=>r.state===3&&r.y===148));
 assert.equal(rows[6].y,149.296875);
}
assert.deepEqual(get('neutral at foot level without support'),get('remove support while attached then descend'));
for(const {rows} of results){
 const i=rows.findIndex(r=>r.state===0);assert.ok(i>=0);
 assert.ok(rows[i].y>=171);assert.equal(rows[i].fall,1);
 assert.equal(rows[i+1].state,1);assert.equal(rows[i+1].y-rows[i].y,1);
 assert.equal(rows[i+1].fall,1.25);
}
assert.equal(get('last upper probe still inside')[0].state,3);
assert.equal(get('no body probe inside')[0].state,0);
console.log('Passed: neutral support removal holds, last upper probe retains attachment, body clearance releases into fall1, following update moves +1.');
