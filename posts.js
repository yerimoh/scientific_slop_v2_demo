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
const QPOST = {
  f1: { title: 'Is AI slop just bad writing?', tag: 'v1 result · v2 running', body: () => [
    h('p', { text: 'To test whether AI slop is simply bad writing, we compare AI papers not only with well-written human papers, but also with human papers that reviewers actually found poorly written. Each AI paper is paired with a similar accepted paper and a rejected paper whose reviews flag writing problems.' }),
    qDesign(),
    h('h4', { text: 'Data setup' }),
    h('p', { text: 'The comparison has three groups: AI, well-written human, and poorly written human.' }),
    qTable(['Paper', 'What it is', 'Where it comes from'], [
      ['AI', 'Written end to end by an AI system', 'FARS (143), Agents4Science 2025 (247)'],
      ['Well-written human', 'Accepted paper on a similar topic', '85,175 papers from major venues'],
      ['Poorly written human', 'Rejected paper flagged for writing', '18,014 ICLR and NeurIPS rejects']]),
    h('p', { text: 'We identify poorly written papers from their reviews, not from rejection alone. A paper qualifies if its mean presentation score is 2.0 or lower, or if at least half of its reviews explicitly flag a writing problem. Of 18,014 rejects, 2,594 meet this criterion.' }),
    h('h4', { text: 'Matching' }),
    h('p', { text: 'We obtain both human controls for 226 of the 390 AI papers. We retrieve candidates using abstract similarity and shared references, then use their titles and abstracts to prioritize papers on the same research problem. Each human paper is used once.' }),
    h('p', { text: 'Exact matches are scarce for poorly written papers: 15 cover the same research problem as the AI paper, while the remaining 211 are matched within the same field.' }),
    qTable(['Matched triplets', 'Count'], [
      ['Same-problem poorly written human', '15'],
      ['Same-field poorly written human', '211'],
      ['Total', '226']]),
    h('p', { class: 'qa-cap', text: 'Data as of October 17, 2026.' }),
    h('h4', { text: 'Test' }),
    h('p', { text: 'The remaining question is whether the same 10 slop measures separate AI papers from both human groups. We score all papers with authorship hidden.' }),
    h('p', { text: 'If the gap between AI and well-written human papers disappears for poorly written human papers, scientific slop is largely capturing bad writing. If AI papers still show more slop, bad writing alone does not explain the difference.' }),
    qOut(),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'v2 running.' })] },
  f2: { title: 'Does slop cost review points?', tag: 'v1 result · v2 running', body: () => [
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
  f3: { title: 'Does an AI reviewer let more slop through?', tag: 'not run yet', body: () => [
    h('p', { text: 'A growing share of reviews is written with an LLM, and some venues now use AI reviewers officially. If an AI reviewer goes easy on the failures an AI author makes, the two problems compound.' }),
    h('h4', { text: 'Setup' }),
    h('p', { text: 'Take one paper with its measured slop, one human review and one AI review. Compare two things: how much of the measured slop each review points out, and how much the score drops per unit of slop. Then check whether the gap widens when the author is an AI.' }),
    h('h4', { text: 'Data' }),
    h('p', { text: 'No single dataset has everything, so we use three. Agents4Science 2025 has AI-written papers with 456 AI reviews and 55 human reviews. Our 390 SciSlopBench pairs already have two AI reviewers run on both sides. ICLR 2026 has reviews labelled by Pangram as human-written (32,938) or AI-generated (15,899), often on the same paper.' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
  f4: { title: 'What do reviewers actually flag?', tag: 'not run yet', body: () => [
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
