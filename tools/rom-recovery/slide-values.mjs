// Controlled normal-gravity MM5 slide probes. Real grounded state/input entry;
// synthetic spatial class-$10 terrain, not a natural tunnel encounter.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 {name:'tap Down+A',schedule:{3:['DOWN','A'],4:[]}},
 {name:'hold Down+A',schedule:{3:['DOWN','A']}},
 {name:'Down then fresh A',schedule:{2:['DOWN'],3:['DOWN','A'],4:[]}},
 {name:'A then Down',schedule:{2:['A'],3:['DOWN','A']}},
 {name:'left direction at start',schedule:{3:['DOWN','A','LEFT'],4:[]}},
 {name:'opposite direction at 8',schedule:{3:['DOWN','A'],4:[],8:['LEFT']}},
 {name:'fresh A at 8',schedule:{3:['DOWN','A'],4:[],8:['A']}},
 {name:'fresh Down+A at 8',schedule:{3:['DOWN','A'],4:[],8:['DOWN','A']}},
 {name:'low ceiling extends slide',ceiling:true,schedule:{3:['DOWN','A'],4:[]}},
 {name:'low ceiling blocks jump at 18',ceiling:true,schedule:{3:['DOWN','A'],4:[],18:['A']}},
 {name:'wall stops slide',wall:true,schedule:{3:['DOWN','A'],4:[]}},
 {name:'slide off edge',edge:true,schedule:{3:['DOWN','A'],4:[]}},
];
const results=[];
for(const c of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let t=0;t<30;t++)n.frame();for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;m[0x30]=0;m[0x330]=136;m[0x318]=0;m[0x348]=0;
 m[0x378]=180;m[0x360]=0;m[0x390]=0;m[0x3d8]=0;m[0x3f0]=0;
 m[0x31]=1;m[0x420]=1;m[0x528]|=0x20;
 let update=0,terrainReads=0;const soundRequests=[],queries=[];
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{
  const pc=n.cpu.REG_PC;
  if(pc===0xec5c)soundRequests.push({update,command:n.cpu.REG_ACC,returnPC:m[0x100+((n.cpu.REG_SP+1)&255)]|m[0x100+((n.cpu.REG_SP+2)&255)]<<8});
  if(n.cpu.REG_X===0&&(pc===0xc550||pc===0xc658)){
   assert.equal(n.mmap.load(pc+1),0x29);assert.equal(n.mmap.load(pc+2),0xf0);
   const x=m[0x12],y=m[0x11];
   const solid=(y>=192&&(!c.edge||x<176))
     ||(c.ceiling&&x>=160&&x<224&&y>=160&&y<176)
     ||(c.wall&&x>=176);
   n.cpu.REG_ACC=solid?0x10:0;terrainReads++;
   if(update>=3&&update<=4)queries.push({update,pc,x,y,solid});
  }
  return emulate();
 };
 // Settle on the synthetic floor before testing fresh grounded input.
 for(let t=0;t<8;t++)n.frame();
 soundRequests.length=0;queries.length=0;
 const rows=[];
 for(update=1;update<=48;update++){
  if(c.schedule[update]){for(let b=0;b<8;b++)n.buttonUp(1,b);for(const k of c.schedule[update])n.buttonDown(1,Controller['BUTTON_'+k]);}
  n.frame();rows.push({t:update,state:m[0x30],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,timer:m[0x35],anim:m[0x558],frame:m[0x540],pressed:m[0x14],held:m[0x16]});
 }
 assert.ok(terrainReads>0);
 results.push({name:c.name,soundRequests,queries,rows});
 console.log(c.name,JSON.stringify(rows.filter((r,i)=>i<4||r.state!==rows[i-1].state||[8,18,27,28,29,40].includes(r.t))),JSON.stringify(soundRequests));
}
fs.writeFileSync(new URL('./.work/slide-values.json',import.meta.url),JSON.stringify(results,null,2));

const get=name=>results.find(r=>r.name===name).rows;
const tap=get('tap Down+A');
assert.equal(tap[1].state,0);
for(let i=2;i<27;i++){
 assert.equal(tap[i].state,2);
 assert.equal(tap[i].x-tap[i-1].x,2.5);
 assert.equal(tap[i].timer,27-i);
}
assert.equal(tap[27].state,0);assert.equal(tap[27].timer,0);
assert.equal(tap[27].x-tap[1].x,65);
assert.equal(tap[2].y-tap[1].y,2);
assert.equal(tap[27].y,tap[1].y);
assert.deepEqual(get('hold Down+A').map(r=>[r.state,r.x,r.y,r.timer]),tap.map(r=>[r.state,r.x,r.y,r.timer]));
assert.equal(get('Down then fresh A')[2].state,2);
assert.ok(get('A then Down').every(r=>r.state!==2));
assert.equal(get('A then Down')[1].state,1);
assert.equal(get('left direction at start')[2].x,133.5);
assert.equal(get('opposite direction at 8')[7].state,0);
assert.equal(get('opposite direction at 8')[7].x-get('opposite direction at 8')[6].x,-2.5);
assert.equal(get('fresh A at 8')[7].state,1);
assert.equal(get('fresh A at 8')[7].y-get('fresh A at 8')[6].y,-5);
assert.equal(get('fresh Down+A at 8')[7].state,2);
assert.equal(get('low ceiling extends slide')[27].state,2);
assert.equal(get('low ceiling extends slide')[27].timer,0);
assert.ok(get('low ceiling extends slide').slice(28,40).every(r=>r.state===2));
assert.equal(get('low ceiling extends slide')[45].state,0);
assert.equal(get('low ceiling blocks jump at 18')[17].state,2);
assert.equal(get('wall stops slide')[11].state,0);
assert.ok(get('wall stops slide')[11].timer>0);
assert.equal(get('slide off edge')[24].state,0);
assert.equal(get('slide off edge')[25].state,1);
console.log('Slide assertions passed: fresh input, speed, 26 moves / 65px, release/hold, direction cancel, jump cancel, tunnel extension, wall and edge transitions.');
