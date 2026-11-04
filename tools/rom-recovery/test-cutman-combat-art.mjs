// Stored original-PPU art evidence + actual GML lookup scripts; not GMS rendering.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{PNG}from'pngjs';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Combat/',import.meta.url),read=p=>fs.readFileSync(new URL(p,base)),hash=b=>createHash('sha256').update(b).digest('hex');
const ref=JSON.parse(read('Reference/combat-art.json')),png=PNG.sync.read(read(ref.file));
assert.equal(hash(read(ref.file)),ref.sha256);assert.deepEqual([png.width,png.height],[ref.frames.length*48,64]);assert.deepEqual(ref.origin,[24,32]);
for(const frame of ref.frames){const rgba=Buffer.alloc(48*64*4);for(let y=0;y<64;y++)png.data.copy(rgba,y*192,(y*png.width+frame.index*48)*4,(y*png.width+frame.index*48+48)*4);assert.equal(hash(rgba),frame.rgbaSha256);}
const compile=name=>new Function('s','with(s){'+read('Scripts/'+name+'.gml').toString()+'}');const header=compile('scr_mm1_cutman_animation_header'),sprite=compile('scr_mm1_cutman_animation_sprite');
let checks=0;for(const fixture of ref.fixtures){const a=ref.animations.find(a=>a.pose===fixture.pose&&a.hurt===fixture.hurt);assert.equal(sprite({argument0:fixture.pose,argument1:fixture.frame,argument2:fixture.right,argument3:fixture.hurt}),fixture.stripIndex);assert.equal(header({argument0:fixture.pose}),a.header);assert.ok(fixture.matched>0);checks++;}
assert.equal(checks,56);assert.equal(ref.frames.length,34);
console.log(`PASS ${checks} native-art fixture mappings,34 RGBA frame hashes, actual-GML header/sprite lookups; not GMS GPU or installed acceptance.`);
