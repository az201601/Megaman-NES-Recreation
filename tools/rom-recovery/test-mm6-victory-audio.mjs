import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Bosses/MM1/Cut Man/Victory/',root),read=p=>fs.readFileSync(new URL(p,base)),hash=b=>createHash('sha256').update(b).digest('hex'),ref=JSON.parse(read('Reference/mm6-victory-audio.json')),rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));
assert.equal(hash(rom),ref.romSha256);
for(const[bank,address,hex]of[[0x3f,0xf97e,'a91385dc'],[0x3c,0x80e3,'a91085dc'],[0x3c,0x815d,'a96185dc'],[0x3c,0x8164,'a96185dc'],[0x3c,0x8219,'a92785dc']]){
 const offset=16+bank*8192+(address&8191);assert.equal(rom.subarray(offset,offset+hex.length/2).toString('hex'),hex);
}
for(const f of ref.files){const w=read(f.file);assert.equal(hash(w),f.sha256);assert.equal(w.toString('ascii',0,4),'RIFF');assert.equal(w.readUInt32LE(24),48000);assert.equal(w.readUInt16LE(22),1);assert.equal(w.readUInt16LE(34),16);assert.ok(f.peak<1);assert.equal(f.endsNaturally,true);assert.deepEqual(f.dispatch.map(e=>e.command),[Number(f.id)]);assert.deepEqual(f.driverDispatch.map(e=>e.command),[Number(f.id)]);assert.equal(w.length,44+Math.round(f.seconds*96000));let last=w.length-2;while(last>=44&&w.readInt16LE(last)===0)last-=2;assert.ok(last<w.length-800,'>=8ms trailing silence');}
const events=ref.weaponGetNativeTrace.events,at=id=>events.filter(e=>e.kind==='audio-dispatch'&&e.command===id).map(e=>e.frame);
assert.deepEqual(at(0x10),[16]);assert.deepEqual(at(0x61),[51,71]);assert.deepEqual(at(0x27),[276,284,292,300,308,316,324,332,340,348,356]);assert.equal(ref.weaponGetNativeTrace.frames,453);assert.ok(events.some(e=>e.pc==='8275'&&e.frame===452));
// Existing accepted27 remains distinct from the new61 effect.
const old=JSON.parse(fs.readFileSync(new URL('Assets/Audio/Mega Man/MM6/Combat/Blocked Hit/recovery.json',root)));assert.ok(old.commands.some(c=>(c.id??c.sound)===0x27));
console.log('PASS 5 original-USA cue-call spans,4 full-tail WAV hashes/formats/no-clipping/native dispatches,453-frame controlled weapon-get event trace; existing27 identity. No listening approval or GMS victory implementation implied.');
