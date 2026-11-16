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
const GROUP = { AI: { label: 'AI paper', cls: 'ai' }, HG: { label: 'well-written human', cls: 'hg' }, HP: { label: 'poorly written human', cls: 'hp' } };
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
    B.forEach((b, i) => svg.append(s('text', { class: 'qf-ax', x: X(i), y: top + PH + 16, 'text-anchor': 'middle', text: SHORT[i] })));
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
  f1: { title: 'Is AI slop really different from bad human writing?', tag: 'v2 result · 226 triplets · November 2026', body: () => {
    const I = Q1.items, byId = Object.fromEntries(I.map(r => [r.id, r])), ix = Q1.index;
    const em = (...k) => h('p', {}, ...k.map(x => typeof x === 'string' ? x : x));
    const B = t => h('b', { text: t });
    return [
    h('p', { class: 'qa-tldr' }, B('TL;DR. '), 'A cheap objection to a slop index is that it only measures bad writing. We tested it the direct way: every AI paper in SciSlopBench now has two human partners, one accepted and well written, one rejected with reviewers complaining about the writing. On nine slop items, the poorly written human papers score ', B('just like the well-written ones'), ' (AUROC ', B(f2(ix.all.auc['HP>HG'])), ', chance is 0.50), while AI papers stand apart from both (', B(f2(ix.all.auc['AI>HP'])), ' against the poorly written group). Slop is not bad writing. Along the way we found three things we did not expect: human papers have drifted toward AI phrasing since ChatGPT, slop tracks what reviewers ', h('i', { text: 'score' }), ' rather than how they rate the presentation, and the nine slops almost never co-occur in one paper.'),

    h('h4', { text: 'Why this question' }),
    h('p', { text: 'If you take a rejected paper whose reviewers wrote "hard to follow" and "needs proofreading", and run it through the same measures that flag AI papers, what happens? Two outcomes are possible. If slop is a polite name for bad writing, the rejected paper should light up the way an AI paper does. If slop is something else, a failure of the science rather than of the prose, it should score like any other human paper.' }),
    h('p', { text: 'The v1 benchmark could not tell these apart. Every AI paper was paired with one accepted human paper on a similar topic, so "AI vs. human" and "worse writing vs. better writing" were the same comparison. The fix is a third paper.' }),
    qDesign(),
    h('figcaption', { class: 'qa-cap', text: 'Figure 1. One triplet. The AI paper keeps its well-written human partner from v1 and gains a poorly written one: a rejected paper on the same topic whose reviews flag the writing.' }),

    h('h4', { text: 'Setup' }),
    h('ul', { class: 'qa-ul' },
      h('li', {}, B('AI papers: '), `${Q1.n.triplets} from SciSlopBench (FARS ${Q1.n.fars}, Agents4Science 2025 ${Q1.n.a4s}). All 390 were tried; these are the ones for which both human partners exist.`),
      h('li', {}, B('Well-written human: '), 'the v1 partner where it was written before 2025, otherwise a new accepted paper on the same problem from 85,175 papers at major venues.'),
      h('li', {}, B('Poorly written human: '), `a final reject from ICLR 2017–2025 or NeurIPS 2021–2023 whose reviewers judged the writing bad: mean presentation score ≤ 2.0 (169 triplets) or at least half the reviews explicitly flag writing problems (57). Of ${Q1.hp_pool.n_rejects.toLocaleString()} public rejects, ${Q1.hp_pool.n_pool.toLocaleString()} qualify. Withdrawn papers and "low rating only" do not count.`),
      h('li', {}, B('Human papers are all from 2024 or earlier'), ' (arXiv v1), to keep LLM-written text out of the human side. This matters later.'),
      h('li', {}, B('Measures: '), 'the nine slops on this site that run on text, exactly as the Results table was computed (1-2, 1-3, 1-4, 2-3, 2-5, 4-1, 4-2, 4-4, 5-5). 4-5 needs figures and was left out. Every paper is scored with authorship hidden; the LaTeX source is read the same way on all three sides.'),
      h('li', {}, B('Reading the numbers: '), 'higher score = more slop. AUROC(A>B) is the chance that a random paper from A scores above a random paper from B; 0.5 means the measure cannot tell them apart. "Index" is the mean percentile rank over the nine items.')),
    h('p', { class: 'qa-cap', text: `Topic match is loose for the poorly written side: 15 triplets share the research problem, 211 only the field. Human bodies are longer than AI bodies (median ${Q1.lengths.HG} and ${Q1.lengths.HP} vs ${Q1.lengths.AI} sentences); the scores are rates, and we check length below.` }),

    h('h4', { text: 'Result: poorly written papers score like well-written ones' }),
    h('p', {}, 'Figure 2 is the whole result. On every item the two human dots sit on top of each other and the AI dot sits far to the right. The distance from well-written to poorly written, as a fraction of the distance from well-written to AI, is ', B('0.02 to 0.21'), ' and its bootstrap interval includes zero on eight of nine items.'),
    qfig(2, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: r.all.mean })), { labelW: 214 }), 'Mean score per item for the three groups. Hover a dot for the value. Items are rates between 0 and 1; 4-1, 4-2 and 2-5 are per-sentence rates and therefore small on all sides.', legend(['AI', 'HG', 'HP'])),
    h('p', {}, 'The same thing in one number per item: how well does the item separate AI from each human group, and how well does it separate the two human groups? Chance is 0.50.'),
    qTable(['Item', 'AI vs well-written', 'AI vs poorly written', 'poorly vs well-written'],
      I.map(r => [`${r.id} ${r.name}`, f2(r.all.auc['AI>HG']), f2(r.all.auc['AI>HP']), f2(r.all.auc['HP>HG'])]).concat([['Index (9 items)', f2(ix.all.auc['AI>HG']), f2(ix.all.auc['AI>HP']), f2(ix.all.auc['HP>HG'])]])),
    h('p', { class: 'qa-cap', text: 'AUROC over all papers. Within-triplet pair accuracy gives the same picture (index: 0.93 / 0.92 / 0.54). 4-2 was measured on 88 of the 226 poorly written papers; the other two groups are complete.' }),
    h('p', {}, 'Combining the items makes the separation sharper, not blurrier. Figure 3 shows the index for the three groups. The two human histograms overlap almost entirely; only ', B(`${ix.above_ai_median.HP} of 226`), ' poorly written papers score above the AI median, and ', B(`${ix.above_ai_median.HG} of 226`), ' well-written ones do.'),
    qfig(3, indexHist(), 'The nine-item index, one histogram per group. The index is the mean percentile rank of a paper over the items it could be scored on.'),
    h('p', {}, 'A classifier trained on the nine scores (logistic regression, five-fold cross-validation, the two sides of a triplet always in the same fold) reaches ', B(f2(Q1.cv['AI>HG'])), ' for AI vs well-written and ', B(f2(Q1.cv['AI>HP'])), ' for AI vs poorly written, but only ', B(f2(Q1.cv['HP>HG'])), ' for poorly vs well-written. Given every slop score of a paper, you still cannot say whether reviewers liked its writing.'),

    h('h4', { text: 'Does it hold up?' }),
    h('p', { text: 'We tried the ways this could be an artifact.' }),
    qTable(['Subset of triplets', 'n', 'AI vs well-written', 'AI vs poorly written', 'poorly vs well-written'],
      Q1.subsets.map(r => [r.name, String(r.n), f2(r['AI>HG']), f2(r['AI>HP']), f2(r['HP>HG'])])),
    h('p', { class: 'qa-cap', text: 'Index AUROC. E1 / E2 are the two ways a paper qualified as poorly written. "Same problem" keeps only the triplets where the poorly written paper addresses the same research problem as the AI paper. The length subset keeps triplets where the poorly written paper is at most 1.5× the AI paper.' }),
    h('p', {}, 'Neither definition of "poorly written", nor topic closeness, nor length changes the answer. The one real difference is between the two AI sources (Figure 4). FARS papers, which come from one fully automated pipeline, fail nearly everything: index AUROC ', B(f2(ix.fars.auc['AI>HP'])), '. Agents4Science papers, written by many teams with varying AI involvement, are separated less (', B(f2(ix.a4s.auc['AI>HP'])), ') and three items do nothing for them at all: 1-4, 2-5 and 4-4 are below chance on A4S. Those three look like habits of one generator rather than properties of AI-written science. 5-5, 2-3, 1-3 and 4-1 carry over.'),
    qfig(4, dumbbell(I.map(r => ({ label: r.name, sub: r.id, vals: { AI: r.fars.auc['AI>HP'], HP: r.a4s.auc['AI>HP'] } })), { groups: ['AI', 'HP'], x0: .3, x1: 1, ticks: [.3, .5, .7, .9], chance: .5, labelW: 214 }),
      'AUROC of AI vs poorly written human, per item, split by AI source. Red: FARS (102 triplets). Grey: Agents4Science (124). Left of the dashed line the item ranks the human paper as sloppier than the AI paper.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key ai' }), 'FARS'), h('span', {}, h('i', { class: 'qf-key hp' }), 'Agents4Science'))),
    h('p', { class: 'qa-cap', text: 'Two caveats on individual items. 2-3 reads cross-references from LaTeX, and A4S AI papers exist only as PDF reconstructed into TeX, so their 2-3 score is pessimistic (FARS alone gives the same AUROC). The 5-5 word list was learned on the development half of the v1 pairs, which favours it on AI and v1 human papers; the poorly written papers were never seen.' }),

    h('h4', { text: 'Surprise 1: human papers drift toward AI phrasing after ChatGPT' }),
    h('p', {}, 'We restricted human papers to 2024 and earlier to keep LLM-written text out. That was not enough. Figure 5 plots the two style-side items against the arXiv date of the human paper. Both rise from late 2022 on: 4-1 Generic Filler from ', B('0.004'), ' before 2022 to ', B('0.013'), ' in the second half of 2024, 5-5 Formulaic Reasoning from ', B('0.12'), ' to ', B('0.20'), '. The dashed lines drop every paper whose title mentions language models, prompts, agents or reasoning, so this is not the field changing topic. It happens in the well-written and the poorly written group alike (p < 0.01 in each).'),
    qfig(5, yearLines(), 'Mean 4-1 and 5-5 of human papers by arXiv v1 date (bins: up to 2021, 2022, Dec 2022 – Jun 2023, Jul – Dec 2023, first and second half of 2024; n = 69 / 36 / 35 / 79 / 94 / 135). Solid: all human papers. Dashed: titles without LLM words. Red line: mean of the AI papers.',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key line' }), 'all human papers'), h('span', {}, h('i', { class: 'qf-key line dashed' }), 'titles without LLM words'), h('span', {}, h('i', { class: 'qf-key ailine' }), 'AI papers'))),
    h('p', {}, 'The words that rose most are the ones every LLM-vocabulary study lists. Per 1,000 sentences, before ChatGPT versus from spring 2023 on:'),
    qTable(['Stock phrase', 'before ChatGPT', '2023-04 and later'], Q1.risers.slice(0, 8).map(r => [r.w, r.pre.toFixed(2), r.post.toFixed(2)])),
    h('p', {}, 'The consequence for a slop index is concrete. Against pre-ChatGPT human papers, 5-5 separates AI papers with AUROC ', B(f2(Q1.years.auc_vs_era['5-5|pre'])), '; against human papers from the second half of 2024 it is ', B(f2(Q1.years.auc_vs_era['5-5|late'])), '. 4-1 drops from ', B(f2(Q1.years.auc_vs_era['4-1|pre'])), ' to ', B(f2(Q1.years.auc_vs_era['4-1|late'])), '. The science-side items (1-3, 2-3, 1-2) do not move this way. We cannot tell from the text whether the drift is LLM-assisted writing or a change in how the field writes; the overlap with known LLM vocabulary points to the former.'),
    h('p', { class: 'qa-cap', text: `This could have biased the main result, since the poorly written papers are more recent (${Math.round(Q1.years.share_post.HP * 100)}% post-ChatGPT vs ${Math.round(Q1.years.share_post.HG * 100)}% of the well-written ones). It did not: in the ${Q1.years.both_post.n} triplets where both human papers are post-ChatGPT, the poorly written one scores higher on the index in ${Math.round(Q1.years.both_post.pa_hp_gt_hg * 100)}% of cases, i.e. still chance.` }),

    h('h4', { text: 'Surprise 2: slop tracks the score, not the presentation' }),
    h('p', {}, 'Within the 226 poorly written papers we have the reviews. If slop measured writing, it should correlate with the presentation score reviewers gave. It does not: the index has ρ = ', B(f2(Q1.hp.corr.index.presentation.rho)), ' with presentation and ', B(f2(Q1.hp.corr.index.writing.rho)), ' with the share of reviews complaining about the writing. It does correlate with the overall rating: ρ = ', B(f2(Q1.hp.corr.index.rating.rho)), ' (p = 0.002). Among papers that all failed, the ones reviewers scored lowest carry the most slop.'),
    h('p', {}, `The clearest version of this: ${Q1.hp.later.n_later} of the ${Q1.hp.later.n_later + Q1.hp.later.n_never} poorly written papers were later accepted at another venue. Those papers had less 1-2 Overstated Claims (`, B(f2(Q1.hp.later.items['1-2'].later)), ' vs ', B(f2(Q1.hp.later.items['1-2'].never)), ', p = 0.004) and less 1-3 Evidence Gap (', B(f2(Q1.hp.later.items['1-3'].later)), ' vs ', B(f2(Q1.hp.later.items['1-3'].never)), ', p = 0.04). The style items did not differ. What separated the papers that recovered from the ones that did not was the breadth of the evaluation and whether the results were shown, not the prose.'),
    qfig(6, dumbbell(['1-2', '1-3', '2-3', '4-4', '5-5', '4-1'].map(it => ({ label: it === 'index' ? 'Index' : byId[it].name, sub: it, vals: { HG: Q1.hp.later.items[it].later, HP: Q1.hp.later.items[it].never } })), { groups: ['HG', 'HP'], labelW: 214 }),
      'Mean score of poorly written papers that were later accepted elsewhere (hollow, n = 27) and those that never were (filled, n = 199).',
      h('div', { class: 'qf-leg' }, h('span', {}, h('i', { class: 'qf-key hg' }), 'later accepted elsewhere'), h('span', {}, h('i', { class: 'qf-key hp' }), 'never accepted'))),

    h('h4', { text: 'Surprise 3: the slops do not come together' }),
    h('p', {}, 'We expected AI papers to be sloppy across the board. They are not. The nine item scores are uncorrelated within every group: the mean pairwise Spearman correlation is between ', B('−0.02 and 0.03'), ' for AI, well-written and poorly written papers, in FARS and in A4S. An AI paper fails on different items from the next AI paper. Figure 7 counts, per paper, how many items exceed the 95th percentile of the well-written group. ', B('61%'), ' of AI papers exceed it on two or more items; ', B('5%'), ' of well-written and ', B('4%'), ' of poorly written papers do.'),
    qfig(7, p95bars('all'), 'Share of papers by how many of the nine items score above the well-written 95th percentile. The threshold is set on the well-written group, so 5% of it exceeds each item by construction.'),
    h('p', {}, 'This is why combining items helps so much: the best single item reaches 0.86, the index 0.93, the classifier 0.97. It is also why "the paper has an AI feel" is a weak description. The slops that fire most on AI papers are 5-5 (57% of AI papers above the threshold), 1-2 (35%), 1-4 and 4-1 (31% each); 1-3 and 2-3 never exceed it because most well-written papers already score 1.0 there.'),

    h('h4', { text: 'A note on Agents4Science' }),
    h('p', {}, `Agents4Science authors self-reported how much of the writing the AI did, on a scale from A (mostly human) to D (mostly AI). The report does not predict slop: index ${f2(Q1.a4s.writing.B.mean)} for B, ${f2(Q1.a4s.writing.C.mean)} for C, ${f2(Q1.a4s.writing.D.mean)} for D, all well above the human mean of ${f2(Q1.a4s.human_mean)}. Accepted A4S papers (n = ${Q1.a4s.decision.accepted.n}) score ${f2(Q1.a4s.decision.accepted.mean)}, rejected ones ${f2(Q1.a4s.decision.rejected.mean)}. Either the self-reports are coarse, or the slop enters before the writing stage.`),

    h('h4', { text: 'Caveats' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'Topic match on the poorly written side is mostly at the field level (211 of 226). The 15 same-problem triplets give the same answer, but 15 is small.' }),
      h('li', { text: '4-2 is incomplete on the poorly written side (88 of 226) because the run hit a spend limit; its row and the multivariate numbers that involve the poorly written group were computed without the missing papers (the classifier drops 4-2 entirely for those comparisons).' }),
      h('li', { text: '4-5 Unclear Figures is not included; it needs the method figure of every paper and a vision model run.' }),
      h('li', { text: 'The 1-2 part that moves most toward the poorly written group is Missing Cost Accounting, which barely separates AI from humans in the first place (0.58). Narrow Evaluation alone behaves like the other items: 70 of 154 AI papers evaluate on one model and one dataset, against 11 of 198 well-written and 13 of 191 poorly written.' }),
      h('li', { text: '"Poorly written" is the reviewers’ judgement, not ours, and it bundles typos, structure and clarity. We used it because it is the only large-scale label of writing quality that exists.' })),

    h('h4', { text: 'What comes next' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'Run 4-5 on the triplets (figures are downloaded; the vision-model pass is pending) and finish 4-2.' }),
      h('li', { text: 'Date-match the human side, or report every AI-vs-human number against pre-ChatGPT humans as well, since the style items lose a third of their separation on 2024 papers.' }),
      h('li', { text: 'Drop or re-source the three items that only work on FARS (1-4, 2-5, 4-4) before the next release of the index.' }),
      h('li', { text: 'Use the 27 recovered papers: what changed between the rejected version and the accepted one, item by item.' })),
    h('p', { class: 'qa-cap', text: 'Data: v2/question/Q1_ai_slop_vs_human_poor_writing (triplet list, per-paper scores, scripts). Per-paper numbers behind every figure are in q1data.js on this page.' })];
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
