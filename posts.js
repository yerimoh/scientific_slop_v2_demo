// one write-up per question; q.html#1 … q.html#4. The main page links here from the question card.
const $ = s => document.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === 'text') el.textContent = v; else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v); }
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
};
{ const btn = $('#theme'); if (btn) btn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next;
    try { localStorage.setItem('ssi-theme', JSON.stringify(next)); } catch (_) { /* ignore */ } }); }
const qBars = (rows, chance) => h('div', { class: 'qa-bars' }, ...rows.map(([l, v, ours]) => h('div', { class: 'qa-br' + (ours ? ' ours' : '') },
  h('span', { class: 'qa-bl', text: l }), h('span', { class: 'qa-bt' }, h('i', { style: `width:${(v * 100).toFixed(1)}%` }), chance ? h('b', { class: 'qa-ch', style: `left:${chance * 100}%` }) : null), h('span', { class: 'qa-bv', text: (v * 100).toFixed(1) + '%' }))));
const qYears = (ys) => h('div', { class: 'qa-yrs' }, ...ys.map(([y, v]) => h('div', { class: 'qa-yr' }, h('span', { class: 'qa-yv', text: v.toFixed(2) }), h('span', { class: 'qa-yb' }, h('i', { style: `height:${((v - .4) / .35 * 100).toFixed(0)}%` }), h('b', { class: 'qa-y5' })), h('span', { class: 'qa-yl', text: '’' + String(y).slice(2) }))));
const qTable = (head, rows) => h('table', { class: 'qa-tbl' }, h('thead', {}, h('tr', {}, ...head.map(t => h('th', { text: t })))), h('tbody', {}, ...rows.map(r => h('tr', {}, ...r.map(t => h('td', { text: t }))))));
// Q1 figures, drawn like the main page's question sketches: paper sheets, robot/person badges, red pen that draws itself once (.qa-fig → .in).
let sk = 11; const rn = () => (sk = (sk * 16807) % 2147483647) / 2147483647 - .5;
const pn = (pts, j = 1.6) => { const p = pts.map(([x, y]) => [x + rn() * j, y + rn() * j]); let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`; }
  return d; };
const sS = (pts, d0, j = 1, cls = 'red') => `<path class="pen ${cls}" pathLength="1" style="--d:${d0}s" d="${pn(pts, j)}"/><path class="pen ${cls} gh" pathLength="1" style="--d:${d0 + .05}s" d="${pn(pts, j * 1.4)}"/>`;
const sLoop = (cx, cy, rx, ry, d0) => { const pts = []; for (let k = 0; k <= 26; k++) { const t = -2.4 + k / 24 * Math.PI * 2.15; pts.push([cx + Math.cos(t) * rx * (1 + rn() * .06), cy + Math.sin(t) * ry * (1 + rn() * .12)]); } return sS(pts, d0, 1); };
const sSquig = (x0, x1, y, d0) => { const pts = []; for (let x = x0; x <= x1; x += 9) pts.push([x, y + (((x - x0) / 9) % 2 ? 3.5 : -2)]); return sS(pts, d0, .6); };
const sArrow = (pts, d0, cls = 'red') => { const [a, b] = pts.slice(-2), g = Math.atan2(b[1] - a[1], b[0] - a[0]), hd = s => [b[0] - 11 * Math.cos(g + s), b[1] - 11 * Math.sin(g + s)];
  return sS(pts, d0, 1.6, cls) + `<path class="pen ${cls}" pathLength="1" style="--d:${d0 + .5}s" d="M${hd(.45).map(v => v.toFixed(1)).join(' ')} L${b[0]} ${b[1]} L${hd(-.45).map(v => v.toFixed(1)).join(' ')}"/>`; };
const sNote = (x, y, t, d0, cls = 'red', size = 21, anchor = 'start') => `<text class="hand ${cls}" style="--d:${d0}s;font-size:${size}px" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
const sMono = (x, y, t, anchor = 'middle', cls = '') => `<text class="qm ${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
const sPaper = (x, y, w, hh, cls = '') => { let r = `<rect class="qp ${cls}" x="${x}" y="${y}" width="${w}" height="${hh}" rx="4"/>`; for (let yy = y + 18; yy < y + hh - 8; yy += 11) r += `<rect class="ql" x="${x + 10}" y="${yy}" width="${w - 20 - ((yy * 7) % 22)}" height="4" rx="2"/>`; return r; };
const sRobot = (x, y, r) => `<g class="ico"><line x1="${x}" y1="${y - r - 6}" x2="${x}" y2="${y - r}"/><circle cx="${x}" cy="${y - r - 7}" r="2.2"/><rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r * .85}" rx="${r * .35}"/><circle class="ey" cx="${x - r * .4}" cy="${y - r * .2}" r="${r * .16}"/><circle class="ey" cx="${x + r * .4}" cy="${y - r * .2}" r="${r * .16}"/></g>`;
const sPerson = (x, y, r) => `<g class="ico"><circle cx="${x}" cy="${y - r * .55}" r="${r * .55}"/><path d="M${x - r} ${y + r * .95} a${r} ${r} 0 0 1 ${2 * r} 0z"/></g>`;
const sBadge = (x, y, who) => `<circle class="qbadge" cx="${x}" cy="${y}" r="15"/>` + (who === 'ai' ? sRobot(x, y + 3, 8) : sPerson(x, y + 1, 9));
const sFig = (vb, inner, label) => { const f = h('figure', { class: 'qa-fig q1s' }); f.innerHTML = `<svg viewBox="${vb}" role="img" aria-label="${label}">${inner}</svg>`; return f; };

// 1. one triplet: well-written human ← similar topic → AI paper ← similar topic → poorly written human
const qDesign = () => sFig('0 0 640 262', `
  ${sPaper(40, 46, 120, 138)}${sBadge(40, 46, 'human')}
  ${sPaper(260, 46, 120, 138)}${sBadge(260, 46, 'ai')}${sLoop(318, 86, 48, 9, .3)}${sSquig(276, 360, 141, .8)}
  ${sPaper(480, 46, 120, 138)}${sBadge(480, 46, 'human')}${sS([[494, 108], [590, 103]], 1.2)}${sS([[496, 152], [560, 148]], 1.4)}${sNote(576, 162, '?', 1.6, 'red', 26)}
  ${sS([[170, 116], [212, 112], [250, 116]], 2, 1.2, 'ink dash')}${sS([[390, 116], [430, 112], [470, 116]], 2.1, 1.2, 'ink dash')}
  ${sNote(210, 100, 'similar topic', 2.3, 'ink', 17, 'middle')}${sNote(430, 100, 'similar topic', 2.4, 'ink', 17, 'middle')}
  ${sNote(100, 216, 'well-written', 2.6, 'ink', 22, 'middle')}${sNote(320, 216, 'AI paper', 2.7, 'red', 22, 'middle')}${sNote(540, 216, 'poorly written', 2.8, 'ink', 22, 'middle')}
  ${sMono(100, 240, 'accepted')}${sMono(320, 240, 'FARS · Agents4Science')}${sMono(540, 240, 'rejected, writing flagged')}`,
  'One AI paper with two human papers on a similar topic: an accepted, well-written one and a rejected, poorly written one');

// 2. the two outcomes, as marked-up papers (illustration)
const qOut = () => { const panel = (ox, title, poorSlop, verdict, d) => `
    <rect class="qp soft" x="${ox}" y="8" width="300" height="236" rx="12"/>${sNote(ox + 150, 42, title, d, 'ink', 22, 'middle')}
    ${sPaper(ox + 22, 64, 72, 96)}${sBadge(ox + 22, 64, 'ai')}${sLoop(ox + 56, 88, 30, 7, d + .3)}${sSquig(ox + 30, ox + 86, 136, d + .6)}
    ${sPaper(ox + 114, 64, 72, 96)}${sBadge(ox + 114, 64, 'human')}${poorSlop ? sLoop(ox + 148, 88, 30, 7, d + .9) + sSquig(ox + 122, ox + 178, 136, d + 1.1) : sS([[ox + 122, 112], [ox + 176, 109]], d + .9, .8)}
    ${sPaper(ox + 206, 64, 72, 96)}${sBadge(ox + 206, 64, 'human')}
    ${sMono(ox + 58, 182, 'AI')}${sMono(ox + 150, 182, 'poorly')}${sMono(ox + 150, 197, 'written')}${sMono(ox + 242, 182, 'well-')}${sMono(ox + 242, 197, 'written')}
    ${sNote(ox + 150, 224, verdict, d + 1.5, 'red', 23, 'middle')}`;
  const f = sFig('0 0 640 252', panel(8, 'if slop = bad writing', true, 'poorly written ≈ AI', .2) + panel(332, 'if it is not', false, 'AI stands apart', 1.2),
    'Two possible outcomes: poorly written human papers show the same slop as AI papers, or only AI papers do');
  f.append(h('figcaption', { class: 'qa-cap', text: 'Illustration of the two outcomes, not data.' })); return f; };
// ---- Q1 charts (q.html#1). Data in q1data.js (window.Q1). SVG built by hand; colours via CSS vars in site.css (.qf).
const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}, ...kids) => { const el = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) { if (v == null) continue; if (k === 'text') el.textContent = v; else el.setAttribute(k, v); } for (const k of kids.flat()) if (k != null) el.append(k); return el; };
const Q1 = window.Q1 || {};
const GROUP = { AI: { label: 'AI paper', cls: 'ai' }, HG: { label: 'well-written human', cls: 'hg' }, HP: { label: 'badly written human', cls: 'hp' } };
const f2 = x => x == null ? '–' : x.toFixed(2);
let TIP = null;
const tip = (el, text) => {
  if (!TIP) { TIP = h('div', { class: 'qf-tip', role: 'status' }); document.body.append(TIP); }
  const show = e => { TIP.textContent = text; TIP.style.left = (e.clientX + 12) + 'px'; TIP.style.top = (e.clientY - 10) + 'px'; TIP.classList.add('on'); };
  el.addEventListener('mouseenter', show); el.addEventListener('mousemove', show); el.addEventListener('mouseleave', () => TIP.classList.remove('on'));
  el.addEventListener('focus', e => { const r = el.getBoundingClientRect(); show({ clientX: r.right, clientY: r.top }); }); el.addEventListener('blur', () => TIP.classList.remove('on'));
  el.setAttribute('tabindex', '0'); el.append(s('title', { text }));
};
// a dot of one group: AI = red filled, well-written = hollow ink, poorly written = filled ink
const dot = (x, y, g, r = 5) => s('circle', { class: 'qf-dot ' + GROUP[g].cls, cx: x, cy: y, r });
const legend = keys => h('div', { class: 'qf-leg' }, ...keys.map(g => h('span', {}, h('i', { class: 'qf-key ' + GROUP[g].cls }), GROUP[g].label)));
const qfig = (n, el, cap, extra) => h('figure', { class: 'qf' }, extra || null, h('div', { class: 'qf-sc' }, el), h('figcaption', {}, h('b', { text: `Figure ${n}. ` }), cap));

// Figure: one row per item, three dots on a 0–1 axis (dumbbell). rows = [{label, sub, vals:{AI,HG,HP}}]
function dumbbell(rows, { groups = ['AI', 'HG', 'HP'], x0 = 0, x1 = 1, ticks = [0, .25, .5, .75, 1], fmt = f2, chance = null, labelW = 196, unit = '' } = {}) {
  const W = 640, RH = 30, top = 22, H = top + rows.length * RH + 24, L = labelW, R = 20;
  const X = v => L + (v - x0) / (x1 - x0) * (W - L - R);
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' });
  for (const t of ticks) { svg.append(s('line', { class: 'qf-grid', x1: X(t), x2: X(t), y1: top - 6, y2: H - 22 })); svg.append(s('text', { class: 'qf-ax', x: X(t), y: H - 6, 'text-anchor': 'middle', text: fmt(t) })); }
  if (chance != null) { svg.append(s('line', { class: 'qf-chance', x1: X(chance), x2: X(chance), y1: top - 6, y2: H - 22 })); svg.append(s('text', { class: 'qf-ax', x: X(chance), y: top - 10, 'text-anchor': 'middle', text: 'chance' })); }
  rows.forEach((r, i) => {
    const y = top + i * RH + RH / 2;
    svg.append(s('text', { class: 'qf-lab', x: L - 12, y: y + 4, 'text-anchor': 'end', text: r.label }));
    if (r.sub) svg.append(s('text', { class: 'qf-sub', x: 0, y: y + 4, text: r.sub }));
    const vs = groups.map(g => r.vals[g]).filter(v => v != null);
    if (vs.length > 1) svg.append(s('line', { class: 'qf-bar', x1: X(Math.min(...vs)), x2: X(Math.max(...vs)), y1: y, y2: y }));
    for (const g of groups) { if (r.vals[g] == null) continue; const d = dot(X(r.vals[g]), y, g); tip(d, `${r.label} · ${GROUP[g].label}: ${fmt(r.vals[g])}${unit}`); svg.append(d); }
  });
  return svg;
}

// Figure: the combined index, one histogram per group (small multiples), AI median marked
function indexHist() {
  const V = Q1.index.values, bins = 28, x0 = .15, x1 = .9, W = 640, PH = 64, L = 150, R = 20, top = 10;
  const svg = s('svg', { viewBox: `0 0 ${W} ${top + PH * 3 + 26}`, role: 'img' });
  const X = v => L + (v - x0) / (x1 - x0) * (W - L - R), bw = (W - L - R) / bins;
  const counts = g => { const c = new Array(bins).fill(0); for (const v of V[g]) c[Math.min(bins - 1, Math.max(0, Math.floor((v - x0) / (x1 - x0) * bins)))]++; return c; };
  const C = { AI: counts('AI'), HG: counts('HG'), HP: counts('HP') }, mx = Math.max(...Object.values(C).flat());
  ['AI', 'HG', 'HP'].forEach((g, i) => {
    const base = top + (i + 1) * PH - 14;
    svg.append(s('line', { class: 'qf-grid', x1: L, x2: W - R, y1: base, y2: base }));
    svg.append(s('text', { class: 'qf-lab', x: L - 12, y: base - 10, 'text-anchor': 'end', text: GROUP[g].label }));
    svg.append(s('text', { class: 'qf-sub', x: L - 12, y: base + 4, 'text-anchor': 'end', text: `mean ${f2(Q1.index.all.mean[g])}` }));
    C[g].forEach((c, k) => { if (!c) return; const hgt = c / mx * (PH - 22); const b = s('rect', { class: 'qf-hbar ' + GROUP[g].cls, x: X(x0 + k / bins * (x1 - x0)) + 1, y: base - hgt, width: Math.max(1, bw - 2), height: hgt, rx: 2 }); tip(b, `${GROUP[g].label}: ${c} papers with index ${(x0 + k / bins * (x1 - x0)).toFixed(2)}–${(x0 + (k + 1) / bins * (x1 - x0)).toFixed(2)}`); svg.append(b); });
  });
  const m = Q1.index.ai_median, yb = top + 3 * PH - 14;
  svg.append(s('line', { class: 'qf-chance', x1: X(m), x2: X(m), y1: top, y2: yb }));
  svg.append(s('text', { class: 'qf-ax', x: X(m) + 5, y: top + 9, text: `AI median ${f2(m)}` }));
  for (const t of [.2, .4, .6, .8]) svg.append(s('text', { class: 'qf-ax', x: X(t), y: yb + 16, 'text-anchor': 'middle', text: f2(t) }));
  return svg;
}

// Figure: human papers by arXiv date, one panel per item; solid = all human papers, dashed = titles without LLM words; red = AI mean
function yearLines() {
  const B = Q1.years.bins, W = 640, PW = 290, PH = 150, L = 46, gap = 30, top = 24;
  const svg = s('svg', { viewBox: `0 0 ${W} ${top + PH + 34}`, role: 'img' });
  const SHORT = ['≤2021', '2022', '23-H1', '23-H2', '24-H1', '24-H2'];
  [['4-1', 'Generic Filler', .035, 3], ['5-5', 'Formulaic Reasoning', .42, 2]].forEach(([it, name, ymax, dp], p) => {
    const ox = L + p * (PW + gap), X = i => ox + i / (B.length - 1) * (PW - 20), Y = v => top + PH - v / ymax * PH;
    svg.append(s('text', { class: 'qf-lab', x: ox, y: top - 8, text: `${it} ${name}` }));
    for (const t of [0, .5, 1]) { svg.append(s('line', { class: 'qf-grid', x1: ox, x2: ox + PW - 20, y1: Y(t * ymax), y2: Y(t * ymax) })); svg.append(s('text', { class: 'qf-ax', x: ox - 6, y: Y(t * ymax) + 4, 'text-anchor': 'end', text: (t * ymax).toFixed(dp) })); }
    B.forEach((b, i) => svg.append(s('text', { class: 'qf-ax', x: X(i), y: top + PH + 16, 'text-anchor': i === B.length - 1 ? 'end' : i === 0 ? 'start' : 'middle', text: SHORT[i] })));
    const ai = Q1.years.ai_mean[it];
    svg.append(s('line', { class: 'qf-ailine', x1: ox, x2: ox + PW - 20, y1: Y(ai), y2: Y(ai) }));
    svg.append(s('text', { class: 'qf-ax ai', x: ox + PW - 20, y: Y(ai) - 6, 'text-anchor': 'end', text: `AI papers ${ai.toFixed(dp)}` }));
    for (const [lab, cls] of [['all', 'solid'], ['nonllm', 'dashed']]) {
      const pts = Q1.years.series[`${it}|${lab}`];
      svg.append(s('path', { class: 'qf-line ' + cls, d: pts.map((q, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(q.mean).toFixed(1)}`).join(' ') }));
      pts.forEach((q, i) => { const d = s('circle', { class: 'qf-dot hp', cx: X(i), cy: Y(q.mean), r: 4 }); tip(d, `${lab === 'all' ? 'all human papers' : 'titles without LLM words'} · ${b_(B[i])}: ${it} mean ${q.mean.toFixed(3)} (n=${q.n})`); svg.append(d); });
    }
  });
  return svg;
}
const b_ = x => x;

// Figure: how many items a paper fails at the well-written 95th percentile — one segmented bar per group
function p95bars(src = 'all') {
  const D = Q1.p95[src], W = 640, L = 196, R = 20, BH = 26, top = 8, labs = ['0 items', '1', '2', '3', '4+'];
  const svg = s('svg', { viewBox: `0 0 ${W} ${top + 3 * 40 + 20}`, role: 'img' });
  ['AI', 'HG', 'HP'].forEach((g, i) => {
    const y = top + i * 40; let x = L;
    svg.append(s('text', { class: 'qf-lab', x: L - 12, y: y + BH / 2 + 4, 'text-anchor': 'end', text: GROUP[g].label }));
    D[g].forEach((p, k) => { const w = p * (W - L - R); if (w <= 0) return; const r = s('rect', { class: `qf-seg s${k}`, x: x + 1, y, width: Math.max(0, w - 2), height: BH, rx: 3 }); tip(r, `${GROUP[g].label}: ${Math.round(p * 100)}% fail ${labs[k]}`); svg.append(r); if (w > 34) svg.append(s('text', { class: 'qf-in' + (k >= 2 ? ' lt' : ''), x: x + 8, y: y + BH / 2 + 4, text: `${Math.round(p * 100)}%` })); x += w; });
  });
  const y = top + 3 * 40 + 10; let x = L;
  labs.forEach((t, k) => { svg.append(s('rect', { class: `qf-seg s${k}`, x, y: y - 9, width: 10, height: 10, rx: 2 })); svg.append(s('text', { class: 'qf-ax', x: x + 14, y, text: t })); x += 14 + t.length * 7 + 18; });
  return svg;
}

const QPOST = {
  f1: { title: 'Is AI slop really different from bad human writing?', tag: 'Scientific Slop Index · Question 1', body: () => {
    const I = Q1.items, byId = Object.fromEntries(I.map(r => [r.id, r])), ix = Q1.index, EX = Q1.examples;
    const B = t => h('b', { text: t });
    const NAME = Object.fromEntries(I.map(r => [r.id, r.name]));
    const clean = t => (t || '').replace(/xxcitexx/g, '[cite]').replace(/xxmathxx/g, '[math]').replace(/xxrefxx/g, '[ref]').replace(/\\\\/g, '').replace(/\s+/g, ' ').trim();
    const ROLE = { AI: ['AI paper', 'ai'], HG: ['Well-written human', 'hg'], HP: ['Badly written human', 'hp'] };
    // ---- byline, like a paper header
    const byline = h('div', { class: 'qa-by' },
      h('div', {}, h('h3', { text: 'Authors' }), h('p', { text: 'Yerim Oh, Young-Jun Lee, Jaewoo Ahn, Seungone Kim, Jinu Lee, Jinheon Baek, Gunhee Kim, Dongyeop Kang' })),
      h('div', {}, h('h3', { text: 'Published' }), h('p', { text: 'November 17, 2026' })),
      h('div', {}, h('h3', { text: 'Data' }), h('p', {}, `${Q1.n.triplets} triplets · 9 slop items · `, h('a', { href: 'https://huggingface.co/datasets/yerim0210/Scientific_Slop', target: '_blank', rel: 'noopener', text: 'SciSlopBench' }))));
    // ---- TL;DR
    const tldr = h('div', { class: 'tldr' }, h('span', { class: 'tldr-l', text: 'TL;DR' }),
      h('p', {}, `Our slop index flags AI-written papers. Does it just flag bad writing? We tested this on ${Q1.n.triplets} sets of three papers on a similar topic: an AI paper, a human paper that was accepted, and a human paper that was rejected because reviewers said the writing was bad.`),
      h('p', {}, B('The rejected papers score the same as the accepted ones. The AI papers score higher than both.'), ' So the index is not measuring how well a paper is written.'),
      h('p', {}, 'We also found that, among the rejected papers, the slop score goes up when reviewers gave a low overall rating, not when they gave a low presentation score.'));
    // ---- teaser: three panels, task → what we did → number
    const tz = (lab, q, vis, did, big, small) => h('div', { class: 'tz-p' }, h('div', { class: 'tz-l', text: lab }), h('div', { class: 'tz-q', text: q }), vis, h('div', { class: 'tz-do', text: did }), h('div', { class: 'tz-out' }, h('b', { text: big }), h('span', { text: small })));
    const oneSheet = (who, marks) => { const f = sFig('0 0 300 118', `${sPaper(108, 10, 84, 100)}${sBadge(108, 10, who)}${marks}`, who === 'ai' ? 'an AI paper' : 'a human paper'); f.className = 'qa-fig q1s tz-vis'; return f; };
    const nflag = g => Q1.p95.all[g].reduce((a, p, i) => a + p * i, 0);
    const teaser = h('div', { class: 'tz' },
      tz('Accepted human paper', 'An accepted paper on a similar topic', oneSheet('human', ''), `Mean slop index ${f2(ix.all.mean.HG)}`, `${nflag('HG').toFixed(1)} of 9`, 'items flagged on average (flag = above this group\u2019s 95th percentile)'),
      tz('AI paper', 'Written end to end by an AI system', oneSheet('ai', sLoop(150, 42, 30, 7, .2) + sSquig(122, 178, 86, .5)), `Mean slop index ${f2(ix.all.mean.AI)}`, `${nflag('AI').toFixed(1)} of 9`, 'items flagged on average'),
      tz('Rejected human paper', 'A rejected paper on a similar topic; reviewers flagged the writing', oneSheet('human', sS([[124, 66], [176, 63]], .9, .8)), `Mean slop index ${f2(ix.all.mean.HP)}`, `${nflag('HP').toFixed(1)} of 9`, 'items flagged on average'));
    const part = (lab, cls) => (...k) => h('div', { class: 'xp ' + cls }, h('span', { class: 'xp-l', text: lab }), h('p', {}, ...k));
    const why = part('Why', 'why'), res = part('Result', 'res'), mean_ = part('What it means', 'mean');
    // ---- experiment head + setup popover
    const exp = (n, q) => h('div', { class: 'exp' }, h('span', { class: 'exp-n', text: `Experiment ${n}` }), h('h5', { text: q }));
    const setup = items => h('details', { class: 'setup' }, h('summary', { text: 'Setup' }), h('ul', {}, ...items.map(([k, v]) => h('li', {}, B(k + ': '), v))));
    // ---- example card: one triplet per tab, three papers side by side
    const quote = e => {
      if (e.item === '5-5') { const q = h('p', { class: 'xq' }); let t = clean(e.text); const parts = []; const rx = new RegExp('(' + e.hit.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|') + ')', 'gi'); let last = 0, m; while ((m = rx.exec(t))) { parts.push(t.slice(last, m.index), h('mark', { text: m[0] })); last = m.index + m[0].length; } parts.push(t.slice(last)); q.append(...parts); return [h('span', { class: 'xi', text: '5-5 Formulaic Reasoning' }), q]; }
      if (e.item === '4-1') return [h('span', { class: 'xi', text: '4-1 Generic Filler' }), h('p', { class: 'xq', text: clean(e.text) })];
      if (e.item === '2-5') return [h('span', { class: 'xi', text: '2-5 Empty Conclusion' }), h('p', { class: 'xq', text: clean(e.text) })];
      if (e.item === '1-2') return [h('span', { class: 'xi', text: '1-2 Overstated Claims' }), h('p', { class: 'xq' }, `${(e.models || []).length} model${(e.models || []).length === 1 ? '' : 's'} (${(e.models || []).join(', ') || '–'}), ${(e.datasets || []).length} dataset${(e.datasets || []).length === 1 ? '' : 's'} (${(e.datasets || []).map(d => d.split(' (')[0]).join(', ') || '–'})`)];
      if (e.item === '2-3') return [h('span', { class: 'xi', text: '2-3 Missing Cross-Section Links' }), h('p', { class: 'xq', text: `${e.F} of ${e.D} sections and equations are never pointed to from outside` })];
      return [];
    };
    const col = (p, role) => {
      const [lab, cls] = ROLE[role];
      const flagged = p.flags.length ? p.flags.map(it => h('span', { class: 'xchip', text: `${it} ${NAME[it]}` })) : [h('span', { class: 'xnone', text: 'nothing above the well-written 95th percentile' })];
      const show = p.ex.filter(e => role === 'AI' ? p.flags.includes(e.item) || e.item === '1-2' : p.flags.includes(e.item)).slice(0, 2);
      if (!show.length && role !== 'AI') { const e = p.ex.find(e => e.item === '1-2'); if (e) show.push(e); }
      return h('div', { class: 'xc ' + cls },
        h('div', { class: 'xrole' }, h('i', { class: 'qf-key ' + cls }), lab),
        h('p', { class: 'xt', text: p.title }),
        h('p', { class: 'xv', text: p.venue + (p.rating != null ? ` · reviewers: rating ${p.rating}, presentation ${p.presentation ?? '–'}` + (p.writing ? `, ${p.writing} reviews flag the writing` : '') : '') }),
        h('div', { class: 'xidx' }, h('span', { text: 'slop index' }), h('span', { class: 'xbar' }, h('i', { style: `width:${(p.index * 100).toFixed(0)}%` })), h('b', { text: f2(p.index) })),
        h('div', { class: 'xflags' }, ...flagged),
        ...show.map(e => h('div', { class: 'xqw' }, ...quote(e))));
    };
    const TABS = [['FA0171', 'LoRA merging'], ['FA0006', 'LLM judges'], ['FA0013', 'Robot policies'], ['A4S0064', 'Debate (A4S)']];
    const xcard = () => {
      const wrap = h('div', { class: 'xcard' }); const tabs = h('div', { class: 'xtabs' }); const body = h('div', { class: 'xbody' });
      const pick = code => { body.replaceChildren(...['HG', 'AI', 'HP'].map(r => col(EX[code][r], r))); tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.c === code)); };
      TABS.forEach(([c, l]) => tabs.append(h('button', { type: 'button', 'data-c': c, text: l, onclick: () => pick(c) })));
      wrap.append(h('div', { class: 'xtop' }, tabs, setup([['AI papers', `${Q1.n.triplets} from SciSlopBench (FARS ${Q1.n.fars}, Agents4Science 2025 ${Q1.n.a4s}); the ones for which both comparison papers could be found`], ['Accepted comparison paper', 'the v1 partner if from 2024 or earlier, else a new accepted paper on the same problem from 85,175 accepted papers'], ['Rejected comparison paper', `a final reject (ICLR 2017–25, NeurIPS 2021–23) with mean presentation ≤ 2.0 or writing flagged by half the reviews; ${Q1.hp_pool.n_pool.toLocaleString()} of ${Q1.hp_pool.n_rejects.toLocaleString()} rejects qualify; withdrawn papers excluded`], ['Human papers', 'arXiv v1 from 2024 or earlier, LaTeX source'], ['Scoring', 'the nine text items of this site as the Results table computes them, authorship hidden; 4-5 needs figures and is left out'], ['Index', 'mean percentile rank over the items a paper could be scored on'], ['AUROC(A>B)', 'chance that a random A paper scores above a random B paper; 0.5 = cannot tell them apart']])), body);
      pick('FA0171'); return wrap;
    };
    // ---- drift card: sentences from human papers, stock words marked
    const sent = s => { const p = h('p', { class: 'xq' }); const t = s.text; const rx = new RegExp('(' + s.hit.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).sort((a, b) => b.length - a.length).join('|') + ')', 'gi'); let last = 0, m; const parts = []; while ((m = rx.exec(t))) { parts.push(t.slice(last, m.index), h('mark', { text: m[0] })); last = m.index + m[0].length; } parts.push(t.slice(last)); p.append(...parts); return p; };
    const dcol = (lab, L) => h('div', { class: 'xc' }, h('div', { class: 'xrole', text: lab }), ...L.map(m => h('div', { class: 'xqw' }, h('span', { class: 'xi', text: `${m.role === 'HG' ? 'accepted' : 'rejected'} · ${m.venue} · arXiv ${m.year}` }), h('p', { class: 'xt', text: m.title }), ...m.hits.slice(0, 1).map(sent))));
    const dcard = () => h('div', { class: 'xcard' }, h('div', { class: 'xbody two' }, dcol('Human papers, 2020', Q1.drift_examples.early.slice(0, 2)), dcol('Human papers, late 2024', Q1.drift_examples.late.slice(0, 2))));
    // ---- later-accepted card
    const lrow = r => h('tr', {}, h('td', {}, h('span', { class: 'xt', text: r.title }), h('span', { class: 'xv', text: `${r.venue}${r.later.length ? ' → ' + r.later[0] : ''} · rating ${r.rating}, presentation ${r.pres ?? '–'}` })), h('td', { text: `${r.models} / ${r.datasets}` }), h('td', { text: f2(r.s12) }), h('td', { text: f2(r.s13) }), h('td', { text: f2(r.idx) }));
    const lcard = () => h('div', { class: 'xcard' }, h('table', { class: 'qa-tbl xl' }, h('thead', {}, h('tr', {}, h('th', { text: 'Rejected paper' }), h('th', { text: 'models / datasets' }), h('th', { text: '1-2' }), h('th', { text: '1-3' }), h('th', { text: 'index' }))),
      h('tbody', {}, h('tr', { class: 'xg' }, h('td', { colspan: 5, text: 'Later accepted at another venue' })), ...Q1.later_examples.later.map(lrow), h('tr', { class: 'xg' }, h('td', { colspan: 5, text: 'Never accepted' })), ...Q1.later_examples.never.map(lrow))));

    return [
    tldr,
    qDesign(),
    h('p', { class: 'qa-cap', text: 'Figure 1. One set of three papers on a similar topic: an accepted human paper, an AI paper, and a rejected human paper.' }),
    h('h5', { class: 'qa-how', text: 'How the data was built' }),
    h('ul', { class: 'qa-ul' },
      h('li', {}, 'We start from the 390 AI papers in SciSlopBench. Each one already has an accepted human paper on a similar topic.'),
      h('li', {}, 'For each AI paper we add a human paper on a similar topic that was rejected at ICLR or NeurIPS, and whose reviewers said the writing was bad: they gave it a presentation score of 2 or lower out of 4, or at least half of them complained about the writing.'),
      h('li', {}, `All human papers are from 2024 or earlier. We found all three papers for ${Q1.n.triplets} AI papers.`)),
    h('h5', { class: 'qa-how', text: 'How to read the numbers' }),
    h('ul', { class: 'qa-ul' },
      h('li', {}, 'Each measure gives a paper a score from 0 to 1. Higher means more slop. The slop index combines the measures into one score.'),
      h('li', {}, 'To compare two groups we use ', B('AUROC'), ': take one paper from each group at random and check which scores higher. AUROC is how often the first group wins. ', B('0.5 means the groups look the same'), '; 1.0 means the first group always scores higher.'),
      h('li', {}, B('ρ'), ' is a correlation between −1 and 1. 0 means no relation.')),

    h('p', {}, 'If a reviewer writes "this paper is hard to follow", is the paper slop? Many things our index flags, such as filler sentences, repeated paragraphs, or a conclusion that copies the abstract, sound like plain bad writing. So it is fair to ask whether ', h('a', { href: 'https://arxiv.org/abs/2610.00531', target: '_blank', rel: 'noopener', text: 'Science or Slop?' }), ' built a writing-quality score and gave it a new name.'),
    h('p', {}, 'Our first benchmark could not answer this. It compared each AI paper with one accepted human paper only. When the AI paper scored higher, we could not tell whether that was because an AI wrote it or because it was written less well. Adding a badly written human paper separates the two. What we found:'),
    h('ol', { class: 'qa-ol' },
      h('li', {}, B('Badly written human papers score like well-written ones. AI papers score higher than both. '), '(Experiments 1 and 2)'),
      h('li', {}, B('Among rejected papers, the slop score follows the reviewers’ overall rating, not their presentation score. '), '(Experiment 3)')),

    h('h4', { text: 'Is slop just bad writing?' }),
    exp(1, 'Does a badly written paper look like an AI paper?'),
    why('If the index just rewarded good writing, a paper that reviewers called hard to read would score close to an AI paper. We check where it actually lands.'),
    h('details', { class: 'qa-more' }, h('summary', { text: 'The ten measures and what each one counts' }), qTable(['Item', 'What it counts'], [
      ['1-2 Overstated Claims', 'results from a single model or a single dataset, or added compute that is never costed'],
      ['1-3 Evidence Gap', 'result claims with no table or figure behind them'],
      ['1-4 Unclear Links to Prior Work', 'cited methods that the paper never relates to its own'],
      ['2-3 Missing Cross-Section Links', 'sections and equations never pointed to from where they are used'],
      ['2-5 Empty Conclusion', 'conclusion sentences copied from the abstract or introduction'],
      ['4-1 Generic Filler', 'sentences that restate a result and add nothing'],
      ['4-2 Unexplained Terms', 'terms that appear abruptly, without a gloss'],
      ['4-4 Redundant Repetition', 'body sections that repeat an earlier section'],
      ['5-5 Formulaic Reasoning', 'stock phrases standing in for an argument'],
      ['3-2 Single-Source Method', 'whether the method\u2019s parts come from one earlier paper at most (shown as the share of papers where they do)']]), h('p', { class: 'qa-cap' }, 'Each is a rate between 0 and 1. Full definitions and examples are on the ', h('a', { href: './#studio' , text: 'main page' }), '.')),
    res(B('It scores like the accepted human paper, not like the AI paper'), ' (Figure 2). On every measure the two human groups are close: AUROC between them is 0.46 to 0.57, near the 0.5 of "no difference". The AI papers score higher than both, with AUROC 0.61 to 0.88. Combining the measures into one index gives the same picture (Figure 3). Only ', B(`${ix.above_ai_median.HP} of 226`), ' rejected papers score above a typical AI paper.'),
    qfig(2, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: r.all.mean })), { labelW: 214 }), 'Average score on each measure for the three groups. The two human dots sit close together; the red AI dot sits to the right. Hover a dot for the value.', legend(['AI', 'HG', 'HP'])),
    qfig(3, indexHist(), 'The slop index for every paper, one row per group. The dashed line is the median AI paper.'),

    h('p', {}, `The newest measure, Single-Source Method, behaves the same way. ${Math.round(byId['3-2'].all.mean.AI * 100)}% of AI papers build their method on one earlier paper or none, against ${Math.round(byId['3-2'].all.mean.HG * 100)}% of accepted and ${Math.round(byId['3-2'].all.mean.HP * 100)}% of rejected papers.`),
    mean_(B('Bad writing does not explain a high slop score.'), ' Papers that reviewers rejected for their writing do not get one. The reverse is also true: ', B('the index does not tell you whether a paper is well written.'), ' For that you still need a human reader.'),

    exp(2, 'Is the result a side effect of how we picked the papers?'),
    why('We made several choices when building the data: what counts as badly written, how close the topics must be, and which AI papers to use. Human papers are also longer than AI papers. Any of these could produce the result by accident.'),
    res(B('Changing these choices does not change the result'), ' (table below). The two human groups stay close, and the AI papers stay higher. One thing does matter: where the AI papers come from (Figure 4). Papers from FARS, a single automated system, are told apart almost perfectly (AUROC ', f2(ix.fars.auc['AI>HP']), '). Papers from Agents4Science, written by many different teams, less so (', f2(ix.a4s.auc['AI>HP']), '). Three measures, Unclear Links to Prior Work, Empty Conclusion and Redundant Repetition, only work on FARS papers.'),
    qTable(['Sets used', 'sets', 'AI vs accepted', 'AI vs rejected', 'rejected vs accepted'], Q1.subsets.map((r, i) => [['rejected for a low presentation score', 'rejected because reviews complained about the writing', 'same research problem as the AI paper', 'rejected paper not much longer than the AI paper'][i], String(r.n), f2(r['AI>HG']), f2(r['AI>HP']), f2(r['HP>HG'])])),
    h('p', { class: 'qa-cap', text: 'AUROC of the slop index on each subset. "Not much longer" = at most 1.5× the AI paper.' }),
    qfig(4, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: { AI: r.fars.auc['AI>HP'], HP: r.a4s.auc['AI>HP'] } })), { groups: ['AI', 'HP'], x0: .3, x1: 1, ticks: [.3, .5, .7, .9], chance: .5, labelW: 214 }),
      'How well each measure tells AI papers from badly written human papers (AUROC), for the two AI sources. Red: FARS (102 sets). Grey: Agents4Science (124 sets). At the dashed line (0.5) the measure cannot tell them apart.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key ai' }), 'FARS'), h('span', {}, h('i', { class: 'qf-key hp' }), 'Agents4Science'))),

    mean_(B('The result does not come from how we picked the papers.'), ' But ', B('three measures describe one AI system, not AI papers in general.'), ' A measure should be tested on papers from more than one AI system before we call it a sign of AI writing.'),

    h('h4', { text: 'What else we found' }),
    exp(3, 'If not the writing, what do reviewers react to?'),
    why('Each rejected paper comes with its reviews, including a presentation score and an overall rating. If the index is not about writing, it should not follow the presentation score. Does it follow anything the reviewers gave?'),
    res('It does not follow the presentation score (ρ = ', f2(Q1.hp.corr.index.presentation.rho), '). ', B('It follows the overall rating'), ': papers rated lower have higher slop scores (ρ = ', f2(Q1.hp.corr.index.rating.rho), '). ', `${Q1.hp.later.n_later}`, ' of these papers were later accepted at another venue. Their rejected versions had fewer overstated claims and fewer claims without evidence than the papers that were never accepted (Figure 5). The writing-style measures showed no difference.'),
    qfig(5, dumbbell(['1-2', '1-3', '2-3', '4-4', '5-5', '4-1'].map(it => ({ label: byId[it].name, sub: it, vals: { HG: Q1.hp.later.items[it].later, HP: Q1.hp.later.items[it].never } })), { groups: ['HG', 'HP'], labelW: 214 }),
      'Rejected papers that were later accepted elsewhere (hollow, 27 papers) and those that never were (filled, 199). Average score on each measure, measured on the rejected version.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key hg' }), 'later accepted elsewhere'), h('span', {}, h('i', { class: 'qf-key hp' }), 'never accepted'))),

    mean_(B('Reviewers give lower ratings to papers with more slop, but not because of the writing.'), ' The two measures that set the later-accepted papers apart are both about evidence: testing a claim widely enough, and backing results with a table or figure. The link is weak, and we only have the rejected versions, so we cannot say what the authors changed.'),

    exp(4, 'Do AI papers all fail in the same way?'),
    why('If AI papers shared one underlying problem, the measures would rise and fall together, and a single measure would be enough to spot them.'),
    res('They do not rise together. A paper’s score on one measure tells you almost nothing about its score on another (ρ between −0.02 and 0.03). Still, ', B('most AI papers fail several measures'), ': 61% are unusually high on two or more, against 5% of accepted and 4% of rejected human papers (Figure 6).'),
    qfig(6, p95bars('all'), 'How many measures each paper is unusually high on (higher than 95% of accepted human papers).'),
    mean_(B('Each AI paper has its own mix of problems.'), ' One overclaims, another repeats itself, a third pads its results. This is why combining measures works better than any single one, and why ', B('a list of the measures a paper fails is more useful than one number.')),

    exp(5, 'Do the reviewers of AI papers notice the slop?'),
    why('In Experiment 3, human reviewers gave lower ratings to sloppier human papers. The Agents4Science conference reviewed AI-written papers with three AI reviewers and sometimes one human reviewer. Do their scores follow slop too?'),
    res(B('No.'), ' None of the four reviewers’ scores goes down as the slop score goes up (table below). Only one AI reviewer reacted to one measure, Evidence Gap.'),
    qTable(['Reviewer', 'n', 'ρ with the slop index'], ['AIRev1', 'AIRev2', 'AIRev3', 'mean_ai', 'Human'].map(k => [Q1.a4s_reviews[k].label, String(Q1.a4s_reviews[k].n), f2(Q1.a4s_reviews[k].rho) + (Q1.a4s_reviews[k].p < .05 ? ' *' : '')])),
    h('p', { class: 'qa-cap', text: 'Correlation between each reviewer\u2019s score and the paper\u2019s slop index. A negative value would mean sloppier papers got lower scores.' }),

    mean_(B('At Agents4Science, papers with more slop did not get worse reviews.'), ' If AI reviewers do not react to slop, a review process that relies on them will let it through. This is an early result: the human reviewer scored only 46 papers, and these are different papers from Experiment 3.'),

    h('h4', { text: 'What comes next' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'Finish Unexplained Terms on the rejected papers and run the figure item, 4-5 Unclear Figures (the figures are downloaded; the vision pass is not).' }),
      h('li', { text: 'Retire or re-source the three items that only work on FARS (Unclear Links to Prior Work, Empty Conclusion, Redundant Repetition).' }),
      h('li', { text: 'Compare the 27 recovered papers\u2019 rejected and accepted versions, item by item, to see what changed.' })),
    h('h4', { text: 'Fine print' }),
    h('ul', { class: 'qa-ul small' },
      h('li', { text: 'Topic match on the rejected side is mostly field-level (211 of 226). The 15 same-problem sets give the same answer, but 15 is small.' }),
      h('li', { text: 'Unexplained Terms covers 88 of 226 rejected papers (the run hit a spend limit). The classifier drops it in the two comparisons that involve that group.' }),
      h('li', { text: 'Missing Cross-Section Links reads cross-references from LaTeX. Agents4Science AI papers are PDFs rebuilt into TeX, so their score on it is pessimistic; FARS alone gives the same AUROC.' }),
      h('li', { text: 'The Formulaic Reasoning word list was learned on half of the v1 pairs, which favours it on AI and v1 human papers. The rejected papers were never seen.' }),
      h('li', { text: '"Badly written" is the reviewers’ call, not ours. It mixes typos, structure and clarity. It is the only large label of writing quality there is.' })),
    h('p', { class: 'qa-cap', text: 'Data and scripts: v2/question/Q1_ai_slop_vs_human_poor_writing. The numbers behind every figure and card are in q1data.js on this page.' })];
  } },
  f2: { title: 'How does scientific slop relate to different review scores?', tag: 'v1 result · v2 running', body: () => [
    h('p', { text: 'Reviewers never see a slop score. If slop is something they notice anyway, it should show up in the scores they give.' }),
    h('h4', { text: 'What v1 showed' }),
    h('p', { text: 'We scored 1,177 ICLR submissions from 2017 to 2025 and 691 from ICLR 2026, each with its review scores. AI-likeness falls from 26% for papers rated 2 to 12% for papers rated 9. On ICLR 2026 the index correlates negatively with all four review dimensions (overall, soundness, presentation, contribution); no other system in the comparison did that in all four.' }),
    h('p', { text: 'Within each year, the index ranks a rejected paper above an accepted one better than chance in all nine years. Binoculars does so in two.' }),
    qYears([[2017, .510], [2018, .596], [2019, .555], [2020, .574], [2021, .593], [2022, .669], [2023, .542], [2024, .669], [2025, .721]]),
    h('p', { class: 'qa-cap', text: 'Rejected vs. accepted AUROC inside each ICLR year, v1 index. 0.5 is chance.' }),
    h('p', { text: 'The trend is not monotonic: 2023 drops back to 0.54.' }),
    h('h4', { text: 'What v2 adds' }),
    h('p', { text: 'Six counts can only say “more slop, lower score”. With 10 items we can ask which kind of slop goes with which dimension, for example whether overstated claims track soundness and undefined terms track presentation. The plan starts from ICLR 2027 submissions, then compares years and venues (NeurIPS, ICML, ACL).' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
  f3: { title: 'Are AI reviewers more forgiving of scientific slop?', tag: 'not run yet', body: () => [
    h('p', { text: 'A growing share of reviews is written with an LLM, and some venues now use AI reviewers officially. If an AI reviewer goes easy on the failures an AI author makes, the two problems compound.' }),
    h('h4', { text: 'Setup' }),
    h('p', { text: 'Take one paper with its measured slop, one human review and one AI review. Compare two things: how much of the measured slop each review points out, and how much the score drops per unit of slop. Then check whether the gap widens when the author is an AI.' }),
    h('h4', { text: 'Data' }),
    h('p', { text: 'No single dataset has everything, so we use three. Agents4Science 2025 has AI-written papers with 456 AI reviews and 55 human reviews. Our 390 SciSlopBench pairs already have two AI reviewers run on both sides. ICLR 2026 has reviews labelled by Pangram as human-written (32,938) or AI-generated (15,899), often on the same paper.' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
  f4: { title: 'Do reviewers catch the scientific flaws we measure?', tag: 'Scientific Slop Index · Question 4', body: () => {
    const D = window.Q4 || {}, B = t => h('b', { text: t });
    const pct = x => x == null ? '–' : Math.round(x * 100) + '%', pct1 = x => x == null ? '–' : (x * 100).toFixed(1) + '%';
    const NAME = { '1-2b': 'Narrow Evaluation', '1-2d': 'Missing Cost Accounting', '1-2o': 'Overstated Claims, other', '1-3': 'Evidence Gap', '1-4': 'Unclear Links to Prior Work', '2-3': 'Missing Cross-Section Links', '2-5': 'Empty Conclusion', '3-2': 'Single-Source Method', '4-1': 'Generic Filler', '4-2': 'Unexplained Terms', '4-4': 'Redundant Repetition', '4-5': 'Unclear Figures', '5-5': 'Formulaic Reasoning' };
    const KIND = { CLARITY: 'Writing hard to follow', SOUNDNESS: 'Technical or method flaw', DETAILS: 'Missing details', MORE_EXP: 'More ablations or analysis', BASELINES: 'Missing baselines', MOTIVATION: 'Weak motivation', NOVELTY: 'Limited novelty', SCOPE: 'Limited scope', RELATED: 'Missing references', RESULTS: 'Weak results', OTHER: 'Other' };
    const part = (lab, cls) => (...k) => h('div', { class: 'xp ' + cls }, h('span', { class: 'xp-l', text: lab }), h('p', {}, ...k));
    const why = part('Why', 'why'), res = part('Result', 'res'), mean_ = part('What it means', 'mean');
    const exp = (n, q) => h('div', { class: 'exp' }, h('span', { class: 'exp-n', text: `Experiment ${n}` }), h('h5', { text: q }));
    const N = D.n || {}, nt = D.n_total || {}, NM = D.named || {}, LK = D.link || {}, F = D.fail || {}, SM = D.same || {}, C = D.comp || {};
    const hgN = N['human→HG'] || {}, hpN = N['human→HP'] || {}, haN = N['human→AI'] || {}, aaN = N['ai→AI'] || {};
    const byline = h('div', { class: 'qa-by' },
      h('div', {}, h('h3', { text: 'Authors' }), h('p', { text: 'Yerim Oh, Young-Jun Lee, Jaewoo Ahn, Seungone Kim, Jinu Lee, Jinheon Baek, Gunhee Kim, Dongyeop Kang' })),
      h('div', {}, h('h3', { text: 'Published' }), h('p', { text: 'November 17, 2026' })),
      h('div', {}, h('h3', { text: 'Data' }), h('p', {}, `${nt.papers} papers · ${nt.reviews.toLocaleString()} reviews · `, h('a', { href: 'https://huggingface.co/datasets/yerim0210/Scientific_Slop', target: '_blank', rel: 'noopener', text: 'SciSlopBench' }))));
    const hp = NM['human→HP'] || {}, hg = NM['human→HG'] || {}, ha = NM['human→AI'] || {}, aa = NM['ai→AI'] || {};
    const style = ['2-5', '4-1', '4-4', '5-5'].reduce((a, k) => a + (C.human.share[k] || 0), 0);
    const slopShare = Object.entries(C.human.share).filter(([k]) => !KIND[k]).reduce((a, [, v]) => a + v, 0);
    const tldr = h('div', { class: 'tldr' }, h('span', { class: 'tldr-l', text: 'TL;DR' }),
      h('p', {}, `We split ${nt.human_reviews.toLocaleString()} human and ${nt.ai_reviews} AI-written reviews of ${nt.papers} papers into single criticisms (${nt.points.toLocaleString()} in all). Then we checked which criticisms are one of our slops, and whether they land on the papers where our measures find that slop.`),
      h('p', {}, B('Reviewers name some slops often and others almost never.'), ` About one review in three says the evaluation is too narrow. Empty conclusions, filler, repetition and stock phrasing together make up ${pct1(style)} of all criticisms.`),
      h('p', {}, B('When reviewers name a slop, it is not where we measure it.'), ` Reviews of papers that fail Narrow Evaluation raise it ${pct(LK['1-2b'].named_hi)} of the time; reviews of papers that pass, ${pct(LK['1-2b'].named_lo)}. No item does better.`),
      h('p', {}, B('This includes AI papers.'), ` ${pct(F['1-2b'].AI)} of AI papers fail Narrow Evaluation, against ${pct(F['1-2b'].HG)} of accepted human papers. Human reviewers of AI papers raise it about as often as for human papers.`));
    // Figure 1: what human reviewers criticise (human papers), slop items highlighted
    const rows1 = Object.entries(C.human.share).sort((a, b) => b[1] - a[1]).map(([k, v]) => [KIND[k] || `${k} ${NAME[k]}`, v, !KIND[k]]);
    // Figure 2: share of human reviews naming each item
    const ITEMS2 = ['1-2b', '1-2o', '4-2', '4-5', '1-2d', '1-4', '1-3', '3-2', '2-3', '4-1', '4-4', '2-5', '5-5'];
    const fig2 = dumbbell(ITEMS2.map(k => ({ label: NAME[k], sub: k.replace('o', ''), vals: { HG: hg[k], HP: hp[k], AI: ha[k] } })), { x0: 0, x1: .4, ticks: [0, .1, .2, .3, .4], fmt: pct, labelW: 214 });
    // Figure 3: same item, reviews of high-slop papers vs the rest
    const ITEMS3 = ['1-2b', '1-2d', '1-4', '3-2', '2-3', '4-1', '4-4', '2-5', '5-5'];
    const fig3 = dumbbell(ITEMS3.map(k => ({ label: NAME[k], sub: k, vals: { AI: LK[k].named_hi, HG: LK[k].named_lo } })), { groups: ['AI', 'HG'], x0: 0, x1: .4, ticks: [0, .1, .2, .3, .4], fmt: pct, labelW: 214 });
    const quotes = qTable(['Item', 'A reviewer, in their words', 'Human reviews naming it'], ['1-2b', '1-2d', '1-3', '1-4', '2-3', '3-2', '4-1', '4-2', '4-4', '4-5', '5-5'].map(k => {
      const e = D.examples[k], all = (hgN.reviews * hg[k] + hpN.reviews * hp[k]) / (hgN.reviews + hpN.reviews);
      return [`${k} ${NAME[k]}`, `“${e.q}”`, pct1(all)]; }));
    return [
    byline, tldr,
    h('h5', { class: 'qa-how', text: 'How the data was built' }),
    h('ul', { class: 'qa-ul' },
      h('li', {}, 'We use the 226 sets of three papers from ', h('a', { href: '#1', text: 'Question 1' }), ': an AI paper from SciSlopBench, an accepted human paper on a similar topic, and a rejected human paper whose reviewers complained about the writing. Every paper already has our measures.'),
      h('li', {}, `Reviews are public for ${hpN.papers} rejected papers (ICLR and NeurIPS, ${hpN.reviews} reviews) and ${hgN.papers} accepted ones (ICLR 2017–25 and NeurIPS 2021–22, ${hgN.reviews} reviews). The AI papers have ${haN.reviews} human reviews (Agents4Science, ${haN.papers} papers) and ${aaN.reviews} AI-written reviews (${aaN.papers} papers: Agents4Science’s three AI reviewers and, for FARS, paperreview.ai).`),
      h('li', {}, 'A language model (Claude Sonnet) splits the weakness part of each review into single criticisms. For each it copies the reviewer’s exact words and picks one of our eleven slops or one of eleven other kinds, such as limited novelty or missing baselines. Code checks the copied words are really in the review; ', B(`${D.label_log.not_verbatim} of ${D.label_log.points.toLocaleString()}`), ' were not and were dropped. The model is never asked whether the reviewer is right.')),
    h('h5', { class: 'qa-how', text: 'How to read the numbers' }),
    h('ul', { class: 'qa-ul' },
      h('li', {}, 'Most numbers are the ', B('share of reviews'), ' that raise a given problem at least once.'),
      h('li', {}, B('AUROC'), ' here asks: pick one review that raised the problem and one that did not. How often does the paper behind the first score higher on our measure? ', B('0.5 means the measure and the reviewers do not agree at all.'))),

    h('p', {}, 'Our measures say where a paper breaks. A review says what a reader noticed. If the two line up, reviews could check our measures, and our measures could tell reviewers where to look. If they do not, each sees something the other misses. What we found:'),
    h('ol', { class: 'qa-ol' },
      h('li', {}, B('A quarter of what reviewers criticise is one of our slops, almost all of it about evidence and terms. '), '(Experiments 1 and 2)'),
      h('li', {}, B('A paper that has a slop is no more likely to be criticised for it. '), '(Experiment 3)'),
      h('li', {}, B('The same holds for AI papers, which have far more of some slops. '), '(Experiment 4)')),

    h('h4', { text: 'What reviewers point out' }),
    exp(1, 'How much of a review is about slop?'),
    why('Reviewers have a lot to say: novelty, missing baselines, flawed setups. We first check how much of it overlaps with our eleven slops at all.'),
    res(B(`${pct(slopShare)} of criticisms in human reviews of human papers are one of our slops`), ` (Figure 1). The rest is mostly writing that is hard to follow, technical flaws, missing details and requests for more experiments. AI reviewers spend less on our slops (${pct(D.n && D.comp.ai ? Object.entries(D.comp.ai.share).filter(([k]) => !KIND[k]).reduce((a, [, v]) => a + v, 0) : null)}) and more on technical flaws and missing details.`),
    qfig(1, h('div', { class: 'qa-bars' }, ...rows1.map(([l, v, o]) => h('div', { class: 'qa-br' + (o ? ' ours' : '') }, h('span', { class: 'qa-bl', text: l }), h('span', { class: 'qa-bt' }, h('i', { style: `width:${(v / rows1[0][1] * 100).toFixed(1)}%` })), h('span', { class: 'qa-bv', text: (v * 100).toFixed(1) + '%' })))), `Share of all ${C.human.n_points.toLocaleString()} criticisms in ${C.human.n_reviews.toLocaleString()} human reviews of human papers, by kind. Highlighted rows are our slops.`),
    mean_('Most of a review is about things our index does not try to measure. ', B('A slop score is not a review score'), ' and should not be read as one.'),

    exp(2, 'Which slops do reviewers name?'),
    why('A slop that no reviewer ever names may still matter, but it is invisible in peer review. We count how often each one comes up.'),
    res(B('Three kinds come up often: narrow evaluation, unexplained terms and unclear figures.'), ` About a third of reviews say the method was tried on too few models or datasets. Rejected papers draw more complaints about terms (${pct(hp['4-2'])} of reviews) and figures (${pct(hp['4-5'])}) than accepted ones (${pct(hg['4-2'])}, ${pct(hg['4-5'])}). `, B('Four slops are almost never named:'), ` Empty Conclusion, Generic Filler, Redundant Repetition and Formulaic Reasoning, each in ${pct1(Math.max(hp['2-5'], hp['4-1'], hp['4-4'], hp['5-5']))} of reviews of rejected papers or fewer.`),
    qfig(2, fig2, `Share of human reviews that name each slop at least once. Hollow: accepted human papers (${hgN.reviews} reviews). Filled grey: rejected human papers (${hpN.reviews}). Red: AI papers (${haN.reviews}, Agents4Science; few, so read loosely). “Overstated Claims, other” is any claim the reviewer finds too strong for the evidence that is not about breadth or cost.`,
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key hg' }), 'accepted human paper'), h('span', {}, h('i', { class: 'qf-key hp' }), 'rejected human paper'), h('span', {}, h('i', { class: 'qf-key ai' }), 'AI paper'))),
    h('p', { text: 'What it sounds like when a reviewer does name one:' }),
    quotes,
    h('p', { class: 'qa-cap', text: 'One real quote per slop, all from human reviews. Last column: accepted and rejected human papers together. Unclear Figures here means any figure; our measure looks only at the method figure.' }),
    mean_(B('The slops reviewers miss are the ones about how the text is put together'), ': a conclusion that copies the abstract, sentences that add nothing, set phrases in place of reasons. Reviewers read for the science and skip past these. A tool could point them out.'),

    h('h4', { text: 'Do they land where we measure them?' }),
    exp(3, 'Does a paper with a slop get criticised for it?'),
    why('If reviewers and our measures saw the same thing, a paper that fails an item should draw that complaint more often than a paper that passes.'),
    res(B('It does not, for any item.'), ` Reviews of papers that fail Narrow Evaluation raise it ${pct(LK['1-2b'].named_hi)} of the time; reviews of papers that pass, ${pct(LK['1-2b'].named_lo)}. Missing Cost Accounting: ${pct(LK['1-2d'].named_hi)} vs ${pct(LK['1-2d'].named_lo)}. For every item but one, the 95% interval of the AUROC includes 0.5 (table below). The exception, Single-Source Method, goes the wrong way: papers whose method draws on one earlier paper are a little less often called “X with a small change” (${pct1(LK['3-2'].named_hi)} vs ${pct1(LK['3-2'].named_lo)}).`),
    qfig(3, fig3, `Share of human reviews that name the item. Red: reviews of papers that fail it (for items without a pass/fail rule, papers in the top quarter of its score). Hollow: reviews of the other papers. ${LK['1-2b'].n.toLocaleString()} reviews of human and AI papers. Evidence Gap and Unexplained Terms are left out: too few papers were measured or above the cut.`,
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key ai' }), 'paper has the slop'), h('span', {}, h('i', { class: 'qf-key hg' }), 'paper does not'))),
    qTable(['Item', 'Reviews', 'AUROC [95% CI]'], ITEMS3.map(k => [`${k} ${NAME[k]}`, LK[k].n.toLocaleString(), `${LK[k].auroc.toFixed(2)} [${LK[k].ci[0].toFixed(2)}, ${LK[k].ci[1].toFixed(2)}]`])),
    h('p', { class: 'qa-cap', text: 'AUROC of the item score: reviews that name the item vs reviews that do not. 0.5 = no agreement. Bootstrap over reviews.' }),
    mean_('A reviewer complaining about narrow evaluation tells you little about whether the paper actually used one model and one dataset, and the reverse. ', B('Reviews cannot serve as ground truth for these measures'), ', and the measures cannot stand in for a reviewer. They see different things.'),

    exp(4, 'Do reviewers of AI papers notice what AI papers lack?'),
    why('AI papers fail some items far more often than human papers. If reviewers noticed, those complaints should rise on AI papers.'),
    res(B(`${pct(F['1-2b'].AI)} of AI papers fail Narrow Evaluation, against ${pct(F['1-2b'].HG)} of accepted and ${pct(F['1-2b'].HP)} of rejected human papers.`), ` Human reviewers name it in ${pct(ha['1-2b'])} of reviews of AI papers, close to ${pct(hg['1-2b'])} and ${pct(hp['1-2b'])} for the human papers. AI reviewers name it more (${pct(aa['1-2b'])}). Single-Source Method shows the same gap: ${pct(F['3-2'].AI)} of AI papers fail it and no human review of an AI paper names it.`),
    qTable(['Item', 'Fails: AI / accepted / rejected', 'Named, human reviews: AI / accepted / rejected', 'Named, AI reviews of AI papers'], ['1-2b', '1-2d', '3-2'].map(k => [`${k} ${NAME[k]}`, `${pct(F[k].AI)} / ${pct(F[k].HG)} / ${pct(F[k].HP)}`, `${pct(ha[k])} / ${pct(hg[k])} / ${pct(hp[k])}`, pct(aa[k])])),
    h('p', { class: 'qa-cap', text: `The three items with a pass/fail rule. Human reviews of AI papers: ${haN.reviews} reviews of ${haN.papers} Agents4Science papers. AI reviews: ${aaN.reviews} reviews of ${aaN.papers} papers.` }),
    h('p', {}, `On the ${SM.human.papers} Agents4Science papers that have both kinds of review, the AI reviewers name narrow evaluation more often (${pct(SM.ai['1-2b'])} vs ${pct(SM.human['1-2b'])}), and the human reviewers name unclear figures (${pct(SM.human['4-5'])} vs ${pct(SM.ai['4-5'])}) and missing cross-section links (${pct(SM.human['2-3'])} vs ${pct(SM.ai['2-3'])}) more often. This is a first look at `, h('a', { href: '#3', text: 'Question 3' }), '.'),
    mean_(B('Human reviewers do not raise narrow evaluation more often on AI papers'), `, although ${pct(F['1-2b'].AI)} of AI papers fail it against ${pct(F['1-2b'].HG)} of accepted human papers. This rests on ${haN.reviews} human reviews of AI papers, so it is a first sign rather than a finding. Question 3 tests it on more papers.`),

    h('h4', { text: 'What comes next' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'Check the labels by hand: 300 criticisms, two people, agreement per kind.' }),
      h('li', { text: 'Get reviews for more accepted papers. OpenReview blocked our requests, so only 43 accepted papers have reviews.' }),
      h('li', { text: 'Run the same labelling on ICLR 2026 reviews, where Pangram marks each review as human- or AI-written (Question 3).' }),
      h('li', { text: 'Turn the quotes for each slop into a list of reviewer phrasings, for a tool that points reviewers to the slop they tend to miss.' })),
    h('h4', { text: 'Fine print' }),
    h('ul', { class: 'qa-ul small' },
      h('li', { text: 'A reviewer kind is broader than our measure. Unexplained Terms counts any undefined symbol or term, our measure only made-up terms that come with a result before they are explained. Unclear Figures counts any figure; our measure only the method figure (and is not run on these papers yet).' }),
      h('li', { text: 'Rejected papers have about four reviews each, AI papers one human review. We compare shares of reviews, not of papers, so the count of reviews per paper does not inflate a group.' }),
      h('li', { text: 'Older ICLR reviews and Agents4Science reviews have no separate weakness field. For these the model reads the whole review and keeps only the criticisms.' }),
      h('li', { text: 'One model, one pass. The labels have not been checked against people yet.' })),
    h('p', { class: 'qa-cap', text: 'Data and scripts: v2/question/Q4_reviewer_weakness_by_slop_type. The numbers behind every figure are in q4data.js on this page.' })];
  } },
};
// left table of contents: one entry per section heading; buttons, not #anchors, because the hash picks the question
let tocIO = null;
function toc() {
  const hs = [...document.querySelectorAll('.qa-b h4')]; if (tocIO) tocIO.disconnect();
  if (hs.length < 2) return;
  const items = hs.map(hd => h('button', { type: 'button', class: 'qa-ti', onclick: () => hd.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }) }, h('i'), hd.textContent));
  $('.qa-h').after(h('aside', { class: 'qa-tocw' }, h('nav', { class: 'qa-toc', 'aria-label': 'Sections' }, h('p', { class: 'qa-tt', text: 'Contents' }), ...items)));
  const on = i => items.forEach((b, j) => b.classList.toggle('on', j === i));
  const pick = () => { let k = 0; hs.forEach((hd, i) => { if (hd.getBoundingClientRect().top < innerHeight * .35) k = i; }); if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) k = hs.length - 1; on(k); };
  tocIO = { disconnect: () => removeEventListener('scroll', pick) }; addEventListener('scroll', pick, { passive: true }); pick();
}
const ORDER = ['f1', 'f2', 'f3', 'f4'];
function show() {
  const n = Math.min(4, Math.max(1, parseInt(location.hash.slice(1), 10) || 1)), p = QPOST[ORDER[n - 1]];
  document.title = p.title + ' · Scientific Slop Index';
  const prev = n > 1 ? h('a', { href: '#' + (n - 1), text: '← ' + QPOST[ORDER[n - 2]].title }) : h('span'), next = n < 4 ? h('a', { href: '#' + (n + 1), text: QPOST[ORDER[n]].title + ' →' }) : h('span');
  $('#qa').replaceChildren(h('a', { class: 'qa-back', href: './#questions', text: '← Four questions' }),
    h('header', { class: 'qa-h' }, h('span', { class: 'qa-n', text: 'Question ' + n }), h('h1', { text: p.title }), h('span', { class: 'qa-tag', text: p.tag })),
    h('div', { class: 'qa-b' }, ...p.body()), h('nav', { class: 'qa-pn' }, prev, next));
  toc();
  const figs = document.querySelectorAll('.qa-fig');
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .35 }); figs.forEach(f => io.observe(f)); }
  else figs.forEach(f => f.classList.add('in'));
  scrollTo(0, 0);
}
addEventListener('hashchange', show); show();
