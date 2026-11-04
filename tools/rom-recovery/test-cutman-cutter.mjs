// Original USA fixed-bank 6502 against actual GML. Not a complete fight/renderer.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { NES } from 'jsnes';
const root = new URL('../../', import.meta.url), base = new URL('Assets/Bosses/MM1/Cut Man/Combat/', root);
const rom = fs.readFileSync(new URL('Mega Man (USA).nes', root));
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
assert.equal(hash(rom), '58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7');
const n = new NES({ emulateSound: false }); n.loadROM(rom.toString('binary'));
const c = n.cpu, m = c.mem;
const compile = name => new Function('s', 'with(s){' + fs.readFileSync(new URL('Scripts/' + name + '.gml', base), 'utf8').replace(/\bmod\b/g, '%').replace(/\bexit\s*;/g, 'return;') + '}');
const aim = compile('scr_mm1_cutman_cutter_aim'), manage = compile('scr_mm1_cutman_cutter_manage');
function start(pc) { c.REG_PC = pc-1; c.REG_SP = 0xfd; m[0x1fe] = 255; m[0x1ff] = 6; c.irqRequested = false; }
function run() { let steps = 0; while(c.REG_PC !== 0x6ff) { assert.ok(++steps < 4000); c.emulate(); } }
const math = { floor: Math.floor, abs: Math.abs, min: Math.min, max: Math.max };
let rng = 0x8fc6;
const rand = max => { rng = (Math.imul(rng,1664525)+1013904223)>>>0; return rng % max; };
let aimChecks = 0, managerChecks = 0;
for (let i = 0; i < 24000; i++) {
  const s = { ...math, cc_dx: i % 256, cc_dy_byte: rand(256), cc_base: [608,612,616,768,1020,1248,1600,2048][rand(8)], cc_upward: !!(i & 256), cc_speed_x: 0, cc_speed_y: 0 };
  m[0] = s.cc_base & 255; m[1] = s.cc_base >> 8; m[2] = s.cc_dx; m[3] = s.cc_dy_byte;
  m[0x4f] = 0; c.REG_X = 4; c.F_CARRY = +s.cc_upward;
  start(0xf8c6); run(); aim(s);
  assert.equal(s.cc_speed_x, m[0x4e4] | m[0x4c4]<<8, `aimX${i}`);
  assert.equal(s.cc_speed_y, m[0x664] | m[0x684]<<8, `aimY${i}`);
  assert.equal(s.cc_dy_byte, m[3]); aimChecks++;
}
for (let i = 0; i < 18000; i++) {
  m.fill(0,0,0x800);
  const edges = [0,23,24,25,127,128,191,215,216,217,231,232,233,247];
  const s = { ...math, argument0: i & 3, cm_cutter: i % 3,
    cm_x: edges[rand(edges.length)], cm_y: edges[rand(edges.length)],
    cc_x: edges[rand(edges.length)], cc_y: edges[rand(edges.length)],
    cc_face_right: !!rand(2), cc_base: 608 + 4*rand(80), cc_speed_x: rand(1024),
    cc_speed_y: [0,1,255,256,257,512,65535,65280][rand(8)],
    cm_fire: rand(32), cc_caught: false, cc_dx: 0, cc_dy_byte: 0, cc_upward: false };
  s.scr_mm1_cutman_cutter_aim = () => aim(s);
  m[0x44] = s.cm_cutter; m[0x481] = s.cm_x; m[0x601] = s.cm_y;
  m[0x484] = s.cc_x; m[0x604] = s.cc_y; m[0x404] = 0x45; m[0x54] = 32;
  m[0x424] = s.cc_face_right ? 64 : 0;
  m[0x48] = s.cc_base & 255; m[0x49] = s.cc_base >> 8;
  m[0x4e4] = s.cc_speed_x & 255; m[0x4c4] = s.cc_speed_x >> 8;
  m[0x664] = s.cc_speed_y & 255; m[0x684] = s.cc_speed_y >> 8;
  m[0x641] = s.cm_fire; m[0x23] = s.argument0;
  // Enter original dispatcher AFTER it pushed its strategy pointer. Sleep boss
  // suppresses strategy execution at DD5B, but original cutter manager runs.
  m[0x6a1] = 1; start(0xdc9d); c.push(0); c.push(0); run(); manage(s);
  assert.equal(s.cm_cutter, m[0x44], `state${i}`);
  assert.equal(s.cm_fire, m[0x641], `fire${i}`);
  assert.equal(s.cc_face_right, !!(m[0x424]&64), `facing${i}`);
  assert.equal(s.cc_base, m[0x48] | m[0x49]<<8, `base${i}`);
  assert.equal(s.cc_speed_x, m[0x4e4] | m[0x4c4]<<8, `speedX${i}`);
  assert.equal(s.cc_speed_y, m[0x664] | m[0x684]<<8, `speedY${i}`);
  assert.equal(s.cc_caught, m[0x604] === 0xf8, `catch${i}`);
  managerChecks++;
}
// Inspect natural native calls after accepted entrance snapshot. No helper/AI/
// projectile stubs here: original game runs; only player protection is refreshed.
const snapshot = new URL('./.work/cutman-boss-entrance/frame-473.json', import.meta.url);
const natural = new NES({ emulateSound: false }); natural.loadROM(rom.toString('binary'));
natural.fromJSON(JSON.parse(fs.readFileSync(snapshot)));
for(let b=0;b<8;b++) natural.buttonUp(1,b);
let frame=0; const calls=[]; const em=natural.cpu.emulate.bind(natural.cpu);
natural.cpu.emulate=()=>{if(natural.cpu.REG_PC===0xf8c5){const ram=natural.cpu.mem;calls.push({frame,dx:ram[2],dyByte:ram[3],carry:natural.cpu.F_CARRY,speed:ram[0]+ram[1]*256,scratch4F:ram[0x4f]});}return em();};
for(frame=0;frame<800;frame++){natural.cpu.mem[0x55]=100;natural.frame();}
assert.ok(calls.length > 20); assert.ok(calls.every(r=>r.scratch4F===0));
const approval = JSON.parse(fs.readFileSync(new URL('Reference/rolling-cutter-throw-approval.json',base)));
assert.equal(hash(fs.readFileSync(new URL(approval.file,base))),approval.sha256);
const report = { romSha256:hash(rom), aimChecks,managerChecks,
  method:'Actual GML vs unmodified original-USA6502 F8C6 and DC9D..DD52. Direct routine input fixtures; native4F=0 contract. Manager dispatcher sleeps boss to skip strategies, not cutter manager. Does not move/render/collide projectile or allocate throw.',
  naturalScratchEvidence:{method:'Existing native entrance frame473 snapshot, release all buttons,800original updates, refresh only player protection55=100; no boss/cutter/physics/aim patches.',calls},
  limits:['Not a complete boss fight or GMS runtime test.','Body physics, projectile update order and art/collision integration unfinished.','4F=0 observed in this native trace, not proven for every possible game state.'],
  scripts:['scr_mm1_cutman_cutter_aim','scr_mm1_cutman_cutter_manage'].map(name=>({name,sha256:hash(fs.readFileSync(new URL('Scripts/'+name+'.gml',base)))})) };
fs.writeFileSync(new URL('Reference/cutter-differential.json',base),JSON.stringify(report,null,2)+'\n');
console.log(`PASS ${aimChecks} native aim and ${managerChecks} cutter-manager comparisons; ${calls.length} original-game aim calls confirm scratch4F=0 in disclosed protected-player trace. Approved sound unchanged.`);

// Verify ORIGINAL USA collision lookup operands, not modified-source table labels.
const bytes=(bank,address,count)=>rom.subarray(16+bank*16384+(address&16383),16+bank*16384+(address&16383)+count).toString('hex');
assert.equal(bytes(5,0x9bf7,3),'b983fb');
assert.equal(bytes(5,0x9e3f,3),'b9b5fa');
for(const pose of [63,64,65,66,67,68,70,71,87]){
  assert.equal(parseInt(bytes(7,0xfab5+pose,1),16),8);
  assert.equal(parseInt(bytes(7,0xfb83+pose,1),16),12);
}
const motion=compile('scr_mm1_cutman_boss_motion'),face=compile('scr_mm1_cutman_boss_face');
let motionChecks=0;
function actor(x=3264,y=900){const s={...math,sign:Math.sign,noone:-1,obj_stage_solid:1,x,y,cm_x:Math.floor(x)-3072,cm_y:Math.floor(y)-720,cm_target_x:24,cm_face_right:false,cm_move_right:false,cm_speed_x:288,cm_speed_y:65344,cm_wall:0,solids:[]};s.scr_mm1_cutman_boss_face=()=>face(s);s.collision_point=(px,py)=>s.solids.find(b=>px>=b.bbox_left&&px<=b.bbox_right&&py>=b.bbox_top&&py<=b.bbox_bottom)??-1;return s;}
const floorBox={bbox_left:3000,bbox_right:3400,bbox_top:912,bbox_bottom:943};
for(const right of[false,true])for(const fraction of[0,1/256,127/256,255/256]){
  const s=actor(3264+fraction);s.cm_move_right=right;s.solids=[floorBox];
  assert.equal(motion(s),true);assert.equal(s.x,3264+fraction+(right?1:-1)*1.125);assert.equal(s.y,900);assert.equal(s.cm_speed_y,65344);motionChecks++;
}
for(const right of[false,true]){
  const s=actor();s.cm_move_right=right;s.cm_speed_x=4096;s.solids=[floorBox,{bbox_left:right?3274:3238,bbox_right:right?3289:3253,bbox_top:850,bbox_bottom:911}];
  motion(s);assert.equal(s.cm_wall,1);assert.equal(s.x,right?3266:3262);motionChecks++;
}
{
  const s=actor();s.cm_speed_y=1600;s.solids=[floorBox];let air=0,land=false;
  for(let f=0;f<100;f++){const hit=motion(s);if(!hit)air++;else{land=true;break;}}
  assert.ok(land&&air>40&&air<60);assert.equal(s.y,900);motionChecks++;
}
{
  const s=actor();s.cm_speed_x=0;s.cm_speed_y=1600;s.solids=[floorBox,{bbox_left:3200,bbox_right:3300,bbox_top:864,bbox_bottom:879}];
  assert.equal(motion(s),false);assert.equal(s.y,893.75);
  assert.equal(motion(s),true);assert.equal(s.y,892);assert.equal(s.cm_speed_y,65344);motionChecks++;
}
{
  const s=actor();s.cm_speed_x=0;s.cm_speed_y=0;s.solids=[];
  for(let f=0;f<100;f++)motion(s);
  assert.equal(s.cm_speed_y,62464);assert.ok(s.y>1500);motionChecks++;
}
console.log(`PASS ${motionChecks} actual-GML project-solid motion fixtures; USA operands verify body8x12. Corner/overhang behavior deliberately project-adapted; not GMS runtime.`);

const throwCutter=compile('scr_mm1_cutman_cutter_throw'),moveCutter=compile('scr_mm1_cutman_cutter_move');
let throwChecks=0,moveChecks=0;
for(let i=0;i<3000;i++){
 m.fill(0,0,0x800);m[0x54]=32;for(let slot=16;slot<32;slot++)m[0x600+slot]=248;
 const s={...math,cm_cutter:0,cm_x:24+rand(209),cm_y:24+rand(192),cm_target_x:24+rand(209),cm_target_y:24+rand(192),cm_face_right:!!rand(2),cc_face_right:false,cc_x:0,cc_y:0,cc_x_fp:0,cc_y_fp:0,cc_anim:99,cc_draw_frame:99,cc_caught:false,cc_base:0,cc_dx:0,cc_dy_byte:0,cc_upward:false,cc_speed_x:0,cc_speed_y:0,snd_mm1_cutman_rolling_cutter_throw:25,plays:[]};
 s.scr_mm1_cutman_boss_face=()=>face(s);s.scr_mm1_cutman_cutter_aim=()=>aim(s);s.audio_play_sound=(...args)=>s.plays.push(args);
 m[0x481]=s.cm_x;m[0x601]=s.cm_y;m[0x480]=s.cm_target_x;m[0x600]=s.cm_target_y;m[0x421]=s.cm_face_right?67:3;
 m[0x461]=m[0x460]=23;m[0x4f]=0;start(0xdf8f);run();throwCutter(s);
 assert.equal(s.cm_cutter,m[0x44]);assert.equal(s.cc_x,m[0x490]);assert.equal(s.cc_y,m[0x610]);assert.equal(s.cc_face_right,!!(m[0x430]&64));
 assert.equal(s.cc_speed_x,m[0x4f0]|m[0x4d0]<<8);assert.equal(s.cc_speed_y,m[0x670]|m[0x690]<<8);
 assert.equal(s.cc_x_fp,s.cc_x*256);assert.equal(s.cc_y_fp,s.cc_y*256);assert.equal(s.cc_anim,0);
 assert.deepEqual(s.plays,[[25,10,false]]);assert.equal(m[0x580],0x25);
 throwCutter(s);assert.equal(s.plays.length,1,'No second cutter or repeated throw sound');throwChecks++;
}
for(let i=0;i<4000;i++){
 const s={...math,argument0:0x34,cm_cutter:1,cc_face_right:!!rand(2),cc_x_fp:rand(65536),cc_y_fp:rand(65536),cc_speed_x:rand(2048),cc_speed_y:rand(65536),cc_anim:0,cc_draw_frame:0,cc_x:0,cc_y:0};
 const expectedX=(s.cc_x_fp+(s.cc_face_right?1:-1)*s.cc_speed_x+65536)%65536;
 const signedY=s.cc_speed_y>=32768?s.cc_speed_y-65536:s.cc_speed_y;
 const expectedY=(s.cc_y_fp-signedY+65536)%65536;
 moveCutter(s);assert.equal(s.cc_x_fp,expectedX);assert.equal(s.cc_y_fp,expectedY);assert.equal(s.cc_x,expectedX>>8);assert.equal(s.cc_y,expectedY>>8);assert.equal(s.cc_draw_frame,0);assert.equal(s.cc_anim,1);moveChecks++;
}
console.log(`PASS ${throwChecks} original-6502 allocation/aim/throw25 cases and ${moveChecks} fixed-point projectile motion fixtures. Complete live-world update order NOT tested.`);
