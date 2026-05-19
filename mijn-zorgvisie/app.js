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

/* Gepersonaliseerde duiding per thema × functie */
const ARTIKEL_CONTEXT = {
  'Arbeidsmarkt': {
    speelt: 'Structurele personeelstekorten raken alle zorgsectoren, met VVT en GGZ als zwaarst getroffen. Vergrijzing van de beroepsbevolking versnelt de uitstroom terwijl instroom stagneert. Cao-onderhandelingen draaien vrijwel continu en dure flexinzet is voor veel instellingen structureel geworden.',
    relevant: {
      'Zorgmanager':         'De tekorten raken jouw team direct: roosters kloppen niet meer, werkdruk stijgt en kwalitatief goede medewerkers vertrekken naar de concurrent. Retentie en dagelijkse bezettingsplanning zijn jouw voornaamste hefbomen.',
      'Bestuurder':          'Strategische keuzes over arbeidsvoorwaarden, partnerships met onderwijs en het employer brand van je organisatie bepalen je concurrentiepositie als werkgever voor de komende jaren.',
      'Beleidsmedewerker':   'Cao-akkoorden en landelijk arbeidsmarktbeleid vertalen naar uitvoerbare instellingsafspraken vraagt actuele kennis van het speelveld. Jij bent de brug tussen macro-ontwikkelingen en de eigen organisatie.',
      'Adviseur':            'Adviesvragen richten zich steeds meer op workforce planning, nieuwe personeelsmodellen en strategische keuzes over flexibilisering versus vaste contracten.',
      'HR-professional':     'Dit is jouw kerndomein. Werving, selectie, behoud en cultuur staan centraal. Benchmarkdata en cao-kennis zijn direct inzetbaar om jouw aanpak te onderbouwen en bij te sturen.',
      'Financieel directeur':'Personeelskosten zijn de grootste post op de begroting. Structurele tekorten leiden tot dure inhuur van flex en ZZP. Een meerjarig perspectief op loonkosten en capaciteitskosten is essentieel.',
    },
    betekenis: 'Arbeidsmarktontwikkelingen vragen om een integrale aanpak: personeelsplanning koppelen aan bekostiging, een duurzame werkgeversstrategie ontwikkelen en regionale samenwerking zoeken voor gedeelde instroom en opleidingsinfrastructuur.',
  },
  'Passende zorg': {
    speelt: 'Het Integraal Zorgakkoord verplicht zorgaanbieders tot verschuiving van tweedelijn naar de eerste lijn. Digitale substitutie, taakherschikking en preventie zijn de drie pijlers. IZA-middelen zijn beschikbaar maar vragen concrete regionale uitvoeringsplannen vóór uitbetaling.',
    relevant: {
      'Zorgmanager':         'Taakherschikking en nieuwe zorgpaden herdefiniëren wie wat doet in jouw team. Dat vraagt aanpassing van werkprocessen, competentieprofielen en dagelijkse samenwerking met ketenpartners.',
      'Bestuurder':          'Hoe positioneer je jouw organisatie in een veranderend zorglandschap? Samenwerking, focus of differentiatie zijn strategische scenario\'s die nu worden uitgewerkt — en later moeilijk te herzien zijn.',
      'Beleidsmedewerker':   'IZA vertalen naar instellingsbeleid, zorgpaden en samenwerkingsafspraken. Begrip van uitkomstbekostiging en populatiemanagement wordt steeds essentiëler voor jouw werk.',
      'Adviseur':            'Organisaties zoeken begeleiding bij herinrichting van zorgprocessen, governance van regionale netwerken en implementatie van passende-zorg-principes in de dagelijkse praktijk.',
      'HR-professional':     'Nieuwe rolverdeling in de zorg vraagt andere competentieprofielen, een bijgestelde scholingsagenda en herziene functieomschrijvingen. Verandermanagement is een cruciaal onderdeel.',
      'Financieel directeur':'Uitkomstbekostiging verschuift financieel risico van verzekeraar naar aanbieder. Jouw financiële modellen moeten aanpasbaar zijn op nieuwe bekostigingsstromen en populatieafspraken.',
    },
    betekenis: 'Passende zorg vraagt om strategische positionering, herinrichting van zorgprocessen en verdiepte samenwerking — zowel binnen de eigen organisatie als in de regio. Instellingen die nu investeren in relaties en governance, plukken daar op middellange termijn de vruchten van.',
  },
  'Digitalisering': {
    speelt: 'AI en dataficering winnen snel terrein in diagnostiek, planning en administratie. EPD-vervanging staat hoog op de agenda bij veel instellingen. FHIR en gegevensuitwisseling worden via wetgeving afgedwongen. Cyberveiligheid is uitgegroeid tot een bestuurlijk risico met directe aansprakelijkheid.',
    relevant: {
      'Zorgmanager':         'Digitale tools raken het dagelijkse werkproces van je team direct. De implementatiekwaliteit — en niet de technologie zelf — bepaalt of het de werkdruk verlaagt of juist verhoogt.',
      'Bestuurder':          'Digitale strategie is een strategisch bestuursthema. Investeringskeuzes in EPD, AI en data-infrastructuur hebben een impact van 10+ jaar en hoge overstapkosten. Vroeg bewust kiezen loont.',
      'Beleidsmedewerker':   'Wet- en regelgeving rondom data, privacy (AVG) en gegevensuitwisseling vraagt continue aandacht. Beleid moet bijhouden wat technologie al doet in de praktijk.',
      'Adviseur':            'Adviesvragen rondom digitale transformatie, selectie van systemen en begeleiding van implementaties zijn sterk in opkomst. Technische kennis gecombineerd met organisatiebegrip is de sleutel.',
      'HR-professional':     'Digitalisering verandert functies en werkprocessen ingrijpend. Digitale vaardigheidsontwikkeling, omscholing en begeleiding van medewerkers zijn onderdeel van jouw agenda.',
      'Financieel directeur':'Grote ICT-investeringen vragen om een gedegen businesscase met realistische TCO. Het risico op kostenoverschrijding bij EPD-trajecten is aanzienlijk — kosten stijgen gemiddeld 40% boven initiële begroting.',
    },
    betekenis: 'Digitalisering is geen IT-kwestie maar een organisatiebrede transformatie. Succesvol digitaliseren vraagt om bestuurlijke sturing, budgetruimte, scholingsbeleid en heldere governance rondom data en cyberveiligheid.',
  },
  'Capaciteitsdruk': {
    speelt: 'Wachtlijsten groeien in vrijwel alle sectoren. GGZ, ouderenzorg en specialistische zorg zijn het zwaarst getroffen. Treeknormen worden structureel overschreden — gemiddeld met factor 2 tot 4. Regionale spreiding van beschikbare capaciteit is ongelijk en vraagt om actieve afstemming.',
    relevant: {
      'Zorgmanager':         'Wachtlijstbeheer, capaciteitsplanning en triage horen tot je dagelijkse uitdaging. Keuzes over wie voorrang krijgt hebben directe kwaliteits- en aansprakelijkheidsimplicaties.',
      'Bestuurder':          'Capaciteitsvraagstukken overstijgen de eigen organisatie. Regionale afstemming en beleidsdialoog met overheid en zorgkantoor zijn noodzakelijk om structurele oplossingen te vinden.',
      'Beleidsmedewerker':   'Capaciteitsberekeningen, wachtlijstrapportages en IZA-monitoring vormen de basis voor beleid. Datagedreven analyse is een kerncompetentie die steeds zwaarder weegt.',
      'Adviseur':            'Instellingen zoeken expertise op capaciteitsmanagement, scenario-planning en het ontwerpen van regionale samenwerkingsmodellen om capaciteit beter te benutten.',
      'HR-professional':     'Capaciteitsdruk verhoogt werkdruk structureel en draagt bij aan uitstroom. Preventief HR-beleid, welzijnsprogramma\'s en slimme roostering zijn urgente instrumenten.',
      'Financieel directeur':'Zowel overcapaciteit als ondercapaciteit heeft directe financiële gevolgen — via lege bedden of dure klachtenafhandeling en reputatieschade. Capaciteitsoptimalisatie is financieel strategisch relevant.',
    },
    betekenis: 'Capaciteitsdruk vraagt om een integrale aanpak: betere planning en triage, sterkere regionale samenwerking en directe koppeling aan personeelsstrategie en bekostigingsvraagstukken. Instellingen die wachten op een landelijke oplossing raken verder achterop.',
  },
  'Regionale samenwerking': {
    speelt: 'IZA verplicht regio\'s tot gezamenlijke uitvoeringsplannen met concrete afspraken over capaciteit, preventie en digitale uitwisseling. Governance van regionale netwerken is complex: wie beslist wat, wie financiert, wie is eindverantwoordelijk? Regio\'s verschillen sterk in rijpheid — van eerste verkenning tot geavanceerde uitvoering.',
    relevant: {
      'Zorgmanager':         'Jij bent de operationele schakel tussen de eigen organisatie en regionale partners. Praktische afspraken over overdracht, gezamenlijke ketenzorg en capaciteitsafstemming vereisen jouw betrokkenheid.',
      'Bestuurder':          'Jouw positie in regionale netwerken bepaalt mede je strategische speelruimte voor de komende jaren. Governance, vertrouwen en langetermijnrelaties zijn sleutelfactoren die nu worden gevestigd.',
      'Beleidsmedewerker':   'Regionale akkoorden vertalen naar instellingsbeleid, bijdragen aan regionale overlegtafels en monitoren van uitvoeringsafspraken zijn concrete taken die steeds zwaarder wegen.',
      'Adviseur':            'Procesbegeleiding bij het vormen en bestendigen van regionale netwerken — inclusief governance-ontwerp en conflictoplossing — is een sterk groeiende adviesvraag.',
      'HR-professional':     'Regionale arbeidsmarktsamenwerkingen — gezamenlijke werving, gedeelde opleidingspoolen, uitwisseling van personeel — zijn relevante instrumenten voor het arbeidsmarktvraagstuk.',
      'Financieel directeur':'Kostenverdeling in regionale samenwerking en gezamenlijke investeringen vragen om heldere financiële afspraken, transparante rapportage en solide juridische contractering.',
    },
    betekenis: 'Regionale samenwerking vereist investering in relaties, heldere governance en de bereidheid om eigen belangen af te wegen tegen het bredere regionale belang. Organisaties die dat te lang uitstellen, staan straks buitenspel bij beslissingen die hun werkgebied direct raken.',
  },
  'Financiering': {
    speelt: 'NZa-tarieven stijgen gemiddeld 3,1% terwijl werkelijke kostenstijging uitkomt op 5,4%. Bezuinigingen op langdurige zorg zetten instellingen met krappe marges verder onder druk. Uitkomstbekostiging wint terrein maar is complex te implementeren. Meerdere instellingen melden dat de financiële duurzaamheid op middellange termijn in het geding is.',
    relevant: {
      'Zorgmanager':         'Bezuinigingen vertalen zich direct naar bezetting, middelen en mogelijkheden op de werkvloer. Efficiëntie en kwaliteit staan tegelijk onder druk — dat vraagt om scherpe prioritering en heldere communicatie naar je team.',
      'Bestuurder':          'Financiële strategie in een krimpende bekostigingsomgeving vraagt scenario-denken, robuust reservebeleid en tijdige bijsturing van de meerjarenbegroting. Verantwoording naar RvT neemt toe.',
      'Beleidsmedewerker':   'NZa-besluiten, tariefwijzigingen en bezuinigingsmaatregelen op de voet volgen en vertalen naar concrete instellingsimplicaties is kernwerk dat steeds sneller moet gaan.',
      'Adviseur':            'Financieel advies aan zorginstellingen richt zich steeds meer op scenario-planning, kostenoptimalisatie en het begeleiden van bekostigingstransities — van volumebekostiging naar uitkomstgerichte modellen.',
      'HR-professional':     'Bezuinigingen raken direct de personele inzet en het arbeidsvoorwaardenbeleid. Begrip van de financiële context helpt bij het onderbouwen van investeringen in mensen tegenover het bestuur.',
      'Financieel directeur':'Dit is jouw kerndossier. Tariefanalyse, begroting, reservering en risicomanagement zijn direct relevant voor de financiële duurzaamheid. De NZa-zienswijzeprocedure biedt een formele mogelijkheid tot bezwaar.',
    },
    betekenis: 'Financiële duurzaamheid vraagt om transparantie, proactieve begrotingssturing en een helder gesprek met toezichthouders en financiers over wat de sector realistisch kan leveren binnen de gestelde bekostigingskaders.',
  },
};

const ARTICLES = [
  {
    id: 1, thema: 'Arbeidsmarkt', datum: 'Vandaag', minuten: 4,
    img: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&h=400&fit=crop&q=80',
    title: 'Personeelstekort in VVT bereikt nieuw record',
    excerpt: 'Ruim 40% van de VVT-instellingen meldt dat de bezetting structureel onder de norm ligt, blijkt uit nieuw onderzoek van ActiZ.',
    body: `<p>Ruim 40 procent van de instellingen voor verpleging, verzorging en thuiszorg (VVT) meldt dat hun personeelsbezetting structureel onder de norm ligt. Dit blijkt uit een grootschalig onderzoek dat brancheorganisatie ActiZ heeft uitgevoerd onder 380 leden.</p>
    <h3>Oorzaken en achtergrond</h3>
    <p>De tekorten zijn niet nieuw, maar de omvang neemt toe. Vergrijzing van de beroepsbevolking, een groeiende vraag naar zorg en concurrentie vanuit andere sectoren dragen bij aan het probleem. Veel instellingen kampen bovendien met een hoog ziekteverzuim, wat de druk op aanwezige medewerkers verder vergroot.</p>
    <blockquote>"We zien dat teams al jaren op hun tandvlees lopen. De instroom van nieuwe collega's houdt simpelweg de uitstroom niet bij." — Directeur ActiZ</blockquote>
    <h3>Gevolgen voor de zorgverlening</h3>
    <p>Instellingen geven aan dat zij zorginhoudelijke keuzes moeten maken die ze liever niet maken: minder begeleiding per cliënt, beperking van activiteiten en in sommige gevallen het tijdelijk sluiten van capaciteit. De wachtlijsten voor verpleeghuiszorg nemen daardoor verder toe.</p>
    <p>Het kabinet heeft aangekondigd met een nieuw arbeidsmarktakkoord voor de zorg te komen. Vakbonden en werkgevers zijn momenteel in gesprek over structurele maatregelen voor de komende cao-periode.</p>`,
  },
  {
    id: 2, thema: 'Passende zorg', datum: 'Gisteren', minuten: 6,
    img: 'https://images.unsplash.com/photo-1579684385127-1571037e9d45?w=800&h=400&fit=crop&q=80',
    title: 'Minister kondigt nieuw actieplan passende zorg aan',
    excerpt: 'Het kabinet presenteert een driejarig investeringsprogramma gericht op de verschuiving van ziekenhuiszorg naar de eerste lijn.',
    body: `<p>De minister van Volksgezondheid heeft een driejarig investeringsprogramma aangekondigd dat de verschuiving van ziekenhuiszorg naar de eerste lijn moet versnellen. Het programma heeft een omvang van 420 miljoen euro en loopt van 2026 tot en met 2028.</p>
    <h3>Kern van het plan</h3>
    <p>Het actieplan richt zich op drie pijlers: versterking van de huisartsenzorg, uitbreiding van gespecialiseerde verpleging in de wijk en betere samenwerking tussen ziekenhuizen en eerstelijnsorganisaties via regionale zorgnetwerken.</p>
    <blockquote>"Passende zorg betekent dat we de goede zorg op de goede plek leveren. Dat is niet altijd het ziekenhuis." — Minister VWS</blockquote>
    <h3>Reacties uit het veld</h3>
    <p>Koepelorganisaties reageren gematigd positief. Zij waarschuwen dat extra financiering alleen niet voldoende is zolang het personeelstekort aanhoudt. Ook vragen zij om heldere kaders voor de regionale uitvoering.</p>`,
  },
  {
    id: 3, thema: 'Digitalisering', datum: '2 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=400&fit=crop&q=80',
    title: 'AI in de radiologie: van pilot naar praktijk',
    excerpt: 'Steeds meer ziekenhuizen zetten AI-tools in voor beelddiagnostiek. Een inventarisatie van ervaringen en valkuilen.',
    body: `<p>Kunstmatige intelligentie maakt een stille opmars in de Nederlandse radiologie. Waar twee jaar geleden AI-tools voor beelddiagnostiek nog een zeldzaamheid waren, gebruiken inmiddels meer dan 60 procent van de ziekenhuizen minstens één AI-toepassing structureel in hun radiologische werkproces.</p>
    <h3>Wat werkt, wat niet</h3>
    <p>Toepassingen voor de detectie van longknobbeltjes en borsttumoren scoren hoog op gebruikerstevredenheid. Radiologen zeggen dat AI hen helpt om prioriteiten te stellen en minder kritische bevindingen te missen. Minder succesvol zijn toepassingen die de volledige verslaglegging proberen over te nemen: de acceptatie onder specialisten blijft laag.</p>
    <blockquote>"AI is een co-piloot, geen piloot. De verantwoordelijkheid blijft bij de radioloog." — Hoofd radiologie, academisch ziekenhuis</blockquote>
    <h3>Aandachtspunten voor bestuurders</h3>
    <p>Inkoop van AI-tools vraagt om een zorgvuldige validatieprocedure. Algoritmen die elders zijn getraind, presteren niet altijd goed op lokale patiëntenpopulaties. Ziekenhuizen worden aangeraden om vóór implementatie een onafhankelijke klinische validatie uit te voeren.</p>`,
  },
  {
    id: 4, thema: 'Capaciteitsdruk', datum: '3 dagen geleden', minuten: 7,
    img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=400&fit=crop&q=80',
    title: 'GGZ-wachtlijsten nauwelijks korter ondanks extra middelen',
    excerpt: 'Ondanks de extra investeringen uit het Hoofdlijnenakkoord GGZ zijn de wachttijden in 2025 nauwelijks gedaald.',
    body: `<p>De wachttijden in de geestelijke gezondheidszorg (GGZ) zijn in 2025 nauwelijks afgenomen, ondanks de extra middelen die via het Hoofdlijnenakkoord GGZ beschikbaar zijn gesteld. Dit concludeert de Nederlandse Zorgautoriteit (NZa) in haar nieuwste trendrapportage.</p>
    <h3>Cijfers</h3>
    <p>De gemiddelde wachttijd voor generalistische basis-GGZ bedraagt momenteel 11 weken, tegen de Treeknorm van 4 weken. Voor de specialistische GGZ loopt de gemiddelde wachttijd op tot 18 weken. De NZa signaleert dat met name jongeren lang moeten wachten op toegang tot psychische hulp.</p>
    <blockquote>"Extra middelen helpen, maar lossen het onderliggende capaciteitsprobleem niet op." — Directeur NZa</blockquote>
    <h3>Structurele oorzaken</h3>
    <p>Onderzoekers wijzen op drie structurele factoren: de toenemende vraag naar psychische hulp na de covidpandemie, het personeelstekort in de sector en de administratielast die zorgprofessionals ervan weerhoudt meer patiënten te behandelen. Het ministerie bekijkt momenteel aanvullende maatregelen.</p>`,
  },
  {
    id: 5, thema: 'Regionale samenwerking', datum: '4 dagen geleden', minuten: 4, isRegio: true,
    img: 'https://images.unsplash.com/photo-1559757175-5aba18ecd7de?w=800&h=400&fit=crop&q=80',
    title: 'Regio Utrecht sluit breed IZA-uitvoeringsplan',
    excerpt: 'Zeven zorgorganisaties en drie gemeenten ondertekenen een samenwerkingsconvenant gericht op thuiszorg en preventie.',
    body: `<p>In de regio Utrecht hebben zeven zorgorganisaties en drie gemeenten een samenwerkingsconvenant ondertekend voor de uitvoering van het Integraal Zorgakkoord (IZA). Het is een van de eerste regio's in Nederland met een breed gedragen uitvoeringsplan.</p>
    <h3>Wat staat er in het akkoord</h3>
    <p>Het convenant bevat afspraken over de uitbreiding van thuiszorgcapaciteit, gezamenlijke preventieactiviteiten in wijken met een hoge zorgvraag en de inrichting van een regionaal zorgcoördinatiepunt. Partijen spreken ook af om samen te investeren in digitale gegevensuitwisseling.</p>
    <blockquote>"Dit is niet een plan op papier, maar een concreet uitvoeringsprogramma met budget en aanspreekpunten." — Wethouder gemeente Utrecht</blockquote>
    <h3>Landelijke betekenis</h3>
    <p>Het Ministerie van VWS presenteert de Utrechtse aanpak als voorbeeld voor andere regio's. Een evaluatie is gepland voor het voorjaar van 2027.</p>`,
  },
  {
    id: 6, thema: 'Financiering', datum: '5 dagen geleden', minuten: 5,
    img: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=400&fit=crop&q=80',
    title: 'NZa publiceert nieuwe tarieven langdurige zorg',
    excerpt: 'De nieuwe tarieven voor 2026 zijn gepubliceerd. Instellingen krijgen te maken met hogere energiekosten en een beperkte looncompensatie.',
    body: `<p>De Nederlandse Zorgautoriteit (NZa) heeft de tarieven voor de langdurige zorg voor 2026 gepubliceerd. De tarieven stijgen gemiddeld met 3,1 procent, maar voor veel instellingen is dit onvoldoende om de gestegen loon- en energiekosten op te vangen.</p>
    <h3>Reacties uit de sector</h3>
    <p>Brancheorganisaties ActiZ en VGN spreken van een ontoereikende compensatie. Zij stellen dat de werkelijke kostenstijging in de sector uitkomt op gemiddeld 5,4 procent. De organisaties kondigen aan opnieuw in gesprek te gaan met de NZa en het ministerie.</p>
    <blockquote>"Instellingen die al krap bij kas zitten, komen verder in de problemen." — Voorzitter ActiZ</blockquote>
    <h3>Implicaties voor bedrijfsvoering</h3>
    <p>Financieel directeuren worden aangeraden hun begroting voor 2026 tijdig bij te stellen. De NZa biedt de mogelijkheid om via een zienswijzeprocedure bezwaar aan te tekenen tegen de vastgestelde tarieven. De deadline daarvoor is 1 augustus 2026.</p>`,
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
  'Drenthe':       [{ title: 'Treant Zorggroep en huisartsen starten regio-overleg capaciteit', meta: 'Drenthe · 3 dagen geleden' }],
  'Flevoland':     [{ title: 'MC Lelystad en partners werken aan regionale spoedketen', meta: 'Flevoland · 2 dagen geleden' }],
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
  if (inp && inp.dataset.key) {
    const key = inp.dataset.key;
    profile[key] = inp.value.trim() || null;
  }
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
    el.classList.toggle('done',   num < n);
  });
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
   NAVIGATIE
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
   DASHBOARD
══════════════════════════════════════ */
function buildDashboard() {
  document.getElementById('topbar-avatar').textContent  = 'KV';
  document.getElementById('sidebar-avatar').textContent = 'KV';
  document.getElementById('profile-name').textContent   = 'Katy van Vogelpoel';
  document.getElementById('profile-role').textContent   = `${profile.functie} · ${profile.sector}`;
  document.getElementById('regio-naam').textContent     = profile.regio;
  const artCount = ARTICLES.filter(a => profile.themas.includes(a.thema)).length || ARTICLES.length;
  document.getElementById('stat-themas').textContent    = profile.themas.length;
  document.getElementById('stat-artikelen').textContent = artCount;
  document.getElementById('welcome-count').textContent  = `${artCount} nieuwe artikelen`;

  const intro = document.getElementById('welcome-intro');
  if (intro) intro.style.display = sessionStorage.getItem('intro-dismissed') ? 'none' : 'flex';

  const h = new Date().getHours();
  document.getElementById('welcome-title').textContent = `${h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond'}, Katy`;

  const sb = document.getElementById('sidebar-themes');
  sb.innerHTML = '';
  profile.themas.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-tag';
    btn.innerHTML = `<span>${DUIDING[t]?.icon || '●'}</span>${t}`;
    btn.onclick = () => setPriority(t);
    sb.appendChild(btn);
  });

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
  if (!list.length) list = ARTICLES;
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
   ARTIKEL CARD
══════════════════════════════════════ */
function buildArticleCard(container, art, index) {
  const color = THEME_COLORS[art.thema] || '#0B7075';
  const card  = document.createElement('div');
  card.className = 'article-card';
  card.style.animationDelay = `${index * 55}ms`;
  card.innerHTML = `
    ${art.img ? `<img class="ac-image" src="${art.img}" alt="${art.title}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/art${art.id}/800/400'">` : ''}
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
  const ctx   = ARTIKEL_CONTEXT[art.thema];

  const relevantText = ctx?.relevant?.[profile.functie]
    || ctx?.relevant?.['Beleidsmedewerker']
    || 'Dit thema is relevant voor jouw dagelijkse werkpraktijk in de zorg.';

  let duidingHtml = '';
  if (ctx) {
    duidingHtml = `
    <div class="ad-duiding-blok">
      <div class="adb-header">
        <span class="adb-icon">🔍</span>
        <div>
          <div class="adb-title">Thematische duiding voor jou</div>
          <div class="adb-sub">${profile.functie || 'Professional'} · ${profile.sector || 'Zorg'}</div>
        </div>
      </div>
      <div class="adb-body">
        <div class="adb-item">
          <div class="adb-item-label">Wat speelt er</div>
          <div class="adb-item-text">${ctx.speelt}</div>
        </div>
        <div class="adb-divider"></div>
        <div class="adb-item">
          <div class="adb-item-label">Waarom relevant voor jou</div>
          <div class="adb-item-text">${relevantText}</div>
        </div>
        <div class="adb-divider"></div>
        <div class="adb-item">
          <div class="adb-item-label">Wat dit kan betekenen</div>
          <div class="adb-item-text">${ctx.betekenis}</div>
        </div>
      </div>
    </div>`;
  }

  const el = document.getElementById('article-detail-content');
  el.innerHTML = `
    ${art.img ? `<img class="ad-hero" src="${art.img}" alt="${art.title}" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/art${art.id}/800/400'">` : ''}
    <span class="ad-tag" style="background:${color}20;color:${color}">${art.thema}</span>
    <h1 class="ad-title">${art.title}</h1>
    <div class="ad-meta">
      <span>📅 ${art.datum}</span>
      <span>⏱ ${art.minuten} minuten leestijd</span>
      <span>✍️ Redactie Zorgvisie</span>
    </div>
    <div class="ad-body">${art.body}</div>
    ${duidingHtml}
    <div class="ad-related">
      <div class="ad-related-title">Gerelateerde artikelen</div>
      <div class="ad-related-grid" id="related-grid"></div>
    </div>`;

  const related = ARTICLES.filter(a => a.thema === art.thema && a.id !== id).slice(0, 3);
  const rGrid   = document.getElementById('related-grid');
  related.forEach((a, i) => buildArticleCard(rGrid, a, i));

  document.getElementById('detail-back-btn').onclick = () => navigateTo(prevPage,
    document.querySelector(`[data-page="${prevPage}"]`));

  navigateTo('artikel-detail', null);
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
  if (!list.length) list = ARTICLES;
  if (artikelenFilter.thema) list = list.filter(a => a.thema === artikelenFilter.thema);
  if (artikelenFilter.zoek)  list = list.filter(a =>
    a.title.toLowerCase().includes(artikelenFilter.zoek) ||
    a.excerpt.toLowerCase().includes(artikelenFilter.zoek));
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--ink-muted);font-size:14px;grid-column:1/-1">Geen artikelen gevonden. Kies een ander thema of zoekterm.</p>';
    return;
  }
  list.forEach((art, i) => buildArticleCard(grid, art, i));
}


/* ══════════════════════════════════════
   DOSSIERS
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
function dismissIntro() {
  const el = document.getElementById('welcome-intro');
  if (el) el.style.display = 'none';
  sessionStorage.setItem('intro-dismissed', '1');
}

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
