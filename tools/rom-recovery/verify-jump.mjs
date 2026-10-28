import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>JSON.parse(fs.readFileSync(new URL('./.work/jump-'+name+'.json',import.meta.url)));
const held=read('null');
assert.equal(held.rows[0].v,-4.75);
assert.equal(held.rows[1].y-held.rows[0].y,-4.75);
assert.equal(Math.min(...held.rows.map(r=>r.y)),128);
assert.deepEqual(held.rows.filter((r,i)=>i&&r.s===0&&held.rows[i-1].s!==0).map(r=>r.t),[41]);
assert.deepEqual(held.sounds,[{t:41,a:27}]);
assert.deepEqual(held.traces.find(p=>p.y===0).row.slice(0,5),[2,12,249,7,7]);
assert.deepEqual(held.traces.find(p=>p.y===1).row.slice(0,4),[1,246,249,14]);
for(const release of [2,6,12]){
 const a=read(release).rows;
 assert.equal(a[release-1].v,0);
 assert.equal(a[release-1].y-a[release-2].y,a[release-2].v);
 assert.equal(a[release].y,a[release-1].y);
 assert.equal(a[release].v,.25);
}
console.log('Jump replay assertions passed: held trajectory, release-after-movement cut, no automatic re-jump, landing-only SFX, floor/ceiling tables.');
