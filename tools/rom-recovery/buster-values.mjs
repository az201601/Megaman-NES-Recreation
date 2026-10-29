// MM5 basic-buster input/motion probes. Original ROM via JSNES2.1.0.
// Natural player state except explicitly marked facing/continuous-ladder setup.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 {name:'standing right',schedule:{1:['B'],2:[]}},
 {name:'standing left',left:true,schedule:{1:['B'],2:[]}},
 {name:'turn after firing',schedule:{1:['B'],2:['LEFT']}},
 {name:'hold B briefly',schedule:{1:['B'],9:[]}},
 {name:'rapid taps',schedule:Object.fromEntries(Array.from({length:36},(_,i)=>[i+1,i%2===0?['B']:[]]))},
 {name:'walk right and fire',schedule:{1:['RIGHT'],7:['RIGHT','B'],8:['RIGHT']}},
 {name:'walk left and fire',schedule:{1:['LEFT'],7:['LEFT','B'],8:['LEFT']}},
 {name:'jump and fire',schedule:{1:['A'],5:['A','B'],6:['A']}},
 {name:'ladder hold and fire',ladder:true,schedule:{3:['B'],4:[]}},
 {name:'ladder left and fire',ladder:true,schedule:{3:['LEFT','B'],4:[]}},
 {name:'ladder up and fire',ladder:true,schedule:{1:['UP'],3:['UP','B'],4:['UP']}},
 {name:'ladder down and fire',ladder:true,schedule:{1:['DOWN'],3:['DOWN','B'],4:['DOWN']}},
 {name:'slide and tap B',schedule:{1:['DOWN','A'],2:[],5:['B'],6:[]}},
 {name:'slide start with B',schedule:{1:['DOWN','A','B'],2:[]}},
];
const results=[];
for(const c of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<30;t++)n.frame();
 const m=n.cpu.mem;assert.equal(m[0x32],0,'Normal buster selected');assert.equal(m[0xaf],0);
 if(c.left){m[0x31]=2;m[0x420]=2;m[0x528]&=0xdf;}
 if(c.ladder){
  m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;m[0x3d8]=0x4c;m[0x3f0]=1;
 }
 let update=0;const births=[],writes=[],sounds=[];
 const cpuWrite=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{
  if(c.ladder&&a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db)v=0x20;
  if(a>=0x301&&a<=0x303&&v===0x70)births.push({t:update,slot:a-0x300,playerX:m[0x330]+m[0x318]/256,playerY:m[0x378]+m[0x360]/256});
  if((a>=0x331&&a<=0x333)||(a>=0x379&&a<=0x37b))writes.push({t:update,a,v,pc:n.cpu.REG_PC,playerX:m[0x330],playerY:m[0x378]});
  return cpuWrite(a,v);
 };
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t:update,command:n.cpu.REG_ACC});return emulate();};
 const rows=[];
 for(update=1;update<=40;update++){
  if(c.schedule[update]){for(let b=0;b<8;b++)n.buttonUp(1,b);for(const k of c.schedule[update])n.buttonDown(1,Controller['BUTTON_'+k]);}
  n.frame();
  rows.push({t:update,state:m[0x30],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,shoot:m[0x34],shootTimer:m[0x33],animation:m[0x558],
   shots:[1,2,3].filter(i=>m[0x300+i]===0x70).map(i=>({slot:i,x:m[0x348+i]*256+m[0x330+i]+m[0x318+i]/256,y:m[0x378+i],speed:m[0x3c0+i]+m[0x3a8+i]/256,facing:m[0x420+i],animation:m[0x558+i]}))});
 }
 results.push({name:c.name,controlledLadder:!!c.ladder,controlledFacing:!!c.left,births,writes,sounds,rows});
 console.log(c.name,JSON.stringify({births,sounds,firstShot:rows.find(r=>r.shots.length),last:rows[39]}));
}
fs.writeFileSync(new URL('./.work/buster-values.json',import.meta.url),JSON.stringify(results,null,2));

const get=name=>results.find(r=>r.name===name);
const speed=0x0433/256;
for(const c of results){
 for(const row of c.rows)for(const shot of row.shots){assert.equal(shot.speed,speed);assert.equal(shot.animation,0x18);}
 for(let t=1;t<c.rows.length;t++)for(const shot of c.rows[t].shots){
  const prev=c.rows[t-1].shots.find(p=>p.slot===shot.slot);
  if(prev&&!c.births.some(b=>b.t===c.rows[t].t&&b.slot===shot.slot))
   assert.equal(shot.x-prev.x,shot.facing===1?speed:-speed,c.name+' bullet movement');
 }
 for(const birth of c.births){
  const row=c.rows[birth.t-1],shot=row.shots.find(p=>p.slot===birth.slot);
  assert.ok(shot);
  const spawn=c.writes.find(w=>w.t===birth.t&&w.a===0x330+birth.slot);
  const spawnY=c.writes.find(w=>w.t===birth.t&&w.a===0x378+birth.slot);
  assert.ok(spawn&&spawnY);
  assert.equal(spawn.v,Math.floor(birth.playerX)+(shot.facing===1?16:-15));
  assert.equal(spawnY.v,Math.floor(birth.playerY)-1);
  assert.equal(shot.x,spawn.v+(shot.facing===1?speed:-speed));
  assert.equal(row.shootTimer,16);
 }
 assert.equal(c.sounds.filter(s=>s.command===0x1a).length,c.births.length,c.name+' shot sound count');
}
assert.equal(get('standing right').births.length,1);
assert.equal(get('standing left').births.length,1);
assert.equal(get('hold B briefly').births.length,1);
const single=get('standing right').rows;
assert.ok(single.slice(0,16).every(r=>r.shoot===1));assert.equal(single[16].shoot,0);
const rapid=get('rapid taps');
assert.deepEqual(rapid.births.slice(0,3).map(b=>[b.t,b.slot]),[[1,3],[3,2],[5,1]]);
assert.ok(rapid.rows.every(r=>r.shots.length<=3));
assert.equal(rapid.births[3].t,29);
assert.ok(!rapid.births.some(b=>b.t>=7&&b.t<=27));
assert.equal(rapid.rows[6].shootTimer,14,'Blocked fourth shot must not refresh pose');
for(const name of ['walk right and fire','walk left and fire','jump and fire','ladder hold and fire','ladder left and fire','ladder up and fire','ladder down and fire'])assert.equal(get(name).births.length,1);
assert.equal(get('jump and fire').rows[4].state,1);
for(const [name,delta] of [['ladder up and fire',-1.296875],['ladder down and fire',1.296875]]){
 const rows=get(name).rows;
 assert.ok(rows.slice(2,18).every(r=>r.state===3&&r.y===rows[1].y&&r.shoot===1));
 assert.equal(rows[18].y-rows[17].y,delta);
}
assert.equal(get('ladder left and fire').rows[2].shots[0].facing,2);
for(const name of ['slide and tap B','slide start with B']){
 assert.equal(get(name).births.length,0);assert.equal(get(name).rows[4].state,2);
}
assert.ok(get('turn after firing').rows.flatMap(r=>r.shots).every(s=>s.facing===1));
console.log('Buster assertions passed: speed0433, spawn offsets and same-update movement, three-slot limit/no blocked refresh, fresh input, pose16, walking/air support, ladder freeze16 and no slide shooting.');
