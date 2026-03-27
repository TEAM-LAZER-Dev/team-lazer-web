/* =========================================
   PRODUCTS.JS – TEAM LAZER Shop Produktdaten
   ========================================= */

/* ── Shop-Konfiguration ── */
const SHOP_CONFIG = {
  showPrices: false,        // true = Preise anzeigen | false = "Auf Anfrage"
  priceDisplay: 'Auf Anfrage',
  ctaText: 'Anfragen',
  ctaIcon: 'fa-solid fa-envelope',
};

const PRODUCTS = [

  /* ── DISCORD SERVICES ── */
  {
    id: 'discord-server-setup',
    name: 'Discord Server Setup',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 49.99,
    badge: 'Beliebt',
    tagline: 'Dein kompletter Discord-Server – eingerichtet, designed & einsatzbereit.',
    description: 'Du erhältst einen vollständig eingerichteten Discord-Server nach deinen Vorstellungen. Von der Kanalstruktur über das Rollen- und Berechtigungssystem bis hin zu professionellem Design – wir übernehmen die gesamte Konfiguration. Ideal für Gaming-Communities, Content Creator oder Teams, die sofort loslegen wollen.',
    features: [
      'Individuelle Kanalstruktur (Text, Voice, Kategorien)',
      'Rollen- & Berechtigungssystem',
      'Willkommensnachricht & Regelwerk',
      'Bot-Basis-Setup (ModMail, Verifizierung)',
      'Custom Emojis & Server-Banner',
      'Persönliche Einweisung nach Übergabe',
    ],
    icon: 'fa-brands fa-discord',
    gradient: 'linear-gradient(135deg, #5865F2 0%, #7c3aed 100%)',
    glowColor: 'rgba(88, 101, 242, 0.4)',
    inStock: true,
    deliveryTime: '2–4 Werktage',
  },
  {
    id: 'premium-bot-integration',
    name: 'Premium Bot Integration',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 29.99,
    badge: null,
    tagline: 'Bestehende Bots professionell konfiguriert und nahtlos eingebunden.',
    description: 'Dein Server existiert bereits, aber die Bots funktionieren nicht so wie gewünscht? Wir konfigurieren Bots wie MEE6, Carl-bot, Dyno und weitere professionell für dich – perfekt abgestimmt auf deine Community und deine individuellen Anforderungen.',
    features: [
      'Konfiguration von bis zu 3 Bots',
      'Auto-Moderations-Setup',
      'Reaktionsrollen & Willkommenssystem',
      'Logging & Sicherheitseinstellungen',
      'Ticket-System Einrichtung',
      'Dokumentation aller Konfigurationen',
    ],
    icon: 'fa-solid fa-robot',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    inStock: true,
    deliveryTime: '1–2 Werktage',
  },
  {
    id: 'community-architecture',
    name: 'Community Architecture',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 89.99,
    badge: 'Premium',
    tagline: 'Vollständige Community-Infrastruktur nach dem TEAM LAZER Standard.',
    description: 'Das Premium-Paket für alle, die eine skalierbare und professionelle Community aufbauen möchten. Wir liefern das komplette Ökosystem: Server, Bots, Community-Guidelines, Moderationsstruktur und einen individuellen Wachstumsplan – alles aus einer Hand.',
    features: [
      'Kompletter Server Setup inklusive',
      'Individuelle Bot-Entwicklung & Konfiguration',
      'Moderations-Framework & Team-Onboarding',
      'Strategie für nachhaltiges Community-Wachstum',
      'Vollautomatisches Ticket-System',
      '30 Tage Support nach Projektabschluss',
    ],
    icon: 'fa-solid fa-network-wired',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #5865F2 100%)',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    inStock: true,
    deliveryTime: '5–7 Werktage',
  },

  /* ── GAMING PAKETE ── */
  {
    id: 'vip-membership-monthly',
    name: 'VIP Mitgliedschaft',
    category: 'gaming',
    categoryName: 'Gaming Pakete',
    price: 4.99,
    badge: null,
    tagline: 'Exklusiver Zugang zu allen Premium-Bereichen im TEAM LAZER Discord.',
    description: 'Als VIP-Mitglied erhältst du Zugang zu exklusiven Kanälen, Events, Giveaways und Community-Features, die regulären Mitgliedern nicht zur Verfügung stehen. Monatlich buchbar – kein Abo, kein Risiko.',
    features: [
      'Exklusive VIP-Textkanäle',
      'Priority-Zugang bei Events & Turnieren',
      'Einzigartige VIP-Rolle im Server',
      'Frühzeitiger Zugang zu Beta-Features',
      'Dedizierter Support-Kanal',
      'Monatlich kündbar',
    ],
    icon: 'fa-solid fa-crown',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    inStock: true,
    deliveryTime: 'Sofort nach Abstimmung',
    priceLabel: '/ Monat',
  },
  {
    id: 'event-pass',
    name: 'Community Event Pass',
    category: 'gaming',
    categoryName: 'Gaming Pakete',
    price: 9.99,
    badge: 'Neu',
    tagline: 'Dein Ticket zu allen offiziellen TEAM LAZER Community-Events.',
    description: 'Mit dem Event Pass sicherst du dir die Teilnahme an allen offiziellen TEAM LAZER Events im laufenden Quartal – inklusive Turniere, Scrims, Watch-Parties und Community-Nights. Gültig für 3 Monate ab Aktivierung.',
    features: [
      'Zugang zu allen Events im Quartal',
      'Turniere & Scrims inklusive',
      'Exklusive Event-Teilnehmerrolle',
      'Vorankündigungen und Eventkalender',
      'Teilnahmeberechtigung an Preispools',
      '3 Monate Laufzeit',
    ],
    icon: 'fa-solid fa-ticket',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    inStock: true,
    deliveryTime: 'Sofort nach Abstimmung',
  },
  {
    id: 'gaming-coaching',
    name: 'Gaming Coaching Session',
    category: 'gaming',
    categoryName: 'Gaming Pakete',
    price: 19.99,
    badge: null,
    tagline: 'Persönliches 1:1-Coaching von erfahrenen TEAM LAZER Spielern.',
    description: 'Dein Ranked-Rating stagniert? Unsere erfahrenen Spieler analysieren dein Gameplay, geben dir direktes Feedback und zeigen dir konkrete Strategien für deinen Lieblingstitel. Eine Session dauert ca. 60–90 Minuten und findet via Discord statt.',
    features: [
      '60–90 Minuten 1:1 Coaching via Discord',
      'Detaillierte Replay-Analyse',
      'Individuelle Verbesserungsstrategie',
      'Tipps zu Mechanik, Map-Awareness & Teamplay',
      'Terminvereinbarung nach Absprache',
      'Nachbesprechung per Chatnachricht',
    ],
    icon: 'fa-solid fa-gamepad',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    inStock: true,
    deliveryTime: 'Termin innerhalb von 7 Tagen',
  },

  /* ── DEVELOPMENT ── */
  {
    id: 'custom-discord-bot',
    name: 'Custom Discord Bot',
    category: 'development',
    categoryName: 'Development',
    price: 79.99,
    badge: null,
    tagline: 'Dein individueller Bot – entwickelt exakt nach deinen Anforderungen.',
    description: 'Du benötigst einen Bot, den es in dieser Form noch nicht gibt? Unser Entwicklungsteam programmiert dir einen maßgeschneiderten Discord-Bot mit genau den Features, die deine Community braucht – von einfachen Commands bis zu komplexen Automatisierungen.',
    features: [
      'Individuelle Command- und Feature-Entwicklung',
      'Optionale Datenbank-Anbindung',
      'Hosting-Empfehlung und Setup-Begleitung',
      'Vollständige Source-Code-Übergabe',
      'Ausführliche Befehlsdokumentation',
      '14 Tage Bugfix-Garantie nach Launch',
    ],
    icon: 'fa-solid fa-code',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    inStock: true,
    deliveryTime: '7–14 Werktage',
  },
  {
    id: 'web-starter-paket',
    name: 'Web Starter Paket',
    category: 'development',
    categoryName: 'Development',
    price: 149.99,
    badge: 'Empfohlen',
    tagline: 'Deine professionelle Website – realisiert von TEAM LAZER Entwicklern.',
    description: 'Du möchtest online präsent sein, aber weißt nicht wo anfangen? Wir entwickeln dir eine maßgeschneiderte, vollständig responsive Website im modernen Dark-Theme-Design – optional angelehnt an den TEAM LAZER Stil oder nach deinen eigenen Vorstellungen. Perfekt für Gaming-Clans, Streamer und Communities.',
    features: [
      'Bis zu 4 individuelle Seiten',
      'Vollständig responsiv (Mobile, Tablet, Desktop)',
      'Modernes Dark-Theme-Design',
      'Kontaktformular & Social Media Integration',
      'SEO-Grundkonfiguration & Performance-Optimierung',
      'Source-Code-Übergabe inkl. Deployment-Beratung',
    ],
    icon: 'fa-solid fa-globe',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    inStock: true,
    deliveryTime: '10–21 Werktage',
  },
  {
    id: 'security-audit',
    name: 'Server Security Audit',
    category: 'development',
    categoryName: 'Development',
    price: 39.99,
    badge: null,
    tagline: 'Professionelle Sicherheitsanalyse deines Discord-Servers.',
    description: 'Unser Cybersecurity-Team analysiert deinen Discord-Server systematisch auf Schwachstellen, unsichere Berechtigungen und potenzielle Angriffsvektoren. Du erhältst einen detaillierten Bericht mit priorisierten Handlungsempfehlungen – und optional beheben wir alle gefundenen Probleme direkt.',
    features: [
      'Vollständige Berechtigungs- und Rollenanalyse',
      'Bot-Sicherheitsüberprüfung',
      'Überprüfung aller Zugriffsrechte',
      'Detaillierter Sicherheitsbericht (PDF)',
      'Priorisierte Empfehlungen zur Behebung',
      'Optionale direkte Problemlösung auf Anfrage',
    ],
    icon: 'fa-solid fa-shield-halved',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    inStock: true,
    deliveryTime: '3–5 Werktage',
  },

];

/* ── Hilfsfunktionen ── */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function getProductsByCategory(category) {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

function getRelatedProducts(product, count = 3) {
  return PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, count);
}

function getPriceDisplay(product) {
  if (!SHOP_CONFIG.showPrices) return SHOP_CONFIG.priceDisplay;
  const label = product.priceLabel ? `<span class="price-label">${product.priceLabel}</span>` : '';
  return `€${product.price.toFixed(2).replace('.', ',')}${label}`;
}
