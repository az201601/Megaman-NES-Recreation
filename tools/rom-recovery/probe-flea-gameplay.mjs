// Supplied original-ROM Flea research. Controlled lead-in/positioning, no AI patch.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Flea/Reference/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const spans=[];for(const[file,lo,hi]of[['mm1-bank5.s',0x16bf6,0x16c5d],['mm1-bank7.s',0x1f533,0x1f54b],['mm1-bank7.s',0x1f63b,0x1f662],['mm1-bank5.s',0x17ec8,0x17ee8],['mm1-bank7.s',0x1da19,0x1da1b]])for(const m of fs.readFileSync(new URL(file,work),'utf8').matchAll(/\/\* ([0-9A-F]{5}): ([0-9A-F ]+) \*\//g)){const a=parseInt(m[1],16);if(a<lo||a>hi)continue;const hex=m[2].trim().replaceAll(' ','').toLowerCase();assert.equal(rom.subarray(a+16,a+16+hex.length/2).toString('hex'),hex);spans.push({offset:a+16,hex});}
const fixed=a=>rom[16+7*16384+a-0xc000],speedBytes=rom.subarray(16+0x1f54c,16+0x1f554);assert.equal(speedBytes.toString('hex'),'e004300100040003');spans.push({offset:16+0x1f54c,hex:speedBytes.toString('hex')});
const n=new NES({emulateSound:false});n.loadROM(rom.toString('binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('cutman-fourth-scroll/after-continuation.json',work))));for(let b=0;b<8;b++)n.buttonUp(1,b);
// One normal jump releases the native ladder; Right thereafter, Y/vertical speed
// pinned to36/0 and protection100 to bypass already researched terrain/combat.
n.buttonDown(1,C.BUTTON_A);n.frame();n.buttonUp(1,C.BUTTON_A);n.buttonDown(1,C.BUTTON_RIGHT);
let spawn=null,leadFrame=0;const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC+1===0xd9ad&&n.cpu.REG_ACC===2&&!spawn){const m=n.cpu.mem;spawn={frame:leadFrame,index:n.cpu.REG_X,x:m[0]+256*m[5],y:m[1],camera:m[0x1a]+256*m[0x1b]};}return emulate();};
for(leadFrame=1;leadFrame<=400&&!spawn;leadFrame++){const m=n.cpu.mem;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;n.frame();}assert.equal(spawn.x,2104);assert.equal(spawn.y,184);n.buttonUp(1,C.BUTTON_RIGHT);const snapshot=n.toJSON();fs.writeFileSync(new URL('flea-before-first-ai.json',work),JSON.stringify(snapshot));
const trials=[];
for(const delta of[-128,-40,0,40,128]){
 const e=new NES({emulateSound:false});e.loadROM(rom.toString('binary'));e.fromJSON(structuredClone(snapshot));for(let b=0;b<8;b++)e.buttonUp(1,b);const m=e.cpu.mem,slot=spawn.index;
 const rows=[],jumps=[],landings=[],sounds=[];let frame=0,skips=0,skipRow=null,choice=null;const em=e.cpu.emulate.bind(e.cpu);
 function row(){return{frame,clock:m[0x23],random:m[0x46],x:m[0x480+slot]+256*m[0x460+slot]+m[0x4a0+slot]/256,y:m[0x600+slot]+m[0x620+slot]/256,state:m[0x440+slot],timer:m[0x640+slot],vx:m[0x4c0+slot]*256+m[0x4e0+slot],vy:(m[0x680+slot]*256+m[0x660+slot])<<16>>16,flags:m[0x420+slot],hp:m[0x6c0+slot]};}
 e.cpu.emulate=()=>{const pc=e.cpu.REG_PC+1,x=e.cpu.REG_X;
  if(pc===0xabf6&&x===slot){skipRow=null;const r=row();rows.push(r);if(r.state>=16&&(r.clock&3)===0)skipRow=r;}
  if(pc===0xac52&&x===slot){choice=e.cpu.REG_Y;assert.ok(choice===0||choice===4);}
  if(pc===0xac55&&x===slot){const r=row();assert.equal(r.vx,choice===0?304:768);assert.equal(r.vy,choice===0?1248:1024);jumps.push({...r,choice});}
  if(pc===0xac23&&x===slot){const r=row();assert.ok(r.vy<0);landings.push(r);}
  if(pc===0xac3e&&x===slot&&skipRow){const r=row();for(const k of['x','y','vx','vy','state','timer'])assert.equal(r[k],skipRow[k]);skips++;skipRow=null;}
  if(pc===0xc477)sounds.push({frame,id:e.cpu.REG_ACC,source:m[0x2f],type:m[0x6e0+m[0x2f]]});
  return em();};
 for(frame=1;frame<=600;frame++){const px=2104+delta;m[0x480]=px&255;m[0x460]=px>>8;m[0x4a0]=0;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;e.frame();}
 assert.ok(rows.length>20);assert.equal(rows[0].hp,20);assert.equal(rows[0].timer,1);assert.equal(jumps[0].frame,1);assert.equal((jumps[0].flags&64)!==0,delta>=0);assert.ok(skips>5);assert.equal(sounds.filter(s=>s.type===2).length,0);
 // First native AI after each observed landing starts a15-update ground timer.
 for(const l of landings){const next=rows.find(r=>r.frame>l.frame);if(next){assert.equal(next.timer,15);assert.equal(next.vx,0);assert.ok(next.state<16);}}
 trials.push({delta,rows,jumps,landings,skips,sounds});
}
const tables={initialHp:20,normalDamage:fixed(0xfc51+2),contact:fixed(0xfe89+2),halfWidth:fixed(0xfb38+2),halfHeight:fixed(0xfc06+2)};assert.deepEqual(tables,{initialHp:20,normalDamage:20,contact:2,halfWidth:8,halfHeight:8});
const records=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Blader/Reference/native-blader-combat.json',root))).records.filter(r=>r.type===2);assert.equal(records.length,3);
const report={method:'Supplied MM1USA/JSNES2.1.0. Controlled four-ladder lead-in; one A then Right, Y36/verticalspeed0/protection100 pinned everyframe until original firstFlea spawn; snapshot at frame boundary before first Flea AI. Five600-update trials pin playerX=firstFleaX+delta,Y36/verticalspeed0/protection100 everyframe, neutral inputs, original enemy/RNG/terrain/spawn/sound code unmodified. Not natural traversal, charged-MM1 behavior, GMSruntime or hardware certification. Timers/speeds/direction/quarter-frame skips asserted at native CPU handlers; terrain contact trace recorded, not replaced with a free parabola.',romSha256:createHash('sha256').update(rom).digest('hex'),source:'TheRealQuantam/mm1base@9c1cb05bd1d63c176e1930053dda76bcb85cd977',verifiedBytes:spans.reduce((n,s)=>n+s.hex.length/2,0),spans,spawn,tables,records,hybridAnchors:records.map(r=>({x:r.page*256+r.x-1024,y:r.y+960,band:960})),trials};fs.writeFileSync(new URL('native-flea-gameplay.json',out),JSON.stringify(report,null,2)+'\n');console.log(report.verifiedBytes,'verified bytes',tables,report.hybridAnchors);console.log(trials.map(t=>({delta:t.delta,states:t.rows.length,jumps:t.jumps.map(j=>[j.frame,j.choice]),landings:t.landings.length,skips:t.skips,sounds:t.sounds})));
