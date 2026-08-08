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
      planSet('duree', D.config.epreuve[SIM.public].total + ' min');
      planSet('eleves', D.config.epreuve[SIM.public].label);
    }
  }, 90);
}
function simRevealHints() { const h = $('sim-hints'); h.style.display = h.style.display === 'none' ? 'block' : 'none'; }
function simDebrief() {
  $('sim-debrief').style.display = 'block';
  $('sim-debrief').scrollIntoView({ behavior: 'smooth' });
}

/* ══ Plan de séance — format officiel FFKDA (UF1c) ══════
   En-tête d'identification + tableau à quatre colonnes.  */
let NLIG = 0;

function planRowHTML(i) {
  const c = D.plan.colonnes;
  return '<div class="pl-row" id="pl-' + i + '">' +
    '<div class="pl-n">Séquence ' + (i + 1) + '</div>' +
    '<div class="pl-grid">' + c.map(col =>
      '<div class="field"><label for="r-' + i + '-' + col[0] + '">' + esc(col[1]) + '</label>' +
      (col[0] === 'minutage'
        ? '<input type="text" id="r-' + i + '-' + col[0] + '" placeholder="ex. 10 min">'
        : '<textarea id="r-' + i + '-' + col[0] + '" rows="3"></textarea>') +
      '</div>').join('') + '</div></div>';
}
function planAddRow(n) {
  const h = $('plan-lignes');
  for (let k = 0; k < (n || 1); k++) { h.insertAdjacentHTML('beforeend', planRowHTML(NLIG)); NLIG++; }
}
function planDelRow() {
  if (NLIG <= 1) { toast('Il faut au moins une séquence'); return; }
  NLIG--; $('pl-' + NLIG).remove();
}
function planSet(k, v) { const e = $('f-' + k); if (e) e.value = v; }
function planCollect() {
  const entete = {};
  D.plan.entete.forEach(c => { const e = $('f-' + c[0]); if (e) entete[c[0]] = e.value; });
  const lignes = [];
  for (let i = 0; i < NLIG; i++) {
    if (!$('pl-' + i)) continue;
    const l = {};
    D.plan.colonnes.forEach(col => { const e = $('r-' + i + '-' + col[0]); if (e) l[col[0]] = e.value; });
    if (Object.values(l).some(v => (v || '').trim())) lignes.push(l);
  }
  return { entete, lignes };
}
function planFill(o) {
  o = o || {};
  Object.keys(o.entete || {}).forEach(k => planSet(k, o.entete[k]));
  $('plan-lignes').innerHTML = ''; NLIG = 0;
  const l = o.lignes || [];
  planAddRow(Math.max(l.length, D.plan.lignes_defaut));
  l.forEach((lig, i) => D.plan.colonnes.forEach(col => {
    const e = $('r-' + i + '-' + col[0]); if (e) e.value = lig[col[0]] || '';
  }));
}
function planClear() {
  D.plan.entete.forEach(c => planSet(c[0], ''));
  $('plan-lignes').innerHTML = ''; NLIG = 0; planAddRow(D.plan.lignes_defaut);
  toast('Formulaire réinitialisé');
}
function planSave() {
  const o = planCollect();
  if (!o.entete.theme && !o.entete.objectif) { toast("Renseignez au moins le thème ou l'objectif principal"); return; }
  const l = Store.get('sessions', []);
  l.unshift({ ts: Date.now(), titre: o.entete.theme || o.entete.objectif.slice(0, 60), data: o });
  Store.set('sessions', l.slice(0, 40)); renderSessions(); renderHome(); toast('Plan de séance enregistré');
}
function renderSessions() {
  const l = Store.get('sessions', []), h = $('plan-list');
  if (!l.length) { h.innerHTML = '<div class="empty">Aucun plan enregistré pour le moment.</div>'; return; }
  h.innerHTML = '<div class="table-wrap"><table><tr><th>Date</th><th>Thème</th><th>Séquences</th><th></th></tr>' +
    l.map(s => '<tr><td>' + new Date(s.ts).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) + '</td>' +
      '<td>' + esc(s.titre) + '</td><td>' + ((s.data.lignes || []).length) + '</td>' +
      '<td style="white-space:nowrap"></td></tr>').join('') + '</table></div>';
  h.querySelectorAll('tr').forEach((tr, i) => {
    if (i === 0) return; const s = l[i - 1], td = tr.lastElementChild; td.innerHTML = '';
    const b = (txt, cls, fn) => { const x = document.createElement('button');
      x.className = 'btn ' + cls + ' btn-sm'; x.textContent = txt; x.style.marginLeft = '6px'; x.onclick = fn; return x; };
    td.append(
      b('Charger', 'btn-ghost', () => { planFill(s.data); toast('Plan chargé'); window.scrollTo(0, 0); }),
      b('Imprimer', 'btn-ghost', () => planPrint(s.data)),
      b('Supprimer', 'btn-danger', () => { const a = Store.get('sessions', []); a.splice(i - 1, 1);
        Store.set('sessions', a); renderSessions(); renderHome(); }));
  });
}
function planPrint(data) {
  const o = data || planCollect();
  const g = k => esc(o.entete[k] || '');
  const pub = (D.config.epreuve[o.entete.public] || {}).label || '';
  const cols = D.plan.colonnes;
  const corps = (o.lignes || []).map(l =>
    '<tr>' + cols.map(c => '<td>' + esc(l[c[0]] || '').replace(/\n/g, '<br>') + '</td>').join('') + '</tr>').join('')
    || '<tr>' + cols.map(() => '<td>&nbsp;</td>').join('') + '</tr>';
  const w = window.open('', '_blank');
  if (!w) { toast('Autorisez les fenêtres pop-up pour imprimer'); return; }
  w.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
    '<title>Plan de séance — ' + g('theme') + '</title><style>' +
    '@page{size:A4 landscape;margin:12mm}' +
    'body{font-family:Helvetica,Arial,sans-serif;color:#151B24;font-size:11px;line-height:1.45;margin:0}' +
    '.id{margin-bottom:12px;border-bottom:2px solid #0B1B33;padding-bottom:9px}' +
    '.id .k{font-family:monospace;font-size:9px;letter-spacing:.18em;color:#17457F;text-transform:uppercase}' +
    '.id p{margin:3px 0}.id .lbl{display:inline-block;min-width:190px;color:#5E6A7A;font-weight:600}' +
    '.id .val{font-weight:600;color:#050D1B}' +
    'table{width:100%;border-collapse:collapse;font-size:10.5px}' +
    'th{background:#0B1B33;color:#fff;text-align:left;padding:7px 9px;font-size:9.5px;' +
    'text-transform:uppercase;letter-spacing:.06em;border:1px solid #0B1B33}' +
    'td{border:1px solid #C7CEDA;padding:7px 9px;vertical-align:top}' +
    'td:nth-child(1){width:26%}td:nth-child(2){width:31%}td:nth-child(3){width:31%}td:nth-child(4){width:12%}' +
    'tr:nth-child(even) td{background:#F7F9FC}' +
    'footer{margin-top:10px;font-size:8.5px;color:#5E6A7A}' +
    '</style></head><body>' +
    '<div class="id"><div class="k">' + esc(D.config.code) + ' — Plan de séance (format FFKDA UF1c)</div>' +
    '<p><span class="lbl">Nom :</span> <span class="val">' + g('nom') + '</span>' +
    ' &nbsp;&nbsp; <span class="lbl" style="min-width:60px">Prénom :</span> <span class="val">' + g('prenom') + '</span></p>' +
    '<p><span class="lbl">Thème de la séance :</span> <span class="val">' + g('theme') + '</span></p>' +
    '<p><span class="lbl">Objectif principal de la séance :</span> <span class="val">' + g('objectif') + '</span></p>' +
    '<p><span class="lbl">Élèves concernés :</span> <span class="val">' + g('eleves') +
    (pub ? ' (' + esc(pub) + ')' : '') + '</span>' +
    ' &nbsp;&nbsp; <span class="lbl" style="min-width:130px">Durée de la séance :</span> <span class="val">' + g('duree') + '</span></p></div>' +
    '<table><tr>' + cols.map(c => '<th>' + esc(c[1]) + '</th>').join('') + '</tr>' + corps + '</table>' +
    '<footer>' + esc(D.config.titre) + ' — ' + esc(D.config.sous_titre) + '</footer></body></html>');
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

/* ══ Corrigés types ══════════════════════════════════════ */
let CORF = '*';
const pubLbl = k => (D.config.epreuve[k] || {}).label || k;

function corFilter(p) {
  CORF = p;
  document.querySelectorAll('[data-fc]').forEach(c => c.classList.toggle('on', c.dataset.fc === p));
  renderCor();
}
function corToggle(id) {
  const b = $('cor-body-' + id), t = $('cor-tgl-' + id);
  const ouvert = b.style.display === 'block';
  b.style.display = ouvert ? 'none' : 'block';
  t.textContent = ouvert ? 'Ouvrir le corrigé' : 'Replier';
  if (!ouvert) b.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function corTableau(c) {
  const ent = D.config.epreuve[c.public] || {};
  const lignes = c.plan.map(b =>
    '<tr><td>' + esc(b.objectifs) + '</td>' +
    '<td>' + esc(b.exercices) + '</td>' +
    '<td>' + b.organisation + '</td>' +
    '<td>' + esc(b.minutage) + '</td></tr>').join('');
  return '<div class="entete-off">' +
    '<div class="eo-l"><span>Thème de la séance</span>' + esc(c.theme) + '</div>' +
    '<div class="eo-l"><span>Objectif principal de la séance</span>' + esc(c.objectif) + '</div>' +
    '<div class="eo-l"><span>Élèves concernés</span>' + esc(c.contexte.effectif) + ' — ' + esc(c.contexte.niveau) +
    ' (' + esc(ent.label || c.public) + ')</div>' +
    '<div class="eo-l"><span>Durée de la séance</span>' + esc(c.contexte.duree) + '</div></div>' +
    '<div class="table-wrap"><table class="t-plan"><tr>' +
    D.plan.colonnes.map(x => '<th>' + esc(x[1]) + '</th>').join('') + '</tr>' + lignes + '</table></div>';
}

function corHTML(c) {
  const ctx = c.contexte;
  const ligne = (k, v) => '<tr><th>' + esc(k) + '</th><td>' + esc(v) + '</td></tr>';
  const liste = a => '<ul>' + a.map(x => '<li>' + x + '</li>').join('') + '</ul>';
  const listeEsc = a => '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';

  const plan = c.plan.filter(b => b.critere || (b.variables && b.variables.length)).map((b, i) =>
    '<div class="seq"><div class="seq-h"><span class="seq-t">' + esc(b.minutage) + '</span>' +
    '<span class="seq-n">' + esc(b.objectifs) + '</span></div><dl>' +
    (b.critere ? '<dt>Critère de réussite observable</dt><dd>' + esc(b.critere) + '</dd>' : '') +
    (b.variables && b.variables.length
      ? '<dt>Variables didactiques</dt><dd>' + b.variables.map(esc).join(' · ') + '</dd>' : '') +
    '</dl></div>').join('');

  const entretien = c.entretien.map((q, i) =>
    '<div class="qa"><div class="qa-q">' + (i + 1) + '. ' + esc(q[0]) + '</div>' +
    '<div class="qa-a">' + esc(q[1]) + '</div></div>').join('');

  return '' +
   '<h3>Analyse du thème</h3>' + liste(c.analyse) +

   '<h3>Contexte</h3><div class="table-wrap"><table>' +
   ligne('Public et effectif', ctx.effectif) + ligne('Niveau', ctx.niveau) +
   ligne('Durée', ctx.duree) + ligne('Surface', ctx.surface) + ligne('Matériel', ctx.materiel) +
   '</table></div>' +

   '<div class="cle"><div class="cle-k">Objectif opérationnel</div>' +
   '<div class="cle-v">' + esc(c.objectif) + '</div></div>' +
   '<div class="cle"><div class="cle-k">Critère de réussite observable</div>' +
   '<div class="cle-v">' + esc(c.critere) + '</div></div>' +
   '<div class="cle"><div class="cle-k">Prérequis supposés</div>' +
   '<div class="cle-v">' + esc(c.prerequis) + '</div></div>' +

   '<h3>Sécurité</h3>' +
   '<h4>Risques identifiés</h4>' + listeEsc(c.securite.risques) +
   '<h4>Mesures de prévention</h4>' + listeEsc(c.securite.mesures) +
   '<h4>Vérifications avant la séance</h4>' + listeEsc(c.securite.verifications) +

   '<h3>Plan de séance — format officiel FFKDA</h3>' +
   '<p class="src">Tableau à quatre colonnes de la fiche UF1c. C\'est ce document que vous ' +
   'remettez au jury à l\'issue de vos 30 minutes de préparation.</p>' + corTableau(c) +

   '<h3>Critères de réussite et variables, séquence par séquence</h3>' +
   '<p class="src">Ce que vous gardez en tête pour animer et pour répondre au jury — cela ne figure pas dans le tableau remis.</p>' + plan +

   '<h3>Régulation</h3><div class="table-wrap"><table>' +
   ligne('Pratiquant en difficulté', c.regulation.difficulte) +
   ligne('Pratiquant en avance', c.regulation.avance) +
   ligne('Plan B', c.regulation.planb) +
   '</table></div>' +

   '<h3>Ce que le jury observe pendant l\'animation</h3>' + listeEsc(c.jury_observe) +

   '<h3>Entretien pédagogique — questions probables et réponses modèles</h3>' + entretien +

   '<h3>Erreurs à ne pas commettre</h3>' + listeEsc(c.erreurs);
}
function renderCor() {
  const l = D.corriges.filter(c => CORF === '*' || c.public === CORF);
  const h = $('cor-list');
  if (!l.length) { h.innerHTML = '<div class="empty">Aucun corrigé pour ce public.</div>'; return; }
  h.innerHTML = l.map(c =>
    '<div class="card cor"><div class="cor-h">' +
    '<span class="cor-id">' + esc(c.id) + ' · ' + esc(c.theme_id) + '</span>' +
    '<span class="tag">' + esc(pubLbl(c.public)) + '</span>' +
    '<span class="tag">' + esc(c.contexte.duree) + '</span></div>' +
    '<h2>' + esc(c.theme) + '</h2>' +
    '<p>' + esc(c.contexte.effectif) + ' — ' + esc(c.contexte.niveau) + '</p>' +
    '<div class="btn-row">' +
    '<button class="btn btn-primary" id="cor-tgl-' + c.id + '" onclick="corToggle(\'' + c.id + '\')">Ouvrir le corrigé</button>' +
    '<button class="btn btn-ghost" onclick="corPrint(\'' + c.id + '\')">Imprimer ce corrigé</button></div>' +
    '<div class="cor-body" id="cor-body-' + c.id + '" style="display:none">' + corHTML(c) + '</div></div>').join('');
}
function corPrint(id) {
  const c = D.corriges.find(x => x.id === id); if (!c) return;
  const w = window.open('', '_blank');
  if (!w) { toast('Autorisez les fenêtres pop-up pour imprimer'); return; }
  w.document.write('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
   '<title>Corrigé ' + esc(c.id) + ' — ' + esc(c.theme) + '</title><style>' +
   'body{font-family:Georgia,serif;color:#151B24;max-width:800px;margin:32px auto;padding:0 22px;line-height:1.55;font-size:12.5px}' +
   'header{border-bottom:3px solid #0B1B33;padding-bottom:12px;margin-bottom:20px}' +
   '.k{font-family:monospace;font-size:10px;letter-spacing:.2em;color:#17457F;text-transform:uppercase}' +
   'h1{font-size:19px;color:#050D1B;margin:6px 0 4px}.sub{font-size:11.5px;color:#5E6A7A}' +
   'h3{font-size:12.5px;text-transform:uppercase;letter-spacing:.1em;color:#10294B;margin:20px 0 7px;' +
   'border-bottom:1px solid #DFE4EB;padding-bottom:4px}' +
   'h4{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:#5E6A7A;margin:12px 0 4px}' +
   'table{width:100%;border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:11.5px;margin:6px 0}' +
   'th{text-align:left;width:30%;vertical-align:top;padding:6px 10px 6px 0;color:#5E6A7A;font-weight:600;' +
   'font-size:10px;text-transform:uppercase;border-bottom:1px solid #EDF0F4}' +
   'td{padding:6px 0;border-bottom:1px solid #EDF0F4;vertical-align:top}' +
   'ul{margin:4px 0 8px 18px}li{margin-bottom:3px}' +
   '.cle{border-left:3px solid #1D4E8F;background:#F2F6FC;padding:9px 13px;margin:9px 0}' +
   '.cle-k{font-size:9.5px;text-transform:uppercase;letter-spacing:.1em;color:#10294B;font-weight:700}' +
   '.cle-v{font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#151B24;margin-top:2px}' +
   '.seq{border:1px solid #DFE4EB;border-radius:4px;padding:10px 13px;margin-bottom:8px;break-inside:avoid}' +
   '.seq-h{display:flex;gap:10px;align-items:baseline;margin-bottom:6px;flex-wrap:wrap}' +
   '.seq-t{font-family:monospace;font-size:11px;color:#17457F;font-weight:700}' +
   '.seq-n{font-weight:700;color:#050D1B;font-size:12.5px}' +
   '.seq-o{font-size:10.5px;color:#5E6A7A;font-style:italic}' +
   'dl{font-family:Helvetica,Arial,sans-serif;font-size:11.5px;margin:0}' +
   'dt{font-size:9.5px;text-transform:uppercase;letter-spacing:.08em;color:#17457F;font-weight:700;margin-top:6px}' +
   'dd{margin:1px 0 0;color:#2A3441}' +
   'table.t-plan td:nth-child(1){width:26%}table.t-plan td:nth-child(2){width:29%}' +
   'table.t-plan td:nth-child(3){width:33%}table.t-plan td:nth-child(4){width:12%}' +
   'table.t-plan td b{color:#10294B}' +
   '.entete-off{border:1px solid #C7CEDA;border-radius:3px;padding:9px 12px;margin:8px 0}' +
   '.eo-l{font-size:11px;margin-bottom:4px}' +
   '.eo-l span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.09em;color:#5E6A7A;font-weight:700}' +
   '.src{font-size:10px;color:#5E6A7A;font-style:italic;margin:2px 0 6px}' +
   '.qa{margin-bottom:11px;break-inside:avoid}' +
   '.qa-q{font-weight:700;color:#10294B;font-size:12.5px}' +
   '.qa-a{font-family:Helvetica,Arial,sans-serif;font-size:11.5px;color:#2A3441;margin-top:3px;' +
   'border-left:2px solid #DFE4EB;padding-left:11px}' +
   'footer{margin-top:28px;padding-top:10px;border-top:1px solid #DFE4EB;font-size:9.5px;color:#5E6A7A}' +
   '@media print{body{margin:0}}</style></head><body>' +
   '<header><div class="k">' + esc(D.config.code) + ' · Corrigé ' + esc(c.id) + '</div>' +
   '<h1>' + esc(c.theme) + '</h1><div class="sub">' + esc(pubLbl(c.public)) + ' — ' +
   esc(c.contexte.effectif) + ' — ' + esc(c.contexte.duree) + '</div></header>' +
   corHTML(c) +
   '<footer>' + esc(D.config.titre) + ' — ' + esc(D.config.sous_titre) +
   '. Ce corrigé est une proposition cohérente, non une réponse unique.</footer></body></html>');
  w.document.close(); setTimeout(() => w.print(), 350);
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

/* ══ QCM de préformation ══════════════════════════════
   Tirage de 40 questions dans les seules banques UF1 et UF2. */
function prefoStart() {
  const pool = shuffle(D.quiz.q3.questions.map(q => ({ ...q, uf: 'UF1' }))
    .concat(D.quiz.q4.questions.map(q => ({ ...q, uf: 'UF2' })))).slice(0, 40);
  EX = { secs: [{ qid: 'prefo', titre: 'Préformation UF1 et UF2', qs: pool.map((q, i) => ({ ...q, gi: i })) }], ans: {} };
  $('prefo-body').innerHTML = '<div class="card">' +
    EX.secs[0].qs.map((q, i) =>
      '<div class="q-num">Question ' + (i + 1) + ' / 40 · ' + esc(q.uf) + '</div>' +
      '<div class="q-txt">' + esc(q.q) + '</div>' +
      q.opts.map((o, oi) => '<button class="opt" data-letter="' + 'ABCD'[oi] + '" id="e-' + q.gi + '-' + oi +
        '" onclick="examAns(' + q.gi + ',' + oi + ')">' + esc(o) + '</button>').join('') +
      '<div class="divider"></div>').join('') + '</div>' +
    '<div class="btn-row"><button class="btn btn-primary btn-lg" onclick="prefoEnd()">Terminer et corriger</button>' +
    '<button class="btn btn-ghost" onclick="prefoStart()">Nouveau tirage</button></div><div id="prefo-res"></div>';
  $('prefo-body').scrollIntoView({ behavior: 'smooth' });
}
function prefoEnd() {
  const qs = EX.secs[0].qs;
  const good = qs.filter(q => EX.ans[q.gi] === q.correct).length;
  const pct = Math.round(good / qs.length * 100);
  const par = uf => { const s = qs.filter(q => q.uf === uf);
    return s.length ? Math.round(s.filter(q => EX.ans[q.gi] === q.correct).length / s.length * 100) : 0; };
  $('prefo-res').innerHTML = '<div class="card score"><div class="s-pct">' + pct + '%</div>' +
    '<div class="s-lbl">' + good + ' / ' + qs.length + ' — seuil 70 %</div>' +
    '<span class="verdict ' + (pct >= 70 ? 'ok' : 'ko') + '">' +
    (pct >= 70 ? 'Seuil atteint' : 'Seuil non atteint') + '</span></div>' +
    '<div class="card"><h2>Détail par unité de formation</h2><div class="table-wrap"><table>' +
    '<tr><th>Unité</th><th>Taux</th><th>Statut</th></tr>' +
    ['UF1', 'UF2'].map(uf => { const p = par(uf);
      return '<tr><td>' + uf + '</td><td>' + p + ' %</td><td>' +
        (p >= 70 ? 'Acquis' : 'À retravailler') + '</td></tr>'; }).join('') +
    '</table></div></div>';
  $('prefo-res').scrollIntoView({ behavior: 'smooth' });
}

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
  simSetPublic('ados'); renderEx(); planAddRow(D.plan.lignes_defaut);
  renderSessions(); saisonLoad(); renderCor();
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
