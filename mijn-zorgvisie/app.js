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
    text: 'Passende zorg staat centraal in de hervorming van het zorgstelsel. Het IZA en de Juiste Zorg op de Juiste Plek-beweging vragen om verschuiving van taken en verantwoordelijkheden. Voor managers betekent dit nadenken over nieuwe bekostigingsmodellen en samenwerking.'
  },
  'Digitalisering': {
    icon: '💻',
    text: 'AI-toepassingen in de zorg winnen terrein, met name in diagnostiek en administratie. EPD-vervanging en data-uitwisseling (FHIR) staan hoog op de agenda. Cyberveiligheid wordt een bestuurlijke verantwoordelijkheid nu incidenten toenemen.'
  },
  'Capaciteitsdruk': {
    icon: '📊',
    text: 'Wachtlijsten groeien in bijna alle sectoren. Capaciteitsplanning vraagt om samenwerking over organisatiegrenzen heen. Regiobeelden bieden inzicht, maar de vertaling naar oplossingen blijft een uitdaging voor bestuurders en managers.'
  },
  'Regionale samenwerking': {
    icon: '🤝',
    text: 'IZA-akkoorden dwingen tot regionale samenwerking. Netwerkzorg vraagt nieuwe governance en heldere afspraken over verantwoordelijkheden. Regio\'s verschillen sterk in volwassenheid — van verkennende tafelgesprekken tot concrete uitvoeringsplannen.'
  },
  'Financiering': {
    icon: '💶',
    text: 'De NZa stuurt op transparantie en doelmatigheid. Bezuinigingen op langdurige zorg zetten druk op instellingen. Bestuurders zoeken naar slimme bekostigingsmodellen die zowel kwaliteit als kostenbeheersing dienen.'
  }
};

const ARTICLES = [
  { title: 'Personeelstekort in VVT bereikt nieuw record', excerpt: 'Ruim 40% van de VVT-instellingen meldt dat de bezetting structureel onder de norm ligt, blijkt uit nieuw onderzoek van ActiZ.', thema: 'Arbeidsmarkt', kleur: '#0B6E72', datum: 'Vandaag' },
  { title: 'Minister kondigt nieuw actieplan passende zorg aan', excerpt: 'Het kabinet presenteert een driejarig investeringsprogramma gericht op de verschuiving van ziekenhuiszorg naar de eerste lijn.', thema: 'Passende zorg', kleur: '#2D6A4F', datum: 'Gisteren' },
  { title: 'AI in de radiologie: van pilot naar praktijk', excerpt: 'Steeds meer ziekenhuizen zetten AI-tools in voor beelddiagnostiek. Een inventarisatie van ervaringen en valkuilen.', thema: 'Digitalisering', kleur: '#5A67D8', datum: '2 dagen geleden' },
  { title: 'GGZ-wachtlijsten nauwelijks korter ondanks extra middelen', excerpt: 'Ondanks de extra investeringen uit het Hoofdlijnenakkoord GGZ zijn de wachttijden in 2025 nauwelijks gedaald.', thema: 'Capaciteitsdruk', kleur: '#C05621', datum: '3 dagen geleden' },
  { title: 'Regio Utrecht sluit breed IZA-uitvoeringsplan', excerpt: 'Zeven zorgorganisaties en drie gemeenten ondertekenen een samenwerkingsconvenant gericht op thuiszorg en preventie.', thema: 'Regionale samenwerking', kleur: '#0B6E72', datum: '4 dagen geleden', isRegio: true },
  { title: 'NZa publiceert nieuwe tarieven langdurige zorg', excerpt: 'De nieuwe tarieven voor 2026 zijn gepubliceerd. Instellingen krijgen te maken met hogere energiekosten en een beperkte looncompensatie.', thema: 'Financiering', kleur: '#744210', datum: '5 dagen geleden' },
];

const REGIO_ITEMS = {
  'Noord-Holland': [
    { title: 'Amsterdam UMC en Dijklander werken aan regionale spoedzorgketen', meta: 'Noord-Holland · 2 dagen geleden' },
    { title: 'Wethouder Noord-Holland: meer investeringen in wijkverpleging nodig', meta: 'Noord-Holland · 4 dagen geleden' },
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

const KLEUREN = {
  'Arbeidsmarkt':           '#0B6E72',
  'Passende zorg':          '#2D6A4F',
  'Digitalisering':         '#5A67D8',
  'Capaciteitsdruk':        '#C05621',
  'Regionale samenwerking': '#0B5EA8',
  'Financiering':           '#744210',
};

/* ── pill / card selectie ── */
document.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (pill) {
    const key = pill.dataset.key;
    const val = pill.dataset.val;
    // single select per key
    document.querySelectorAll(`.pill[data-key="${key}"]`).forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    profile[key] = val;
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

  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < n) s.classList.add('done');
    if (i + 1 === n) s.classList.add('active');
  });
}

/* ── onboarding afronden ── */
function finishOnboarding() {
  if (profile.themas.length === 0) {
    // selecteer eerste twee als niks gekozen
    document.querySelectorAll('.theme-card').forEach((tc, i) => {
      if (i < 2) {
        tc.classList.add('selected');
        profile.themas.push(tc.dataset.val);
      }
    });
  }
  if (!profile.functie) profile.functie = 'Beleidsmedewerker';
  if (!profile.sector)  profile.sector  = 'VVT';
  if (!profile.regio)   profile.regio   = 'Noord-Holland';

  buildDashboard();

  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
}

/* ── dashboard opbouwen ── */
function buildDashboard() {
  // profiel
  const initials = 'KV';
  document.getElementById('topbar-avatar').textContent = initials;
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('profile-name').textContent = 'Katy van Vogelpoel';
  document.getElementById('profile-role').textContent = `${profile.functie} · ${profile.sector}`;
  document.getElementById('regio-naam').textContent = profile.regio;

  // welkom
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
  document.getElementById('welcome-title').textContent = `${greeting}, Katy`;

  // sidebar thema's
  const sidebar = document.getElementById('sidebar-themes');
  sidebar.innerHTML = '';
  profile.themas.forEach(t => {
    const tag = document.createElement('button');
    tag.className = 'theme-tag';
    tag.innerHTML = `<span>${DUIDING[t]?.icon || '●'}</span> ${t}`;
    tag.onclick = () => setPriority(t);
    sidebar.appendChild(tag);
  });

  // priority select
  const sel = document.getElementById('priority-select');
  sel.innerHTML = '<option value="">— geen prioriteit —</option>';
  profile.themas.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
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

  // filter op profiel-thema's, met prioriteit bovenaan
  let filtered = ARTICLES.filter(a => profile.themas.includes(a.thema));
  if (priorityTheme) {
    filtered = [
      ...filtered.filter(a => a.thema === priorityTheme),
      ...filtered.filter(a => a.thema !== priorityTheme),
    ];
  }

  filtered.slice(0, 6).forEach((art, i) => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.style.animationDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="ac-color-bar" style="background:${art.kleur}"></div>
      <div class="ac-body">
        <span class="ac-tag${art.isRegio ? ' regio' : ''}">${art.isRegio ? '📍 ' : ''}${art.thema}</span>
        <div class="ac-title">${art.title}</div>
        <div class="ac-excerpt">${art.excerpt}</div>
        <div class="ac-meta">${art.datum}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ── thematische duiding ── */
function renderDuiding() {
  const row = document.getElementById('duiding-row');
  row.innerHTML = '';

  profile.themas.forEach((t, i) => {
    const d = DUIDING[t];
    if (!d) return;
    const card = document.createElement('div');
    card.className = 'duiding-card';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="dc-icon">${d.icon}</div>
      <div class="dc-theme">${t}</div>
      <div class="dc-text">${d.text}</div>
    `;
    row.appendChild(card);
  });
}

/* ── regionale content ── */
function renderRegio() {
  const section = document.getElementById('regio-section');
  const list = document.getElementById('regio-list');
  list.innerHTML = '';

  if (!regioFilterOn) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  const items = REGIO_ITEMS[profile.regio] || [];
  if (items.length === 0) {
    list.innerHTML = '<p style="color:var(--ink-muted);font-size:14px">Geen regionale berichten gevonden.</p>';
    return;
  }

  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'regio-item';
    el.style.animationDelay = `${i * 60}ms`;
    el.innerHTML = `
      <span class="ri-badge">📍 ${profile.regio}</span>
      <div class="ri-content">
        <div class="ri-title">${item.title}</div>
        <div class="ri-meta">${item.meta}</div>
      </div>
    `;
    list.appendChild(el);
  });
}

/* ── regiofilter toggle ── */
function toggleRegioFilter(on) {
  regioFilterOn = on;
  renderRegio();
  document.getElementById('welcome-sub').innerHTML = on
    ? 'Je hebt <strong>7 nieuwe artikelen</strong> op basis van jouw profiel.'
    : 'Je hebt <strong>7 nieuwe artikelen</strong> — regiofilter staat uit.';
}

/* ── prioriteitsthema ── */
function setPriority(val) {
  priorityTheme = val || null;

  const band = document.getElementById('priority-band');
  const sel  = document.getElementById('priority-select');
  sel.value = val || '';

  // sidebar tags
  document.querySelectorAll('.theme-tag').forEach(tag => {
    tag.classList.toggle('priority', tag.textContent.trim().includes(val));
  });

  if (val && DUIDING[val]) {
    document.getElementById('pb-title').textContent = `Prioriteitsthema: ${val}`;
    document.getElementById('pb-duiding').textContent = DUIDING[val].text;
    band.style.display = 'block';
  } else {
    band.style.display = 'none';
  }

  renderArticles();
}

/* ── reset (terug naar onboarding) ── */
function resetOnboarding() {
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  goStep(1);
}

/* ── start ── */
window.onload = () => {
  // direct naar onboarding stap 1
  goStep(1);
};
