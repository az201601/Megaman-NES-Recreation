import {NES} from 'jsnes';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const work = fileURLToPath(new URL('./.work/', import.meta.url));
const results = [];
for (const game of ['mm1', 'mm5']) {
  for (const protection of ['none', 'timer', ...(game === 'mm5' ? ['hurt-state'] : [])]) {
    const n = new NES();
    n.loadROM(fs.readFileSync(root + (game === 'mm1' ? 'Mega Man (USA).nes' : 'Mega Man 5 (USA).nes'), 'binary'));
    n.fromJSON(JSON.parse(fs.readFileSync(work + (game === 'mm1' ? 'mm1-before-hit-110.json' : 'mm5-pre-hit.json'))));
    for (let button = 0; button < 8; button++) n.buttonUp(1, button);
    if (protection === 'timer') n.cpu.mem[game === 'mm1' ? 0x55 : 0x5b8] = 60;
    if (protection === 'hurt-state') n.cpu.mem[0x30] = 6;
    const hp = () => game === 'mm1' ? n.cpu.mem[0x6a] : n.cpu.mem[0xb0] & 31;
    const initialHP = hp();
    for (let frame = 0; frame < 5; frame++) n.frame();
    results.push({game, protection, initialHP, finalHP: hp()});
  }
}
fs.writeFileSync(work + 'contact-gates.json', JSON.stringify(results, null, 2));
console.log(results);
