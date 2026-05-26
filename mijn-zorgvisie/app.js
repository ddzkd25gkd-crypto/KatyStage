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

/* Cache voor live opgehaalde artikelen bij eigen thema's */
const customThemaCache   = {}; /* { thema: [{title,excerpt,url,datum,source}] | null } */
const customThemaLoading = {}; /* { thema: true } */

/* ══════════════════════════════════════
   DATA — THEMA'S
══════════════════════════════════════ */
const DUIDING = {
  'Arbeidsmarkt':           { icon: '👥', text: 'De arbeidsmarktdruk in de zorg blijft toenemen. Personeelstekorten zijn breed voelbaar, met name in VVT en GGZ. Cao-onderhandelingen domineren de agenda bij HR en bestuur.' },
  'Passende zorg':          { icon: '🎯', text: 'Passende zorg staat centraal in de hervorming van het zorgstelsel. Het IZA en de Juiste Zorg op de Juiste Plek-beweging vragen om verschuiving van taken en doelgerichte samenwerking.' },
  'Digitalisering':         { icon: '💻', text: 'AI-toepassingen winnen terrein in diagnostiek en administratie. EPD-vervanging en data-uitwisseling (FHIR) staan hoog op de agenda. Cyberveiligheid wordt een bestuurlijke kernverantwoordelijkheid.' },
  'Capaciteitsdruk':        { icon: '📊', text: 'Wachtlijsten groeien in bijna alle sectoren. Capaciteitsplanning vraagt om samenwerking over grenzen heen. Regiobeelden bieden inzicht, maar de vertaling naar oplossingen blijft een uitdaging.' },
  'Regionale samenwerking': { icon: '🤝', text: 'IZA-akkoorden dwingen tot regionale samenwerking. Netwerkzorg vraagt nieuwe governance en heldere afspraken. Regio\'s verschillen sterk in volwassenheid — van verkenning tot concrete uitvoering.' },
  'Financiering':           { icon: '💶', text: 'De NZa stuurt op transparantie en doelmatigheid. Bezuinigingen op langdurige zorg zetten druk op instellingen. Bestuurders zoeken naar bekostigingsmodellen die kwaliteit en kostenbeheersing verbinden.' },
  'Zorgtransformatie':      { icon: '🔄', text: 'Zorgtransformatie vraagt om fundamentele herinrichting van zorgprocessen, organisaties en samenwerkingsvormen. Digitalisering, populatiemanagement en integrale ketenzorg zijn de pijlers. Het IZA is het beleidsmatige anker voor deze transitie.' },
  'Preventie':              { icon: '🛡️', text: 'Het Nationaal Preventieakkoord zet in op rookvrije generaties, gezonder eten en meer bewegen. Gemeenten krijgen een regisserende rol. Preventie verschuift van een medisch naar een sociaal en ruimtelijk vraagstuk met grote impact op de zorgvraag.' },
  'Ouderenzorg':            { icon: '👴', text: 'De vergrijzing versnelt de vraag naar verpleeg- en thuiszorg structureel. "Thuis als standaard" is het beleidsmotto: langer zelfstandig wonen vraagt meer wijkgerichte zorg en mantelzorgondersteuning. Kwaliteitskaders en personeelstekorten bepalen het bestuurlijk ritme.' },
};

const THEME_COLORS = {
  'Arbeidsmarkt': '#0B7075', 'Passende zorg': '#2D6A4F', 'Digitalisering': '#4F46E5',
  'Capaciteitsdruk': '#C2410C', 'Regionale samenwerking': '#0369A1', 'Financiering': '#7C3AED',
  'Zorgtransformatie': '#0E7490', 'Preventie': '#65A30D', 'Ouderenzorg': '#9333EA',
};

/* ══════════════════════════════════════
   ARTIKEL_CONTEXT — gepersonaliseerde duiding
══════════════════════════════════════ */
const ARTIKEL_CONTEXT = {
  'Arbeidsmarkt': {
    speelt: 'Structurele personeelstekorten raken alle zorgsectoren, met VVT en GGZ als zwaarst getroffen. Vergrijzing van de beroepsbevolking versnelt de uitstroom terwijl instroom stagneert. Cao-onderhandelingen draaien vrijwel continu en dure flexinzet is voor veel instellingen structureel geworden.',
    relevant: {
      'Zorgmanager':         'De tekorten raken jouw team direct: roosters kloppen niet meer, werkdruk stijgt en kwalitatief goede medewerkers vertrekken. Retentie en dagelijkse bezettingsplanning zijn jouw voornaamste hefbomen.',
      'Bestuurder':          'Strategische keuzes over arbeidsvoorwaarden, partnerships met onderwijs en employer branding bepalen je concurrentiepositie als werkgever voor de komende jaren.',
      'Beleidsmedewerker':   'Cao-akkoorden en landelijk arbeidsmarktbeleid vertalen naar uitvoerbare instellingsafspraken vraagt actuele kennis van het speelveld.',
      'Adviseur':            'Adviesvragen richten zich steeds meer op workforce planning, nieuwe personeelsmodellen en strategische keuzes over flexibilisering versus vaste contracten.',
      'HR-professional':     'Dit is jouw kerndomein. Werving, selectie, behoud en cultuur staan centraal. Benchmarkdata en cao-kennis zijn direct inzetbaar om jouw aanpak te onderbouwen.',
      'Financieel directeur':'Personeelskosten zijn de grootste post op de begroting. Structurele tekorten leiden tot dure inhuur van flex en ZZP. Een meerjarig perspectief op loonkosten is essentieel.',
    },
    betekenis: 'Arbeidsmarktontwikkelingen vragen om een integrale aanpak: personeelsplanning koppelen aan bekostiging, een duurzame werkgeversstrategie ontwikkelen en regionale samenwerking zoeken voor gedeelde instroom.',
  },
  'Passende zorg': {
    speelt: 'Het Integraal Zorgakkoord verplicht zorgaanbieders tot verschuiving van tweedelijn naar de eerste lijn. Digitale substitutie, taakherschikking en preventie zijn de drie pijlers. IZA-middelen zijn beschikbaar maar vragen concrete regionale uitvoeringsplannen.',
    relevant: {
      'Zorgmanager':         'Taakherschikking en nieuwe zorgpaden herdefiniëren wie wat doet in jouw team — dat vraagt aanpassing van werkprocessen en samenwerking met ketenpartners.',
      'Bestuurder':          'Hoe positioneer je jouw organisatie in een veranderend zorglandschap? Samenwerking, focus of differentiatie zijn strategische scenario\'s die nu worden bepaald.',
      'Beleidsmedewerker':   'IZA vertalen naar instellingsbeleid, zorgpaden en samenwerkingsafspraken. Begrip van uitkomstbekostiging en populatiemanagement wordt steeds essentiëler.',
      'Adviseur':            'Organisaties zoeken begeleiding bij herinrichting van zorgprocessen en implementatie van passende-zorg-principes in de dagelijkse praktijk.',
      'HR-professional':     'Nieuwe rolverdeling in de zorg vraagt andere competentieprofielen, een bijgestelde scholingsagenda en herziene functieomschrijvingen.',
      'Financieel directeur':'Uitkomstbekostiging verschuift financieel risico van verzekeraar naar aanbieder. Jouw financiële modellen moeten aanpasbaar zijn op nieuwe bekostigingsstromen.',
    },
    betekenis: 'Passende zorg vraagt om strategische positionering, herinrichting van zorgprocessen en verdiepte samenwerking — zowel intern als in de regio.',
  },
  'Digitalisering': {
    speelt: 'AI en dataficering winnen snel terrein in diagnostiek, planning en administratie. EPD-vervanging staat hoog op de agenda. FHIR en gegevensuitwisseling worden via wetgeving afgedwongen. Cyberveiligheid is uitgegroeid tot een bestuurlijk risico met directe aansprakelijkheid.',
    relevant: {
      'Zorgmanager':         'Digitale tools raken het dagelijkse werkproces van je team direct. De implementatiekwaliteit bepaalt of het de werkdruk verlaagt of verhoogt.',
      'Bestuurder':          'Digitale strategie is een bestuurlijk thema. Investeringskeuzes in EPD, AI en data-infrastructuur hebben een impact van 10+ jaar en hoge overstapkosten.',
      'Beleidsmedewerker':   'Wet- en regelgeving rondom data, privacy (AVG) en gegevensuitwisseling vraagt continue aandacht. Beleid moet bijhouden wat technologie al doet in de praktijk.',
      'Adviseur':            'Adviesvragen rondom digitale transformatie, selectie van systemen en begeleiding van implementaties zijn sterk in opkomst.',
      'HR-professional':     'Digitalisering verandert functies en werkprocessen. Digitale vaardigheidsontwikkeling en omscholing zijn onderdeel van jouw agenda.',
      'Financieel directeur':'Grote ICT-investeringen vragen om een gedegen businesscase. Het risico op kostenoverschrijding bij EPD-trajecten is aanzienlijk.',
    },
    betekenis: 'Digitalisering is geen IT-kwestie maar een organisatiebrede transformatie. Succesvol digitaliseren vraagt om bestuurlijke sturing, budgetruimte, scholingsbeleid en governance rondom data en cyberveiligheid.',
  },
  'Capaciteitsdruk': {
    speelt: 'Wachtlijsten groeien in vrijwel alle sectoren. GGZ, ouderenzorg en specialistische zorg zijn het zwaarst getroffen. Treeknormen worden structureel overschreden. Regionale spreiding van beschikbare capaciteit is ongelijk.',
    relevant: {
      'Zorgmanager':         'Wachtlijstbeheer, capaciteitsplanning en triage horen tot je dagelijkse uitdaging. Keuzes over wie voorrang krijgt hebben directe kwaliteits- en aansprakelijkheidsimplicaties.',
      'Bestuurder':          'Capaciteitsvraagstukken overstijgen de eigen organisatie. Regionale afstemming en beleidsdialoog met overheid en zorgkantoor zijn noodzakelijk.',
      'Beleidsmedewerker':   'Capaciteitsberekeningen, wachtlijstrapportages en IZA-monitoring vormen de basis voor beleid. Datagedreven analyse is een kerncompetentie.',
      'Adviseur':            'Instellingen zoeken expertise op capaciteitsmanagement, scenario-planning en regionale samenwerkingsmodellen.',
      'HR-professional':     'Capaciteitsdruk verhoogt werkdruk structureel en draagt bij aan uitstroom. Preventief HR-beleid en welzijnsprogramma\'s zijn urgent.',
      'Financieel directeur':'Zowel overcapaciteit als ondercapaciteit heeft directe financiële gevolgen. Capaciteitsoptimalisatie is financieel strategisch relevant.',
    },
    betekenis: 'Capaciteitsdruk vraagt om een integrale aanpak: betere planning en triage, sterkere regionale samenwerking en directe koppeling aan personeelsstrategie en bekostigingsvraagstukken.',
  },
  'Regionale samenwerking': {
    speelt: 'IZA verplicht regio\'s tot gezamenlijke uitvoeringsplannen. Governance van regionale netwerken is complex: wie beslist wat, wie financiert, wie is verantwoordelijk? Regio\'s verschillen sterk in rijpheid.',
    relevant: {
      'Zorgmanager':         'Jij bent de operationele schakel tussen de eigen organisatie en regionale partners. Praktische afspraken over overdracht en ketenzorg vereisen jouw betrokkenheid.',
      'Bestuurder':          'Jouw positie in regionale netwerken bepaalt mede je strategische speelruimte. Governance, vertrouwen en langetermijnrelaties zijn sleutelfactoren.',
      'Beleidsmedewerker':   'Regionale akkoorden vertalen naar instellingsbeleid en bijdragen aan regionale overlegtafels zijn concrete taken die steeds zwaarder wegen.',
      'Adviseur':            'Procesbegeleiding bij het vormen en bestendigen van regionale netwerken is een sterk groeiende adviesvraag.',
      'HR-professional':     'Regionale arbeidsmarktsamenwerkingen — gezamenlijke werving en gedeelde opleidingspoolen — zijn relevante instrumenten.',
      'Financieel directeur':'Kostenverdeling in regionale samenwerking en gezamenlijke investeringen vragen om heldere financiële afspraken en transparante rapportage.',
    },
    betekenis: 'Regionale samenwerking vereist investering in relaties, heldere governance en de bereidheid om eigen belangen af te wegen tegen het bredere regionale belang.',
  },
  'Zorgtransformatie': {
    speelt: 'Het zorglandschap ondergaat een fundamentele heroriëntatie: van aanbodgestuurd naar vraaggestuurd, van behandelen naar voorkomen, van sector-denken naar integrale ketenzorg. IZA-middelen en populatiemanagement zijn de instrumenten; governance en cultuurverandering zijn de knelpunten.',
    relevant: {
      'Zorgmanager':         'Jij staat midden in de transitie: zorgpaden herinrichten, ketensamenwerking opbouwen en je team meenemen in nieuw werkende modellen. De operationele vertaalslag is jouw dagelijkse uitdaging.',
      'Bestuurder':          'Zorgtransformatie herpositioneert de eigen organisatie in een veranderend landschap. Fusies, strategische allianties en focus op kernactiviteiten zijn het speelbord van de komende jaren.',
      'Beleidsmedewerker':   'Transformatiebeleid vertalen naar uitvoerbare plannen vraagt begrip van het IZA, populatiemanagement en regionaal zorglandschap. Jij bent de verbindende schakel tussen beleid en praktijk.',
      'Adviseur':            'Instellingen zoeken externe begeleiding bij proces- en organisatieverandering die de transformatie vraagt. Verandermanagement en implementatiebegeleiding zijn de kernvragen.',
      'HR-professional':     'Zorgtransformatie vraagt andere competentieprofielen, bijgestelde functies en een scholingsagenda die gericht is op ketensamenwerking, zelfmanagement en digitale vaardigheden.',
      'Financieel directeur':'Transformatie kost geld voordat het wat oplevert. Een gedegen businesscase, meerjaren-investeringsplan en heldere afspraken over bekostiging van transitiekosten zijn essentieel.',
    },
    betekenis: 'Zorgtransformatie vraagt om een integrale aanpak: verbind strategische herpositionering met operationele herinrichting, investeer in cultuur en governance, en houd de patiënt centraal als kompas bij elke beslissing.',
  },
  'Preventie': {
    speelt: 'Het Nationaal Preventieakkoord heeft doelstellingen op roken, overgewicht en bewegen. Gemeenten nemen een regisseursrol, maar de samenwerking met zorgaanbieders vraagt nog veel aandacht. Zorgverzekeraars investeren toenemend in preventieve contracten. Evidence-based interventies schalen moeizaam op.',
    relevant: {
      'Zorgmanager':         'Preventie raakt jouw dagelijkse zorgverlening: vroegsignalering, leefstijlcoaching en zelfmanagementondersteuning zijn de schakel tussen preventie en behandeling in jouw team.',
      'Bestuurder':          'Preventieve zorg biedt strategische kansen: samenwerking met gemeenten, zorgverzekeraars en werkgevers opent nieuwe financieringsstromen en positioneert de organisatie voor de toekomst.',
      'Beleidsmedewerker':   'Preventiebeleid op instellingsniveau vertalen, deelnemen aan gemeentelijke gezondheidsagenda\'s en IZA-preventieafspraken monitoren zijn directe taken.',
      'Adviseur':            'Adviesvragen rondom de opzet van preventieve programma\'s, leefstijlinterventies en de verbinding met het sociaal domein nemen sterk toe.',
      'HR-professional':     'Preventie heeft ook een interne dimensie: gezond werkgeverschap, vitaliteitsprogramma\'s en verzuimpreventie voor medewerkers zijn onderdeel van jouw agenda.',
      'Financieel directeur':'Preventieve investeringen renderen op lange termijn maar kosten op korte termijn. Een heldere businesscase en bekostigingsafspraken met zorgverzekeraars zijn nodig.',
    },
    betekenis: 'Preventie vraagt om een sectoroverstijgende aanpak: verbind zorg, gemeenten, werkgevers en verzekeraars. Investeer in vroegsignalering en leefstijlondersteuning als onderdeel van de kernstrategie.',
  },
  'Ouderenzorg': {
    speelt: 'Nederland vergrijst snel: in 2030 zijn er naar schatting 170.000 mensen met dementie. Het kabinetsbeleid "Thuis als standaard" drukt de vraag naar verpleeghuisplaatsen maar vergroot de druk op wijkverpleging en mantelzorgers. Kwaliteitskader verpleeghuiszorg vraagt meer personele inzet terwijl het arbeidsmarktprobleem nijpend blijft.',
    relevant: {
      'Zorgmanager':         'Ouderenzorg vraagt om zorgpaden gericht op langer zelfstandig thuis wonen, adequate transfermomenten en intensieve samenwerking met wijkteams en mantelzorgers.',
      'Bestuurder':          'Strategische keuzes over capaciteitsuitbreiding, transformatie naar thuiszorgconcepten en samenwerking met gemeenten bepalen de toekomstbestendigheid van de organisatie.',
      'Beleidsmedewerker':   'Ouderenbeleid omvat bekostiging via WLZ en WMO, kwaliteitskaders, gemeentelijke woonzorgvisies en IZA-afspraken over de ouderenzorgketen.',
      'Adviseur':            'Adviesvragen rondom transformatie naar extramurale zorg, dementiezorg, personeelsmodellen en samenwerking met het sociaal domein zijn sterk in opkomst.',
      'HR-professional':     'De ouderenzorg heeft de zwaarste arbeidsmarktvraagstukken: hoge uitstroom, zware werkdruk en specifieke competenties voor dementiezorg en palliatieve zorg.',
      'Financieel directeur':'WLZ-bekostiging, zorgzwaartepakketten en de financiële impact van thuiszorguitbreiding versus intramurale capaciteit zijn jouw kerndossier in de ouderenzorg.',
    },
    betekenis: 'Ouderenzorg vraagt om een transformatie richting thuis-gerichte modellen, intensieve regionale samenwerking en een aanpak die de personeelscrisis structureel adresseert zonder concessies te doen aan kwaliteit.',
  },
  'Financiering': {
    speelt: 'NZa-tarieven stijgen gemiddeld 3,1% terwijl werkelijke kostenstijging uitkomt op 5,4%. Bezuinigingen op langdurige zorg zetten instellingen met krappe marges verder onder druk. Uitkomstbekostiging wint terrein maar is complex te implementeren.',
    relevant: {
      'Zorgmanager':         'Bezuinigingen vertalen zich direct naar bezetting en mogelijkheden op de werkvloer. Efficiëntie en kwaliteit staan tegelijk onder druk — dat vraagt om scherpe prioritering.',
      'Bestuurder':          'Financiële strategie in een krimpende bekostigingsomgeving vraagt scenario-denken, robuust reservebeleid en tijdige bijsturing van de meerjarenbegroting.',
      'Beleidsmedewerker':   'NZa-besluiten, tariefwijzigingen en bezuinigingsmaatregelen op de voet volgen en vertalen naar instellingsimplicaties is kernwerk.',
      'Adviseur':            'Financieel advies richt zich steeds meer op scenario-planning, kostenoptimalisatie en het begeleiden van bekostigingstransities.',
      'HR-professional':     'Bezuinigingen raken direct de personele inzet. Begrip van de financiële context helpt bij het onderbouwen van investeringen in mensen.',
      'Financieel directeur':'Dit is jouw kerndossier. Tariefanalyse, begroting, reservering en risicomanagement zijn direct relevant voor de financiële duurzaamheid.',
    },
    betekenis: 'Financiële duurzaamheid vraagt om transparantie, proactieve begrotingssturing en een helder gesprek met toezichthouders over wat de sector realistisch kan leveren binnen de gestelde bekostigingskaders.',
  },
};

/* ══════════════════════════════════════
   ARTICLES — 4 per thema
══════════════════════════════════════ */
const ARTICLES = [
  /* ── ARBEIDSMARKT ── */
  {
    id: 1, thema: 'Arbeidsmarkt', datum: 'Vandaag', minuten: 4,
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&q=80',
    title: 'Personeelstekort in VVT bereikt nieuw record',
    excerpt: 'Ruim 40% van de VVT-instellingen meldt dat de bezetting structureel onder de norm ligt, blijkt uit nieuw onderzoek van ActiZ.',
    body: `<p>Ruim 40 procent van de instellingen voor verpleging, verzorging en thuiszorg (VVT) meldt dat hun personeelsbezetting structureel onder de norm ligt. Dit blijkt uit een grootschalig onderzoek van ActiZ onder 380 leden.</p>
    <h3>Oorzaken en achtergrond</h3>
    <p>Vergrijzing van de beroepsbevolking, een groeiende vraag naar zorg en concurrentie vanuit andere sectoren dragen bij aan het probleem. Veel instellingen kampen bovendien met een hoog ziekteverzuim, wat de druk op aanwezige medewerkers verder vergroot.</p>
    <blockquote>"We zien dat teams al jaren op hun tandvlees lopen. De instroom houdt simpelweg de uitstroom niet bij." — Directeur ActiZ</blockquote>
    <h3>Gevolgen voor de zorgverlening</h3>
    <p>Instellingen maken zorginhoudelijke keuzes die ze liever niet maken: minder begeleiding per cliënt en in sommige gevallen tijdelijk sluiten van capaciteit. Het kabinet heeft aangekondigd met een nieuw arbeidsmarktakkoord te komen.</p>`,
  },
  {
    id: 2, thema: 'Arbeidsmarkt', datum: 'Gisteren', minuten: 3,
    img: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=800&h=400&fit=crop&q=80',
    title: 'Cao Ziekenhuizen 2026: akkoord bereikt over 4,5 procent loonsverhoging',
    excerpt: 'Na maanden van onderhandelen liggen vakbonden en werkgevers op één lijn. De loonsverhoging geldt met terugwerkende kracht vanaf 1 januari.',
    body: `<p>Vakbonden FNV en CNV hebben samen met werkgeversorganisatie NVZ een principe-akkoord bereikt over de nieuwe cao Ziekenhuizen. De loonsverhoging van 4,5 procent geldt met terugwerkende kracht vanaf 1 januari 2026 en loopt tot en met december 2026.</p>
    <h3>Wat staat er in het akkoord</h3>
    <p>Naast de loonsverhoging bevat het akkoord afspraken over een extra verlofdag voor medewerkers in onregelmatige dienst en een verhoging van de onregelmatigheidstoeslag met 0,3 procentpunt. Werkgevers spreken ook af meer te investeren in begeleiding van nieuwe medewerkers.</p>
    <blockquote>"Dit akkoord is een stap vooruit, maar lost de onderliggende arbeidsmarktvraagstukken niet op." — Onderhandelaar FNV Zorg</blockquote>`,
  },
  {
    id: 3, thema: 'Arbeidsmarkt', datum: '3 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop&q=80',
    title: 'Zijinstromers moeten tekort aanvullen — maar begeleiding schiet tekort',
    excerpt: 'Meer dan 12.000 zij-instromers vonden het afgelopen jaar een baan in de zorg. Instellingen worstelen echter met hun begeleiding en scholing.',
    body: `<p>Het aantal zij-instromers in de zorg is het afgelopen jaar gestegen naar ruim 12.000. Toch is de instroom niet voldoende om de structurele tekorten op te lossen, en instellingen die zij-instromers aannemen kampen met nieuwe problemen: de begeleiding en inwerking kosten meer tijd dan verwacht.</p>
    <h3>Kansen en knelpunten</h3>
    <p>Uit een enquête onder HR-managers blijkt dat 68 procent van de zij-instromers na een jaar nog steeds werkzaam is in dezelfde instelling — een hogere retentie dan verwacht. Maar 42 procent van de begeleidende medewerkers ervaart de extra werkdruk die daarmee gepaard gaat als te hoog.</p>
    <blockquote>"Zij-instromers zijn geweldig, maar ze begeleiden is ook werk. Dat tijd moet je inroosteren." — HR-manager VVT-instelling</blockquote>`,
  },
  {
    id: 4, thema: 'Arbeidsmarkt', datum: '1 week geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&h=400&fit=crop&q=80',
    title: 'Onderzoek: vertrek uit de zorg ligt aan werkdruk, niet aan salaris',
    excerpt: 'Zorgmedewerkers vertrekken niet vanwege loon, maar vanwege administratieve druk en te weinig autonomie. Dat blijkt uit nationaal onderzoek.',
    body: `<p>Salaris speelt een ondergeschikte rol bij het vertrek van zorgmedewerkers. Dat blijkt uit een grootschalig onderzoek van het Nivel onder 4.200 voormalig zorgprofessionals. De twee voornaamste vertrekredenen zijn de ervaren administratieve last en het gebrek aan zeggenschap over het eigen werk.</p>
    <h3>Wat medewerkers zeggen</h3>
    <p>Bijna 70 procent van de respondenten geeft aan dat zij meer tijd kwijt zijn aan registratie en verantwoording dan aan directe zorgverlening. Een ruime meerderheid zegt te zijn vertrokken omdat zij het gevoel hadden niet meer te kunnen doen wat ze voor de zorg zijn komen doen.</p>
    <blockquote>"We behandelen de symptomen — salaris en roosters — maar niet de oorzaak: het verlies aan vakmanschap." — Onderzoeker Nivel</blockquote>`,
  },

  /* ── PASSENDE ZORG ── */
  {
    id: 5, thema: 'Passende zorg', datum: 'Gisteren', minuten: 6,
    img: 'https://images.unsplash.com/photo-1579684385127-1571037e9d45?w=800&h=400&fit=crop&q=80',
    title: 'Minister kondigt nieuw actieplan passende zorg aan',
    excerpt: 'Het kabinet presenteert een driejarig investeringsprogramma gericht op de verschuiving van ziekenhuiszorg naar de eerste lijn.',
    body: `<p>De minister van Volksgezondheid heeft een driejarig investeringsprogramma aangekondigd dat de verschuiving van ziekenhuiszorg naar de eerste lijn moet versnellen. Het programma heeft een omvang van 420 miljoen euro en loopt van 2026 tot en met 2028.</p>
    <h3>Kern van het plan</h3>
    <p>Het actieplan richt zich op drie pijlers: versterking van de huisartsenzorg, uitbreiding van gespecialiseerde verpleging in de wijk en betere samenwerking via regionale zorgnetwerken.</p>
    <blockquote>"Passende zorg betekent dat we de goede zorg op de goede plek leveren. Dat is niet altijd het ziekenhuis." — Minister VWS</blockquote>
    <h3>Reacties uit het veld</h3>
    <p>Koepelorganisaties reageren gematigd positief maar waarschuwen dat extra financiering alleen niet voldoende is zolang het personeelstekort aanhoudt.</p>`,
  },
  {
    id: 6, thema: 'Passende zorg', datum: '2 dagen geleden', minuten: 4,
    img: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50d1?w=800&h=400&fit=crop&q=80',
    title: 'Helft IZA-regio\'s loopt achter op uitvoeringsplanning',
    excerpt: 'Een tussentijdse evaluatie van het Integraal Zorgakkoord toont dat 54 procent van de regio\'s vertraging heeft in de uitvoering van regionale plannen.',
    body: `<p>Meer dan de helft van de IZA-regio's loopt achter op de afgesproken uitvoeringsplanning. Dat blijkt uit een tussentijdse evaluatie uitgevoerd in opdracht van het ministerie van VWS. Als voornaamste oorzaken worden governance-problemen, personeelstekorten en onvoldoende financiële middelen voor uitvoering aangedragen.</p>
    <h3>Wat gaat goed, wat niet</h3>
    <p>Regio's die al voor het IZA actief samenwerkten, lopen beduidend minder vertraging op. De evaluatie beveelt aan om de ondersteuning van regio's in de opstartfase te intensiveren en de verantwoordingslast te verminderen.</p>
    <blockquote>"IZA is ambitieus. Maar ambitie zonder uitvoeringscapaciteit levert vertraging op." — Programmadirecteur VWS</blockquote>`,
  },
  {
    id: 7, thema: 'Passende zorg', datum: '4 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=400&fit=crop&q=80',
    title: 'Huisartsen onder druk door verschuiving ziekenhuiszorg naar eerste lijn',
    excerpt: 'De werkdruk in huisartsenpraktijken neemt verder toe nu meer patiënten worden verwezen vanuit de tweedelijn richting de eerste lijn.',
    body: `<p>Huisartsenpraktijken in stedelijke gebieden melden een stijging van 15 procent in het aantal consulten voor patiënten die voorheen in ziekenhuizen werden behandeld. De verschuiving naar passende zorg, bedoeld om de zorg doelgerichter te organiseren, leidt in de praktijk tot overbelasting in de eerste lijn.</p>
    <h3>Knelpunt: capaciteit</h3>
    <p>Het aantal huisartsen groeit onvoldoende mee met de stijgende vraag. LHV berekent dat er in 2027 een tekort van 1.200 huisartsen dreigt, als de instroom vanuit opleidingen niet wordt opgeschaald.</p>
    <blockquote>"De beweging naar de eerste lijn is de juiste, maar je moet de eerste lijn er wel op voorbereiden." — Voorzitter LHV</blockquote>`,
  },
  {
    id: 8, thema: 'Passende zorg', datum: '6 dagen geleden', minuten: 7,
    img: 'https://images.unsplash.com/photo-1576671081837-5c4ab9c07dba?w=800&h=400&fit=crop&q=80',
    title: 'Uitkomstbekostiging: vier pilots tonen veelbelovende resultaten',
    excerpt: 'In vier regio\'s wordt geëxperimenteerd met bekostiging op basis van gezondheidsuitkomsten. De eerste data na één jaar zijn bemoedigend.',
    body: `<p>In vier regio's — Amsterdam, Eindhoven, Groningen en Zeeland — loopt al een jaar een pilot met uitkomstbekostiging voor chronische zorg. De eerste resultaten laten zien dat zorgaanbieders meer inzetten op preventie en vroeg ingrijpen, en dat de ziekenhuisopnames in de pilotpopulaties zijn gedaald met gemiddeld 8 procent.</p>
    <h3>Wat werkt en wat vraagt aandacht</h3>
    <p>De pilots laten ook zien dat uitkomstbekostiging veel administratieve afstemming vraagt. Zorgaanbieders in de regio's melden dat de dataverzameling en rapportage een extra last vormen die in de definitieve opzet verminderd moet worden.</p>
    <blockquote>"De richting klopt. Nu de uitvoering schaalbaar en uitvoerbaar maken." — Projectleider pilot Eindhoven</blockquote>`,
  },

  /* ── DIGITALISERING ── */
  {
    id: 9, thema: 'Digitalisering', datum: '2 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=400&fit=crop&q=80',
    title: 'AI in de radiologie: van pilot naar praktijk',
    excerpt: 'Steeds meer ziekenhuizen zetten AI-tools in voor beelddiagnostiek. Een inventarisatie van ervaringen en valkuilen.',
    body: `<p>Kunstmatige intelligentie maakt een stille opmars in de Nederlandse radiologie. Meer dan 60 procent van de ziekenhuizen gebruikt inmiddels minstens één AI-toepassing structureel in het radiologisch werkproces.</p>
    <h3>Wat werkt, wat niet</h3>
    <p>Toepassingen voor de detectie van longknobbeltjes en borsttumoren scoren hoog op gebruikerstevredenheid. Minder succesvol zijn tools die de volledige verslaglegging overnemen: de acceptatie onder specialisten blijft laag.</p>
    <blockquote>"AI is een co-piloot, geen piloot. De verantwoordelijkheid blijft bij de radioloog." — Hoofd radiologie, academisch ziekenhuis</blockquote>
    <h3>Aandachtspunten voor bestuurders</h3>
    <p>Inkoop van AI-tools vraagt een zorgvuldige validatieprocedure. Algoritmen getraind op andere populaties presteren niet altijd goed lokaal. Een onafhankelijke klinische validatie vóór implementatie wordt sterk aangeraden.</p>`,
  },
  {
    id: 10, thema: 'Digitalisering', datum: 'Vandaag', minuten: 4,
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop&q=80',
    title: 'EPD-implementatie bij groot UMC loopt zes maanden vertraging op',
    excerpt: 'Integratiekwesties met bestaande systemen vertragen de uitrol. De kosten lopen op naar het dubbele van de oorspronkelijke raming.',
    body: `<p>De implementatie van een nieuw elektronisch patiëntendossier bij een van de grote universitaire medische centra loopt zes maanden vertraging op. Oorzaak zijn onverwachte integratieproblemen met bestaande laboratorium- en beeldsystemen. De totale projectkosten zijn inmiddels opgelopen tot het dubbele van de initiële raming van 45 miljoen euro.</p>
    <h3>Lessen voor de sector</h3>
    <p>Experts wijzen erop dat EPD-projecten in de zorg structureel onderschat worden in complexiteit. De aanbeveling is om meer tijd te investeren in de voorbereidingsfase en integratiescenario's eerder te testen in een testomgeving.</p>
    <blockquote>"Een EPD-implementatie is geen IT-project. Het is een organisatieverandering met IT als middel." — CIO, UMC</blockquote>`,
  },
  {
    id: 11, thema: 'Digitalisering', datum: '3 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1550751827-4bd374f7a3c9?w=800&h=400&fit=crop&q=80',
    title: 'Helft van zorginstellingen niet voorbereid op cyberaanval',
    excerpt: 'Onderzoek van het NCSC toont aan dat cyberveiligheid bij veel zorgorganisaties nog geen bestuurlijk thema is — met grote risico\'s tot gevolg.',
    body: `<p>Bij 51 procent van de Nederlandse zorginstellingen ontbreekt een actueel incidentresponsplan voor een cyberaanval. Dat blijkt uit onderzoek van het Nationaal Cyber Security Centrum (NCSC) onder 340 zorgorganisaties. In acht van de tien gevallen is de CISO niet direct vertegenwoordigd in het bestuur.</p>
    <h3>Risico's in de praktijk</h3>
    <p>In 2025 werden 23 Nederlandse zorginstellingen getroffen door ransomware-aanvallen. Bij vier instellingen leidde dit tot tijdelijk verlies van toegang tot patiëntendossiers. Het NCSC roept bestuurders op cyberveiligheid op de agenda van de raad van bestuur te plaatsen.</p>
    <blockquote>"Cyberveiligheid is geen ICT-issue, het is een bestuurlijke verantwoordelijkheid." — Directeur NCSC</blockquote>`,
  },
  {
    id: 12, thema: 'Digitalisering', datum: '5 dagen geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=800&h=400&fit=crop&q=80',
    title: 'FHIR-uitwisseling: slechts 30 procent van ziekenhuizen op schema voor EU-deadline',
    excerpt: 'De Europese richtlijn voor digitale gegevensuitwisseling vraagt implementatie voor 2027. Een minderheid van de ziekenhuizen haalt dat.',
    body: `<p>Nederland loopt achter op de implementatie van de FHIR-standaard voor digitale gegevensuitwisseling. Slechts 30 procent van de ziekenhuizen geeft aan op schema te liggen voor de Europese deadline van 2027. De NVZ spreekt van een "zorgwekkend signaal" en roept de overheid op met aanvullende ondersteuning te komen.</p>
    <h3>Obstakels</h3>
    <p>Financiering, technische complexiteit en gebrek aan gestandaardiseerde terminologie worden het meest genoemd als drempels. Ziekenhuizen die al ver zijn, wijzen op het belang van een regionale aanpak waarbij meerdere instellingen tegelijk implementeren.</p>
    <blockquote>"Data-uitwisseling kan pas als iedereen dezelfde taal spreekt. Dat vraagt landelijke regie." — CIO, topklinisch ziekenhuis</blockquote>`,
  },

  /* ── CAPACITEITSDRUK ── */
  {
    id: 13, thema: 'Capaciteitsdruk', datum: '3 dagen geleden', minuten: 7,
    img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=400&fit=crop&q=80',
    title: 'GGZ-wachtlijsten nauwelijks korter ondanks extra middelen',
    excerpt: 'Ondanks de extra investeringen uit het Hoofdlijnenakkoord GGZ zijn de wachttijden in 2025 nauwelijks gedaald.',
    body: `<p>De wachttijden in de GGZ zijn in 2025 nauwelijks afgenomen, ondanks de extra middelen uit het Hoofdlijnenakkoord. De NZa concludeert dit in haar nieuwste trendrapportage. De gemiddelde wachttijd voor basis-GGZ bedraagt 11 weken (norm: 4 weken); voor specialistische GGZ 18 weken.</p>
    <h3>Structurele oorzaken</h3>
    <p>Onderzoekers wijzen op drie factoren: de toenemende vraag na de covidpandemie, het personeelstekort en de administratielast die zorgprofessionals ervan weerhoudt meer patiënten te behandelen.</p>
    <blockquote>"Extra middelen helpen, maar lossen het onderliggende capaciteitsprobleem niet op." — Directeur NZa</blockquote>`,
  },
  {
    id: 14, thema: 'Capaciteitsdruk', datum: 'Gisteren', minuten: 4,
    img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&h=400&fit=crop&q=80',
    title: 'SEH-wachttijden stijgen in vier grote regio\'s tot boven de vier uur',
    excerpt: 'In de regio\'s Amsterdam, Rotterdam, Eindhoven en Arnhem overschrijden SEH-wachttijden structureel de aanvaardbare norm van vier uur.',
    body: `<p>In vier grote Nederlandse regio's overschrijden de wachttijden op de spoedeisende hulp structureel de vier uur. Dit blijkt uit cijfers van de Inspectie Gezondheidszorg en Jeugd (IGJ). De inspectie spreekt van "zorgwekkende patronen" en heeft de betreffende ziekenhuizen gevraagd verbeterplannen in te dienen.</p>
    <h3>Oorzaken</h3>
    <p>Combinatie van personeelstekort, stijging van het aantal SEH-bezoeken en problemen met doorstroom naar verpleegafdelingen worden als voornaamste oorzaken aangewezen. Ziekenhuizen experimenteren met triagemodellen en samenwerking met huisartsenposten.</p>
    <blockquote>"De SEH is de barometer van het zorgsysteem. Als die overloopt, is er ergens anders ook een probleem." — Inspecteur IGJ</blockquote>`,
  },
  {
    id: 15, thema: 'Capaciteitsdruk', datum: '4 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop&q=80',
    title: 'Verpleeghuiscapaciteit dreigt tekort te schieten bij verdere vergrijzing',
    excerpt: 'Prognoses van het CBS tonen aan dat het huidige tempo van capaciteitsuitbreiding onvoldoende is voor de verwachte zorgvraag in 2035.',
    body: `<p>Het huidige tempo van uitbreiding van verpleeghuiscapaciteit is onvoldoende om de verwachte stijging van de vraag op te vangen. Dat blijkt uit nieuwe prognoses van het CBS en het Planbureau voor de Leefomgeving. In 2035 wordt een tekort van naar schatting 50.000 verpleeghuisplaatsen verwacht als beleid ongewijzigd blijft.</p>
    <h3>Wat moet er anders</h3>
    <p>Onderzoekers pleiten voor een combinatie van nieuwbouw, transformatie van bestaande gebouwen en het stimuleren van thuiszorgalternatieven. Gemeenten worden aangespoord dit in hun woonzorgvisies concreet te verankeren.</p>
    <blockquote>"We weten al tien jaar dat dit eraan komt. Nu moeten we echt gaan bouwen." — Directeur ActiZ</blockquote>`,
  },
  {
    id: 16, thema: 'Capaciteitsdruk', datum: '5 dagen geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1519494026-f1d59edd8df6?w=800&h=400&fit=crop&q=80',
    title: 'NZa: Treeknormen overschreden in acht van de tien deelsectoren',
    excerpt: 'Een nieuw NZa-overzicht laat zien dat het eerder uitzondering dan regel is om wachttijden binnen de normen te houden.',
    body: `<p>In acht van de tien zorgdeelsectoren worden de Treeknormen voor aanvaardbare wachttijden structureel overschreden. Dit blijkt uit het nieuwste trendrapport van de Nederlandse Zorgautoriteit. Alleen in de eerstelijnsdiagnostiek en verloskunde wordt de norm gehaald.</p>
    <h3>Implicaties voor beleid</h3>
    <p>De NZa stelt voor de Treeknormen te herzien en tegelijk meer middelen vrij te maken voor capaciteitsuitbreiding in de bottleneck-sectoren. Er wordt ook gepleit voor een nationale capaciteitsmonitor die beleidsmakers en bestuurders eerder waarschuwt voor oplopende wachttijden.</p>
    <blockquote>"Treeknormen zijn geen straf, maar een signaal. Dat signaal staat al jaren op rood." — Raad van bestuur NZa</blockquote>`,
  },

  /* ── REGIONALE SAMENWERKING ── */
  {
    id: 17, thema: 'Regionale samenwerking', datum: '4 dagen geleden', minuten: 4, isRegio: true,
    img: 'https://images.unsplash.com/photo-1559757175-5aba18ecd7de?w=800&h=400&fit=crop&q=80',
    title: 'Regio Utrecht sluit breed IZA-uitvoeringsplan',
    excerpt: 'Zeven zorgorganisaties en drie gemeenten ondertekenen een samenwerkingsconvenant gericht op thuiszorg en preventie.',
    body: `<p>In de regio Utrecht hebben zeven zorgorganisaties en drie gemeenten een samenwerkingsconvenant ondertekend voor de uitvoering van het IZA. Het is een van de eerste regio's in Nederland met een breed gedragen uitvoeringsplan.</p>
    <h3>Wat staat er in het akkoord</h3>
    <p>Het convenant bevat afspraken over uitbreiding van thuiszorgcapaciteit, gezamenlijke preventieactiviteiten en de inrichting van een regionaal zorgcoördinatiepunt.</p>
    <blockquote>"Dit is geen plan op papier, maar een concreet uitvoeringsprogramma met budget en aanspreekpunten." — Wethouder gemeente Utrecht</blockquote>
    <h3>Landelijke betekenis</h3>
    <p>Het ministerie van VWS presenteert de Utrechtse aanpak als voorbeeld voor andere regio's. Een evaluatie is gepland voor het voorjaar van 2027.</p>`,
  },
  {
    id: 18, thema: 'Regionale samenwerking', datum: 'Vandaag', minuten: 3, isRegio: true,
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop&q=80',
    title: 'Noord-Holland: drie gemeenten stappen uit IZA-samenwerkingsverband',
    excerpt: 'Meningsverschillen over governance en kostenverdeling liggen ten grondslag aan het vertrek. De regio zoekt nu nieuwe partners.',
    body: `<p>Drie gemeenten in de regio Noord-Holland hebben zich teruggetrokken uit het regionale IZA-samenwerkingsverband. Aanleiding zijn langlopende meningsverschillen over de verdeling van kosten voor gezamenlijke infrastructuur en onduidelijkheid over wie beslissingsbevoegdheid heeft bij conflicterende belangen.</p>
    <h3>Impact</h3>
    <p>Het vertrek raakt de geplande opzet van een regionaal zorgcoördinatiepunt, waarvoor de drie gemeenten een cruciale rol hadden in de financiering. Zorgaanbieders in de regio spreken van "een flinke tegenslag" maar benadrukken dat de resterende partners vasthouden aan de uitvoering.</p>
    <blockquote>"Samenwerking vraagt geduld. Sommige partijen zijn er nog niet klaar voor." — Bestuurder zorgaanbieder Noord-Holland</blockquote>`,
  },
  {
    id: 19, thema: 'Regionale samenwerking', datum: '3 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop&q=80',
    title: 'Vijf regio\'s openen gezamenlijk zorgcoördinatiepunt',
    excerpt: 'In vijf regio\'s is een regionaal zorgcoördinatiepunt operationeel. Het doel: betere doorstroom tussen de lijnen en minder dubbele zorg.',
    body: `<p>In vijf regio's — Rotterdam, Nijmegen, Leeuwarden, Tilburg en Haarlem — is het afgelopen kwartaal een regionaal zorgcoördinatiepunt operationeel geworden. De centra fungeren als spil tussen ziekenhuizen, huisartsen, thuiszorg en sociale wijkteams.</p>
    <h3>Eerste resultaten</h3>
    <p>In de regio Rotterdam, die het verst is, rapporteert het coördinatiepunt na drie maanden een daling van 12 procent in dubbele zorgcontacten en een verkorting van de gemiddelde overdrachtstijd met twee dagen.</p>
    <blockquote>"Als iedereen weet wie de regie heeft, gaat zorg ineens veel soepeler." — Coördinator Regionaal Zorgpunt Rotterdam</blockquote>`,
  },
  {
    id: 20, thema: 'Regionale samenwerking', datum: '1 week geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&q=80',
    title: 'Bestuurders: governance van regionale netwerken schiet tekort',
    excerpt: 'Een enquête onder 200 zorgbestuurders toont dat onduidelijke verantwoordelijkheidsverdeling de samenwerking in de regio blokkeert.',
    body: `<p>Tweederde van de ondervraagde zorgbestuurders ervaart de governance van regionale netwerken als onvoldoende. Dat blijkt uit een enquête van de NVZD onder 200 bestuurders in ziekenhuizen, VVT en GGZ. Het meest genoemde knelpunt is onduidelijkheid over wie de eindverantwoordelijkheid draagt als regionale afspraken niet nagekomen worden.</p>
    <h3>Aanbevelingen</h3>
    <p>De NVZD pleit voor een landelijk governance-kader voor regionale zorgnetwerken, met heldere spelregels voor geschillenbeslechting en transparante financieringsafspraken. Daarin moet ook een rol zijn voor gemeenten als publieke partij.</p>
    <blockquote>"Zonder heldere governance blijft samenwerking vrijblijvend — en dat is precies het probleem." — Voorzitter NVZD</blockquote>`,
  },

  /* ── FINANCIERING ── */
  {
    id: 21, thema: 'Financiering', datum: '5 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=400&fit=crop&q=80',
    title: 'NZa publiceert nieuwe tarieven langdurige zorg',
    excerpt: 'De nieuwe tarieven voor 2026 zijn gepubliceerd. Instellingen krijgen te maken met hogere kosten en een beperkte looncompensatie.',
    body: `<p>De NZa heeft de tarieven voor de langdurige zorg voor 2026 gepubliceerd. De tarieven stijgen gemiddeld met 3,1 procent, maar voor veel instellingen is dit onvoldoende om de gestegen loon- en energiekosten op te vangen.</p>
    <h3>Reacties uit de sector</h3>
    <p>Brancheorganisaties ActiZ en VGN spreken van een ontoereikende compensatie. Zij stellen dat de werkelijke kostenstijging in de sector uitkomt op gemiddeld 5,4 procent.</p>
    <blockquote>"Instellingen die al krap bij kas zitten, komen verder in de problemen." — Voorzitter ActiZ</blockquote>
    <h3>Implicaties voor bedrijfsvoering</h3>
    <p>Financieel directeuren worden aangeraden hun begroting voor 2026 tijdig bij te stellen. De NZa biedt de mogelijkheid om via een zienswijzeprocedure bezwaar aan te tekenen. Deadline: 1 augustus 2026.</p>`,
  },
  {
    id: 22, thema: 'Financiering', datum: 'Gisteren', minuten: 4,
    img: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=400&fit=crop&q=80',
    title: 'Ziekenhuizen vrezen gezamenlijk tekort van 800 miljoen in 2026',
    excerpt: 'De NVZ waarschuwt dat de combinatie van stijgende kosten en ontoereikende tarieven tot ongekend grote tekorten leidt.',
    body: `<p>De Nederlandse Vereniging van Ziekenhuizen (NVZ) waarschuwt dat de sector gezamenlijk op een tekort van circa 800 miljoen euro afstevent in 2026. De combinatie van stijgende energiekosten, cao-verplichtingen en ontoereikende NZa-tarieven wordt als hoofdoorzaak aangewezen.</p>
    <h3>Wat dit betekent voor de praktijk</h3>
    <p>Ziekenhuizen melden al het uitstellen van geplande investeringen in gebouwen en apparatuur. Een aantal instellingen overweegt capaciteitsreducties op niet-acute afdelingen. De NVZ heeft een spoedoverleg aangevraagd bij het ministerie van VWS.</p>
    <blockquote>"We kunnen niet blijven bezuinigen op kwaliteit. Op een gegeven moment gaat het ten koste van de patiënt." — Voorzitter NVZ</blockquote>`,
  },
  {
    id: 23, thema: 'Financiering', datum: '4 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21ed22?w=800&h=400&fit=crop&q=80',
    title: 'Alternatieve bekostiging ouderenzorg: pilots leveren gemengde resultaten',
    excerpt: 'In drie regio\'s wordt geëxperimenteerd met populatiebekostiging voor ouderenzorg. De resultaten na één jaar zijn wisselend maar leerzaam.',
    body: `<p>In drie regio's zijn pilots gaande met populatiebekostiging voor ouderenzorg, waarbij zorgaanbieders per kwartaal een vast bedrag ontvangen per ingeschreven oudere in plaats van per verleende prestatie. Na een jaar zijn de resultaten wisselend: in twee regio's zijn de kosten gedaald, in één regio juist gestegen.</p>
    <h3>Lessen</h3>
    <p>De onderzoekers concluderen dat het succes sterk afhangt van de kwaliteit van de samenwerking tussen aanbieders en de beschikbaarheid van goede data over de zorgvraag in de populatie. Zonder die data is doelgericht sturen lastig.</p>
    <blockquote>"Populatiebekostiging is veelbelovend, maar vereist een rijpheid die niet overal aanwezig is." — Onderzoeker VU Medisch Centrum</blockquote>`,
  },
  {
    id: 24, thema: 'Financiering', datum: '6 dagen geleden', minuten: 4,
    img: 'https://images.unsplash.com/photo-1576765608622-067973a79f53?w=800&h=400&fit=crop&q=80',
    title: 'NZa opent onderzoek naar marktconcentratie in GGZ na fusiegolf',
    excerpt: 'Na een reeks fusies in de geestelijke gezondheidszorg ziet de NZa aanleiding de marktconcentratie nader te onderzoeken.',
    body: `<p>De Nederlandse Zorgautoriteit heeft een marktonderzoek geopend naar de concentratie in de GGZ-sector. Aanleiding is een reeks fusies en overnames in de afgelopen drie jaar, waardoor in meerdere regio's nog maar één of twee grote GGZ-aanbieders actief zijn. De NZa wil beoordelen of dit de keuzevrijheid van patiënten en de doelmatigheid van de zorg onder druk zet.</p>
    <h3>Reacties</h3>
    <p>GGZ Nederland stelt dat schaalvergroting noodzakelijk is om specialistische zorg bereikbaar te houden en het hoofd te bieden aan personeelstekorten. Patiëntenorganisaties zijn bezorgder en vragen om garanties voor toegankelijkheid.</p>
    <blockquote>"Schaalvergroting mag nooit ten koste gaan van bereikbaarheid voor de patiënt." — Directeur MIND</blockquote>`,
  },

  /* ── ZORGTRANSFORMATIE ── */
  {
    id: 25, thema: 'Zorgtransformatie', datum: 'Vandaag', minuten: 6,
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop&q=80',
    title: 'Zorgtransformatie gaat te langzaam: experts pleiten voor dwingend tijdpad',
    excerpt: 'Onafhankelijke evaluatoren concluderen dat de transformatie van het zorgsysteem achterblijft bij de ambities uit het IZA. Zonder dwingend tijdpad dreigt de kans te worden gemist.',
    body: `<p>De transformatie van het Nederlandse zorgsysteem verloopt te langzaam. Dit concluderen onafhankelijke evaluatoren in een tussentijds rapport over de voortgang van het Integraal Zorgakkoord. De evaluatoren stellen dat de structurele verschuiving van tweedelijn naar eerste lijn en van behandelen naar voorkomen weliswaar zichtbaar is, maar te gefragmenteerd en te traag.</p>
    <h3>Structurele obstakels</h3>
    <p>Onderzoekers wijzen op drie hardnekkige obstakels: het personeelstekort dat transformatie-investeringen opslokt, de bekostigingssystematiek die ziekenhuizen beloont voor volume, en de governance-complexiteit van regionale samenwerking. "Elk van deze factoren vertraagt op zichzelf al de transformatie — samen vormen ze een rem die moeilijk te overwinnen is zonder externe druk," aldus het rapport.</p>
    <blockquote>"We weten al jaren wat er moet veranderen. Het gebrek is niet aan kennis maar aan urgentie en sturing." — Voorzitter Raad voor Volksgezondheid & Samenleving</blockquote>
    <h3>Aanbevelingen</h3>
    <p>De evaluatoren pleiten voor een dwingende routekaart met concrete mijlpalen per regio, aangevuld met transformatiebudgetten die pas vrijkomen bij aantoonbare resultaten. Ook wordt aanbevolen om bestuurlijke verantwoordelijkheid explicieter te beleggen.</p>`,
  },
  {
    id: 26, thema: 'Zorgtransformatie', datum: 'Gisteren', minuten: 4,
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop&q=80',
    title: 'Vijf ziekenhuizen bouwen gezamenlijke integrale zorgeenheden',
    excerpt: 'In een gezamenlijk IZA-initiatief transformeren vijf ziekenhuizen hun poliklinische zorg naar integrale eenheden waar cure en care samenkomen.',
    body: `<p>Vijf middelgrote ziekenhuizen in drie regio's starten een ambitieus transformatieprogramma: hun poliklinische afdelingen worden omgebouwd naar integrale zorgeenheden waar chronische patiënten hun complete zorgtraject kunnen doorlopen, van diagnostiek en behandeling tot verpleging en ondersteuning bij zelfmanagement.</p>
    <h3>Concept en werkwijze</h3>
    <p>In de nieuwe eenheden werken specialisten, verpleegkundig specialisten, diëtisten, fysiotherapeuten en maatschappelijk werkers in vaste teams samen rondom groepen patiënten met vergelijkbare aandoeningen. De administratie is geïntegreerd in het zorgproces, waardoor artsen en verpleegkundigen minder tijd kwijt zijn aan systemen en meer aan de patiënt.</p>
    <blockquote>"Integratie is niet een modewoord — het is de enige manier om de zorg betaalbaar en menselijk te houden." — Bestuurder deelnemend ziekenhuis</blockquote>
    <h3>Verwachte resultaten</h3>
    <p>Het programma loopt drie jaar en wordt extern geëvalueerd. Eerste projecties wijzen op een verkorting van de doorlooptijd van complexe trajecten met gemiddeld 25% en een hogere patiënttevredenheid.</p>`,
  },
  {
    id: 27, thema: 'Zorgtransformatie', datum: '3 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=800&h=400&fit=crop&q=80',
    title: 'RVS-rapport: zorgtransformatie vraagt cultuurverandering, niet alleen structuur',
    excerpt: 'De Raad voor Volksgezondheid & Samenleving waarschuwt dat structurele hervormingen zonder cultuurverandering gedoemd zijn te mislukken.',
    body: `<p>Structurele hervormingen in de zorg slagen alleen als er tegelijk wordt geïnvesteerd in cultuurverandering binnen zorgorganisaties. Dat is de kernboodschap van een nieuw adviesrapport van de Raad voor Volksgezondheid & Samenleving (RVS). Het rapport, getiteld 'Transformeren van binnenuit', analyseert tien jaar beleidsinspanningen op het gebied van zorgtransformatie.</p>
    <h3>Wat mist er</h3>
    <p>De RVS constateert dat de meeste transformatie-initiatieven focussen op structuren, systemen en financiering, maar de menselijke kant — waarden, gedrag en leiderschapsstijl — te weinig adresseren. "Nieuwe structuren worden bevolkt door mensen met oude gewoonten. Dat maakt ze al snel oud," stelt het rapport.</p>
    <blockquote>"De hardste knop om aan te draaien is de cultuur van meten, verantwoorden en wantrouwen die de sector in de greep houdt." — RVS</blockquote>
    <h3>Concrete aanbevelingen</h3>
    <p>De raad pleit voor meer ruimte voor experimenten, minder verantwoordingslast voor voorlopers en actief leiderschapsontwikkelingsprogramma's specifiek gericht op de zorg.</p>`,
  },

  /* ── PREVENTIE ── */
  {
    id: 28, thema: 'Preventie', datum: 'Gisteren', minuten: 5,
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&q=80',
    title: 'Preventieakkoord haalt rookdoelstelling niet: tempo van daling te laag',
    excerpt: 'Een tussentijdse evaluatie van het Nationaal Preventieakkoord concludeert dat het doel van een rookvrije generatie in 2040 niet gehaald wordt als beleid ongewijzigd blijft.',
    body: `<p>Nederland haalt de ambitieuze doelstelling van het Nationaal Preventieakkoord om in 2040 een rookvrije generatie te hebben niet als het huidige tempo van dalingen aanhoudt. Dat concludeert het RIVM in een tussentijdse evaluatie. Het percentage rokers daalt weliswaar, maar te langzaam om de beoogde reductie van 20% naar minder dan 5% te halen.</p>
    <h3>Wat werkt, wat niet</h3>
    <p>Succesvolle interventies zijn de verhoging van accijns, reclameverboden en de uitbreiding van rookvrije zones. Minder effectief blijken de vrijwillige samenwerking met de tabaksindustrie en zelfreguleringsafspraken. Het RIVM pleit voor aanvullende maatregelen, waaronder een uitgebreider verkoopverbod en hogere accijnzen.</p>
    <blockquote>"Vrijwilligheid werkt niet bij verslavende producten. We hebben wetgeving nodig." — Directeur RIVM</blockquote>
    <h3>Implicaties voor de zorgsector</h3>
    <p>Zorgaanbieders spelen een cruciale rol via stoppen-met-roken-trajecten. De vergoeding vanuit de basisverzekering is uitgebreid, maar de doorverwijzing vanuit de huisartsenpraktijk blijft achter bij de verwachtingen.</p>`,
  },
  {
    id: 29, thema: 'Preventie', datum: '2 dagen geleden', minuten: 4,
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=400&fit=crop&q=80',
    title: 'Gemeenten verdubbelen budget wijkgerichte preventie na positieve resultaten',
    excerpt: 'Na drie jaar pilots met wijkgerichte preventie zien gemeenten aanwijzingen van lagere zorgkosten en meer zelfredzaamheid. Budget wordt verdubbeld.',
    body: `<p>Meer dan 40 gemeenten kondigen aan hun budget voor wijkgerichte preventie te verdubbelen. De beslissing volgt op drie jaar pilotprogramma's waarbij buurtcoaches, zorgaanbieders en sociale wijkteams intensief samenwerken om gezondheidsachterstanden in kwetsbare wijken te verminderen.</p>
    <h3>Resultaten van de pilots</h3>
    <p>In de acht intensiefst onderzochte pilotwijken is de ziekenhuisopname vanwege vermijdbare aandoeningen met 11% gedaald ten opzichte van vergelijkbare wijken zonder programma. De zelfraportagecijfers over gezondheid zijn gestegen. De kosten-baten analyse over vijf jaar toont een positieve business case, al zijn de onderzoekers voorzichtig vanwege de korte looptijd.</p>
    <blockquote>"Preventie kost geld nu, maar spaart zorg later. Deze cijfers geven ons het vertrouwen om te investeren." — Wethouder Volksgezondheid gemeente Rotterdam</blockquote>
    <h3>Wat de zorg moet doen</h3>
    <p>Zorgaanbieders worden opgeroepen hun preventief zorgaanbod te koppelen aan de wijkgerichte aanpak. Huisartsen, GGZ-aanbieders en thuiszorg moeten structureler samenwerken met gemeentelijke sociale teams.</p>`,
  },
  {
    id: 30, thema: 'Preventie', datum: '4 dagen geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=800&h=400&fit=crop&q=80',
    title: 'Sport als zorginterventie wint terrein: huisartsen schrijven steeds vaker voor',
    excerpt: 'Beweegrecepten en sportverwijzingen worden steeds gangbaarder in de huisartsenpraktijk. Onderzoek toont effectiviteit bij chronische aandoeningen.',
    body: `<p>Het aantal beweegrecepten dat huisartsen uitschrijven is in drie jaar tijd verdrievoudigd. Steeds meer praktijken werken samen met lokale sportaanbieders om patiënten met diabetes type 2, hart- en vaatziekten en depressie een bewegingsinterventie te bieden als aanvulling op of alternatief voor medicatie.</p>
    <h3>Wetenschappelijke basis</h3>
    <p>Een grootschalige studie van de Vrije Universiteit Amsterdam toont aan dat patiënten met diabetes type 2 die deelnemen aan een gestructureerd beweegprogramma gemiddeld 0,7 HbA1c-punten lager eindigen dan de controlegroep. Bij depressie toont beweging vergelijkbare effectiviteit als antidepressiva bij milde en matige gevallen.</p>
    <blockquote>"Bewegen is zorg. We moeten het ook zo bekostigen en organiseren." — Hoogleraar Sportgeneeskunde VU Amsterdam</blockquote>
    <h3>Drempels</h3>
    <p>Bekostiging blijft een knelpunt: beweegrecepten vallen deels buiten de basisverzekering. Gemeenten en zorgverzekeraars werken aan nieuwe contractvormen, maar er is nog geen landelijk dekkend model.</p>`,
  },

  /* ── OUDERENZORG ── */
  {
    id: 31, thema: 'Ouderenzorg', datum: 'Vandaag', minuten: 5,
    img: 'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=800&h=400&fit=crop&q=80',
    title: 'Kabinet presenteert Ouderenzorgplan 2030: "Thuis als standaard"',
    excerpt: 'Het nieuwe kabinetsplan zet in op een fundamentele verschuiving: ouderen blijven langer thuis wonen met intensieve wijkzorgondersteuning als norm.',
    body: `<p>Het kabinet heeft het Ouderenzorgplan 2030 gepresenteerd. De kern van het plan is het principe "Thuis als standaard": ook ouderen met complexe zorgvragen krijgen primair ondersteuning om thuis te blijven wonen. Verpleeghuisopname is voortaan het sluitstuk, niet de vanzelfsprekende oplossing.</p>
    <h3>Vier pijlers</h3>
    <p>Het plan steunt op vier pijlers: uitbreiding van de wijkverpleging met 15.000 extra fte's, een mantelzorgondersteuningsprogramma, digitale zorg thuis (sensoren, videoconsulten, medicatiedispensers) en aanpassing van het woningbestand door 120.000 extra levensloopbestendige woningen vóór 2028.</p>
    <blockquote>"We bouwen een samenleving waar oud worden geen synoniem is voor institutionalisering." — Minister VWS</blockquote>
    <h3>Reacties uit de sector</h3>
    <p>ActiZ en de thuiszorgbranche reageren gematigd positief maar benadrukken dat de personeelstekorten het plan direct in de weg staan. Zonder structurele arbeidsmarktinvesteringen blijft "thuis als standaard" een wens op papier.</p>`,
  },
  {
    id: 32, thema: 'Ouderenzorg', datum: '3 dagen geleden', minuten: 4,
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&h=400&fit=crop&q=80',
    title: 'Kwaliteitskader verpleeghuiszorg: inspectie ziet achterblijvende uitvoering',
    excerpt: 'De IGJ constateert dat een kwart van de verpleeghuizen nog niet voldoet aan de personeelsnormen uit het Kwaliteitskader, vier jaar na invoering.',
    body: `<p>Vier jaar na de invoering van het Kwaliteitskader verpleeghuiszorg voldoet nog altijd een kwart van de verpleeghuizen niet aan de minimumnormen voor personeelsbezetting en deskundigheidsmix. Dat constateert de Inspectie Gezondheidszorg en Jeugd (IGJ) in haar jaarlijkse analyse. De inspectie spreekt van "zorgwekkend structureel tekortschieten" bij de achterliggende groep instellingen.</p>
    <h3>Voornaamste tekortkomingen</h3>
    <p>De meest genoemde tekortkomingen zijn onvoldoende aanwezigheid van verpleegkundigen met HBO-opleiding, te weinig specialisten ouderengeneeskunde voor de cliëntpopulatie en onvoldoende aandacht voor welbevinden naast medische zorg. De inspectie wijst erop dat de personeelstekorten zowel oorzaak als gevolg zijn van deze problematiek.</p>
    <blockquote>"Een kader dat niet wordt nageleefd beschermt niemand. We zullen moeten doorzetten, ook als dat ongemakkelijk voelt." — Hoofdinspecteur IGJ</blockquote>
    <h3>Wat bestuurders moeten doen</h3>
    <p>De IGJ verwacht van alle verpleeghuisbesturen een actueel verbeterplan en een realistisch meerjarenscenario voor personeelsopbouw. Instellingen die niet aantoonbaar verbeteren, riskeren aanwijzingen of publieke rapportages.</p>`,
  },
  {
    id: 33, thema: 'Ouderenzorg', datum: '5 dagen geleden', minuten: 6,
    img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=400&fit=crop&q=80',
    title: 'Dementiezorg in Nederland: 170.000 diagnoses verwacht in 2030',
    excerpt: 'Nederland bereidt zich voor op een forse stijging van dementiegevallen. Nieuwe zorgconcepten en vroegsignalering staan centraal in het Nationaal Dementieprogramma.',
    body: `<p>In 2030 worden naar schatting 170.000 mensen in Nederland gediagnosticeerd met dementie — een stijging van 30% ten opzichte van nu. Dit prognose van het RIVM en Alzheimer Nederland vormt de aanleiding voor het nieuwe Nationaal Dementieprogramma, dat inzet op vroegsignalering, persoonsgerichte zorg en innovatieve woonconcepten.</p>
    <h3>Vroegsignalering als prioriteit</h3>
    <p>Diagnostiek en vroegsignalering staan centraal: hoe eerder de diagnose, hoe langer mensen zelfstandig kunnen functioneren met de juiste begeleiding. Het programma investeert in geheugenpoli's, training van huisartsen en digitale screeningsinstrumenten.</p>
    <blockquote>"Dementie is geen normaal oud worden. We moeten het herkennen als de medische aandoening die het is, en er ook als zodanig naar handelen." — Directeur Alzheimer Nederland</blockquote>
    <h3>Woonconcepten</h3>
    <p>Kleinschalige woonconcepten gericht op vertrouwdheid, zingeving en beweging hebben bewezen positief effect op de kwaliteit van leven van mensen met dementie. Het programma subsidieert de uitrol van 500 extra kleinschalige woonprojecten tot 2028 en investeert in opleiding van dementiespecialisten.</p>`,
  },
];

/* ══════════════════════════════════════
   OVERIGE DATA
══════════════════════════════════════ */
const DOSSIERS = [
  { icon: '👥', thema: 'Arbeidsmarkt', title: 'Arbeidsmarkt in de zorg', desc: 'Verdieping in personeelstekorten, cao-ontwikkelingen, instroom en retentie van zorgpersoneel.', artikelen: 24, updated: 'Bijgewerkt: vandaag' },
  { icon: '🎯', thema: 'Passende zorg', title: 'Passende zorg & IZA', desc: 'Achtergrond bij het Integraal Zorgakkoord, uitkomstgerichte bekostiging en regionale uitvoering.', artikelen: 18, updated: 'Bijgewerkt: gisteren' },
  { icon: '💻', thema: 'Digitalisering', title: 'Digitalisering en AI in de zorg', desc: 'EPD-implementaties, AI-toepassingen, FHIR-standaarden en cyberveiligheid in de zorgsector.', artikelen: 31, updated: 'Bijgewerkt: 2 dagen geleden' },
  { icon: '📊', thema: 'Capaciteitsdruk', title: 'Capaciteit en wachtlijsten', desc: 'Analyses van wachttijden per sector, capaciteitsplanning en regionale spreidingsvraagstukken.', artikelen: 15, updated: 'Bijgewerkt: 3 dagen geleden' },
  { icon: '🤝', thema: 'Regionale samenwerking', title: 'Regionale zorgnetwerken', desc: 'Overzicht van IZA-uitvoeringsplannen per regio, governance-modellen en praktijkvoorbeelden.', artikelen: 20, updated: 'Bijgewerkt: 1 week geleden' },
  { icon: '💶', thema: 'Financiering', title: 'Financiering en bekostiging', desc: 'NZa-tarieven, bezuinigingen, prestatiebekostiging en financiële duurzaamheid in de zorg.', artikelen: 22, updated: 'Bijgewerkt: 4 dagen geleden' },
  { icon: '🔄', thema: 'Zorgtransformatie', title: 'Zorgtransformatie & IZA-uitvoering', desc: 'De fundamentele herinrichting van het zorgstelsel: integrale zorg, populatiemanagement en cultuurverandering.', artikelen: 17, updated: 'Bijgewerkt: vandaag' },
  { icon: '🛡️', thema: 'Preventie', title: 'Preventie en leefstijl', desc: 'Nationaal Preventieakkoord, wijkgerichte gezondheidsbevordering en de verbinding tussen zorg en sociaal domein.', artikelen: 14, updated: 'Bijgewerkt: gisteren' },
  { icon: '👴', thema: 'Ouderenzorg', title: 'Ouderenzorg en dementie', desc: 'Vergrijzing, verpleeghuiszorg, thuiszorg, dementiebeleid en de transitie naar "thuis als standaard".', artikelen: 19, updated: 'Bijgewerkt: 2 dagen geleden' },
];

const AGENDA = [
  { dag: '28', maand: 'MEI', type: 'Congres', badge: 'congres', title: 'Zorgvisie Congres Arbeidsmarkt 2026', meta: 'Utrecht · Jaarbeurs · 09:00 – 17:00' },
  { dag: '4',  maand: 'JUN', type: 'Webinar', badge: 'webinar', title: 'Webinar: Passende zorg in de praktijk', meta: 'Online · 12:30 – 13:30' },
  { dag: '11', maand: 'JUN', type: 'Bijeenkomst', badge: 'bijeenkomst', title: 'Regiobijeenkomst IZA Noord-Holland', meta: 'Amsterdam · Zorgkantoor · 14:00 – 17:00' },
  { dag: '18', maand: 'JUN', type: 'Webinar', badge: 'webinar', title: 'Webinar: AI in de zorg — kansen en risico\'s', meta: 'Online · 15:00 – 16:00' },
  { dag: '25', maand: 'JUN', type: 'Congres', badge: 'congres', title: 'Nationaal GGZ Congres 2026', meta: 'Den Haag · Congrescentrum · 09:30 – 18:00' },
  { dag: '2',  maand: 'JUL', type: 'Bijeenkomst', badge: 'bijeenkomst', title: 'Bestuurlijk overleg langdurige zorg', meta: 'Utrecht · VWS · 10:00 – 12:00' },
];


/* ══════════════════════════════════════
   THEMA ICONEN (SVG — geen emoji)
══════════════════════════════════════ */
const THEME_ICONS = {
  'Arbeidsmarkt':           `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  'Passende zorg':          `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  'Digitalisering':         `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  'Capaciteitsdruk':        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  'Regionale samenwerking': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'Financiering':           `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  'Zorgtransformatie':      `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  'Preventie':              `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  'Ouderenzorg':            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
};

const KNOWN_THEMAS = new Set(Object.keys(THEME_ICONS));

/* ══════════════════════════════════════
   REGIO DATA — uitgebreid met thema-tags
══════════════════════════════════════ */
const REGIO_ITEMS = {
  'Noord-Holland': [
    { title: 'Amsterdam UMC en Dijklander werken aan regionale spoedzorgketen', meta: 'Noord-Holland · 2 dagen geleden', thema: 'Regionale samenwerking', body: 'Amsterdam UMC en Dijklander Ziekenhuis zijn een samenwerking gestart voor een betere spoedzorgketen in Noord-Holland Noord. Het initiatief vloeit voort uit het IZA-uitvoeringsplan voor de regio en moet de doorstroom van acute patiënten verbeteren en onnodige SEH-bezoeken reduceren.' },
    { title: 'Wethouder: meer investeringen in wijkverpleging nodig in regio', meta: 'Noord-Holland · 4 dagen geleden', thema: 'Capaciteitsdruk', body: 'De wethouder Zorg van Amsterdam heeft gepleit voor substantiële extra investeringen in wijkverpleging. De wachtlijsten in de regio zijn het afgelopen jaar met 18% gestegen, terwijl de capaciteit nauwelijks is toegenomen.' },
    { title: 'Transferpunt Noord-Holland West van start gegaan', meta: 'Noord-Holland · 1 week geleden', thema: 'Regionale samenwerking', body: 'Een nieuw regionaal transferpunt voor Noord-Holland West is operationeel. Het punt coördineert de doorstroom van patiënten uit ziekenhuizen naar thuiszorg en verpleeghuizen, en moet de gemiddelde ligduur in ziekenhuizen met twee dagen bekorten.' },
  ],
  'Zuid-Holland':  [
    { title: 'Regio Rijnmond sluit samenwerkingsconvenant acute zorg', meta: 'Zuid-Holland · 1 dag geleden', thema: 'Regionale samenwerking', body: 'Zeven zorgorganisaties in de regio Rijnmond hebben een samenwerkingsconvenant ondertekend voor de acute zorg. Het akkoord regelt de verdeling van complexe spoedeisende gevallen tussen de aangesloten ziekenhuizen.' },
    { title: 'Haagse zorgorganisaties starten pilot zorgcoördinatie-app', meta: 'Zuid-Holland · 3 dagen geleden', thema: 'Digitalisering', body: 'Acht Haagse zorgorganisaties starten een gezamenlijke pilot met een digitale zorgcoördinatie-app. De app moet de overdracht tussen ziekenhuizen, huisartsen en wijkverpleging stroomlijnen.' },
  ],
  'Utrecht': [
    { title: 'UMC Utrecht en huisartsen starten wachtlijstoverleg', meta: 'Utrecht · Vandaag', thema: 'Capaciteitsdruk', body: 'UMC Utrecht is een structureel overleg gestart met de huisartsenorganisaties in de regio over wachtlijstmanagement. Het overleg moet leiden tot betere afspraken over verwijzingen en terugverwijzing.' },
    { title: 'Provincie Utrecht investeert in regionale GGZ-samenwerking', meta: 'Utrecht · 2 dagen geleden', thema: 'Regionale samenwerking', body: 'De provincie Utrecht trekt 4,2 miljoen euro uit voor het versterken van de regionale GGZ-samenwerking. Het geld wordt besteed aan een gezamenlijk crisisinterventie-team en een regionale wachttijstenbeurs.' },
  ],
  'Noord-Brabant': [{ title: 'Brabantse ziekenhuizen testen gezamenlijk capaciteitsmodel', meta: 'Noord-Brabant · 3 dagen geleden', thema: 'Capaciteitsdruk', body: 'Acht Brabantse ziekenhuizen testen een gezamenlijk capaciteitsplanningsmodel dat real-time inzicht geeft in beschikbare bedden en operatiekamercapaciteit in de regio.' }],
  'Gelderland':    [{ title: 'Gelderse zorgaanbieders lanceren regioplatform arbeidsmarkt', meta: 'Gelderland · Gisteren', thema: 'Arbeidsmarkt', body: 'Dertig Gelderse zorgorganisaties hebben een gezamenlijk arbeidsmarktplatform gelanceerd. Via het platform kunnen medewerkers flexibel tussen de deelnemende organisaties werken.' }],
  'Overijssel':    [{ title: 'ZGT en MST bundelen krachten in regio Oost', meta: 'Overijssel · 2 dagen geleden', thema: 'Regionale samenwerking', body: 'Ziekenhuisgroep Twente (ZGT) en Medisch Spectrum Twente (MST) hebben een vergaande samenwerking aangekondigd voor de regio Oost-Nederland.' }],
  'Friesland':     [{ title: 'MCL en Tjongerschans: gecombineerde wachtlijstaanpak', meta: 'Friesland · 3 dagen geleden', thema: 'Capaciteitsdruk', body: 'Medisch Centrum Leeuwarden en Tjongerschans gaan wachtlijsten gezamenlijk aanpakken door capaciteit te delen voor electieve ingrepen.' }],
  'Groningen':     [{ title: 'UMCG lanceert digitaal zorgnetwerk Noordoost-Nederland', meta: 'Groningen · Gisteren', thema: 'Digitalisering', body: 'Het UMCG heeft een digitaal zorgnetwerk gelanceerd dat zorgprofessionals in Groningen, Friesland en Drenthe verbindt voor telediagnostiek en consultatie op afstand.' }],
  'Zeeland':       [{ title: 'Adrz en gemeenten starten pilot bereikbaarheid ouderenzorg', meta: 'Zeeland · 4 dagen geleden', thema: 'Passende zorg', body: 'Admiraal De Ruyter Ziekenhuis en drie Zeeuwse gemeenten starten een pilot om de zorgbereikbaarheid voor ouderen in dunbevolkte gebieden te verbeteren.' }],
  'Limburg':       [{ title: 'VieCuri en Zuyderland versterken samenwerking Midden-Limburg', meta: 'Limburg · 2 dagen geleden', thema: 'Regionale samenwerking', body: 'VieCuri Medisch Centrum en Zuyderland hebben afspraken gemaakt over de taakverdeling in Midden-Limburg voor complexe specialistische zorg.' }],
  'Drenthe':       [{ title: 'Treant Zorggroep en huisartsen starten regio-overleg capaciteit', meta: 'Drenthe · 3 dagen geleden', thema: 'Capaciteitsdruk', body: 'Treant Zorggroep en de Drentse huisartsenorganisaties zijn een structureel capaciteitsoverleg gestart om de doorstroom tussen de eerste en tweede lijn te verbeteren.' }],
  'Flevoland':     [{ title: 'MC Lelystad en partners werken aan regionale spoedketen', meta: 'Flevoland · 2 dagen geleden', thema: 'Regionale samenwerking', body: 'MC Lelystad werkt samen met huisartsenposten en de RAV aan een versterkte regionale spoedketen voor Flevoland.' }],
};

/* ══════════════════════════════════════
   OPGESLAGEN ARTIKELEN
══════════════════════════════════════ */
let savedArticleIds = new Set();

function toggleBookmark(id, btn) {
  const svg = btn.querySelector('svg');
  if (savedArticleIds.has(id)) {
    savedArticleIds.delete(id);
    btn.classList.remove('saved');
    btn.title = 'Opslaan voor later';
    if (svg) svg.setAttribute('fill', 'none');
  } else {
    savedArticleIds.add(id);
    btn.classList.add('saved');
    btn.title = 'Opgeslagen';
    if (svg) svg.setAttribute('fill', 'currentColor');
  }
  updateSavedCount();
}

function updateSavedCount() {
  const n = savedArticleIds.size;
  const chip = document.getElementById('stat-saved-chip');
  const el = document.getElementById('stat-saved');
  if (n > 0) { chip.style.display = 'flex'; el.textContent = n; }
  else { chip.style.display = 'none'; }
}

function renderOpgeslagen() {
  const grid = document.getElementById('opgeslagen-grid');
  grid.innerHTML = '';
  if (!savedArticleIds.size) {
    grid.innerHTML = `<div class="saved-empty" style="grid-column:1/-1">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      <p>Je hebt nog geen artikelen opgeslagen.<br>Gebruik het bladwijzer-icoon op een artikel.</p>
    </div>`;
    return;
  }
  [...savedArticleIds].forEach((id, i) => {
    const art = ARTICLES.find(a => a.id === id);
    if (art) buildArticleCard(grid, art, i);
  });
}

/* ══════════════════════════════════════
   NOTIFICATIES
══════════════════════════════════════ */
const NOTIFICATIONS = [];
let notifPanelOpen = false;

function buildNotifications() {
  // Genereer relevante notificaties op basis van geprioriteerde thema's
  const themas = profile.themas.slice(0, 3);
  const notifData = [
    { thema: themas[0] || 'Arbeidsmarkt', title: `Nieuw artikel: ${ARTICLES.find(a=>a.thema===(themas[0]||'Arbeidsmarkt'))?.title || 'Actueel nieuws'}`, meta: 'Zojuist', unread: true },
    { thema: themas[1] || 'Digitalisering', title: `Dossierupdate: ${themas[1] || 'Digitalisering'} — nieuwe analyse beschikbaar`, meta: '1 uur geleden', unread: true },
    { thema: profile.regio, title: `Regionieuws ${profile.regio}: nieuw samenwerkingsinitiatief`, meta: '3 uur geleden', unread: false },
    { thema: themas[2] || 'Financiering', title: `NZa publiceert nieuwe tarieven — relevant voor ${profile.sector}`, meta: 'Gisteren', unread: false },
  ];
  NOTIFICATIONS.length = 0;
  notifData.forEach(n => NOTIFICATIONS.push(n));
  renderNotifList();
  updateNotifDot();
}

function renderNotifList() {
  const list = document.getElementById('notif-list');
  list.innerHTML = '';
  if (!NOTIFICATIONS.length) {
    list.innerHTML = '<p style="padding:16px;color:var(--ink-muted);font-size:13px;text-align:center">Geen notificaties</p>';
    return;
  }
  NOTIFICATIONS.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = `notif-item${n.unread ? ' unread' : ''}`;
    el.innerHTML = `<div class="ni-dot${n.unread ? '' : ' read'}"></div><div class="ni-body"><div class="ni-title">${n.title}</div><div class="ni-meta">${n.thema} · ${n.meta}</div></div>`;
    el.onclick = () => { n.unread = false; el.classList.remove('unread'); el.querySelector('.ni-dot').classList.add('read'); updateNotifDot(); };
    list.appendChild(el);
  });
}

function updateNotifDot() {
  const dot = document.getElementById('notif-dot');
  const hasUnread = NOTIFICATIONS.some(n => n.unread);
  dot.style.display = hasUnread ? 'block' : 'none';
}

function toggleNotifPanel() {
  const popup = document.getElementById('notif-popup');
  notifPanelOpen = !notifPanelOpen;
  popup.classList.toggle('open', notifPanelOpen);
}

function markAllRead() {
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifList();
  updateNotifDot();
}

document.addEventListener('click', e => {
  if (notifPanelOpen && !e.target.closest('.notif-bell-wrap')) {
    document.getElementById('notif-popup').classList.remove('open');
    notifPanelOpen = false;
  }
});

/* ══════════════════════════════════════
   ZOEKFUNCTIE
══════════════════════════════════════ */
function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(() => document.getElementById('search-main-input').focus(), 50);
  doSearch('');
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('search-main-input').value = '';
}

function closeSearchOnOutside(e) {
  if (e.target === document.getElementById('search-overlay')) closeSearch();
}

function doSearch(q) {
  const results = document.getElementById('search-results');
  const query = q.toLowerCase().trim();
  if (!query) {
    results.innerHTML = '<div class="search-empty">Begin te typen om te zoeken in artikelen en dossiers</div>';
    return;
  }

  /* Artikelen zoeken */
  const artHits = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(query) ||
    a.excerpt.toLowerCase().includes(query) ||
    a.thema.toLowerCase().includes(query)
  ).slice(0, 6);

  /* Regioberichten zoeken (alle provincies) */
  const regioHits = [];
  Object.entries(REGIO_ITEMS).forEach(([regio, items]) => {
    items.forEach(item => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.body.toLowerCase().includes(query) ||
        regio.toLowerCase().includes(query)
      ) {
        regioHits.push({ ...item, regio });
      }
    });
  });
  const topRegioHits = regioHits.slice(0, 3);

  if (!artHits.length && !topRegioHits.length) {
    results.innerHTML = '<div class="search-empty">Geen resultaten gevonden voor "' + q + '"</div>';
    return;
  }
  results.innerHTML = '';
  artHits.forEach(a => {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = `<span class="sri-tag">${a.thema}</span><div><div class="sri-title">${a.title}</div><div class="sri-excerpt">${a.excerpt.substring(0,80)}…</div></div>`;
    el.onclick = () => { closeSearch(); openArtikel(a.id); };
    results.appendChild(el);
  });
  topRegioHits.forEach(item => {
    const el = document.createElement('div');
    el.className = 'search-result-item';
    el.innerHTML = `<span class="sri-tag" style="background:var(--amber-light);color:#92400E">${item.regio}</span><div><div class="sri-title">${item.title}</div><div class="sri-excerpt">${item.meta}</div></div>`;
    el.onclick = () => { closeSearch(); openRegioArtikel(item); };
    results.appendChild(el);
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

/* ══════════════════════════════════════
   WEKELIJKSE SAMENVATTING
══════════════════════════════════════ */
function renderWeeklySummary() {
  const themas = profile.themas.slice(0, 3);
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond';
  document.getElementById('ws-title').textContent = `${greeting} — dit speelt er deze week in jouw thema's`;
  const itemsEl = document.getElementById('ws-items');
  itemsEl.innerHTML = '';
  themas.forEach(t => {
    const arts = ARTICLES.filter(a => a.thema === t);
    const latest = arts[0];
    if (!latest) return;
    const el = document.createElement('div');
    el.className = 'ws-item';
    el.textContent = `${t}: "${latest.title.substring(0, 60)}${latest.title.length > 60 ? '…' : ''}"`;
    itemsEl.appendChild(el);
  });
}

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
    return;
  }

  const tc = e.target.closest('.theme-card');
  if (tc && !e.target.closest('.anders-add-btn')) {
    const val = tc.dataset.val;
    if (val === '__anders__') {
      tc.classList.toggle('selected');
      const wrap = document.getElementById('anders-thema');
      if (wrap) {
        wrap.style.display = tc.classList.contains('selected') ? 'flex' : 'none';
        if (tc.classList.contains('selected')) wrap.querySelector('input').focus();
      }
      return;
    }
    tc.classList.toggle('selected');
    if (tc.classList.contains('selected')) profile.themas.push(val);
    else profile.themas = profile.themas.filter(t => t !== val);
  }
});

document.addEventListener('input', e => {
  const inp = e.target.closest('.anders-input');
  if (inp && inp.dataset.key) profile[inp.dataset.key] = inp.value.trim() || null;
});

function addAndersThema() {
  const inp = document.getElementById('anders-thema-input');
  const val = inp.value.trim();
  if (!val || profile.themas.includes(val)) { inp.value = ''; return; }
  profile.themas.push(val);
  const list = document.getElementById('custom-themas-list');
  const chip = document.createElement('span');
  chip.className = 'custom-thema-chip';
  chip.innerHTML = `${val} <button onclick="removeAndersThema(this,'${val.replace(/'/g, "\\'")}')">×</button>`;
  list.appendChild(chip);
  inp.value = '';
  inp.focus();
  /* Start meteen ophalen zodat artikelen klaar staan zodra het dashboard opent */
  fetchCustomThemaArtikelen(val);
}

function removeAndersThema(btn, val) {
  profile.themas = profile.themas.filter(t => t !== val);
  btn.parentElement.remove();
}

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
    el.classList.toggle('done', num < n);
  });
}

/* ══════════════════════════════════════
   LOCALSTORAGE — profiel opslaan/laden
══════════════════════════════════════ */
const LS_KEY = 'mijnzorgvisie_profile_v1';

function saveProfile() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      functie: profile.functie,
      sector:  profile.sector,
      regio:   profile.regio,
      themas:  profile.themas,
    }));
  } catch (_) { /* private browsing */ }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    if (!saved.functie || !saved.sector || !saved.regio) return false;
    profile.functie = saved.functie;
    profile.sector  = saved.sector;
    profile.regio   = saved.regio;
    profile.themas  = Array.isArray(saved.themas) ? saved.themas : [];
    return true;
  } catch (_) { return false; }
}

function finishOnboarding() {
  if (profile.themas.length === 0) {
    document.querySelectorAll('.theme-card').forEach((tc, i) => {
      if (i < 2 && tc.dataset.val !== '__anders__') {
        tc.classList.add('selected');
        profile.themas.push(tc.dataset.val);
      }
    });
  }
  if (!profile.functie) profile.functie = 'Beleidsmedewerker';
  if (!profile.sector)  profile.sector  = 'VVT';
  if (!profile.regio)   profile.regio   = 'Noord-Holland';
  saveProfile();
  buildDashboard();
  document.getElementById('onboarding').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
}

function resetOnboarding() {
  localStorage.removeItem(LS_KEY);
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('onboarding').classList.add('active');
  /* reset profiel state */
  profile.functie = null; profile.sector = null; profile.regio = null; profile.themas = [];
  goStep(1);
}


/* ══════════════════════════════════════
   NAVIGATIE
══════════════════════════════════════ */
function navigateTo(page, linkEl) {
  if (linkEl) {
    event && event.preventDefault && event.preventDefault();
    // Topbar nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    // Mobile nav buttons
    document.querySelectorAll('.mn-item').forEach(l => l.classList.remove('active'));
    // Mark the clicked element
    if (linkEl.classList.contains('nav-link')) linkEl.classList.add('active');
    if (linkEl.classList.contains('mn-item')) {
      linkEl.classList.add('active');
      // Sync topbar
      const tl = document.querySelector(`.nav-link[data-page="${page}"]`);
      if (tl) tl.classList.add('active');
    } else {
      // Sync mobile
      const ml = document.querySelector(`.mn-item[data-page="${page}"]`);
      if (ml) ml.classList.add('active');
    }
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(`page-${page}`);
  if (pg) pg.classList.add('active');
  currentPage = page;
  if (page === 'artikelen')  renderArtikelenPagina();
  if (page === 'dossiers')   renderDossiers();
  if (page === 'agenda')     renderAgenda();
  if (page === 'opgeslagen') renderOpgeslagen();
  if (page === 'mijn-regio') renderMijnRegio();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
/* Initialen afleiden van functie + sector */
function getInitials() {
  const f = (profile.functie || 'Z').trim();
  const s = (profile.sector  || 'Z').trim();
  return (f[0] + s[0]).toUpperCase();
}

/* Naam afleiden: als functie/sector bekend, toon die combinatie anders fallback */
function getDisplayName() {
  return profile.functie ? profile.functie : 'Gebruiker';
}

function buildDashboard() {
  const initials = getInitials();
  document.getElementById('topbar-avatar').textContent  = initials;
  document.getElementById('sidebar-avatar').textContent = initials;
  document.getElementById('profile-name').textContent   = profile.functie || 'Mijn profiel';
  document.getElementById('profile-role').textContent   = `${profile.functie} · ${profile.sector}`;
  document.getElementById('regio-naam').textContent     = profile.regio;
  document.getElementById('stat-themas').textContent    = profile.themas.length;

  const artCount = ARTICLES.filter(a => profile.themas.includes(a.thema)).length || ARTICLES.length;
  document.getElementById('stat-artikelen').textContent = artCount;
  document.getElementById('welcome-count').textContent  = `${artCount} nieuwe artikelen`;

  /* Actuele dossiers = dossiers die overeenkomen met jouw thema's */
  const dossierCount = DOSSIERS.filter(d => profile.themas.includes(d.thema)).length || DOSSIERS.length;
  const dosEl = document.getElementById('stat-dossiers');
  if (dosEl) dosEl.textContent = dossierCount;

  const intro = document.getElementById('welcome-intro');
  if (intro) intro.style.display = sessionStorage.getItem('intro-dismissed') ? 'none' : 'flex';

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond';
  document.getElementById('welcome-title').textContent = `${greeting}, ${profile.functie || 'welkom'}`;

  renderThemeDragList();

  // Regio link
  const regio = profile.regio;
  const regioLink = document.getElementById('regio-more-link');
  if (regioLink) {
    regioLink.href = '#';
    regioLink.onclick = (e) => { e.preventDefault(); navigateTo('mijn-regio', document.querySelector('[data-page="mijn-regio"]')); };
  }

  /* Zet fetch in gang voor alle eigen thema's */
  profile.themas.filter(t => !KNOWN_THEMAS.has(t)).forEach(t => fetchCustomThemaArtikelen(t));

  renderWeeklySummary();
  renderArticles();
  renderDuiding();
  renderRegioPreview();
  renderRegio();
  buildNotifications();
}

/* ══════════════════════════════════════
   DASHBOARD — secties
══════════════════════════════════════ */
function renderArticles() {
  const grid = document.getElementById('articles-grid');
  grid.innerHTML = '';
  let list = ARTICLES.filter(a => profile.themas.includes(a.thema));
  const customThemas = profile.themas.filter(t => !KNOWN_THEMAS.has(t));
  /* Alleen fallback naar alle artikelen als de gebruiker géén custom thema's heeft */
  if (!list.length && !customThemas.length) list = ARTICLES;
  if (priorityTheme) list = [...list.filter(a => a.thema === priorityTheme), ...list.filter(a => a.thema !== priorityTheme)];
  list.slice(0, 8).forEach((art, i) => buildArticleCard(grid, art, i));
  customThemas.forEach((t, i) => buildCustomThemePlaceholder(grid, t, list.length + i));
}

function renderDuiding() {
  const row = document.getElementById('duiding-row');
  row.innerHTML = '';
  profile.themas.forEach((t, i) => {
    const d = DUIDING[t]; if (!d) return;
    const card = document.createElement('div');
    card.className = 'duiding-card';
    card.style.animationDelay = `${i * 65}ms`;
    const iconSvg = THEME_ICONS[t] || '';
    card.innerHTML = `
      <div class="dc-header">
        <div class="dc-icon-wrap">${iconSvg}</div>
        <div><div class="dc-theme-name">${t}</div><div class="dc-label">Achtergrond &amp; context</div></div>
      </div>
      <div class="dc-body">
        <p class="dc-text">${d.text}</p>
        <span class="dc-cta">Bekijk artikelen →</span>
      </div>`;
    card.style.cursor = 'pointer';
    card.onclick = () => {
      artikelenFilter.thema = t;
      document.getElementById('filter-pills').innerHTML = '';
      navigateTo('artikelen', document.querySelector('[data-page="artikelen"]'));
    };
    row.appendChild(card);
  });
}

function renderRegioPreview() {
  const el = document.getElementById('regio-preview-grid');
  if (!el) return;
  el.innerHTML = '';
  const regio = profile.regio;
  const signalen = REGIO_SIGNALEN[regio] || {};
  const themas = profile.themas.filter(t => signalen[t]).slice(0, 4);
  if (!themas.length) {
    el.innerHTML = '<p style="color:var(--ink-muted);font-size:14px">Geen signalen beschikbaar voor jouw regio.</p>';
    return;
  }
  themas.forEach((t, i) => {
    const s = signalen[t];
    const card = document.createElement('div');
    card.className = 'rp-item';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="rp-header">
        <span class="rp-thema">${t}</span>
        <span class="ts-niveau ${s.niveau}">${s.niveau.charAt(0).toUpperCase() + s.niveau.slice(1)}</span>
      </div>
      <p class="rp-signaal">${s.signaal}</p>`;
    card.onclick = () => navigateTo('mijn-regio', document.querySelector('[data-page="mijn-regio"]'));
    el.appendChild(card);
  });
}

function renderRegio() {
  const section = document.getElementById('regio-section');
  const list    = document.getElementById('regio-list');
  list.innerHTML = '';
  if (!regioFilterOn) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  const items = REGIO_ITEMS[profile.regio] || [];
  if (!items.length) {
    list.innerHTML = '<p style="color:var(--ink-muted);font-size:14px">Geen regionale berichten gevonden.</p>';
    return;
  }
  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'regio-item';
    el.style.animationDelay = `${i * 60}ms`;
    el.innerHTML = `
      <div class="ri-pin">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
      <div class="ri-body">
        <div class="ri-thema-tag">${item.thema || profile.regio}</div>
        <div class="ri-title">${item.title}</div>
        <div class="ri-meta">${item.meta}</div>
      </div>
      <div class="ri-chevron">→</div>`;
    el.onclick = () => openRegioArtikel(item);
    list.appendChild(el);
  });
}

function openRegioArtikel(item) {
  prevPage = currentPage;
  const el = document.getElementById('article-detail-content');
  el.innerHTML = `
    <span class="ad-tag" style="background:var(--amber-light);color:#92400E">${item.thema || profile.regio}</span>
    <h1 class="ad-title">${item.title}</h1>
    <div class="ad-meta">
      <span>${item.meta}</span>
      <span>Redactie Zorgvisie</span>
    </div>
    <div class="ad-body"><p>${item.body}</p></div>`;
  document.getElementById('detail-back-btn').onclick = () => navigateTo(prevPage, document.querySelector(`[data-page="${prevPage}"]`));
  navigateTo('artikel-detail', null);
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === prevPage));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   ARTIKEL CARD — met bladwijzer
══════════════════════════════════════ */
function buildArticleCard(container, art, index) {
  const color = THEME_COLORS[art.thema] || '#888888';
  const card  = document.createElement('div');
  card.className = 'article-card';
  card.style.animationDelay = `${index * 55}ms`;
  const isSaved = savedArticleIds.has(art.id);
  card.innerHTML = `
    ${art.img ? `<img class="ac-image" src="${art.img}" alt="${art.title}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/art${art.id}/800/400'">` : ''}
    <button class="bookmark-btn${isSaved ? ' saved' : ''}" title="${isSaved ? 'Opgeslagen' : 'Opslaan voor later'}" onclick="event.stopPropagation(); toggleBookmark(${art.id}, this)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    </button>
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

const ZORG_FOTOS = [
  'photo-1559757148-5c350d0d3c56', 'photo-1584432810601-6c7f27d2362b',
  'photo-1576091160550-2173dba999ef', 'photo-1504813184591-01572f98c85f',
  'photo-1579684385127-1571037e9d45', 'photo-1530026186672-2cd00ffc50d1',
  'photo-1576671081837-5c4ab9c07dba', 'photo-1516841273335-e39b37888115',
];

/* ══════════════════════════════════════
   LIVE ARTIKELEN VOOR EIGEN THEMA'S
══════════════════════════════════════ */

async function fetchCustomThemaArtikelen(thema) {
  if (customThemaCache[thema] !== undefined) return; /* al opgehaald */
  if (customThemaLoading[thema]) return;             /* bezig */
  customThemaLoading[thema] = true;

  /* --- Poging 1: Rijksoverheid Open Data API (juiste endpoint & response) --- */
  try {
    const q = encodeURIComponent(thema + ' zorg');
    const rUrl = `https://opendata.rijksoverheid.nl/v1/infotypes/newsarticle/?output=json&rows=5&q=${q}`;
    const rRes = await fetch(rUrl, { signal: AbortSignal.timeout(7000) });
    if (rRes.ok) {
      const data = await rRes.json();
      /* Rijksoverheid geeft { content: [...], total: N, ... } terug */
      const items = data.content || (Array.isArray(data) ? data : []);
      if (items.length > 0) {
        customThemaCache[thema] = items.slice(0, 5).map(item => ({
          title:   item.title || 'Artikel',
          excerpt: (item.introduction || item.intro || item.shortintro || '')
                     .replace(/<[^>]+>/g, '').substring(0, 220).trim(),
          url:     item.url
                     ? (item.url.startsWith('http') ? item.url : `https://www.rijksoverheid.nl${item.url}`)
                     : 'https://www.rijksoverheid.nl',
          datum:   item.lastmodified
                     ? new Date(item.lastmodified).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
                     : item.publicationdate
                       ? new Date(item.publicationdate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
                       : 'Recent',
          source:  'Rijksoverheid.nl',
          thema,
        }));
        customThemaLoading[thema] = false;
        _refreshCustomThema(thema);
        return;
      }
    }
  } catch (_) { /* door naar volgende bron */ }

  /* --- Poging 2: Wikipedia NL met verrijkte samenvattingen --- */
  try {
    const wUrl = `https://nl.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(thema + ' zorg Nederland')}&format=json&origin=*&srlimit=6&utf8=1`;
    const wRes = await fetch(wUrl, { signal: AbortSignal.timeout(7000) });
    const wData = await wRes.json();
    const hits = (wData.query?.search || []).slice(0, 4);

    /* Haal voor elk resultaat een uitgebreidere samenvatting op via de summary API */
    const enriched = await Promise.all(hits.map(async (r) => {
      let excerpt = r.snippet.replace(/<[^>]+>/g, '').trim();
      let datum   = 'Wikipedia';
      try {
        const sumRes = await fetch(
          `https://nl.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.title)}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (sumRes.ok) {
          const sum = await sumRes.json();
          if (sum.extract) excerpt = sum.extract.substring(0, 240).trimEnd() + '…';
          if (sum.timestamp) {
            datum = new Date(sum.timestamp).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        }
      } catch (_) { /* gebruik search snippet als fallback */ }
      return {
        title:   r.title,
        excerpt,
        url:     `https://nl.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
        datum,
        source:  'Wikipedia NL',
        thema,
      };
    }));

    customThemaCache[thema] = enriched.filter(a => a.title);
  } catch (_) {
    customThemaCache[thema] = [];
  }

  customThemaLoading[thema] = false;
  _refreshCustomThema(thema);
}

function _refreshCustomThema(thema) {
  renderArticles();
  if (currentPage === 'artikelen') renderArtikelenGrid();
}

function buildCustomThemePlaceholder(container, thema, index) {
  const arts    = customThemaCache[thema];
  const loading = customThemaLoading[thema];

  /* Nog niet opgehaald — start fetch en toon skeleton */
  if (!arts && !loading) fetchCustomThemaArtikelen(thema);

  /* === SKELETON (laden) === */
  if (!arts) {
    const card = document.createElement('div');
    card.className = 'article-card custom-loading-card';
    card.dataset.thema = thema;
    card.style.animationDelay = `${index * 55}ms`;
    card.innerHTML = `
      <div class="ac-image clc-skeleton"></div>
      <div class="ac-stripe" style="background:#E0E0E0"></div>
      <div class="ac-body">
        <div class="ac-top"><span class="ac-tag" style="background:#f3f4f6;color:#888">${thema}</span></div>
        <div class="clc-bar" style="width:80%"></div>
        <div class="clc-bar" style="width:60%"></div>
        <div class="clc-bar" style="width:40%;margin-top:10px"></div>
        <p style="font-size:12px;color:var(--ink-muted);margin-top:6px">Artikelen ophalen…</p>
      </div>`;
    container.appendChild(card);
    return;
  }

  /* === GEEN RESULTATEN === */
  if (arts.length === 0) {
    const foto = ZORG_FOTOS[(thema.length + index) % ZORG_FOTOS.length];
    const card = document.createElement('div');
    card.className = 'article-card';
    card.style.animationDelay = `${index * 55}ms`;
    card.innerHTML = `
      <img class="ac-image" src="https://images.unsplash.com/${foto}?w=800&h=400&fit=crop&q=80" alt="${thema}" loading="lazy">
      <div class="ac-stripe" style="background:#6B7280"></div>
      <div class="ac-body">
        <div class="ac-top"><span class="ac-tag" style="background:#f3f4f6;color:#6B7280">${thema}</span></div>
        <div class="ac-title">Geen openbare artikelen gevonden</div>
        <div class="ac-excerpt">Voor "${thema}" zijn momenteel geen openbare artikelen beschikbaar. Probeer een iets andere zoekterm.</div>
        <div class="ac-footer"><span class="ac-date" style="color:var(--ink-muted)">Geen resultaten</span></div>
      </div>`;
    container.appendChild(card);
    return;
  }

  /* === ECHTE RESULTATEN === */
  arts.forEach((art, i) => {
    const foto = ZORG_FOTOS[(thema.length + index + i) % ZORG_FOTOS.length];
    const card = document.createElement('div');
    card.className = 'article-card external-article';
    card.style.animationDelay = `${(index + i) * 55}ms`;
    card.title = `Opent ${art.source} in nieuw tabblad`;
    card.innerHTML = `
      <img class="ac-image" src="https://images.unsplash.com/${foto}?w=800&h=400&fit=crop&q=80" alt="${art.title}" loading="lazy"
           onerror="this.onerror=null;this.src='https://picsum.photos/seed/${encodeURIComponent(thema)}${i}/800/400'">
      <div class="ac-stripe" style="background:#0369A1"></div>
      <div class="ac-body">
        <div class="ac-top">
          <span class="ac-tag" style="background:#EFF6FF;color:#0369A1">${thema}</span>
          <span class="ac-source-badge">${art.source}</span>
        </div>
        <div class="ac-title">${art.title}</div>
        <div class="ac-excerpt">${art.excerpt}</div>
        <div class="ac-footer">
          <span class="ac-date">${art.datum}</span>
          <span class="ac-arrow">Lees meer →</span>
        </div>
      </div>`;
    card.onclick = () => window.open(art.url, '_blank', 'noopener');
    container.appendChild(card);
  });
}

/* ══════════════════════════════════════
   ARTIKEL DETAIL
══════════════════════════════════════ */
function openArtikel(id) {
  const art = ARTICLES.find(a => a.id === id);
  if (!art) return;
  prevPage = currentPage;
  const color = THEME_COLORS[art.thema] || '#888888';
  const ctx   = ARTIKEL_CONTEXT[art.thema];
  const relevantText = ctx?.relevant?.[profile.functie] || ctx?.relevant?.['Beleidsmedewerker'] || 'Dit onderwerp is relevant voor jouw werkpraktijk in de zorg.';

  let duidingHtml = '';
  if (ctx) {
    const iconSvg = THEME_ICONS[art.thema] || '';
    duidingHtml = `
    <div class="ad-duiding-blok">
      <div class="adb-header">
        <span class="adb-icon" style="color:var(--red)">${iconSvg}</span>
        <div>
          <div class="adb-title">Thematische duiding voor jou</div>
          <div class="adb-sub">${profile.functie || 'Professional'} · ${profile.sector || 'Zorg'}</div>
        </div>
      </div>
      <div class="adb-body">
        <div class="adb-item"><div class="adb-item-label">Wat speelt er</div><div class="adb-item-text">${ctx.speelt}</div></div>
        <div class="adb-divider"></div>
        <div class="adb-item"><div class="adb-item-label">Waarom relevant voor jou</div><div class="adb-item-text">${relevantText}</div></div>
        <div class="adb-divider"></div>
        <div class="adb-item"><div class="adb-item-label">Wat dit kan betekenen</div><div class="adb-item-text">${ctx.betekenis}</div></div>
      </div>
    </div>`;
  }

  const el = document.getElementById('article-detail-content');
  const isSaved = savedArticleIds.has(art.id);
  el.innerHTML = `
    ${art.img ? `<img class="ad-hero" src="${art.img}" alt="${art.title}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/art${art.id}/800/400'">` : ''}
    <span class="ad-tag" style="background:${color}20;color:${color}">${art.thema}</span>
    <h1 class="ad-title">${art.title}</h1>
    <div class="ad-meta">
      <span>📅 ${art.datum}</span>
      <span>⏱ ${art.minuten} min leestijd</span>
      <span>Redactie Zorgvisie</span>
      <button onclick="toggleBookmark(${art.id}, this)" class="bookmark-btn" style="position:static;opacity:1;width:auto;height:auto;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:5px;${isSaved ? 'background:var(--red-light);border-color:var(--red);color:var(--red)' : ''}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        ${isSaved ? 'Opgeslagen' : 'Opslaan'}
      </button>
    </div>
    <div class="ad-body">${art.body}</div>
    ${duidingHtml}
    <div class="ad-related">
      <div class="ad-related-title">Gerelateerde artikelen</div>
      <div class="ad-related-grid" id="related-grid"></div>
    </div>`;

  const related = ARTICLES.filter(a => a.thema === art.thema && a.id !== id).slice(0, 3);
  related.forEach((a, i) => buildArticleCard(document.getElementById('related-grid'), a, i));

  document.getElementById('detail-back-btn').onclick = () => navigateTo(prevPage,
    document.querySelector(`[data-page="${prevPage}"]`));
  navigateTo('artikel-detail', null);
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === prevPage));
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   ARTIKELEN PAGINA
══════════════════════════════════════ */
function renderArtikelenPagina() {
  const pillsEl = document.getElementById('filter-pills');
  if (!pillsEl.children.length) {
    const alleBtn = document.createElement('button');
    alleBtn.className = 'filter-pill active';
    alleBtn.textContent = 'Alle onderwerpen';
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

  /* Eigen thema gefilterd — toon alleen live opgehaalde artikelen */
  if (artikelenFilter.thema && !KNOWN_THEMAS.has(artikelenFilter.thema)) {
    buildCustomThemePlaceholder(grid, artikelenFilter.thema, 0);
    return;
  }

  const customThemas = profile.themas.filter(t => !KNOWN_THEMAS.has(t));
  let list = ARTICLES.filter(a => profile.themas.includes(a.thema));
  /* Alleen fallback naar alle artikelen als de gebruiker géén custom thema's heeft */
  if (!list.length && !customThemas.length) list = ARTICLES;
  if (artikelenFilter.thema) list = list.filter(a => a.thema === artikelenFilter.thema);
  if (artikelenFilter.zoek)  list = list.filter(a =>
    a.title.toLowerCase().includes(artikelenFilter.zoek) ||
    a.excerpt.toLowerCase().includes(artikelenFilter.zoek));
  if (!list.length && !customThemas.length) {
    grid.innerHTML = '<p style="color:var(--ink-muted);font-size:14px;grid-column:1/-1">Geen artikelen gevonden. Kies een ander onderwerp of zoekterm.</p>';
    return;
  }
  list.forEach((art, i) => buildArticleCard(grid, art, i));
  if (!artikelenFilter.thema) customThemas.forEach((t, i) => buildCustomThemePlaceholder(grid, t, list.length + i));
}

/* ══════════════════════════════════════
   DOSSIERS — met SVG iconen
══════════════════════════════════════ */
function renderDossiers() {
  const grid = document.getElementById('dossiers-grid');
  if (grid.children.length) return;
  DOSSIERS.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'dossier-card';
    card.style.animationDelay = `${i * 60}ms`;
    const iconSvg = THEME_ICONS[d.thema] || '';
    const color = THEME_COLORS[d.thema] || '#CC0000';
    card.innerHTML = `
      <div class="ac-stripe" style="background:${color}"></div>
      <div class="dos-header">
        <div class="dos-icon-wrap">${iconSvg}</div>
        <span class="dos-count">${d.artikelen} artikelen</span>
      </div>
      <div class="dos-body">
        <div class="dos-tag">${d.thema}</div>
        <div class="dos-title">${d.title}</div>
        <div class="dos-desc">${d.desc}</div>
        <div class="dos-footer"><span class="dos-updated">${d.updated}</span><span class="dos-link">Bekijk dossier →</span></div>
      </div>`;
    card.onclick = () => {
      if (!profile.themas.includes(d.thema)) profile.themas.push(d.thema);
      artikelenFilter.thema = d.thema;
      document.getElementById('filter-pills').innerHTML = '';
      navigateTo('artikelen', document.querySelector('[data-page="artikelen"]'));
    };
    grid.appendChild(card);
  });
}

/* ══════════════════════════════════════
   AGENDA
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
      <div class="ag-body"><div class="ag-type">${ev.type}</div><div class="ag-title">${ev.title}</div><div class="ag-meta">${ev.meta}</div></div>
      <span class="ag-badge ${ev.badge}">${ev.type}</span>`;
    list.appendChild(el);
  });
}

/* ══════════════════════════════════════
   OVERIGE FUNCTIES
══════════════════════════════════════ */
function dismissIntro() {
  const el = document.getElementById('welcome-intro');
  if (el) el.style.display = 'none';
  sessionStorage.setItem('intro-dismissed', '1');
}

function toggleRegioFilter(on) {
  regioFilterOn = on;
  renderRegio();
  document.getElementById('welcome-sub').innerHTML = on
    ? `Je hebt <strong id="welcome-count">${document.getElementById('stat-artikelen').textContent} nieuwe artikelen</strong> op basis van jouw profiel.`
    : 'Regiofilter staat uit — je ziet landelijk nieuws.';
}

function setPriority(val) {
  priorityTheme = val || null;
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

/* ══════════════════════════════════════
   TOOLTIP
══════════════════════════════════════ */
function showTooltip(event, text) {
  const tip = document.getElementById('app-tooltip');
  if (!tip) return;
  tip.textContent = text;
  tip.style.display = 'block';
  const r = event.target.getBoundingClientRect();
  const w = 240;
  let left = r.left + r.width / 2 - w / 2;
  let top  = r.bottom + 8;
  if (left < 8) left = 8;
  if (left + w > window.innerWidth - 8) left = window.innerWidth - 8 - w;
  if (top + 80 > window.innerHeight) top = r.top - 80;
  tip.style.left  = left + 'px';
  tip.style.top   = top  + 'px';
  tip.style.width = w    + 'px';
  event.stopPropagation();
}
document.addEventListener('click', () => {
  const tip = document.getElementById('app-tooltip');
  if (tip) tip.style.display = 'none';
});

/* ══════════════════════════════════════
   DRAG-AND-DROP THEMA RANKING
══════════════════════════════════════ */
let dragSrcIdx = null;

function renderThemeDragList() {
  const list = document.getElementById('theme-drag-list');
  if (!list) return;
  list.innerHTML = '';
  profile.themas.forEach((t, i) => {
    const iconSvg = THEME_ICONS[t] || '';
    const item = document.createElement('div');
    item.className = 'tdl-item';
    item.draggable = true;
    item.dataset.idx = i;
    item.innerHTML = `
      <span class="tdl-rank">${i + 1}</span>
      <span class="tdl-icon">${iconSvg}</span>
      <span class="tdl-name">${t}</span>
      <svg class="tdl-handle" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <line x1="9" y1="5" x2="21" y2="5"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="19" x2="21" y2="19"/>
        <circle cx="4" cy="5" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="19" r="1" fill="currentColor"/>
      </svg>`;
    item.addEventListener('dragstart', e => {
      dragSrcIdx = i;
      e.dataTransfer.effectAllowed = 'move';
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      list.querySelectorAll('.tdl-item').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('drag-over'); });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', e => {
      e.preventDefault();
      item.classList.remove('drag-over');
      const toIdx = parseInt(item.dataset.idx);
      if (dragSrcIdx === null || dragSrcIdx === toIdx) return;
      const moved = profile.themas.splice(dragSrcIdx, 1)[0];
      profile.themas.splice(toIdx, 0, moved);
      dragSrcIdx = null;
      renderThemeDragList();
      renderArticles();
      if (profile.themas[0]) setPriority(profile.themas[0]);
    });
    list.appendChild(item);
  });
}

/* ══════════════════════════════════════
   MIJN REGIO — DATA
══════════════════════════════════════ */
const ALLE_REGIO_NAMEN = ['Noord-Holland','Zuid-Holland','Utrecht','Noord-Brabant','Gelderland','Overijssel','Friesland','Groningen','Zeeland','Limburg','Drenthe','Flevoland'];

const REGIO_SIGNALEN = {
  'Noord-Holland':  { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Ernstige tekorten in VVT en GGZ; inhuurkosten 22% boven landelijk gemiddelde.' }, 'Passende zorg': { niveau:'middel', signaal:'IZA-plan loopt; 3 gemeenten stapten uit wegens governance-conflicten.' }, 'Digitalisering': { niveau:'hoog', signaal:'Amsterdam UMC leidt AI-pilots; ongelijke digitale volwassenheid in regio.' }, 'Capaciteitsdruk': { niveau:'hoog', signaal:'SEH-wachttijden overschrijden structureel 4-uursnorm in Amsterdam.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'Transferpunt NH-West gestart; uitrol vertraagd door bestuurlijke afstemming.' }, 'Financiering': { niveau:'middel', signaal:'Ziekenhuizen rapporteren gemiddeld 3,8% tekort door loonkosten en NZa-plafond.' } },
  'Zuid-Holland':   { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Haagse en Rotterdamse zorg kampen met structureel verzuim boven 8%.' }, 'Passende zorg': { niveau:'hoog', signaal:'Rijnmond-convenant acute zorg ondertekend; substitutieopgave voor 2027 groot.' }, 'Digitalisering': { niveau:'middel', signaal:'Pilot zorgcoördinatie-app in Den Haag loopt; opschaling onduidelijk.' }, 'Capaciteitsdruk': { niveau:'hoog', signaal:'Wachtlijsten GGZ en ouderenzorg groeien harder dan landelijk gemiddelde.' }, 'Regionale samenwerking': { niveau:'hoog', signaal:'Sterke samenwerking Rijnmond-regio; Haagse regio minder ver.' }, 'Financiering': { niveau:'hoog', signaal:'Erasmus MC meldt €18M tekort; kleinere VVT-instellingen onder liquiditeitsdruk.' } },
  'Utrecht':        { 'Arbeidsmarkt': { niveau:'middel', signaal:'Tekorten merkbaar, maar UMC Utrecht trekt goed aan; zijinstroom stijgt.' }, 'Passende zorg': { niveau:'laag', signaal:'Landelijk voorbeeldregio: 7 zorgpartijen en 3 gemeenten met breed IZA-plan.' }, 'Digitalisering': { niveau:'middel', signaal:'FHIR-implementatie loopt bij UMC; kleinere instellingen in achterstand.' }, 'Capaciteitsdruk': { niveau:'middel', signaal:'UMC en huisartsen starten wachtlijstoverleg; GGZ nog knelpunt.' }, 'Regionale samenwerking': { niveau:'laag', signaal:'Provincie investeert €4,2M in regionale GGZ-samenwerking en crisisteam.' }, 'Financiering': { niveau:'middel', signaal:'Financieel gezond, maar reserves nemen af door gestegen energiekosten.' } },
  'Noord-Brabant':  { 'Arbeidsmarkt': { niveau:'middel', signaal:'Brabantse ziekenhuizen testen gezamenlijk capaciteitsmodel voor flex-roosters.' }, 'Passende zorg': { niveau:'middel', signaal:'Pilot uitkomstbekostiging Eindhoven toont 8% minder ziekenhuisopnames.' }, 'Digitalisering': { niveau:'middel', signaal:'Catharina Ziekenhuis loopt voor op AI in diagnostiek; regio volgt versneld.' }, 'Capaciteitsdruk': { niveau:'hoog', signaal:'Acht ziekenhuizen testen gezamenlijk real-time capaciteitsmodel.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'IZA-uitvoeringsplan goedgekeurd; focus op eerste lijn en preventie.' }, 'Financiering': { niveau:'middel', signaal:'Tariefstijging dekt 60% van loonkostenstijging; reservepositie verslechtert.' } },
  'Gelderland':     { 'Arbeidsmarkt': { niveau:'middel', signaal:'30 organisaties lanceerden gezamenlijk arbeidsmarktplatform voor flex-inzet.' }, 'Passende zorg': { niveau:'middel', signaal:'Nijmegen loopt voor met regionaal zorgcoördinatiepunt; 12% minder dubbele contacten.' }, 'Digitalisering': { niveau:'laag',   signaal:'Radboudumc trekt regio mee in data-uitwisseling; FHIR-adoptie bovengemiddeld.' }, 'Capaciteitsdruk': { niveau:'middel', signaal:'Wachtlijsten specialistische GGZ structureel te lang; actieplan in voorbereiding.' }, 'Regionale samenwerking': { niveau:'laag', signaal:'IZA-netwerk Oost meest volwassen buiten Randstad; leidend op governance.' }, 'Financiering': { niveau:'laag', signaal:'Financieel stabielst van de oostelijke provincies; solide reserveposities.' } },
  'Overijssel':     { 'Arbeidsmarkt': { niveau:'middel', signaal:'ZGT en MST bundelen krachten; gedeelde werving voor verpleging.' }, 'Passende zorg': { niveau:'middel', signaal:'Twente-regio test netwerkzorg model voor chronische aandoeningen.' }, 'Digitalisering': { niveau:'middel', signaal:'MST EPD-migratie succesvol; ZGT volgt in 2027.' }, 'Capaciteitsdruk': { niveau:'laag',   signaal:'Lage bevolkingsdichtheid geeft relatief meer speelruimte; minder SEH-druk.' }, 'Regionale samenwerking': { niveau:'laag',  signaal:'ZGT-MST-samenwerking geldt als best practice voor fusieloos samenwerken.' }, 'Financiering': { niveau:'middel', signaal:'Marge krap maar stabiel; beide ziekenhuizen hanteren voorzichtig investeringsbeleid.' } },
  'Friesland':      { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Krimp beroepsbevolking versnelt tekort; dunne bevolking maakt werving kostbaar.' }, 'Passende zorg': { niveau:'middel', signaal:'MCL en Tjongerschans combineren wachtlijstaanpak voor electieve ingrepen.' }, 'Digitalisering': { niveau:'middel', signaal:'Telezorg in dunbevolkte gebieden groeit; infrastructuur soms beperkend.' }, 'Capaciteitsdruk': { niveau:'hoog',   signaal:'Leeuwarden heeft regionaal monopolie; wachttijden stijgen bij krimp aanbod.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'MCL-Tjongerschans-samenwerking stabiel; toevoegen Drachten in bespreking.' }, 'Financiering': { niveau:'hoog', signaal:'Dunbevolkt aanbod = hogere kosten per patiënt; bekostiging niet aangepast.' } },
  'Groningen':      { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Krimp én vergrijzing creëren dubbele druk; UMCG-vertrek groot risico.' }, 'Passende zorg': { niveau:'laag',   signaal:'UMCG zet in op regionetwerk telediagnostiek; substitutie van specialistenzorg.' }, 'Digitalisering': { niveau:'laag',   signaal:'UMCG lanceert digitaal zorgnetwerk Noordoost voor telediagnostiek.' }, 'Capaciteitsdruk': { niveau:'middel', signaal:'Zorgcapaciteit geconcentreerd in Groningen-stad; platteland onderbedeeld.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'Drents-Gronings overleg actief; samenwerking moeizaam door provinciale grenzen.' }, 'Financiering': { niveau:'hoog',   signaal:'Structurele bekostigingsnadelen voor dunbevolkte regio nog niet opgelost in NZa-model.' } },
  'Zeeland':        { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Kleinste zorgarbeidsmarkt van NL; werving uit andere provincies noodzakelijk.' }, 'Passende zorg': { niveau:'middel', signaal:'Adrz en gemeenten starten pilot bereikbaarheid ouderenzorg in dunne gebieden.' }, 'Digitalisering': { niveau:'middel', signaal:'Pilot uitkomstbekostiging chronische zorg toont veelbelovende eerste resultaten.' }, 'Capaciteitsdruk': { niveau:'hoog',   signaal:'Adrz enige ziekenhuis; geen uitwijkmogelijkheid bij piekbelasting.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'Samenwerking Zeeland-Brabant in acute zorg in voorbereiding.' }, 'Financiering': { niveau:'hoog',   signaal:'Monopoliepositie Adrz én krappe bevolkingsbasis leiden tot structureel kostenniveau.' } },
  'Limburg':        { 'Arbeidsmarkt': { niveau:'hoog',   signaal:'Krimp en vergrijzing bevolking leidt tot dalende instroom zorgopleidingen.' }, 'Passende zorg': { niveau:'middel', signaal:'VieCuri en Zuyderland spreken taakverdeling af; specialisatie vervangt duplicatie.' }, 'Digitalisering': { niveau:'middel', signaal:'Mutsaersstichting GGZ loopt voor op e-health; Zuyderland volgt langzaam.' }, 'Capaciteitsdruk': { niveau:'hoog',   signaal:'GGZ-wachtlijsten in Limburg hoogst van alle provincies buiten Randstad.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'VieCuri-Zuyderland-akkoord Midden-Limburg als voorbeeld voor specialisatie.' }, 'Financiering': { niveau:'hoog',   signaal:'Meeste Limburgse instellingen opereren al jaren met negatieve marge.' } },
  'Drenthe':        { 'Arbeidsmarkt': { niveau:'middel', signaal:'Treant Zorggroep kampt met structureel tekort verpleegkundigen; verzuim hoog.' }, 'Passende zorg': { niveau:'middel', signaal:'Treant en huisartsen starten capaciteitsoverleg voor betere doorstroom.' }, 'Digitalisering': { niveau:'laag',   signaal:'Treant digitaliseringsplan loopt; focus op administratievermindering.' }, 'Capaciteitsdruk': { niveau:'middel', signaal:'Wachttijden onder landelijk gemiddelde; dunbevolktheid geeft buffer.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'Drents-Gronings overleg over spoedzorg loopt maar levert nog weinig op.' }, 'Financiering': { niveau:'middel', signaal:'Treant financieel kwetsbaar; reserves onvoldoende voor EPD-vervanging.' } },
  'Flevoland':      { 'Arbeidsmarkt': { niveau:'middel', signaal:'Jonge bevolkingsopbouw geeft tijdelijk voordeel; vergrijzing accelereert snel.' }, 'Passende zorg': { niveau:'middel', signaal:'MC Lelystad bouwt spoedketen met huisartsenposten en RAV.' }, 'Digitalisering': { niveau:'middel', signaal:'Snelgroeiende regio trekt digitale zorgstartups aan; integratie nog beperkt.' }, 'Capaciteitsdruk': { niveau:'hoog',   signaal:'MC Lelystad enige ziekenhuis; capaciteit te krap voor groeiende populatie.' }, 'Regionale samenwerking': { niveau:'middel', signaal:'Samenwerking met NH en Utrecht via transferpunten in opbouw.' }, 'Financiering': { niveau:'middel', signaal:'Groeiregio vraagt investeringen; bekostiging loopt achter op demografische realiteit.' } },
};

const REGIO_SCORES = {
  'Noord-Holland':  { 'Arbeidsmarkt':9, 'Passende zorg':5, 'Digitalisering':8, 'Capaciteitsdruk':9, 'Regionale samenwerking':5, 'Financiering':6 },
  'Zuid-Holland':   { 'Arbeidsmarkt':8, 'Passende zorg':8, 'Digitalisering':5, 'Capaciteitsdruk':8, 'Regionale samenwerking':7, 'Financiering':8 },
  'Utrecht':        { 'Arbeidsmarkt':5, 'Passende zorg':2, 'Digitalisering':5, 'Capaciteitsdruk':5, 'Regionale samenwerking':2, 'Financiering':4 },
  'Noord-Brabant':  { 'Arbeidsmarkt':5, 'Passende zorg':5, 'Digitalisering':5, 'Capaciteitsdruk':7, 'Regionale samenwerking':5, 'Financiering':5 },
  'Gelderland':     { 'Arbeidsmarkt':5, 'Passende zorg':5, 'Digitalisering':3, 'Capaciteitsdruk':5, 'Regionale samenwerking':2, 'Financiering':3 },
  'Overijssel':     { 'Arbeidsmarkt':5, 'Passende zorg':4, 'Digitalisering':5, 'Capaciteitsdruk':3, 'Regionale samenwerking':3, 'Financiering':4 },
  'Friesland':      { 'Arbeidsmarkt':8, 'Passende zorg':5, 'Digitalisering':5, 'Capaciteitsdruk':7, 'Regionale samenwerking':5, 'Financiering':7 },
  'Groningen':      { 'Arbeidsmarkt':9, 'Passende zorg':3, 'Digitalisering':3, 'Capaciteitsdruk':5, 'Regionale samenwerking':5, 'Financiering':8 },
  'Zeeland':        { 'Arbeidsmarkt':9, 'Passende zorg':5, 'Digitalisering':5, 'Capaciteitsdruk':8, 'Regionale samenwerking':5, 'Financiering':9 },
  'Limburg':        { 'Arbeidsmarkt':8, 'Passende zorg':5, 'Digitalisering':5, 'Capaciteitsdruk':8, 'Regionale samenwerking':5, 'Financiering':9 },
  'Drenthe':        { 'Arbeidsmarkt':5, 'Passende zorg':4, 'Digitalisering':3, 'Capaciteitsdruk':4, 'Regionale samenwerking':4, 'Financiering':5 },
  'Flevoland':      { 'Arbeidsmarkt':5, 'Passende zorg':5, 'Digitalisering':5, 'Capaciteitsdruk':7, 'Regionale samenwerking':5, 'Financiering':5 },
};
// Score 1=laag urgentie, 10=hoog urgentie

/* ══════════════════════════════════════
   VERGELIJKING — feiten & regionale metrics
   Bronnen: CBS 2025, UWV Q1 2025, NZa 2025,
   OECD Health 2024, VWS IZA-monitor 2025,
   Nivel/Vektis 2025, IGJ Jaarrapport 2025
══════════════════════════════════════ */
const THEMA_VERGELIJK = {
  'Arbeidsmarkt': {
    label: 'Arbeidsmarkt & Personeel',
    feit: '~130.000 openstaande vacatures in zorg & welzijn (UWV Q1 2025). Verzuim in de zorg: 7,2% — hoogste van alle sectoren (CBS). 1 op de 6 werkenden in Nederland werkt in de zorg.',
    metriekLabel: 'vacaturegraad',
    regio: {
      'Noord-Holland':'8,9%','Zuid-Holland':'8,2%','Utrecht':'4,9%','Noord-Brabant':'5,1%',
      'Gelderland':'5,0%','Overijssel':'4,8%','Friesland':'7,7%','Groningen':'9,1%',
      'Zeeland':'9,4%','Limburg':'8,0%','Drenthe':'4,7%','Flevoland':'5,3%',
    },
  },
  'Passende zorg': {
    label: 'Passende Zorg & IZA',
    feit: '54% van IZA-regio\'s loopt achter op uitvoeringsplanning (VWS 2025). Doel: 50.000 minder ziekenhuisopnames in 2027. Substitutie naar 1e lijn: slechts 22% van doelstelling gerealiseerd.',
    metriekLabel: 'IZA op schema',
    regio: {
      'Noord-Holland':'52%','Zuid-Holland':'34%','Utrecht':'78%','Noord-Brabant':'51%',
      'Gelderland':'54%','Overijssel':'60%','Friesland':'50%','Groningen':'68%',
      'Zeeland':'47%','Limburg':'49%','Drenthe':'61%','Flevoland':'53%',
    },
  },
  'Digitalisering': {
    label: 'Digitalisering & Data',
    feit: '72% van ziekenhuizen volledig EPD-geïmplementeerd (NVZ 2025). AI-gebruik in diagnostiek groeit 35%/jaar. Cyberaanvallen op zorginstellingen: +47% in 2024 (Z-CERT).',
    metriekLabel: 'EPD volledig geïmplementeerd',
    regio: {
      'Noord-Holland':'81%','Zuid-Holland':'64%','Utrecht':'70%','Noord-Brabant':'68%',
      'Gelderland':'75%','Overijssel':'65%','Friesland':'63%','Groningen':'77%',
      'Zeeland':'61%','Limburg':'64%','Drenthe':'60%','Flevoland':'66%',
    },
  },
  'Capaciteitsdruk': {
    label: 'Capaciteit & Wachttijden',
    feit: 'Nederland: 2,9 ziekenhuisbedden per 1.000 inwoners — ruim onder EU-gemiddelde van 4,6 (OECD 2024). GGZ-wachttijd gemiddeld 14 weken. SEH-bezoeken overschrijden 4-uursnorm in 38% van gevallen.',
    metriekLabel: 'ziekenhuisbezettingsgraad',
    regio: {
      'Noord-Holland':'94%','Zuid-Holland':'88%','Utrecht':'61%','Noord-Brabant':'78%',
      'Gelderland':'62%','Overijssel':'44%','Friesland':'74%','Groningen':'63%',
      'Zeeland':'87%','Limburg':'83%','Drenthe':'51%','Flevoland':'79%',
    },
  },
  'Regionale samenwerking': {
    label: 'Regionale Samenwerking',
    feit: '61% van de 46 IZA-regio\'s heeft uitvoeringsplan ondertekend (VWS 2025). €2,8 miljard IZA-budget beschikbaar. Regio\'s met eerder samenwerkingsverleden lopen 2× sneller op schema.',
    metriekLabel: 'samenwerkingsconvenanten gesloten',
    regio: {
      'Noord-Holland':'58%','Zuid-Holland':'71%','Utrecht':'89%','Noord-Brabant':'55%',
      'Gelderland':'82%','Overijssel':'72%','Friesland':'54%','Groningen':'54%',
      'Zeeland':'51%','Limburg':'52%','Drenthe':'44%','Flevoland':'52%',
    },
  },
  'Financiering': {
    label: 'Financiering & Bekostiging',
    feit: 'Totale zorguitgaven: €117 miljard (2024, CBS). NZa-tarieven +3,1% bij werkelijke kostenstijging +5,4% (NZa 2025). Gemiddelde nettomarge ziekenhuizen: −0,3% — 40% draait verlies.',
    metriekLabel: 'financiële drukindex (1–10)',
    regio: {
      'Noord-Holland':'6,1','Zuid-Holland':'7,8','Utrecht':'4,1','Noord-Brabant':'5,0',
      'Gelderland':'3,2','Overijssel':'4,0','Friesland':'6,8','Groningen':'7,9',
      'Zeeland':'8,9','Limburg':'8,8','Drenthe':'4,9','Flevoland':'5,1',
    },
  },
};

const SAMENWERKINGSVERBANDEN = {
  'Noord-Holland':  [
    { titel:'Transferpunt Noord-Holland West', partijen:['Amsterdam UMC','Dijklander','Thuiszorg NHN'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Coördineert doorstroom van patiënten van ziekenhuizen naar thuiszorg en verpleeghuizen. Doel: gemiddelde ligduur bekorten met 2 dagen. Actief sinds Q1 2026.' },
    { titel:'Digitaal Zorgnetwerk Metropoolregio', partijen:['OLVG','Spaarne Gasthuis','Huisartsen Amsterdam'], themas:['Digitalisering','Passende zorg'], detail:'Pilot voor digitale overdracht via FHIR tussen ziekenhuizen en huisartsenpraktijken in de metropoolregio. Budget: €2,4M over 3 jaar.' },
  ],
  'Zuid-Holland':   [
    { titel:'Convenant Acute Zorg Rijnmond', partijen:['Erasmus MC','Maasstad','IJsselland','ROAZ ZH'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Regelt taakverdeling bij complexe spoedeisende gevallen. Partijen wisselen real-time capaciteitsdata uit via gedeeld platform.' },
    { titel:'Haags Digitaal Zorgplatform', partijen:['HagaZiekenhuis','MCH','8 huisartsenpraktijken'], themas:['Digitalisering'], detail:'Pilot met digitale zorgcoördinatie-app voor naadloze overdracht tussen ziekenhuis, huisarts en wijkverpleging.' },
  ],
  'Utrecht':        [
    { titel:'Breed IZA-Convenant Utrecht', partijen:['UMC Utrecht','Diakonessenhuis','Thuiszorg Utrecht','Gemeente Utrecht'], themas:['Regionale samenwerking','Passende zorg'], detail:'Zeven zorgorganisaties en drie gemeenten ondertekenden dit uitvoeringsplan. Bevat afspraken over thuiszorgcapaciteit, preventie en een regionaal zorgcoördinatiepunt.' },
    { titel:'Regionale GGZ-Samenwerking', partijen:['Altrecht','UMC Utrecht','GGD Midden-Nederland'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Provincie Utrecht trekt €4,2M uit voor gezamenlijk crisisinterventie-team en regionale wachtlijstenbeurs GGZ.' },
  ],
  'Noord-Brabant':  [
    { titel:'Brabants Capaciteitsmodel', partijen:['Catharina','MMC','Amphia','ETZ','CWZ','JBZ','Bernhoven','Bravis'], themas:['Capaciteitsdruk','Digitalisering'], detail:'Acht ziekenhuizen testen real-time capaciteitsplanningsmodel. Geeft inzicht in beschikbare bedden en operatiekamercapaciteit in de regio.' },
    { titel:'Pilot Uitkomstbekostiging Eindhoven', partijen:['Catharina','Huisartsen Eindhoven','Zorgkantoor VGZ'], themas:['Financiering','Passende zorg'], detail:'Na één jaar laat de pilot 8% minder ziekenhuisopnames zien in de pilotpopulatie. Data-infrastructuur wordt versterkt voor opschaling.' },
  ],
  'Gelderland':     [
    { titel:'Regionaal Zorgcoördinatiepunt Nijmegen', partijen:['Radboudumc','Canisius-Wilhelmina','Zorggroep Nijmegen'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Na drie maanden rapporteert het coördinatiepunt 12% minder dubbele zorgcontacten en 2 dagen kortere overdrachtstijd.' },
    { titel:'Gelderse Arbeidsmarktalliantie', partijen:['30 zorgorganisaties','ROC Nijmegen','ROC Arnhem'], themas:['Arbeidsmarkt'], detail:'Platform voor flex-inzet tussen deelnemende organisaties. Medewerkers kunnen tijdelijk bij andere organisaties werken zonder te wisselen van werkgever.' },
  ],
  'Overijssel':     [
    { titel:'ZGT-MST Strategische Samenwerking', partijen:['Ziekenhuisgroep Twente','Medisch Spectrum Twente'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Vergaande samenwerking zonder fusie: gedeelde back-office, gezamenlijke inkoop en taakverdeling in specialistische zorg.' },
    { titel:'Netwerkzorg Chronisch Twente', partijen:['MST','Huisartsen Twente','Carintreggeland'], themas:['Passende zorg'], detail:'Model voor integrale netwerkzorg bij chronische aandoeningen; patiënt blijft ingeschreven bij eigen huisarts maar krijgt gecoördineerde zorg.' },
  ],
  'Friesland':      [
    { titel:'MCL-Tjongerschans Wachtlijstaanpak', partijen:['MCL','Tjongerschans'], themas:['Capaciteitsdruk'], detail:'Twee ziekenhuizen delen capaciteit voor electieve ingrepen om wachtlijsten te verkorten. Eerste resultaten: 15% kortere wachttijd voor dagchirurgie.' },
    { titel:'Telezorg Friesland', partijen:['MCL','Thuiszorg Friesland','GGD Fryslân'], themas:['Digitalisering','Passende zorg'], detail:'Telezorg voor patiënten op afstand van ziekenhuizen. Focus op hart- en longpatiënten in dunbevolkte gebieden.' },
  ],
  'Groningen':      [
    { titel:'Digitaal Zorgnetwerk Noordoost', partijen:['UMCG','MCL','Treant'], themas:['Digitalisering','Regionale samenwerking'], detail:'Verbindt zorgprofessionals in Groningen, Friesland en Drenthe voor telediagnostiek en consultatie op afstand. Reduceert reistijd voor patiënten.' },
    { titel:'Drents-Gronings Spoedoverleg', partijen:['UMCG','Treant','RAV Groningen'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Structureel overleg over spoedketensamenwerking over provinciegrenzen. Concrete afspraken over patiëntrouting bij calamiteiten.' },
  ],
  'Zeeland':        [
    { titel:'Pilot Bereikbaarheid Ouderenzorg', partijen:['Adrz','Gemeente Middelburg','Gemeente Goes','Gemeente Terneuzen'], themas:['Passende zorg','Regionale samenwerking'], detail:'Pilot om zorgbereikbaarheid voor ouderen in dunbevolkte Zeeuwse gebieden te verbeteren. Focus op thuiszorgcoördinatie en digitale consultatie.' },
    { titel:'Acute Zorg Zeeland-Brabant', partijen:['Adrz','Amphia','RAV Zeeland'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Samenwerkingsafspraken over patiëntenrouting bij piekbelasting Adrz naar Brabantse ziekenhuizen. Ambulanceprotocollen zijn al bijgesteld.' },
  ],
  'Limburg':        [
    { titel:'VieCuri-Zuyderland Taakverdeling', partijen:['VieCuri','Zuyderland'], themas:['Regionale samenwerking','Passende zorg'], detail:'Afspraken over specialisatie in Midden-Limburg. Zuyderland neemt hoogcomplexe oncologie over; VieCuri focust op hartchirurgie en neurologie.' },
    { titel:'Limburgs GGZ-Netwerk', partijen:['Vincent van Gogh','Mondriaan','GGD Zuid-Limburg'], themas:['Capaciteitsdruk','Regionale samenwerking'], detail:'Gezamenlijke aanpak wachtlijsten GGZ. Crisisdienst werkt integraal; bed-management gedeeld platform.' },
  ],
  'Drenthe':        [
    { titel:'Treant-Huisartsen Capaciteitsoverleg', partijen:['Treant Zorggroep','Huisartsenzorg Drenthe'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Structureel overleg om doorstroom eerste-tweede lijn te verbeteren. Gezamenlijk triage-protocol verlaagde onnodige SEH-verwijzingen met 9%.' },
  ],
  'Flevoland':      [
    { titel:'Regionale Spoedketen Flevoland', partijen:['MC Lelystad','Huisartsenpost Lelystad','RAV Flevoland'], themas:['Regionale samenwerking','Capaciteitsdruk'], detail:'Versterkte samenwerking voor betere spoedzorgketen. Ambulances beschikken over real-time bezettingsdata van MC Lelystad.' },
  ],
};

const PRAKTIJKVOORBEELDEN = {
  'Utrecht':        { titel:'Utrecht: breed IZA-convenant als landelijk voorbeeld', beschrijving:'In de regio Utrecht ondertekenden zeven zorgorganisaties en drie gemeenten een samenwerkingsconvenant voor de uitvoering van het IZA. Het convenant bevat concrete afspraken met budget, aanspreekpunten en meetbare doelen. Het ministerie presenteert de Utrechtse aanpak als voorbeeld voor andere regio\'s.', lessen:['Start met een klein kernteam van bevlogen bestuurders die commitment hebben van hun raad','Zorg voor een gedeeld financieel commitment vóórdat je inhoudelijk begint','Maak governance-afspraken expliciet; wie beslist wat bij een conflict?'] },
  'Gelderland':     { titel:'Gelderland: regionaal zorgcoördinatiepunt in Nijmegen', beschrijving:'In de regio Nijmegen fungeert het regionale zorgcoördinatiepunt al drie maanden als spil tussen ziekenhuizen, huisartsen en thuiszorg. Resultaten na het eerste kwartaal tonen 12% minder dubbele zorgcontacten en gemiddeld twee dagen kortere overdrachtstijd.', lessen:['Wijs één regisseur aan die geen belang heeft bij één instelling','Investeer in een gedeeld digitaal platform voor real-time inzicht in capaciteit','Meet en publiceer resultaten maandelijks — transparantie vergroot vertrouwen'] },
  'Overijssel':     { titel:'Overijssel: ZGT-MST strategisch samenwerken zonder fusie', beschrijving:'Ziekenhuisgroep Twente en Medisch Spectrum Twente werken intensief samen zonder te fuseren. Ze delen back-office-functies, inkoop en plannen een taakverdeling in specialistische zorg. Het model wordt landelijk gezien als alternatief voor schaalvergroting via fusie.', lessen:['Samenwerken zonder fusie vereist expliciete governance met wederzijdse vetorechten','Begin met back-office; vermijd direct controversiële medische taakverdeling','Leg resultaten contractueel vast met meetbare KPI\'s en jaarlijkse evaluatie'] },
  'Noord-Brabant':  { titel:'Noord-Brabant: pilot uitkomstbekostiging Eindhoven', beschrijving:'Catharina Ziekenhuis, huisartsenpraktijken en zorgkantoor VGZ testen in Eindhoven een bekostigingsmodel op basis van gezondheidsuitkomsten. Na één jaar: 8% minder ziekenhuisopnames in de pilotpopulatie. De data-infrastructuur wordt nu versterkt voor opschaling.', lessen:['Investeer eerst in gedeelde data-infrastructuur voordat je bekostiging aanpast','Betrek patiënten bij definiëren van relevante uitkomstmaten','Houd administratieve last laag: begin met maximaal vijf eenvoudige indicatoren'] },
  'Noord-Holland':  { titel:'Noord-Holland: transferpunt als sleutel voor doorstroom', beschrijving:'Het Transferpunt Noord-Holland West coördineert de doorstroom van patiënten van ziekenhuizen naar thuiszorg en verpleeghuizen. Doel is de gemiddelde ligduur met twee dagen te bekorten. Ambulante teams bezoeken dagelijks ziekenhuisafdelingen om ontslagdrempels weg te nemen.', lessen:['Zet een neutrale transfercoördinator in die geen deelinstelling vertegenwoordigt','Sluit thuiszorgorganisaties van dag één aan; zij bepalen de feitelijke uitstroomsnelheid','Monitor dagelijks en stuur bij; maandelijkse rapportage is te traag'] },
  'Zuid-Holland':   { titel:'Zuid-Holland: convenant acute zorg Rijnmond', beschrijving:'Zeven Rijnmondse ziekenhuizen delen real-time capaciteitsdata en hebben taakverdeling afgesproken bij complexe spoedeisende gevallen. Het convenant legde vast wie welk type traumazorg behandelt, wat wachttijden op de SEH significant verlaagde.', lessen:['Real-time data-uitwisseling is de technische voorwaarde; regel dit eerst','Heldere taakverdeling vereist politieke moed: iemand levert iets in','Betrek ROAZ als neutrale regisseur bij conflicten over verdeling'] },
  'Friesland':      { titel:'Friesland: telezorg voor dunbevolkte gebieden', beschrijving:'MCL en Thuiszorg Friesland bieden telezorg aan voor hart- en longpatiënten op grote afstand van het ziekenhuis. Patiënten meten zelf vitale parameters; verpleegkundigen monitoren op afstand. Aantal onnodige polikliniekbezoeken daalde met 21%.', lessen:['Investeer in patiënttraining: technologie werkt alleen als patiënten het kunnen bedienen','Koppel telezorg aan duidelijk escalatieprotocol bij afwijkende waarden','Begin met hoog-volume patiëntgroepen voor snel aantoonbaar effect'] },
  'Groningen':      { titel:'Groningen: digitaal netwerk voor consultatie op afstand', beschrijving:'Het UMCG lanceerde een digitaal zorgnetwerk dat zorgprofessionals in Groningen, Friesland en Drenthe verbindt voor telediagnostiek. Specialisten in Groningen consulteren collega\'s in regionale ziekenhuizen zonder dat patiënten hoeven te reizen.', lessen:['Maak deelname laagdrempelig: één klik, één platform, geen apart account','Train gespecialiseerde verpleegkundigen als eerste aanspreekpunt bij consult','Meten van reductie in patiëntverplaatsing vergroot draagvlak bij financiers'] },
  'Zeeland':        { titel:'Zeeland: pilot bereikbaarheid ouderenzorg', beschrijving:'Admiraal De Ruyter Ziekenhuis en drie Zeeuwse gemeenten testen modellen om zorg voor ouderen bereikbaar te houden in een dunbevolkt gebied. Thuiszorgcoördinatie wordt gecentraliseerd en digitale consulten vervangen een deel van de fysieke bezoeken.', lessen:['In dunbevolkt gebied is preventie economisch aantrekkelijker dan curatie','Centraliseer coördinatie maar decentraliseer uitvoering: zorg blijft dichtbij','Zet gemeenten vroegtijdig aan tafel: zij kennen de sociale context'] },
  'Limburg':        { titel:'Limburg: specialisatie in plaats van duplicatie', beschrijving:'VieCuri en Zuyderland spraken een vergaande taakverdeling af voor Midden-Limburg. In plaats van beide ziekenhuizen alles te laten doen, specialiseert elk zich in bepaalde complexe zorg. Dit verbetert kwaliteit en maakt schaarste personeel efficiënter inzetbaar.', lessen:['Specialisatie vereist wederzijds vertrouwen en langdurige contractuele commitment','Communiceer actief naar patiënten: meer reistijd, maar betere kwaliteit','Volg OECD-data over volume-kwaliteitsrelaties om keuzes te onderbouwen'] },
  'Drenthe':        { titel:'Drenthe: vermindering onnodige SEH-verwijzingen', beschrijving:'Treant Zorggroep en Drentse huisartsen implementeerden een gezamenlijk triage-protocol dat onnodige SEH-verwijzingen vermindert. Na zes maanden daalde het aantal onnodige SEH-bezoeken met 9%, wat druk op de SEH significant verlaagde.', lessen:['Begin met gezamenlijke triage-scholing voor alle betrokken zorgverleners','Stem criteria af op lokale bevolkingskenmerken; landelijke normen passen niet altijd','Betrek ambulancedienst: zij zijn de eerste schakel in de keten'] },
  'Flevoland':      { titel:'Flevoland: spoedketen voor een groeiende regio', beschrijving:'MC Lelystad bouwt samen met huisartsenposten en RAV Flevoland een versterkte spoedketen. Ambulances beschikken over real-time bezettingsdata. De aanpak is nodig omdat de bevolking van Flevoland sneller groeit dan de zorgcapaciteit.', lessen:['Real-time bezettingsdata voor ambulances bespaart kostbare minuten','Groeiende regio vereist vooruitlopen op capaciteit: bouw voordat het misloopt','Betrek gemeente bij ruimtelijke planning van zorglocaties in nieuwe wijken'] },
};

/* ══════════════════════════════════════
   MIJN REGIO — FUNCTIES
══════════════════════════════════════ */
let huidigeKaartRegio = null;

function updateInlineMapProvince(regio) {
  document.querySelectorAll('.nl-province-group').forEach(g => {
    g.classList.toggle('active', g.dataset.name === regio);
  });
}

function renderMijnRegio() {
  const regio = huidigeKaartRegio || profile.regio || 'Noord-Holland';
  huidigeKaartRegio = regio;
  selectRegioOnMap(regio);
}

function selectRegioOnMap(regio) {
  if (!regio) return;
  huidigeKaartRegio = regio;
  updateInlineMapProvince(regio);

  // Header
  document.getElementById('rk-regio-name').textContent = regio;
  const badge = document.getElementById('rk-jouw-badge');
  badge.style.display = regio === profile.regio ? 'inline-flex' : 'none';

  // Vergelijk dropdown: ververs opties zonder huidige regio
  const sel = document.getElementById('rk-compare-select');
  const prevVal = sel.value;
  sel.innerHTML = '<option value="">— Kies een regio —</option>';
  ALLE_REGIO_NAMEN.filter(r => r !== regio).forEach(r => {
    const o = document.createElement('option');
    o.value = r; o.textContent = r;
    if (r === prevVal) o.selected = true;
    sel.appendChild(o);
  });

  renderThemaSignalen(regio);
  renderSamenwerkingsverbanden(regio);
  renderVergelijking();

  // Leer-pills bijwerken
  const pills = document.getElementById('leer-pills');
  pills.innerHTML = '';
  ALLE_REGIO_NAMEN.filter(r => r !== regio).forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'leer-pill';
    btn.textContent = r;
    btn.onclick = () => toonPraktijkvoorbeeld(r, btn);
    pills.appendChild(btn);
  });
  document.getElementById('leer-voorbeeld').style.display = 'none';
}

function renderThemaSignalen(regio) {
  const grid = document.getElementById('ts-grid');
  grid.innerHTML = '';
  const signalen = REGIO_SIGNALEN[regio] || {};
  Object.entries(signalen).forEach(([thema, data]) => {
    const el = document.createElement('div');
    el.className = 'ts-item';
    el.innerHTML = `
      <div class="ts-item-top">
        <span class="ts-thema-name">${thema}</span>
        <span class="ts-niveau ${data.niveau}">${data.niveau}</span>
      </div>
      <p class="ts-signaal">${data.signaal}</p>`;
    el.onclick = () => {
      artikelenFilter.thema = thema;
      document.getElementById('filter-pills').innerHTML = '';
      navigateTo('artikelen', document.querySelector('[data-page="artikelen"]'));
    };
    grid.appendChild(el);
  });
}

function renderSamenwerkingsverbanden(regio) {
  const list = document.getElementById('sw-list');
  list.innerHTML = '';
  const items = SAMENWERKINGSVERBANDEN[regio] || [];
  if (!items.length) {
    list.innerHTML = '<p style="font-size:13px;color:var(--ink-muted)">Geen samenwerkingsverbanden bekend voor deze regio.</p>';
    return;
  }
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'sw-card';
    card.innerHTML = `
      <div class="sw-card-header" onclick="toggleSamenwerking(this.parentElement)">
        <div class="sw-card-left">
          <div class="sw-card-title">${item.titel}</div>
          <div class="sw-partijen">${item.partijen.join(' · ')}</div>
          <div class="sw-tags">${item.themas.map(t => `<span class="sw-tag">${t}</span>`).join('')}</div>
        </div>
        <span class="sw-chevron">›</span>
      </div>
      <div class="sw-detail">${item.detail}</div>`;
    list.appendChild(card);
  });
}

function toggleSamenwerking(card) {
  card.classList.toggle('open');
}

function renderVergelijking() {
  const regio1 = huidigeKaartRegio || profile.regio;
  const regio2 = document.getElementById('rk-compare-select').value;
  const container = document.getElementById('vg-charts');
  if (!regio2) { container.innerHTML = ''; return; }

  const scores1 = REGIO_SCORES[regio1] || {};
  const scores2 = REGIO_SCORES[regio2] || {};

  const blocksHtml = Object.entries(THEMA_VERGELIJK).map(([themaKey, data]) => {
    const s1 = Math.round((scores1[themaKey] || 0) * 10);
    const s2 = Math.round((scores2[themaKey] || 0) * 10);
    const m1 = data.regio[regio1] || '—';
    const m2 = data.regio[regio2] || '—';
    const icon = THEME_ICONS[themaKey] || '';

    return `
      <div class="vg-theme-block">
        <div class="vg-theme-header">
          <span class="vg-theme-icon">${icon}</span>
          <div>
            <div class="vg-theme-label">${data.label}</div>
            <div class="vg-theme-metriek">📏 Regionale meting: ${data.metriekLabel}</div>
          </div>
        </div>
        <div class="vg-theme-feit">${data.feit}</div>
        <div class="vg-regio-rows">
          <div class="vg-regio-row">
            <div class="vg-regio-name primary-name">${regio1}</div>
            <div class="vg-regio-bar-wrap">
              <div class="vg-bar-track"><div class="vg-bar-fill primary" style="width:${s1}%"></div></div>
              <span class="vg-bar-pct">${s1}%</span>
            </div>
            <div class="vg-regio-metric">${m1}</div>
          </div>
          <div class="vg-regio-row">
            <div class="vg-regio-name compare-name">${regio2}</div>
            <div class="vg-regio-bar-wrap">
              <div class="vg-bar-track"><div class="vg-bar-fill compare" style="width:${s2}%"></div></div>
              <span class="vg-bar-pct">${s2}%</span>
            </div>
            <div class="vg-regio-metric">${m2}</div>
          </div>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="vg-legend">
      <div class="vg-legend-dot primary"></div><span>${regio1}</span>
      <div class="vg-legend-dot compare"></div><span>${regio2}</span>
      <span style="color:var(--ink-muted);margin-left:4px">— urgentiescore (0–100)</span>
    </div>
    ${blocksHtml}`;
}

function toonPraktijkvoorbeeld(regio, btn) {
  document.querySelectorAll('.leer-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const vb = PRAKTIJKVOORBEELDEN[regio];
  const el = document.getElementById('leer-voorbeeld');
  if (!vb) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.innerHTML = `
    <div class="leer-titel">${vb.titel}</div>
    <p class="leer-beschrijving">${vb.beschrijving}</p>
    <div class="leer-lessen-title">3 concrete lessen</div>
    ${vb.lessen.map(l => `<div class="leer-les">${l}</div>`).join('')}`;
}

/* ══════════════════════════════════════
   AUTO-LOAD — moet als LAATSTE staan zodat
   alle const-variabelen (REGIO_SIGNALEN etc.)
   al geïnitialiseerd zijn
══════════════════════════════════════ */
(function initApp() {
  if (loadProfile()) {
    buildDashboard();
    document.getElementById('onboarding').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
  }
})();
