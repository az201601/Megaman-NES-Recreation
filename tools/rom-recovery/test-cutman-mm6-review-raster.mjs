// Run after renderer --runtime-art and test-cutman-weapon-demo --export.
// Compare actual-GML raster to approved Python review across408 sampled frames.
import fs from'node:fs';import assert from'node:assert/strict';import{PNG}from'pngjs';
const work=new URL('./.work/',import.meta.url);let exact=0,maxDelta=0;
for(let i=0;i<408;i++){const file=String(i).padStart(3,'0')+'.png',a=PNG.sync.read(fs.readFileSync(new URL('mm6-approved-raster/'+file,work))),b=PNG.sync.read(fs.readFileSync(new URL('weapon-demo-preview/'+file,work)));assert.equal(a.width,b.width);assert.equal(a.height,b.height);let same=true;for(let k=0;k<a.data.length;k++){const d=Math.abs(a.data[k]-b.data[k]);assert.ok(d<=1,`frame${i} component${k} delta${d}`);maxDelta=Math.max(maxDelta,d);if(d)same=false;}if(same)exact++;}
console.log(`PASS408 approved-review vs actual-GML frames,${exact} byte-identical;maximum channel delta${maxDelta} (original MM5 off-white glyphs/integer tint rounding). No geometry/timing differences.`);
