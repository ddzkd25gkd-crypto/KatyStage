/* ── state ── */
const profile = { functie: null, sector: null, regio: null, themas: [] };
let priorityTheme = null;
let regioFilterOn = true;

/* ── data ── */
const DUIDING = {
  'Arbeidsmarkt': {
    icon: '👥',
    text: 'De arbeidsmarktdruk in de zorg blijft toenemen. Personeelstekorten zijn breed voelbaar, met name in VVT en GGZ. Cao-onderhandelingen domineren de agenda bij HR en bestuur. Actie op instroom, retentie en flexibilisering is urgent.'
  },
  'Passende zorg': {
    icon: '🎯',
    text: 'Passende zorg staat centraal in de hervorming van het zorgstelsel. Het IZA en de Juiste Zorg op de Juiste Plek-beweging vragen om verschuiving van taken. Nieuwe bekostigingsmodellen en samenwerking staan hoog op de agenda.'
  },
  'Digitalisering': {
    icon: '💻',
    text: 'AI-toepassingen winnen terrein in diagnostiek en administratie. EPD-vervanging en data-uitwisseling (FHIR) staan hoog op de agenda. Cyberveiligheid wordt een bestuurlijke kernverantwoordelijkheid.'
  },
  'Capaciteitsdruk': {
    icon: '📊',
    text: 'Wachtlijsten groeien in bijna alle sectoren. Capaciteitsplanning vraagt om samenwerking over grenzen heen. Regiobeelden bieden inzicht, maar de vertaling naar oplossingen blijft een uitdaging.'
  },
  'Regionale samenwerking': {
    icon: '🤝',
    text: 'IZA-akkoorden dwingen tot regionale samenwerking. Netwerkzorg vraagt nieuwe governance en heldere afspraken. Regio\'s verschillen sterk in volwassenheid — van verkenning tot concrete uitvoering.'
  },
  'Financiering': {
    icon: '💶',
    text: 'De NZa stuurt op transparantie en doelmatigheid. Bezuinigingen op langdurige zorg zetten druk op instellingen. Bestuurders zoeken naar bekostigingsmodellen die kwaliteit en kostenbeheersing verbinden.'
  }
};

const THEME_COLORS = {
  'Arbeidsmarkt':           '#0B7075',
  'Passende zorg':          '#2D6A4F',
  'Digitalisering':         '#4F46E5',
  'Capaciteitsdruk':        '#C2410C',
  'Regionale samenwerking': '#0369A1',
  'Financiering':           '#7C3AED',
};

const ARTICLES = [
  { title: 'Personeelstekort in VVT bereikt nieuw record', excerpt: 'Ruim 40% van de VVT-instellingen meldt dat de bezetting structureel onder de norm ligt, blijkt uit nieuw onderzoek van ActiZ.', thema: 'Arbeidsmarkt', datum: 'Vandaag', minuten: 4 },
  { title: 'Minister kondigt nieuw actieplan passende zorg aan', excerpt: 'Het kabinet presenteert een driejarig investeringsprogramma gericht op de verschuiving van ziekenhuiszorg naar de eerste lijn.', thema: 'Passende zorg', datum: 'Gisteren', minuten: 6 },
  { title: 'AI in de radiologie: van pilot naar praktijk', excerpt: 'Steeds meer ziekenhuizen zetten AI-tools in voor beelddiagnostiek. Een inventarisatie van ervaringen en valkuilen.', thema: 'Digitalisering', datum: '2 dagen geleden', minuten: 5 },
  { title: 'GGZ-wachtlijsten nauwelijks korter ondanks extra middelen', excerpt: 'Ondanks de extra investeringen uit het Hoofdlijnenakkoord GGZ zijn de wachttijden in 2025 nauwelijks gedaald.', thema: 'Capaciteitsdruk', datum: '3 dagen geleden', minuten: 7 },
  { title: 'Regio Utrecht sluit breed IZA-uitvoeringsplan', excerpt: 'Zeven zorgorganisaties en drie gemeenten ondertekenen een samenwerkingsconvenant gericht op thuiszorg en preventie.', thema: 'Regionale samenwerking', datum: '4 dagen geleden', minuten: 4, isRegio: true },
  { title: 'NZa publiceert nieuwe tarieven langdurige zorg', excerpt: 'De nieuwe tarieven voor 2026 zijn gepubliceerd. Instellingen krijgen te maken met hogere energiekosten en een beperkte looncompensatie.', thema: 'Financiering', datum: '5 dagen geleden', minuten: 5 },
];

const REGIO_ITEMS = {
  'Noord-Holland': [
    { title: 'Amsterdam UMC en Dijklander werken aan regionale spoedzorgketen', meta: 'Noord-Holland · 2 dagen geleden' },
    { title: 'Wethouder: meer investeringen in wijkverpleging nodig', meta: 'Noord-Holland · 4 dagen geleden' },
    { title: 'Transferpunt Noord-Holland West van start: snellere doorstroom uit ziekenhuis', meta: 'Noord-Holland · 1 week geleden' },
  ],
  'Zuid-Holland': [
    { title: 'Regio Rijnmond sluit samenwerkingsconvenant acute zorg', meta: 'Zuid-Holland · 1 dag geleden' },
    { title: 'Haagse zorgorganisaties starten pilot met zorgcoördinatie-app', meta: 'Zuid-Holland · 3 dagen geleden' },
  ],
  'Utrecht': [
    { title: 'UMC Utrecht en huisartsen starten gezamenlijk wachtlijstoverleg', meta: 'Utrecht · Vandaag' },
    { title: 'Provincie Utrecht investeert in regionale GGZ-samenwerking', meta: 'Utrecht · 2 dagen geleden' },
  ],
  'Noord-Brabant': [
    { title: 'Brabantse ziekenhuizen testen gezamenlijk capaciteitsmodel', meta: 'Noord-Brabant · 3 dagen geleden' },
    { title: 'ETZ en Elisabeth-TweeSteden Ziekenhuis versterken samenwerking', meta: 'Noord-Brabant · 1 week geleden' },
  ],
  'Gelderland': [
    { title: 'Gelderse zorgaanbieders lanceren regioplatform voor arbeidsmarkt', meta: 'Gelderland · Gisteren' },
    { title: 'Radboudumc presenteert regiovisie 2026–2030', meta: 'Gelderland · 5 dagen geleden' },
  ],
  'Overijssel': [
    { title: 'ZGT en Medisch Spectrum Twente bundelen krachten in regio Oost', meta: 'Overijssel · 2 dagen geleden' },
  ],
  'Friesland': [
    { title: 'MCL en Tjongerschans werken aan gecombineerde wachtlijstaanpak', meta: 'Friesland · 3 dagen geleden' },
  ],
  'Groningen': [
    { title: 'UMCG lanceert digitaal zorgnetwerk voor Noordoost-Nederland', meta: 'Groningen · Gisteren' },
  ],
  'Zeeland': [
    { title: 'Adrz en Zeeuwse gemeenten starten pilot bereikbaarheid ouderenzorg', meta: 'Zeeland · 4 dagen geleden' },
  ],
  'Limburg': [
    { title: 'VieCuri en Zuyderland versterken samenwerking in Midden-Limburg', meta: 'Limburg · 2 dagen geleden' },
  ],
};

/* ── selectie ── */
document.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (pill) {
    const key = pill.dataset.key;
    document.querySelectorAll(`.pill[data-key="${key}"]`).forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    profile[key] = pill.dataset.val;
  }
  const tc = e.target.closest('.theme-card');
  if (tc) {
    const val = tc.dataset.val;
    if (tc.classList.contains('selected')) {
      tc.classList.remove('selected');
      profile.themas = profile.themas.filter(t => t !== val);
    } else {
      tc.classList.add('selected');
      profile.themas.push(val);
    }
  }
});

/* ── stapnavigatie ── */
function goStep(n) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');

  // progress bar
  const pct = { 1: 33, 2: 66, 3: 100 };
  document.getElementById('ob-progress-bar').style.width = pct[n] + '%';

  // left panel steps
  document.querySelectorAll('.ls-item').forEach(el => {
    el.classList.remove('active', 'done');
    const num = parseInt(el.dataset.n);
    if (num === n) el.classList.add('active');
    if (num < n)  el.classList.add('done');
  });
}

/* ── onboarding afronden ── */
function finishOnboarding() {
  if (profile.themas.length === 0) {
    document.querySelectorAll('.theme-card').forEach((tc, i) => {
      if (i < 2) { tc.classList.add('selected'); profile.themas.push(tc.dataset.val); }
    });
  }
  if (!profile.functie) profile.functie = 'Beleidsmedewerker';
  if (!profile.sector)  profile.sector  = 'VVT';
  if (!profile.regio)   profile.regio   = 'Noord-Holland';

  buildDashboard();
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
}

/* ── dashboard bouwen ── */
function buildDashboard() {
  document.getElementById('topbar-avatar').textContent  = 'KV';
  document.getElementById('sidebar-avatar').textContent = 'KV';
  document.getElementById('profile-name').textContent = 'Katy van Vogelpoel';
  document.getElementById('profile-role').textContent = `${profile.functie} · ${profile.sector}`;
  document.getElementById('regio-naam').textContent   = profile.regio;
  document.getElementById('stat-themas').textContent  = profile.themas.length;

  const hour = new Date().getHours();
  const gr = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
  document.getElementById('welcome-title').textContent = `${gr}, Katy`;

  // sidebar thema's
  const sidebar = document.getElementById('sidebar-themes');
  sidebar.innerHTML = '';
  profile.themas.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-tag';
    btn.innerHTML = `<span>${DUIDING[t]?.icon || '●'}</span>${t}`;
    btn.onclick = () => setPriority(t);
    sidebar.appendChild(btn);
  });

  // priority select
  const sel = document.getElementById('priority-select');
  sel.innerHTML = '<option value="">— Geen prioriteit —</option>';
  profile.themas.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t; opt.textContent = t;
    sel.appendChild(opt);
  });

  renderArticles();
  renderDuiding();
  renderRegio();
}

/* ── artikelen ── */
function renderArticles() {
  const grid = document.getElementById('articles-grid');
  grid.innerHTML = '';
  let filtered = ARTICLES.filter(a => profile.themas.includes(a.thema));
  if (priorityTheme) {
    filtered = [...filtered.filter(a => a.thema === priorityTheme), ...filtered.filter(a => a.thema !== priorityTheme)];
  }
  filtered.slice(0, 6).forEach((art, i) => {
    const color = THEME_COLORS[art.thema] || '#0B7075';
    const card = document.createElement('div');
    card.className = 'article-card';
    card.style.animationDelay = `${i * 55}ms`;
    card.innerHTML = `
      <div class="ac-stripe" style="background:${color}"></div>
      <div class="ac-body">
        <div class="ac-top">
          <span class="ac-tag${art.isRegio ? ' regio' : ''}">${art.thema}</span>
          <span class="ac-readtime">${art.minuten} min</span>
        </div>
        <div class="ac-title">${art.title}</div>
        <div class="ac-excerpt">${art.excerpt}</div>
        <div class="ac-footer">
          <span class="ac-date">${art.datum}</span>
          <span class="ac-arrow">Lees meer →</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── duiding ── */
function renderDuiding() {
  const row = document.getElementById('duiding-row');
  row.innerHTML = '';
  profile.themas.forEach((t, i) => {
    const d = DUIDING[t]; if (!d) return;
    const card = document.createElement('div');
    card.className = 'duiding-card';
    card.style.animationDelay = `${i * 65}ms`;
    card.innerHTML = `
      <div class="dc-header">
        <div class="dc-icon-wrap">${d.icon}</div>
        <div>
          <div class="dc-theme-name">${t}</div>
          <div class="dc-label">Thematische duiding</div>
        </div>
      </div>
      <div class="dc-body"><p class="dc-text">${d.text}</p></div>
    `;
    row.appendChild(card);
  });
}

/* ── regio ── */
function renderRegio() {
  const section = document.getElementById('regio-section');
  const list    = document.getElementById('regio-list');
  list.innerHTML = '';
  if (!regioFilterOn) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  const items = REGIO_ITEMS[profile.regio] || [];
  if (!items.length) { list.innerHTML = '<p style="color:var(--ink-muted);font-size:14px">Geen regionale berichten gevonden.</p>'; return; }
  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'regio-item';
    el.style.animationDelay = `${i * 60}ms`;
    el.innerHTML = `
      <div class="ri-pin">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
      <div>
        <div class="ri-title">${item.title}</div>
        <div class="ri-meta">${item.meta}</div>
      </div>
      <div class="ri-chevron">→</div>
    `;
    list.appendChild(el);
  });
}

/* ── regiofilter ── */
function toggleRegioFilter(on) {
  regioFilterOn = on;
  renderRegio();
  document.getElementById('welcome-sub').innerHTML = on
    ? 'Je hebt <strong>7 nieuwe artikelen</strong> op basis van jouw profiel.'
    : 'Regiofilter staat uit — je ziet landelijk nieuws.';
}

/* ── prioriteit ── */
function setPriority(val) {
  priorityTheme = val || null;
  document.getElementById('priority-select').value = val || '';
  document.querySelectorAll('.theme-tag').forEach(tag => {
    tag.classList.toggle('priority', val && tag.textContent.trim().includes(val));
  });
  const band = document.getElementById('priority-band');
  if (val && DUIDING[val]) {
    document.getElementById('pb-title').textContent   = `Prioriteitsthema: ${val}`;
    document.getElementById('pb-duiding').textContent = DUIDING[val].text;
    band.style.display = 'flex';
  } else {
    band.style.display = 'none';
  }
  renderArticles();
}

/* ── reset ── */
function resetOnboarding() {
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  goStep(1);
}

window.onload = () => goStep(1);
