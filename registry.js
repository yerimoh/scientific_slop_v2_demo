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
  '1-2': () => row([E.card('tested', inner.chip('2 tasks: VT, MQ', C.arg, { outline: true })), E.miss(C.arg, { solid: true }), E.chip('all diffuse tasks', C.arg)]),
  '1-3': () => row([E.card('§4 Results', inner.text(['20 poisoned demos', 'ASR 18%']), { lines: false }), E.miss(C.arg), E.ask(['one demonstration?', 'one target action?'])]),
  '1-4': () => { const cw = tw('SparseVLM', FS - .3) + 6, ow = tw('ours', FS, true) + 8, gap = 22, total = cw + gap + ow, x0 = 50 - total / 2, xo = x0 + cw + gap;
    return K.chip(x0, MID - 10.5, 'FEATHER', { fs: FS - .3, ec: C.arg, lw: .9, w: cw, h: 8 }) + K.chip(x0, MID - 1, 'SparseVLM', { fs: FS - .3, ec: C.arg, lw: .9, w: cw, h: 8 }) + K.text(x0 + cw / 2, MID + 10.3, '+ 6 more, listed', { fs: FS - .8, color: C.muted, anchor: 'middle' }) +
      K.chip(xo, MID - 6.25, 'ours', { fc: C.arg, ec: C.arg, tc: '#fff', bold: true, w: ow, h: 9.5 }) +
      K.arrow([x0 + cw, MID - 6.5], [xo - .5, MID - 3], { color: C.arg, dashed: true, rad: -.1 }) + K.arrow([x0 + cw, MID + 3], [xo - .5, MID], { color: C.arg, dashed: true, rad: .1 }) + K.cross(x0 + cw + gap / 2, MID - 5.5) + K.cross(x0 + cw + gap / 2, MID + 2.5); },
  '2-1': () => row([E.card('Abstract', inner.chip('46% · 93% kept', C.struct, { outline: true })), E.miss(C.struct, { left: true }), E.card('§4 Results', inner.chip('MQ: 12.1 → 3.65', C.struct))]),
  '2-3': () => row([E.card('§3 Method', inner.lines(3)), E.miss(C.struct, { left: true }), E.card('Table 3', inner.chip('Phase-0 analysis', C.struct))]),
  '3-1': () => row([E.chip('layer 12 of 32', C.art), E.miss(C.art), E.ask(['why 12?'])]),
  '4-1': () => row([E.para('§1 Introduction', 'this holds exciting promise …', C.struct)]),
  '4-2': () => row([E.chip('retrieval rate', C.art), E.miss(C.art), E.ask(['= ?'])]),
  '4-3': () => row([E.para('§4.1 Data', 'folder layout · renamed files · scratch dirs', C.struct, { box: true })]),
  '4-4': () => row([E.card('§3 · Method', inner.chip('destroys saliency', C.struct)), E.eq(), E.card('§4 · Experiments', inner.chip('destroys saliency', C.struct))]),
  '4-5': () => row([E.card('Figure 1', inner.bars(), { lines: false }), E.miss(C.art), E.ask(['L8 in the text?'])]),
  '5-1': () => row([E.chip('limits deployment flexibility', C.arg), E.miss(C.arg), E.ask(['where', 'does it fail?'])]),
  '5-2': () => row([E.chip('H2O prunes high-attn tokens', C.arg), E.clash(), E.card('H2O in §2', inner.text(['keeps them', 'same paper'], { bold0: true, mute1: true }), { lines: false })]),
  '5-3': () => row([E.card('Table 4', inner.text(['AUROC 1.0 → 1.0', 'ASR 40.7 → 42.4']), { lines: false }), E.miss(C.arg), E.say('a fundamental trade-off', C.arg)]),
  '5-4': () => row([E.chip('0.3, "typically considered"', C.arg), E.miss(C.arg), E.ask(['by whom?', '[ ? ]'])]),
};
// what the pattern looks like, one line under each scene
const CAP = { '1-1': 'a claim with nothing behind it', '1-2': 'claim wider than its evidence', '1-3': 'numbers only, no example', '1-4': 'cited, related to nothing', '2-1': 'the bad news never reaches the front', '2-3': 'a name that points at nothing', '3-1': 'a choice with no reason', '4-1': 'delete it and nothing is lost', '4-2': 'a term with no meaning', '4-3': 'detail the reader never needs', '4-4': 'the same sentence, another section', '4-5': 'a result only the figure reports', '5-1': 'important, but never shown', '5-2': 'the contrast is not true', '5-3': 'nothing moved, yet it explains', '5-4': 'a source that is not there' };
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
  { id: '1-2', area: 1, v1: 'Argument graph', name: 'Overstated Claims', what: 'Support exists, but the claim reaches past it in scope, strength, or certainty.',
    ex: { spec: 'Our method consistently outperforms baselines across domains', specnote: 'Gains appear only in the few-shot setting on CIFAR-10. One dataset, one condition.', src: 'AI paper · SciSlopBench FA0002 · §1 Introduction', pre: 'Task-dependent analysis: ', mark: 'Diffuse-dependency tasks (Variable Tracking) benefit substantially from adaptive sizing, while distributed-information tasks (Multi-Query NIAH) require higher budgets', post: ', revealing a structural limit on cache reduction.', note: 'Two tasks were run, one per “class”. The classes are never defined, and no other task in either class is tested.' },
    judge: ['Compare claim and support on four axes: scope, conditions, effect and direction, certainty.', 'Observed, statistical, or causal are three different claims.', 'A strong adjective by itself decides nothing.'],
    not: ['Scope clear from context.', 'A generalization stated as a hypothesis after the verified range.'],
    fix: ['State the evaluated range and the uncertainty.', 'Not a fix: deleting “significantly” while keeping “across domains”.'],
    borders: [['1-1', 'no support at all'], ['5-3', 'observation turned into mechanism'], ['5-4', 'evidence described wrongly']] },
  { id: '1-3', area: 1, name: 'Missing Examples', v1: 'Evidence gap', what: 'The reader needs a concrete case to see what a claim means, and none is shown.',
    ex: { spec: 'meaning reversals', specnote: 'Definitions and counts only. No input, reference, or output is ever shown.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments', pre: '', mark: 'We inject 20 poisoned demonstrations into the StrategyQA knowledge base', post: ' (9,251 entries total).', note: 'No poisoned demonstration, trigger context or target action is ever shown. The reader cannot tell what the attack makes the agent do.' },
    judge: ['Which claims or phenomena need an example?', 'Is a real input and output, an observed case, or a visualization given for it?', 'Relevance counts, not the number of examples.'],
    not: ['Checkable from definitions, proofs, or numbers alone.', 'Examples in the appendix or the supplement.'],
    fix: ['Show real cases from the study.', 'Not a fix: invented examples presented as observations.'],
    borders: [['1-1', 'missing examples is not missing all evidence']] },
  { id: '1-4', area: 1, name: 'Unclear Links to Prior Work', v1: 'Citation isolation', what: 'Prior work is cited, but how it relates to this study is never said.',
    ex: { spec: 'We propose C.', specnote: 'Does C follow A or B? Which limitation does it address? What differs? Not said.', src: 'AI paper · SciSlopBench FA0280 · §2 Related Work', pre: 'SparseVLM introduces text-aware sparsification that conditions token selection on the input query, and ', mark: 'FEATHER revisits pruning strategies with improved layer selection.', post: '', note: 'The paragraph lists eight pruning methods and never says how this paper relates to any of them. FEATHER also picks layers, which is this paper’s whole idea.' },
    judge: ['Does the citing passage explain the role of that work?', 'Relations among prior works are logged apart from relations to this study.', 'Judge when a relation needed to place the study is missing.'],
    not: ['Citations for background facts or standard tools.', 'The relation explained in another paragraph.'],
    fix: ['Explain the actual difference, inheritance, or limitation.', 'Not a fix: adding “Unlike prior work”; deleting citations.'],
    borders: [['5-2', 'a difference is stated but does not hold']] },

  { id: '2-1', area: 2, name: 'Buried Findings', what: 'The body’s key finding never reaches the Abstract or Introduction.',
    ex: { spec: 'a novel attention mechanism that improves performance', specnote: '§4.2 shows the gain comes almost entirely from sentences with negation. The front matter never says so.', src: 'AI paper · SciSlopBench FA0002 · §4 Experiments', pre: 'On Multi-Query, ', mark: 'we achieve 70% reduction but with larger accuracy loss (3.65% vs. 12.10%)', post: ', indicating that distributed-information tasks inherently require higher cache coverage.', note: 'The abstract reports only the favorable task (46% cache reduction, 93% of accuracy kept). The accuracy collapse on the other task never reaches it.' },
    judge: ['Pick the key findings from the research question and the main results.', 'Is the finding’s meaning and its condition conveyed, not just a number?'],
    not: ['Detailed numbers or side analyses left to the body.', 'An accurate summary at a higher level.'],
    fix: ['Bring the finding and its condition to the front.', 'Not a fix: adding one number; turning an association into a mechanism.'],
    borders: [['1-2', 'the omission lets the claim exceed its support']] },
  { id: '2-3', area: 2, name: 'Missing Cross-Section Links', v1: 'Cross-section references', what: 'One section needs a definition or result from another, and the reader cannot match them.',
    ex: { spec: 'w/o regularization 68.0', specnote: '§3 defines two losses, L_a and L_b. Which one was removed? The text never says.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: 'Table 3 presents diagnostic metrics from our ', mark: 'Phase-0 analysis', post: ' on 30 COCO images with 5 prompt templates (150 forward passes).', note: '“Phase-0” is named nowhere else. Nothing in the method section corresponds to it.' },
    judge: ['Find the spots that depend on information elsewhere.', 'Can the reader confirm the correspondence? Consistent naming counts as a link.'],
    not: ['A figure or table that works in place.', 'A clear correspondence without a numbered reference.'],
    fix: ['Name the actual counterpart.', 'Not a fix: extra references to unrelated tables.'],
    borders: [] },

  { id: '3-1', area: 3, name: 'Unexplained Design Choices', what: 'A choice that affects validity is made, and no reason is given.',
    ex: { spec: 'Inputs longer than 512 tokens are excluded.', specnote: 'The method is sold for long inputs. Why exclude them, and what does that do to the evaluation?', src: 'AI paper · SciSlopBench FA0280 · §3 Method', pre: 'Our approach is straightforward: ', mark: 'extract attention weights from layer 12 (out of 32 LLM layers in InternVL2.5-8B)', post: ' and apply MIS selection directly without any debiasing.', note: 'Why layer 12 is never said, and no comparison across layers appears in the text. The overview figure shows an L8 bar that beats L12 and is reported nowhere.' },
    judge: ['Prioritize choices that affect the conclusion: architecture, data, comparisons, metrics.', 'Does the stated reason connect to this choice? “For efficiency” alone does not.', 'Keep apart: value unknown (reproducibility) and reason unknown (this item).'],
    not: ['A standard setting with a source.', 'Minor settings that do not touch the core claims.'],
    fix: ['Give the real rationale, constraint, or comparison.', 'Not a fix: inventing alternatives that were never run.'],
    borders: [['5-1', 'the problem itself is unmotivated']] },

  { id: '4-1', area: 4, name: 'Generic Filler', what: 'Stock prose that says nothing about this study and does no work.',
    ex: { spec: 'Our innovative framework unlocks new possibilities and addresses important challenges.', specnote: 'Delete it and nothing is lost. Which possibilities? Which challenges? Never specified.', src: 'Human paper · LoLCATs, arXiv 2410.10254 · §1 Introduction', pre: '', mark: 'This holds exciting promise for quickly scaling up subquadratic capabilities.', post: '', note: 'The two sentences before it already say what the promise is. Delete this one and nothing is lost.' },
    judge: ['What information or function is lost if the sentence goes?', '“Could be pasted into any paper” finds candidates; it is not the verdict.'],
    not: ['Needed background or standard definitions.', 'A short pointer to what comes next.'],
    fix: ['Delete it, or replace it with the study’s content.', 'Not a fix: inserting model and dataset names.'],
    borders: [['5-1', 'importance stands in for motivation'], ['4-4', 'repeated rather than empty']] },
  { id: '4-2', area: 4, name: 'Undefined Terms', what: 'A term the reader needs is never given a meaning.',
    ex: { spec: 'semantic anchoring', specnote: 'No definition, equation, citation, or example says what semantic anchoring does.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments', pre: 'This occurs because LLaMA-3.1-8B-Instruct has a ', mark: 'low retrieval rate (<14%)', post: ', limiting the effectiveness of consensus-based validation.', note: '“Retrieval rate” explains the paper’s main negative result. It is never defined, and no table reports it.' },
    judge: ['Fix the intended reader and field.', 'Can the meaning be recovered from context, equations, or a cited definition?', 'Several names for one thing is a naming inconsistency, logged separately.'],
    not: ['Standard terms in their usual sense.', 'Meaning clear from an equation.'],
    fix: ['Explain the operation, object, or role.', 'Not a fix: expanding an acronym; swapping in another abstract word.'] },
  { id: '4-3', area: 4, name: 'Irrelevant Detail', what: 'Detail that helps no one understand, check, or reproduce the study.',
    ex: { made: true, src: 'Constructed example · no instance in the three verified pairs', sec: '§4.1 Data', pre: 'After tokenization, ', mark: 'we reorganized the working directory, renamed intermediate files by date, and merged two scratch folders', post: ' before training.', note: 'None of this affects a result. It buries the preprocessing steps that do.' },
    judge: ['Would removing it lose anything needed to understand, check, or reproduce?', 'Keep needed method and data detail even when it is off the core contribution.', 'Section-length balance decides nothing.'],
    not: ['Preprocessing and collection details needed to reproduce.', 'Information about failure conditions.'],
    fix: ['Remove content with no role; keep what reproduction needs.', 'Not a fix: cutting reproduction detail to shorten.'],
    borders: [['4-4', 'the same content again'], ['4-1', 'empty rather than extra']] },
  { id: '4-4', area: 4, name: 'Redundant Repetition', v1: 'Macro redundancy', what: 'Content is said again with no new information and no summary role.',
    ex: { spec: 'As Table 2 shows, our model beats all baselines on both datasets.', specnote: '§1 Introduction already says this in almost the same words. §4 adds nothing.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: '', mark: 'These results demonstrate that the ratio formula does not remove positional bias---it destroys useful saliency signal.', post: '', note: 'The method section already states this conclusion with its numbers. The experiments section repeats it in the same words and drops the numbers.' },
    judge: ['Find the closest earlier sentence in another section, abstract included.', 'A near-copy counts: 8-word runs cover half the sentence, or cosine ≥ 0.90.', 'One repeat makes the section slop.'],
    not: ['The abstract and the conclusion (not scored).', 'The same point in new words with new content.'],
    fix: ['Cut it, or put the missing analysis there.', 'Not a fix: paraphrase.'],
    borders: [['4-1', 'empty regardless of repetition'], ['4-3', 'extra detail']] },
  { id: '4-5', area: 4, name: 'Unclear Figures', v1: 'Figure exposition', what: 'A figure’s parts and relations cannot be read from the figure, its caption, or the text.',
    ex: { spec: 'Overview of the proposed framework.', specnote: 'Which arrows carry data and which carry gradients? What do the colors mean? Nothing says.', src: 'AI paper · SciSlopBench FA0280 · Figure 1, text inside the figure', pre: 'Key Insight: Deeper Layers = Better Token Selection · ', mark: 'L2 55% · L4 39% · L8 69% · L12 66%', post: '', note: 'The L8 result appears in no table or sentence, and it is higher than the layer the paper chose. The L2 bar is D²Pruner with debiasing, not raw L2.' },
    judge: ['Fix the figure’s purpose first.', 'Can the needed elements, symbols, axes, and flows be read from the figure plus its explanation?', 'Decoration count and caption length decide nothing.'],
    not: ['A short caption whose meaning is clear from the legend and text.', 'A simplified overview whose detail is clearly located.'],
    fix: ['Explain the notation and tie it to the method.', 'Not a fix: a longer caption; deleting the figure.'] },

  { id: '5-1', area: 5, v1: 'Argument graph', name: 'Unexplained Importance', link: ['a concrete problem or gap', 'why it is worth studying'], what: 'Something is called important, but which problem, and why it matters, is never said.',
    ex: { spec: 'Existing models face important challenges. Addressing these challenges is essential for future progress.', specnote: 'Which challenge? What fails, for whom? The rest of the paper gives only the architecture and the scores.', src: 'AI paper · SciSlopBench FA0280 · §1 Introduction', pre: 'However, this offline calibration requirement limits deployment flexibility: ', mark: 'the prior may not transfer across domains, prompt styles, or model updates.', post: '', note: 'This is the whole motivation for the paper’s second contribution. The transfer failure is never shown, on any domain or prompt.' },
    judge: ['Map: the thing called important → its concrete problem → the reason to study it.', 'A theoretical question counts as a reason; practical cost is not required.', '“Crucial” and “pivotal” decide nothing.'],
    not: ['A brief recall of a known problem, then a concrete question.', 'Motivation given by the body or the cited literature.'],
    fix: ['Say which question or constraint is addressed and why it matters.', 'If motivation already exists, just delete the stock line.', 'Not a fix: swapping adjectives; inventing numbers.'],
    borders: [['4-1', 'motivation exists elsewhere, the line is just empty'], ['3-1', 'the problem is clear, a design choice is not'], ['5-3', 'importance inferred from results']] },
  { id: '5-2', area: 5, v1: 'Argument graph', name: 'Unsupported Comparisons', link: ['what the compared method actually does', 'the difference claimed'], what: 'A difference from other methods is claimed, and the target is unclear or the difference is not true.',
    ex: { spec: 'Unlike baselines A and B, which assign fixed weights to all inputs,', specnote: 'The paper’s own equations for A and B compute weights from the input too. The contrast does not hold.', src: 'AI paper · SciSlopBench FA0002 · §1 Introduction', pre: 'This is fundamentally different from attention-based methods like H2O, ', mark: 'which prune high-attention tokens', post: '; we prune tokens with low approximation error.', note: 'The paper’s own related work says H2O keeps the high-attention tokens and drops the rest. The contrast is with a method that does not exist.' },
    judge: ['Log the target, the compared property, and the claimed property; check each.', 'A structural difference is checked in the equations; a performance difference needs an evaluation.', 'The target may be named by citation, name, definition, or context.'],
    not: ['A structural difference confirmed by the equations.', 'A contrast with a standard setting that is clear from context.'],
    fix: ['Name the target and the property precisely, or withdraw the distinction and align the Abstract and conclusion.', 'Not a fix: deleting “unlike”; attaching unrelated citations.'],
    borders: [['1-4', 'the relation is never explained'], ['1-2', 'the difference holds but is inflated']] },
  { id: '5-3', area: 5, v1: 'Argument graph', name: 'Unsupported Interpretations', link: ['the observed result', 'what it is said to mean'], what: 'A result is given a meaning, a cause or a mechanism, that nothing in the paper supports.',
    ex: { spec: 'demonstrating that the model learns to align semantic structure across languages.', specnote: 'The table shows +1.8. Nothing checks alignment or rules out other causes.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments', pre: 'LDA detection remains perfect (AUROC=1.0) against the adaptive attack, while the attack’s effectiveness is unchanged (ASR 40.68% → 42.37%). ', mark: 'This robustness stems from a fundamental trade-off: reducing the uniqueness weight makes triggers less detectable but also reduces their retrieval effectiveness.', post: '', note: 'The sentence before it says neither side moved: detection stayed perfect and the attack stayed as effective. The trade-off is asserted against the paper’s own table.' },
    judge: ['Separate the observation from the added interpretation.', 'What assumption or evidence does the step need, and is it anywhere in the paper?', 'Not measured directly is not a defect; sound inference is accepted.', 'Same standard for captions and conclusions.'],
    not: ['A summary within the observed range.', 'A mechanism backed by another analysis.', 'A possibility marked as unverified.'],
    fix: ['Limit the interpretation to what the results allow, or supply the support.', 'If it is withdrawn, fix the Abstract and Conclusion too.', 'Not a fix: “demonstrating” → “suggesting” with the same conclusion.'],
    borders: [['1-2', 'same property, inflated'], ['1-1', 'no link to results at all']] },
  { id: '5-4', area: 5, v1: 'Argument graph', name: 'Misrepresented Evidence', link: ['the evidence as described', 'the actual source or experiments'], what: 'The paper says evidence exists, and the evidence does not say that.',
    ex: { spec: 'Prior studies established that update rule A converges under adaptive step sizes [12].', specnote: 'The theorem in [12] covers fixed step sizes only. Nothing extends it.', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments', pre: 'All values are well below ', mark: 'the 0.3 threshold typically considered indicative of meaningful positional bias.', post: '', note: 'No source for the threshold, and none for who considers it. The paper’s central diagnostic rests on it.' },
    judge: ['Check four things against the material: existence, content, scope, consensus.', '“Extensive”, “numerous”, and citation counts are not the criterion.', 'Source unreachable means undecidable, not a defect.'],
    not: ['A citation that describes its source and conditions accurately.', 'A single survey backing a consensus statement.'],
    fix: ['Describe what the support actually shows.', 'If a support statement goes, recheck the remaining claim.', 'Not a fix: more citations; deleting “extensive”.'],
    borders: [['1-1', 'no support is claimed at all'], ['1-2', 'range reported right, then generalized'], ['5-2', 'a misdescribed comparison target']] },
];
// Definitions tab text, 1013: one plain definition, one or two real sentences (the second shows where the support should be), two-sentence note.
const DEF = {
  '1-1': { what: 'The paper states a result and never shows the experiment, proof, or source behind it.',
    q: [{ pre: '', mark: 'This achieves near-high-k robustness at near-low-k average cost.', post: '', src: 'AI paper · SciSlopBench FA0083 · §3 Method' }],
    note: '“Cost” promises a measurement: latency, compute, or memory. No table or figure in the paper measures any of them, so the sentence is the only evidence for itself.' },
  '1-2': { what: 'The paper has evidence for a small claim and makes a bigger one.',
    q: [{ pre: 'We focus on ', mark: 'two tasks', post: ' that stress recall.', src: 'AI paper · SciSlopBench FA0002 · §4 Experiments' },
        { pre: 'Task-dependent analysis: ', mark: 'Diffuse-dependency tasks (Variable Tracking) benefit substantially from adaptive sizing, while distributed-information tasks (Multi-Query NIAH) require higher budgets', post: ', revealing a structural limit on cache reduction.', src: 'Same paper · §1 Introduction' }],
    note: 'Two tasks were run, one of each kind. From one task each, the introduction states a rule for whole classes of tasks, and never says what else belongs to a class.' },
  '1-3': { what: 'The paper describes something it did and never shows one actual case of it.',
    q: [{ pre: 'We inject ', mark: '20 poisoned demonstrations', post: ' into the StrategyQA knowledge base (9,251 entries total).', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments' }],
    note: 'The whole attack is these demonstrations: what one looks like, which query triggers it, what the agent then does. None of the three is shown anywhere, so the reader never sees what the attack is.' },
  '1-4': { what: 'The paper cites related work and never says how its own work differs from it.',
    q: [{ pre: 'SparseVLM introduces text-aware sparsification that conditions token selection on the input query, and ', mark: 'FEATHER revisits pruning strategies with improved layer selection.', post: '', src: 'AI paper · SciSlopBench FA0280 · §2 Related Work' },
        { pre: 'Our approach is straightforward: ', mark: 'extract attention weights from layer 12', post: ' (out of 32 LLM layers in InternVL2.5-8B) and apply MIS selection directly without any debiasing.', src: 'Same paper · §3 Method' }],
    note: 'FEATHER’s contribution is choosing the layer, and choosing the layer is this paper’s whole method. The related-work paragraph lists FEATHER with seven other methods and never says what this paper does differently.' },
  '2-1': { what: 'The results have a bad side, and the abstract tells only the good side.',
    q: [{ pre: 'On RULER long-context benchmarks, our method achieves ', mark: '46% cache reduction on Variable Tracking while preserving 93% baseline accuracy', post: ' (16.52% vs. 17.72%).', src: 'AI paper · SciSlopBench FA0002 · Abstract' },
        { pre: 'On Multi-Query, we achieve 70% reduction but with ', mark: 'larger accuracy loss (3.65% vs. 12.10%)', post: ', indicating that distributed-information tasks inherently require higher cache coverage.', src: 'Same paper · §4 Experiments' }],
    note: 'Read the abstract and the method works. Read §4 and on the second task accuracy falls to a third. The abstract never mentions the second task.' },
  '2-3': { what: 'One section refers to something in another section by a name the other section never uses.',
    q: [{ pre: 'Table 3 presents diagnostic metrics from our ', mark: 'Phase-0 analysis', post: ' on 30 COCO images with 5 prompt templates (150 forward passes).', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments' },
        { pre: '', mark: 'Diagnostic analysis on 30 COCO images with 5 prompt templates', post: ' revealed that shallow-layer attention in InternVL2.5-8B is highly prompt-stable but exhibits weak positional bias.', src: 'Same paper · §3 Method' }],
    note: 'The two sentences describe the same analysis. “Phase-0” appears only in §4, so the reader has to guess that they match.' },
  '3-1': { what: 'The paper makes a choice its results depend on and gives no reason for it.',
    q: [{ pre: 'Our approach is straightforward: extract attention weights from ', mark: 'layer 12 (out of 32 LLM layers in InternVL2.5-8B)', post: ' and apply MIS selection directly without any debiasing.', src: 'AI paper · SciSlopBench FA0280 · §3 Method' },
        { pre: 'Key Insight: Deeper Layers = Better Token Selection · L2 55% · L4 39% · ', mark: 'L8 69% · L12 66%', post: '', src: 'Same paper · Figure 1, text inside the figure' }],
    note: 'The method is the choice of layer, and the paper never says why 12. Its own figure shows layer 8 scoring higher, and the text never mentions it.' },
  '4-1': { what: 'A sentence says nothing about this study and could be deleted without loss.',
    q: [{ pre: 'Linearizing aims to start with openly available LLMs … and (i) swap their softmax attentions with subquadratic analogs, before (ii) further finetuning to recover quality. ', mark: 'This holds exciting promise for quickly scaling up subquadratic capabilities.', post: '', src: 'Human paper · LoLCATs, arXiv 2410.10254 · §1 Introduction' }],
    note: 'The sentence before already says what the promise is: cheaper models of the same quality. The marked sentence adds only “exciting”, and deleting it loses nothing.' },
  '4-2': { what: 'The paper leans on a term it never defines.',
    q: [{ pre: 'This occurs because LLaMA-3.1-8B-Instruct has a ', mark: 'low retrieval rate (<14%)', post: ', limiting the effectiveness of consensus-based validation.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments' }],
    note: 'The paper’s main negative result is explained by this number. “Retrieval rate” is never defined and no table reports it, so the reader cannot tell what 14% is a share of.' },
  '4-3': { what: 'The paper spends words on details that help no one understand, check, or repeat the study.',
    q: [{ pre: 'After tokenization, ', mark: 'we reorganized the working directory, renamed intermediate files by date, and merged two scratch folders', post: ' before training.', src: 'Constructed example · no instance in the three verified pairs' }],
    note: 'None of this changes a result. It sits between the preprocessing steps that do, and hides them.' },
  '4-4': { what: 'The paper says the same thing again, with nothing new and no reason to repeat it.',
    q: [{ pre: '', mark: 'These results demonstrate that the ratio formula does not remove positional bias---it destroys useful saliency signal.', post: '', src: 'AI paper · SciSlopBench FA0280 · §4 Experiments' },
        { pre: 'Consequently, ', mark: 'the ratio formula in Equation 3 does not remove positional bias---it destroys useful saliency signal', post: ', resulting in only 13.24% grounding accuracy compared to 38.70% with raw attention at the same layer.', src: 'Same paper · §3 Method' }],
    note: 'The method section already states this conclusion with its numbers. The experiments section repeats it in the same words and drops the numbers. The introduction also repeats three abstract sentences almost word for word.' },
  '4-5': { what: 'The figure shows something the reader cannot interpret from the figure, its caption, or the text.',
    q: [{ pre: 'Key Insight: Deeper Layers = Better Token Selection · ', mark: 'L2 55% · L4 39% · L8 69% · L12 66%', post: '', src: 'AI paper · SciSlopBench FA0280 · Figure 1, text inside the figure' }],
    note: 'Nothing says what the four bars measure, or that the L2 bar is a different method with debiasing. The highest bar, L8, is never mentioned in the text, so the reader cannot tell what the figure is showing.' },
  '5-1': { what: 'The paper says a problem matters and never shows that it does.',
    q: [{ pre: 'However, this offline calibration requirement limits deployment flexibility: ', mark: 'the prior may not transfer across domains, prompt styles, or model updates.', post: '', src: 'AI paper · SciSlopBench FA0280 · §1 Introduction' }],
    note: 'This sentence is the whole reason for the paper’s second contribution. The paper never tests a transfer to any other domain, prompt, or model, so the problem it solves is only asserted.' },
  '5-2': { what: 'The paper says it differs from another method, and describes that method wrongly.',
    q: [{ pre: 'This is fundamentally different from attention-based methods like H2O, ', mark: 'which prune high-attention tokens', post: '; we prune tokens with low approximation error.', src: 'AI paper · SciSlopBench FA0002 · §1 Introduction' },
        { pre: 'H2O identifies “heavy hitter” tokens that consistently receive high attention scores and ', mark: 'retains only these tokens', post: ' plus recent context.', src: 'Same paper · §2 Related Work' }],
    note: 'H2O keeps the high-attention tokens; the introduction says it prunes them. The claimed difference is with a method that does not exist.' },
  '5-3': { what: 'The paper gives a result a cause or a meaning that nothing in the paper tests.',
    q: [{ pre: 'LDA detection remains perfect (AUROC=1.0) against the adaptive attack, while the attack’s effectiveness is ', mark: 'unchanged (ASR 40.68% → 42.37%)', post: '.', src: 'AI paper · SciSlopBench FA0083 · §4 Experiments' },
        { pre: 'This robustness ', mark: 'stems from a fundamental trade-off', post: ': reducing the uniqueness weight makes triggers less detectable but also reduces their retrieval effectiveness.', src: 'Same paper · §4 Experiments, next sentence' }],
    note: 'A trade-off means one side goes down when the other goes up. The sentence before says neither side moved, so the explanation is contradicted by the number it explains.' },
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
  ['Importance words', 'crucial, pivotal, paramount, growing attention', ['5-1']],
  ['Evaluative words', 'novel, robust, significantly, state-of-the-art', ['1-2', '5-3']],
  ['Contrast frames', 'unlike …, rather than …, not X but Y', ['5-2']],
  ['Interpretive tails', '…, demonstrating / highlighting / suggesting that …', ['5-3']],
  ['Evidence talk', 'it is well established that, extensive experiments show', ['5-4']],
  ['Rule of three', 'novel, efficient, and scalable', ['1-1', '1-2', '5-4']],
  ['Empty signposting', 'it is worth noting that, in summary, overall', ['4-1', '4-4']],
  ['Circular phrasing', 'the extraction module extracts features', ['4-1', '4-2', '3-1']],
  ['Scope limiting', 'beyond the scope, left for future work', ['3-1', '1-2', '4-1']],
  ['Surface style', 'em dashes, title case, bold run-in headings', []],
];
const MAP = [['1-3', 'Evidence gap'], ['1-4', 'Citation isolation'], ['2-3', 'Cross-section references'], ['4-4', 'Macro redundancy'], ['4-5', 'Figure exposition']];

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
  { id: 'f1', q: 'How does AI slop differ from human poor writing?', a: 'Human and AI papers on the same 16 items, author hidden.',
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
  { id: 'f4', q: 'What problems do reviewers point out for each type of slop?', a: 'Reviewer weaknesses collected per item: does a 5-1 paper get “motivation unclear”, a 4-4 paper “repetitive”?',
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
    { h: 'Abstract', p: ['Cross-lingual retrieval models weight every token the same. We introduce ', M('2-1'), ' on three benchmarks. ', M('1-2'), ', with gains of up to 4 points.'], lines: 1 },
    { h: '1  Introduction', p: [M('5-1'), ' ', G('g51', 'which problem? what fails?'), ' We propose a new framework to tackle this critical problem. ', A('g44', 'Our model beats all baselines on both datasets.')], lines: 1 },
    { p: [M('4-1'), ' ', G('g41', 'delete it: nothing is lost')], lines: 1 },
    { h: '2  Related Work', p: ['Method A [3] uses contrastive pairs; method B [7] adds a memory module. ', A('gab', 'Both compute their weights w = f(x) from the input.'), ' ', M('1-4'), ' ', G('g14', 'follows A or B? what differs?')], lines: 1 },
    { p: [M('5-4')], lines: 1 },
    { h: '3  Method', p: ['We apply ', M('4-2'), ' ', G('g42', 'definition'), ' before fusion and then project to the shared space. ', A('gloss', 'Two regularizers, L_a and L_b, are added to the loss.')], lines: 1 },
    { p: [M('5-2'), ' our method learns input-dependent weights.'], lines: 1 },
    { fig: true, cap: [M('4-5'), ' Solid and dashed arrows; blue, green, and orange blocks.'] },
  ],
  right: [
    { h: '4  Experiments', sub: '4.1  Setup', p: [A('gqa', 'We evaluate on long-document QA.'), ' ', M('3-1'), ' ', G('g31', 'why? effect on the long-input claim?'), ' ', G('g11', 'no label-noise experiment')], lines: 1 },
    { p: ['After tokenization, ', M('4-3'), ' before training.'], lines: 1 },
    { sub: '4.2  Results', table: true },
    { p: ['Adding the auxiliary loss improves BLEU by 1.8 points, ', M('5-3'), ' ', G('g53', 'no analysis of alignment')], lines: 1 },
    { p: ['Table 2 reports the main results. ', M('4-4')], lines: 1 },
    { sub: '4.3  Analysis', p: ['We find 31% ', M('1-3'), ' and 12% entity substitutions (Table 4). ', G('g13', 'no example input · output')], lines: 1 },
    { p: [A('gneg', 'The gain concentrates on sentences that contain negation (Table 5).')], lines: 1 },
    { h: '5  Discussion', p: ['Beyond accuracy, ', M('1-1'), ' and transfers to new domains.'], lines: 1 },
        { h: 'References', refs: ['[3] A. et al. Contrastive pairs for retrieval. 2023.', '[7] B. et al. Memory-augmented retrieval. 2024.', A('gref', '[12] C. et al. Convergence of rule A. Theorem 1: fixed step size.')], lines: 0, small: true },
  ],
};
// how each slop fails on this page: where the mark points, and what the reader finds there
const FAIL = {
  '1-1': { to: 'g11', label: 'no label-noise experiment anywhere in §4' },
  '1-2': { to: 'gqa', label: 'one task, one setting: not "across domains"' },
  '1-3': { to: 'g13', label: 'counts only, no example to check' },
  '1-4': { to: 'g14', label: 'the relation to A and B is never stated' },
  '2-1': { to: 'gneg', label: 'this finding never reaches the Abstract' },
  '2-3': { to: 'gloss', label: 'two losses in §3: which one was removed?' },
  '3-1': { to: 'g31', label: 'excluded, no reason given' },
  '4-1': { to: 'g41', label: 'says nothing about this paper' },
  '4-2': { to: 'g42', label: 'never defined' },
  '4-3': { self: true, label: 'no result depends on this' },
  '4-4': { to: 'g44', label: 'the same sentence as in §1', eq: true, from: '§1 Introduction', at: '§4.2 Results' },
  '4-5': { to: 'gfig', label: 'arrows and colors never explained' },
  '5-1': { to: 'g51', label: 'the problem is never named' },
  '5-2': { to: 'gab', label: 'A and B are input-dependent too' },
  '5-3': { to: 'g53', label: 'nothing tests the alignment claim' },
  '5-4': { to: 'gref', label: '[12] covers fixed step sizes only' },
};
const PLANES = { structure: { title: 'Structure', q: 'Do the sections build on one another?' }, argument: { title: 'Argument', q: 'Are the claims and citations argued?' }, artifacts: { title: 'Artifacts', q: 'Can the method and the evidence be inspected?' } };
const PLANE_OF = { '2-1': 'structure', '2-3': 'structure', '4-1': 'structure', '4-3': 'structure', '4-4': 'structure',
  '1-1': 'argument', '1-2': 'argument', '1-4': 'argument', '5-1': 'argument', '5-2': 'argument', '5-3': 'argument', '5-4': 'argument',
  '1-3': 'artifacts', '3-1': 'artifacts', '4-2': 'artifacts', '4-5': 'artifacts' };
const PLANE_C = { structure: '#7E4E66', argument: '#E4959E', artifacts: '#56717B' };   // site planes: structure/artifacts in their deep shade so structure and argument separate
// the page groups the sixteen items by the index's three planes; the 1-5 area numbers stay in the item ids
const GROUPS = [
  { n: 1, key: 'structure', cls: 'p-structure', title: 'Structure', q: 'Do the sections build on one another?' },
  { n: 2, key: 'argument', cls: 'p-argument', title: 'Argument', q: 'Are the claims and citations argued?' },
  { n: 3, key: 'artifacts', cls: 'p-artifacts', title: 'Artifacts', q: 'Can the method and the evidence be inspected?' },
];
for (const it of ITEMS) { it.plane = PLANE_OF[it.id]; it.ar = GROUPS.find(g => g.key === it.plane); it.g = it.ar.n; }
const SHORT = { '1-1': 'A claim with no evidence behind it.', '1-2': 'The claim goes further than the evidence.', '1-3': 'Results, but not one example shown.', '1-4': 'Cited, but never related to this paper.',
  '2-1': 'The key finding is missing from the abstract.', '2-3': 'Refers to something the reader cannot locate.', '3-1': 'A design choice with no reason given.',
  '4-1': 'Says nothing about this paper.', '4-2': 'A term that is never defined.', '4-3': 'Detail that no result depends on.', '4-4': 'The same sentence in two sections.', '4-5': 'Figure arrows and colors never explained.',
  '5-1': 'Called important, but which problem?', '5-2': 'A claimed difference that does not hold.', '5-3': 'A result read as a mechanism never tested.', '5-4': 'The cited source says something else.' };
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
const MINI_CAP = {"f1": "Human and AI papers, same 16 items, author hidden", "f2": "Slop against review scores, year by year and venue by venue", "f3": "One paper, one human review and one AI review", "f4": "Each review remark matched to the slop it points at"};
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
const Q = 'Qwen', CD = 'code', QC = 'Qwen + code', QV = 'Qwen-VL';
const MEASURE = {
  '1-1': { unit: 'claim', units: 'claims',
    stages: [['Claim', 'stated as fact', 'paper'], ['Needs', 'what would prove it?', Q], ['Found', 'in the paper?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Find the claims', [[CD, 'Split the paper into numbered sentences (A04, S2.066) and table rows (T1).'], [Q, 'List every sentence that states a result or property as fact.'], [Q, 'Tag each: own result · method property · prior-work fact.'], [CD, 'A claim repeated in abstract, intro and conclusion counts once.'], [CD, 'Procedures (“we compute…”), hypotheses, common knowledge → NA.']]],
      ['Name the evidence needed', [[Q, 'One sentence: what a careful reader would require (experiment, measurement, proof, method description, citation).'], [Q, 'No quality judgment here, only what would prove the claim.']]],
      ['Search the paper', [[Q, 'Point to ids that bear on the claim: tables, figures, result sentences, method text, citations.'], [CD, 'Discard the claim itself, its restatements in abstract / intro / conclusion, and ids that do not exist.'], [CD, 'Add any table containing the claim’s numbers.'], [Q, 'Judge (second call) reads the remaining material verbatim: supported · partial · unsupported · ambiguous · common knowledge, plus what is missing.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Rules, in order: cited prior-work fact → PASS · procedure or definition → NA · supported or partial → PASS · unsupported, no valid evidence → FAIL.'], [CD, 'Unsupported, but its numbers appear in a table or only a figure supports it → human review (U).'], [CD, 'Three runs (1 greedy, 2 sampled). FAIL needs ≥2 FAIL votes and no PASS. Found in <2 runs or split → U.'], [CD, 'score = FAIL / (FAIL + PASS). U reported as coverage; NA excluded.']]]],
    line: 'Qwen2.5-32B reads; code checks every id, applies the rules and counts. Three runs vote; split votes stay U.' },
  '1-2': { unit: 'claim', units: 'supported claims',
    stages: [['Claim', 'passed 1-1: evidence exists', 'paper'], ['Covers', 'what the evidence reaches', Q], ['Asserts', 'what the claim reaches', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the claims', [[CD, 'Input: claims that passed 1-1. Test: does the wording exceed the evidence?'], [CD, 'Claims with no evidence stay in 1-1 (no double counting).']]],
      ['Read the covered range', [[Q, 'List what the evidence covers: datasets, tasks, models, conditions.'], [Q, 'Read the claim on four axes: scope, conditions, effect size and direction, certainty (“significantly”, “causes”, “guarantees”).']]],
      ['Quote the overreach', [[Q, 'Quote verbatim the words that exceed the evidence, and the classes the claim speaks for (“adaptive attackers”, “across domains”).'], [CD, 'Verify the quote occurs in the claim. Exclude phrases over 8 words and proper names (RULER, CIFAR-10).']]],
      ['Decide PASS / FAIL', [[CD, 'FAIL: quote found in the sentence, or a generic class + qualifier covered by ≤2 items.'], [CD, '“significantly” alone never fails; counted separately as sig_without_test.'], [CD, 'A limitation cancels the overreach only if it limits the same claim.'], [CD, 'Three runs vote, as in 1-1. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B compares evidence and claim and quotes the overreach; code verifies the quote and the class count. Three runs vote.' },
  '1-3': { unit: 'statement', units: 'statements',
    stages: [['Statement', 'needs a case to be understood', 'paper'], ['Reader asks', 'what would it look like?', Q], ['Example', 'shown?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the statements', [[CD, 'Candidates: named categories, qualitative adjectives (coherent, stealthy), “we introduce / define”, phenomena a figure is said to show.'], [Q, 'Keep those not checkable from definitions, formulas or numbers alone.'], [CD, 'Exclude captions and “Figure X shows…”: the figure is the exhibit.']]],
      ['Pose the reader’s question', [[Q, 'Write the reader’s concrete question (“what does a poisoned demonstration look like?”).'], [Q, 'Already answered by a definition or number → sufficient_without_example.']]],
      ['Search for an example', [[Q, 'Search the whole paper for a real case: input with output, error, trigger list, visualization.'], [Q, 'Judge (second call) reads every caption: does the exhibit show this exact category or property?'], [CD, 'The example must share content words with the statement.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Real case → PASS. Hypothetical (“suppose…”) → PASS only for formats and procedures, never for claimed events.'], [CD, 'No example → FAIL. Split runs → U.'], [CD, 'score = FAIL / (FAIL + PASS). Small counts: read the count, not the ratio.']]]],
    line: 'Qwen2.5-32B poses the reader’s question and searches for a real case; code checks the match. Three runs vote.' },
  '1-4': { unit: 'cited work', units: 'cited works',
    stages: [['Cited work', 'one citation key', 'paper'], ['Role', 'what it is to this paper', Q], ['Relation', 'stated in a sentence?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the citations', [[CD, 'Collect each citation key’s sentences and bib title.'], [CD, 'Units: Related Work citations, experimental baselines, intro citations with a limitation or contrast.'], [CD, 'Excluded: lists of 3+ works in one sentence, surveys, tutorials, datasets, tools, metrics.']]],
      ['Assign a role', [[Q, 'Role: built on · related method · baseline · dataset, metric or tool · background fact.'], [Q, 'Point to sentences that state the relation to this paper.'], [CD, 'Add candidates: first-person or contrast sentences in the citing paragraph (“these methods…, we instead…”), first-person sentences naming the work.']]],
      ['Recognise a relation', [[Q, 'Judge reads each candidate: does it relate the work to this paper, or only describe this method?'], [CD, 'Requires the first person or the method name. “Unlike prior work,” alone does not count.']]],
      ['Decide PASS / FAIL / NA', [[CD, 'Relation sentence → PASS. Baseline compared in a first-person sentence → PASS.'], [CD, 'No relation sentence → FAIL. Survey or background citation → NA.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B assigns each cited work a role and finds the sentence relating it to this paper; code requires the first person or the method name. Three runs vote.' },
  '2-1': { unit: 'finding', units: 'findings',
    stages: [['Finding', 'a key result in the body', Q], ['Shown in', 'the table or sentence', CD], ['Up front?', 'abstract and intro', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Extract the key results', [[Q, 'From the body only, identify the paper’s research question.'], [Q, 'Extract up to six findings that bear directly on the research question. Keep negative results and qualifying conditions.'], [CD, 'Exclude secondary results, limitations, and future work.']]],
      ['Trace each finding to its source', [[CD, 'Record the source IDs for each finding: result sentences, tables, and figures.']]],
      ['Check the abstract and introduction', [[Q, 'Compare each finding against the abstract and introduction:'], [Q, 'Is the finding conveyed in substance? Exact numbers are not required.'], [Q, 'Is its key condition conveyed?'], [CD, 'Compute word overlap with each abstract / intro sentence.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Finding or condition not conveyed → FAIL.'], [CD, '≥40% content-word overlap → human review (U).'], [CD, 'Three independent runs vote; score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B reads the body first, then checks the abstract and introduction; code guards with word overlap. Three runs vote.' },
  '2-3': { unit: 'name', units: 'names',
    stages: [['Name', 'a label that needs a definition', CD], ['Where', 'table or sentence', CD], ['Defined?', 'a sentence saying what it is', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Collect the names', [[CD, 'Row and column labels of result tables (variant names, metric abbreviations); names in results prose (“Phase-0 analysis”, “retrieval margin”).'], [CD, 'Excluded: formatting residue, generic labels (Avg., Ours, Vanilla), standard benchmark abbreviations (MMLU, SQA…).']]],
      ['Locate each use', [[CD, 'The table with its caption, or the sentence using the name.']]],
      ['Search for a definition', [[CD, 'Prose sentence containing all content words of the label → resolved by code, no model call.'], [Q, 'Otherwise search the whole paper for the defining sentence.'], [Q, 'Still none: judge checks the nearest candidates and whether the name is standard.']]],
      ['Decide PASS / FAIL / NA / U', [[CD, 'Definition, consistent name or reference → PASS. Standard name → NA. Unidentified → FAIL.'], [CD, 'Broken \\ref → U (possible parser limit).'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS). Code-resolved labels: counted, not animated.']]]],
    line: 'Code collects the labels and resolves the easy ones; Qwen2.5-32B searches for the rest. Three runs vote.' },
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
  '4-1': { unit: 'sentence', units: 'sentences',
    stages: [['Sentence', 'eligible prose', CD], ['Delete it', 'context without it', Q], ['Lost?', 'information or function', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the sentences', [[CD, 'All prose sentences of ≥8 tokens. Excluded: captions, ethics, acknowledgements, boilerplate.'], [CD, 'Candidates: no number, formula, citation, reference or paper-specific term; plus a random 10% spot check. A name alone is not information.'], [CD, 'Non-candidates → PASS by rule (counted, not animated).']]],
      ['Delete the sentence', [[Q, 'Read the neighbours without it.']]],
      ['Check what is lost', [[Q, 'Lost: (i) study-specific information · (ii) a needed function (background, transition, guidance) · nothing.']]],
      ['Decide PASS / FAIL', [[CD, 'no_loss → FAIL. Otherwise → PASS.'], [CD, 'Denominator: all eligible sentences, so the score is the share of empty prose.'], [CD, 'Three runs vote.']]]],
    line: 'Code selects candidates; Qwen2.5-32B runs the deletion test in context. Denominator: all eligible sentences. Three runs vote.' },
  '4-2': { unit: 'term', units: 'terms',
    stages: [['Term', 'needs a meaning to be understood', CD], ['Used', 'where and how often', CD], ['Defined?', 'a sentence giving the meaning', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Collect the terms', [[CD, 'Abbreviations, hyphenated compounds used ≥2 times, quoted terms, names like Phase-0, two-word metrics (“X rate / score / ratio / margin”).'], [CD, 'Excluded: appendix-only terms, names right after a citation, names already in the table inventory.']]],
      ['Locate each use', [[CD, 'Record the first use and every occurrence.']]],
      ['Search for a definition', [[CD, 'Code first: parenthetical expansion (“Self-Recall Error (SRE)”) or a same-paragraph cue (“we call”, “is defined as”, “denotes”).'], [Q, 'Otherwise search the paper: defined here (id) · standard term · undefined · name variant.'], [Q, 'Still undefined: judge re-reads every use. Expanding an abbreviation, or “X is our X module”, is not a definition.']]],
      ['Decide PASS / FAIL / NA', [[CD, 'Valid definition → PASS. Standard term or name → NA. Undefined after both passes → FAIL. Name variants recorded separately.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Code finds the terms and easy definitions; Qwen2.5-32B searches for the rest and re-reads every use. Three runs vote.' },
  '4-3': { unit: 'sentence', units: 'sentences',
    stages: [['Sentence', 'eligible prose', CD], ['Role', 'understand · check · reproduce · limits', Q], ['Any role?', 'or none', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the sentences', [[CD, 'All eligible prose sentences, as in 4-1.']]],
      ['Flag sentences with no role', [[Q, 'Flag sentences that serve no reader need (understanding, checking, reproducing, reading the limits): file-renaming history, anecdotes, implementation chatter unrelated to results.']]],
      ['Confirm in context', [[Q, 'Judge re-reads each flag in context. Preprocessing exceptions, hardware, data constraints, failure conditions count as needed.']]],
      ['Decide PASS / FAIL', [[CD, 'Confirmed → FAIL. Near zero in conference-length papers; the sample shows three unflagged sentences.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS) over all eligible sentences.']]]],
    line: 'Qwen2.5-32B flags sentences that serve no reader need; a second call confirms in context. Rare in conference papers.' },
  '4-4': { unit: 'section', units: 'body sections',
    stages: [['Section', 'a body section, sentence by sentence', CD], ['Earlier twin', 'closest sentence in an earlier section', CD], ['Same?', '8-word runs ≥ 50% or cosine ≥ 0.90', CD], ['Verdict', 'one repeat → slop section', CD]],
    how: [
      ['Select the sections', [[CD, 'Body sections: introduction, related work, method, experiments, others.'], [CD, 'Not scored: abstract, conclusion, appendix, ethics / reproducibility statements.'], [CD, 'Sentences of ≥8 tokens. Excluded: captions, formula-heavy sentences, explicit recaps (“as mentioned”).']]],
      ['Find the earlier twin', [[CD, 'For each sentence: the closest earlier sentence in a different section. The abstract counts as an earlier section.'], [CD, 'Candidates: a shared 8-word run, or MiniLM cosine ≥ 0.75 with content-word Jaccard ≥ 0.2.']]],
      ['Check: same sentence?', [[CD, 'Repeat → 8-word runs shared with earlier sections cover ≥ 50% of the sentence, or MiniLM cosine ≥ 0.90.'], [CD, 'Same topic in new words with new content → below both bars → not a repeat.'], [CD, 'No model judgment.']]],
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
  '5-1': { unit: 'problem', units: 'problems',
    stages: [['Presented', 'as worth studying', Q], ['Problem', 'concrete gap stated?', Q], ['Why', 'reason it matters?', Q], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the problems', [[Q, 'Every problem, question or contribution that abstract, intro or related work presents as worth studying, with or without words like “critical”.']]],
      ['Locate the problem', [[Q, 'Point to the sentence(s) stating the concrete problem or gap (gap ids). “Existing methods face challenges” is not concrete.']]],
      ['Locate the reason', [[Q, 'Point to the sentence(s) stating why it is worth solving (reason ids): consequence, cost, failure case, or scientific question. One sentence may serve both.'], [Q, 'Judge reads those sentences and answers both questions. Numbers not required; a theoretical motive counts.']]],
      ['Decide PASS / FAIL', [[CD, 'Either answer “no” → FAIL. Both “yes” → PASS.'], [CD, 'Invented numbers → 5-4.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B locates the problem and reason sentences, then judges both. Three runs vote.' },
  '5-2': { unit: 'contrast', units: 'contrasts',
    stages: [['Contrast', 'ours vs a named target', CD], ['Target says', 'how the paper describes it', Q], ['Difference', 'shown or contradicted?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the contrasts', [[CD, 'Candidates: first-person sentences with contrast words (unlike, in contrast, rather than, whereas, outperform, compared to…), or a baseline name + comparison word.'], [Q, 'Keep contrasts with an identifiable target and a stated difference: structural, performance or cost. “Requires no training” = structural.'], [CD, 'NA: findings about own data, comparisons among prior works, contrasts between settings of the own method.']]],
      ['Describe the target', [[Q, 'Record the target, the property attributed to it, and the paper’s own property.'], [CD, 'Collect every sentence that names the target.']]],
      ['Check the difference', [[Q, 'Judge reads all target sentences and the evidence: (1) does the paper’s own description of the target contradict the attributed property? (2) is a structural difference traceable to the method or the target description? (3) is a performance or cost difference shown under comparable conditions?'], [CD, 'Target is a table label → its results attached automatically.']]],
      ['Decide PASS / FAIL / U', [[CD, 'Contradiction → FAIL. Performance or cost difference without results, or under incomparable conditions → FAIL.'], [CD, 'Traceable structural difference → PASS; citation only → U. Unidentifiable target (“prior methods”) → FAIL.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS). Known over-detection on human papers (settings compared as methods).']]]],
    line: 'Code gathers every sentence about the target; Qwen2.5-32B checks the contrast against them and the results. Three runs vote.' },
  '5-3': { unit: 'interpretation', units: 'interpretations',
    stages: [['Interpretation', 'cause · mechanism · generalization · implication', CD], ['Observation', 'the result it reads from', Q], ['Support', 'beyond the result itself?', QC], ['Verdict', '3 runs vote', CD]],
    how: [
      ['Select the interpretations', [[CD, 'Candidates: Experiments, Conclusion and caption sentences with interpretation cues (demonstrating, indicating, suggesting, because, stems from, thus…); abstract / intro / method sentences with a mechanism cue. Not “We show that…” contribution lines.'], [Q, 'Type: restatement · scope summary · mechanism · cause · generalization · implication. One proposition across abstract, intro and conclusion = one unit.']]],
      ['Locate the observation', [[Q, 'Point to observation ids (table rows or figure) and any support ids. Note hedging (may, we hypothesize).']]],
      ['Check the support', [[Q, 'Judge reads the full observation rows and the support: (1) compatible with the numbers (no-change not read as change)? (2) does the support carry the inferential step, beyond restating? (3) immediate inference (removing X loses the gain, so X is needed)? (4) only a summary?']]],
      ['Decide PASS / FAIL / NA', [[CD, 'Contradicts the observation → FAIL. Summary or restatement → NA.'], [CD, 'Support, immediate inference or citation → PASS. Unsupported but hedged everywhere → PASS. Otherwise, stated as fact → FAIL. Implications fail only on contradiction.'], [CD, 'Three runs vote. score = FAIL / (FAIL + PASS).']]]],
    line: 'Qwen2.5-32B locates the observation and the support, then judges whether the inferential step is carried. Three runs vote.' },
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
  const wrap = h('div', { class: 'ms' }, h('p', { class: 'ms-loading', text: 'Loading…' }));
  fetch('measure/' + it.id + '.json').then(r => r.json()).then(data => buildFlow(m, data, wrap)).catch(() => wrap.replaceChildren(h('p', { class: 'ms-loading', text: 'The run data could not be loaded.' })));
  return wrap;
}
// 4-4: a sentence pair shown whole, section on top, the words both sentences share marked
const pairQ = (p, role) => h('div', { class: 'pv' }, h('span', { class: 'pv-sec' + (role === 'earlier' ? ' e' : '') }, h('b', { text: p.sec }), ' · ' + p.id + (role === 'earlier' ? ' · earlier' : ' · later')),
  h('q', { class: 'mw-q' }, ...p.segs.map(([t, on]) => on ? h('mark', { class: 'pv-m', text: t }) : t)));
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
  const score = h('p', { class: 'mw-score' }, 'Score = slop ÷ decided = ', h('b', { text: `${F} ÷ ${D}` }), ' = ', h('b', { class: 'big', text: D ? (F / D).toFixed(2) : '—' }), UU ? h('span', { text: `  ·  ${UU} left open for a human, not counted` }) : null);
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
For every claim with supporting results, compare four things against the evidence: subjects and scope, conditions, effect size and direction, certainty (observed, statistical, causal).
Rewrite the claim to the evaluated range and state the uncertainty.
Deleting "significantly" while keeping "across domains" is not a fix.`,
  '1-3': `# Fix · Missing Examples (1-3)
List the claims and phenomena a reader cannot check without a concrete case (an input with its output, an error, a sample).
For each, add one real case from the study, in the body or an appendix, and refer to it from the claim.
Do not invent cases or present constructed ones as observations.`,
  '1-4': `# Fix · Unclear Links to Prior Work (1-4)
For every cited work that the study builds on, differs from, or compares against, write one sentence that says the relation: what this study follows, which limitation it addresses, or what it does differently.
Adding "unlike prior work" without the relation, or deleting citations, is not a fix.`,
  '2-1': `# Fix · Buried Findings (2-1)
Identify the key findings of the body from the research question and the main results, including the condition under which each holds.
Check the Abstract and Introduction: if a key finding or its condition is missing, add it in one sentence.
Adding a single number is not enough; do not turn an observed association into a mechanism.`,
  '2-3': `# Fix · Missing Cross-Section Links (2-3)
Find every place that depends on a definition, method, or result given elsewhere (an ablation row, a symbol, a setting).
Name the counterpart exactly (which loss, which equation, which table) so the reader can match them.
Do not add references to unrelated tables or sections.`,
  '3-1': `# Fix · Unexplained Design Choices (3-1)
List the choices that affect the conclusion: architecture, data selection, exclusions, comparison conditions, metrics.
For each, give the actual rationale, constraint, or comparison. "For efficiency" alone is not a reason.
Do not invent alternatives that were never run; a value that is given but unexplained is the target here, not a missing value.`,
  '4-1': `# Fix · Generic Filler (4-1)
For each sentence, ask what information or function is lost if it is deleted.
If nothing is lost, delete it. If it stands where motivation or a definition should be, replace it with the study's own content.
Inserting model or dataset names to make a sentence look specific is not a fix.`,
  '4-2': `# Fix · Undefined Terms (4-2)
For every term or abbreviation the intended reader cannot interpret from context, give its operation, object, or role where it first appears, or cite the definition.
Expanding an acronym or swapping in another abstract word is not enough. If one thing has several names, pick one.`,
  '4-3': `# Fix · Irrelevant Detail (4-3)
For each passage, ask whether removing it loses anything needed to understand, check, or reproduce the study.
Remove what has no role; keep every preprocessing, data, and failure-condition detail that reproduction needs.
Cutting reproduction detail to shorten the paper is not a fix.`,
  '4-4': `# Fix · Redundant Repetition (4-4)
Find each body sentence that copies, almost word for word, a sentence from the abstract or an earlier section.
Cut it, point back to where it was first said, or replace it with what is new at this point (a number, a condition, an interpretation).
The abstract and the conclusion are not checked. Rewording the same content is not a fix.`,
  '4-5': `# Fix · Unclear Figures (4-5)
State the figure's purpose. List every element, symbol, arrow type, and color the reader must interpret.
Explain each in the figure, the legend, or the caption, and tie it to the method or result it shows.
A longer caption, or deleting the figure, is not by itself a fix.`,
  '5-1': `# Fix · Unexplained Importance (5-1)
Where the paper calls a problem or contribution important, write the concrete problem (which question is open, what fails, under which constraint) and why it is worth studying.
If the motivation is already given elsewhere, delete the stock sentence.
Swapping adjectives, or inventing numbers to support importance, is not a fix.`,
  '5-2': `# Fix · Unsupported Comparisons (5-2)
For every "unlike …" or "rather than …", name the compared method, the compared property, and the claimed difference.
Verify a structural difference in the equations or method description; verify a performance difference with an evaluation.
If the difference does not hold, withdraw it and align the Abstract and conclusion. Deleting "unlike" is not a fix.`,
  '5-3': `# Fix · Unsupported Interpretations (5-3)
Separate each result sentence into the observation and the added interpretation (cause, mechanism, meaning).
State what assumption or evidence the step between them needs and whether the paper has it.
If it does not, limit the interpretation to what the results allow, or mark it as a hypothesis, and fix the Abstract and Conclusion to match.
Changing "demonstrating" to "suggesting" while keeping the conclusion is not a fix.`,
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
const PAGE_ORDER = ['2-1', '1-2', '5-1', '4-1', '1-4', '5-4', '4-2', '5-2', '4-5', '3-1', '4-3', '2-3', '5-3', '4-4', '1-3', '1-1'];
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
// six v1 measures → sixteen slops, drawn as a hand-ruled tree; the caption under the page says what the chosen slop is
const TREE = [['Argument graph', ['1-1', '1-2', '5-1', '5-2', '5-3', '5-4']], ['Evidence gap', ['1-3']], ['Citation isolation', ['1-4']], ['Cross-section references', ['2-3']], ['Macro redundancy', ['4-4']], ['Figure exposition', ['4-5']], [null, ['2-1', '3-1', '4-1', '4-2', '4-3']]];
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
    c.querySelector('.bk-cv').textContent = `${String(i + 1).padStart(2, '0')} / 16 · ${up} ran into it`;
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
    ${[['– motivation unclear', 74], ['– repetitive', 112], ['– …', 150]].map(([t, y]) => `<text class="qhand2" x="30" y="${y}">${t}</text>`).join('')}
    ${[['Unexplained Importance', 70, 'p-argument'], ['Redundant Repetition', 108, 'p-structure']].map(([t, y, c]) => `<g class="${c}"><rect class="qchip" x="228" y="${y - 16}" width="166" height="26" rx="13"/><text class="qct" x="240" y="${y + 1}">${t}</text></g>`).join('')}
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
function measureSteps(it) {
  // every step of the measurer, all of its rules, and what that step returned on one real paper
  const m = MEASURE[it.id];
  if (!m) return h('ol', { class: 'rs' }, ...(it.judge || []).map((t, k) => h('li', { class: 'rs-row' }, h('div', { class: 'rs-n' }, h('b', { text: String(k + 1) })), h('div', { class: 'rs-do' }, h('p', { text: t })))));
  const whoTag = w => w === 'paper' ? null : h('span', { class: 'rs-who ' + (w === 'code' ? 'rule' : 'model'), text: w === 'code' ? 'rule' : w.includes('code') ? 'model + rule' : 'model' });
  const ex = m.stages.map(() => h('div', { class: 'rs-ex' }, h('span', { class: 'rs-wait', text: '…' })));
  const rows = m.stages.map(([title, sub, w], k) => h('li', { class: 'rs-row' + (k === m.stages.length - 1 ? ' last' : '') },
    h('div', { class: 'rs-n' }, h('b', { text: String(k + 1) }), h('div', {}, h('p', { class: 'rs-t', text: title }), h('p', { class: 'rs-q', text: sub }), whoTag(w))),
    h('div', { class: 'rs-do' }, ...(m.how[k] ? [h('p', { class: 'rs-ht', text: m.how[k][0] }), h('ul', {}, ...m.how[k][1].map(([ww, tt]) => h('li', {}, h('span', { class: 'rs-who sm ' + (ww === 'code' ? 'rule' : 'model'), text: ww === 'code' ? 'rule' : 'model' }), tt)))] : [])),
    ex[k]));
  const pick = h('select', { class: 'rs-pick', 'aria-label': 'Which unit the example column follows' });
  const head = h('div', { class: 'rs-head' }, h('span', { class: 'rs-hl', text: 'Step' }), h('span', { class: 'rs-hl', text: 'Procedure' }), h('span', { class: 'rs-hl' }, 'Example: ', pick));
  const score = h('p', { class: 'mw-score' });
  // a player: the steps run one after another on the chosen unit, each example appears when its step is reached
  const play = h('button', { type: 'button', class: 'rs-play', text: '▶ Play' });
  const box = h('div', { class: 'rs-wrap' }, h('div', { class: 'rs-top' }, h('p', { class: 'rs-line', text: m.line }), play), head, h('ol', { class: 'rs' }, ...rows), score);
  const seq = { s: -1, t: 0 };
  const setStep = k => { seq.s = k; rows.forEach((r, j) => { r.classList.toggle('done', j < k); r.classList.toggle('cur', j === k); r.classList.toggle('todo', j > k); });
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
  fetch('measure/' + it.id + '.json').then(r => r.json()).then(data => {
    const U = data.units, pre = data.meta.pre || {}; if (!U.length) { ex.forEach(e => e.replaceChildren(h('span', { class: 'rs-wait', text: 'no units in this paper' }))); return; }
    const VW = { FAIL: 'slop', PASS: 'fine', UNRESOLVED: 'open', NOT_APPLICABLE: 'n/a' };
    pick.replaceChildren(...U.map((u, k) => h('option', { value: k, text: `${VW[u.final]} · ${u.text.slice(0, 48)}…` })));
    const sh = t => t.length > 140 ? t.slice(0, 138).replace(/\s+\S*$/, '') + '…' : t;
    const fill = k => { const u = U[k]; const vals = [
      u.pair ? pairQ(u.pair.later, 'later') : h('div', {}, h('q', { class: 'mw-q', text: sh(u.text) }), h('small', { text: [u.id, u.sec].filter(Boolean).join(' · ') })),
      u.pair ? pairQ(u.pair.earlier, 'earlier') : h('div', {}, h('span', { text: u.s2 || '—' })),
      h('div', {}, u.found.length ? h('span', { class: 'mw-ids' }, ...u.found.map(x => h('code', { text: x }))) : h('span', { class: 'mw-none', text: 'nothing' }), u.found_note ? h('small', { text: tidyNote(u.found_note) }) : null, u.judge_line ? h('small', { text: tidyNote(u.judge_line) }) : null),
      h('div', {}, h('span', { class: 'mw-runs' }, ...u.runs.map(r => h('span', { class: 'mw-r v-' + VK(r), text: VLAB[r] })), h('span', { class: 'mw-to', text: '→' }), h('b', { class: 'mw-final v-' + VK(u.final), text: VLAB[u.final] })), u.final_reason ? h('small', { text: tidyNote(u.final_reason) }) : null)];
      ex.forEach((e, j) => e.replaceChildren(vals[j] || h('span', { text: '—' }))); };
    pick.addEventListener('change', () => { fill(+pick.value); run(); });
    const k0 = Math.max(0, U.findIndex(u => u.final === 'FAIL')); pick.value = k0; fill(k0);
    const c = { FAIL: 0, PASS: 0, UNRESOLVED: 0 }; U.forEach(u => { if (u.final in c) c[u.final]++; });
    const F = c.FAIL + (pre.FAIL || 0), P = c.PASS + (pre.PASS || 0), UU = c.UNRESOLVED + (pre.UNRESOLVED || 0), D = F + P;
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
