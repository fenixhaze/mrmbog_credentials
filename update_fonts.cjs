const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Landing page hero titles (Compacta)
// Replace: "text-5xl md:text-[6vw] font-black uppercase tracking-tighter leading-[0.9] text-white text-center after:content-['.'] after:text-white"
// With:    "text-5xl md:text-[6vw] font-compacta uppercase tracking-tighter leading-[0.9] text-white text-center after:content-['.'] after:text-white"
code = code.replace(
  /"text-5xl md:text-\[6vw\] font-black uppercase tracking-tighter leading-\[0.9\] text-white text-center after:content-\['\.'\] after:text-white"/g,
  '"text-5xl md:text-[6vw] font-compacta font-normal uppercase tracking-tight leading-[0.9] text-white text-center after:content-[\'.\'] after:text-white"'
);

// 2. Team tab title (Compacta)
// Replace: "text-5xl md:text-[6vw] font-black uppercase tracking-tighter mb-8 md:mb-12 text-black leading-[0.9] after:content-['.'] after:text-black"
// With:    "text-5xl md:text-[6vw] font-compacta font-normal uppercase tracking-tight mb-8 md:mb-12 text-black leading-[0.9] after:content-['.'] after:text-black"
code = code.replace(
  /"text-5xl md:text-\[6vw\] font-black uppercase tracking-tighter mb-8 md:mb-12 text-black leading-\[0.9\] after:content-\['\.'\] after:text-black"/g,
  '"text-5xl md:text-[6vw] font-compacta font-normal uppercase tracking-tight mb-8 md:mb-12 text-black leading-[0.9] after:content-[\'.\'] after:text-black"'
);

// 3. Project title (Object Sans)
// Replace: "text-5xl md:text-7xl font-extrabold text-black font-sans tracking-tight after:content-['.'] after:text-black leading-none"
// With:    "text-5xl md:text-7xl font-bold text-black font-object-sans tracking-tight after:content-['.'] after:text-black leading-none"
code = code.replace(
  /"text-5xl md:text-7xl font-extrabold text-black font-sans tracking-tight after:content-\['\.'\] after:text-black leading-none"/g,
  '"text-5xl md:text-7xl font-bold text-black font-object-sans tracking-tight after:content-[\'.\'] after:text-black leading-none"'
);

// 4. Talent Name title (Object Sans)
// Replace: "text-6xl font-extrabold uppercase font-sans tracking-tight text-black mb-4 leading-none after:content-['.'] after:text-black"
// With:    "text-6xl font-bold uppercase font-object-sans tracking-tight text-black mb-4 leading-none after:content-['.'] after:text-black"
code = code.replace(
  /"text-6xl font-extrabold uppercase font-sans tracking-tight text-black mb-4 leading-none after:content-\['\.'\] after:text-black"/g,
  '"text-6xl font-bold uppercase font-object-sans tracking-tight text-black mb-4 leading-none after:content-[\'.\'] after:text-black"'
);

// 5. Contact title (Object Sans)
// Replace: "text-6xl font-extrabold uppercase font-sans tracking-tight text-black leading-none mb-4 after:content-['.'] after:text-black"
// With:    "text-6xl font-bold uppercase font-object-sans tracking-tight text-black leading-none mb-4 after:content-['.'] after:text-black"
code = code.replace(
  /"text-6xl font-extrabold uppercase font-sans tracking-tight text-black leading-none mb-4 after:content-\['\.'\] after:text-black"/g,
  '"text-6xl font-bold uppercase font-object-sans tracking-tight text-black leading-none mb-4 after:content-[\'.\'] after:text-black"'
);

fs.writeFileSync('src/App.jsx', code);
console.log("Done updating fonts");
