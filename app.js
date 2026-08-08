/* YOSEI-DIF — moteur applicatif. Données injectées par le générateur dans window.DATA. */
'use strict';
const D = window.DATA;

/* ══ Persistance : localStorage si disponible, mémoire sinon ══ */
const Store = (() => {
  const KEY = 'YOSEI_DIF_v1';
  let mem = {};
  let ok = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); ok = true; } catch (e) { ok = false; }
  const read = () => {
    if (!ok) return mem;
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  };
  const write = o => { if (ok) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} } else mem = o; };
  return {
    get(k, dflt) { const v = read()[k]; return v === undefined ? dflt : v; },
    set(k, v) { const o = read(); o[k] = v; write(o); },
    all: read,
    load(o) { write(o); },
    available: ok
  };
})();

const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const mmss = s => (s < 0 ? '-' : '') + String(Math.floor(Math.abs(s) / 60)).padStart(2, '0') + ':' + String(Math.abs(s) % 60).padStart(2, '0');

function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400);
}

/* ══ Navigation ══════════════════════════════════════════
   Un seul point d'entrée : showPage(). Le tiroir mobile,
   le voile de fond et le verrou de défilement sont pilotés
   par openNav / closeNav, jamais en dehors.               */
function openNav() {
  $('sidebar').classList.add('open');
  $('backdrop').classList.add('on');
  document.body.classList.add('nav-open');
  $('mb-btn').setAttribute('aria-expanded', 'true');
  $('mb-btn').textContent = 'Fermer';
  const cur = document.querySelector('#sidebar a.active') || document.querySelector('#sidebar a');
  if (cur) { try { cur.focus({ preventScroll: true }); } catch (e) { cur.focus(); } }
}
function closeNav() {
  $('sidebar').classList.remove('open');
  $('backdrop').classList.remove('on');
  document.body.classList.remove('nav-open');
  $('mb-btn').setAttribute('aria-expanded', 'false');
  $('mb-btn').textContent = 'Menu';
}
function toggleNav() { $('sidebar').classList.contains('open') ? closeNav() : openNav(); }
function navKey(e, id) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPage(id); } }

function showPage(id) {
  const link = document.querySelector('#sidebar a[data-page="' + id + '"]');
  if (!$('page-' + id)) id = 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $('page-' + id).classList.add('active');
  document.querySelectorAll('#sidebar a').forEach(a => a.classList.toggle('active', a.dataset.page === id));
  closeNav();
  const t = $('mb-title'); if (t) t.textContent = (link && link.dataset.label) || 'Tableau de bord';
  window.scrollTo(0, 0);
  Store.set('lastPage', id);
  if (id === 'home') renderHome();
}

/* ══ Progression ══ */
const TRACKED = D.modules.filter(m => m.statut === 'pret').map(m => m.id)
  .concat(Object.keys(D.quiz).filter(q => D.quiz[q].statut === 'pret'));

function markDone(id) {
  const d = Store.get('done', {}); d[id] = true; Store.set('done', d); renderProgress();
}
function renderProgress() {
  const done = Store.get('done', {});
  const n = TRACKED.filter(k => done[k]).length, t = TRACKED.length;
  const pct = t ? Math.round(n / t * 100) : 0;
  const set = (i, v) => { const e = $(i); if (e) e.textContent = v; };
  set('prog-text', n + ' / ' + t + ' validés'); set('prog-pct', pct + '%');
  set('hdr-prog', pct + '%');
  const f = $('prog-fill'); if (f) f.style.width = pct + '%';
  document.querySelectorAll('#sidebar a[data-track]').forEach(a => {
    const fl = a.querySelector('.flag'); if (!fl) return;
    if (a.dataset.status === 'a_completer') { fl.textContent = 'à compléter'; fl.className = 'flag todo'; }
    else { fl.textContent = done[a.dataset.page] ? 'validé' : '—'; fl.className = 'flag' + (done[a.dataset.page] ? ' done' : ''); }
  });
  document.querySelectorAll('[data-mst]').forEach(e => {
    const k = e.dataset.mst;
    if (e.dataset.status === 'a_completer') { e.textContent = 'À compléter'; e.className = 'm-st todo'; }
    else { e.textContent = done[k] ? 'Validé' : 'À faire'; e.className = 'm-st' + (done[k] ? ' done' : ''); }
  });
}
function renderHome() {
  renderProgress();
  const s = Store.get('sessions', []);
  const set = (i, v) => { const e = $(i); if (e) e.textContent = v; };
  set('stat-plans', s.length);
  set('stat-sim', Store.get('simCount', 0));
  set('stat-jury', (Store.get('juryVus', []) || []).length + ' / ' + D.jury.length);
}

/* ══ Quiz ══ */
const qState = {};
function renderQuiz(qid) {
  const data = D.quiz[qid], host = $('quiz-' + qid);
  if (!data.questions.length) { host.innerHTML = '<div class="card todo"><h2>Banque de questions à constituer</h2><p>Ce quiz sera généré dès que le module correspondant sera renseigné à partir de vos documents officiels.</p></div>'; return; }
  const qs = shuffle(data.questions).map((q, i) => ({ ...q, i }));
  qState[qid] = { qs, answers: {} };
  host.innerHTML = '<div class="qp-row" id="dots-' + qid + '">' + qs.map((q, i) => '<div class="qp-dot" id="dot-' + qid + '-' + i + '"></div>').join('') + '</div>' +
    qs.map((q, i) => {
      const opts = q.opts.map((o, oi) => '<button class="opt" data-letter="' + 'ABCD'[oi] + '" id="o-' + qid + '-' + i + '-' + oi + '" onclick="answer(\'' + qid + '\',' + i + ',' + oi + ')">' + esc(o) + '</button>').join('');
      return '<div class="card"><div class="q-num">Question ' + (i + 1) + ' / ' + qs.length + '</div><div class="q-txt">' + esc(q.q) + '</div>' + opts + '</div>';
    }).join('') + '<div id="res-' + qid + '"></div>';
}
function answer(qid, i, oi) {
  const st = qState[qid]; if (st.answers[i] !== undefined) return;
  const q = st.qs[i]; st.answers[i] = oi;
  q.opts.forEach((_, k) => { const b = $('o-' + qid + '-' + i + '-' + k); b.disabled = true; if (k === q.correct) b.classList.add('good'); });
  if (oi !== q.correct) $('o-' + qid + '-' + i + '-' + oi).classList.add('bad');
  $('dot-' + qid + '-' + i).className = 'qp-dot ' + (oi === q.correct ? 'good' : 'bad');
  if (Object.keys(st.answers).length === st.qs.length) finishQuiz(qid);
}
function finishQuiz(qid) {
  const st = qState[qid];
  const sc = st.qs.filter((q, i) => st.answers[i] === q.correct).length;
  const pct = Math.round(sc / st.qs.length * 100), pass = pct >= 70;
  $('res-' + qid).innerHTML = '<div class="card score"><div class="s-pct">' + pct + '%</div>' +
    '<div class="s-lbl">' + sc + ' bonnes réponses sur ' + st.qs.length + '</div>' +
    '<span class="verdict ' + (pass ? 'ok' : 'ko') + '">' + (pass ? 'Seuil atteint' : 'Seuil non atteint — 70 % requis') + '</span>' +
    '<div class="btn-row" style="justify-content:center"><button class="btn btn-ghost" onclick="renderQuiz(\'' + qid + '\')">Recommencer</button></div></div>';
  if (pass) markDone(qid);
  $('res-' + qid).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ══ Chronomètre à phases ══ */
class Chrono {
  constructor(el, phases, onEnd) {
    this.el = el; this.phases = phases; this.onEnd = onEnd || (() => {});
    this.idx = 0; this.left = phases[0].sec; this.timer = null; this.render();
  }
  render() {
    const p = this.phases[this.idx], over = this.left < 0;
    const warn = !over && this.left <= Math.min(60, p.sec * .15);
    this.el.className = 'chrono' + (over ? ' over' : warn ? ' warn' : '');
    this.el.innerHTML =
      '<div><div class="c-phase">' + esc(p.label) + '</div><div class="c-time">' + mmss(this.left) + '</div>' +
      '<div class="c-sub">' + esc(p.sub || '') + (over ? ' — temps dépassé' : '') + '</div>' +
      '<div class="phase-track">' + this.phases.map((_, i) => '<div class="ph ' + (i < this.idx ? 'done' : i === this.idx ? 'on' : '') + '"></div>').join('') + '</div></div>' +
      '<div class="chrono-actions">' +
      '<button class="btn btn-ghost btn-sm" onclick="CH.toggle()">' + (this.timer ? 'Pause' : 'Démarrer') + '</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="CH.next()">Phase suivante</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="CH.reset()">Réinitialiser</button></div>';
  }
  tick() { this.left--; if (this.left === 0) { try { beep(); } catch (e) {} } this.render(); }
  toggle() { if (this.timer) { clearInterval(this.timer); this.timer = null; } else { this.timer = setInterval(() => this.tick(), 1000); } this.render(); }
  next() {
    if (this.idx < this.phases.length - 1) { this.idx++; this.left = this.phases[this.idx].sec; this.render(); }
    else { this.stop(); this.onEnd(); }
  }
  reset() { this.stop(); this.idx = 0; this.left = this.phases[0].sec; this.render(); }
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
}
let CH = null;
function beep() {
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const c = new C(), o = c.createOscillator(), g = c.createGain();
  o.connect(g); g.connect(c.destination); o.frequency.value = 660; g.gain.value = .07;
  o.start(); setTimeout(() => { o.stop(); c.close(); }, 260);
}

/* ══ Simulateur d'épreuve ══ */
let SIM = { public: 'ados', theme: null };
function simSetPublic(p) {
  SIM.public = p;
  document.querySelectorAll('#sim-publics .chip').forEach(c => c.classList.toggle('on', c.dataset.p === p));
  const c = D.config.epreuve[p];
  $('sim-format').textContent = c.total + ' min au total — ' + c.prep + "' de préparation, " + c.animation + "' d'animation, " + c.entretien + "' d'entretien";
}
function simDraw() {
  const pool = D.themes.filter(t => t.publics.includes(SIM.public));
  const box = $('sim-draw'); box.classList.add('rolling');
  let n = 0;
  const roll = setInterval(() => {
    const t = pool[Math.floor(Math.random() * pool.length)];
    box.innerHTML = '<div class="d-kick">Tirage en cours</div><div class="d-title">' + esc(t.titre) + '</div>';
    if (++n > 9) {
      clearInterval(roll);
      SIM.theme = pool[Math.floor(Math.random() * pool.length)];
      const t2 = SIM.theme;
      box.innerHTML = '<div class="d-kick">Thème tiré au sort — ' + esc(t2.id) + '</div>' +
        '<div class="d-title">' + esc(t2.titre) + '</div>' +
        '<div class="d-meta">Public : ' + esc(D.config.epreuve[SIM.public].label) + ' &nbsp;·&nbsp; Axe : ' + esc(t2.axe) + '</div>';
      $('sim-after').style.display = 'block';
      Store.set('simCount', Store.get('simCount', 0) + 1);
      const c = D.config.epreuve[SIM.public];
      CH = new Chrono($('sim-chrono'), [
        { label: 'Phase 1 — Préparation écrite', sec: c.prep * 60, sub: 'Rédigez votre plan de séance. Aucun retour en arrière ensuite.' },
        { label: 'Phase 2 — Animation', sec: c.animation * 60, sub: 'Mise en situation pédagogique devant le groupe.' },
        { label: 'Phase 3 — Entretien', sec: c.entretien * 60, sub: 'Questions du jury sur la séance et la vision pédagogique.' }
      ], () => { toast('Simulation terminée'); simDebrief(); });
      $('sim-hints').innerHTML =
        '<div class="card"><h2>Attendus du jury sur ce thème</h2><ul>' + t2.attendus.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul>' +
        '<h3>Pièges classiques</h3><ul>' + t2.pieges.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul>' +
        '<div class="warn-box">Ne consultez ce bloc qu\'<strong>après</strong> votre préparation, sous peine de fausser l\'exercice.</div></div>';
      $('sim-hints').style.display = 'none';
      // Pré-remplissage du constructeur de plan
      planSet('theme', t2.titre); planSet('public', SIM.public);
    }
  }, 90);
}
function simRevealHints() { const h = $('sim-hints'); h.style.display = h.style.display === 'none' ? 'block' : 'none'; }
function simDebrief() {
  $('sim-debrief').style.display = 'block';
  $('sim-debrief').scrollIntoView({ behavior: 'smooth' });
}

/* ══ Constructeur de plan de séance ══ */
function planSet(k, v) { const e = $('f-' + k); if (e) e.value = v; }
function planCollect() {
  const o = {};
  D.plan.forEach(s => s.champs.forEach(c => { const e = $('f-' + c[0]); if (e) o[c[0]] = e.value; }));
  return o;
}
function planFill(o) { Object.keys(o || {}).forEach(k => planSet(k, o[k])); }
function planSave() {
  const o = planCollect();
  if (!o.objectif && !o.theme) { toast('Renseignez au moins le thème ou l\'objectif'); return; }
  const l = Store.get('sessions', []);
  l.unshift({ ts: Date.now(), titre: o.theme || o.objectif.slice(0, 60), data: o });
  Store.set('sessions', l.slice(0, 40)); renderSessions(); renderHome(); toast('Plan de séance enregistré');
}
function planClear() { D.plan.forEach(s => s.champs.forEach(c => planSet(c[0], ''))); toast('Formulaire réinitialisé'); }
function renderSessions() {
  const l = Store.get('sessions', []), h = $('plan-list');
  if (!l.length) { h.innerHTML = '<div class="empty">Aucun plan enregistré pour le moment.</div>'; return; }
  h.innerHTML = '<div class="table-wrap"><table><tr><th>Date</th><th>Thème</th><th>Public</th><th></th></tr>' +
    l.map((s, i) => '<tr><td>' + new Date(s.ts).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) + '</td>' +
      '<td>' + esc(s.titre) + '</td><td>' + esc((D.config.epreuve[s.data.public] || {}).label || s.data.public || '—') + '</td>' +
      '<td style="white-space:nowrap"></td></tr>').join('') +
    '</table></div>';
  // Boutons câblés en JS : aucune donnée utilisateur n'est réinjectée dans du HTML inline.
  h.querySelectorAll('tr').forEach((tr, i) => {
    if (i === 0) return; const s = l[i - 1]; const td = tr.lastElementChild;
    td.innerHTML = '';
    const b1 = document.createElement('button'); b1.className = 'btn btn-ghost btn-sm'; b1.textContent = 'Charger';
    b1.onclick = () => { planFill(s.data); toast('Plan chargé'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const b2 = document.createElement('button'); b2.className = 'btn btn-ghost btn-sm'; b2.textContent = 'Imprimer';
    b2.style.marginLeft = '6px'; b2.onclick = () => planPrint(s.data);
    const b3 = document.createElement('button'); b3.className = 'btn btn-danger btn-sm'; b3.textContent = 'Supprimer';
    b3.style.marginLeft = '6px'; b3.onclick = () => { const a = Store.get('sessions', []); a.splice(i - 1, 1); Store.set('sessions', a); renderSessions(); renderHome(); };
    td.append(b1, b2, b3);
  });
}
function planPrint(data) {
  const o = data || planCollect();
  const pub = (D.config.epreuve[o.public] || {}).label || o.public || '';
  const blocs = D.plan.map(s => {
    const rows = s.champs.filter(c => (o[c[0]] || '').trim()).map(c =>
      '<tr><th>' + esc(c[1]) + '</th><td>' + esc(o[c[0]]).replace(/\n/g, '<br>') + '</td></tr>').join('');
    return rows ? '<h2>' + esc(s.titre) + '</h2><table>' + rows + '</table>' : '';
  }).join('');
  const w = window.open('', '_blank');
  if (!w) { toast('Autorisez les fenêtres pop-up pour imprimer'); return; }
  w.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Plan de séance — ' +
    esc(o.theme || 'DIF Yoseikan Budo') + '</title><style>' +
    'body{font-family:Georgia,serif;color:#151B24;max-width:780px;margin:34px auto;padding:0 22px;line-height:1.55}' +
    'header{border-bottom:3px solid #0B1B33;padding-bottom:12px;margin-bottom:22px}' +
    '.k{font-family:monospace;font-size:10px;letter-spacing:.2em;color:#3F6FA8;text-transform:uppercase}' +
    'h1{font-size:19px;color:#050D1B;margin:5px 0 4px}.sub{font-size:12px;color:#5E6A7A}' +
    'h2{font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#10294B;margin:22px 0 7px;' +
    'border-bottom:1px solid #DFE4EB;padding-bottom:4px}' +
    'table{width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:12px;margin-bottom:6px}' +
    'th{text-align:left;width:32%;vertical-align:top;padding:7px 10px 7px 0;color:#5E6A7A;font-weight:600;' +
    'font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #EDF0F4}' +
    'td{padding:7px 0;border-bottom:1px solid #EDF0F4;vertical-align:top}' +
    'footer{margin-top:34px;padding-top:11px;border-top:1px solid #DFE4EB;font-size:10px;color:#8B95A3}' +
    '@media print{body{margin:0}}</style></head><body>' +
    '<header><div class="k">' + esc(D.config.code) + ' — Plan de séance</div>' +
    '<h1>' + esc(o.theme || 'Séance') + '</h1>' +
    '<div class="sub">' + esc(pub) + (o.duree ? ' · ' + esc(o.duree) : '') + ' · ' + new Date().toLocaleDateString('fr-FR') + '</div></header>' +
    blocs + '<footer>' + esc(D.config.titre) + ' — ' + esc(D.config.sous_titre) + '</footer></body></html>');
  w.document.close(); setTimeout(() => w.print(), 350);
}

/* ══ Entretien jury ══ */
let JU = { pool: [], i: 0, timer: null, left: 0 };
function juryStart(cat) {
  const pool = cat === '*' ? D.jury.slice() : D.jury.filter(q => q.cat === cat);
  JU.pool = shuffle(pool); JU.i = 0;
  document.querySelectorAll('#jury-cats .chip').forEach(c => c.classList.toggle('on', c.dataset.c === cat));
  juryShow();
}
function juryShow() {
  if (JU.timer) { clearInterval(JU.timer); JU.timer = null; }
  const q = JU.pool[JU.i];
  if (!q) { $('jury-box').innerHTML = '<div class="empty">Série terminée.</div>'; return; }
  const vus = Store.get('juryVus', []); if (!vus.includes(q.q)) { vus.push(q.q); Store.set('juryVus', vus); }
  JU.left = 90;
  $('jury-box').innerHTML =
    '<div class="draw"><div class="d-kick">' + esc(q.cat) + ' — question ' + (JU.i + 1) + ' / ' + JU.pool.length + '</div>' +
    '<div class="d-title">' + esc(q.q) + '</div>' +
    '<div class="d-meta" id="jury-timer">Temps de réponse conseillé : 01:30</div></div>' +
    '<div class="btn-row"><button class="btn btn-primary" onclick="juryReveal()">Afficher les éléments attendus</button>' +
    '<button class="btn btn-ghost" onclick="JU.i++;juryShow()">Question suivante</button>' +
    '<button class="btn btn-ghost" onclick="juryTimer()">Lancer le chronomètre</button></div>' +
    '<div id="jury-ans" style="display:none"><div class="card"><h2>Éléments attendus</h2><p>' + esc(q.attendu) + '</p>' +
    '<div class="memo"><span class="memo-icon">!</span><div class="memo-body"><strong>Méthode</strong>' +
    'Structurez à voix haute : ce que j\'ai fait, pourquoi je l\'ai fait, ce que j\'en ai observé, ce que je changerais. ' +
    'Une réponse construite en trois temps vaut mieux qu\'une réponse exhaustive et décousue.</div></div></div></div>';
  renderHome();
}
function juryReveal() { $('jury-ans').style.display = 'block'; }
function juryTimer() {
  if (JU.timer) { clearInterval(JU.timer); JU.timer = null; return; }
  JU.timer = setInterval(() => {
    JU.left--; const e = $('jury-timer'); if (!e) { clearInterval(JU.timer); return; }
    e.textContent = 'Temps écoulé : ' + mmss(90 - JU.left) + (JU.left <= 0 ? ' — au-delà du temps conseillé' : '');
    if (JU.left === 0) { try { beep(); } catch (x) {} }
  }, 1000);
}

/* ══ Banque d'exercices ══ */
let EXF = { phase: '*', pub: '*' };
function exFilter(k, v) { EXF[k] = v; document.querySelectorAll('[data-f="' + k + '"]').forEach(c => c.classList.toggle('on', c.dataset.v === v)); renderEx(); }
function renderEx() {
  const l = D.exercices.filter(e => (EXF.phase === '*' || e.phase === EXF.phase) && (EXF.pub === '*' || e.publics.includes(EXF.pub)));
  $('ex-list').innerHTML = l.length ? '<div class="grid g2">' + l.map(e =>
    '<div class="ex"><div class="ex-h"><span class="ex-id">' + esc(e.id) + '</span><span class="ex-n">' + esc(e.nom) + '</span>' +
    '<span class="ex-meta">' + esc(e.duree) + '</span></div>' +
    '<div style="margin-bottom:6px">' + e.publics.map(p => '<span class="tag">' + esc((D.config.epreuve[p] || {}).label || p) + '</span>').join('') + '</div>' +
    '<dl><dt>Organisation</dt><dd>' + esc(e.organisation) + '</dd>' +
    '<dt>Critère de réussite</dt><dd>' + esc(e.critere) + '</dd>' +
    '<dt>Variables didactiques</dt><dd>' + e.variables.map(esc).join(' · ') + '</dd>' +
    '<dt>Sécurité</dt><dd>' + esc(e.securite) + '</dd></dl></div>').join('') + '</div>'
    : '<div class="empty">Aucun exercice ne correspond à ces filtres.</div>';
}

/* ══ Saison ══ */
function saisonSave() {
  const o = {}; document.querySelectorAll('[data-cyc]').forEach(t => o[t.dataset.cyc] = t.value);
  Store.set('saison', o); toast('Planification enregistrée');
}
function saisonLoad() {
  const o = Store.get('saison', {}); document.querySelectorAll('[data-cyc]').forEach(t => { if (o[t.dataset.cyc]) t.value = o[t.dataset.cyc]; });
}

/* ══ Examen blanc ══ */
let EX = { secs: [], ans: {} };
function examStart() {
  const secs = Object.keys(D.quiz).filter(q => D.quiz[q].questions.length);
  let gi = 0, html = '';
  EX = { secs: [], ans: {} };
  secs.forEach((qid, si) => {
    const qs = shuffle(D.quiz[qid].questions).slice(0, 10).map(q => ({ ...q, gi: gi++ }));
    EX.secs.push({ qid, titre: D.quiz[qid].titre, qs });
    html += '<div class="card"><h2>Section ' + (si + 1) + ' — ' + esc(D.quiz[qid].titre.replace('Quiz — ', '')) + '</h2>' +
      qs.map((q, i) => '<div class="q-num">Question ' + (i + 1) + ' / ' + qs.length + '</div><div class="q-txt">' + esc(q.q) + '</div>' +
        q.opts.map((o, oi) => '<button class="opt" data-letter="' + 'ABCD'[oi] + '" id="e-' + q.gi + '-' + oi + '" onclick="examAns(' + q.gi + ',' + oi + ')">' + esc(o) + '</button>').join('') +
        '<div class="divider"></div>').join('') + '</div>';
  });
  $('exam-intro').style.display = 'none';
  $('exam-body').style.display = 'block';
  $('exam-body').innerHTML = html + '<div class="btn-row"><button class="btn btn-primary btn-lg" onclick="examEnd()">Terminer et corriger</button>' +
    '<button class="btn btn-ghost" onclick="examReset()">Abandonner</button></div><div id="exam-res"></div>';
}
function examAns(gi, oi) {
  if (EX.ans[gi] !== undefined) return; EX.ans[gi] = oi;
  const q = EX.secs.flatMap(s => s.qs).find(x => x.gi === gi);
  q.opts.forEach((_, k) => { $('e-' + gi + '-' + k).disabled = true; });
  $('e-' + gi + '-' + oi).classList.add(oi === q.correct ? 'good' : 'bad');
}
function examEnd() {
  let tot = 0, good = 0, lignes = '';
  EX.secs.forEach(s => {
    const g = s.qs.filter(q => EX.ans[q.gi] === q.correct).length;
    tot += s.qs.length; good += g;
    const p = Math.round(g / s.qs.length * 100);
    lignes += '<tr><td>' + esc(s.titre.replace('Quiz — ', '')) + '</td><td>' + g + ' / ' + s.qs.length + '</td>' +
      '<td>' + p + ' %</td><td>' + (p >= 70 ? 'Acquis' : 'À retravailler') + '</td></tr>';
  });
  const pct = Math.round(good / tot * 100);
  $('exam-res').innerHTML = '<div class="card score"><div class="s-pct">' + pct + '%</div>' +
    '<div class="s-lbl">' + good + ' / ' + tot + ' — seuil de réussite : 70 %</div>' +
    '<span class="verdict ' + (pct >= 70 ? 'ok' : 'ko') + '">' + (pct >= 70 ? 'Seuil atteint' : 'Seuil non atteint') + '</span></div>' +
    '<div class="card"><h2>Détail par section</h2><div class="table-wrap"><table>' +
    '<tr><th>Section</th><th>Score</th><th>Taux</th><th>Statut</th></tr>' + lignes + '</table></div>' +
    '<div class="btn-row"><button class="btn btn-ghost" onclick="examReset()">Nouvel examen blanc</button></div></div>';
  $('exam-res').scrollIntoView({ behavior: 'smooth' });
}
function examReset() { $('exam-body').style.display = 'none'; $('exam-intro').style.display = 'block'; }

/* ══ Sauvegarde / restauration ══ */
function exportData() {
  const blob = new Blob([JSON.stringify(Store.all(), null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'YOSEI-DIF_sauvegarde_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); URL.revokeObjectURL(a.href); toast('Sauvegarde téléchargée');
}
function importData(input) {
  const f = input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { Store.load(JSON.parse(r.result)); location.reload(); } catch (e) { toast('Fichier illisible'); } };
  r.readAsText(f);
}

/* ══ Amorçage ══ */
document.addEventListener('DOMContentLoaded', () => {
  Object.keys(D.quiz).forEach(renderQuiz);
  simSetPublic('ados'); renderEx(); renderSessions(); saisonLoad();
  juryStart('*'); renderProgress(); renderHome();
  if (!Store.available) $('warn-storage').style.display = 'block';
  showPage(Store.get('lastPage', 'home'));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  // Le tiroir n'a plus lieu d'être si l'on repasse en affichage large.
  if (typeof window.matchMedia === 'function') {
    const wide = window.matchMedia('(min-width: 901px)');
    const onWide = e => { if (e.matches) closeNav(); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  } else {
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });
  }
  // Fermeture au balayage vers la gauche, sans dépendance externe.
  let x0 = null;
  document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null || !$('sidebar').classList.contains('open')) { x0 = null; return; }
    if (e.changedTouches[0].clientX - x0 < -55) closeNav();
    x0 = null;
  }, { passive: true });
});
