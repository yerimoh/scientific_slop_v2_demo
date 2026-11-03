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
// Q1 figures: paper glyph, design, filter, match grid, outcomes. Animate once when scrolled into view (.qa-fig → .in).
const qDoc = (cls, label, sub) => h('div', { class: 'q1-p ' + cls }, h('span', { class: 'q1-doc' }, h('i'), h('i'), h('i'), h('i')), h('b', { text: label }), h('span', { text: sub }));
const qDesign = () => h('figure', { class: 'qa-fig q1-design' },
  h('div', { class: 'q1-row' },
    qDoc('q1-good', 'Well-written human', 'accepted, similar topic'),
    h('span', { class: 'q1-link', 'aria-hidden': 'true' }),
    qDoc('q1-ai', 'AI paper', 'FARS or Agents4Science'),
    h('span', { class: 'q1-link', 'aria-hidden': 'true' }),
    qDoc('q1-poor', 'Poorly written human', 'rejected, writing flagged')),
  h('div', { class: 'q1-meas' }, h('span', { text: 'All three scored on the same 17 slop measures, authorship hidden' })),
  h('figcaption', { class: 'qa-cap', text: 'One triplet. Each AI paper gets two human controls on a similar topic.' }));
const qFunnel = () => h('figure', { class: 'qa-fig q1-funnel' },
  ...[['ICLR and NeurIPS rejects', 18014, 'q1-f-all'], ['Writing flagged by reviewers', 2594, 'q1-f-poor']].map(([l, v, c]) => h('div', { class: 'q1-fr ' + c },
    h('span', { class: 'q1-fl', text: l }), h('span', { class: 'q1-ft' }, h('i', { style: `--w:${(v / 18014 * 100).toFixed(1)}%` })), h('span', { class: 'q1-fv', text: v.toLocaleString('en-US') }))),
  h('figcaption', { class: 'qa-cap', text: '14% of rejects qualify. A reject alone is not evidence of bad writing.' }));
const qGrid = () => {
  const dots = []; for (let i = 0; i < 390; i++) dots.push(h('i', { class: i < 15 ? 'g-sp' : i < 226 ? 'g-sf' : 'g-no', style: `--d:${Math.min(i, 389) * 3}ms` }));
  return h('figure', { class: 'qa-fig q1-grid' }, h('div', { class: 'q1-dots', role: 'img', 'aria-label': '390 AI papers: 15 with a same-problem poorly written match, 211 with a same-field match, 164 without a match' }, ...dots),
    h('div', { class: 'q1-leg' }, h('span', {}, h('i', { class: 'g-sp' }), 'Same problem · 15'), h('span', {}, h('i', { class: 'g-sf' }), 'Same field · 211'), h('span', {}, h('i', { class: 'g-no' }), 'No match yet · 164')),
    h('figcaption', { class: 'qa-cap', text: 'Each dot is one of the 390 AI papers.' }));
};
const qOut = () => {
  const panel = (title, vals, verdict) => h('div', { class: 'q1-op' }, h('b', { text: title }),
    h('div', { class: 'q1-ob' }, ...[['AI', vals[0], 'q1-ai'], ['Poorly written', vals[1], 'q1-poor'], ['Well-written', vals[2], 'q1-good']].map(([l, v, c]) =>
      h('div', { class: 'q1-oc ' + c }, h('span', { class: 'q1-obar' }, h('i', { style: `--h:${v}%` })), h('span', { class: 'q1-ol', text: l })))),
    h('span', { class: 'q1-ov', text: verdict }));
  return h('figure', { class: 'qa-fig q1-out' }, h('div', { class: 'q1-ops' },
      panel('If slop is just bad writing', [80, 76, 26], 'Poorly written ≈ AI'),
      panel('If it is not', [80, 34, 26], 'AI stands apart')),
    h('figcaption', { class: 'qa-cap', text: 'The two possible outcomes. Bar height is slop measured; illustration, not data.' }));
};
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
    qFunnel(),
    h('h4', { text: 'Matching' }),
    h('p', { text: 'We obtain both human controls for 226 of the 390 AI papers. We retrieve candidates using abstract similarity and shared references, then use their titles and abstracts to prioritize papers on the same research problem. Each human paper is used once.' }),
    h('p', { text: 'Exact matches are scarce for poorly written papers: 15 cover the same research problem as the AI paper, while the remaining 211 are matched within the same field.' }),
    qGrid(),
    qTable(['Matched triplets', 'Count'], [
      ['Same-problem poorly written human', '15'],
      ['Same-field poorly written human', '211'],
      ['Total', '226']]),
    h('p', { class: 'qa-cap', text: 'Data as of October 17, 2026.' }),
    h('h4', { text: 'Test' }),
    h('p', { text: 'The remaining question is whether the same 17 slop measures separate AI papers from both human groups. We score all papers with authorship hidden.' }),
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
    h('p', { text: 'Six counts can only say “more slop, lower score”. With 17 items we can ask which kind of slop goes with which dimension, for example whether unsupported claims track soundness and undefined terms track presentation. The plan starts from ICLR 2027 submissions, then compares years and venues (NeurIPS, ICML, ACL).' }),
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
    h('p', { text: 'Does a paper that fails 5-1 (Unexplained Importance) get “motivation unclear” more often than other papers? Does a 2-2 paper get “the experiments feel disconnected”?' }),
    h('h4', { text: 'Setup' }),
    h('p', { text: 'We work from both ends. From the review side, each weakness is labelled with the item and the place in the paper it points to; this needs no measurement and is already possible. From the paper side, once the 17 items are measured, we check which FAILs the reviewers caught.' }),
    h('h4', { text: 'Data' }),
    h('p', { text: 'ICLR 2017–2024 reviews (about 850 papers), 75,800 ICLR 2026 reviews, and the Agents4Science reviews.' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
};
const ORDER = ['f1', 'f2', 'f3', 'f4'];
function show() {
  const n = Math.min(4, Math.max(1, parseInt(location.hash.slice(1), 10) || 1)), p = QPOST[ORDER[n - 1]];
  document.title = p.title + ' · Science Slop Index';
  const prev = n > 1 ? h('a', { href: '#' + (n - 1), text: '← ' + QPOST[ORDER[n - 2]].title }) : h('span'), next = n < 4 ? h('a', { href: '#' + (n + 1), text: QPOST[ORDER[n]].title + ' →' }) : h('span');
  $('#qa').replaceChildren(h('a', { class: 'qa-back', href: './#questions', text: '← Four questions' }),
    h('header', { class: 'qa-h' }, h('span', { class: 'qa-n', text: 'Question ' + n }), h('h1', { text: p.title }), h('span', { class: 'qa-tag', text: p.tag })),
    h('div', { class: 'qa-b' }, ...p.body()), h('nav', { class: 'qa-pn' }, prev, next));
  const figs = document.querySelectorAll('.qa-fig');
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .35 }); figs.forEach(f => io.observe(f)); }
  else figs.forEach(f => f.classList.add('in'));
  scrollTo(0, 0);
}
addEventListener('hashchange', show); show();
