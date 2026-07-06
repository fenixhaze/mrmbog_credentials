const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// We'll manually replace the hover and rounded classes for the cmlatam parts in key CTAs.

// 1. Theme Toggle button (line 530)
code = code.replace(
  /theme === 'cmlatam' \? 'bg-black text-white' : 'bg-\[#FA4B14\] text-white'/g,
  "theme === 'cmlatam' ? 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]' : 'bg-[#FA4B14] text-white'"
);

// 2. Language toggles
code = code.replace(
  /\(theme === 'mrm' \? 'text-white\/40 hover:text-white' : 'text-black\/40 hover:text-black'\)/g,
  "(theme === 'mrm' ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-[#104FE6]')"
);
code = code.replace(
  /\(theme === 'mrm' \? 'bg-\[#7D68F6\] text-white shadow-lg' : 'bg-black text-white shadow-lg'\)/g,
  "(theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-lg' : 'bg-[#104FE6] text-white shadow-lg rounded-[75px]')"
);

// 3. Nav tabs (chat, projects, team)
code = code.replace(
  /\(theme === 'mrm' \? 'text-white\/40 hover:text-white hover:bg-white\/5' : 'text-black\/40 hover:text-black hover:bg-black\/5'\)/g,
  "(theme === 'mrm' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-black/40 hover:text-[#104FE6] hover:bg-black/5')"
);
code = code.replace(
  /\(activeTab === tab.id \? \(theme === 'mrm' \? 'bg-\[#7D68F6\] text-white shadow-lg' : 'bg-black text-white shadow-lg'\)/g,
  "(activeTab === tab.id ? (theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-lg' : 'bg-[#104FE6] text-white shadow-lg rounded-[75px]')"
);

// 4. Squad counter CTA
code = code.replace(
  /theme === 'mrm' \? 'bg-\[#7D68F6\] text-white' : 'bg-transparent border border-black text-black'/g,
  "theme === 'mrm' ? 'bg-[#7D68F6] text-white' : 'bg-transparent border border-black text-black hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'"
);

// 5. Add to Squad button (Project modal)
code = code.replace(
  /theme === 'mrm' \? 'bg-\[#7D68F6\] text-white shadow-xl shadow-\[#7D68F6\]\/20 hover:scale-\[1.02\]' : 'bg-black text-white hover:bg-black\/80 rounded-none'/g,
  "theme === 'mrm' ? 'bg-[#7D68F6] text-white shadow-xl shadow-[#7D68F6]/20 hover:scale-[1.02]' : 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]'"
);

// 6. Add to Squad button (Team tab)
code = code.replace(
  /theme === 'mrm' \? 'bg-\[#7D68F6\] text-white hover:scale-\[1.02\] shadow-xl shadow-\[#7D68F6\]\/20' : 'bg-black text-white rounded-none hover:bg-black\/80'/g,
  "theme === 'mrm' ? 'bg-[#7D68F6] text-white hover:scale-[1.02] shadow-xl shadow-[#7D68F6]/20' : 'bg-black text-white rounded-[75px] hover:bg-[#104FE6]'"
);

// 7. Remove from Squad (hover color)
code = code.replace(
  /theme === 'mrm' \? 'border-red-500\/10 text-red-500\/30 hover:text-red-400 hover:bg-red-500\/10' : 'border-black text-black hover:bg-black\/5'/g,
  "theme === 'mrm' ? 'border-red-500/10 text-red-500/30 hover:text-red-400 hover:bg-red-500/10' : 'border-black text-black hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'"
);

// 8. Chat send button
code = code.replace(
  /theme === 'mrm' \? 'bg-\[#7D68F6\] text-white hover:scale-105' : 'bg-black text-white hover:opacity-80 rounded-none'/g,
  "theme === 'mrm' ? 'bg-[#7D68F6] text-white hover:scale-105' : 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]'"
);

// 9. Send Mail button in Squad modal
code = code.replace(
  /theme === 'mrm' \? 'bg-\[#7D68F6\] text-white hover:scale-\[1.02\] shadow-xl shadow-\[#7D68F6\]\/20' : 'bg-black text-white hover:opacity-80'/g,
  "theme === 'mrm' ? 'bg-[#7D68F6] text-white hover:scale-[1.02] shadow-xl shadow-[#7D68F6]/20' : 'bg-black text-white hover:bg-[#104FE6] rounded-[75px]'"
);

// 10. Floating Close buttons (projects, talent, squad modals)
// They use `theme === 'mrm' ? '...' : 'bg-black/5 text-black border border-black/10 hover:bg-black hover:text-white'`
// Update to hover:bg-[#104FE6]
code = code.replace(
  /'bg-black\/5 text-black border border-black\/10 hover:bg-black hover:text-white'/g,
  "'bg-black/5 text-black border border-black/10 hover:bg-[#104FE6] hover:text-white hover:border-[#104FE6] rounded-[75px]'"
);

// Fix the pill rounded-full class in elements where they might have `rounded-full` conflicting with `rounded-[75px]`
// Actually `rounded-[75px]` will override if it's placed later, but just to be sure we don't break flex.

fs.writeFileSync('src/App.jsx', code);
console.log("Done updating App.jsx CTAs");
