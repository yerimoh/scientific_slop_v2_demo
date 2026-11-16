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
      h('p', {}, 'Does our slop index just measure bad writing? To find out, we compared three kinds of paper: ', B('an AI-written paper'), ', ', B('an accepted human paper'), ' on a similar topic, and ', B('a rejected human paper'), ' on a similar topic whose reviewers complained about the writing. ', `${Q1.n.triplets} such sets.`),
      h('p', {}, 'On nine slop measures, ', B('the rejected papers are hard to tell from the accepted ones'), ` (AUROC ${f2(ix.all.auc['HP>HG'])}; 0.50 would mean no difference at all). `, B('The AI papers are easy to tell from either'), ` (${f2(ix.all.auc['AI>HG'])} against the accepted papers, ${f2(ix.all.auc['AI>HP'])} against the rejected ones). Whatever the AI papers have more of, the badly written human papers do not have it.`),
      h('p', {}, 'Two further observations, each explained in its own section below: stock phrasing in human papers has risen since late 2022, and among the rejected papers the slop scores vary with the overall rating rather than with the presentation score.'));
    // ---- teaser: three panels, task → what we did → number
    const tz = (lab, q, vis, did, big, small) => h('div', { class: 'tz-p' }, h('div', { class: 'tz-l', text: lab }), h('div', { class: 'tz-q', text: q }), vis, h('div', { class: 'tz-do', text: did }), h('div', { class: 'tz-out' }, h('b', { text: big }), h('span', { text: small })));
    const oneSheet = (who, marks) => { const f = sFig('0 0 300 118', `${sPaper(108, 10, 84, 100)}${sBadge(108, 10, who)}${marks}`, who === 'ai' ? 'an AI paper' : 'a human paper'); f.className = 'qa-fig q1s tz-vis'; return f; };
    const nflag = g => Q1.p95.all[g].reduce((a, p, i) => a + p * i, 0);
    const teaser = h('div', { class: 'tz' },
      tz('Accepted human paper', 'An accepted paper on a similar topic', oneSheet('human', ''), `Mean slop index ${f2(ix.all.mean.HG)}`, `${nflag('HG').toFixed(1)} of 9`, 'items flagged on average (flag = above this group\u2019s 95th percentile)'),
      tz('AI paper', 'Written end to end by an AI system', oneSheet('ai', sLoop(150, 42, 30, 7, .2) + sSquig(122, 178, 86, .5)), `Mean slop index ${f2(ix.all.mean.AI)}`, `${nflag('AI').toFixed(1)} of 9`, 'items flagged on average'),
      tz('Rejected human paper', 'A rejected paper on a similar topic; reviewers flagged the writing', oneSheet('human', sS([[124, 66], [176, 63]], .9, .8)), `Mean slop index ${f2(ix.all.mean.HP)}`, `${nflag('HP').toFixed(1)} of 9`, 'items flagged on average'));
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
    const dcol = (lab, L) => h('div', { class: 'xc' }, h('div', { class: 'xrole', text: lab }), ...L.map(m => h('div', { class: 'xqw' }, h('span', { class: 'xi', text: `${m.role === 'HG' ? 'accepted' : 'rejected'} · ${m.venue} · arXiv ${m.year}` }), h('p', { class: 'xt', text: m.title }), ...m.hits.slice(0, 2).map(sent))));
    const dcard = () => h('div', { class: 'xcard' }, h('div', { class: 'xbody two' }, dcol('Human papers, 2020', Q1.drift_examples.early.slice(0, 2)), dcol('Human papers, late 2024', Q1.drift_examples.late.slice(0, 2))));
    // ---- later-accepted card
    const lrow = r => h('tr', {}, h('td', {}, h('span', { class: 'xt', text: r.title }), h('span', { class: 'xv', text: `${r.venue}${r.later.length ? ' → ' + r.later[0] : ''} · rating ${r.rating}, presentation ${r.pres ?? '–'}` })), h('td', { text: `${r.models} / ${r.datasets}` }), h('td', { text: f2(r.s12) }), h('td', { text: f2(r.s13) }), h('td', { text: f2(r.idx) }));
    const lcard = () => h('div', { class: 'xcard' }, h('table', { class: 'qa-tbl xl' }, h('thead', {}, h('tr', {}, h('th', { text: 'Rejected paper' }), h('th', { text: 'models / datasets' }), h('th', { text: '1-2' }), h('th', { text: '1-3' }), h('th', { text: 'index' }))),
      h('tbody', {}, h('tr', { class: 'xg' }, h('td', { colspan: 5, text: 'Later accepted at another venue' })), ...Q1.later_examples.later.map(lrow), h('tr', { class: 'xg' }, h('td', { colspan: 5, text: 'Never accepted' })), ...Q1.later_examples.never.map(lrow))));

    return [
    tldr, teaser,
    h('p', {}, 'If a reviewer writes "the paper is hard to follow", is that slop? It is tempting to say yes. Most of the things our index flags, the filler sentences, the repeated paragraphs, the conclusion that restates the abstract, look like things a careful writer would have fixed. So a fair question about ', h('a', { href: 'https://arxiv.org/abs/2610.00531', target: '_blank', rel: 'noopener', text: 'Science or Slop?' }), ' is whether we built a writing-quality detector and called it something else.'),
    h('p', {}, 'The v1 benchmark could not answer this. Each AI paper was paired with one accepted human paper, so the AI-vs-human gap and the bad-vs-good writing gap were one and the same number. Here we add a third paper to pull them apart. What we found:'),
    h('ol', { class: 'qa-ol' },
      h('li', {}, B('Rejected-for-writing papers and accepted papers get similar slop scores; AI papers get higher ones. '), 'Experiment 1 shows this item by item; Experiment 2 checks it against the definition of "badly written", topic closeness, length, and the two sources of AI papers.'),
      h('li', {}, B('Stock phrasing in human papers has risen every year since late 2022, '), 'even with the human side cut off at 2024 (Experiment 3).'),
      h('li', {}, B('Among the rejected papers, slop varies with the overall rating, not with the presentation score '), '(Experiment 4). And the nine items rarely show up together in one paper (Experiment 5).')),

    h('h4', { text: 'Is slop just bad writing?' }),
    exp(1, 'Does a badly written paper score like an AI paper?'),
    h('p', {}, 'For each AI paper we added a rejected human paper on a similar topic whose reviewers judged the writing bad: mean presentation score 2.0 or below, or half the reviews complaining about it. "Similar topic" is loose: in 15 of the 226 sets the rejected paper works on the same research problem as the AI paper, in the other 211 on the same field. We score all three papers with the author hidden and look at where the rejected paper lands. ', B('It lands next to the accepted paper, not next to the AI paper.')),
    h('p', { text: 'The nine measures, and what each one counts:' }),
    qTable(['Item', 'What it counts'], [
      ['1-2 Overstated Claims', 'results from a single model or a single dataset, or added compute that is never costed'],
      ['1-3 Evidence Gap', 'result claims with no table or figure behind them'],
      ['1-4 Unclear Links to Prior Work', 'cited methods that the paper never relates to its own'],
      ['2-3 Missing Cross-Section Links', 'sections and equations never pointed to from where they are used'],
      ['2-5 Empty Conclusion', 'conclusion sentences copied from the abstract or introduction'],
      ['4-1 Generic Filler', 'sentences that restate a result and add nothing'],
      ['4-2 Unexplained Terms', 'terms that appear abruptly, without a gloss'],
      ['4-4 Redundant Repetition', 'body sections that repeat an earlier section'],
      ['5-5 Formulaic Reasoning', 'stock phrases standing in for an argument']]),
    h('p', { text: 'Each is a rate between 0 and 1; higher means more of it. Below, four of the 226 sets, with the sentences the measures picked out.' }),
    xcard(),
    h('p', {}, 'The chips mark items on which a paper scores above the 95th percentile of the accepted papers. The AI paper in each set has several; the two human papers have none or one. Across all 226 sets the pattern holds (Figure 1): on every item the two human means sit close together and the AI mean sits higher.'),
    qfig(1, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: r.all.mean })), { labelW: 214 }), 'Mean score of each item, three groups, 226 sets. Generic Filler, Unexplained Terms and Empty Conclusion are per-sentence rates and small on every side. Hover a dot for the value.', legend(['AI', 'HG', 'HP'])),
    qTable(['Item', 'AI vs well-written', 'AI vs badly written', 'badly vs well-written'],
      I.map(r => [`${r.id} ${r.name}`, f2(r.all.auc['AI>HG']), f2(r.all.auc['AI>HP']), f2(r.all.auc['HP>HG'])]).concat([['Index (9 items)', f2(ix.all.auc['AI>HG']), f2(ix.all.auc['AI>HP']), f2(ix.all.auc['HP>HG'])]])),
    h('p', { class: 'qa-cap', text: 'AUROC over all papers; 0.50 = no difference. Unexplained Terms was scored on 88 of the 226 rejected papers (the run hit a spend limit); every other cell is complete.' }),
    h('p', {}, 'The last column stays between 0.47 and 0.57: no single item separates the two human groups much. Putting the nine together does not help either (Figure 2): the two human histograms overlap, ', B(`${ix.above_ai_median.HP} of 226`), ' rejected papers score above the AI median, and ', B(`${ix.above_ai_median.HG} of 226`), ' accepted ones. A logistic classifier on the nine scores, cross-validated, reaches ', B(f2(Q1.cv['AI>HG'])), ' for AI vs accepted and ', B(f2(Q1.cv['AI>HP'])), ' for AI vs rejected, but ', B(f2(Q1.cv['HP>HG'])), ' for rejected vs accepted. The nine scores together carry little information about what the reviewers thought of the writing.'),
    qfig(2, indexHist(), 'The nine-item index, one histogram per group. Index = mean percentile rank of a paper over the items it could be scored on.'),

    exp(2, 'Does it survive the obvious objections?'),
    h('p', {}, 'We checked the ways this could be an artifact: the two definitions of "badly written", topic closeness, and length (human bodies are about 1.7× longer than AI bodies). None changes the numbers much.'),
    qTable(['Triplets', 'n', 'AI vs well-written', 'AI vs badly written', 'badly vs well-written'], Q1.subsets.map(r => [r.name, String(r.n), f2(r['AI>HG']), f2(r['AI>HP']), f2(r['HP>HG'])])),
    h('p', { class: 'qa-cap', text: 'Index AUROC. E1 / E2 are the two ways a paper qualified as badly written. "Same problem" keeps the sets where the rejected paper addresses the same research problem as the AI paper, not just the same field.' }),
    h('p', {}, 'What does change the picture is where the AI paper came from (Figure 3). FARS papers are written by one fully automated pipeline, and the index separates them from the rejected papers almost perfectly (', B(f2(ix.fars.auc['AI>HP'])), '). Agents4Science papers come from many teams with varying AI involvement and are separated less (', B(f2(ix.a4s.auc['AI>HP'])), '). Three items do not separate Agents4Science papers at all: Unclear Links to Prior Work, Empty Conclusion and Redundant Repetition. ', B('They separate FARS papers only, so we cannot call them properties of AI-written papers in general.'), ' Formulaic Reasoning, Missing Cross-Section Links, Evidence Gap and Generic Filler separate both sources.'),
    qfig(3, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: { AI: r.fars.auc['AI>HP'], HP: r.a4s.auc['AI>HP'] } })), { groups: ['AI', 'HP'], x0: .3, x1: 1, ticks: [.3, .5, .7, .9], chance: .5, labelW: 214 }),
      'AI vs badly written human, AUROC per item, by AI source. Red: FARS (102 triplets). Grey: Agents4Science (124). Left of the dashed line the human paper looks sloppier than the AI paper.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key ai' }), 'FARS'), h('span', {}, h('i', { class: 'qf-key hp' }), 'Agents4Science'))),

    h('h4', { text: 'What else fell out' }),
    exp(3, 'Are 2024 human papers free of LLM phrasing?'),
    h('p', {}, 'We cut the human side at 2024 so that no LLM-written text would count as human. It was not enough. Read two human papers from 2020 and two from late 2024 side by side:'),
    dcard(),
    h('p', {}, 'The marked words are the ones Formulaic Reasoning counts. Figure 4 plots the two style items, Generic Filler and Formulaic Reasoning, against the arXiv date of every human paper. ', B('Both rise from late 2022 on'), ': Generic Filler from 0.004 per sentence before 2022 to 0.013 in late 2024, Formulaic Reasoning from 0.12 to 0.20. The dashed lines drop every paper whose title mentions language models, prompts, agents or reasoning, and rise just the same. The rise is there in accepted and in rejected papers alike (p < 0.01 in each).'),
    qfig(4, yearLines(), 'Generic Filler and Formulaic Reasoning in human papers by arXiv v1 date (bins: up to 2021, 2022, Dec 2022 – Jun 2023, Jul – Dec 2023, first and second half of 2024; n = 69 / 36 / 35 / 79 / 94 / 135). Solid: all human papers. Dashed: titles without LLM words. Red: the AI papers.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key line' }), 'all human papers'), h('span', {}, h('i', { class: 'qf-key line dashed' }), 'titles without LLM words'), h('span', {}, h('i', { class: 'qf-key ailine' }), 'AI papers'))),
    h('p', {}, 'The phrases that grew most are the ones every LLM-vocabulary study lists. Per 1,000 sentences, before ChatGPT and from spring 2023 on:'),
    qTable(['', 'before ChatGPT', 'from 2023-04'], Q1.risers.filter(r => r.w !== 'play a crucial role').slice(0, 7).map(r => [r.w, r.pre.toFixed(2), r.post.toFixed(2)])),
    h('p', {}, 'This costs the index. Against pre-ChatGPT human papers, Formulaic Reasoning separates AI papers with AUROC ', B(f2(Q1.years.auc_vs_era['5-5|pre'])), '; against human papers from late 2024, ', B(f2(Q1.years.auc_vs_era['5-5|late'])), '. Generic Filler goes from ', B(f2(Q1.years.auc_vs_era['4-1|pre'])), ' to ', B(f2(Q1.years.auc_vs_era['4-1|late'])), '. The items that look at the evidence rather than the wording (Evidence Gap, Missing Cross-Section Links, Overstated Claims) do not move with the date. We cannot tell from the text whether the rise comes from LLM-assisted writing or from the field changing its voice; the phrases that rose are the ones LLM-vocabulary studies list.'),
    h('p', { class: 'qa-cap', text: `This could have tilted Experiment 1, since the rejected papers are newer (${Math.round(Q1.years.share_post.HP * 100)}% post-ChatGPT vs ${Math.round(Q1.years.share_post.HG * 100)}% of the accepted ones). It did not: in the ${Q1.years.both_post.n} triplets where both human papers are post-ChatGPT, the rejected one ranks sloppier ${Math.round(Q1.years.both_post.pa_hp_gt_hg * 100)}% of the time.` }),

    exp(4, 'Which reviewer score does slop follow?'),
    h('p', {}, 'For the 226 rejected papers we have the reviews. If the index measured writing, it should move with the presentation score. It does not: ρ = ', B(f2(Q1.hp.corr.index.presentation.rho)), ' with the presentation score and ', B(f2(Q1.hp.corr.index.writing.rho)), ' with the share of reviews complaining about the writing. ', B(`It does move with the overall rating: ρ = ${f2(Q1.hp.corr.index.rating.rho)}, p = 0.002.`), ' Among papers that were all rejected, the ones reviewers rated lowest have the highest slop scores.'),
    h('p', {}, `${Q1.hp.later.n_later} of these rejected papers were later accepted at another venue. Their rejected versions differ from the ${Q1.hp.later.n_never} papers that never were accepted on two items: lower Overstated Claims (`, B(f2(Q1.hp.later.items['1-2'].later)), ' vs ', B(f2(Q1.hp.later.items['1-2'].never)), ', p = 0.004) and lower Evidence Gap (', B(f2(Q1.hp.later.items['1-3'].later)), ' vs ', B(f2(Q1.hp.later.items['1-3'].never)), ', p = 0.04); in the table below this shows as more models and datasets in the evaluation. The style items do not differ. We only have the rejected versions, so this says which rejected papers later made it, not what their authors changed or why they were accepted.'),
    lcard(),
    qfig(5, dumbbell(['1-2', '1-3', '2-3', '4-4', '5-5', '4-1'].map(it => ({ label: byId[it].name, sub: it, vals: { HG: Q1.hp.later.items[it].later, HP: Q1.hp.later.items[it].never } })), { groups: ['HG', 'HP'], labelW: 214 }),
      'Rejected papers later accepted elsewhere (hollow, n = 27) and never accepted (filled, n = 199): mean score per item, measured on the rejected versions.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key hg' }), 'later accepted elsewhere'), h('span', {}, h('i', { class: 'qf-key hp' }), 'never accepted'))),

    exp(5, 'Do the slops come together?'),
    h('p', {}, 'We expected AI papers to score high on most items at once. They do not. The nine item scores do not correlate with each other: mean pairwise ρ between ', B('−0.02 and 0.03'), ' in every group and both sources. One AI paper overclaims, the next repeats itself, a third pads its results. Counting how many items a paper exceeds the accepted-paper 95th percentile on (Figure 6): ', B('61%'), ' of AI papers exceed it on two or more, against ', B('5%'), ' of accepted and ', B('4%'), ' of rejected papers.'),
    qfig(6, p95bars('all'), 'How many of the nine items a paper exceeds the well-written 95th percentile on. By construction 5% of well-written papers exceed each single item.'),
    h('p', { text: 'That is why combining items helps: the best single item reaches 0.86, the index 0.93, the classifier 0.97. The items that most often put an AI paper over the line are Formulaic Reasoning (57% of AI papers), Overstated Claims (35%), Unclear Links to Prior Work and Generic Filler (31% each).' }),

    h('h4', { text: 'What comes next' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'Finish Unexplained Terms on the rejected papers and run the figure item, 4-5 Unclear Figures (the figures are downloaded; the vision pass is not).' }),
      h('li', { text: 'Report every AI-vs-human number against pre-ChatGPT human papers as well; the two style items lose a third of their separation on 2024 papers.' }),
      h('li', { text: 'Retire or re-source the three items that only work on FARS (Unclear Links to Prior Work, Empty Conclusion, Redundant Repetition).' }),
      h('li', { text: 'Compare the 27 recovered papers\u2019 rejected and accepted versions, item by item, to see what changed.' })),
    h('h4', { text: 'Fine print' }),
    h('ul', { class: 'qa-ul small' },
      h('li', { text: 'Topic match on the rejected side is mostly field-level (211 of 226). The 15 same-problem sets give the same answer, but 15 is small.' }),
      h('li', { text: 'Unexplained Terms covers 88 of 226 rejected papers (the run hit a spend limit). The classifier drops it in the two comparisons that involve that group.' }),
      h('li', { text: 'Missing Cross-Section Links reads cross-references from LaTeX. Agents4Science AI papers are PDFs rebuilt into TeX, so their score on it is pessimistic; FARS alone gives the same AUROC.' }),
      h('li', { text: 'The Formulaic Reasoning word list was learned on half of the v1 pairs, which favours it on AI and v1 human papers. The rejected papers were never seen.' }),
      h('li', { text: 'Overstated Claims has two halves. The cost-accounting half (added compute never costed) is a little higher in the rejected group but barely separates AI from humans (0.58). The narrow-evaluation half (one model or one dataset) behaves like every other item: 70 of 154 AI papers test one model on one dataset; 11 of 198 accepted and 13 of 191 rejected papers do.' }),
      h('li', { text: `Agents4Science authors self-report how much AI wrote. It predicts nothing: index ${f2(Q1.a4s.writing.B.mean)} / ${f2(Q1.a4s.writing.C.mean)} / ${f2(Q1.a4s.writing.D.mean)} for B / C / D, all far above the human ${f2(Q1.a4s.human_mean)}.` }),
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
  f4: { title: 'Do reviewers catch the scientific flaws we measure?', tag: 'not run yet', body: () => [
    h('p', { text: 'A slop FAIL says where a paper breaks. The weakness section of a review says what the reviewer noticed. Lining the two up shows which slops reviewers name, which they miss, and the words they use.' }),
    h('p', { text: 'Does a paper that fails 1-2 (Overstated Claims) get “overclaims” more often than other papers? Does a 4-4 paper get “the paper is repetitive”?' }),
    h('h4', { text: 'Setup' }),
    h('p', { text: 'We work from both ends. From the review side, each weakness is labelled with the item and the place in the paper it points to; this needs no measurement and is already possible. From the paper side, once the 11 items are measured, we check which FAILs the reviewers caught.' }),
    h('h4', { text: 'Data' }),
    h('p', { text: 'ICLR 2017–2024 reviews (about 850 papers), 75,800 ICLR 2026 reviews, and the Agents4Science reviews.' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
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
