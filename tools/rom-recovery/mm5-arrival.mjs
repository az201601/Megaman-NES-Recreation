// Natural Napalm Man start from existing stage-select snapshot. No player/ROM patches.
import {NES,Controller} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const n=new NES();n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm5-state.json',work))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
n.buttonDown(1,Controller.BUTTON_RIGHT);n.frame();n.buttonUp(1,Controller.BUTTON_RIGHT);
for(let i=0;i<3;i++)n.frame();
let t=0;const sounds=[],rows=[],states=[];
const emulate=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t,command:n.cpu.REG_ACC});return emulate();};
n.buttonDown(1,Controller.BUTTON_START);
for(t=1;t<=850;t++){
 if(t===2)n.buttonUp(1,Controller.BUTTON_START);
 n.frame();const m=n.cpu.mem;
 rows.push({t,state:m[0x30],actor:m[0x300],x:m[0x348]*256+m[0x330]+m[0x318]/256,y:m[0x378]+m[0x360]/256,animation:m[0x558],phase:m[0x540],timer:m[0x570],gravity:m[0xaf],camera:m[0xfc]});
 if(t===1||rows.at(-1).state!==rows.at(-2).state||rows.at(-1).animation!==rows.at(-2).animation)console.log(rows.at(-1));
 if(t===556||(m[0x30]!==0&&m[0x300]!==0&&t>200))states.push({t,snapshot:n.toJSON()});
}
fs.writeFileSync(new URL('mm5-arrival.json',work),JSON.stringify({sounds,rows},null,2));
// Large snapshots kept ignored; later extraction can choose exact pre-render updates.
fs.writeFileSync(new URL('mm5-arrival-snapshots.json',work),JSON.stringify(states));
assert.equal(rows.at(-1).gravity,0);
console.log('Sound requests',sounds);

const at=t=>rows[t-1];
assert.ok(rows.slice(571,689).every(r=>r.actor===1&&r.state===8));
assert.equal(at(661).animation,26);assert.equal(at(662).animation,19);
for(let k=1;k<=17;k++)assert.equal(at(661+k).y,8*k+.25*k*(k+1)/2);
assert.equal(at(679).y,180.75);assert.equal(at(679).phase,0);
for(const [t,phase] of [[680,1],[683,2],[686,3],[689,4]])assert.equal(at(t).phase,phase);
assert.equal(at(690).state,0);assert.equal(at(690).animation,1);
assert.deepEqual(sounds.filter(s=>s.t>=662),[{t:679,command:45}]);
console.log('PASS: natural Napalm neutral arrival: descent18 updates, materialization phases, sound2D, idle690. Input arbitration/other spawn heights NOT yet certified.');
