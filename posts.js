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
const QPOST = {
  f1: { title: 'Is AI slop just bad writing?', tag: 'v1 result · v2 running', body: () => [
    h('p', { text: 'The first objection we hear is that a slop index just catches bad writing, and AI papers happen to have more of it. Testing that takes three papers on the same research problem: one written by an AI system, one well-written human paper, and one human paper that reviewers found hard to read.' }),
    h('h4', { text: 'What v1 showed' }),
    h('p', { text: 'v1 had the first two. SciSlopBench pairs 390 AI-generated papers with human papers matched by research problem and contribution type. Six counting measures picked the AI paper in 85.9% of pairs. Binoculars, the strongest text detector in our table, got 68.7%.' }),
    qBars([['Science Slop Index (v1)', .859, true], ['Binoculars', .687], ['CycleReviewer', .685], ['DetectGPT', .638], ['NTS', .626], ['AI Scientist reviewer', .615]], .5),
    h('p', { class: 'qa-cap', text: 'Pair accuracy on SciSlopBench, 390 pairs. Chance is 50%.' }),
    h('p', { text: 'So the measures separate AI papers from good human papers. That says nothing yet about poorly written human papers.' }),
    h('h4', { text: 'Data setup' }),
    h('p', { text: 'v2 gives each AI paper two human papers matched as closely by topic as the data allows: one accepted at a top venue, and one rejected because reviewers found it poorly written. Every human paper was first posted by the end of 2024.' }),
    qTable(['Paper', 'What it is', 'Where it comes from'], [
      ['AI', 'Written end to end by an AI system', 'FARS (143) and Agents4Science 2025 (247)'],
      ['Well-written human', 'Accepted, matched by topic', 'The v1 pair, or a new match from 85,175 accepted papers (ICLR, NeurIPS, ICML, ACL, EMNLP, CVPR and others)'],
      ['Poorly written human', 'Rejected, and reviewers said the writing was poor', '18,014 ICLR and NeurIPS rejects, 2017–2025']]),
    h('p', { class: 'qa-sub', text: 'What counts as poorly written' }),
    h('p', { text: 'The reviewers have to have said so. A rejected paper counts if one of these holds:' }),
    h('ul', { class: 'qa-ul' },
      h('li', { text: 'its presentation score averages 2.0 or lower on the 1–4 scale (ICLR 2024–2025, NeurIPS 2022–2023);' }),
      h('li', { text: 'at least half of its reviews name a writing problem, such as “hard to follow”, “poorly written”, “many typos” or “the writing should be improved”.' })),
    h('p', { text: 'A low overall score is not enough, because weak experiments or limited novelty also lower it. Withdrawn papers and preprints that nobody reviewed are left out. 2,594 of the 18,014 rejects qualify.' }),
    h('p', { class: 'qa-sub', text: 'How the papers are matched' }),
    h('p', { text: 'Candidates come from embedding search on the abstract and from references shared with the AI paper. An LLM judge reads each candidate’s title and abstract and marks it as same problem and same kind of contribution, same problem, or same field only. For the rejected paper we take the arXiv LaTeX of the version the reviewers saw. Each human paper is used once and is at most three times the length of the AI paper.' }),
    qTable(['', 'Count'], [
      ['AI papers with both human papers', '226 of 390 (FARS 102, Agents4Science 124)'],
      ['Poorly written: presentation ≤ 2.0', '169'],
      ['Poorly written: reviews name writing problems', '57'],
      ['Rejected paper on the same problem', '15'],
      ['Rejected paper in the same field only', '211']]),
    h('p', { class: 'qa-cap', text: 'Data as of October 17, 2026.' }),
    h('p', { text: 'Most rejected papers share the field but not the exact problem. The AI papers work on narrow 2025–26 problems, and few rejects from before 2025 address the same ones, so the 15 same-problem triples are reported on their own. The other 164 AI papers, most of them natural or social science from Agents4Science, have no reviewed reject in the same field.' }),
    h('p', { text: 'All three papers are judged on the 17 items with the author hidden. If AI slop were just bad writing, the rejected human papers would fail the same items, in the same way, as often as the AI papers.' }),
    h('h4', { text: 'Result' }), h('p', { class: 'qa-none', text: 'Not in yet.' })] },
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
  scrollTo(0, 0);
}
addEventListener('hashchange', show); show();
