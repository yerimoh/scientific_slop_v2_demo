// SciSlop v1.1 slop registry. Content follows v2/overview.md (2026-10-10). Card examples are real sentences from v2/verification/metric_verification_1012.md (1013); the specimen page stays constructed.
// Pictograms use the Table-1 vocabulary: coloured chip = the unit, dashed box/arrow + red x = the missing connection,
// grey card = a part of the paper, red italic caption = what the pattern looks like.
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'text') el.textContent = v; else if (k === 'html') el.innerHTML = v; else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v); }
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
};
{ const btn = $('#theme'); if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ssi-theme', JSON.stringify(next)); } catch (_) { /* ignore */ } }); }

// ------------------------------------------------------------------ pictogram kit (viewBox 100 x 41, fixed colours on a white card)
const C = { struct: '#95627A', arg: '#C97C86', art: '#5C717D', ochre: '#A2823A', sage: '#5F8A62', ink: '#3A3D42', muted: '#6E7378', hair: '#C3C7CC', card: '#FFFFFF', bad: '#C8463C', ok: '#3F9A5A', tint: '#F4F1F2' };
const AREA_C = { 1: C.arg, 2: C.struct, 3: C.art, 4: C.ochre, 5: C.sage };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FS = 4.1, DASH = 'stroke-dasharray="2.2 1.6"';
const tw = (s, fs = FS, bold) => { let w = 0; for (const ch of String(s)) w += /[iljtfr.,:;'’|!·\s()\[\]]/.test(ch) ? .3 : /[mwMW@]/.test(ch) ? .86 : /[A-Z0-9%§→–−"“”?+]/.test(ch) ? .64 : .55; return w * fs * (bold ? 1.06 : 1) + 1; }; // text width in viewBox units
const K = {
  box: (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${(o.r != null ? o.r : 1.4)}" fill="${o.fc || C.card}" stroke="${o.ec || C.hair}" stroke-width="${(o.lw != null ? o.lw : .8)}" ${o.dashed ? DASH : ''}/>`,
  text: (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || FS}" fill="${o.color || C.ink}" text-anchor="${o.anchor || 'start'}" dominant-baseline="central" ${o.bold ? 'font-weight="700"' : ''} ${o.italic ? 'font-style="italic"' : ''}>${esc(s)}</text>`,
  chip: (x, y, s, o = {}) => { const fs = o.fs || FS, w = o.w || tw(s, fs), hh = o.h || 8; return K.box(x, y, w, hh, { fc: o.fc || C.card, ec: o.ec || C.struct, r: Math.min(2.4, hh / 2), dashed: o.dashed, lw: o.lw }) + K.text(x + w / 2, y + hh / 2 + .1, s, { fs, color: o.tc || C.ink, anchor: 'middle', bold: o.bold, italic: o.italic }); },
  line: (x0, y0, x1, y1, o = {}) => `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${o.color || C.hair}" stroke-width="${(o.lw != null ? o.lw : 1)}" stroke-linecap="round" ${o.dashed ? DASH : ''}/>`,
  lines: (x, y, w, n, o = {}) => { let s = ''; for (let i = 0; i < n; i++) s += K.line(x, y + i * (o.gap || 2.6), x + w * (i === n - 1 ? (o.last || .6) : 1), y + i * (o.gap || 2.6), { color: o.color || C.hair, lw: .9 }); return s; },
  arrow: (p0, p1, o = {}) => { // quadratic arc; rad bends like matplotlib arc3 (positive = bulge to the left of travel)
    const [x0, y0] = p0, [x1, y1] = p1, dx = x1 - x0, dy = y1 - y0, rad = o.rad || 0;
    const cx = (x0 + x1) / 2 - dy * rad, cy = (y0 + y1) / 2 + dx * rad;
    const tx = x1 - cx, ty = y1 - cy, L = Math.hypot(tx, ty) || 1, ux = tx / L, uy = ty / L, hl = 3.4, hw = 2;
    const bx = x1 - ux * hl, by = y1 - uy * hl, col = o.color || C.struct;
    return `<path d="M${x0} ${y0} Q${cx} ${cy} ${bx} ${by}" fill="none" stroke="${col}" stroke-width="${(o.lw != null ? o.lw : 1.1)}" ${o.dashed ? DASH : ''}/>` +
      (o.head === false ? '' : `<polygon points="${x1},${y1} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}" fill="${col}"/>`);
  },
  cross: (x, y, r = 3.6) => { const d = r * .45; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.bad}" stroke="#fff" stroke-width=".6"/><path d="M${x - d} ${y - d}L${x + d} ${y + d}M${x - d} ${y + d}L${x + d} ${y - d}" stroke="#fff" stroke-width="1" stroke-linecap="round"/>`; },
  eq: (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${C.bad}" stroke="#fff" stroke-width=".6"/>` + K.text(x, y + .1, '=', { fs: 6, color: '#fff', anchor: 'middle', bold: true }),
  check: (x, y, r = 3.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.ok}" stroke="#fff" stroke-width=".6"/><path d="M${x - 1.6} ${y}L${x - .4} ${y + 1.4}L${x + 1.7} ${y - 1.5}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`,
  caption: s => K.text(50, 31.3, s, { fs: 4.3, color: C.bad, anchor: 'middle', italic: true, bold: true }),
  card: (x, y, w, h, title) => K.box(x, y, w, h, { r: 2 }) + (title ? K.text(x + 3, y + 3.8, title, { fs: FS - .5, color: C.muted, bold: true }) : ''),
  grid: (x, y, w, h, r, c, o = {}) => { let s = K.box(x, y, w, h, { fc: o.fc || C.tint, ec: o.ec || C.art }); for (let i = 1; i < r; i++) s += K.line(x, y + h * i / r, x + w, y + h * i / r, { color: o.ec || C.art, lw: .6 }); for (let j = 1; j < c; j++) s += K.line(x + w * j / c, y, x + w * j / c, y + h, { color: o.ec || C.art, lw: .6 }); return s; },
  svg: (inner, label) => `<svg viewBox="0 0 100 28" role="img" aria-label="${esc(label)}" font-family="Inter, Lato, system-ui, sans-serif">${inner}</svg>`,
};
// scene grammar: every scene is a row of elements centred on MID; widths come from the text, so nothing overflows.
const MID = 14;
const el = (w, draw) => ({ w, draw });
const inner = {
  chip: (s, col, o = {}) => ({ w: tw(s, FS - .3, !o.outline) + 5, h: 8, draw: (x, y, w) => K.chip(x, y, s, o.outline ? { fs: FS - .3, ec: col, lw: .9, w, h: 8 } : { fs: FS - .3, fc: col, ec: col, tc: '#fff', bold: true, w, h: 8 }) }),
  text: (lines, o = {}) => ({ w: Math.max(...lines.map(l => tw(l, FS - .3, o.bold0))) + 2, h: lines.length * 5 - 1.5, draw: (x, y, w) => lines.map((l, i) => K.text(x + w / 2, y + 2 + i * 5, l, { fs: FS - .3 - (o.mute1 && i ? .6 : 0), anchor: 'middle', bold: o.bold0 && i === 0, color: o.mute1 && i ? C.muted : C.ink })).join('') }),
  lines: (n = 3) => ({ w: 26, h: n * 3 - 2, draw: (x, y, w) => K.lines(x, y + .5, w, n, { gap: 3, last: .55 }) }),
  bars: () => ({ w: 36, h: 13.5, draw: (x, y) => [['L2', 55], ['L4', 39], ['L8', 69], ['L12', 66]].map(([l, v], i) => { const bad = i === 2, bh = v * .115, bx = x + 2 + i * 8.5; return K.box(bx, y + 9 - bh, 5.5, bh, { fc: bad ? C.bad : C.art, ec: bad ? C.bad : C.art, r: .5 }) + K.text(bx + 2.75, y + 11.8, l, { fs: FS - 1.1, anchor: 'middle', color: C.muted }) + (bad ? K.text(bx + 2.75, y + 9 - bh - 2.2, v, { fs: FS - 1, anchor: 'middle', color: C.bad, bold: true }) : ''); }).join('') }),
};
const E = {
  chip: (s, col) => { const w = tw(s, FS, true) + 6; return el(w, x => K.chip(x, MID - 4.75, s, { fc: col, ec: col, tc: '#fff', bold: true, w, h: 9.5 })); },
  say: (s, col) => { const w = tw(s, FS) + 6; return el(w, x => K.chip(x, MID - 4.75, s, { fc: C.card, ec: col, tc: C.ink, italic: true, w, h: 9.5, lw: .9 })); },
  ask: lines => { const hh = lines.length > 1 ? 14 : 9.5, w = Math.max(...lines.map(l => tw(l, FS))) + 7; return el(w, x => K.box(x, MID - hh / 2, w, hh, { dashed: true, ec: C.muted, lw: .9, r: 1.8 }) + lines.map((l, i) => K.text(x + w / 2, MID + (i - (lines.length - 1) / 2) * 5, l, { color: C.muted, anchor: 'middle', italic: true })).join('')); },
  card: (title, c, o = {}) => { const w = Math.max(c.w, tw(title, FS - .5, true) + 2) + 6, hh = 7 + c.h + (o.lines === false ? 3.5 : 5.5); return el(w, x => { const y = MID - hh / 2; return K.card(x, y, w, hh, title) + c.draw(x + 3, y + 7, w - 6) + (o.lines === false ? '' : K.lines(x + 3, y + hh - 3, w - 6, 1, { last: .55 })); }); },
  para: (title, s, col, o = {}) => { const cw = tw(s, FS - .3, !o.box) + 5, w = cw + 22, hh = 23; return el(w, x => { const y = MID - hh / 2; return K.card(x, y, w, hh, title) + K.lines(x + 3, y + 7.5, w - 6, 1) + (o.box ? K.box(x + 3, y + 10, cw, 7.5, { fc: C.tint, ec: col }) + K.text(x + 3 + cw / 2, y + 13.85, s, { fs: FS - .3, anchor: 'middle' }) : K.chip(x + 3, y + 10, s, { fs: FS - .3, fc: col, ec: col, tc: '#fff', w: cw, h: 7.5 })) + K.lines(x + 3, y + 20, w - 6, 1, { last: .5 }) + K.cross(x + 3 + cw, y + 13.75, 3.2); }); },
  miss: (col, o = {}) => el(17, x => (o.left ? K.arrow([x + 17, MID], [x, MID], { color: col, dashed: !o.solid }) : K.arrow([x, MID], [x + 17, MID], { color: col, dashed: !o.solid })) + K.cross(x + 8.5, MID)),
  eq: () => el(15, x => K.line(x, MID, x + 15, MID, { lw: 1 }) + K.eq(x + 7.5, MID)),
  clash: () => el(11, x => K.cross(x + 5.5, MID)),
};
const row = (els, gap = 2) => {
  const total = els.reduce((a, e) => a + e.w, 0) + gap * (els.length - 1), k = Math.min(1, 95 / total);
  let x = 50 - total / 2, s = '';
  for (const e of els) { s += e.draw(x); x += e.w + gap; }
  return k < 1 ? `<g transform="translate(50 ${MID}) scale(${k.toFixed(3)}) translate(-50 ${-MID})">${s}</g>` : s;
};
// one scene per item
const PIC = {
  '1-1': () => { // the measuring flow in miniature: claim → what would prove it → searched the paper, nothing → FAIL
    const fs = 3.6, y = 11, hh = 9, g = 6;
    const lab = (cx, t) => K.text(cx, 24.2, t, { fs: 3.2, color: C.muted, anchor: 'middle' });
    const ar = (x0, x1) => K.arrow([x0, y], [x1, y], { color: C.muted, lw: .9 });
    const w1 = tw('adapts to new domains', fs, true) + 6, w2 = tw('a domain test?', fs) + 6, w3 = 17, w4 = tw('FAIL', fs, true) + 7;
    const total = w1 + w2 + w3 + w4 + 3 * g, k = Math.min(1, 96 / total);
    let x = 50 - total / 2, s = '';
    s += K.chip(x, y - hh / 2, 'adapts to new domains', { fs, fc: C.arg, ec: C.arg, tc: '#fff', bold: true, w: w1, h: hh }) + lab(x + w1 / 2, 'claim'); x += w1; s += ar(x + .8, x + g - .8); x += g;
    s += K.box(x, y - hh / 2, w2, hh, { dashed: true, ec: C.muted, lw: .9, r: 1.8 }) + K.text(x + w2 / 2, y + .1, 'a domain test?', { fs, color: C.muted, anchor: 'middle', italic: true }) + lab(x + w2 / 2, 'needs'); x += w2; s += ar(x + .8, x + g - .8); x += g;
    const ch = 15, cy = y - ch / 2;
    s += K.card(x, cy, w3, ch) + K.lines(x + 2.5, cy + 3, w3 - 5, 2, { gap: 2.6, last: .6 }) + K.grid(x + 2.5, cy + 8.3, w3 - 5, 4.4, 2, 3) + K.cross(x + w3 - 2.2, cy + ch - 2.2, 3.3) + lab(x + w3 / 2, 'in the paper?'); x += w3; s += ar(x + .8, x + g - .8); x += g;
    s += K.chip(x, y - hh / 2, 'FAIL', { fs, fc: C.bad, ec: C.bad, tc: '#fff', bold: true, w: w4, h: hh }) + lab(x + w4 / 2, 'verdict');
    return k < 1 ? `<g transform="translate(50 13) scale(${k.toFixed(3)}) translate(-50 -13)">${s}</g>` : s;
  },
  '1-2': () => row([E.card('tested', inner.chip('1 model · 1 dataset', C.arg, { outline: true })), E.miss(C.arg, { solid: true }), E.ask(['another model?', 'cost?'])]),
  '1-4': () => { const cw = tw('SparseVLM', FS - .3) + 6, ow = tw('ours', FS, true) + 8, gap = 22, total = cw + gap + ow, x0 = 50 - total / 2, xo = x0 + cw + gap;
    return K.chip(x0, MID - 10.5, 'FEATHER', { fs: FS - .3, ec: C.arg, lw: .9, w: cw, h: 8 }) + K.chip(x0, MID - 1, 'SparseVLM', { fs: FS - .3, ec: C.arg, lw: .9, w: cw, h: 8 }) + K.text(x0 + cw / 2, MID + 10.3, '+ 6 more, listed', { fs: FS - .8, color: C.muted, anchor: 'middle' }) +
      K.chip(xo, MID - 6.25, 'ours', { fc: C.arg, ec: C.arg, tc: '#fff', bold: true, w: ow, h: 9.5 }) +
      K.arrow([x0 + cw, MID - 6.5], [xo - .5, MID - 3], { color: C.arg, dashed: true, rad: -.1 }) + K.arrow([x0 + cw, MID + 3], [xo - .5, MID], { color: C.arg, dashed: true, rad: .1 }) + K.cross(x0 + cw + gap / 2, MID - 5.5) + K.cross(x0 + cw + gap / 2, MID + 2.5); },
  '2-1': () => row([E.card('Abstract', inner.chip('46% · 93% kept', C.struct, { outline: true })), E.miss(C.struct, { left: true }), E.card('§4 Results', inner.chip('MQ: 12.1 → 3.65', C.struct))]),
  '2-3': () => row([E.card('§3 · Method', inner.chip('Eq. 1', C.struct)), E.miss(C.struct, { left: true }), E.card('§4 · Experiments', inner.chip('ratio formula', C.struct))]),
  '3-1': () => row([E.chip('layer 12 of 32', C.art), E.miss(C.art), E.ask(['why 12?'])]),
  '4-1': () => row([E.para('§1 Introduction', 'this confirms the effectiveness …', C.struct)]),
  '4-2': () => row([E.chip('retrieval rate', C.art), E.miss(C.art), E.ask(['= ?'])]),
  '2-5': () => row([E.card('Abstract', inner.chip('+10.4 points', C.struct)), E.eq(), E.card('§5 · Conclusion', inner.chip('+10.4 points', C.struct))]),
  '4-4': () => row([E.card('§3 · Method', inner.chip('destroys saliency', C.struct)), E.eq(), E.card('§4 · Experiments', inner.chip('destroys saliency', C.struct))]),
  '4-5': () => row([E.card('Figure 1', inner.bars(), { lines: false }), E.miss(C.art), E.ask(['L8 in the text?'])]),
  '5-4': () => row([E.chip('0.3, "typically considered"', C.arg), E.miss(C.arg), E.ask(['by whom?', '[ ? ]'])]),
};
// what the pattern looks like, one line under each scene
const CAP = { '2-5': 'the abstract again, at the end', '1-1': 'a claim with nothing behind it', '1-2': 'one setting tried, cost left out', '1-4': 'cited, related to nothing', '2-1': 'the bad news never reaches the front', '2-3': 'used later, never pointed back to', '3-1': 'a choice with no reason', '4-1': 'delete it and nothing is lost', '4-2': 'a term with no meaning', '4-4': 'the same sentence, another section', '4-5': 'a result only the figure reports', '5-4': 'a source that is not there' };
// hero: a paper spine with the five kinds of broken connection
function heroSvg() {
  const secs = [['Abstract', 4], ['Introduction', 42], ['Method', 80], ['Experiments', 118], ['Conclusion', 156]];
  let s = '';
  for (const [t, x] of secs) s += K.card(x, 24, 34, 22, t) + K.lines(x + 3, 31, 28, 4, { gap: 3, last: .6 });
  s += K.chip(45, 34, 'important!', { fs: 2.9, fc: C.sage, ec: C.sage, tc: '#fff', w: 20, h: 5.4 }) + K.cross(66, 34.5, 2.2);
  s += K.chip(83, 34, 'why 512?', { fs: 2.9, fc: C.art, ec: C.art, tc: '#fff', w: 18, h: 5.4 }) + K.cross(102, 34.5, 2.2);
  s += K.chip(83, 40.5, 'anchoring = ?', { fs: 2.9, fc: C.ochre, ec: C.ochre, tc: '#fff', w: 24, h: 5.4 });
  s += K.chip(121, 34, 'robust to noise', { fs: 2.9, fc: C.arg, ec: C.arg, tc: '#fff', w: 26, h: 5.4 });
  s += K.arrow([134, 34], [134, 14], { color: C.arg, dashed: true }) + K.box(124, 6, 24, 8, { dashed: true, ec: C.muted }) + K.text(136, 10.2, 'evidence', { fs: 2.9, color: C.muted, anchor: 'middle', italic: true }) + K.cross(134, 24, 2.2);
  s += K.arrow([21, 24], [135, 24], { color: C.struct, dashed: true, rad: .22, head: true }) + K.cross(78, 10, 2.2) + K.text(78, 4.5, 'finding never reaches the front', { fs: 2.9, color: C.bad, anchor: 'middle', italic: true });
  return `<svg viewBox="0 0 194 50" role="img" aria-label="A paper's sections with the connections that fail" font-family="Inter, Lato, system-ui, sans-serif">${s}</svg>`;
}

// ------------------------------------------------------------------ content
const AREAS = [
  { n: 1, cls: 'a1', short: 'Claims', title: 'Claims and evidence', q: 'What backs each claim, and can the reader check it?' },
  { n: 2, cls: 'a2', short: 'Connections', title: 'Connections across the paper', q: 'Do the parts connect so the reader can follow the study from question to conclusion?' },
  { n: 3, cls: 'a3', short: 'Choices', title: 'Research choices', q: 'Can the reader see why the choices that affect validity were made?' },
  { n: 4, cls: 'a4', short: 'Delivery', title: 'Conveying information', q: 'Do sentences, terms, length, and figures deliver what the reader needs?' },
  { n: 5, cls: 'a5', short: 'Rhetoric', title: 'Rhetoric in place of evidence', q: 'When a sentence sounds like a reason, a comparison, an interpretation, or evidence, is the content actually there?' },
];
const ITEMS = [
  { id: '1-1', area: 1, v1: 'Argument graph', name: 'Unsupported Claims', what: 'A claim is stated as a result, and nothing in the paper backs it.',
    ex: { spec: 'our method is robust to label noise', specnote: 'Every experiment uses clean labels. No noise study, no proof, no citation.', src: 'AI paper · SciSlopBench FA0083 · §3 Method', pre: '', mark: 'This achieves near-high-k robustness at near-low-k average cost.', post: '', note: 'No cost, latency or compute is measured anywhere in the paper.' },
    judge: ['Decide what support this claim needs: an experiment, a proof, or a citation.', 'Look for it in the body, the appendix, and the supplement.', 'A claim too vague to pin down is logged separately, not as unsupported.'],
    not: ['Marked as a hypothesis or future work.', 'Backed by a proof, a citation, or an appendix result.'],
    fix: ['Connect the real support, or shrink the claim to it.', 'Not a fix: unrelated citations, invented runs, deleting the contribution.'],
    borders: [['5-4', 'support is described, but wrongly'], ['1-2', 'support exists, claim exceeds it']] },
  { id: '1-2', area: 1, v1: 'Argument graph', name: 'Overstated Claims', what: 'The results support less than the paper claims: they come from one model or one dataset, or the method adds compute it never accounts for.',
    parts: [{ id: '1-2b', name: 'Narrow Evaluation', what: 'Every result comes from one model or one dataset.' },
            { id: '1-2d', name: 'Missing Cost Accounting', what: 'The method adds model calls, passes or modules, and their cost is never reported.' }],
    ex: { spec: 'All experiments use a single encoder, XLM-R base, with a second re-ranking pass.', specnote: 'One encoder, one benchmark, and the extra pass is never timed.', src: '', pre: '', mark: '', post: '', note: '' },
    judge: ['Narrow Evaluation: count the models the experiments run with, their families, and the datasets the results are reported on.', 'Missing Cost Accounting: list what the method adds that costs compute, and look for a measured cost or a matched-budget comparison.', 'Score = the mean of the two parts (evaluation breadth and cost reporting, each 0–100).'],
    not: ['A benchmark paper (dataset count not scored), or a study of one named model by design (model count not scored).', 'A method that adds no compute: cost part not scored.'],
    fix: ['Run a second model or dataset; report runtime, tokens, FLOPs or memory for the method and the baseline.', 'Not a fix: more seeds on the same setting; saying “efficient” without a number.'],
    borders: [['1-1', 'no support at all'], ['5-4', 'evidence described wrongly']] },
  { id: '1-4', area: 1, name: 'Unclear Links to Prior Work', v1: 'Citation isolation', what: 'A method is cited on its own, tied to no other work and never related to this paper.',
    ex: { spec: 'Method B [7] adds a memory module.', specnote: 'B gets a sentence to itself. It is not tied to A [3], and the paper never says how its own method relates to B.', src: 'AI paper · SciSlopBench FA0163 · §4 Related Work', pre: 'For code generation, ', mark: 'AlphaCode [cite] achieves competition-level performance through massive sampling and clustering-based selection.', post: '', note: 'This paper’s method, ESR, groups sampled programs by how they behave when run. AlphaCode also samples many programs and groups them by their behaviour. The paper introduces AlphaCode in this one sentence and never says how ESR differs from it.' },
    judge: ['Units: citing sentences in the introduction and related work.', 'Woven (fine): cites two works, names another work, or takes up the sentence before (“extends this”).', 'Set aside: works the paper compares against, uses, or contrasts itself with; surveys, model releases, benchmarks, cited facts.'],
    not: ['A baseline introduced in one sentence and compared in a table.', 'A benchmark or a survey cited on its own.'],
    fix: ['One sentence on how this paper relates to the work: what it takes, what it does differently.', 'Not a fix: piling another citation into the sentence.'] },

  { id: '2-1', area: 2, name: 'Buried Findings', what: 'The body’s key finding never reaches the Abstract or Introduction.',
    ex: { spec: 'a novel attention mechanism that improves performance', specnote: '§4.2 shows the gain comes almost entirely from sentences with negation. The front matter never says so.', src: 'AI paper · SciSlopBench FA0002 · §4 Experiments', pre: 'On Multi-Query, ', mark: 'we achieve 70% reduction but with larger accuracy loss (3.65% vs. 12.10%)', post: ', indicating that distributed-information tasks inherently require higher cache coverage.', note: 'The abstract reports only the favorable task (46% cache reduction, 93% of accuracy kept). The accuracy collapse on the other task never reaches it.' },
    judge: ['Pick the key findings from the research question and the main results.', 'Is the finding’s meaning and its condition conveyed, not just a number?'],
    not: ['Detailed numbers or side analyses left to the body.', 'An accurate summary at a higher level.'],
    fix: ['Bring the finding and its condition to the front.', 'Not a fix: adding one number; turning an association into a mechanism.'],
    borders: [['1-2', 'the omission lets the claim exceed its support']] },
  { id: '2-3', area: 2, name: 'Missing Cross-Section Links', v1: 'Cross-section references', what: 'A section or a numbered equation from the method or experiments is never pointed to from anywhere it is used.',
    ex: { spec: 'With λ = 0.1, R@10 rises from 68.0 to 71.2.', specnote: 'λ is defined only in Eq. 2 of §3. §4 uses it and never points back to Eq. 2.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: 'Table 2 examines why ratio-based debiasing fails. ', mark: 'The ratio formula A_mid / (A_shallow + ε)', post: ' degrades performance at every tested configuration.', note: '§3 defines this formula as Equation 1. §4 writes it out again and points to neither §3 nor Equation 1. No other section points to §3 or §4.' },
    judge: ['Units: method, experiment and other body sections and labelled subsections; numbered equations and algorithms.', 'A section counts as used when another section points to it. An equation counts when anything points to it.', 'Pointers: \\ref, “Section 3”, “the previous section”, “in the Method section”.'],
    not: ['Introduction, related work, conclusion, statements: not checked.', 'Figures and tables used only in their own section.', 'The introduction’s roadmap: not counted as use.'],
    fix: ['Point back where a later section uses it: “the ratio formula (Eq. 1)”, “the setup in §3.2”.', 'Not a fix: pointers where the component is not used.'],
    borders: [['4-4', 'said again rather than pointed back to']] },

  { id: '2-5', area: 2, name: 'Empty Conclusion', v1: 'Macro redundancy', what: 'The conclusion says nothing new: it repeats the abstract or the introduction instead of drawing the results together.',
    ex: { spec: 'Our method consistently outperforms baselines across domains, with gains of up to 4 points.', specnote: 'The abstract says this word for word. The conclusion adds nothing to it.', src: 'AI paper · SciSlopBench FA0064 · §5 Conclusion', pre: '', mark: 'The method outperforms fixed periodic patterns by 10.4 percentage points and attention-based heuristics by 26.4 percentage points.', post: '', note: 'The abstract already says this, with the same two numbers. Four of the six conclusion sentences are copies like this one.' },
    judge: ['Compare each conclusion sentence with the abstract and the introduction.', 'A copy counts. The same point with a new number, condition or implication does not.'],
    not: ['A conclusion that recalls the main result in new words and says what it means.', 'Limitations and future work that are not in the abstract.'],
    fix: ['Replace the copied sentences with what the results mean together: what holds, where it stops, what follows.', 'Not a fix: rewording the abstract.'],
    borders: [['4-4', 'repetition inside the body; the conclusion is not scored there'], ['2-1', 'what the front of the paper is missing, not what the end repeats']] },
  { id: '3-1', area: 3, name: 'Unexplained Design Choices', what: 'A choice that affects validity is made, and no reason is given.',
    ex: { spec: 'Inputs longer than 512 tokens are excluded.', specnote: 'The method is sold for long inputs. Why exclude them, and what does that do to the evaluation?', src: 'AI paper · SciSlopBench FA0280 · §3 Method', pre: 'Our approach is straightforward: ', mark: 'extract attention weights from layer 12 (out of 32 LLM layers in InternVL2.5-8B)', post: ' and apply MIS selection directly without any debiasing.', note: 'Why layer 12 is never said, and no comparison across layers appears in the text. The overview figure shows an L8 bar that beats L12 and is reported nowhere.' },
    judge: ['Prioritize choices that affect the conclusion: architecture, data, comparisons, metrics.', 'Does the stated reason connect to this choice? “For efficiency” alone does not.', 'Keep apart: value unknown (reproducibility) and reason unknown (this item).'],
    not: ['A standard setting with a source.', 'Minor settings that do not touch the core claims.'],
    fix: ['Give the real rationale, constraint, or comparison.', 'Not a fix: inventing alternatives that were never run.'] },

  { id: '4-1', area: 4, name: 'Generic Filler', what: 'A sentence that repackages what was already shown in nicer words and tells the reader nothing new.',
    ex: { spec: 'This confirms the effectiveness of our approach.', specnote: 'It only repeats “Our model beats all baselines.” Delete it and nothing is missing.', src: 'AI paper · SciSlopBench FA0064 · §4 Experiments', pre: 'Compared to other 1/4-FA methods, NLL-Guided outperforms the best periodic pattern by 10.4 percentage points (64.6% vs 54.2%), ', mark: 'demonstrating that data-driven selection substantially outperforms fixed patterns under the same FA budget.', post: '', note: 'The first half gives the result. The marked half says the same thing in vaguer words.' },
    judge: ['Candidates are interpretive tails after a result or method (“…, highlighting …”, “This demonstrates that …”). The phrase list follows “Superficial analyses” in Wikipedia’s Signs of AI writing.', 'A candidate passes only if it adds one thing the text before it did not say: why (the mechanism), how far (scope or limit), what it rules out (an alternative explanation), or what follows (a decision for the next design or experiment). Otherwise FAIL.', 'The stock phrase only picks candidates. It does not decide.'],
    not: ['The sentence adds a why, a how far, a ruled-out alternative, or a what next.', 'The claim is too strong but still adds something (that is 1-2).'],
    fix: ['Delete it, or replace it with one of the four. “This indicates minimal interference between tasks.” → “So the drop in Section 5 is not caused by task interference.”', 'Not a fix: changing “shows” to “suggests”, re-adding the numbers, or inserting model and dataset names.'],
    borders: [['4-4', 'repeats another section, not the sentence right before'], ['1-2', 'too strong, not empty']] },
  { id: '4-2', area: 4, name: 'Undefined Terms', what: 'A term the reader needs is never given a meaning.',
    ex: { spec: 'semantic anchoring', specnote: 'No definition, equation, citation, or example says what semantic anchoring does.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments', pre: 'This occurs because LLaMA-3.1-8B-Instruct has a ', mark: 'low retrieval rate (<14%)', post: ', limiting the effectiveness of consensus-based validation.', note: '“Retrieval rate” explains the paper’s main negative result. It is never defined, and no table reports it.' },
    judge: ['Fix the intended reader and field.', 'Can the meaning be recovered from context, equations, or a cited definition?', 'Several names for one thing is a naming inconsistency, logged separately.'],
    not: ['Standard terms in their usual sense.', 'Meaning clear from an equation.'],
    fix: ['Explain the operation, object, or role.', 'Not a fix: expanding an acronym; swapping in another abstract word.'] },
  { id: '4-4', area: 4, name: 'Redundant Repetition', v1: 'Macro redundancy', what: 'Content is said again with no new information and no summary role.',
    ex: { spec: 'As Table 2 shows, our model beats all baselines on both datasets.', specnote: '§1 Introduction already says this in almost the same words. §4 adds nothing.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: '', mark: 'These results demonstrate that the ratio formula does not remove positional bias---it destroys useful saliency signal.', post: '', note: 'The method section already states this conclusion with its numbers. The experiments section repeats it in the same words and drops the numbers.' },
    judge: ['Find the closest earlier sentence in another section, abstract included.', 'A near-copy counts: 8-word runs cover half the sentence, or cosine ≥ 0.95.', 'One repeat makes the section slop.'],
    not: ['The abstract and the conclusion (not scored).', 'The same point in new words with new content.'],
    fix: ['Cut it, or put the missing analysis there.', 'Not a fix: paraphrase.'],
    borders: [['4-1', 'empty regardless of repetition']] },
  { id: '4-5', area: 4, name: 'Unclear Figures', v1: 'Figure exposition', what: 'A figure’s parts and relations cannot be read from the figure, its caption, or the text.',
    ex: { spec: 'Overview of the proposed framework.', specnote: 'Which arrows carry data and which carry gradients? What do the colors mean? Nothing says.', src: 'AI paper · SciSlopBench FA0280 · Figure 1, text inside the figure', pre: 'Key Insight: Deeper Layers = Better Token Selection · ', mark: 'L2 55% · L4 39% · L8 69% · L12 66%', post: '', note: 'The L8 result appears in no table or sentence, and it is higher than the layer the paper chose. The L2 bar is D²Pruner with debiasing, not raw L2.' },
    judge: ['Fix the figure’s purpose first.', 'Can the needed elements, symbols, axes, and flows be read from the figure plus its explanation?', 'Decoration count and caption length decide nothing.'],
    not: ['A short caption whose meaning is clear from the legend and text.', 'A simplified overview whose detail is clearly located.'],
    fix: ['Explain the notation and tie it to the method.', 'Not a fix: a longer caption; deleting the figure.'] },

  { id: '5-4', area: 5, v1: 'Argument graph', name: 'Misrepresented Evidence', link: ['the evidence as described', 'the actual source or experiments'], what: 'The paper says evidence exists, and the evidence does not say that.',
    ex: { spec: 'Prior studies established that update rule A converges under adaptive step sizes [12].', specnote: 'The theorem in [12] covers fixed step sizes only. Nothing extends it.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: 'All values are well below ', mark: 'the 0.3 threshold typically considered indicative of meaningful positional bias.', post: '', note: 'No source for the threshold, and none for who considers it. The paper’s central diagnostic rests on it.' },
    judge: ['Check four things against the material: existence, content, scope, consensus.', '“Extensive”, “numerous”, and citation counts are not the criterion.', 'Source unreachable means undecidable, not a defect.'],
    not: ['A citation that describes its source and conditions accurately.', 'A single survey backing a consensus statement.'],
    fix: ['Describe what the support actually shows.', 'If a support statement goes, recheck the remaining claim.', 'Not a fix: more citations; deleting “extensive”.'],
    borders: [['1-1', 'no support is claimed at all'], ['1-2', 'range reported right, then generalized']] },
];
// Definitions tab text, 1013: one plain definition, one or two real sentences (the second shows where the support should be), two-sentence note.
const DEF = {
  '1-1': { what: 'The paper states a result and never shows the experiment, proof, or source behind it.',
    q: [{ pre: '', mark: 'This achieves near-high-k robustness at near-low-k average cost.', post: '', src: 'AI paper · SciSlopBench FA0083 · §3 Method' }],
    note: '“Cost” promises a measurement: latency, compute, or memory. No table or figure in the paper measures any of them, so the sentence is the only evidence for itself.' },
  '1-2': { what: 'The paper claims more than its experiments can show: the method is tried in too few settings, or what it costs is left out.',
    q: [{ pre: 'We use ', mark: 'Qwen2.5-VL-7B-Instruct as the judge model', post: ', deployed via vLLM with tensor parallelism across 2 GPUs using bfloat16 precision.', src: 'AI paper · SciSlopBench FA0043 · §4 Experiments' },
        { pre: 'We propose ', mark: 'a two-pass architecture', post: ' where the judge first generates its own answer using only trusted inputs, then uses this uncontaminated reference when evaluating candidates.', src: 'Same paper · §3 Method' }],
    note: 'One judge model on one benchmark (VL-RewardBench), and the defense doubles the model calls per example. The paper reports the accuracy it costs, never the compute.' },
  '1-4': { what: 'The paper introduces a method in a sentence of its own and never says how its own method relates to it.',
    q: [{ pre: 'For code generation, ', mark: 'AlphaCode [cite] achieves competition-level performance through massive sampling and clustering-based selection.', post: '', src: 'AI paper · SciSlopBench FA0163 · §4 Related Work' },
        { pre: 'We propose Execution-Signature Recycling (ESR), a training-free method that ', mark: 'clusters candidates by their execution signatures', post: '—the set of failing tests and error types—and conditions subsequent generations on a deduplicated failure bank.', src: 'Same paper · Abstract' }],
    note: 'Both sample many programs and group them by what happens when they run. AlphaCode appears once, in the sentence above, and the paper never says what ESR does differently.' },
  '2-1': { what: 'The results have a bad side, and the abstract tells only the good side.',
    q: [{ pre: 'On RULER long-context benchmarks, our method achieves ', mark: '46% cache reduction on Variable Tracking while preserving 93% baseline accuracy', post: ' (16.52% vs. 17.72%).', src: 'AI paper · SciSlopBench FA0002 · Abstract' },
        { pre: 'On Multi-Query, we achieve 70% reduction but with ', mark: 'larger accuracy loss (3.65% vs. 12.10%)', post: ', indicating that distributed-information tasks inherently require higher cache coverage.', src: 'Same paper · §4 Experiments' }],
    note: 'Read the abstract and the method works. Read §4 and on the second task accuracy falls to a third. The abstract never mentions the second task.' },
  '2-3': { what: 'The paper sets something up in one section and never points back to it where it is used.',
    q: [{ pre: 'Table 2 examines why ratio-based debiasing fails. ', mark: 'The ratio formula A_mid / (A_shallow + ε)', post: ' degrades performance at every tested configuration.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments' },
        { pre: 'Our proposed debiasing formula was: ', mark: 'A_debiased(i) = A_mid(i) / (A_shallow(i) + ε)   (1)', post: '', src: 'Same paper · §3 Method' }],
    note: '§4 tests the formula from §3 but writes it out again instead of pointing to Equation 1 or §3. No other section points to §3 or §4 at all.' },
  '3-1': { what: 'The paper makes a choice its results depend on and gives no reason for it.',
    q: [{ pre: 'Our approach is straightforward: extract attention weights from ', mark: 'layer 12 (out of 32 LLM layers in InternVL2.5-8B)', post: ' and apply MIS selection directly without any debiasing.', src: 'AI paper · SciSlopBench FA0280 · §3 Method' },
        { pre: 'Key Insight: Deeper Layers = Better Token Selection · L2 55% · L4 39% · ', mark: 'L8 69% · L12 66%', post: '', src: 'Same paper · Figure 1, text inside the figure' }],
    note: 'The method is the choice of layer, and the paper never says why 12. Its own figure shows layer 8 scoring higher, and the text never mentions it.' },
  '4-1': { what: 'The sentence repeats the result right before it.',
    q: [{ pre: 'Compared to other 1/4-FA methods, NLL-Guided outperforms the best periodic pattern by 10.4 percentage points (64.6% vs 54.2%), ', mark: 'demonstrating that data-driven selection substantially outperforms fixed patterns under the same FA budget.', post: '', src: 'AI paper · SciSlopBench FA0064 · §4 Experiments' },
        { pre: '', mark: 'This demonstrates that intelligent layer selection can substantially reduce computational cost with minimal accuracy loss.', post: '', src: 'Same paper · §4 Experiments, right after the accuracy and FA-budget numbers' }],
    note: 'Both come right after the numbers and say them again in vaguer words. Deleting them loses nothing.' },
  '4-2': { what: 'The paper leans on a term it never defines.',
    q: [{ pre: 'This occurs because LLaMA-3.1-8B-Instruct has a ', mark: 'low retrieval rate (<14%)', post: ', limiting the effectiveness of consensus-based validation.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments' }],
    note: 'The paper’s main negative result is explained by this number. “Retrieval rate” is never defined and no table reports it, so the reader cannot tell what 14% is a share of.' },
  '2-5': { what: 'The conclusion repeats the abstract.',
    q: [{ pre: '', mark: 'The method outperforms fixed periodic patterns by 10.4 percentage points and attention-based heuristics by 26.4 percentage points.', post: '', src: 'AI paper · SciSlopBench FA0064 · §5 Conclusion' },
        { pre: '', mark: 'NLL-guided selection outperforms the best periodic 1/4-FA pattern by 10.4 percentage points and attention-based heuristics by 26.4 percentage points.', post: '', src: 'Same paper · Abstract' }],
    note: 'Same claim, same two numbers. The human paper on the same topic copies none of its three conclusion sentences.' },
  '4-4': { what: 'The paper says the same thing again, with nothing new and no reason to repeat it.',
    q: [{ pre: '', mark: 'These results demonstrate that the ratio formula does not remove positional bias---it destroys useful saliency signal.', post: '', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments' },
        { pre: 'Consequently, ', mark: 'the ratio formula in Equation 3 does not remove positional bias---it destroys useful saliency signal', post: ', resulting in only 13.24% grounding accuracy compared to 38.70% with raw attention at the same layer.', src: 'Same paper · §3 Method' }],
    note: 'The method section already states this conclusion with its numbers. The experiments section repeats it in the same words and drops the numbers. The introduction also repeats three abstract sentences almost word for word.' },
  '4-5': { what: 'The figure shows something the reader cannot interpret from the figure, its caption, or the text.',
    q: [{ pre: 'Key Insight: Deeper Layers = Better Token Selection · ', mark: 'L2 55% · L4 39% · L8 69% · L12 66%', post: '', src: 'AI paper · SciSlopBench FA0280 · Figure 1, text inside the figure' }],
    note: 'Nothing says what the four bars measure, or that the L2 bar is a different method with debiasing. The highest bar, L8, is never mentioned in the text, so the reader cannot tell what the figure is showing.' },
  '5-4': { what: 'The paper says a source or a standard backs a claim, and the source is not there or does not say that.',
    q: [{ pre: 'All values are well below the 0.3 threshold ', mark: 'typically considered', post: ' indicative of meaningful positional bias.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments' }],
    note: '“Typically considered” points to a convention someone established. No citation is given here or anywhere in the paper, and the paper’s central diagnostic rests on this threshold.' },
};
for (const it of ITEMS) { const d = DEF[it.id]; if (!d) continue; it.what = d.what; const [a, b] = d.q; it.ex.pre = a.pre; it.ex.mark = a.mark; it.ex.post = a.post; it.ex.src = a.src; it.ex.note = d.note; it.ex2 = b || null; }

const PRINCIPLES = [
  ['Whole paper', 'Body, appendix, and supplement are read together. Absence from the material is not “never done”.'],
  ['Only what is needed', 'A missing example, explanation, or link counts only if the paper needs it.'],
  ['Context, not keywords', 'No judgment from one sentence or one word. Surrounding text, figures, and citations may do the job.'],
  ['Evidence on record', 'Each judgment notes the place, the affected claim, what is missing, and what was checked.'],
  ['Counts are signals', 'Reference counts, overlap, section length: supporting signals, never the definition.'],
  ['No double counting', 'One omission logged under two items is linked and counted once.'],
  ['Real fixes only', 'Invented explanations, or deleting a needed claim to lower the score, are not fixes.'],
];
const CUES = [
  ['Evaluative words', 'novel, robust, significantly, state-of-the-art', ['1-2']],
  ['Evidence talk', 'it is well established that, extensive experiments show', ['5-4']],
  ['Rule of three', 'novel, efficient, and scalable', ['1-1', '1-2', '5-4']],
  ['Empty signposting', 'it is worth noting that, in summary, overall', ['4-1', '4-4']],
  ['Circular phrasing', 'the extraction module extracts features', ['4-1', '4-2', '3-1']],
  ['Scope limiting', 'beyond the scope, left for future work', ['3-1', '1-2', '4-1']],
  ['Surface style', 'em dashes, title case, bold run-in headings', []],
];
const MAP = [['1-4', 'Citation isolation'], ['2-3', 'Cross-section references'], ['4-4', 'Macro redundancy'], ['2-5', 'Macro redundancy'], ['4-5', 'Figure exposition']];

// ------------------------------------------------------------------ findings (verified numbers: paper Table 2, §4; live index)
const BENCH = [['Scientific Slop Index', .859, true], ['Binoculars', .687], ['CycleReviewer', .685], ['DetectGPT', .638], ['NTS', .626], ['AI Scientist reviewer', .615]];
const MEASURES = [['Cross-section references', .905, C.struct, '2-3'], ['Figure exposition', .809, C.art, '4-5'], ['Citation isolation', .793, C.arg, '1-4'], ['Evidence gap', .764, C.art, '1-3'], ['Macro redundancy', .723, C.struct, '4-4'], ['Argument graph', .586, C.arg, '1-1 · 5-x']];
const HARNESS = [['Review only', .30, '17% of rounds break a guard'], ['Definitions + review', .25, 'no located instances'], ['Definitions + locations', .11, '23% of rounds break a guard'], ['Full SciSlopHarness', .17, 'no guard breaks', true]];
function hbars(rows, o = {}) { // rows: [label, value, {color, bold, note}]
  const W = 320, LW = o.lw || 118, rh = 18, pad = 2, max = o.max || 1, H = rows.length * rh + pad * 2;
  let s = '';
  rows.forEach((r, i) => {
    const [label, v, opt = {}] = r; const y = pad + i * rh, bw = (W - LW - 44) * (v / max), col = opt.color || (opt.bold ? 'var(--red)' : 'var(--line-2)');
    s += `<text x="${LW - 8}" y="${y + rh / 2 + .5}" text-anchor="end" dominant-baseline="central" font-size="11.5" ${opt.bold ? 'font-weight="700"' : ''} fill="var(--ink)">${esc(label)}</text>`;
    s += `<rect x="${LW}" y="${y + 4}" width="${W - LW - 44}" height="${rh - 8}" rx="3" fill="var(--surface-2)"/><rect x="${LW}" y="${y + 4}" width="${bw}" height="${rh - 8}" rx="3" fill="${col}"/>`;
    s += `<text x="${W - 36}" y="${y + rh / 2 + .5}" dominant-baseline="central" font-size="11.5" font-weight="${opt.bold ? 700 : 500}" fill="var(--ink)">${o.fmt ? o.fmt(v) : v.toFixed(3)}</text>`;
  });
  if (o.chance) { const x = LW + (W - LW - 44) * (o.chance / max); s += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="var(--ink-3)" stroke-dasharray="2 2"/><text x="${x + 3}" y="${H - 3}" font-size="9.5" fill="var(--ink-3)">chance</text>`; }
  return `<svg class="v-chart" viewBox="0 0 ${W} ${H}" font-family="Inter, system-ui, sans-serif">${s}</svg>`;
}
const FINDINGS = [
  { id: 'f1', q: 'How does AI slop differ from human poor writing?', a: 'Human and AI papers on the same 12 items, author hidden.',
    compare: 'Human-written papers and AI-generated papers. The judge never sees the author; the label is joined afterwards.',
    measure: 'The distribution of each item in each group: how often, how severe, and in what concrete form. Which slop is shared, which is AI’s alone.',
    v1: 'Six counting measures already pick the AI paper in 85.9% of 390 matched pairs; the best AI-text detector reaches 68.7%.',
    chart: () => hbars(BENCH.map(([l, v, b]) => [l, v, { bold: !!b, color: b ? 'var(--red)' : 'var(--line-2)' }]), { chance: .5 }), cap: 'v1 result: pair accuracy on SciSlopBench (paper, Table 2). Chance is 0.5.', status: 'v1 result · v1.1 per item' },
  { id: 'f2', q: 'How does slop relate to review scores, and how does that differ by year and venue?', a: '60k ICLR 2027 submissions, ICLR 2017–2026 by year, NeurIPS, ICML and ACL by venue.',
    compare: 'Submissions with their review scores: the 60k ICLR 2027 submissions, every ICLR year from 2017 to 2026, and NeurIPS, ICML and ACL.',
    measure: 'How each item relates to the score, and whether the relation holds in every year and every venue.',
    v1: 'In every ICLR year from 2017 to 2025, papers with more slop received lower reviewer scores.',
    chart: () => `<div class="years">${[2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => `<span class="yr"><b>${y}</b><i>more slop ↓ score</i></span>`).join('')}<span class="yr plan"><b>2026</b><i>planned</i></span><span class="yr plan"><b>2027</b><i>60k submissions · planned</i></span></div>`, cap: 'v1 result: paper §4, review alignment. The pattern holds within every year. v2 starts from the 60k ICLR 2027 submissions, then adds venues.', status: 'v1 result · v2: 60k ICLR 2027, venues' },
  { id: 'f3', q: 'Is an AI reviewer more tolerant of slop in AI papers than a human reviewer?', a: 'Same paper, one human review and one AI review. Does the AI reviewer miss more slop when the author is AI?',
    compare: 'The same papers reviewed by humans and by AI reviewers, with the author (human or AI) joined afterwards.',
    measure: 'Which items each kind of review misses, and whether the AI reviewer’s misses grow when the paper is AI-written.',
    v1: null, chart: () => '', cap: '', status: 'planned' },
  { id: 'f4', q: 'What problems do reviewers point out for each type of slop?', a: 'Reviewer weaknesses collected per item: does a 1-1 paper get “claims not supported”, a 4-4 paper “repetitive”?',
    compare: 'High-slop papers and the weakness sections of their reviews.',
    measure: 'Which remark each item draws, and which items reviewers never name even when the paper has them.',
    v1: null, chart: () => '', cap: '', status: 'planned' },
];

// ------------------------------------------------------------------ specimen paper (two columns; every registry item planted once)
const M = id => ({ mark: id });
const A = (g, text) => ({ anchor: g, text });        // a real place in the paper another slop points at
const G = (g, text) => ({ ghost: g, text });         // the place where something should be, and is not
const PAGE = {
  title: 'Adaptive Token Weighting for Cross-Lingual Retrieval', authors: 'A. Author · B. Author · C. Author',
  left: [
    { h: 'Abstract', p: ['Cross-lingual retrieval models weight every token the same. We introduce ', M('2-1'), ' on three benchmarks. ', A('g25', 'Our method consistently outperforms baselines across domains, with gains of up to 4 points.')], lines: 1 },
    { h: '1  Introduction', p: ['We propose a framework that learns token weights for cross-lingual retrieval. ', A('g44', 'Our model beats all baselines on both datasets.')], lines: 1 },
    { p: [M('4-1'), ' ', G('g41', 'delete it: nothing is lost')], lines: 1 },
    { h: '2  Related Work', p: ['Method A [3] uses contrastive pairs. ', M('1-4'), ' ', G('g14', 'B alone; ours vs B never said')], lines: 1 },
    { p: [M('5-4')], lines: 1 },
    { h: '3  Method', p: ['We apply ', M('4-2'), ' ', G('g42', 'definition'), ' before fusion and then project to the shared space. ', A('gloss', 'We add an alignment term: L = L_task + λ·L_align (Eq. 2).')], lines: 1 },
    { fig: true, cap: [M('4-5'), ' Solid and dashed arrows; blue, green, and orange blocks.'] },
  ],
  right: [
    { h: '4  Experiments', sub: '4.1  Setup', p: [A('gqa', 'We evaluate on long-document QA.'), ' ', M('1-2'), ' ', M('3-1'), ' ', G('g31', 'why? effect on the long-input claim?'), ' ', G('g11', 'no label-noise experiment')], lines: 1 },
    { sub: '4.2  Results', p: ['Table 3 ablates the alignment term. ', M('2-3')], lines: 1 },
    { p: ['Adding the auxiliary loss improves BLEU by 1.8 points.'], lines: 1 },
    { p: ['Table 2 reports the main results. ', M('4-4')], lines: 1 },
    { sub: '4.3  Analysis', p: [A('gneg', 'The gain concentrates on sentences that contain negation (Table 5).')], lines: 1 },
    { h: '5  Discussion', p: ['Beyond accuracy, ', M('1-1'), ' and transfers to new domains.'], lines: 1 },
    { h: '6  Conclusion', p: ['We presented adaptive token weighting. ', M('2-5')], lines: 1 },
        { h: 'References', refs: ['[3] A. et al. Contrastive pairs for retrieval. 2023.', '[7] B. et al. Memory-augmented retrieval. 2024.', A('gref', '[12] C. et al. Convergence of rule A. Theorem 1: fixed step size.')], lines: 0, small: true },
  ],
};
// how each slop fails on this page: where the mark points, and what the reader finds there
const FAIL = {
  '1-1': { to: 'g11', label: 'no label-noise experiment anywhere in §4' },
  '1-2': { to: 'gqa', label: 'one encoder, one benchmark; the extra pass is never timed' },
  '1-4': { to: 'g14', label: 'B gets one sentence; how our method relates to B is never said' },
  '2-1': { to: 'gneg', label: 'this finding never reaches the Abstract' },
  '2-3': { to: 'gloss', label: 'Eq. 2 defines λ here · §4 never points back', miss: true },
  '3-1': { to: 'g31', label: 'excluded, no reason given' },
  '4-1': { to: 'g41', label: 'says the sentence before again' },
  '4-2': { to: 'g42', label: 'never defined' },
  '2-5': { to: 'g25', label: 'the Abstract sentence, copied', eq: true, from: 'Abstract', at: '6 Conclusion' },
  '4-4': { to: 'g44', label: 'the same sentence as in §1', eq: true, from: '§1 Introduction', at: '§4.2 Results' },
  '4-5': { to: 'gfig', label: 'arrows and colors never explained' },
  '5-4': { to: 'gref', label: '[12] covers fixed step sizes only' },
};
const PLANES = { structure: { title: 'Structure', q: 'Do the sections build on one another?' }, argument: { title: 'Argument', q: 'Are the claims and citations argued?' }, artifacts: { title: 'Artifacts', q: 'Can the method and the evidence be inspected?' } };
const PLANE_OF = { '2-1': 'structure', '2-3': 'structure', '2-5': 'structure', '4-1': 'structure', '4-4': 'structure',
  '1-1': 'argument', '1-2': 'argument', '1-4': 'argument', '5-4': 'argument',
  '3-1': 'artifacts', '4-2': 'artifacts', '4-5': 'artifacts' };
const PLANE_C = { structure: '#7E4E66', argument: '#E4959E', artifacts: '#56717B' };   // site planes: structure/artifacts in their deep shade so structure and argument separate
// the page groups the twelve items by the index's three planes; the 1-5 area numbers stay in the item ids
const GROUPS = [
  { n: 1, key: 'structure', cls: 'p-structure', title: 'Structure', q: 'Do the sections build on one another?' },
  { n: 2, key: 'argument', cls: 'p-argument', title: 'Argument', q: 'Are the claims and citations argued?' },
  { n: 3, key: 'artifacts', cls: 'p-artifacts', title: 'Artifacts', q: 'Can the method and the evidence be inspected?' },
];
for (const it of ITEMS) { it.plane = PLANE_OF[it.id]; it.ar = GROUPS.find(g => g.key === it.plane); it.g = it.ar.n; }
const SHORT = { '1-1': 'A claim with no evidence behind it.', '1-2': 'The paper claims more than its experiments can show.', '1-4': 'A method cited alone and never related to this paper.',
  '2-1': 'The key finding is missing from the abstract.', '2-3': 'Set up in one section, never pointed back to.', '3-1': 'A design choice with no reason given.',
  '2-5': 'The conclusion only repeats the abstract.', '4-1': 'Repackages what was shown; tells nothing new.', '4-2': 'A term that is never defined.', '4-4': 'The same sentence in two sections.', '4-5': 'Figure arrows and colors never explained.',
  '5-4': 'The cited source says something else.' };
for (const it of ITEMS) it.short = SHORT[it.id];
const BY_ID = Object.fromEntries(ITEMS.map(i => [i.id, i]));
function renderPage() {
  const col = blocks => h('div', { class: 'pcol' }, ...blocks.map(b => {
    const out = [];
    if (b.h) out.push(h('h4', { text: b.h }));
    if (b.sub) out.push(h('h5', { text: b.sub }));
    if (b.fig) out.push(h('div', { class: 'pfig' }, h('div', { class: 'pfig-d', 'data-g': 'gfig', html: '<svg viewBox="0 0 100 30"><rect x="6" y="9" width="18" height="12" rx="2" fill="#D9E5EA" stroke="#5C717D" stroke-width=".6"/><rect x="41" y="9" width="18" height="12" rx="2" fill="#E6EFDF" stroke="#5C717D" stroke-width=".6"/><rect x="76" y="9" width="18" height="12" rx="2" fill="#F6E7D2" stroke="#5C717D" stroke-width=".6"/><path d="M24 15H40" stroke="#5C717D" stroke-width=".8"/><path d="M59 15H75" stroke="#5C717D" stroke-width=".8" stroke-dasharray="2 1.5"/><path d="M15 21C30 32 70 32 85 21" fill="none" stroke="#5C717D" stroke-width=".8" stroke-dasharray="2 1.5"/></svg>' }), h('p', { class: 'pcap' }, ...b.cap.map(seg))));
    if (b.table) out.push(h('table', { class: 'ptab' }, h('caption', { text: 'Table 3: Ablation on the dev set.' }), h('tr', {}, h('th', { text: 'Model' }), h('th', { text: 'R@10' })), h('tr', {}, h('td', { text: 'Full model' }), h('td', { text: '71.2' })), h('tr', {}, h('td', {}, seg(M('2-3'))), h('td', { text: '68.0' })), h('tr', {}, h('td', { text: 'w/o auxiliary loss' }), h('td', { text: '69.4' }))));
    if (b.refs) out.push(h('div', { class: 'prefs' }, ...b.refs.map(r => h('p', {}, seg(r)))));
    if (b.p) out.push(h('p', {}, ...b.p.map(seg)));
    if (b.lines) out.push(h('div', { class: 'plines' + (b.small ? ' small' : ''), style: `height:${b.lines * (b.small ? 7 : 8.5)}px` }));
    return out;
  }).flat());
  function seg(x) { if (typeof x === 'string') return x; if (x.anchor) return h('span', { class: 'pa', 'data-g': x.anchor, text: x.text }); if (x.ghost) return h('span', { class: 'pg', 'data-g': x.ghost, text: x.text }); const it = BY_ID[x.mark]; return h('mark', { class: 'mk ' + it.ar.cls, 'data-id': it.id, tabindex: 0, 'aria-label': it.name, text: it.ex.spec || it.ex.mark }); }
  $('#spec-page').replaceChildren(h('h3', { class: 'ptitle', text: PAGE.title }), h('p', { class: 'pauth', text: PAGE.authors }), h('div', { class: 'pcols' }, col(PAGE.left), col(PAGE.right)));
}
function sideCard(it) {
  const c = h('div', { class: 'v-sc ' + it.ar.cls, 'data-id': it.id, tabindex: 0 },
    h('div', { class: 'sc-h' }, h('span', { class: 'sc-t' }, h('span', { class: 'sc-pl', text: it.ar.title }), h('b', { text: it.name })), h('span', { class: 'sc-votes', 'data-votes': it.id }, ...voteBtns(it.id))),
    h('p', { class: 'sc-w', text: it.short }),
    h('div', { class: 'sc-more' }, h('p', { class: 'sc-n', text: it.what }), h('p', { class: 'sc-n sc-note', text: it.ex.specnote || it.ex.note }), h('a', { href: '#' + it.id, 'data-xref': it.id, class: 'sc-def', text: 'Definition →' }), ' ', h('a', { href: '#hub-' + it.id, 'data-xref': 'hub-' + it.id, class: 'sc-def', text: 'Seen it? Add a case →' })));
  return c;
}
function overEl() { let o = $('#spec-over'); if (!o) { o = h('div', { id: 'spec-over', class: 'spec-over' }); $('.spec-page-wrap').append(o); } return o; }
function clearOver() { const o = $('#spec-over'); if (o) o.replaceChildren(); document.querySelectorAll('.pg.hot, .pa.hot').forEach(el => el.classList.remove('hot')); document.querySelectorAll('#spec-page .hlx').forEach(el => el.classList.remove('hlx', 'hl1', 'hl2')); }
function drawOver(id) {
  // a reviewer's red pen: underline the sentence, loop where the reader checks, and write each note on its own line in the page
  // (notes are real lines inserted into the flow, so they never sit on top of text)
  clearOver(); document.querySelectorAll('#spec-page .pnote').forEach(n => n.remove());
  const f = FAIL[id] || {}, it = BY_ID[id];
  const mk = document.querySelector(`#spec-page .mk[data-id="${id}"]`); if (!mk) return;
  let tg = f.to ? document.querySelector(`#spec-page [data-g="${f.to}"]`) : null;
  if (tg && tg.classList.contains('pg')) tg = null;
  const blockOf = el => el.closest('td, th') ? el.closest('table') : el.closest('p, h4, h5, .pfig, .prefs, table') || el;
  const far = tg ? Math.abs(tg.getBoundingClientRect().top - mk.getBoundingClientRect().top) > 220 : false;
  const pnote = (txt, d0) => h('div', { class: 'pnote' + (far ? ' far' : ''), style: `--d:${d0}s`, text: txt });
  const top = it.short.replace(/\.$/, ''), lab = (f.eq ? '= ' : '') + (f.label || ''), lab0 = lab.toLowerCase();
  const same = lab0 && (top.toLowerCase().includes(lab0) || lab0.includes(top.toLowerCase().slice(0, 18)));
  const mb = blockOf(mk);
  if (f.eq && tg) {
    // the same sentence in two sections: highlight the first place, then the copy, then join them
    const tb = blockOf(tg);
    tb.before(pnote('① ' + f.from + ': first said here', .1)); tg.classList.add('hlx', 'hl1');
    mb.before(pnote('② ' + f.at + ': the same sentence again', 1.0)); mk.classList.add('hlx', 'hl2');
  } else {
  if (!same) mb.before(pnote(top, .35));
  if (tg) { const tb = blockOf(tg); if (tb === mb) mb.after(pnote(lab, 1.3)); else if (tb.compareDocumentPosition(mb) & Node.DOCUMENT_POSITION_FOLLOWING) tb.after(pnote(lab, 1.3)); else tb.before(pnote(lab, 1.3)); }
  else if (lab) mb.after(pnote(lab, .9));
  }
  // pen strokes, measured after the page has made room
  const wrap = $('.spec-page-wrap'); const wr = wrap.getBoundingClientRect(); const o = overEl();
  const rel = r => ({ l: r.left - wr.left, t: r.top - wr.top, r: r.right - wr.left, b: r.bottom - wr.top });
  const W = wrap.offsetWidth, mr = [...mk.getClientRects()].map(rel), m0 = mr[0], m1 = mr[mr.length - 1];
  let g = mr.map((r, i) => squig(r.l, r.r, r.b + 2, (f.eq ? 1.4 : .05) + i * .15)).join('');
  if (tg) {
    tg.classList.add('hot'); const tr = [...tg.getClientRects()].map(rel), t0 = tr[0], t1 = tr[tr.length - 1];
    const tl = Math.min(...tr.map(r => r.l)), trr = Math.max(...tr.map(r => r.r)), tt = t0.t, tb = t1.b, cx = (tl + trr) / 2, cy = (tt + tb) / 2;
    if (!f.eq) g += loop(cx, cy, (trr - tl) / 2 + 5, (tb - tt) / 2 + 3, .8);
    const sameCol = Math.abs(tl - Math.min(...mr.map(r => r.l))) < 120; let pts;
    if (sameCol) { const gx = Math.max(6, Math.min(tl, m0.l) - 16), sy = (m0.t + m0.b) / 2; pts = [[m0.l - 3, sy], [gx, sy - (sy - cy) * .2], [gx - 2, cy + (sy - cy) * .2], [tl - 5, cy]]; }
    else if (tl > m1.r) { const gx = (m1.r + tl) / 2, sy = (m1.t + m1.b) / 2; pts = [[m1.r + 3, sy], [gx, sy], [gx, cy], [tl - 5, cy]]; }
    else { const gx = (trr + m0.l) / 2, sy = (m0.t + m0.b) / 2; pts = [[m0.l - 3, sy], [gx, sy], [gx, cy], [trr + 5, cy]]; }
    g += arrow(pts, f.eq ? 1.7 : .55);
    if (f.miss) { const [p, q] = pts.length > 2 ? [pts[1], pts[2]] : pts, mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;   // the pointer that should be there and is not
      g += `<g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})"><g class="mx" style="--d:1.25s"><circle r="10" fill="#d93a3a" stroke="#fff" stroke-width="2"/><path d="M-4 -4L4 4M-4 4L4 -4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g></g>`; }
  }
  o.innerHTML = `<svg class="over-svg pen-over" width="${W}" height="${wrap.offsetHeight}" viewBox="0 0 ${W} ${wrap.offsetHeight}">${g}</svg>`;
}


// ------------------------------------------------------------------ render the rest
const xref = id => `<a class="xref" href="#${id}" data-xref="${id}">${id}</a>`;
renderPage();
// one small scene per analysis, in the pictogram vocabulary
const PAPER = (x, y, w, h, label, marks) => K.card(x, y, w, h, label) + K.lines(x + 3, y + 7, w - 6, 3, { gap: 3.2, last: .6 }) + (marks || []).map(([mx, my, mw, col]) => K.box(x + mx, y + my, mw, 2.6, { fc: col, ec: col, r: .8 })).join('');
const PERSON = (x, y, col) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${col}"/><path d="M${x - 4.6} ${y + 9.5} a4.6 4.6 0 0 1 9.2 0z" fill="${col}"/>`;
const ROBOT = (x, y, col) => K.box(x - 3.4, y - 2.6, 6.8, 6, { fc: col, ec: col, r: 1 }) + `<rect x="${x - 2}" y="${y - 1}" width="1.4" height="1.4" fill="#fff"/><rect x="${x + .6}" y="${y - 1}" width="1.4" height="1.4" fill="#fff"/><line x1="${x}" y1="${y - 2.6}" x2="${x}" y2="${y - 4.5}" stroke="${col}" stroke-width=".8"/>` + K.box(x - 4.6, y + 4.4, 9.2, 5, { fc: col, ec: col, r: 1 });
const MINI_CAP = {"f1": "Human and AI papers, same 12 items, author hidden", "f2": "Slop against review scores, year by year and venue by venue", "f3": "One paper, one human review and one AI review", "f4": "Each review remark matched to the slop it points at"};
const MINI = {
  f1: () => `<img src="img/q1.png" alt="An AI paper that looks polished next to a human paper full of red marks">`,
  f2: () => `<img src="img/q2_v2.png" alt="Clean and sloppy AI papers, reviewers' star ratings, and the scores plotted by year and by venue">`,
  f3: () => `<img src="img/q3.png" alt="The same AI paper: the AI reviewer gives four stars, the human reviewer two">`,
  f4: () => `<img src="img/q4.png" alt="Slop types in an AI paper and the reviewer's remark for each">`,
};
$('#qtiles').replaceChildren(...FINDINGS.map((f, i) => h('li', {}, h('a', { class: 'ql', href: '#' + f.id },
  h('span', { class: 'ql-pic', html: MINI[f.id]() }),
  h('span', { class: 'ql-n', text: 'Q' + (i + 1) }),
  h('b', { class: 'ql-q', text: f.q })))));
$('#findings').replaceChildren(...FINDINGS.map((f, i) => h('section', { class: 'v-finding card', id: f.id },
  h('div', { class: 'fd-t' }, h('p', { class: 'fd-q', text: f.status }), h('h3', { text: f.q }), h('p', { class: 'fd-b', text: f.a }),
    h('dl', { class: 'fd-dl' }, h('dt', { text: 'We compare' }), h('dd', { text: f.compare }), h('dt', { text: 'We measure' }), h('dd', { text: f.measure }), f.v1 ? h('dt', { text: 'v1 already showed' }) : null, f.v1 ? h('dd', { text: f.v1 }) : null)),
  h('div', { class: 'fd-c' }, h('div', { html: f.chart() }), f.cap ? h('p', { class: 'cap', text: f.cap }) : null))));
$('#principles-grid').replaceChildren(...PRINCIPLES.map(([t, p]) => h('div', { class: 'pr' }, h('b', { text: t }), h('span', { text: p }))));
$('#area-tiles').replaceChildren(...GROUPS.map(a => h('a', { class: 'atile ' + a.cls, href: '#area-' + a.n }, h('span', { class: 'an', text: ITEMS.filter(i => i.g === a.n).length + ' items' }), h('b', { text: a.title }), h('span', { class: 'aq', text: a.q }))));
function excerpt(ex) { return h('div', { class: 'v-ex' + (ex.made ? ' made' : '') }, h('div', { class: 'ex-h', text: ex.src || ex.sec }), h('p', { class: 'ex-t' }, ex.pre, h('mark', { text: ex.mark }), ex.post), h('p', { class: 'ex-n', text: ex.note })); }
function bullets(cls, label, arr) { return h('div', { class: 'dl ' + cls }, h('span', { class: 'l', text: label }), h('ul', {}, ...arr.map(t => h('li', { text: t })))); }
// ------------------------------------------------------------------ how it is measured (v2 measurer, slop_v2/metrics.py)
// Flow animation over a real run. measure/<id>.json (built by v2/slop_v2/build_measure_json.py) holds one paper's units in a
// common shape: s1 the unit, s2 the question the model answers, s3 what was found + the judge's answer, s4 the verdict.
// MEASURE[id] gives the four box titles, the "how?" bullets per box and one closing line. Keep the wording label-short.
const Q = 'Qwen', CD = 'code', QC = 'Qwen + code', QV = 'Qwen-VL', H = 'Haiku', HC = 'Haiku + code';
const MV = '1106x';   // bump with the run data so browsers do not keep an old measure/*.json
const MEASURE = {
  '1-1': { unit: 'claim', units: 'claims',
    stages: [['Claim', 'stated as fact', 'paper'], ['Needs', 'what would prove it?', Q], ['Found', 'in the paper?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Find the claims', [[CD, 'Split the paper into numbered sentences (A04, S2.066) and table rows (T1).'], [Q, 'List every sentence that states a result or property as fact.'], [Q, 'Tag each: own result · method property · prior-work fact.'], [CD, 'A claim repeated in abstract, intro and conclusion counts once.'], [CD, 'Procedures (“we compute…”), hypotheses, common knowledge → NA.']]],
      ['Name the evidence needed', [[Q, 'One sentence: what a careful reader would require (experiment, measurement, proof, method description, citation).'], [Q, 'No quality judgment here, only what would prove the claim.']]],
      ['Search the paper', [[Q, 'Point to ids that bear on the claim: tables, figures, result sentences, method text, citations.'], [CD, 'Discard the claim itself, its restatements in abstract / intro / conclusion, and ids that do not exist.'], [CD, 'Add any table containing the claim’s numbers.'], [Q, 'Judge (second call) reads the remaining material verbatim: supported · partial · unsupported · ambiguous · common knowledge, plus what is missing.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Rules, in order: cited prior-work fact → PASS · procedure or definition → NA · supported or partial → PASS · unsupported, no valid evidence → FAIL.'], [CD, 'Unsupported, but its numbers appear in a table or only a figure supports it → human review (U).'], [CD, 'Three runs (1 greedy, 2 sampled). FAIL needs ≥2 FAIL votes and no PASS. Found in <2 runs or split → U.'], [CD, 'score = FAIL / (FAIL + PASS). U reported as coverage; NA excluded.']]]],
    line: 'Qwen2.5-32B reads; code checks every id, applies the rules and counts. Three runs vote; split votes stay U.' },
  '1-2b': { unit: 'axis', units: 'axes', breadth: true,
    stages: [['Results', 'tables with numbers, setup sentences', CD], ['Names', 'models and evaluation datasets', H], ['In the results?', 'each name in a table, caption or experiment text', CD], ['Breadth', 'counts → 0–100', CD]],
    how: [
      ['Collect the results', [[CD, 'Tables with ≥4 numeric cells, body and appendix.'], [CD, 'Figure captions; experiment, method and appendix sentences that name models, datasets or seeds.'], [CD, 'No result table → NA (theory or system paper).']]],
      ['List the names', [[H, 'One call per paper. Models: the backbone the method runs on, or the model being analysed.'], [H, 'Not models: the paper’s own method, baseline methods, ablation variants, sizes without a name.'], [H, 'Datasets: what the results are reported on. Not training-only data. Splits and sub-tasks of one benchmark → one dataset.'], [H, 'Also returned: each model’s family (Qwen, Llama, InternVL), baselines, seeds, benchmark paper or not.']]],
      ['Check each name', [[CD, 'Counts only if it appears in a result table, a caption, or experiment / method / appendix text. Related work does not count.'], [CD, 'Dropped: the paper’s own method, “(ours)”, “w/o …” variants, LaTeX debris.'], [CD, 'RefCOCO, RefCOCO+ and RefCOCOg → 3 datasets. “GSM8K test” → GSM8K.'], [CD, 'No model judgment.']]],
      ['Score the breadth', [[CD, 'Each count n → log₂ n ÷ log₂ cap, at most 1. One item → 0. Caps: models 8, families 4, datasets 16.'], [CD, 'Model axis = (models + families) ÷ 2. Dataset axis = datasets.'], [CD, 'Breadth = 100 × mean of the two axes. Below 35 → FAIL.'], [CD, 'Benchmark paper → dataset axis NA. Seeds, ± and baselines are shown, not scored.']]]],
    line: 'Claude Haiku lists the models and datasets once per paper; code checks every name against the results and turns the counts into a 0–100 breadth.' },
  '1-2d': { unit: 'added part', units: 'added parts', cost: true,
    stages: [['Adds', 'what the method adds that costs compute', H], ['Cost reported?', 'a measured cost, or a matched-budget comparison', H], ['In the paper?', 'the quote at that id, with a number', CD], ['Cost score', 'reported → 100 · not → 0', CD]],
    how: [
      ['List what the method adds', [[CD, 'Input: abstract, method sentences, result tables, and every sentence with a cost word and a number.'], [H, 'One call per paper. Adds: extra model calls or forward passes, an extra model or module, a training stage, sampling, search or voting, retrieval.'], [H, 'Nothing added (the method removes or reweights something, or no method is proposed) → NA.']]],
      ['Find the cost reports', [[H, 'Where the paper measures what the method or a baseline costs, with a number: latency, runtime, throughput, FLOPs, memory, tokens, API cost, GPU hours, model calls.'], [H, 'Not a cost report: hardware (“on 4 A100 GPUs”), model or input size (“256 tokens per tile”), accuracy, “efficient” without a number.'], [H, 'Also: comparisons at the same compute, budget or number of samples.']]],
      ['Check each quote', [[CD, 'The quote must occur at the given sentence or table, contain a number, and name what is measured (“tokens”, “latency”, “FLOPs” …).'], [CD, 'A table counts when its header or caption names the measure and it has numbers.'], [CD, 'No model judgment.']]],
      ['Score the cost part', [[CD, 'A checked cost report or matched-budget comparison → 100 (PASS).'], [CD, 'Something added and neither found → 0 (FAIL).'], [CD, 'Deterministic once the model has answered: one run.']]]],
    line: 'Claude Haiku lists what the method adds and where its cost is reported; code checks every quote against the paper.' },
  '1-2': { parts: ['1-2b', '1-2d'],
    line: 'Two parts, scored 0–100 each. Overstated Claims = the mean of evaluation breadth and cost reporting; a part that does not apply is left out.' },
  '1-4': { unit: 'sentence', units: 'citing sentences',
    stages: [['Sentence', 'a citing sentence in the introduction or related work', CD], ['Woven?', 'tied to another work in the sentence', CD], ['Related to this paper?', 'compared, used, or contrasted anywhere', CD], ['Needs a relation?', 'a method, not a survey, benchmark or fact', CD], ['Verdict', 'rule, one run', CD]],
    how: [
      ['Collect the sentences', [[CD, 'Introduction and related-work sentences with at least one citation.'], [CD, 'Other sections: not checked.']]],
      ['Check: woven? (v1 citation isolation)', [[CD, 'Two or more works cited → woven.'], [CD, 'Another cited work named (“FastV” from “FastV [x]” elsewhere) → woven.'], [CD, 'Takes up the citing sentence before: “Similarly,”, “Building on this,”, “X extends this” → woven.'], [CD, 'Woven → PASS. Alone → step 3.']]],
      ['Check: related to this paper?', [[CD, 'Its name is a row in a result table.'], [CD, 'It is used in the paper’s own method or experiments.'], [CD, 'A sentence in the paper’s own voice (“we”, “our”, the method’s name) cites or names it with a relation: “unlike”, “compared to”, “builds on”, “addresses”.'], [CD, 'Any of these → set aside.']]],
      ['Check: needs a relation?', [[CD, 'Surveys, model releases, benchmarks and datasets, works cited for a statement (“[x] showed that …”) → set aside.'], [CD, 'A named method → it needs one.']]],
      ['Decide FAIL', [[CD, 'Alone, never related, and a method → FAIL.'], [CD, 'score = FAIL ÷ citing sentences.'], [CD, 'No model judgment. Deterministic: one run.']]]],
    line: 'Code only. A citing sentence fails when it introduces a method on its own and the paper never relates that method to itself.' },
  '2-1': { unit: 'finding', units: 'findings',
    stages: [['Finding', 'a key result in the body', Q], ['Shown in', 'the table or sentence', CD], ['Up front?', 'abstract and intro', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Extract the key results', [[Q, 'From the body only, identify the paper’s research question.'], [Q, 'Extract up to six findings that bear directly on the research question. Keep negative results and qualifying conditions.'], [CD, 'Exclude secondary results, limitations, and future work.']]],
      ['Trace each finding to its source', [[CD, 'Record the source IDs for each finding: result sentences, tables, and figures.']]],
      ['Check the abstract and introduction', [[Q, 'Compare each finding against the abstract and introduction:'], [Q, 'Is the finding conveyed in substance? Exact numbers are not required.'], [Q, 'Is its key condition conveyed?'], [CD, 'Compute word overlap with each abstract / intro sentence.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Finding or condition not conveyed → FAIL.'], [CD, '≥40% content-word overlap → human review (U).'], [CD, 'Three independent runs vote; score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B reads the body first, then checks the abstract and introduction; code guards with word overlap. Three runs vote.' },
  '2-3': { unit: 'component', units: 'components',
    stages: [['Component', 'a method / experiment section or a numbered equation', CD], ['Pointers', 'where the paper points to it', CD], ['Used?', 'section: from another section · equation: anywhere', CD], ['Verdict', 'rule, one run', CD]],
    how: [
      ['Collect the components', [[CD, 'Body sections and labelled subsections: method, experiments, others.'], [CD, 'Labelled equations and algorithms.'], [CD, 'Not checked: introduction, related work, conclusion, appendix, statements; figures and tables.']]],
      ['Find the pointers', [[CD, '\\ref, \\cref, \\autoref and similar macros.'], [CD, 'Printed numbers: “Section 4”, “Sec. 3.2”.'], [CD, 'Names: “the previous section”, “in the Method section”.'], [CD, 'Ignored: the introduction’s roadmap, pointers into the appendix.']]],
      ['Check: used?', [[CD, 'Section → pointed to from another section.'], [CD, 'Equation, algorithm → pointed to anywhere.'], [CD, 'No model judgment.']]],
      ['Decide PASS / FAIL', [[CD, 'Not used → FAIL. Used → PASS.'], [CD, 'score = FAIL ÷ components.'], [CD, 'Deterministic: one run.']]]],
    line: 'Code only (v1 cross-section parser). A section fails when no other section points to it; an equation fails when nothing points to it.' },
  '2-4': { unit: 'proposition', units: 'propositions',
    stages: [['Figure says', 'one claim of the overview', QV], ['Text says', 'Method / Setup sentence', Q], ['Match?', 'consistent · conflicting · unverifiable', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Read the overview figure', [[CD, 'Take the body figure whose caption or label says overview / framework / pipeline; else the first figure.'], [QV, 'Qwen2.5-VL-32B transcribes legends, axes, panels, numbers, box text, arrow connections.'], [Q, 'Convert the transcript into propositions (“three scores are summed”, “12 attention layers”).']]],
      ['Match the text', [[Q, 'For each proposition, point to the Method or Setup sentence stating the same thing.']]],
      ['Grade the match', [[Q, 'Judge reads transcript, caption and those sentences: consistent · conflicting · unverifiable.']]],
      ['Decide PASS / FAIL / U', [[CD, 'conflicting, with a valid text id → FAIL. consistent → PASS. No matching sentence → U.'], [CD, 'Candidate item: reported separately, outside the 17-item score.']]]],
    line: 'Qwen2.5-VL transcribes the overview figure; Qwen2.5-32B matches each proposition to the text. Three runs vote. Candidate item, reported separately.' },
  '3-1': { unit: 'choice', units: 'choices',
    stages: [['Choice', 'a setting that shapes the result', Q], ['Kind', 'data · baseline · value · metric · backbone', Q], ['Reason', 'why this, not another?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the choices', [[CD, 'Candidates: setting words (“we use / set / choose”, threshold, window, k=, dataset and baseline names) with a number or formula.'], [Q, 'Keep choices that affect the conclusion: data, subsets, sizes · baselines · method-specific values (layer, keep rate, threshold, k) · metrics and criteria · backbone.'], [CD, 'Minor settings → NA.']]],
      ['Classify', [[Q, 'Class a–e; importance central / minor.']]],
      ['Find the reason', [[Q, 'Point to every id that gives a reason, appendix included: ablation table, cited standard, constraint, argument.'], [Q, 'Judge reads the reason with the choice sentence and 4 surrounding sentences: specific reason (why this value, not another) · description only · generic phrase. Quotes the reason verbatim.'], [CD, 'The quote must occur in the text.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Stock phrase (“for efficiency”, unsourced “following common practice”) → FAIL.'], [CD, 'Baselines, metrics, backbones: source → PASS; no reason → U (standard comparisons not failed by rule).'], [CD, 'Data and key values: description only or generic → FAIL; specific reason → PASS.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B lists the choices and quotes the stated reason; code fails stock phrases and verifies the quote. Three runs vote.' },
  '4-1': { unit: 'sentence', units: 'candidate sentences', plain: true,
    stages: [['Find it', '', CD], ['Read around it', '', CD], ['Delete it', '', HC], ['Anything lost?', '', CD]],
    how: [
      ['', [[CD, 'Look for sentences that use stock phrases such as “This shows that…”, “The key finding is…”, or “We verify…”.']]],
      ['', [[CD, 'Use the two preceding sentences and the following sentence.'], [CD, 'Judge only what the framing phrase adds, not information already stated nearby.']]],
      ['', [[H, 'Ask one question: does deleting the phrase remove any actual information?'], [H, 'A number, condition, reason, mechanism, comparison, limitation, or new claim counts as information. Simply calling something a “finding” or “confirmation” does not.']]],
      ['', [[CD, 'Nothing is lost → FAIL'], [CD, 'Information is lost → PASS'], [CD, 'Runs disagree → U']]]],
    line: 'Delete the stock phrase, then check whether any information went with it.' },
  '4-2': { unit: 'term', units: 'terms',
    stages: [['Term', 'needs a meaning to be understood', CD], ['Used', 'where and how often', CD], ['Defined?', 'a sentence giving the meaning', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Collect the terms', [[CD, 'Abbreviations, hyphenated compounds used ≥2 times, quoted terms, names like Phase-0, two-word metrics (“X rate / score / ratio / margin”).'], [CD, 'Excluded: appendix-only terms, names right after a citation, names already in the table inventory.']]],
      ['Locate each use', [[CD, 'Record the first use and every occurrence.']]],
      ['Search for a definition', [[CD, 'Code first: parenthetical expansion (“Self-Recall Error (SRE)”) or a same-paragraph cue (“we call”, “is defined as”, “denotes”).'], [Q, 'Otherwise search the paper: defined here (id) · standard term · undefined · name variant.'], [Q, 'Still undefined: judge re-reads every use. Expanding an abbreviation, or “X is our X module”, is not a definition.']]],
      ['Decide PASS / FAIL / NA', [[CD, 'Valid definition → PASS. Standard term or name → NA. Undefined after both passes → FAIL. Name variants recorded separately.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Code finds the terms and easy definitions; Qwen2.5-32B searches for the rest and re-reads every use. Three runs vote.' },
  '2-5': { unit: 'sentence', units: 'conclusion sentences', plain: true,
    stages: [['Take the conclusion', '', CD], ['Find its twin', '', CD], ['Copied?', '', CD], ['Count', '', CD]],
    how: [
      ['', [[CD, 'Use every conclusion sentence of 8 or more words. Captions are left out.']]],
      ['', [[CD, 'For each one, find the closest sentence in the abstract or the introduction.']]],
      ['', [[CD, 'It is a copy when the two share runs of 8 words covering at least half of the conclusion sentence, or when their meaning is almost the same (cosine 0.95 or more).'], [CD, 'The same point with a new number or a new implication is not a copy.']]],
      ['', [[CD, 'Copied → FAIL'], [CD, 'Not copied → PASS'], [CD, 'Code only, no model, one run.']]]],
    line: 'Compare each conclusion sentence with the abstract and the introduction, and count the copies.' },
  '4-4': { unit: 'section', units: 'body sections',
    stages: [['Section', 'a body section, sentence by sentence', CD], ['Earlier twin', 'closest sentence in an earlier section', CD], ['Same?', '8-word runs ≥ 50% or cosine ≥ 0.95', CD], ['Verdict', 'one repeat → slop section', CD]],
    how: [
      ['Select the sections', [[CD, 'Body sections: introduction, related work, method, experiments, others.'], [CD, 'Not scored: abstract, conclusion, appendix, ethics / reproducibility statements.'], [CD, 'Sentences of ≥8 tokens. Excluded: captions, formula-heavy sentences, explicit recaps (“as mentioned”).']]],
      ['Find the earlier twin', [[CD, 'For each sentence: the closest earlier sentence in a different section. The abstract counts as an earlier section.'], [CD, 'Candidates: a shared 8-word run, or MiniLM cosine ≥ 0.75 with content-word Jaccard ≥ 0.2.']]],
      ['Check: same sentence?', [[CD, 'Repeat → 8-word runs shared with earlier sections cover ≥ 50% of the sentence, or MiniLM cosine ≥ 0.95.'], [CD, 'Same topic in new words with new content → below both bars → not a repeat.'], [CD, 'No model judgment.']]],
      ['Score the section', [[CD, '≥1 repeat in the section → FAIL. Otherwise → PASS.'], [CD, 'score = FAIL sections ÷ body sections.'], [CD, 'Deterministic: one run.']]]],
    line: 'Code only. A body section fails when one of its sentences is a near-copy of a sentence in an earlier section or the abstract.' },
  '4-5': { unit: 'figure', units: 'figures',
    stages: [['Figure', 'body figure with an image', CD], ['Transcribed', 'what the image contains', QV], ['Explained?', 'elements, numbers, caption, comparisons', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the figures', [[CD, 'Every body figure with an image: the figure file (AI papers) or the PDF page located by caption (human papers).']]],
      ['Transcribe the image', [[QV, 'Qwen2.5-VL-32B transcribes the image. Image–caption mismatch → U.']]],
      ['Check the explanation', [[Q, 'Judge reads transcript, caption and citing sentences, and lists: (1) unexplained elements the figure’s purpose needs, (2) figure numbers and whether their condition is readable, (3) caption–image conflicts, (4) body comparisons that cannot be matched to the figure.'], [CD, 'Count only elements a reader must interpret (arrow and line styles, symbols, colour classes, legends, panels, axis labels), not “exact value not printed”.']]],
      ['Decide PASS / FAIL / U', [[CD, 'FAIL: caption conflict · figure-only number with unreadable condition · ≥2 unexplained structural elements · 1 unexplained + an uncheckable comparison.'], [CD, 'One weak signal alone → U.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS). Limited by transcription quality (numbers on bars are sometimes missed).']]]],
    line: 'Qwen2.5-VL transcribes the image; Qwen2.5-32B lists what caption and body leave unexplained; code applies the thresholds. Three runs vote.' },
  '5-4': { unit: 'statement', units: 'evidence statements',
    stages: [['Describes', 'prior work · own scope · scale · consensus', CD], ['Checked against', 'the paper or the cited abstract', QC], ['Match?', 'consistent · contradicted · silent', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the statements', [[CD, 'Candidates: (a) “prior work has shown X”, (b) own evaluation scope (“we evaluate on three domains”), (c) scale words (extensive, numerous, consistently), (d) consensus or authority (“well known”, “typically considered”).'], [Q, 'Confirm the unit, its type, and the evidence it describes.']]],
      ['Gather the reference', [[Q, '(b)(c): tables and setup sentences showing the actual scope. (a)(d): contradicting in-paper sentences, and what the cited work reportedly showed.'], [CD, 'Cited (a)(d): fetch the cited abstract from Semantic Scholar by bib title for the judge.']]],
      ['Judge the match', [[Q, '(b)(c): described scope = actual evaluation? (a): abstract supports, contradicts or is silent? (d): source or in-paper support?'], [CD, 'Silence in the abstract ≠ contradiction.']]],
      ['Decide PASS / FAIL / U', [[CD, '(b)(c) scope mismatch → FAIL. (a)(d) contradicted by the paper or the abstract → FAIL. (d) unsourced, or (a) uncited → FAIL (a same-paragraph citation counts).'], [CD, 'Abstract silent or unavailable → U.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B checks scope words against the tables and cited claims against the cited abstracts (fetched by code). Three runs vote.' },
};
const VLAB = { FAIL: 'FAIL', PASS: 'PASS', UNRESOLVED: 'U', NOT_APPLICABLE: 'NA' };
const VK = d => ({ FAIL: 'F', PASS: 'P', UNRESOLVED: 'U', NOT_APPLICABLE: 'N' })[d] || 'U';
const vb = (d, big) => h('span', { class: 'ms-vb v-' + VK(d) + (big ? ' big' : ''), text: VLAB[d] || d });
function measurePanel(it) {
  const m = MEASURE[it.id];
  if (m.parts) return partsView(it);
  const wrap = h('div', { class: 'ms' }, h('p', { class: 'ms-loading', text: 'Loading…' }));
  fetch('measure/' + it.id + '.json?v=' + MV).then(r => r.json()).then(data => buildFlow(m, data, wrap)).catch(() => wrap.replaceChildren(h('p', { class: 'ms-loading', text: 'The run data could not be loaded.' })));
  return wrap;
}
// 4-4: a sentence pair shown whole, section on top, the words both sentences share marked
const pairQ = (p, role) => h('div', { class: 'pv' }, h('span', { class: 'pv-sec' + (role === 'earlier' ? ' e' : '') }, h('b', { text: p.sec }), ' · ' + p.id + (role === 'earlier' ? ' · earlier' : ' · later')),
  h('q', { class: 'mw-q' }, ...p.segs.map(([t, on]) => on ? h('mark', { class: 'pv-m', text: t }) : t)));
// 1-2b: the paper's score is a breadth (0-100, higher = wider), not a FAIL share
function breadthLine(data, el) {
  const mt = data.meta, a = mt.axes, kids = [`${mt.side} ${mt.paper} · breadth = 100 × (model `, h('b', { text: (a.model / 100).toFixed(2) }), ' + dataset ', h('b', { text: (a.dataset / 100).toFixed(2) }), ') ÷ 2 = ', h('b', { class: 'big', text: mt.breadth.toFixed(1) }),
    ` · below ${mt.fail_below} → `, h('b', { class: 'v-F', text: mt.breadth < mt.fail_below ? 'FAIL' : 'PASS' }), mt.aux ? ` · shown, not scored: ${mt.aux}` : ''];
  if (el) { el.replaceChildren(...kids); return el; }
  return h('p', { class: 'mw-score' }, ...kids);
}
function buildFlow(m, data, wrap) {
  // a worked example on one real paper: every unit it checked, and for the chosen one the steps from question to verdict
  const U = data.units, n = U.length, pre = data.meta.pre || {};
  const VW = { FAIL: 'slop', PASS: 'fine', UNRESOLVED: 'open', NOT_APPLICABLE: 'n/a' };
  const cnt = { FAIL: 0, PASS: 0, UNRESOLVED: 0, NOT_APPLICABLE: 0 }; U.forEach(u => cnt[u.final]++);
  const F = cnt.FAIL + (pre.FAIL || 0), P = cnt.PASS + (pre.PASS || 0), UU = cnt.UNRESOLVED + (pre.UNRESOLVED || 0), D = F + P;
  const who = w => w === 'paper' ? null : h('span', { class: 'mw-who', text: w.startsWith('Qwen') ? (w.includes('code') ? 'model + code' : 'model') : w === 'code' ? 'rule' : w });
  const short = t => t.length > 150 ? t.slice(0, 148).replace(/\s+\S*$/, '') + '…' : t;
  const answer = (k, u) => [
    () => u.pair ? h('div', {}, pairQ(u.pair.later, 'later'), h('small', { text: u.kind })) : h('div', {}, h('q', { class: 'mw-q', text: short(u.text) }), h('small', { text: [u.id, u.sec, u.kind].filter(Boolean).join(' · ') })),
    () => u.pair ? pairQ(u.pair.earlier, 'earlier') : h('div', {}, h('span', { text: u.s2 || '—' })),
    () => h('div', {}, u.found.length ? h('span', { class: 'mw-ids' }, ...u.found.map(id => h('code', { text: id }))) : h('span', { class: 'mw-none', text: 'nothing' }), u.found_note ? h('small', { text: tidyNote(u.found_note) }) : null, u.judge_line ? h('small', { text: tidyNote(u.judge_line) }) : null),
    () => h('div', {}, h('span', { class: 'mw-runs' }, ...u.runs.map(r => h('span', { class: 'mw-r v-' + VK(r), text: VLAB[r] })), h('span', { class: 'mw-to', text: '→' }), h('b', { class: 'mw-final v-' + VK(u.final), text: VLAB[u.final] })), u.final_reason ? h('small', { text: tidyNote(u.final_reason) }) : null),
  ][k]();
  const steps = h('ol', { class: 'mw-steps' });
  let open = -1;
  function showUnit(k) {
    const u = U[k]; list.querySelectorAll('.mw-row').forEach((r, j) => r.classList.toggle('on', j === k));
    steps.replaceChildren(...m.stages.map(([t, sub, w], j) => {
      const how = m.how[j]; const det = how ? h('details', { class: 'mw-how' }, h('summary', { text: 'how?' }), h('ul', {}, ...how[1].map(([ww, tt]) => h('li', {}, tt)))) : null;
      return h('li', { class: 'mw-step' + (j === m.stages.length - 1 ? ' last' : '') },
        h('span', { class: 'mw-n', text: String(j + 1) }),
        h('div', { class: 'mw-b' }, h('p', { class: 'mw-ask' }, h('b', { text: t }), ' · ' + sub, who(w)), answer(j, u), det));
    }));
  }
  const list = h('div', { class: 'mw-list' }, ...U.map((u, k) => h('button', { type: 'button', class: 'mw-row', onclick: () => showUnit(k) },
    h('span', { class: 'mw-tag v-' + VK(u.final), text: VW[u.final] }), h('span', { class: 'mw-t', text: short(u.text) }))));
  const head = h('p', { class: 'mw-head' }, h('b', { text: `${data.meta.side} ${data.meta.paper}` }), ` · ${n} ${m.units} checked · `, h('b', { class: 'v-F', text: `${F} slop` }), ` · ${P} fine` + (UU ? ` · ${UU} left open for a human` : ''));
  const score = m.breadth ? breadthLine(data) : h('p', { class: 'mw-score' }, 'Score = slop ÷ decided = ', h('b', { text: `${F} ÷ ${D}` }), ' = ', h('b', { class: 'big', text: D ? (F / D).toFixed(2) : '—' }), UU ? h('span', { text: `  ·  ${UU} left open for a human, not counted` }) : null);
  wrap.replaceChildren(head, h('div', { class: 'mw' }, h('div', { class: 'mw-l' }, h('p', { class: 'mw-lh', text: 'What was checked · pick one' }), list), h('div', { class: 'mw-r2' }, steps)), score, h('p', { class: 'mw-line', text: m.line }));
  if (!n) return;
  showUnit(Math.max(0, U.findIndex(u => u.final === 'FAIL')));
}

function card(it, area) {
  const d = h('article', { class: 'slop ' + area.cls, id: it.id });
  const more = [bullets('j', 'How it is judged', it.judge), bullets('n', 'Not a defect', it.not), bullets('f', 'What counts as a fix', it.fix),
    it.link ? bullets('k', 'What must connect', [it.link[0] + ' → ' + it.link[1]]) : null,
    it.borders ? h('div', { class: 'dl b' }, h('span', { class: 'l', text: 'Borders on' }), h('ul', { class: 'bl' }, ...it.borders.map(([id, why]) => h('li', { html: xref(id) + ' <span>' + esc(why) + '</span>' })))) : null];
  d.append(h('details', { class: 'e-text e-open' },
    h('summary', { class: 'e-sum' },
      h('h3', { class: 'e-name', text: it.name }),
      h('p', { class: 'e-what', text: it.what })),
    h('div', { class: 'e-body' },
      h('blockquote', { class: 'e-q' + (it.ex.made ? ' made' : '') }, h('p', { class: 'e-qt' }, it.ex.pre, h('mark', { text: it.ex.mark }), it.ex.post), h('p', { class: 'e-src', text: it.ex.src || it.ex.sec })),
      it.ex2 ? h('blockquote', { class: 'e-q' }, h('p', { class: 'e-qt' }, it.ex2.pre, h('mark', { text: it.ex2.mark }), it.ex2.post), h('p', { class: 'e-src', text: it.ex2.src })) : null,
      h('p', { class: 'e-note', text: it.ex.note }),
      MEASURE[it.id] ? h('details', { class: 'v-more ms-more' }, h('summary', {}, h('span', { text: 'How it is measured' })), measurePanel(it))
        : h('details', { class: 'v-more' }, h('summary', {}, h('span', { text: 'How it is judged, what is not a defect, what counts as a fix' })), h('div', { class: 'more-b' }, ...more)),
      h('div', { class: 'hubline' }))));
  d.append(h('div', { class: 'e-pic', html: K.svg(PIC[it.id](), 'Illustration of ' + it.name) }));
  return d;
}
$('#areas').replaceChildren(...GROUPS.map(a => h('section', { class: 'v-area ' + a.cls, id: 'area-' + a.n, 'data-area': a.n },
  h('div', { class: 'area-head' }, h('h2', { text: a.title }), h('p', { class: 'aq', text: a.q })),
  h('div', { class: 'v-cards' }, ...ITEMS.filter(i => i.g === a.n).map(it => card(it, a))))));
$('#cue-grid').replaceChildren(...CUES.map(([c, ex, ids]) => h('div', { class: 'cue' }, h('b', { text: c }), h('i', { text: ex }), h('span', { class: 'cue-to', html: ids.length ? '→ ' + ids.map(xref).join(' ') : '→ <span class="muted">no item · style only</span>' }))));
$('#map-list').replaceChildren(...MAP.map(([id, v1]) => h('li', { html: `<span>${esc(v1)}</span><i>→</i>${xref(id)} <b>${esc(BY_ID[id].name)}</b>` })));


// ------------------------------------------------------------------ hub: votes, cases, fix prompts
const PROMPTS = {
  '1-1': `# Fix · Unsupported Claims (1-1)
For every sentence that states a result or a property as fact:
1. Name the support it needs: an experiment, a proof, or a citation. Find it in the paper.
2. If it exists, point to it in the sentence (table, section, or reference).
3. If it does not exist, narrow the claim to what the paper shows, or mark it as a hypothesis.
Never add a citation you have not read, invent a run, or delete the contribution to escape the check.`,
  '1-2': `# Fix · Overstated Claims (1-2)
Two checks.
1. Narrow Evaluation: list the models the experiments run with (and their families) and the datasets the results are reported on. If every result rests on one model or one dataset, add another model, ideally from a different family, or another dataset. If that is impossible, say so where the results are stated.
2. Missing Cost Accounting: list what the method adds that costs compute (extra calls, passes, modules, training stages, sampling). Report the cost for the method and the baseline with numbers (runtime, tokens, FLOPs, memory, calls), or compare at a matched budget.
More seeds on the same setting, or calling the method "efficient" without a number, is not a fix.`,
  '1-4': `# Fix · Unclear Links to Prior Work (1-4)
For every method that the introduction or related work introduces in a sentence of its own and the paper never compares against, uses, or contrasts itself with, add one sentence that says how this paper relates to it: what it takes from it, or what it does differently.
Piling another citation into the sentence is not a fix.`,
  '2-1': `# Fix · Buried Findings (2-1)
Identify the key findings of the body from the research question and the main results, including the condition under which each holds.
Check the Abstract and Introduction: if a key finding or its condition is missing, add it in one sentence.
Adding a single number is not enough; do not turn an observed association into a mechanism.`,
  '2-3': `# Fix · Missing Cross-Section Links (2-3)
List the method and experiment sections, subsections, numbered equations and algorithms.
For each, find where a later section uses it, and point back there: "the ratio formula (Eq. 1)", "the setup in Section 3.2".
Pointers placed where the component is not used are not a fix.`,
  '3-1': `# Fix · Unexplained Design Choices (3-1)
List the choices that affect the conclusion: architecture, data selection, exclusions, comparison conditions, metrics.
For each, give the actual rationale, constraint, or comparison. "For efficiency" alone is not a reason.
Do not invent alternatives that were never run; a value that is given but unexplained is the target here, not a missing value.`,
  '4-1': `# Fix · Generic Filler (4-1)
Look at each sentence that says "this shows that ...", "..., demonstrating that ...", "the key finding is ..." or "informing future research".
Delete it and reread the paragraph. If nothing is missing, leave it out.
If you keep it, it must add one thing the text before it did not say: why (the mechanism), how far (scope or limit), what it rules out (an alternative explanation), or what follows (a decision for the next design or experiment).
Changing "shows" to "suggests", re-adding the numbers, or inserting model and dataset names is not a fix.`,
  '4-2': `# Fix · Undefined Terms (4-2)
For every term or abbreviation the intended reader cannot interpret from context, give its operation, object, or role where it first appears, or cite the definition.
Expanding an acronym or swapping in another abstract word is not enough. If one thing has several names, pick one.`,
  '2-5': `# Fix · Empty Conclusion (2-5)
Compare each conclusion sentence with the abstract and the introduction. Where a sentence repeats one of them, delete it.
In its place, say what the results mean together: what holds, where it stops, and what follows from it. Rewording the abstract is not a fix.`,
  '4-4': `# Fix · Redundant Repetition (4-4)
Find each body sentence that copies, almost word for word, a sentence from the abstract or an earlier section.
Cut it, point back to where it was first said, or replace it with what is new at this point (a number, a condition, an interpretation).
The abstract and the conclusion are not checked. Rewording the same content is not a fix.`,
  '4-5': `# Fix · Unclear Figures (4-5)
State the figure's purpose. List every element, symbol, arrow type, and color the reader must interpret.
Explain each in the figure, the legend, or the caption, and tie it to the method or result it shows.
A longer caption, or deleting the figure, is not by itself a fix.`,
  '5-4': `# Fix · Misrepresented Evidence (5-4)
For every sentence that says evidence exists ("prior work shows", "extensive experiments", "[12] established"), check existence, content, scope, and consensus against the actual source or experiment list.
Describe what the support actually shows. If a support statement is withdrawn, recheck that the remaining claim is still supported.
Adding citations or deleting "extensive" is not a fix.`,
};
const LIVE_API = 'https://scientific-slop-demo.onrender.com';
const hub = { mode: 'local', api: '', token: '', uid: null, db: null, canWrite: true, votes: {}, mine: {}, cases: [], prompts: [], pups: {}, mineUps: {} };
const hubOpen = new Set();
function hubTok() { try { let t = localStorage.getItem('ssi-hub-token'); if (!t) { t = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('ssi-hub-token', t); } return t; } catch (_) { return 'anon'; } }
function hubLocalLoad() { try { const j = JSON.parse(localStorage.getItem('ssi-hub') || '{}'); hub.mine = j.mine || {}; hub.cases = j.cases || []; hub.prompts = j.prompts || []; hub.mineUps = j.mineUps || {}; } catch (_) { /* empty */ } hubLocalAgg(); }
function hubLocalAgg() { hub.votes = {}; for (const [k, v] of Object.entries(hub.mine)) hub.votes[k] = { up: v === 1 ? 1 : 0, down: v === -1 ? 1 : 0 }; hub.pups = {}; for (const k of Object.keys(hub.mineUps)) hub.pups[k] = 1; }
function hubLocalSave() { try { localStorage.setItem('ssi-hub', JSON.stringify({ mine: hub.mine, cases: hub.cases, prompts: hub.prompts, mineUps: hub.mineUps })); } catch (_) { /* ignore */ } }
function applyServer(j) { hub.votes = j.items || {}; hub.mine = j.mine || {}; hub.cases = j.cases || []; hub.prompts = j.prompts || []; hub.pups = {}; hub.mineUps = {}; for (const p of hub.prompts) { hub.pups[p.id] = p.ups || 0; if (p.mine) hub.mineUps[p.id] = 1; } }
async function hubInit() {
  hub.token = hubTok();
  if (window.claude && typeof window.claude.use === 'function') {
    const db = await window.claude.use('db');
    if (db) {
      hub.mode = 'db'; hub.db = db;
      const user = await window.claude.use('user'); hub.uid = user ? await user.id() : null;
      if (user) { const w = await user.can('data.write'); if (w === false) hub.canWrite = false; }
      if (!hub.uid) hub.canWrite = false;
      db.collection('votes').onSnapshot(snap => { const agg = {}; let mine = {}; snap.docs.forEach(d => { const it = (d.data() || {}).items || {}; if (d.id === hub.uid) mine = it; for (const [k, v] of Object.entries(it)) { agg[k] = agg[k] || { up: 0, down: 0 }; if (v === 1) agg[k].up++; else if (v === -1) agg[k].down++; } }); hub.votes = agg; hub.mine = mine; renderHub(); }, () => {});
      db.collection('cases').onSnapshot(snap => { hub.cases = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => String(b.at || '').localeCompare(String(a.at || ''))); renderHub(); }, () => {});
      db.collection('prompts').onSnapshot(snap => { hub.prompts = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => String(b.at || '').localeCompare(String(a.at || ''))); renderHub(); }, () => {});
      db.collection('promptups').onSnapshot(snap => { const ups = {}; let mine = {}; snap.docs.forEach(d => { const ids = (d.data() || {}).ids || {}; if (d.id === hub.uid) mine = ids; for (const k of Object.keys(ids)) ups[k] = (ups[k] || 0) + 1; }); hub.pups = ups; hub.mineUps = mine; renderHub(); }, () => {});
      renderHub(); return;
    }
  }
  for (const base of [LIVE_API]) {
    try { const r = await fetch(base + '/api/hub?token=' + encodeURIComponent(hub.token)); if (r.ok) { const j = await r.json(); if (j && j.live) { hub.mode = 'server'; hub.api = base; applyServer(j); renderHub(); return; } } } catch (_) { /* next */ }
  }
  hubLocalLoad(); renderHub();
}
const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ');
async function hubPost(path, body) { const r = await fetch(hub.api + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, token: hub.token }) }); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || 'Request failed'); return r.json(); }
async function vote(item, v) {
  if (!hub.canWrite) return;
  const cur = hub.mine[item] || 0; const next = cur === v ? 0 : v;
  const mine = { ...hub.mine }; if (next) mine[item] = next; else delete mine[item];
  if (hub.mode === 'db') { try { await hub.db.doc('votes/' + hub.uid).set({ items: mine, at: now() }); } catch (e) { hubMsg(item, 'Could not save the vote.', true); } return; }
  hub.mine = mine;
  if (hub.mode === 'server') { try { applyServer(await hubPost('/api/hub/vote', { item, v: next })); } catch (e) { hubMsg(item, e.message, true); } }
  else { hubLocalAgg(); hubLocalSave(); }
  renderHub();
}
async function addCase(item, f) {
  const c = { item, where: f.where.trim().slice(0, 300), quote: f.quote.trim().slice(0, 800), why: f.why.trim().slice(0, 400), by: f.by.trim().slice(0, 60), at: now(), status: 'pending' };
  if (c.quote.length < 10) throw new Error('Quote at least ten characters of the passage.');
  if (hub.mode === 'db') { await hub.db.collection('cases').add(c); return; }
  if (hub.mode === 'server') { const j = await hubPost('/api/hub/case', c); hub.cases.unshift(j.case); }
  else { hub.cases.unshift({ id: Math.random().toString(36).slice(2), ...c }); hubLocalSave(); }
  renderHub();
}
async function addPrompt(item, f) {
  const p = { item, text: f.text.trim().slice(0, 4000), by: f.by.trim().slice(0, 60), at: now() };
  if (p.text.length < 20) throw new Error('Write at least twenty characters of prompt.');
  if (hub.mode === 'db') { await hub.db.collection('prompts').add(p); return; }
  if (hub.mode === 'server') { const j = await hubPost('/api/hub/prompt', p); hub.prompts.unshift(j.prompt); }
  else { hub.prompts.unshift({ id: Math.random().toString(36).slice(2), ...p }); hubLocalSave(); }
  renderHub();
}
async function upPrompt(id) {
  if (!hub.canWrite) return;
  const ids = { ...hub.mineUps }; if (ids[id]) delete ids[id]; else ids[id] = 1;
  if (hub.mode === 'db') { try { await hub.db.doc('promptups/' + hub.uid).set({ ids, at: now() }); } catch (_) { /* ignore */ } return; }
  hub.mineUps = ids;
  if (hub.mode === 'server') { try { applyServer(await hubPost('/api/hub/prompt_up', { id })); } catch (_) { /* ignore */ } }
  else { hubLocalAgg(); hubLocalSave(); }
  renderHub();
}
function hubMsg(item, text, err) { const el = document.querySelector(`#hub-${item} .fmsg`); if (el) { el.textContent = text; el.classList.toggle('err', !!err); } }
function hubRank() {
  const net = id => { const v = hub.votes[id] || { up: 0, down: 0 }; return v.up - v.down; };
  return [...ITEMS].sort((a, b) => net(b.id) - net(a.id) || ((hub.votes[b.id] || {}).up || 0) - ((hub.votes[a.id] || {}).up || 0) || a.id.localeCompare(b.id));
}
function promptBox(title, text, id, meta) {
  const box = h('div', { class: 'pm' }, h('div', { class: 'pm-h' }, h('b', { text: title }), h('span', { class: 'acts' },
    h('button', { type: 'button', text: 'Copy', onclick: async e => { try { await navigator.clipboard.writeText(text); e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy', 1500); } catch (_) { const r = document.createRange(); r.selectNodeContents(box.querySelector('pre')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } } }),
    h('a', { href: 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text), download: 'fix-' + id + '.md', text: 'Download .md' }))), h('pre', { text }));
  if (meta) box.append(meta);
  return box;
}
function form(fields, submitLabel, onSubmit, openLabel) {
  const f = h('form', { hidden: !!openLabel }); const els = {};
  for (const [name, placeholder, kind] of fields) { els[name] = h(kind === 'area' ? 'textarea' : 'input', { 'data-f': name, placeholder, 'aria-label': placeholder, ...(kind === 'area' ? {} : { type: 'text' }) }); if (kind === 'row') continue; f.append(els[name]); }
  const row = h('div', { class: 'frow' }); const msg = h('span', { class: 'fmsg' });
  for (const [name] of fields.filter(x => x[2] === 'row')) row.append(els[name]);
  row.append(h('button', { class: 'btn small', type: 'submit', text: submitLabel }), msg); f.append(row);
  f.addEventListener('submit', async e => { e.preventDefault(); msg.className = 'fmsg'; msg.textContent = 'Saving…'; try { await onSubmit(Object.fromEntries(Object.entries(els).map(([k, el]) => [k, el.value]))); msg.textContent = 'Saved.'; Object.values(els).forEach(el => el.value = ''); } catch (err) { msg.className = 'fmsg err'; msg.textContent = err.message || 'Could not save.'; } });
  if (!openLabel) return f;
  const opener = h('button', { class: 'btn ghost small', type: 'button', text: openLabel, onclick: () => { f.hidden = false; opener.hidden = true; els[fields[0][0]].focus(); } });
  return h('div', {}, opener, f);
}
function voteBtns(id) {
  const v = hub.votes[id] || { up: 0, down: 0 }; const mine = hub.mine[id] || 0;
  return [h('button', { class: 'vb' + (mine === 1 ? ' on' : ''), type: 'button', title: 'I have suffered this', disabled: !hub.canWrite, onclick: e => { e.stopPropagation(); vote(id, 1); } }, '👍 ', h('span', { text: String(v.up) })),
    h('button', { class: 'vb' + (mine === -1 ? ' on' : ''), type: 'button', title: 'Not a real problem', disabled: !hub.canWrite, onclick: e => { e.stopPropagation(); vote(id, -1); } }, '👎 ', h('span', { text: String(v.down) }))];
}
function hubRow(it, rank) {
  const a = it.ar; const v = hub.votes[it.id] || { up: 0, down: 0 }; const mine = hub.mine[it.id] || 0;
  const cases = hub.cases.filter(c => c.item === it.id); const prompts = hub.prompts.filter(p => p.item === it.id).sort((x, y) => (hub.pups[y.id] || 0) - (hub.pups[x.id] || 0));
  const li = h('li', { class: 'hr ' + a.cls + (hubOpen.has(it.id) ? ' open' : ''), id: 'hub-' + it.id });
  const row = h('div', { class: 'hr-row' },
    h('span', { class: 'hr-rank', text: String(rank) }), h('span', { class: 'v-id', text: it.id }), h('span', { class: 'hr-name', text: it.name }), h('span', { class: 'hr-what', text: it.what }),
    h('span', { class: 'hr-meta', text: `${cases.length} case${cases.length === 1 ? '' : 's'} · ${prompts.length + 1} prompt${prompts.length ? 's' : ''}` }),
    h('span', { class: 'votes' }, ...voteBtns(it.id)));
  row.addEventListener('click', e => { if (e.target.closest('button')) return; if (hubOpen.has(it.id)) hubOpen.delete(it.id); else hubOpen.add(it.id); li.classList.toggle('open'); });
  const caseList = h('div', {}, ...(cases.length ? cases.map(c => h('div', { class: 'case' }, h('q', { text: c.quote }), c.why ? h('div', { class: 'cw', text: c.why }) : null,
    h('div', { class: 'cm' }, [c.where, c.by ? 'by ' + c.by : '', c.at ? String(c.at).slice(0, 10) : ''].filter(Boolean).join(' · '), c.status === 'pending' ? h('span', { class: 'pend', text: ' · pending review' }) : null))) : [h('p', { class: 'fmsg', text: 'No case listed yet.' })]));
  const casesBox = h('div', { class: 'hb' }, h('h4', { text: 'Cases' }), caseList, hub.canWrite ? form([['quote', 'The passage, quoted', 'area'], ['why', 'What the reader cannot check (one line)', 'text'], ['where', 'Where: arXiv id, venue, or page', 'row'], ['by', 'Your name (optional)', 'row']], 'Add case', f => addCase(it.id, f), 'Add a case') : null);
  const promptsBox = h('div', { class: 'hb' }, h('h4', { text: 'Fix prompt' }), promptBox('fix-' + it.id + '.md', PROMPTS[it.id], it.id),
    ...prompts.map(p => h('div', { class: 'cp' }, h('div', {}, h('pre', { text: p.text }), h('div', { class: 'cm', text: [p.by ? 'by ' + p.by : 'anonymous', String(p.at || '').slice(0, 10)].filter(Boolean).join(' · ') })),
      h('button', { class: 'vb' + (hub.mineUps[p.id] ? ' on' : ''), type: 'button', disabled: !hub.canWrite, onclick: () => upPrompt(p.id) }, '👍 ', h('span', { text: String(hub.pups[p.id] || 0) })))),
    hub.canWrite ? form([['text', 'Your prompt for fixing this slop', 'area'], ['by', 'Your name (optional)', 'row']], 'Share prompt', f => addPrompt(it.id, f), 'Share your prompt') : null);
  li.append(row, h('div', { class: 'hr-body' }, casesBox, promptsBox));
  return li;
}
function renderHub() {
  const host = $('#hub');
  if (host) {
  const saved = {}; host.querySelectorAll('.hr').forEach(li => { const vals = {}; li.querySelectorAll('[data-f]').forEach(el => { if (el.value) vals[el.closest('.hb').querySelector('h4').textContent + '/' + el.dataset.f] = el.value; }); if (Object.keys(vals).length) saved[li.id] = vals; });
  host.replaceChildren(...hubRank().map((it, i) => hubRow(it, i + 1)));
  for (const [id, vals] of Object.entries(saved)) { const li = document.getElementById(id); if (!li) continue; li.querySelectorAll('[data-f]').forEach(el => { const k = el.closest('.hb').querySelector('h4').textContent + '/' + el.dataset.f; if (vals[k]) el.value = vals[k]; }); }
  }
  const total = Object.values(hub.votes).reduce((n, v) => n + (v.up || 0) + (v.down || 0), 0);
  $('#hub-status').textContent = (hub.mode === 'db' ? 'Shared with everyone who opens this page' : hub.mode === 'server' ? 'Live' : 'Saved in this browser only') + ` · ${total} vote${total === 1 ? '' : 's'} · ${hub.cases.length} case${hub.cases.length === 1 ? '' : 's'}`;
  document.querySelectorAll('[data-votes]').forEach(el => el.replaceChildren(...voteBtns(el.dataset.votes)));
  document.querySelectorAll('.slop').forEach(card => { const id = card.id; const v = hub.votes[id] || { up: 0, down: 0 }; const n = hub.cases.filter(c => c.item === id).length; let line = card.querySelector('.hubline'); if (!line) { line = h('div', { class: 'hubline' }); card.append(line); } line.replaceChildren(h('span', { text: `👍 ${v.up}` }), h('span', { text: `${n} case${n === 1 ? '' : 's'}` }), h('a', { href: '#hub-' + id, 'data-xref': 'hub-' + id, text: 'Seen it? →' })); });
  renderStudio();
}
// ------------------------------------------------------------------ tabs, chips, expand, deep links
const TABS = ['defs', 'found', 'cues'];
function showTab(name) {
  for (const t of TABS) $('#tab-' + t).hidden = t !== name;
  document.querySelectorAll('.v-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
}
$('#tabs').addEventListener('click', e => { const b = e.target.closest('.v-tab'); if (!b) return; history.replaceState({}, '', '#' + b.dataset.tab); showTab(b.dataset.tab); $('#tabs').scrollIntoView({ block: 'start' }); });
const chips = $('#area-chips'); let area = 0;
chips.append(h('button', { class: 'chip-b on', type: 'button', 'data-area': '0', text: 'All 17' }), ...GROUPS.map(a => h('button', { class: 'chip-b ' + a.cls, type: 'button', 'data-area': a.n, title: a.q, text: a.title })));
function apply() { document.querySelectorAll('.v-area').forEach(s => s.hidden = area !== 0 && +s.dataset.area !== area); chips.querySelectorAll('.chip-b').forEach(b => b.classList.toggle('on', +b.dataset.area === area)); }
chips.addEventListener('click', e => { const b = e.target.closest('.chip-b'); if (!b) return; area = +b.dataset.area; apply(); });
const expand = $('#expand');
expand.addEventListener('click', () => { const ms = [...document.querySelectorAll('.e-open')]; const open = ms.some(d => !d.open); ms.forEach(d => d.open = open); expand.textContent = open ? 'Hide all examples' : 'Show all examples'; });
function openHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (['hub', 'studio', 'paper', 'vote', 'slops'].includes(id)) { $('#studio').scrollIntoView({ block: 'start' }); return; }
  if (['console', 'tag', 'check'].includes(id)) { setMode(id === 'tag' ? 'tag' : 'paper'); $('#console').scrollIntoView({ block: 'center' }); return; }
  const alias = { def: 'defs', definitions: 'defs', analyses: 'found', findings: 'found', cue: 'cues', registry: 'defs' };
  if (alias[id]) { history.replaceState({}, '', '#' + alias[id]); showTab(alias[id]); $('#tabs').scrollIntoView({ block: 'start' }); return; }
  if (TABS.includes(id)) { showTab(id); return; }
  if (/^hub-\d-\d$/.test(id)) { select(id.slice(4), true); return; }
  if (/^f\d$/.test(id)) { showTab('found'); const el = document.getElementById(id); if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); } return; }
  if (/^area-\d$/.test(id)) { showTab('defs'); area = 0; apply(); const el = document.getElementById(id); if (el) el.scrollIntoView({ block: 'start' }); return; }
  const d = id && document.getElementById(id);
  if (d && d.classList.contains('slop')) { showTab('defs'); regShow(id); $('#tab-defs').scrollIntoView({ block: 'start' }); }
}
document.addEventListener('click', e => { const a = e.target.closest('a[data-xref], a.ql, a.atile'); if (!a) return; e.preventDefault(); history.pushState({}, '', a.getAttribute('href')); openHash(); });
addEventListener('hashchange', openHash);
// ------------------------------------------------------------------ studio: the specimen page under a lens, one slop at a time, votes beside it
const PAGE_ORDER = ['2-5', '2-1', '4-1', '1-4', '5-4', '4-2', '4-5', '1-2', '3-1', '2-3', '4-4', '1-1'];
const tally = id => hub.votes[id] || { up: 0, down: 0 };
const nCases = id => hub.cases.filter(c => c.item === id).length;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const st = { sel: PAGE_ORDER[0], sort: 'page', all: false, hover: false };
const wrapEl = $('#spec-wrap'), revealEl = $('#spec-reveal');
function stOrder() { const base = stOrderFlat(); return GROUPS.flatMap(g => base.filter(it => it.plane === g.key)); }
function stOrderFlat() {
  if (st.sort === 'votes') return hubRank();
  if (st.sort === 'cases') return [...ITEMS].sort((a, b) => nCases(b.id) - nCases(a.id) || tally(b.id).up - tally(a.id).up || PAGE_ORDER.indexOf(a.id) - PAGE_ORDER.indexOf(b.id));
  return PAGE_ORDER.map(id => BY_ID[id]);
}
// the reveal layer is a copy of the page with every slop marked; the lens cuts a window into it
function cloneReveal() { const c = $('#spec-page').cloneNode(true); revealEl.replaceChildren(...c.childNodes); revealEl.querySelectorAll('[tabindex]').forEach(e => e.removeAttribute('tabindex')); }
// the stage is a camera over the page: it frames the chosen slop and what it points at, at a readable scale
const cam = $('#cam'); st.s = 1; st.tx = 0; st.ty = 0;
function flat(fn) { const t = cam.style.transform, tr = cam.style.transition; cam.style.transition = 'none'; cam.style.transform = 'none'; const out = fn(); cam.style.transform = t; void cam.offsetWidth; cam.style.transition = tr; return out; }
function setCam(s, tx, ty) {
  const W = $('#specimen').clientWidth, H = $('#specimen').clientHeight, pw = wrapEl.offsetWidth, ph = wrapEl.offsetHeight;
  tx = pw * s <= W ? (W - pw * s) / 2 : Math.min(0, Math.max(W - pw * s, tx));
  ty = ph * s <= H ? (H - ph * s) / 2 : Math.min(24, Math.max(H - ph * s - 24, ty));
  Object.assign(st, { s, tx, ty });
  cam.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;
  wrapEl.style.setProperty('--lr', (72 / s).toFixed(1) + 'px');
  const k = $('#mm-page').offsetWidth / pw, v = $('#mm-view');
  v.style.cssText = `left:${Math.max(0, -tx / s * k)}px;top:${Math.max(0, -ty / s * k)}px;width:${Math.min(pw, W / s) * k}px;height:${Math.min(ph, H / s) * k}px`;
}
const $$over = () => [...document.querySelectorAll('#spec-page .pnote')];
function frameSel() {
  const W = $('#specimen').clientWidth, H = $('#specimen').clientHeight; if (!W) return;
  const box = flat(() => {
    drawSel();
    const wr = wrapEl.getBoundingClientRect(), rs = [];
    const add = (...els) => { for (const el of els) if (el) for (const r of el.getClientRects()) rs.push(r); };
    add($(`#spec-page .mk[data-id="${st.sel}"]`)); const f = FAIL[st.sel]; const tgt = f && f.to ? $(`#spec-page [data-g="${f.to}"]`) : null; if (tgt && !tgt.classList.contains('pg')) add(tgt); add(...$$over());
    return { t: Math.min(...rs.map(r => r.top)) - wr.top - 24, b: Math.max(...rs.map(r => r.bottom)) - wr.top + 30, l: Math.min(...rs.map(r => r.left)) - wr.left - 12, r: Math.max(...rs.map(r => r.right)) - wr.left + 12, pw: wrapEl.offsetWidth };
  });
  // frame what the pen marks: the sentence, where it points, and the notes, as large as the stage allows
  const s = Math.max(.7, Math.min(2.1, (W - 40) / Math.max(220, box.r - box.l), (H - 40) / Math.max(120, box.b - box.t)));
  setCam(s, W / 2 - (box.l + box.r) / 2 * s, H / 2 - (box.t + box.b) / 2 * s);
  placeLens();
}
function setLens(x, y) { wrapEl.style.setProperty('--x', x + 'px'); wrapEl.style.setProperty('--y', y + 'px'); }
function placeLens() {
  if (st.hover) return;
  const p = flat(() => { const mk = $(`#spec-page .mk[data-id="${st.sel}"]`); if (!mk) return null; const wr = wrapEl.getBoundingClientRect(), r = mk.getClientRects()[0]; return [r.left - wr.left + Math.min(r.width, 120) / 2, r.top - wr.top + r.height / 2]; });
  if (p) setLens(...p);
}
wrapEl.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const wr = wrapEl.getBoundingClientRect(); st.hover = true; wrapEl.classList.add('hov'); setLens((e.clientX - wr.left) / st.s, (e.clientY - wr.top) / st.s); });
wrapEl.addEventListener('pointerleave', () => { st.hover = false; wrapEl.classList.remove('hov'); placeLens(); });
function drawSel() {
  drawOver(st.sel);
  revealEl.querySelectorAll('.hot').forEach(el => el.classList.remove('hot'));
  const f = FAIL[st.sel]; if (f && f.to) revealEl.querySelectorAll(`[data-g="${f.to}"]`).forEach(el => el.classList.add('hot'));
}
function buildMini() { const c = $('#spec-page').cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[tabindex]').forEach(e => e.removeAttribute('tabindex')); $('#mm-page').replaceChildren(c); }
$('#mm').addEventListener('click', e => { const r = $('#mm-page').getBoundingClientRect(), k = r.width / wrapEl.offsetWidth; const y = (e.clientY - r.top) / k; setCam(st.s, 0, $('#specimen').clientHeight / 2 - y * st.s); });
function fitPage() { frameSel(); }
function select(id, scroll) {
  if (!BY_ID[id]) return; st.sel = id;
  document.querySelectorAll('#spec-page .mk, #spec-reveal .mk, #mm-page .mk').forEach(m => m.classList.toggle('sel', m.dataset.id === id));
  renderPanel(); renderStrip(); frameSel(); if (typeof regShow === 'function') regShow(id);
  if (scroll) $('#studio').scrollIntoView({ block: 'start' });
}
$('#spec-page').addEventListener('click', e => { const m = e.target.closest('.mk'); if (m) select(m.dataset.id); });
$('#spec-page').addEventListener('keydown', e => { const m = e.target.closest('.mk'); if (m && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(m.dataset.id); } });
function copyFix(id, btn) {
  const text = PROMPTS[id]; const lab = btn.querySelector('.t');
  const done = ok => { lab.textContent = ok ? 'Copied' : 'Select the prompt below'; setTimeout(() => lab.textContent = 'Copy fix prompt', 1600); };
  try { navigator.clipboard.writeText(text).then(() => done(true), () => { showFix(id); done(false); }); } catch (_) { showFix(id); done(false); }
}
function showFix(id) { const box = $('#sp-body .sp-fix'); if (box) { box.hidden = false; box.textContent = PROMPTS[id]; const r = document.createRange(); r.selectNodeContents(box); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } }
const clip = (t, n) => (t = String(t || '').replace(/\s+/g, ' ').trim()).length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t;
const cap1 = t => t.charAt(0).toUpperCase() + t.slice(1);
function srcParts(src) { const m = String(src || '').split(' · '); return [h('span', { class: 'snip-who', text: m[0] || '' }), h('span', { text: m.slice(1).join(' · ') })]; }
// six v1 measures → twelve slops, drawn as a hand-ruled tree; the caption under the page says what the chosen slop is
const TREE = [['Argument graph', ['1-1', '1-2', '5-4']], ['Citation isolation', ['1-4']], ['Cross-section references', ['2-3']], ['Macro redundancy', ['4-4', '2-5']], ['Figure exposition', ['4-5']], [null, ['2-1', '3-1', '4-1', '4-2']]];
// results so far, on the 123 AI / human pairs; an item stays blank until its measure is final
// 11-06: columns as in v1 Table 2 (PairAcc, AUROC, TPR at 5% FPR), from each item's saved per-paper scores (v2/verification/table_site_rows_1106.py)
const RESULTS = { '1-4': { pa: '0.85', auc: '0.87', tpr: '0.59' }, '1-2': { pa: '0.88', auc: '0.88', tpr: '0.50' }, '2-3': { pa: '0.88', auc: '0.88', tpr: '0.00' }, '4-1': { pa: '0.82', auc: '0.82', tpr: '0.34' }, '4-4': { pa: '0.91', auc: '0.90', tpr: '0.29' }, '2-5': { pa: '0.91', auc: '0.90', tpr: '0.76' } };
$('#sm-res').replaceChildren(h('table', { class: 'res-tbl' },
  h('thead', {}, h('tr', {}, ...['Slop', 'PairAcc', 'AUROC', 'TPR@5%FPR'].map(t => h('th', { text: t })))),
  h('tbody', {}, ...GROUPS.flatMap(g => [h('tr', { class: 'res-g ' + g.cls }, h('td', { colspan: 4, text: g.title })),
    ...ITEMS.filter(i => i.plane === g.key).map(it => { const r = RESULTS[it.id] || {};
      return h('tr', { class: RESULTS[it.id] ? 'has' : '' }, h('td', {}, h('span', { class: 'res-id', text: it.id }), it.name), h('td', { text: r.pa || '' }), h('td', { text: r.auc || '' }), h('td', { text: r.tpr || '' })); })]))));
// the three areas, each in its own colour: Structure, Argument, Artifacts
const TREE2 = GROUPS.map(g => [g, ITEMS.filter(i => i.plane === g.key).map(i => i.id)]);
$('#tree-rows').replaceChildren(...TREE2.map(([g, ids]) => h('div', { class: 'tr ' + g.cls },
  h('span', { class: 'tr-m' }, h('b', { text: g.title }), h('span', { text: ' · ' + ids.length })),
  h('div', { class: 'tr-s' }, ...ids.map(id => h('button', { type: 'button', class: 'ts ' + BY_ID[id].ar.cls, 'data-id': id, onclick: () => select(id) }, h('i'), h('span', { class: 'ts-n', text: BY_ID[id].name }), h('span', { class: 'ts-v' })))))));
const V1OF = Object.fromEntries(TREE.flatMap(([m, ids]) => ids.map(id => [id, m])));
function drawTree() {
  const svg = $('#tree-ln'), box = $('#tree').getBoundingClientRect(); if (!box.width) return;
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`); let out = '', k = 0;
  document.querySelectorAll('.tr').forEach(row => {
    const m = row.querySelector('.tr-m').getBoundingClientRect(), x0 = m.right - box.left + 4, y0 = m.top - box.top + m.height / 2, isNew = row.classList.contains('new');
    row.querySelectorAll('.ts').forEach(t => { const r = t.getBoundingClientRect(), x1 = r.left - box.left - 4, y1 = r.top - box.top + r.height / 2, mx = (x0 + x1) / 2;
      out += stroke([[x0, y0], [mx - 6, y0 + (y1 - y0) * .15], [mx + 6, y1 - (y1 - y0) * .15], [x1, y1]], isNew ? 'red' : 'ink', .15 + k++ * .06, .9); });
  });
  svg.innerHTML = out;
}
function renderPanel() {
  const it = BY_ID[st.sel], t = tally(it.id), mine = hub.mine[it.id] || 0, f = FAIL[it.id] || {};
  document.querySelectorAll('.ts').forEach(b => { b.classList.toggle('on', b.dataset.id === it.id); b.querySelector('.ts-v').textContent = tally(b.dataset.id).up ? '▲' + tally(b.dataset.id).up : ''; });
  $('#st-panel').className = 'cap st-panel ' + it.ar.cls;
  $('#sp-body').replaceChildren(h('div', { class: 'cap-in' },
    h('div', { class: 'cap-t' }, h('b', { class: 'cap-n', text: it.name }), h('span', { class: 'cap-pl' }, h('i'), it.ar.title + (V1OF[it.id] ? ' · v1 ' + V1OF[it.id] : ' · new in v1.1'))),
    h('p', { class: 'cap-d', text: it.short }),
    it.parts ? h('div', { class: 'cap-parts' }, ...it.parts.map(p => h('p', { class: 'cap-pt' }, h('b', { text: p.name }), h('span', { text: p.what })))) : null,
    h('div', { class: 'cap-vs' },
      h('p', { class: 'says' }, h('span', { text: 'The paper says' }), h('q', { text: it.ex.spec || clip(it.ex.mark, 90) })),
      h('p', { class: 'but' }, h('span', { text: 'What’s there' }), h('em', { text: cap1(f.label || it.what) }))),
    h('div', { class: 'cap-a' },
      h('button', { type: 'button', class: 'cap-v' + (mine === 1 ? ' on' : ''), disabled: !hub.canWrite, onclick: () => vote(it.id, 1) }, (mine === 1 ? 'You ran into this' : 'I ran into this'), h('b', { text: String(t.up) })),
      h('button', { type: 'button', class: 'cap-how', 'aria-expanded': String($('#rg-entry').classList.contains('open')), onclick: e => { const on = $('#rg-entry').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', on); e.currentTarget.textContent = on ? 'Hide the measurement ↑' : 'How it is measured ↓'; }, text: $('#rg-entry').classList.contains('open') ? 'Hide the measurement ↑' : 'How it is measured ↓' }))));
}
addEventListener('resize', () => drawTree());
const stChips = {}, stEnds = {};
function renderStrip() {
  const strip = $('#st-strip'); const before = new Map([...strip.children].map(el => [el, el.offsetTop]));
  let plane = null;
  stOrder().forEach((it, i) => {
    if (it.plane !== plane) { plane = it.plane; const g = GROUPS.find(x => x.key === plane); strip.append(stEnds[plane] || (stEnds[plane] = h('span', { class: 'bk-end ' + g.cls, title: g.q }, h('span', { text: g.title }), h('i', { text: String(ITEMS.filter(x => x.plane === plane).length) })))); }
    const c = stChips[it.id] || (stChips[it.id] = h('button', { type: 'button', class: 'bk ' + it.ar.cls, 'data-id': it.id, 'aria-label': it.name, onclick: () => select(it.id) },
      h('span', { class: 'bk-spine', 'aria-hidden': 'true' }, h('span', { class: 'bk-r' }), h('span', { class: 'bk-t', text: it.name }), h('span', { class: 'bk-v' })),
      h('span', { class: 'bk-cover' },
        h('span', { class: 'bk-pic', html: K.svg(PIC[it.id](), '') }),
        h('span', { class: 'bk-pl', text: it.ar.title }), h('span', { class: 'bk-n', text: it.name }), h('span', { class: 'bk-d', text: it.short }), h('span', { class: 'bk-cv' }))));
    const on = it.id === st.sel, up = tally(it.id).up;
    c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on));
    c.querySelector('.bk-r').textContent = String(i + 1).padStart(2, '0');
    c.querySelector('.bk-v').textContent = up ? '▲' + up : '';
    c.querySelector('.bk-cv').textContent = `${String(i + 1).padStart(2, '0')} / 12 · ${up} ran into it`;
    strip.append(c);
  });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) for (const [el, y] of before) { const dy = y - el.offsetTop; if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' }); }
  const on = stChips[st.sel]; strip.scrollTo({ top: on.offsetTop - strip.clientHeight / 2 + on.offsetHeight / 2, behavior: 'smooth' });
}
function step(d) { const o = stOrder(); const i = o.findIndex(x => x.id === st.sel); select(o[(i + d + o.length) % o.length].id); }
$('#st-prev').addEventListener('click', () => step(-1)); $('#st-next').addEventListener('click', () => step(1));
$('#studio').addEventListener('keydown', e => { if (e.target.closest('input, textarea')) return; if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); } if (e.key === 'ArrowRight') { step(1); e.preventDefault(); } });
$('#st-sort').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.sort = b.dataset.sort; $('#st-sort').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); renderStrip(); renderPanel(); });
$('#st-reveal').addEventListener('click', e => { st.all = !st.all; wrapEl.classList.toggle('all', st.all); e.currentTarget.setAttribute('aria-pressed', String(st.all)); e.currentTarget.textContent = st.all ? 'Hide again' : 'Reveal all'; });
function renderStudio() { renderPanel(); renderStrip(); }

// ------------------------------------------------------------------ console: check a paper, tag a sentence
function setMode(m) {
  document.querySelectorAll('.cx-tabs [data-mode]').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); });
  document.querySelectorAll('.cx-pane').forEach(p => p.hidden = p.dataset.pane !== m);
}
$('.cx-tabs').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
// the analyzer runs on the demo server; inside a sandboxed copy the link carries the paper so it opens prefilled
const ANALYZER = LIVE_API + '/';
const CAN_POST = /(^|\.)github\.io$|^localhost$|^127\.|onrender\.com$/.test(location.hostname);
const goA = $('#cx-go'), urlIn = $('#cx-url');
urlIn.addEventListener('input', () => { const v = urlIn.value.trim(); goA.href = v ? ANALYZER + '?url=' + encodeURIComponent(v) : ANALYZER; goA.classList.toggle('ready', !!v); });
goA.addEventListener('click', async e => {
  const v = urlIn.value.trim();
  if (!v) { e.preventDefault(); urlIn.focus(); return; }
  if (!CAN_POST) return;
  e.preventDefault(); const hint = $('#cx-paper-hint'); hint.textContent = 'Sending the paper to the analyzer…';
  try {
    const fd = new FormData(); fd.append('url', v);
    const r = await fetch(LIVE_API + '/api/analyze', { method: 'POST', body: fd }); const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.detail || 'The analyzer did not accept this link.');
    location.href = LIVE_API + '/r/' + d.key;
  } catch (err) { hint.textContent = (err.message || 'Could not reach the analyzer.') + ' '; hint.append(h('a', { href: goA.href, target: '_blank', rel: 'noopener', text: 'Open it on the analyzer ↗' })); }
});
$('#cx-paper').addEventListener('submit', e => { e.preventDefault(); if (urlIn.value.trim()) goA.click(); else urlIn.focus(); });
let pick = null;
$('#cx-pick').replaceChildren(...['structure', 'argument', 'artifacts'].flatMap(pl => ITEMS.filter(i => i.plane === pl).map(it => h('button', { type: 'button', role: 'radio', 'aria-checked': 'false', class: 'cx-pc ' + it.ar.cls, 'data-id': it.id, title: it.short, text: it.name }))));
function setPick(id) { pick = id; document.querySelectorAll('.cx-pc').forEach(b => { const on = b.dataset.id === id; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); }); const msg = $('#cx-tag-msg'); msg.className = 'cx-hint'; msg.textContent = BY_ID[id].name + ': ' + BY_ID[id].short; }
$('#cx-pick').addEventListener('click', e => { const b = e.target.closest('.cx-pc'); if (b) setPick(b.dataset.id); });
function tagAs(id) { setPick(id); setMode('tag'); $('#console').scrollIntoView({ block: 'center' }); $('#cx-quote').focus(); }
$('#cx-tag').addEventListener('submit', async e => {
  e.preventDefault(); const msg = $('#cx-tag-msg'); msg.className = 'cx-hint';
  if (!hub.canWrite) { msg.className = 'cx-hint err'; msg.textContent = 'Only signed-in visitors with access can add cases here.'; return; }
  if (!pick) { msg.className = 'cx-hint err'; msg.textContent = 'Pick the slop this sentence shows.'; return; }
  msg.textContent = 'Saving…';
  try {
    await addCase(pick, { quote: $('#cx-quote').value, why: $('#cx-why').value, where: $('#cx-where').value, by: $('#cx-by').value });
    const id = pick; msg.replaceChildren('Added to ', h('a', { href: '#hub-' + id, 'data-xref': 'hub-' + id, text: BY_ID[id].name }), '. It stays pending until we check it.');
    ['#cx-quote', '#cx-why', '#cx-where'].forEach(s => $(s).value = '');
  } catch (err) { msg.className = 'cx-hint err'; msg.textContent = err.message || 'Could not save the case.'; }
});

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// ------------------------------------------------------------------ hero (after motionsites' Scanner Comparison): one page, two readings, split by a scanner line
const RV = { cols: [40, 360, 680], w: 290,
  secs: [[0, 'Abstract', 58, 156], [0, '§1 Introduction', 168, 388], [1, '§2 Related work', 48, 146], [1, '§3 Method', 158, 388], [2, '§4 Results', 48, 266], [2, '§5 Discussion', 278, 326], [2, 'References', 338, 388]] };
function rvTokens() {
  let out = '', k = 0;
  for (const [c, , y0, y1] of RV.secs) { const x0 = RV.cols[c] + 12, x1 = RV.cols[c] + RV.w - 12; for (let y = y0 + 22; y < y1 - 6; y += 13) { let x = x0; while (x < x1 - 10) { const w = Math.min(x1 - x, 10 + ((k * 53 + y * 7) % 34)); out += `<rect class="t" data-k="${k++}" x="${x}" y="${y}" width="${w}" height="7" rx="2"/>`; x += w + 4; } } }
  return out;
}
const frame = () => RV.secs.map(([c, lab, y0, y1]) => `<rect class="sec" x="${RV.cols[c]}" y="${y0}" width="${RV.w}" height="${y1 - y0}" rx="6"/><text class="sl" x="${RV.cols[c] + 12}" y="${y0 + 15}">${lab}</text>`).join('');
const toks = rvTokens();
$('#rv2-tok').innerHTML = `<svg viewBox="0 0 1010 400" preserveAspectRatio="xMidYMid meet"><rect class="pg" x="20" y="6" width="970" height="388" rx="10"/>${toks}<rect class="cur" id="rv-cur" x="0" y="0" width="22" height="11" rx="3"/></svg>`;
// a reviewer's red pen: shaky strokes drawn twice, loops, squiggles, hand arrowheads, handwritten notes
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - .5;
function pen(pts, j = 1.6) {   // smooth path through jittered points (Catmull-Rom)
  const p = pts.map(([x, y]) => [x + rnd() * j, y + rnd() * j]); let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }
  return d;
}
const stroke = (pts, cls, d0, j) => `<path class="pen ${cls}" pathLength="1" style="--d:${d0}s" d="${pen(pts, j)}"/><path class="pen ${cls} ghost2" pathLength="1" style="--d:${d0 + .05}s" d="${pen(pts, j * 1.4)}"/>`;
function loop(cx, cy, rx, ry, d0) { const pts = []; for (let k = 0; k <= 26; k++) { const t = -2.4 + k / 24 * Math.PI * 2.15; pts.push([cx + Math.cos(t) * rx * (1 + rnd() * .06), cy + Math.sin(t) * ry * (1 + rnd() * .12)]); } return stroke(pts, 'red', d0, 1); }
function squig(x0, x1, y, d0) { const pts = []; for (let x = x0; x <= x1; x += 9) pts.push([x, y + (((x - x0) / 9) % 2 ? 3.5 : -2)]); return stroke(pts, 'red', d0, .6); }
function arrow(pts, d0, cls = 'red') { const [a, b] = pts.slice(-2); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); const hd = (s) => [b[0] - 13 * Math.cos(ang + s), b[1] - 13 * Math.sin(ang + s)];
  return stroke(pts, cls, d0, 2) + `<path class="pen ${cls}" pathLength="1" style="--d:${d0 + .7}s" d="M${hd(.45).map(v => v.toFixed(1)).join(' ')} L${b[0]} ${b[1]} L${hd(-.45).map(v => v.toFixed(1)).join(' ')}"/>`; }
const note = (x, y, t, d0, cls = 'red', size = 21) => `<text class="hand ${cls}" style="--d:${d0}s;font-size:${size}px" x="${x}" y="${y}">${t}</text>`;
$('#rv2-str').innerHTML = `<svg viewBox="0 0 1010 400" preserveAspectRatio="xMidYMid meet"><rect class="pg" x="20" y="6" width="970" height="388" rx="10"/>${toks.replace(/class="t"/g, 'class="t dim"')}${frame()}
  <g class="bk" data-id="2-1" tabindex="0" role="link" aria-label="Buried Findings: see it on a page"><rect class="hit" x="280" y="10" width="640" height="100"/>${loop(800, 88, 102, 14, 1.4)}${arrow([[700, 84], [640, 30], [470, 22], [330, 30], [292, 58]], 2.1)}${note(392, 40, 'this never makes it to the abstract', 2.9)}</g>
  <g class="bk" data-id="1-1" tabindex="0" role="link" aria-label="Unsupported Claims: see it on a page"><rect class="hit" x="366" y="186" width="610" height="66"/>${squig(374, 560, 230, 4.1)}${arrow([[566, 226], [640, 214], [716, 206]], 4.6)}${note(726, 212, 'evidence? no experiment', 5.3)}</g>
  <g class="bk" data-id="5-4" tabindex="0" role="link" aria-label="Misrepresented Evidence: see it on a page"><rect class="hit" x="480" y="74" width="60" height="30"/><rect class="hit" x="420" y="340" width="560" height="54"/>${loop(512, 88, 26, 10, 6.4)}${arrow([[540, 96], [660, 124], [666, 330], [690, 372]], 6.9)}${note(704, 381, '[12] says something else', 7.7, 'red', 19)}</g>
</svg>`;
// token cursor: one token at a time, in reading order
const tk = [...document.querySelectorAll('#rv2-tok .t')], cur = $('#rv-cur'); let tkI = 0, heat = [];
function tick() {
  const t = tk[tkI % tk.length]; const v = Math.random();
  t.style.fill = `hsl(210 8% ${32 + Math.round(v * 52)}%)`; heat.push(v); if (heat.length > 60) heat.shift();
  cur.setAttribute('x', +t.getAttribute('x') - 2); cur.setAttribute('y', +t.getAttribute('y') - 2); cur.setAttribute('width', +t.getAttribute('width') + 4);
  $('#rv2-p').textContent = 'p(AI) ' + (.45 + heat.reduce((a, b) => a + b, 0) / heat.length * .5).toFixed(2);
  tkI++; if (tkI % tk.length === 0) tk.forEach(x => x.style.fill = '');
}
if (!reduce) setInterval(() => { if (!document.hidden) tick(); }, 55); else for (let i = 0; i < 80; i++) tick();
// the scanner line: sweeps on its own, follows the pointer, can be dragged or moved with arrow keys
const rv = { x: 50, auto: true, t0: performance.now(), shown: 0 };
function setSplit(x) {
  rv.x = Math.max(4, Math.min(96, x)); $('#rv2-stage').style.setProperty('--split', rv.x + '%'); $('#rv2').style.setProperty('--split', rv.x + '%'); $('#rv2-line').setAttribute('aria-valuenow', Math.round(rv.x));
  { const box = $('#rv2'), tl = box.querySelector(':scope > .rv2-tag.l'), tr = box.querySelector(':scope > .rv2-tag.r');   // keep both handwritten labels inside the figure
    if (tl && tr && innerWidth > 760) { const W = box.clientWidth, px = W * rv.x / 100;
      const j = Math.max(tl.offsetWidth, Math.min(px, W - tr.offsetWidth));   // the two labels meet at j; j stays where both fit
      tr.style.left = j + 'px'; tl.style.right = (W - j) + 'px'; }
    else if (tl && tr) { tr.style.left = ''; tl.style.right = ''; } }
  const seen = [292, 716, 702].filter(px => px / 1010 * 100 > rv.x).length;   // breaks right of the line are visible
  if (seen !== rv.shown) { rv.shown = seen; $('#rv2-n').textContent = `${seen} break${seen === 1 ? '' : 's'}`; }
}
function sweep(t) { if (rv.auto && !reduce) setSplit(50 + 24 * Math.sin((t - rv.t0) / 3400)); requestAnimationFrame(sweep); }
setSplit(reduce ? 46 : 50); requestAnimationFrame(sweep);
const stg = $('#rv2-stage');
stg.addEventListener('pointerenter', () => { rv.auto = false; });   // the sweep holds still so a mark can be clicked; drag to move the line
stg.addEventListener('pointermove', e => { if (!rv.drag) return; const r = stg.getBoundingClientRect(); setSplit((e.clientX - r.left) / r.width * 100); });
stg.addEventListener('pointerdown', e => { if (e.target.closest('.bk')) return; rv.drag = true; rv.auto = false; stg.setPointerCapture(e.pointerId); const r = stg.getBoundingClientRect(); setSplit((e.clientX - r.left) / r.width * 100); });
stg.addEventListener('pointerup', () => { rv.drag = false; });
stg.addEventListener('pointerleave', () => { if (!rv.drag) { rv.auto = true; rv.t0 = performance.now() - 3400 * Math.asin(Math.max(-1, Math.min(1, (rv.x - 50) / 24))); } });
// each red mark is a named slop: click it and the studio below opens on that slop
$('#rv2-str').addEventListener('click', e => { const b = e.target.closest('.bk'); if (b) select(b.dataset.id, true); });
$('#rv2-str').addEventListener('keydown', e => { const b = e.target.closest('.bk'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(b.dataset.id, true); } });
$('#rv2-line').addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { rv.auto = false; setSplit(rv.x + (e.key === 'ArrowLeft' ? -4 : 4)); e.preventDefault(); } });

// ------------------------------------------------------------------ four questions: each drawn as its study setup in the hero's red pen; the answer is a handwritten "?"
const paperB = (x, y, w, hh, lab) => { let r = `<rect class="qp" x="${x}" y="${y}" width="${w}" height="${hh}" rx="4"/>`; for (let yy = y + 24; yy < y + hh - 8; yy += 10) r += `<rect class="ql" x="${x + 10}" y="${yy}" width="${w - 20 - ((yy * 7) % 24)}" height="4" rx="2"/>`; return r + (lab ? `<text class="qm" x="${x + 10}" y="${y + 15}">${lab}</text>` : ''); };
const robot = (x, y, r = 13) => `<g class="ico"><line x1="${x}" y1="${y - r - 6}" x2="${x}" y2="${y - r}"/><circle cx="${x}" cy="${y - r - 7}" r="2.2"/><rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r * .85}" rx="${r * .35}"/><circle class="eye" cx="${x - r * .4}" cy="${y - r * .2}" r="${r * .16}"/><circle class="eye" cx="${x + r * .4}" cy="${y - r * .2}" r="${r * .16}"/></g>`;
const person = (x, y, r = 13) => `<g class="ico"><circle cx="${x}" cy="${y - r * .55}" r="${r * .55}"/><path d="M${x - r} ${y + r * .95} a${r} ${r} 0 0 1 ${2 * r} 0z"/></g>`;
const badge = (x, y, who) => `<circle class="qbadge" cx="${x}" cy="${y}" r="15"/>` + (who === 'ai' ? robot(x, y + 3, 8) : person(x, y + 1, 9));
const bubble = (x, y, w, d0) => `<path class="qbub" d="M${x} ${y} h${w} a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-${w - 18} l-8 10 l-2 -10 h-${8} a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8z"/>${note(x + w / 2 - 6, y + 31, '?', d0, 'red', 30)}`;
const QSVG = {
  f1: () => `${paperB(34, 30, 124, 132)}${badge(34, 30, 'ai')}${loop(96, 70, 44, 8, .1)}${squig(52, 140, 112, .5)}
    ${paperB(242, 30, 124, 132)}${badge(242, 30, 'human')}${stroke([[262, 92], [346, 88]], 'red', .8, 1)}${loop(300, 128, 40, 8, 1)}
    ${note(176, 104, '≠ ?', 1.4, 'red', 32)}${note(58, 184, 'AI slop', 1.7, 'red', 22)}${note(254, 184, 'poor writing', 1.9, 'red', 22)}`,
  f2: () => `${paperB(24, 40, 104, 124)}${badge(24, 40, 'ai')}${loop(76, 82, 38, 8, .1)}${squig(40, 116, 122, .4)}
    ${arrow([[134, 100], [160, 98], [184, 100]], .7)}
    <rect class="qp" x="192" y="48" width="104" height="104" rx="8"/><text class="qm" x="204" y="68">REVIEW</text><text class="qm faint" x="204" y="86">score</text>${note(206, 132, '? / 10', 1.2, 'red', 34)}
    ${['ICLR ’17–’27', 'NeurIPS', 'ICML', 'ACL'].map((t, i) => `<rect class="qtagr" x="308" y="${50 + i * 26}" width="80" height="20" rx="10"/><text class="qtg" x="348" y="${64 + i * 26}" text-anchor="middle">${t}</text>`).join('')}
    ${note(132, 186, 'year by year, venue by venue', 1.6, 'red', 21)}`,
  f3: () => `${paperB(158, 62, 84, 104)}${badge(158, 62, 'ai')}${loop(200, 104, 30, 7, .1)}${squig(170, 228, 138, .4)}
    ${person(62, 128, 20)}<text class="qm" x="44" y="170">human</text>${robot(338, 132, 18)}<text class="qm" x="328" y="170">AI</text>
    ${bubble(28, 34, 76, 1)}${bubble(296, 34, 76, 1.3)}
    ${note(118, 186, 'same slop, same verdict?', 1.7, 'red', 21)}`,
  f4: () => `<rect class="qp" x="18" y="22" width="178" height="150" rx="8"/><text class="qm" x="30" y="42">REVIEW · Weaknesses</text>
    ${[['– claims not supported', 74], ['– repetitive', 112], ['– …', 150]].map(([t, y]) => `<text class="qhand2" x="30" y="${y}">${t}</text>`).join('')}
    ${[['Unsupported Claims', 70, 'p-argument'], ['Redundant Repetition', 108, 'p-structure']].map(([t, y, c]) => `<g class="${c}"><rect class="qchip" x="228" y="${y - 16}" width="166" height="26" rx="13"/><text class="qct" x="240" y="${y + 1}">${t}</text></g>`).join('')}
    <rect class="qchip ghost" x="228" y="130" width="166" height="26" rx="13"/>${arrow([[176, 70], [200, 66], [224, 68]], .3)}${arrow([[150, 108], [190, 112], [224, 108]], .7)}${arrow([[66, 146], [150, 152], [224, 144]], 1.1)}${note(302, 152, '?', 1.5, 'red', 34)}${note(214, 186, 'which slop gets named?', 1.8, 'red', 20)}`,
};
const QCATCH = { f1: 'AI slop <em>≠</em> bad writing?', f2: 'Does slop <em>cost</em> points?', f3: 'Human <em>or</em> AI reviewer?', f4: 'What reviewers <em>flag</em>' };
// four questions as a selector: the questions in large type on the left, the chosen one's study drawn large on the right
const QSHORT = { f1: 'Is AI slop just bad writing?', f2: 'Does slop cost review points?', f3: 'Does an AI reviewer let more slop through?', f4: 'What do reviewers actually flag?' };
let qCur = 0;
const qStage = h('div', { class: 'qx-stage' });
const qList = h('ol', { class: 'qx-list' }, ...FINDINGS.map((f, i) => h('li', {},
  h('button', { type: 'button', class: 'qx-q', 'data-i': i, onmouseenter: () => qShow(i), onfocus: () => qShow(i), onclick: () => { location.href = 'q.html#' + (i + 1); } },
    h('span', { class: 'qx-n', text: String(i + 1) }), h('span', { class: 'qx-t', text: QSHORT[f.id] || f.q })))));
function qShow(i) {
  if (i === qCur && qStage.firstChild) return; qCur = i; const f = FINDINGS[i];
  qList.querySelectorAll('.qx-q').forEach((b, k) => b.classList.toggle('on', k === i));
  qStage.replaceChildren(h('div', { class: 'qv-c in qx-art', html: `<svg viewBox="0 2 400 202" aria-hidden="true">${QSVG[f.id]()}</svg>` }),
    h('p', { class: 'qx-full', text: f.q }), h('p', { class: 'qx-how', text: f.a }), h('a', { class: 'qx-read', href: 'q.html#' + (i + 1), text: 'Read the analysis →' }));
}
$('#qtiles').replaceWith(h('div', { class: 'qx', id: 'qtiles' }, qList, qStage)); qShow(0); qCur = 0;

// live count when the analyzer is reachable; the published page keeps the baked number otherwise
(async () => { const el = $('#hk-n'); const show = n => { if (!n || reduce) { if (n) el.textContent = n.toLocaleString('en-US'); return; } const t0 = performance.now(), from = Math.max(0, n - 120); (function f(t) { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(from + (n - from) * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(f); })(t0); };
  try { const r = await fetch(LIVE_API + '/api/stats'); const j = await r.json(); show(j.analyses); } catch (_) { show(1557); } })();

// scroll reveal: rows and cells darken as they enter, the structure drawing draws itself
document.documentElement.classList.add('rv');
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.qv-c').forEach(el => io.observe(el));

// ------------------------------------------------------------------ the registry as a glossary: an index on the left, one slop per page on the right
const RG_ORDER = GROUPS.flatMap(g => ITEMS.filter(i => i.plane === g.key));
let rgCur = RG_ORDER[0].id;
$('#rg-idx').replaceChildren(...GROUPS.map(g => h('div', { class: 'rg-g ' + g.cls }, h('p', { class: 'rg-gt' }, g.title, h('span', { text: ' · ' + g.q })),
  ...ITEMS.filter(i => i.plane === g.key).map(it => h('a', { class: 'rg-i', href: '#' + it.id, 'data-id': it.id, 'data-xref': it.id }, h('i'), it.name)))));
const tidyNote = t => t && t.replace(/^runs disagree: \[.*\]$/, 'split vote → U').replace(/^unit extracted in only (\d)\/3 runs \(unstable unit\)$/, 'found in $1 of 3 runs → U').replace(/^the model pointed only at the claim sentence itself; a sentence is not evidence for itself$/, 'only the claim itself was cited as evidence').replace(/\(background_uncited; [^)]*\)/, '').replace(/^judge: scope consistent · source no source$/, 'judge: scope consistent · no source').replace(/: True\b/g, ': yes').replace(/: False\b/g, ': no');
// 2-3 (and any item whose run data carries a `map`): the paper drawn as sheets, redrawn as the step player advances
// step 0 = which parts are units, 1 = the pointers the parser found, 2 = used or not (with the uses that carry no pointer), 3 = verdicts
function xmap(map) {
  const W = 600, SW = 100, GAP = 20, SY = 92, SH = 136, NS = map.sections.length;
  const sx = i => 10 + i * (SW + GAP) + (5 - NS) * (SW + GAP) / 2;
  const S = {}; map.sections.forEach((sec, i) => { S[sec.id] = { ...sec, x: sx(i), y: SY, w: SW, h: SH }; });
  const P = {};   // component boxes
  for (const sec of map.sections) {
    const cs = map.comps.filter(c => c.in === sec.id), b = S[sec.id];
    const perRow = cs.length > 2 ? 3 : 2, cw = perRow === 3 ? 26 : 40, gx = (SW - perRow * cw) / (perRow + 1);
    cs.forEach((c, k) => { const r = Math.floor(k / perRow), last = cs.length - r * perRow; let col = k % perRow; if (perRow === 3 && last === 2 && r > 0) col = col ? 2 : 0;   // a short last row sits at the edges so its pointers can come in from the margins
      P[c.id] = { ...c, x: b.x + gx + col * (cw + gx), y: b.y + 84 + r * 24, w: cw, h: 17, row: r }; });
  }
  const U = {}; map.units.forEach((u, i) => { U[u.id] = { ...u, i }; });
  const at = id => S[id] || P[id];
  const g = (m, inner, cls = '') => `<g data-m="${m}" class="${cls}">${inner}</g>`;
  const ink = '#3A3D42', hair = '#C9CDD1', st = C.struct, red = '#D93A3A', ok = C.ok;
  let out = '';
  // sheets
  for (const sec of map.sections) {
    const b = S[sec.id], unit = !!U[sec.id];
    let lines = ''; for (let i = 0; i < 6; i++) lines += `<line x1="${b.x + 10}" y1="${b.y + 30 + i * 8.5}" x2="${b.x + b.w - 10 - (i === 5 ? 34 : (i * 7) % 18)}" y2="${b.y + 30 + i * 8.5}" stroke="${hair}" stroke-width="2.2" stroke-linecap="round"/>`;
    out += `<g class="xm-sheet${unit ? ' unit' : ' skip'}" data-u="${unit ? U[sec.id].i : ''}"><rect class="xm-paper" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="3"/>` +
      `<text x="${b.x + 9}" y="${b.y + 16}" class="xm-tt">${esc(sec.title)}</text>${lines}` +
      (unit ? '' : `<text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + 22}" class="xm-skipt" text-anchor="middle">not checked</text>`) + `</g>`;
  }
  for (const c of Object.values(P)) {
    const unit = !!U[c.id];
    out += `<g class="xm-comp${unit ? ' unit' : ' skip'}" data-u="${unit ? U[c.id].i : ''}"><rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="3"/><text x="${c.x + c.w / 2}" y="${c.y + c.h / 2 + .5}" text-anchor="middle" dominant-baseline="central">${esc(c.label)}</text></g>`;
  }
  // step 1: unit frames
  let frames = '';
  for (const u of map.units) { const b = at(u.id); frames += `<rect class="xm-frame" x="${b.x - 3}" y="${b.y - 3}" width="${b.w + 6}" height="${b.h + 6}" rx="5"/>`; }
  out += g(0, frames);
  // step 2: the pointers the parser found (solid, drawn like a pen)
  let ptr = '';
  for (const p of map.pointers) {
    const f = S[p.from], t = at(p.to), x0 = f.x + (p.fx || 18), y0 = f.y + 66;
    if (t.row) {   // second row: come down the sheet margin and enter from the side
      const leftSide = t.x + t.w / 2 < f.x + f.w / 2, mx = leftSide ? f.x + 4 : f.x + f.w - 4, x1 = leftSide ? t.x - 1 : t.x + t.w + 1, y1 = t.y + t.h / 2;
      ptr += `<path class="pen" pathLength="1" d="M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1 + (leftSide ? -3 : 3)} ${y1}" stroke="${st}"/><circle cx="${x1 + (leftSide ? -2 : 2)}" cy="${y1}" r="2.2" fill="${st}"/>`;
    } else {
      const x1 = t.x + t.w / 2, y1 = t.y - 1, cx = (x0 + x1) / 2 + (x1 > x0 ? -6 : 6), cy = Math.min(y0, y1) - 6;
      ptr += `<path class="pen" pathLength="1" d="M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1 - 3}" stroke="${st}"/><circle cx="${x1}" cy="${y1 - 2}" r="2.2" fill="${st}"/>`;
    }
  }
  out += g(1, ptr);
  // step 3: uses with no pointer (red dashed arcs above the sheets) + used / not used marks
  let miss = '';
  map.missing.forEach((m, k) => {
    const f = at(m.from), t = at(m.to), x0 = f.x + f.w / 2, x1 = t.x + t.w / 2, y = SY - 4, top = SY - 30 - k * 32, left = k === 0;
    const xm = (x0 + x1) / 2;
    miss += `<path d="M${x0} ${y} C${x0} ${top} ${x1} ${top} ${x1} ${y - 4}" fill="none" stroke="${red}" stroke-width="1.8" stroke-dasharray="5 4"/>` +
      `<path d="M${x1 - 4} ${y - 10} L${x1} ${y - 3} L${x1 + 4} ${y - 10}" fill="none" stroke="${red}" stroke-width="1.8" stroke-linecap="round"/>` +
      `<g transform="translate(${xm} ${top + 6})"><circle r="7" fill="${red}"/><path d="M-3 -3L3 3M-3 3L3 -3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>` +
      `<text class="xm-hand" x="${left ? xm - 12 : xm + 12}" y="${top + 6}" text-anchor="${left ? 'end' : 'start'}" dominant-baseline="central">${esc(m.note)}</text>`;
  });
  let marks = '';
  for (const u of map.units) {
    const b = at(u.id), used = u.final === 'PASS', x = b.x + b.w + 1, y = b.y - 1;
    marks += `<g transform="translate(${x} ${y})"><circle r="8" fill="${used ? ok : red}" stroke="#fff" stroke-width="1.5"/>` +
      (used ? `<path d="M-3.6 0L-1 2.8L3.8 -3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M-3 -3L3 3M-3 3L3 -3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`) + `</g>`;
  }
  out += g(2, miss + marks);
  // step 4: verdict stamps under each unit
  let stamps = '';
  for (const u of map.units) {
    const b = at(u.id), pass = u.final === 'PASS', y = S[u.id] ? b.y + b.h + 16 : b.y + b.h + 12;
    stamps += `<text class="xm-stamp ${pass ? 'p' : 'f'}" x="${b.x + b.w / 2}" y="${y}" text-anchor="middle">${pass ? 'PASS' : 'FAIL'}</text>`;
  }
  out += g(3, stamps);
  const svg = h('div', { class: 'xm-fig', html: `<svg viewBox="0 0 ${W} 262" role="img" aria-label="${esc(map.aria || 'The paper as sheets, with the pointers between its parts')}">${out}</svg>` });
  const cap = h('p', { class: 'xm-cap' });
  const el = h('figure', { class: 'xm' }, svg, cap);
  const step = k => {
    el.dataset.s = k;
    el.querySelectorAll('[data-m]').forEach(n => n.classList.toggle('on', +n.dataset.m <= k));
    const c = map.caps[Math.max(0, Math.min(k, map.caps.length - 1))] || '';
    cap.replaceChildren(h('span', { class: 'xm-n', text: String(Math.max(0, k) + 1) }), h('span', { text: c }));
  };
  const sel = i => el.querySelectorAll('[data-u]').forEach(n => n.classList.toggle('sel', n.dataset.u !== '' && +n.dataset.u === i));
  return { el, step, sel };
}

// 1-2 parts: a drawn figure per part, redrawn as the step player advances (same mechanism and look as the 2-3 map)
function stepFig(body, caps, aria, H = 262) {
  const svg = h('div', { class: 'xm-fig', html: `<svg viewBox="0 0 600 ${H}" role="img" aria-label="${esc(aria)}">${body}</svg>` });
  const cap = h('p', { class: 'xm-cap' }), el = h('figure', { class: 'xm' }, svg, cap);
  const step = k => { el.dataset.s = k; el.querySelectorAll('[data-m]').forEach(n => n.classList.toggle('on', +n.dataset.m <= k));
    cap.replaceChildren(h('span', { class: 'xm-n', text: String(Math.max(0, k) + 1) }), h('span', { text: caps[Math.max(0, Math.min(k, caps.length - 1))] || '' })); };
  return { el, step, sel: () => {} };
}
const FX = { ink: '#3A3D42', hair: '#C9CDD1', arg: '#C97C86', red: '#D93A3A', ok: '#3F9A5A', soft: '#9aa0a6' };
const fxW = (t, fs = 10) => [...String(t)].reduce((a, ch) => a + (/[il.,:;|'’ ()]/.test(ch) ? .32 : /[mwMW]/.test(ch) ? .9 : /[A-Z0-9]/.test(ch) ? .66 : .55), 0) * fs;
const fxSheet = (x, y, w, hh, title, kind) => {   // a page fragment: a result table (grid) or a block of text (lines)
  let g = `<rect class="xm-paper" x="${x}" y="${y}" width="${w}" height="${hh}" rx="3"/><text x="${x + 8}" y="${y + 15}" class="xm-tt">${esc(title)}</text>`;
  if (kind === 'table') { for (let i = 0; i < 4; i++) g += `<line x1="${x + 8}" y1="${y + 28 + i * 13}" x2="${x + w - 8}" y2="${y + 28 + i * 13}" stroke="${FX.hair}" stroke-width="${i ? 1 : 1.6}"/>`;
    for (let j = 1; j < 4; j++) g += `<line x1="${x + 8 + j * (w - 16) / 4}" y1="${y + 22}" x2="${x + 8 + j * (w - 16) / 4}" y2="${y + 70}" stroke="${FX.hair}" stroke-width="1"/>`; }
  else for (let i = 0; i < 5; i++) g += `<line x1="${x + 8}" y1="${y + 30 + i * 9}" x2="${x + w - 8 - (i === 4 ? 30 : (i * 9) % 20)}" y2="${y + 30 + i * 9}" stroke="${FX.hair}" stroke-width="2.2" stroke-linecap="round"/>`;
  return g;
};
const fxChip = (x, y, t, col, o = {}) => { const w = fxW(t, 10.5) + 16; return { w, svg: `<rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="${o.fill ? col : '#fff'}" stroke="${col}" stroke-width="1.4" ${o.dash ? 'stroke-dasharray="4 3"' : ''}/><text x="${x + w / 2}" y="${y + 10.5}" font-size="10.5" font-weight="650" fill="${o.fill ? '#fff' : FX.ink}" text-anchor="middle" dominant-baseline="central">${esc(t)}</text>` }; };
const fxPen = (x0, y0, x1, y1, col = FX.arg) => `<path class="pen" pathLength="1" d="M${x0} ${y0} C${x0} ${(y0 + y1) / 2} ${x1} ${(y0 + y1) / 2} ${x1} ${y1 + 4}" stroke="${col}"/><circle cx="${x1}" cy="${y1 + 3}" r="2.4" fill="${col}"/>`;
const fxMark = (x, y, ok) => `<g transform="translate(${x} ${y})"><circle r="8" fill="${ok ? FX.ok : FX.red}" stroke="#fff" stroke-width="1.5"/>` + (ok ? `<path d="M-3.6 0L-1 2.8L3.8 -3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M-3 -3L3 3M-3 3L3 -3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`) + `</g>`;
const fxG = (m, inner) => `<g data-m="${m}">${inner}</g>`;
function figBreadth(f) {
  // the paper's result tables and setup text → the names pulled out → where each is found → the counts
  const SW = 124, GAP = 16, X0 = (600 - (f.sheets.length * SW + (f.sheets.length - 1) * GAP)) / 2, Y = 14, SH = 80;
  const S = {}; let out = '';
  f.sheets.forEach((sh, i) => { const x = X0 + i * (SW + GAP); S[sh.id] = { x, y: Y, w: SW, h: SH }; out += fxSheet(x, Y, SW, SH, sh.title, sh.kind); });
  out += fxG(0, f.sheets.filter(sh => sh.kind === 'table').map(sh => { const b = S[sh.id]; return `<rect class="xm-frame" style="stroke:${FX.arg}" x="${b.x - 3}" y="${b.y - 3}" width="${b.w + 6}" height="${b.h + 6}" rx="5"/>`; }).join('') +
    `<text class="xm-hand" x="${X0}" y="${Y + SH + 22}">${esc(f.hand0)}</text>`);
  // names
  let names = '', pens = '', marks = '';
  const rows = [['MODELS', f.models, 'model'], ['DATASETS', f.datasets, 'dataset']], cy = 152, colX = [70, 340];
  rows.forEach(([lab, list, ax], r) => {
    let x = colX[r]; names += `<text x="${x}" y="${cy - 10}" font-size="9.5" font-weight="700" letter-spacing=".08em" fill="${FX.soft}">${lab}</text>`;
    list.forEach(n => { const c = fxChip(x, cy, n.name, FX.arg); names += c.svg;
      n.at.forEach(id => { const b = S[id]; if (b) pens += fxPen(x + c.w / 2, cy, b.x + b.w / 2 + (r ? 10 : -10), b.y + b.h); });
      marks += fxMark(x + c.w, cy, true); x += c.w + 12; });
  });
  out += fxG(1, names) + fxG(2, pens + marks);
  // counts
  let cnt = '';
  const gauge = (x, y, lab, n, val) => `<text x="${x}" y="${y}" font-size="11" fill="${FX.ink}"><tspan font-weight="700">${esc(lab)}</tspan>  ${esc(n)}</text>` +
    `<rect x="${x}" y="${y + 8}" width="150" height="8" rx="4" fill="#E6E2E3"/><rect x="${x}" y="${y + 8}" width="${Math.max(3, 150 * val / 100)}" height="8" rx="4" fill="${val ? FX.arg : FX.red}"/>` +
    `<text x="${x + 158}" y="${y + 13}" font-size="11" font-weight="700" font-family="ui-monospace, monospace" fill="${val ? FX.ink : FX.red}" dominant-baseline="central">${val.toFixed(0)}</text>`;
  cnt += gauge(70, 206, 'Model axis', f.mlabel, f.axes.model) + gauge(340, 206, 'Dataset axis', f.dlabel, f.axes.dataset);
  cnt += `<text x="300" y="252" text-anchor="middle" font-size="12" fill="${FX.ink}">breadth = (${f.axes.model.toFixed(0)} + ${f.axes.dataset.toFixed(0)}) ÷ 2 = <tspan font-weight="800" font-family="ui-monospace, monospace" fill="${FX.red}">${f.breadth.toFixed(1)}</tspan> / 100  ·  below 35 → </text>` +
    `<text class="xm-stamp f" x="${300 + 140}" y="252">${f.breadth < 35 ? 'FAIL' : 'PASS'}</text>`;
  out += fxG(3, cnt);
  return stepFig(out, f.caps, f.aria, 266);
}
function figCost(f) {
  // the baseline and the method as call pipelines → the added call → the result table with no cost column → the cost words that are not costs → verdict
  let out = '';
  const pipe = (y, label, boxes, added) => { let x = 24, g = `<text x="24" y="${y - 8}" font-size="10" font-weight="700" letter-spacing=".06em" fill="${FX.soft}">${esc(label)}</text>`, add = '';
    boxes.forEach((b, i) => { const w = fxW(b, 10.5) + 18, isAdd = added.includes(i);
      g += `<rect x="${x}" y="${y}" width="${w}" height="24" rx="5" fill="#fff" stroke="${FX.soft}" stroke-width="1.2"/><text x="${x + w / 2}" y="${y + 12.5}" font-size="10.5" font-weight="600" fill="${FX.ink}" text-anchor="middle" dominant-baseline="central">${esc(b)}</text>`;
      if (isAdd) add += `<rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="30" rx="7" fill="rgba(217,58,58,.08)" stroke="${FX.red}" stroke-width="2"/>`;
      if (i < boxes.length - 1) g += `<path d="M${x + w + 3} ${y + 12} L${x + w + 15} ${y + 12}" stroke="${FX.soft}" stroke-width="1.3"/><path d="M${x + w + 11} ${y + 8} L${x + w + 15} ${y + 12} L${x + w + 11} ${y + 16}" fill="none" stroke="${FX.soft}" stroke-width="1.3"/>`;
      x += w + 18; });
    return [g, add, x]; };
  const [g1] = pipe(30, f.base.label, f.base.boxes, []), [g2, add2, x2] = pipe(92, f.method.label, f.method.boxes, f.method.added);
  out += g1 + g2;
  out += fxG(0, add2 + `<text class="xm-hand" x="${x2 - 6}" y="${92 + 13}" dominant-baseline="central">${esc(f.hand0)}</text>`);
  // result table with the missing cost column
  const tx = 24, ty = 150, cw = 74, cols = f.table.cols;
  let tb = `<text x="${tx}" y="${ty - 8}" font-size="10" font-weight="700" letter-spacing=".06em" fill="${FX.soft}">${esc(f.table.title)}</text>`;
  cols.forEach((c, j) => { tb += `<rect x="${tx + j * cw}" y="${ty}" width="${cw}" height="22" fill="#fff" stroke="${FX.hair}"/><text x="${tx + j * cw + cw / 2}" y="${ty + 11.5}" font-size="10" font-weight="650" fill="${FX.ink}" text-anchor="middle" dominant-baseline="central">${esc(c)}</text>`;
    for (let r = 1; r < 3; r++) tb += `<rect x="${tx + j * cw}" y="${ty + r * 18 + 4}" width="${cw}" height="18" fill="#fff" stroke="${FX.hair}"/><line x1="${tx + j * cw + 18}" y1="${ty + r * 18 + 13}" x2="${tx + j * cw + cw - 18}" y2="${ty + r * 18 + 13}" stroke="${FX.hair}" stroke-width="2.2" stroke-linecap="round"/>`; });
  out += tb;
  const gx = tx + cols.length * cw;
  out += fxG(1, `<rect x="${gx + 6}" y="${ty}" width="${cw + 10}" height="58" rx="3" fill="none" stroke="${FX.red}" stroke-width="1.6" stroke-dasharray="5 4"/>` +
    `<text x="${gx + 6 + (cw + 10) / 2}" y="${ty + 11.5}" font-size="10" font-weight="700" fill="${FX.red}" text-anchor="middle" dominant-baseline="central">${esc(f.table.ghost)}</text>` + fxMark(gx + 6 + (cw + 10) / 2, ty + 38, false) +
    `<text class="xm-hand" x="${gx + cw + 24}" y="${ty + 30}" dominant-baseline="central">${esc(f.hand1)}</text>`);
  // cost words in the text that are not cost reports
  let mw = ''; let my = 236;
  f.mentions.forEach((m, k) => { const x = 24 + k * 290, w = fxW(m.text, 10.5) + 30;
    mw += `<text x="${x}" y="${my - 10}" font-size="9.5" fill="${FX.soft}">${esc(m.id)}</text><rect x="${x}" y="${my}" width="${w}" height="20" rx="4" fill="#fff" stroke="${FX.soft}"/>` +
      `<text x="${x + 8}" y="${my + 10.5}" font-size="10.5" fill="${FX.ink}" dominant-baseline="central">${esc(m.text)}</text><line x1="${x + 4}" y1="${my + 10}" x2="${x + w - 4}" y2="${my + 10}" stroke="${FX.red}" stroke-width="1.8"/>` +
      `<text class="xm-hand" x="${x + w + 8}" y="${my + 10}" dominant-baseline="central" style="font-size:15px">${esc(m.why)}</text>`; });
  out += fxG(2, mw);
  out += fxG(3, `<text class="xm-stamp f" x="576" y="${ty + 66}" text-anchor="end" style="font-size:16px">cost 0 · FAIL</text>`);
  return stepFig(out, f.caps, f.aria, 268);
}
const FIGS = { breadth: figBreadth, cost: figCost };

// 1-2 parts: the example column is built from small blocks per step (measure/<id>.json units[].steps), so every step shows its own result
const segQ = segs => segs.map(([t, on]) => on ? h('mark', { class: 'pv-m', text: t }) : t);
function blkView(b) {
  if (b.quote) return h('div', { class: 'pv' }, h('span', { class: 'pv-sec' }, h('b', { text: b.quote.sec }), ' · ' + b.quote.id), h('q', { class: 'mw-q' }, ...segQ(b.quote.segs)), b.quote.note ? h('small', { class: 'eb-n', text: b.quote.note }) : null);
  if (b.table) { const t = b.table;
    return h('div', { class: 'eb-tab' }, h('p', { class: 'eb-cap' }, h('b', { text: t.id + ' ' }), ...segQ(t.caption)),
      h('table', {}, h('tr', {}, ...t.cols.map(c => h('th', { text: c })), t.ghost ? h('th', { class: 'eb-ghost', text: t.ghost }) : null),
        ...t.rows.map(r => h('tr', {}, ...r.map(c => h('td', { text: c })), t.ghost ? h('td', { class: 'eb-ghost', text: '✕' }) : null))),
      t.note ? h('small', { class: 'eb-n', text: t.note }) : null); }
  if (b.chips) return h('div', { class: 'eb-chips' }, h('span', { class: 'eb-l', text: b.chips.label }), h('span', { class: 'eb-cs' }, ...b.chips.items.map(c => h('span', { class: 'eb-ch' + (c.no ? ' no' : ''), title: c.why || '' }, h('span', { class: 'eb-ct', text: c.t }), c.why ? h('i', { text: c.why }) : null))));
  if (b.pipe) return h('div', { class: 'eb-pipe' }, h('span', { class: 'eb-l', text: b.pipe.label }), h('span', { class: 'eb-ps' }, ...b.pipe.boxes.flatMap((x, i) => [i ? h('span', { class: 'eb-ar', text: '↓' }) : null, h('span', { class: 'eb-pb' + (x.add ? ' add' : ''), text: x.t })]).filter(Boolean), b.pipe.note ? h('b', { class: 'eb-pn' + (b.pipe.bad ? ' bad' : ''), text: b.pipe.note }) : null));
  if (b.checks) return h('ul', { class: 'eb-chk' }, ...b.checks.map(([t, ok, where]) => h('li', { class: ok ? 'y' : 'n' }, h('span', { class: 'eb-mk', text: ok ? '✓' : '✕' }), h('b', { text: t }), h('small', { text: where }))));
  if (b.count) { const c = b.count;
    return h('div', { class: 'eb-cnt' }, h('table', {}, ...c.rows.map(([l, n, v]) => h('tr', {}, h('td', { text: l }), h('td', { class: 'n', text: n }), h('td', { class: 'v' + (+v ? '' : ' z'), text: v })))),
      h('p', { class: 'eb-tot' }, c.total, ' → ', h('b', { class: 'v-' + (c.verdict === 'PASS' ? 'P' : 'F'), text: c.verdict })), c.hint ? h('small', { class: 'eb-n', text: c.hint }) : null); }
  if (b.line) return h('p', { class: 'eb-line', text: b.line });
  return null;
}
// 4-1: the passage around a framed sentence, so the reader can see what deleting it loses
const cxSegs = (segs, cls) => segs.map(([t, on]) => on ? h('mark', { class: cls, text: t }) : t);
function cxView(u, step) {
  const c = u.ctx, fail = u.final === 'FAIL', cut = t => t.length > 240 ? t.slice(0, 238).replace(/\s+\S*$/, '') + ' …' : t;
  const fact = c.clause ? c.target.segs[0][0] : null, frame = c.clause ? c.target.segs[1][0] : null;
  const tgtSegs = c.clause ? [h('mark', { class: 'cx-e', text: fact }), h('mark', { class: 'cx-f', text: frame })] : cxSegs(c.target.segs, 'cx-f');
  const ctxLine = (b, lab) => h('p', { class: 'cx-c' }, h('span', { class: 'cx-lab', text: lab }), cut(b.text));
  const lost = fail ? 'Nothing is missing. The rest still says it.' : (c.kept && c.kept.length ? 'Missing without it: ' + c.kept.join(', ') : 'Something goes missing without it.');
  if (step === 0) return h('div', {}, h('q', { class: 'mw-q' }, ...(c.clause ? [fact, h('mark', { class: 'cx-f', text: frame })] : tgtSegs)), h('small', { text: `${u.id} · ${u.sec} · red: the part that is checked` }));
  if (step === 1) return c.clause
    ? h('div', { class: 'cx-p' }, h('p', { class: 'cx-t' }, ...tgtSegs), h('small', { text: 'yellow: the result · red: the part that is checked' }))
    : h('div', { class: 'cx-p' }, ...c.before.slice(-1).map(b => ctxLine(b, 'before')), h('p', { class: 'cx-t' }, h('span', { class: 'cx-lab', text: 'this one' }), ...tgtSegs), ...c.after.map(a => ctxLine(a, 'after')));
  if (c.clause) return h('div', { class: 'cx-p' }, h('p', { class: 'cx-t' }, fact, fail ? h('span', { class: 'cx-x', text: frame }) : h('mark', { class: 'cx-f', text: frame })),
    h('small', { class: 'cx-verdict', text: lost }));
  return h('div', { class: 'cx-p' }, ...c.before.slice(-1).map(b => ctxLine(b, 'before')),
    h('p', { class: 'cx-t' }, h('span', { class: 'cx-lab', text: fail ? 'deleted' : 'kept' }), fail ? h('span', { class: 'cx-x', text: c.target.segs.map(x => x[0]).join('') }) : h('span', {}, ...tgtSegs)),
    h('small', { class: 'cx-verdict', text: lost }));
}
// 1-4: the citing sentences of intro and related work as a list; each step marks what it decides
function ciMap(cm) {
  const tag = { related: 'compared / related → set aside', norel: 'needs no relation → set aside' };
  const rows = cm.rows.map((r, i) => h('li', { class: 'ci-r st-' + r.stage, 'data-u': i },
    h('span', { class: 'ci-sec', text: r.sec }),
    h('span', { class: 'ci-s', text: r.short.replace(/\s+\S*$/, '') + '…' }),
    h('span', { class: 'ci-w' }, ...r.names.flatMap((n, j) => j ? [h('i', { class: 'ci-tie', text: '—' }), h('b', { class: 'ci-ch', text: n })] : [h('b', { class: 'ci-ch', text: n })]),
      r.stage !== 'woven' ? h('i', { class: 'ci-no', text: '✕ alone' }) : null,
      tag[r.stage] ? h('i', { class: 'ci-aside', text: tag[r.stage] }) : null),
    h('span', { class: 'ci-st', text: r.final === 'NOT_APPLICABLE' ? '–' : r.final })));
  const cap = h('p', { class: 'xm-cap' });
  const el = h('figure', { class: 'ci' }, h('ol', { class: 'ci-list' }, ...rows), cap);
  const step = k => { el.dataset.s = k; const c = cm.caps[Math.max(0, Math.min(k, cm.caps.length - 1))] || '';
    cap.replaceChildren(h('span', { class: 'xm-n', text: String(Math.max(0, k) + 1) }), h('span', { text: c })); };
  const sel = i => el.querySelectorAll('.ci-r').forEach(n => n.classList.toggle('sel', +n.dataset.u === i));
  return { el, step, sel };
}
function ciView(u, step) {
  const c = u.ci, segs = c.segs.map(([t, on]) => on ? h('mark', { class: 'cx-f', text: t }) : t);
  const chk = (ok, q, note, ev) => h('li', { class: ok ? 'y' : 'n' }, h('span', { class: 'ci-mk', text: ok ? '✓' : '✕' }), h('b', { text: q }), ' ', h('small', { text: note }),
    ev ? h('q', { class: 'ci-ev', text: ev.length > 170 ? ev.slice(0, 168).replace(/\s+\S*$/, '') + ' …' : ev }) : null);
  const stopped = why => h('div', { class: 'cx-p' }, h('small', { class: 'ci-stop', text: why }));
  if (step === 0) return h('div', {}, h('q', { class: 'mw-q' }, ...segs), h('small', { text: `${u.sec} · red: the citations` }));
  if (step === 1) return h('div', { class: 'cx-p' },
    c.before ? h('p', { class: 'cx-c' }, h('span', { class: 'cx-lab', text: c.before_cites ? 'before · cites' : 'before' }), c.before.length > 150 ? c.before.slice(0, 148).replace(/\s+\S*$/, '') + ' …' : c.before) : null,
    h('p', { class: 'cx-t' }, h('span', { class: 'cx-lab', text: 'this one' }), ...segs),
    h('ul', { class: 'ci-chk' }, ...c.weave.map(([q, ok, note]) => chk(ok, q, note))),
    h('small', { class: 'cx-verdict', text: c.stage === 'woven' ? 'Woven → PASS. Steps 3–4 are skipped.' : 'Alone → go on.' }));
  if (step === 2) return c.stage === 'woven' ? stopped('Woven at step 2.') : h('div', { class: 'cx-p' },
    h('ul', { class: 'ci-chk' }, ...c.rel.map(x => chk(x.ok, x.work, x.why, x.ev))),
    h('small', { class: 'cx-verdict', text: c.stage === 'related' ? 'The paper relates it to itself → set aside.' : 'No sentence relates it to this paper → go on.' }));
  if (step === 3) return (c.stage === 'woven' || c.stage === 'related') ? stopped(c.stage === 'woven' ? 'Woven at step 2.' : 'Set aside at step 3.') : h('div', { class: 'cx-p' },
    h('ul', { class: 'ci-chk' }, ...c.na.map(x => chk(x.ok, x.work, x.why))),
    h('small', { class: 'cx-verdict', text: c.stage === 'norel' ? 'Needs no relation → set aside.' : 'A method the reader needs placed → FAIL.' }));
  return null;
}
// 1-2: one tab per part, each a full step panel on its own run data, and the combined score under both
function partsView(it) {
  const m = MEASURE[it.id], parts = it.parts || m.parts.map(id => ({ id, name: id }));
  const panel = h('div', { class: 'pt-panel' }), tabs = h('div', { class: 'pt-tabs', role: 'tablist' });
  const comb = h('p', { class: 'pt-comb' }, h('span', { class: 'rs-wait', text: '…' }));
  const show = k => { tabs.querySelectorAll('button').forEach((b, j) => { b.classList.toggle('on', j === k); b.setAttribute('aria-selected', String(j === k)); }); panel.replaceChildren(measureSteps({ id: parts[k].id, judge: [] })); };
  parts.forEach((p, k) => tabs.append(h('button', { type: 'button', role: 'tab', title: p.what || '', onclick: () => show(k), text: p.name })));
  Promise.all(parts.map(p => fetch('measure/' + p.id + '.json?v=' + MV).then(r => r.json()))).then(([b, d]) => {
    const B = b.meta.breadth, Cs = d.meta.cost, S = (B + Cs) / 2;
    comb.replaceChildren(h('span', { class: 'pt-cl', text: `${b.meta.side} ${b.meta.paper} · ${it.name || 'combined'}` }),
      'evaluation breadth ', h('b', { text: B.toFixed(1) }), ' + cost reporting ', h('b', { text: String(Cs) }), ' → (', B.toFixed(1), ' + ', String(Cs), ') ÷ 2 = ', h('b', { class: 'big', text: S.toFixed(1) }), ' / 100 · slop score 1 − ', S.toFixed(1), '/100 = ', h('b', { class: 'v-F', text: (1 - S / 100).toFixed(2) }));
  }).catch(() => comb.replaceChildren('run data not loaded'));
  show(0);
  return h('div', { class: 'pt' }, h('p', { class: 'rs-line', text: m.line }), tabs, panel, comb);
}
function measureSteps(it) {
  // every step of the measurer, all of its rules, and what that step returned on one real paper
  const m = MEASURE[it.id];
  if (m && m.parts) return partsView(BY_ID[it.id] || it);
  if (!m) return h('ol', { class: 'rs' }, ...(it.judge || []).map((t, k) => h('li', { class: 'rs-row' }, h('div', { class: 'rs-n' }, h('b', { text: String(k + 1) })), h('div', { class: 'rs-do' }, h('p', { text: t })))));
  const plain = !!m.plain;
  const whoTag = w => (plain || w === 'paper') ? null : h('span', { class: 'rs-who ' + (w === 'code' ? 'rule' : 'model'), text: w === 'code' ? 'rule' : w.includes('code') ? 'model + rule' : 'model' });
  const ex = m.stages.map(() => h('div', { class: 'rs-ex' }, h('span', { class: 'rs-wait', text: '…' })));
  const rows = m.stages.map(([title, sub, w], k) => h('li', { class: 'rs-row' + (k === m.stages.length - 1 ? ' last' : '') },
    h('div', { class: 'rs-n' }, h('b', { text: String(k + 1) }), h('div', {}, h('p', { class: 'rs-t', text: title }), sub ? h('p', { class: 'rs-q', text: sub }) : null, whoTag(w))),
    h('div', { class: 'rs-do' + (plain ? ' plain' : '') }, ...(m.how[k] ? [m.how[k][0] ? h('p', { class: 'rs-ht', text: m.how[k][0] }) : null, plain ? h('div', {}, ...m.how[k][1].map(([, tt]) => h('p', { text: tt }))) : h('ul', {}, ...m.how[k][1].map(([ww, tt]) => h('li', {}, h('span', { class: 'rs-who sm ' + (ww === 'code' ? 'rule' : 'model'), text: ww === 'code' ? 'rule' : 'model' }), tt)))] : [])),
    ex[k]));
  const pick = h('select', { class: 'rs-pick', 'aria-label': 'Which unit the example column follows' });
  const head = h('div', { class: 'rs-head' }, h('span', { class: 'rs-hl', text: 'Step' }), h('span', { class: 'rs-hl', text: 'Procedure' }), h('span', { class: 'rs-hl' }, 'Example: ', pick));
  const score = h('p', { class: 'mw-score' + (m.plain ? ' small' : '') });
  // a player: the steps run one after another on the chosen unit, each example appears when its step is reached
  const play = h('button', { type: 'button', class: 'rs-play', text: '▶ Play' });
  const box = h('div', { class: 'rs-wrap' }, h('div', { class: 'rs-top' }, h('p', { class: 'rs-line', text: m.line }), play), head, h('ol', { class: 'rs' }, ...rows), score);
  const seq = { s: -1, t: 0 };
  let XM = null;
  const setStep = k => { seq.s = k; if (XM) XM.step(k); rows.forEach((r, j) => { r.classList.toggle('done', j < k); r.classList.toggle('cur', j === k); r.classList.toggle('todo', j > k); });
    score.classList.toggle('shown', k >= rows.length - 1); };
  const stop = () => { clearTimeout(seq.t); seq.t = 0; play.textContent = '↻ Replay'; };
  const run = () => { clearTimeout(seq.t); play.textContent = '❚❚ Playing'; setStep(-1);
    const next = k => { setStep(k); if (k < rows.length - 1) seq.t = setTimeout(() => next(k + 1), reduce ? 0 : 2300); else stop(); };
    seq.t = setTimeout(() => next(0), 350); };
  play.addEventListener('click', () => seq.t ? stop() : run());
  rows.forEach((r, k) => r.addEventListener('click', () => { stop(); setStep(k); }));
  setStep(rows.length - 1);
  const seen = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { seen.disconnect(); run(); } }, { threshold: .25 });
  requestAnimationFrame(() => seen.observe(box));
  fetch('measure/' + it.id + '.json?v=' + MV).then(r => r.json()).then(data => {
    const U = data.units, pre = data.meta.pre || {};
    if (data.map || data.fig) { XM = data.map ? xmap(data.map) : FIGS[data.fig.kind](data.fig); box.insertBefore(XM.el, head); XM.step(seq.s < 0 ? rows.length - 1 : seq.s); }
    if (data.cimap) { XM = ciMap(data.cimap); box.insertBefore(XM.el, head); XM.step(seq.s < 0 ? rows.length - 1 : seq.s); }
    if (!U.length) { ex.forEach(e => e.replaceChildren(h('span', { class: 'rs-wait', text: 'no units in this paper' }))); return; }
    const VW = { FAIL: 'slop', PASS: 'fine', UNRESOLVED: 'open', NOT_APPLICABLE: 'n/a' };
    pick.replaceChildren(...U.map((u, k) => h('option', { value: k, text: `${VW[u.final]} · ${u.text.slice(0, 48)}…` })));
    const sh = t => t.length > 140 ? t.slice(0, 138).replace(/\s+\S*$/, '') + '…' : t;
    const fill = k => { const u = U[k]; const vals = u.steps ? u.steps.map(bs => h('div', { class: 'eb' }, ...bs.map(blkView))) : u.ctx ? [cxView(u, 0), cxView(u, 1), cxView(u, 2), null] : u.ci ? [ciView(u, 0), ciView(u, 1), ciView(u, 2), ciView(u, 3), null] : [
      u.pair ? pairQ(u.pair.later, 'later') : u.segs ? h('div', { class: 'pv' }, h('span', { class: 'pv-sec' }, h('b', { text: u.sec }), ' · ' + u.id), h('q', { class: 'mw-q' }, ...u.segs.map(([t, on]) => on ? h('mark', { class: 'pv-m', text: t }) : t))) : h('div', {}, h('q', { class: 'mw-q', text: sh(u.text) }), h('small', { text: [u.id, u.sec].filter(Boolean).join(' · ') })),
      u.pair ? pairQ(u.pair.earlier, 'earlier') : h('div', {}, h('span', { text: u.s2 || '—' })),
      h('div', {}, u.found.length ? h('span', { class: 'mw-ids' }, ...u.found.map(x => h('code', { text: x }))) : h('span', { class: 'mw-none', text: 'nothing' }), u.found_note ? h('small', { text: tidyNote(u.found_note) }) : null, u.judge_line ? h('small', { text: tidyNote(u.judge_line) }) : null),
      h('div', {}, h('span', { class: 'mw-runs' }, ...u.runs.map(r => h('span', { class: 'mw-r v-' + VK(r), text: VLAB[r] })), h('span', { class: 'mw-to', text: '→' }), h('b', { class: 'mw-final v-' + VK(u.final), text: VLAB[u.final] })), u.final_reason ? h('small', { text: tidyNote(u.final_reason) }) : null)];
      if (u.ctx || u.ci) vals[u.ci ? 4 : 3] = h('div', {}, h('span', { class: 'mw-runs' }, ...u.runs.map(r => h('span', { class: 'mw-r v-' + VK(r), text: VLAB[r] })), h('span', { class: 'mw-to', text: '→' }), h('b', { class: 'mw-final v-' + VK(u.final), text: VLAB[u.final] })), u.final_reason ? h('small', { text: tidyNote(u.final_reason) }) : null);
      ex.forEach((e, j) => e.replaceChildren(vals[j] || h('span', { text: '—' }))); if (XM && (data.cimap || (data.map && data.map.units[k]))) XM.sel(k); };
    pick.addEventListener('change', () => { fill(+pick.value); run(); });
    const kd = data.meta.default ? U.findIndex(u => u.id === data.meta.default) : -1;
    const k0 = kd >= 0 ? kd : Math.max(0, U.findIndex(u => u.final === 'FAIL')); pick.value = k0; fill(k0);
    const c = { FAIL: 0, PASS: 0, UNRESOLVED: 0 }; U.forEach(u => { if (u.final in c) c[u.final]++; });
    const F = c.FAIL + (pre.FAIL || 0), P = c.PASS + (pre.PASS || 0), UU = c.UNRESOLVED + (pre.UNRESOLVED || 0), D = F + P;
    if (m.breadth) { breadthLine(data, score); return; }
    if (m.cost) { score.replaceChildren(`${data.meta.side} ${data.meta.paper} · cost score = `, h('b', { class: 'big', text: String(data.meta.cost) }), ' / 100 → ', h('b', { class: 'v-F', text: data.meta.cost ? 'PASS' : 'FAIL' })); return; }
    if (data.meta.score_den) { const N = data.meta.score_den; score.replaceChildren(`${data.meta.side} ${data.meta.paper} · ${N} ${m.units} · score = FAIL ÷ ${m.units} = `, h('b', { text: `${F} ÷ ${N}` }), ' = ', h('b', { class: 'big', text: (F / N).toFixed(2) }), data.meta.hu_score != null ? `  ·  its human pair: ${data.meta.hu_score.toFixed(2)}` : ''); return; }
    if (m.plain) { score.replaceChildren(`Score = FAIL / (FAIL + PASS). ${data.meta.side} ${data.meta.paper}: ${F} / ${D} = ${D ? (F / D).toFixed(2) : '—'}` + (UU ? `, ${UU} U not counted.` : '.')); return; }
    score.replaceChildren(`${data.meta.side} ${data.meta.paper} · ${U.length} ${m.units} · score = FAIL ÷ (FAIL + PASS) = `, h('b', { text: `${F} ÷ ${D}` }), ' = ', h('b', { class: 'big', text: D ? (F / D).toFixed(2) : '—' }), UU ? ` · ${UU} U, not counted` : '');
  }).catch(() => ex.forEach(e => e.replaceChildren(h('span', { class: 'rs-wait', text: 'run data not loaded' }))));
  return box;
}
function regShow(id) {
  // a field-guide entry: name and definition, the real sentence marked in pen, then three short columns
  if (!BY_ID[id]) return; rgCur = id; const it = BY_ID[id], ex = it.ex, t = tally(id), mine = hub.mine[id] || 0;
  document.querySelectorAll('.rg-i').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  const i = RG_ORDER.findIndex(x => x.id === id), from = (typeof V1OF !== 'undefined' && V1OF[id]) ? 'from v1 ' + V1OF[id] : 'new in v1.1';
  const col = (title, arr) => h('div', { class: 're-c' }, h('h4', { text: title }), h('ul', {}, ...(arr || []).slice(0, 2).map(x => h('li', { text: x }))));
  const howDet = h('details', { class: 're-how' }, h('summary', { text: 'How the index checks it' }));
  howDet.addEventListener('toggle', () => { if (howDet.open && !howDet.dataset.done && MEASURE[id]) { howDet.dataset.done = 1; howDet.append(measurePanel(it)); } }, { once: false });
  const nav = h('div', { class: 're-nav' }, h('button', { type: 'button', 'aria-label': 'Previous slop', text: '←', onclick: () => rgStep(-1) }), h('span', { text: `${String(i + 1).padStart(2, '0')} / 17` }), h('button', { type: 'button', 'aria-label': 'Next slop', text: '→', onclick: () => rgStep(1) }));
  $('#rg-entry').className = 'rg-page ' + it.ar.cls;
  $('#rg-entry').replaceChildren(h('div', { class: 're' },
    h('header', { class: 're-h' }, h('div', {}, h('p', { class: 're-k', text: `${it.ar.title} · ${from}` }), h('h3', { class: 're-n', text: it.name })), nav),
    h('p', { class: 're-d', text: it.what }),
    h('figure', { class: 're-ex' },
      h('figcaption', { class: 're-src', text: (ex.src || ex.sec || '') + (ex.made ? ' · constructed example' : '') }),
      h('p', { class: 're-t' }, ex.pre || '', h('mark', { text: ex.mark }), ex.post || ''),
      h('p', { class: 're-note', text: ex.note })),
    h('section', { class: 're-m' }, h('h4', { class: 're-mh', text: 'How we measure it' }), measureSteps(it)),
    h('div', { class: 're-cols two' }, col('Not slop if', it.not), col('Fixed when', it.fix)),
    h('div', { class: 're-act' },
      h('button', { type: 'button', class: 're-v' + (mine === 1 ? ' on' : ''), disabled: !hub.canWrite, onclick: () => { vote(id, 1); setTimeout(() => regShow(id), 50); } }, (mine === 1 ? '✓ ' : '') + 'I ran into this', h('b', { text: String(t.up) })),
      h('button', { type: 'button', class: 're-l', onclick: e => { const b = e.currentTarget; try { navigator.clipboard.writeText(PROMPTS[id]).then(() => { b.textContent = 'Fix prompt copied'; }); } catch (_) { /* ignore */ } } , text: 'Copy fix prompt' }),
      h('button', { type: 'button', class: 're-l', onclick: () => tagAs(id), text: 'Add a case' }))));
}
const rgStep = d => { const i = RG_ORDER.findIndex(x => x.id === rgCur); regShow(RG_ORDER[(i + d + 17) % 17].id); };
$('#rg-prev').addEventListener('click', () => rgStep(-1)); $('#rg-next').addEventListener('click', () => rgStep(1));
regShow(rgCur);
cloneReveal(); buildMini(); select(st.sel); drawTree(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawTree);
addEventListener('resize', fitPage);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPage);
openHash();
hubInit();




// ------------------------------------------------------------------ a small index in the margin: where you are on the page
(function sideIndex() {
  const nav = $('#sidx'), links = [...nav.querySelectorAll('a')], secs = links.map(a => document.getElementById(a.dataset.s));
  function place() {
    const y = innerHeight * .4; let cur = 0;
    secs.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= y) cur = i; });
    links.forEach((a, i) => { a.classList.toggle('on', i === cur); a.classList.toggle('done', i < cur); });
    // a hairline under the bar fills with how far down the page you are
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#sidx-fill').style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0})`;
  }
  links.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); scrollTo({ top: i ? secs[i].getBoundingClientRect().top + scrollY - 44 : 0, behavior: reduce ? 'auto' : 'smooth' }); }));
  let q = 0; addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(() => { q = 0; place(); }); }, { passive: true }); place();
})();
