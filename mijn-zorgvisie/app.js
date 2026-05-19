'use strict';

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const profile = { functie: null, sector: null, regio: null, themas: [] };
let priorityTheme   = null;
let regioFilterOn   = true;
let currentPage     = 'dashboard';
let prevPage        = 'dashboard';
let artikelenFilter = { zoek: '', thema: null };

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const DUIDING = {
  'Arbeidsmarkt':           { icon: '👥', text: 'De arbeidsmarktdruk in de zorg blijft toenemen. Personeelstekorten zijn breed voelbaar, met name in VVT en GGZ. Cao-onderhandelingen domineren de agenda bij HR en bestuur. Actie op instroom, retentie en flexibilisering is urgent.' },
  'Passende zorg':          { icon: '🎯', text: 'Passende zorg staat centraal in de hervorming van het zorgstelsel. Het IZA en de Juiste Zorg op de Juiste Plek-beweging vragen om verschuiving van taken. Nieuwe bekostigingsmodellen en samenwerking staan hoog op de agenda.' },
  'Digitalisering':         { icon: '💻', text: 'AI-toepassingen winnen terrein in diagnostiek en administratie. EPD-vervanging en data-uitwisseling (FHIR) staan hoog op de agenda. Cyberveiligheid wordt een bestuurlijke kernverantwoordelijkheid.' },
  'Capaciteitsdruk':        { icon: '📊', text: 'Wachtlijsten groeien in bijna alle sectoren. Capaciteitsplanning vraagt om samenwerking over grenzen heen. Regiobeelden bieden inzicht, maar de vertaling naar oplossingen blijft een uitdaging.' },
  'Regionale samenwerking': { icon: '🤝', text: 'IZA-akkoorden dwingen tot regionale samenwerking. Netwerkzorg vraagt nieuwe governance en heldere afspraken. Regio\'s verschillen sterk in volwassenheid — van verkenning tot concrete uitvoering.' },
  'Financiering':           { icon: '💶', text: 'De NZa stuurt op transparantie en doelmatigheid. Bezuinigingen op langdurige zorg zetten druk op instellingen. Bestuurders zoeken naar bekostigingsmodellen die kwaliteit en kostenbeheersing verbinden.' },
};

const THEME_COLORS = {
  'Arbeidsmarkt': '#0B7075', 'Passende zorg': '#2D6A4F', 'Digitalisering': '#4F46E5',
  'Capaciteitsdruk': '#C2410C', 'Regionale samenwerking': '#0369A1', 'Financiering': '#7C3AED',
};

const ARTICLES = [
  {
    id: 1, thema: 'Arbeidsmarkt', datum: 'Vandaag', minuten: 4,
    title: 'Personeelstekort in VVT bereikt nieuw record',
    excerpt: 'Ruim 40% van de VVT-instellingen meldt dat de bezetting structureel onder de norm ligt, blijkt uit nieuw onderzoek van ActiZ.',
    body: `<p>Ruim 40 procent van de instellingen voor verpleging, verzorging en thuiszorg (VVT) meldt dat hun personeelsbezetting structureel onder de norm ligt. Dit blijkt uit een grootschalig onderzoek dat brancheorganisatie ActiZ heeft uitgevoerd onder 380 leden.</p>
    <h3>Oorzaken en achtergrond</h3>
    <p>De tekorten zijn niet nieuw, maar de omvang neemt toe. Vergrijzing van de beroepsbevolking, een groeiende vraag naar zorg en concurrentie vanuit andere sectoren dragen bij aan het probleem. Veel instellingen kampen bovendien met een hoog ziekteverzuim, wat de druk op aanwezige medewerkers verder vergroot.</p>
    <blockquote>"We zien dat teams al jaren op hun tandvlees lopen. De instroom van nieuwe collega's houdt simpelweg de uitstroom niet bij." — Directeur ActiZ</blockquote>
    <h3>Gevolgen voor de zorgverlening</h3>
    <p>Instellingen geven aan dat zij zorginhoudelijke keuzes moeten maken die ze liever niet maken: minder begeleiding per cliënt, beperking van activiteiten en in sommige gevallen het tijdelijk sluiten van capaciteit. De wachtlijsten voor verpleeghuiszorg nemen daardoor verder toe.</p>
    <p>Het kabinet heeft aangekondigd met een nieuw arbeidsmarktakkoord voor de zorg te komen. Vakbonden en werkgevers zijn momenteel in gesprek over structurele maatregelen voor de komende cao-periode.</p>`
  },
  {
    id: 2, thema: 'Passende zorg', datum: 'Gisteren', minuten: 6,
    title: 'Minister kondigt nieuw actieplan passende zorg aan',
    excerpt: 'Het kabinet presenteert een driejarig investeringsprogramma gericht op de verschuiving van ziekenhuiszorg naar de eerste lijn.',
    body: `<p>De minister van Volksgezondheid heeft een driejarig investeringsprogramma aangekondigd dat de verschuiving van ziekenhuiszorg naar de eerste lijn moet versnellen. Het programma heeft een omvang van 420 miljoen euro en loopt van 2026 tot en met 2028.</p>
    <h3>Kern van het plan</h3>
    <p>Het actieplan richt zich op drie pijlers: versterking van de huisartsenzorg, uitbreiding van gespecialiseerde verpleging in de wijk en betere samenwerking tussen ziekenhuizen en eerstelijnsorganisaties via regionale zorgnetwerken.</p>
    <blockquote>"Passende zorg betekent dat we de goede zorg op de goede plek leveren. Dat is niet altijd het ziekenhuis." — Minister VWS</blockquote>
    <h3>Reacties uit het veld</h3>
    <p>Koepelorganisaties reageren gematigd positief. Zij waarschuwen dat extra financiering alleen niet voldoende is zolang het personeelstekort aanhoudt. Ook vragen zij om heldere kaders voor de regionale uitvoering.</p>`
  },
  {
    id: 3, thema: 'Digitalisering', datum: '2 dagen geleden', minuten: 5,
    title: 'AI in de radiologie: van pilot naar praktijk',
    excerpt: 'Steeds meer ziekenhuizen zetten AI-tools in voor beelddiagnostiek. Een inventarisatie van ervaringen en valkuilen.',
    body: `<p>Kunstmatige intelligentie maakt een stille opmars in de Nederlandse radiologie. Waar twee jaar geleden AI-tools voor beelddiagnostiek nog een zeldzaamheid waren, gebruiken inmiddels meer dan 60 procent van de ziekenhuizen minstens één AI-toepassing structureel in hun radiologische werkproces.</p>
    <h3>Wat werkt, wat niet</h3>
    <p>Toepassingen voor de detectie van longknobbeltjes en borsttumoren scoren hoog op gebruikerstevredenheid. Radiologen zeggen dat AI hen helpt om prioriteiten te stellen en minder kritische bevindingen te missen. Minder succesvol zijn toepassingen die de volledige verslaglegging proberen over te nemen: de acceptatie onder specialisten blijft laag.</p>
    <blockquote>"AI is een co-piloot, geen piloot. De verantwoordelijkheid blijft bij de radioloog." — Hoofd radiologie, academisch ziekenhuis</blockquote>
    <h3>Aandachtspunten voor bestuurders</h3>
    <p>Inkoop van AI-tools vraagt om een zorgvuldige validatieprocedure. Algoritmen die elders zijn getraind, presteren niet altijd goed op lokale patiëntenpopulaties. Ziekenhuizen worden aangeraden om vóór implementatie een onafhankelijke klinische validatie uit te voeren.</p>`
  },
  {
    id: 4, thema: 'Capaciteitsdruk', datum: '3 dagen geleden', minuten: 7,
    title: 'GGZ-wachtlijsten nauwelijks korter ondanks extra middelen',
    excerpt: 'Ondanks de extra investeringen uit het Hoofdlijnenakkoord GGZ zijn de wachttijden in 2025 nauwelijks gedaald.',
    body: `<p>De wachttijden in de geestelijke gezondheidszorg (GGZ) zijn in 2025 nauwelijks afgenomen, ondanks de extra middelen die via het Hoofdlijnenakkoord GGZ beschikbaar zijn gesteld. Dit concludeert de Nederlandse Zorgautoriteit (NZa) in haar nieuwste trendrapportage.</p>
    <h3>Cijfers</h3>
    <p>De gemiddelde wachttijd voor generalistische basis-GGZ bedraagt momenteel 11 weken, tegen de Treeknorm van 4 weken. Voor de specialistische GGZ loopt de gemiddelde wachttijd op tot 18 weken. De NZa signaleert dat met name jongeren lang moeten wachten op toegang tot psychische hulp.</p>
    <blockquote>"Extra middelen helpen, maar lossen het onderliggende capaciteitsprobleem niet op." — Directeur NZa</blockquote>
    <h3>Structurele oorzaken</h3>
    <p>Onderzoekers wijzen op drie structurele factoren: de toenemende vraag naar psychische hulp na de covidpandemie, het personeelstekort in de sector en de administratielast die zorgprofessionals ervan weerhoudt meer patiënten te behandelen. Het ministerie bekijkt momenteel aanvullende maatregelen.</p>`
  },
  {
    id: 5, thema: 'Regionale samenwerking', datum: '4 dagen geleden', minuten: 4, isRegio: true,
    title: 'Regio Utrecht sluit breed IZA-uitvoeringsplan',
    excerpt: 'Zeven zorgorganisaties en drie gemeenten ondertekenen een samenwerkingsconvenant gericht op thuiszorg en preventie.',
    body: `<p>In de regio Utrecht hebben zeven zorgorganisaties en drie gemeenten een samenwerkingsconvenant ondertekend voor de uitvoering van het Integraal Zorgakkoord (IZA). Het is een van de eerste regio's in Nederland met een breed gedragen uitvoeringsplan.</p>
    <h3>Wat staat er in het akkoord</h3>
    <p>Het convenant bevat afspraken over de uitbreiding van thuiszorgcapaciteit, gezamenlijke preventieactiviteiten in wijken met een hoge zorgvraag en de inrichting van een regionaal zorgcoördinatiepunt. Partijen spreken ook af om samen te investeren in digitale gegevensuitwisseling.</p>
    <blockquote>"Dit is niet een plan op papier, maar een concreet uitvoeringsprogramma met budget en aanspreekpunten." — Wethouder gemeente Utrecht</blockquote>
    <h3>Landelijke betekenis</h3>
    <p>Het Ministerie van VWS presenteert de Utrechtse aanpak als voorbeeld voor andere regio's. Een evaluatie is gepland voor het voorjaar van 2027.</p>`
  },
  {
    id: 6, thema: 'Financiering', datum: '5 dagen geleden', minuten: 5,
    title: 'NZa publiceert nieuwe tarieven langdurige zorg',
    excerpt: 'De nieuwe tarieven voor 2026 zijn gepubliceerd. Instellingen krijgen te maken met hogere energiekosten en een beperkte looncompensatie.',
    body: `<p>De Nederlandse Zorgautoriteit (NZa) heeft de tarieven voor de langdurige zorg voor 2026 gepubliceerd. De tarieven stijgen gemiddeld met 3,1 procent, maar voor veel instellingen is dit onvoldoende om de gestegen loon- en energiekosten op te vangen.</p>
    <h3>Reacties uit de sector</h3>
    <p>Brancheorganisaties ActiZ en VGN spreken van een ontoereikende compensatie. Zij stellen dat de werkelijke kostenstijging in de sector uitkomt op gemiddeld 5,4 procent. De organisaties kondigen aan opnieuw in gesprek te gaan met de NZa en het ministerie.</p>
    <blockquote>"Instellingen die al krap bij kas zitten, komen verder in de problemen." — Voorzitter ActiZ</blockquote>
    <h3>Implicaties voor bedrijfsvoering</h3>
    <p>Financieel directeuren worden aangeraden hun begroting voor 2026 tijdig bij te stellen. De NZa biedt de mogelijkheid om via een zienswijzeprocedure bezwaar aan te tekenen tegen de vastgestelde tarieven. De deadline daarvoor is 1 augustus 2026.</p>`
  },
];

const DOSSIERS = [
  { icon: '👥', thema: 'Arbeidsmarkt', title: 'Arbeidsmarkt in de zorg', desc: 'Verdieping in personeelstekorten, cao-ontwikkelingen, instroom en retentie van zorgpersoneel.', artikelen: 24, updated: 'Bijgewerkt: vandaag' },
  { icon: '🎯', thema: 'Passende zorg', title: 'Passende zorg & IZA', desc: 'Achtergrond bij het Integraal Zorgakkoord, uitkomstgerichte bekostiging en regionale uitvoering.', artikelen: 18, updated: 'Bijgewerkt: gisteren' },
  { icon: '💻', thema: 'Digitalisering', title: 'Digitalisering en AI in de zorg', desc: 'EPD-implementaties, AI-toepassingen, FHIR-standaarden en cyberveiligheid in de zorgsector.', artikelen: 31, updated: 'Bijgewerkt: 2 dagen geleden' },
  { icon: '📊', thema: 'Capaciteitsdruk', title: 'Capaciteit en wachtlijsten', desc: 'Analyses van wachttijden per sector, capaciteitsplanning en regionale spreidingsvraagstukken.', artikelen: 15, updated: 'Bijgewerkt: 3 dagen geleden' },
  { icon: '🤝', thema: 'Regionale samenwerking', title: 'Regionale zorgnetwerken', desc: 'Overzicht van IZA-uitvoeringsplannen per regio, governance-modellen en praktijkvoorbeelden.', artikelen: 20, updated: 'Bijgewerkt: 1 week geleden' },
  { icon: '💶', thema: 'Financiering', title: 'Financiering en bekostiging', desc: 'NZa-tarieven, bezuinigingen, prestatiebekostiging en financiële duurzaamheid in de zorg.', artikelen: 22, updated: 'Bijgewerkt: 4 dagen geleden' },
];

const AGENDA = [
  { dag: '28', maand: 'MEI', type: 'Congres', badge: 'congres', title: 'Zorgvisie Congres Arbeidsmarkt 2026', meta: 'Utrecht · Jaarbeurs · 09:00 – 17:00' },
  { dag: '4',  maand: 'JUN', type: 'Webinar', badge: 'webinar', title: 'Webinar: Passende zorg in de praktijk', meta: 'Online · 12:30 – 13:30' },
  { dag: '11', maand: 'JUN', type: 'Bijeenkomst', badge: 'bijeenkomst', title: 'Regiobijeenkomst IZA Noord-Holland', meta: 'Amsterdam · Zorgkantoor · 14:00 – 17:00' },
  { dag: '18', maand: 'JUN', type: 'Webinar', badge: 'webinar', title: 'Webinar: AI in de zorg — kansen en risico\'s', meta: 'Online · 15:00 – 16:00' },
  { dag: '25', maand: 'JUN', type: 'Congres', badge: 'congres', title: 'Nationaal GGZ Congres 2026', meta: 'Den Haag · Congrescentrum · 09:30 – 18:00' },
  { dag: '2',  maand: 'JUL', type: 'Bijeenkomst', badge: 'bijeenkomst', title: 'Bestuurlijk overleg langdurige zorg', meta: 'Utrecht · VWS · 10:00 – 12:00' },
];

const REGIO_ITEMS = {
  'Noord-Holland': [
    { title: 'Amsterdam UMC en Dijklander werken aan regionale spoedzorgketen', meta: 'Noord-Holland · 2 dagen geleden' },
    { title: 'Wethouder: meer investeringen in wijkverpleging nodig', meta: 'Noord-Holland · 4 dagen geleden' },
    { title: 'Transferpunt Noord-Holland West van start', meta: 'Noord-Holland · 1 week geleden' },
  ],
  'Zuid-Holland':  [{ title: 'Regio Rijnmond sluit samenwerkingsconvenant acute zorg', meta: 'Zuid-Holland · 1 dag geleden' }, { title: 'Haagse zorgorganisaties starten pilot zorgcoördinatie-app', meta: 'Zuid-Holland · 3 dagen geleden' }],
  'Utrecht':       [{ title: 'UMC Utrecht en huisartsen starten wachtlijstoverleg', meta: 'Utrecht · Vandaag' }, { title: 'Provincie Utrecht investeert in regionale GGZ-samenwerking', meta: 'Utrecht · 2 dagen geleden' }],
  'Noord-Brabant': [{ title: 'Brabantse ziekenhuizen testen gezamenlijk capaciteitsmodel', meta: 'Noord-Brabant · 3 dagen geleden' }],
  'Gelderland':    [{ title: 'Gelderse zorgaanbieders lanceren regioplatform arbeidsmarkt', meta: 'Gelderland · Gisteren' }],
  'Overijssel':    [{ title: 'ZGT en MST bundelen krachten in regio Oost', meta: 'Overijssel · 2 dagen geleden' }],
  'Friesland':     [{ title: 'MCL en Tjongerschans: gecombineerde wachtlijstaanpak', meta: 'Friesland · 3 dagen geleden' }],
  'Groningen':     [{ title: 'UMCG lanceert digitaal zorgnetwerk Noordoost-Nederland', meta: 'Groningen · Gisteren' }],
  'Zeeland':       [{ title: 'Adrz en gemeenten starten pilot bereikbaarheid ouderenzorg', meta: 'Zeeland · 4 dagen geleden' }],
  'Limburg':       [{ title: 'VieCuri en Zuyderland versterken samenwerking Midden-Limburg', meta: 'Limburg · 2 dagen geleden' }],
};


/* ══════════════════════════════════════
   ONBOARDING — selectie
══════════════════════════════════════ */
document.addEventListener('click', e => {
  const pill = e.target.closest('.pill');
  if (pill) {
    const key = pill.dataset.key;
    const val = pill.dataset.val;
    document.querySelectorAll(`.pill[data-key="${key}"]`).forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');

    if (val === '__anders__') {
      const wrap = document.getElementById(`anders-${key}`);
      if (wrap) { wrap.style.display = 'block'; wrap.querySelector('input').focus(); }
      profile[key] = null;
    } else {
      const wrap = document.getElementById(`anders-${key}`);
      if (wrap) wrap.style.display = 'none';
      profile[key] = val;
    }
  }

  const tc = e.target.closest('.theme-card');
  if (tc) {
    const val = tc.dataset.val;
    tc.classList.toggle('selected');
    if (tc.classList.contains('selected')) profile.themas.push(val);
    else profile.themas = profile.themas.filter(t => t !== val);
  }
});

// anders-tekstvelden live inlezen
document.addEventListener('input', e => {
  const inp = e.target.closest('.anders-input');
  if (inp) {
    const key = inp.dataset.key;
    profile[key] = inp.value.trim() || null;
  }
});


/* ══════════════════════════════════════
   ONBOARDING — navigatie
══════════════════════════════════════ */
function goStep(n) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');
  const pct = { 1: 33, 2: 66, 3: 100 };
  document.getElementById('ob-progress-bar').style.width = pct[n] + '%';
  document.querySelectorAll('.ls-item').forEach(el => {
    const num = parseInt(el.dataset.n);
    el.classList.toggle('active', num === n);
    el.classList.toggle('done',   num < n);
  });
}

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

function resetOnboarding() {
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  goStep(1);
}


/* ══════════════════════════════════════
   NAVIGATIE (tabbladen)
══════════════════════════════════════ */
function navigateTo(page, linkEl) {
  if (linkEl) {
    event && event.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    linkEl.classList.add('active');
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  currentPage = page;

  if (page === 'artikelen') renderArtikelenPagina();
  if (page === 'dossiers')  renderDossiers();
  if (page === 'agenda')    renderAgenda();
}


/* ══════════════════════════════════════
   DASHBOARD OPBOUWEN
══════════════════════════════════════ */
function buildDashboard() {
  document.getElementById('topbar-avatar').textContent  = 'KV';
  document.getElementById('sidebar-avatar').textContent = 'KV';
  document.getElementById('profile-name').textContent   = 'Katy van Vogelpoel';
  document.getElementById('profile-role').textContent   = `${profile.functie} · ${profile.sector}`;
  document.getElementById('regio-naam').textContent     = profile.regio;
  document.getElementById('stat-themas').textContent    = profile.themas.length;

  const h = new Date().getHours();
  document.getElementById('welcome-title').textContent = `${h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond'}, Katy`;

  // sidebar thema's
  const sb = document.getElementById('sidebar-themes');
  sb.innerHTML = '';
  profile.themas.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-tag';
    btn.innerHTML = `<span>${DUIDING[t]?.icon || '●'}</span>${t}`;
    btn.onclick = () => setPriority(t);
    sb.appendChild(btn);
  });

  // priority select
  const sel = document.getElementById('priority-select');
  sel.innerHTML = '<option value="">— Geen prioriteit —</option>';
  profile.themas.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; sel.appendChild(o); });

  renderArticles();
  renderDuiding();
  renderRegio();
}


/* ══════════════════════════════════════
   DASHBOARD — secties
══════════════════════════════════════ */
function renderArticles() {
  const grid = document.getElementById('articles-grid');
  grid.innerHTML = '';
  let list = ARTICLES.filter(a => profile.themas.includes(a.thema));
  if (priorityTheme) list = [...list.filter(a => a.thema === priorityTheme), ...list.filter(a => a.thema !== priorityTheme)];
  list.slice(0, 6).forEach((art, i) => buildArticleCard(grid, art, i));
}

function renderDuiding() {
  const row = document.getElementById('duiding-row');
  row.innerHTML = '';
  profile.themas.forEach((t, i) => {
    const d = DUIDING[t]; if (!d) return;
    const card = document.createElement('div');
    card.className = 'duiding-card';
    card.style.animationDelay = `${i * 65}ms`;
    card.innerHTML = `<div class="dc-header"><div class="dc-icon-wrap">${d.icon}</div><div><div class="dc-theme-name">${t}</div><div class="dc-label">Thematische duiding</div></div></div><div class="dc-body"><p class="dc-text">${d.text}</p></div>`;
    row.appendChild(card);
  });
}

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
    el.innerHTML = `<div class="ri-pin"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div><div><div class="ri-title">${item.title}</div><div class="ri-meta">${item.meta}</div></div><div class="ri-chevron">→</div>`;
    list.appendChild(el);
  });
}


/* ══════════════════════════════════════
   ARTIKEL CARD (herbruikbaar)
══════════════════════════════════════ */
function buildArticleCard(container, art, index) {
  const color = THEME_COLORS[art.thema] || '#0B7075';
  const card  = document.createElement('div');
  card.className = 'article-card';
  card.style.animationDelay = `${index * 55}ms`;
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
    </div>`;
  card.onclick = () => openArtikel(art.id);
  container.appendChild(card);
}


/* ══════════════════════════════════════
   ARTIKEL DETAIL
══════════════════════════════════════ */
function openArtikel(id) {
  const art = ARTICLES.find(a => a.id === id);
  if (!art) return;

  prevPage = currentPage;

  const color = THEME_COLORS[art.thema] || '#0B7075';
  const el    = document.getElementById('article-detail-content');
  el.innerHTML = `
    <span class="ad-tag" style="background:${color}20;color:${color}">${art.thema}</span>
    <h1 class="ad-title">${art.title}</h1>
    <div class="ad-meta">
      <span>📅 ${art.datum}</span>
      <span>⏱ ${art.minuten} minuten leestijd</span>
      <span>✍️ Redactie Zorgvisie</span>
    </div>
    <div class="ad-body">${art.body}</div>
    <div class="ad-related">
      <div class="ad-related-title">Gerelateerde artikelen</div>
      <div class="ad-related-grid" id="related-grid"></div>
    </div>`;

  // gerelateerde artikelen
  const related = ARTICLES.filter(a => a.thema === art.thema && a.id !== id).slice(0, 3);
  const rGrid   = document.getElementById('related-grid');
  related.forEach((a, i) => buildArticleCard(rGrid, a, i));

  // terug-knop
  document.getElementById('detail-back-btn').onclick = () => navigateTo(prevPage,
    document.querySelector(`[data-page="${prevPage}"]`));

  navigateTo('artikel-detail', null);
  // update nav actief
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === prevPage);
  });
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ══════════════════════════════════════
   ARTIKELEN PAGINA
══════════════════════════════════════ */
function renderArtikelenPagina() {
  // filter pills per thema
  const pillsEl = document.getElementById('filter-pills');
  if (!pillsEl.children.length) {
    const alleBtn = document.createElement('button');
    alleBtn.className = 'filter-pill active';
    alleBtn.textContent = 'Alle thema\'s';
    alleBtn.onclick = () => { artikelenFilter.thema = null; setActivePill(alleBtn); renderArtikelenGrid(); };
    pillsEl.appendChild(alleBtn);

    profile.themas.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'filter-pill';
      btn.textContent = t;
      btn.onclick = () => { artikelenFilter.thema = t; setActivePill(btn); renderArtikelenGrid(); };
      pillsEl.appendChild(btn);
    });
  }
  renderArtikelenGrid();
}

function setActivePill(active) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  active.classList.add('active');
}

function filterArtikelen(zoek) {
  artikelenFilter.zoek = zoek.toLowerCase();
  renderArtikelenGrid();
}

function renderArtikelenGrid() {
  const grid = document.getElementById('artikelen-grid');
  grid.innerHTML = '';
  let list = ARTICLES.filter(a => profile.themas.includes(a.thema));
  if (artikelenFilter.thema) list = list.filter(a => a.thema === artikelenFilter.thema);
  if (artikelenFilter.zoek)  list = list.filter(a =>
    a.title.toLowerCase().includes(artikelenFilter.zoek) ||
    a.excerpt.toLowerCase().includes(artikelenFilter.zoek));
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--ink-muted);font-size:14px;grid-column:1/-1">Geen artikelen gevonden voor deze zoekopdracht.</p>';
    return;
  }
  list.forEach((art, i) => buildArticleCard(grid, art, i));
}


/* ══════════════════════════════════════
   DOSSIERS PAGINA
══════════════════════════════════════ */
function renderDossiers() {
  const grid = document.getElementById('dossiers-grid');
  if (grid.children.length) return;
  DOSSIERS.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'dossier-card';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="dos-header">
        <span class="dos-icon">${d.icon}</span>
        <span class="dos-count">${d.artikelen} artikelen</span>
      </div>
      <div class="dos-body">
        <div class="dos-tag">${d.thema}</div>
        <div class="dos-title">${d.title}</div>
        <div class="dos-desc">${d.desc}</div>
        <div class="dos-footer">
          <span class="dos-updated">${d.updated}</span>
          <span class="dos-link">Bekijk dossier →</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}


/* ══════════════════════════════════════
   AGENDA PAGINA
══════════════════════════════════════ */
function renderAgenda() {
  const list = document.getElementById('agenda-list');
  if (list.children.length) return;
  AGENDA.forEach((ev, i) => {
    const el = document.createElement('div');
    el.className = 'agenda-item';
    el.style.animationDelay = `${i * 55}ms`;
    el.innerHTML = `
      <div class="ag-date-block"><span class="ag-day">${ev.dag}</span><span class="ag-month">${ev.maand}</span></div>
      <div class="ag-body">
        <div class="ag-type">${ev.type}</div>
        <div class="ag-title">${ev.title}</div>
        <div class="ag-meta">${ev.meta}</div>
      </div>
      <span class="ag-badge ${ev.badge}">${ev.type}</span>`;
    list.appendChild(el);
  });
}


/* ══════════════════════════════════════
   OVERIGE FUNCTIES
══════════════════════════════════════ */
function toggleRegioFilter(on) {
  regioFilterOn = on;
  renderRegio();
  document.getElementById('welcome-sub').innerHTML = on
    ? 'Je hebt <strong>7 nieuwe artikelen</strong> op basis van jouw profiel.'
    : 'Regiofilter staat uit — je ziet landelijk nieuws.';
}

function setPriority(val) {
  priorityTheme = val || null;
  document.getElementById('priority-select').value = val || '';
  document.querySelectorAll('.theme-tag').forEach(tag =>
    tag.classList.toggle('priority', !!val && tag.textContent.trim().includes(val)));
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

window.onload = () => goStep(1);
