// Extract only the MM5 player's nine OAM components in the saved idle scene.
import {NES} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const n = new NES();
n.loadROM(fs.readFileSync(root + 'Mega Man 5 (USA).nes', 'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json', import.meta.url))));
n.frame();
if (n.ppu.f_spriteSize !== 0 || n.cpu.mem[0x330] !== 128 || n.cpu.mem[0x378] !== 180) throw Error('Unexpected reference state');
const p = new PNG({width:32,height:32});
const ox = 112, oy = 164;
for (let i=9;i>=1;i--) {
  const tile = n.ppu.ptTile[n.ppu.sprTile[i] + 256*n.ppu.f_spPatternTable];
  for (let y=0;y<8;y++) for(let x=0;x<8;x++) {
    const c = tile.pix[(n.ppu.vertFlip[i]?7-y:y)*8+(n.ppu.horiFlip[i]?7-x:x)];
    const dx=n.ppu.sprX[i]+x-ox,dy=n.ppu.sprY[i]+1+y-oy;
    if (!c || dx<0 || dx>=32 || dy<0 || dy>=32) continue;
    const v=n.ppu.sprPalette[n.ppu.sprCol[i]+c];
    p.data.set([v&255,(v>>8)&255,(v>>16)&255,255],(dy*32+dx)*4);
  }
}
const dir=root+'Assets/Mega Man/MM5/Standing/';
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(dir+'spr_mm5_megaman_idle.png',PNG.sync.write(p));
console.log('Extracted MM5 standing sprite: 32x32, origin 16,16, facing right.');
