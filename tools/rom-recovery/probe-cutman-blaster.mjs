// Reference only. Supplied USA ROM; controlled safe approach, not natural traversal.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {NES,Controller as C} from 'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const output=new URL('Assets/Enemies/MM1/Blaster/Reference/',root);
const source=fs.readFileSync(new URL('mm1-bank5.s',work),'utf8');
const spans=[];
for(const match of source.matchAll(/\/\* ([0-9A-F]{5}): ([0-9A-F ]+) \*\//g)){
 const offset=parseInt(match[1],16);
 if(offset<0x16f26||offset>0x16fb4)continue;
 const hex=match[2].trim().replaceAll(' ','').toLowerCase();
 assert.equal(rom.subarray(offset+16,offset+16+hex.length/2).toString('hex'),hex);
 spans.push({offset:offset+16,hex});
}
assert.equal(spans.reduce((s,v)=>s+v.hex.length/2,0),143);
const saved=JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work)));
const n=new NES({emulateSound:false}); n.loadROM(rom.toString('binary'));n.fromJSON(saved);
for(let b=0;b<8;b++)n.buttonUp(1,b);
n.buttonDown(1,C.BUTTON_RIGHT);
let frame=0,stopped=false,records=null;
const ai=[],shots=[],speeds=[],spawns=[];
function object(i){const m=n.cpu.mem;return{slot:i,type:m[0x6e0+i],x:m[0x480+i]+256*m[0x460+i],y:m[0x600+i],state:m[0x440+i],timer:m[0x640+i],flags:m[0x420+i],life:m[0x6c0+i],age:m[0x6a0+i]};}
const emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 const pc=n.cpu.REG_PC+1,m=n.cpu.mem,x=n.cpu.REG_X;
 if(pc===0xd9ad){
  const ptr=(m[6]|m[7]<<8)+n.cpu.REG_Y-4;
  spawns.push({frame,type:n.cpu.REG_ACC,x:m[0]+256*m[5],y:m[1],camera:m[0x1a]+256*m[0x1b]});
  if(!records){records=[];const base=ptr-x*4;
   for(let i=0;i<128;i++){const r=Array.from({length:4},(_,j)=>n.mmap.load(base+i*4+j));if(r[0]===255)break;records.push({index:i,page:r[0],x:r[1],y:r[2],type:r[3]});}
  }
 }
 if(pc===0xaf26)ai.push({frame,...object(x)});
 if(pc===0xf663&&n.cpu.REG_ACC===0x2d)shots.push({frame,parent:object(m[0x2f])});
 if(pc===0xf533&&m[0x6e0+x]===0x2d)speeds.push({frame,index:n.cpu.REG_Y,object:object(x)});
 return emulate();
};
for(frame=1;frame<=1200;frame++){
 const m=n.cpu.mem;
 // Same explicitly controlled safe-Y fixture as earlier scrolling probes.
 m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;
 if(!stopped&&m[0x480]+256*m[0x460]>=700){n.buttonUp(1,C.BUTTON_RIGHT);stopped=true;}
 n.frame();
}
assert.ok(stopped);assert.ok(ai.length>500);assert.ok(shots.length>=8);
const first=spawns.find(v=>v.type===0x0b);assert.equal(first.x,824);assert.equal(first.y,72);
const firstSlot=ai[0].slot,firstX=ai[0].x;
const rows=ai.filter(v=>v.slot===firstSlot&&v.x===firstX);
const transitions=rows.filter((r,i)=>i===0||r.state!==rows[i-1].state).map(({frame,state,timer,life,age})=>({frame,state,timer,life,age}));
const attempts=shots.filter(v=>v.parent.slot===firstSlot&&v.parent.x===firstX);
const groups=[];for(const v of attempts){let g=groups.at(-1);if(!g||v.frame-g.at(-1).frame>40){g=[];groups.push(g);}g.push(v);}
const complete=groups.filter(g=>g.length===4);
assert.ok(complete.length>=2,'At least two four-shot bursts');
for(const g of complete)assert.deepEqual(g.map(v=>v.parent.timer),[0,32,64,96]);
assert.deepEqual([...new Set(speeds.map(v=>v.index))].sort((a,b)=>a-b),[12,16,20,24]);
const report={romSha256:createHash('sha256').update(rom).digest('hex'),method:'JSNES 2.1.0 supplied USA ROM. Original AI runs unmodified. Player Y36/vertical fraction and speed0/protection100 forced each frame, Right until X700 then released. This is controlled camera approach and stationary observation, NOT natural traversal, GMS runtime, damage/vulnerability or audio/art certification.',externalSource:'TheRealQuantam/mm1base 9c1cb05bd1d63c176e1930053dda76bcb85cd977 labels AI_Beak. All143 bytes AF26..AFB4 match supplied USA ROM; modified source project is never executed.',verifiedBytes:143,spans,firstSpawn:first,records:records.filter(v=>[0x0b,0x17,0x22,0x23].includes(v.type)),aiUpdates:rows.length,transitions,shotAttempts:attempts,speedInitializations:speeds,completeBursts:complete.length};
fs.mkdirSync(output,{recursive:true});fs.writeFileSync(new URL('native-blaster-cycle.json',output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({verifiedBytes:143,firstSpawn:first,aiUpdates:rows.length,transitions:transitions.slice(0,16),burstTimers:complete.map(g=>g.map(v=>v.parent.timer)),speedIndices:[...new Set(speeds.map(v=>v.index))]},null,2));
