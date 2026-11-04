// Static recorded-evidence/audio checks; not GMS runtime certification.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{PNG}from'pngjs';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Enemies/MM1/Blaster/',root),audio=new URL('Assets/Audio/Mega Man/MM1/Blaster/',root);
const hash=b=>createHash('sha256').update(b).digest('hex');
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const r=JSON.parse(fs.readFileSync(new URL('Reference/native-blaster-assets.json',base)));
assert.equal(r.romSha256,hash(rom));for(const s of r.spans)assert.equal(rom.subarray(s.offset,s.offset+s.hex.length/2).toString('hex'),s.hex);
const strip=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_blaster_strip4.png',base)));assert.equal(strip.width,64);assert.equal(strip.height,16);
for(const pose of r.art){const cell=Buffer.alloc(16*16*4);for(let y=0;y<16;y++)strip.data.copy(cell,y*64,(y*64+pose.index*16)*4,(y*64+pose.index*16+16)*4);assert.equal(hash(cell),pose.rgbaSha256);}
const bullet=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_blaster_bullet.png',base)));assert.equal(bullet.width,8);assert.equal(bullet.height,8);assert.equal(hash(bullet.data),r.bullet.rgbaSha256);
const closed=r.hits.find(t=>t.mode==='closed'),open=r.hits.find(t=>t.mode==='open');assert.equal(closed.afterType,11);assert.equal(closed.afterLife,20);assert.equal(open.afterType,27);assert.ok(closed.events.some(e=>e.pc==='9003'&&e.a===29));
const rec=JSON.parse(fs.readFileSync(new URL('recovery.json',audio)));assert.equal(rec.romSha256,hash(rom));assert.deepEqual(rec.sounds.map(s=>s.id),[21,29]);
for(const s of rec.sounds){const raw=fs.readFileSync(new URL(s.name+'.wav',audio)),mix=fs.readFileSync(new URL('Review/'+s.name+'_balanced.wav',audio));assert.equal(hash(raw),s.rawSha256);assert.equal(hash(mix),s.balancedSha256);assert.equal(raw.length,mix.length);assert.equal(s.warmPeak,0);assert.ok(s.balancedPeak<1);assert.equal(raw.readUInt32LE(24),48000);assert.equal(raw.readUInt16LE(22),2);assert.equal(raw.readUInt16LE(34),16);assert.equal(raw.length,44+s.frames*4);
 const fadeBytes=s.reviewTailRampFrames*4;
 for(let i=44;i<raw.length-fadeBytes;i+=2)assert.equal(mix.readInt16LE(i),raw.readInt16LE(i)*2);
 if(fadeBytes){assert.equal(mix.readInt16LE(mix.length-2),0);assert.equal(mix.readInt16LE(mix.length-4),0);for(let i=raw.length-fadeBytes;i<raw.length;i+=4)for(let c=0;c<2;c++)assert.equal(raw.readInt16LE(i+c*2),s.tailBaseline[c]);}
}
console.log('PASS: 4 shell pose hashes/bullet/native byte evidence; closed ding/no damage and open kill; both48kHz stereoPCM16 cues/hashes; exact2x gain except disclosed constant-tail ramp; no individual clipping.');
