// Controlled MM5 slide/ceiling/ledge combination, original player routines.
// Synthetic platform [16,80)x[160,176), lower floor192, optional roof
// [48,112)x[128,144). This is not a natural stage/metatile encounter.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snap=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 {name:'open ledge, neutral',roof:false},
 {name:'overhang, neutral',roof:true},
 {name:'overhang, hold Right',roof:true,right:true},
 {name:'overhang, Left after release',roof:true,left:true},
];
const results=[];
for(const c of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));
 for(let t=0;t<30;t++)n.frame();for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;m[0x30]=0;m[0x330]=32;m[0x318]=0;m[0x348]=0;
 m[0x378]=148;m[0x360]=0;m[0x390]=0;m[0x3d8]=0;m[0x3f0]=0;
 m[0x31]=1;m[0x420]=1;m[0x528]|=0x20;
 assert.equal(m[0xaf],0,'Normal gravity required');
 let update=0,reads=0;const requests=[],queries=[];
 const emulate=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{
  const pc=n.cpu.REG_PC;
  if(pc===0xec5c)requests.push({update,command:n.cpu.REG_ACC});
  if(n.cpu.REG_X===0&&(pc===0xc550||pc===0xc658)){
   assert.equal(n.mmap.load(pc+1),0x29);assert.equal(n.mmap.load(pc+2),0xf0);
   const x=m[0x12],y=m[0x11];
   const solid=y>=192||(x>=16&&x<80&&y>=160&&y<176)
     ||(c.roof&&x>=48&&x<112&&y>=128&&y<144);
   n.cpu.REG_ACC=solid?0x10:0;reads++;
   if(update>=25&&update<=34)queries.push({update,pc,x,y,solid});
  }
  return emulate();
 };
 for(let t=0;t<8;t++)n.frame();
 assert.equal(m[0x30],0);
 requests.length=0;
 const rows=[];
 for(update=1;update<=48;update++){
  if(update===3){n.buttonDown(1,Controller.BUTTON_DOWN);n.buttonDown(1,Controller.BUTTON_A);}
  if(update===4){n.buttonUp(1,Controller.BUTTON_DOWN);n.buttonUp(1,Controller.BUTTON_A);}
  if(update===20&&c.right)n.buttonDown(1,Controller.BUTTON_RIGHT);
  if(update===29&&c.left)n.buttonDown(1,Controller.BUTTON_LEFT);
  n.frame();
  const engineV=(m[0x3f0]>127?m[0x3f0]-256:m[0x3f0])+m[0x3d8]/256;
  rows.push({t:update,state:m[0x30],x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,
   anim:m[0x558],timer:m[0x35],downwardVelocity:-engineV});
 }
 assert.ok(reads>0);
 results.push({name:c.name,rows,requests,queries});
 console.log(c.name,JSON.stringify(rows.filter((r,i)=>i===2||(r.t>=25&&r.t<=35)||r.state!==rows[i-1]?.state)));
}
fs.writeFileSync(new URL('./.work/slide-ceiling-ledge.json',import.meta.url),JSON.stringify(results,null,2));

const get=name=>results.find(r=>r.name===name).rows;
const open=get('open ledge, neutral'),covered=get('overhang, neutral');
assert.deepEqual(covered,open,'Neutral fall trace must not retain slide under the roof');
for(const {name,rows} of results){
 assert.ok(rows.every(r=>[0,1,2].includes(r.state)),name+' unexpected damage/death state');
 assert.equal(rows[26].state,2);assert.equal(rows[26].anim,0x10);
 assert.equal(rows[26].x,94.5);assert.equal(rows[26].timer,1);
 assert.equal(rows[27].state,0);assert.equal(rows[27].anim,4);
 assert.equal(rows[27].x,rows[26].x);
 assert.equal(rows[27].y-rows[26].y,1);
 assert.equal(rows[28].state,1);assert.equal(rows[28].anim,7);
 assert.equal(rows[28].y-rows[27].y,.25);
 assert.equal(rows[42].state,0);assert.equal(rows[42].y,180.25);
}
// Normal falling is already selected while the reference still overlaps roof height.
assert.ok(covered[28].y-10<144&&covered[28].y-10>=128);
assert.equal(get('overhang, hold Right')[28].x,88.796875);
assert.equal(get('overhang, Left after release')[28].x,104.203125);
console.log('Passed: support loss overrides ceiling stand-clearance; slide ends before timer expiry and normal air animation follows. Horizontal correction differs from neutral, not an assertion of natural-stage tolerances.');
