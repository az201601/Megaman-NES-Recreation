// Controlled original-ROM ladder release / directional-input matrix.
// A synthetic continuing ladder supplies class $20 at original terrain writes.
// Fresh input is preceded by two neutral ladder updates; no ROM code is patched.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
const snapshot=JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)));
const cases=[
 ['A', {3:['A']}],
 ['LEFT+A', {3:['LEFT','A']}],
 ['RIGHT+A', {3:['RIGHT','A']}],
 ['UP+A', {3:['UP','A']}],
 ['DOWN+A', {3:['DOWN','A']}],
 ['A then LEFT', {3:['A'],4:['A','LEFT']}],
 ['A then RIGHT', {3:['A'],4:['A','RIGHT']}],
 ['A then UP next update', {3:['A'],4:['A','UP']}],
 ['A then UP after falling update', {3:['A'],5:['A','UP']}],
 ['A then DOWN', {3:['A'],4:['A','DOWN']}],
 ['UP+A then release UP, repress A', {3:['UP','A'],4:['A'],5:[],6:['A']}],
];
const results=[];
for(const [name,schedule] of cases){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snapshot));
 for(let t=0;t<30;t++)n.frame();
 for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;
 m[0x30]=3;m[0x330]=136;m[0x318]=0;m[0x378]=140;m[0x360]=0;
 m[0x3d8]=0x4c;m[0x3f0]=1;
 let injections=0;
 const write=n.cpu.write.bind(n.cpu);
 n.cpu.write=(a,v)=>{
  if(a>=0x48&&a<=0x4a&&n.cpu.REG_X===0&&n.cpu.REG_PC>=0xc4a1&&n.cpu.REG_PC<0xc6db){v=0x20;injections++;}
  return write(a,v);
 };
 const rows=[];
 for(let t=1;t<=9;t++){
  if(schedule[t]){
   for(let b=0;b<8;b++)n.buttonUp(1,b);
   for(const key of schedule[t])n.buttonDown(1,Controller['BUTTON_'+key]);
  }
  n.frame();
  const engineV=(m[0x3f0]>127?m[0x3f0]-256:m[0x3f0])+m[0x3d8]/256;
  rows.push({t,x:m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,state:m[0x30],downwardVelocity:-engineV,held:m[0x16],pressed:m[0x14]});
 }
 assert.ok(injections>0);
 results.push({name,rows});
 console.log(name,rows.slice(2,7).map(r=>({t:r.t,x:r.x,y:r.y,state:r.state,v:r.downwardVelocity})));
}
const get=name=>results.find(r=>r.name===name).rows;
for(const name of ['A','LEFT+A','RIGHT+A']){
 assert.equal(get(name)[2].state,0);
 assert.equal(get(name)[2].y,140);
 assert.equal(get(name)[2].downwardVelocity,1);
 assert.equal(get(name)[3].state,1);
 assert.equal(get(name)[3].y,141);
}
for(const name of ['UP+A','DOWN+A'])assert.ok(get(name).every(r=>r.state===3));
assert.equal(get('UP+A then release UP, repress A')[3].state,3);
assert.equal(get('UP+A then release UP, repress A')[5].state,0);
for(const name of ['LEFT+A','A then LEFT'])assert.equal(get(name)[3].x,136-1.296875);
for(const name of ['RIGHT+A','A then RIGHT'])assert.equal(get(name)[3].x,136+1.296875);
assert.equal(get('A then UP next update')[3].state,3);
assert.equal(get('A then UP after falling update')[4].state,3);
assert.equal(get('A then DOWN')[3].state,1);
assert.equal(get('A then DOWN')[4].y,get('A')[4].y);
fs.writeFileSync(new URL('./.work/ladder-release.json',import.meta.url),JSON.stringify(results,null,2));
console.log('Fresh-release and simultaneous-input assertions passed. Endpoint and ladder-top class $40 cases are not covered.');
