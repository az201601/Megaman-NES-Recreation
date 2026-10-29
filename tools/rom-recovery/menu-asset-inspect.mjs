// Menu tile/palette inspection. Original saved menu, no inventory patches.
import{NES}from'jsnes';import fs from'node:fs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
for(const g of[4,5,6]){
 const n=new NES();n.loadROM(fs.readFileSync(new URL(`Mega Man ${g} (USA).nes`,root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL(`mm${g}-pause-reference.json`,work))));n.frame();
 console.log('GAME',g,'pattern',n.ppu.f_bgPatternTable,n.ppu.f_spPatternTable,'scroll',n.ppu.regH,n.ppu.regV,'NT',n.ppu.ntable1);
 console.log('Sprites',Array.from({length:64},(_,i)=>i).filter(i=>n.ppu.sprY[i]<239).map(i=>[i,n.ppu.sprX[i],n.ppu.sprY[i]+1,n.ppu.sprTile[i],n.ppu.sprCol[i]]));
 console.log('BG tiles sample',Object.keys(n.ppu.nameTable[0]));
 const nt=n.ppu.nameTable[n.ppu.ntable1[n.ppu.regV*2+n.ppu.regH]];
 for(let y of[2,4,5,6,10,11,12,13,24,25,26])console.log(y,Array.from(nt.tile.slice(y*32,y*32+32)));
 fs.writeFileSync(new URL(`mm${g}-menu-ppu-inspection.json`,work),JSON.stringify({bgPattern:n.ppu.f_bgPatternTable,tiles:nt.tile,attrib:nt.attrib,pal:Array.from(n.ppu.imgPalette),sprPal:Array.from(n.ppu.sprPalette)}));
}
