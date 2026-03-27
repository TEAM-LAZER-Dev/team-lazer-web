/* =========================================
   PRODUCTS.JS – TEAM LAZER Leistungen
   ========================================= */

const SHOP_CONFIG = {
  showPrices: false,
  priceDisplay: 'Auf Anfrage',
  ctaText: 'Anfragen',
  ctaIcon: 'fa-solid fa-envelope',
};

const PRODUCTS = [

  /* ── WEBSITES ── */
  {
    id: 'landing-page',
    name: 'Landing Page',
    category: 'websites',
    categoryName: 'Website Entwicklung',
    price: 0,
    badge: 'Beliebt',
    tagline: 'Eine starke Einzelseite, die überzeugt – für Produkte, Events oder Dienstleistungen.',
    description: 'Eine professionell gestaltete Landing Page, die auf ein klares Ziel ausgerichtet ist: Besucher überzeugen, Anfragen generieren, Produkte vorstellen. Responsiv, schnell und modern – entwickelt mit HTML, CSS und JavaScript ohne unnötigen Overhead.',
    features: [
      'Vollständig responsive (Mobile, Tablet, Desktop)',
      'Modernes Dark- oder helles Design nach Wunsch',
      'Kontaktformular / Call-to-Action integriert',
      'Animationen und Scroll-Effekte',
      'SEO-Grundoptimierung',
      'Lieferung als fertige Dateien inkl. Deployment-Hilfe',
    ],
    icon: 'fa-solid fa-mobile-screen',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    glowColor: 'rgba(37, 99, 235, 0.4)',
    inStock: true,
    deliveryTime: '3–7 Werktage',
  },
  {
    id: 'website-starter',
    name: 'Starter Website',
    category: 'websites',
    categoryName: 'Website Entwicklung',
    price: 0,
    badge: 'Empfohlen',
    tagline: 'Deine professionelle Präsenz im Web – bis zu 5 Seiten, sauber entwickelt.',
    description: 'Die Starter Website ist ideal für alle, die online professionell auftreten möchten: Freelancer, kleine Unternehmen, Gaming-Teams oder Content Creator. Wir entwickeln eine mehrseite Website nach deinen Vorstellungen – vom Design bis zur Übergabe alles aus einer Hand.',
    features: [
      'Bis zu 5 individuelle Unterseiten',
      'Individuelles Design nach deinen Vorgaben',
      'Vollständig responsiv für alle Geräte',
      'Kontaktformular mit E-Mail-Weiterleitung',
      'Impressum & Datenschutz auf Wunsch integriert',
      'Source-Code-Übergabe inkl. Hosting-Beratung',
    ],
    icon: 'fa-solid fa-globe',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    inStock: true,
    deliveryTime: '7–14 Werktage',
  },
  {
    id: 'website-custom',
    name: 'Custom Website',
    category: 'websites',
    categoryName: 'Website Entwicklung',
    price: 0,
    badge: 'Premium',
    tagline: 'Individuelles Webprojekt ohne Kompromisse – nach deinen genauen Vorstellungen.',
    description: 'Du hast spezielle Anforderungen, eine klare Designvision oder brauchst mehr als eine Standardlösung? Im Custom-Paket entwickeln wir dein Projekt von Grund auf nach Briefing – beliebig viele Seiten, individuelle Features, besondere Animationen oder komplexere Strukturen. Preis auf Anfrage nach Projektumfang.',
    features: [
      'Unbegrenzte Seitenanzahl und Struktur',
      'Vollständig individuelles Design-Konzept',
      'Erweiterte Animationen und Interaktionen',
      'Individuelle Features nach Briefing',
      'Mehrstufiger Feedback-Prozess',
      '30 Tage Support nach Projektabschluss',
    ],
    icon: 'fa-solid fa-wand-magic-sparkles',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    inStock: true,
    deliveryTime: 'Nach Absprache',
  },

  /* ── DISCORD BOTS ── */
  {
    id: 'basic-bot',
    name: 'Basic Discord Bot',
    category: 'bots',
    categoryName: 'Discord Bots',
    price: 0,
    badge: null,
    tagline: 'Dein erster eigener Bot – einfache Befehle, zuverlässig und sauber entwickelt.',
    description: 'Du brauchst einen Bot für einfache Aufgaben auf deinem Server? Der Basic Bot deckt grundlegende Funktionen ab – Slash-Commands, automatische Nachrichten, einfache Moderationshelfer oder kleine Spielereien. Ideal für kleinere Server oder als Einstieg in Bot-Automatisierung.',
    features: [
      'Bis zu 5 individuelle Slash-Commands',
      'Entwickelt in Python (discord.py) oder JavaScript',
      'Buttons, Dropdowns und Embeds',
      'Vollständige Source-Code-Übergabe',
      'Anleitung zur Selbst-Hostung',
      '14 Tage Bugfix-Garantie',
    ],
    icon: 'fa-solid fa-robot',
    gradient: 'linear-gradient(135deg, #5865F2 0%, #7c3aed 100%)',
    glowColor: 'rgba(88, 101, 242, 0.4)',
    inStock: true,
    deliveryTime: '3–7 Werktage',
  },
  {
    id: 'advanced-bot',
    name: 'Advanced Discord Bot',
    category: 'bots',
    categoryName: 'Discord Bots',
    price: 0,
    badge: 'Beliebt',
    tagline: 'Komplexer Bot mit Datenbank, Automatisierungen und individuellen Systemen.',
    description: 'Für Server, die mehr brauchen als einfache Commands: Der Advanced Bot verbindet individuelle Logik, Datenbank-Anbindung und ausgefeilte Automatisierungen. Ticket-Systeme, Leveling, Economy, Verification oder ganz eigene Ideen – wir setzen um, was du dir vorstellst.',
    features: [
      'Unbegrenzte Commands und Funktionen',
      'Datenbank-Anbindung (SQLite / PostgreSQL)',
      'Ticket-System, Leveling, Economy oder Eigenes',
      'Automatische Aufgaben (Scheduled Tasks)',
      'Vollständige Dokumentation aller Features',
      '30 Tage Support nach Übergabe',
    ],
    icon: 'fa-solid fa-microchip',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
    glowColor: 'rgba(124, 58, 237, 0.4)',
    inStock: true,
    deliveryTime: '7–21 Werktage',
  },
  {
    id: 'bot-anpassung',
    name: 'Bot Anpassung',
    category: 'bots',
    categoryName: 'Discord Bots',
    price: 0,
    badge: null,
    tagline: 'Bestehenden Bot erweitern, reparieren oder auf deinen Server anpassen.',
    description: 'Du hast bereits einen Bot – er funktioniert aber nicht so wie du willst, braucht neue Features oder hat Bugs? Wir schauen uns deinen Code an, beheben Probleme und bauen aus, was du brauchst. Auch für Bot-Source-Code den du selbst besitzt.',
    features: [
      'Analyse und Review des bestehenden Codes',
      'Bugfixes und Stabilitätsverbesserungen',
      'Neue Features nach deinen Wünschen',
      'Code-Optimierung und Aufräumarbeiten',
      'Verständliche Kommentierung des Codes',
      'Festpreis nach Aufwandsschätzung',
    ],
    icon: 'fa-solid fa-screwdriver-wrench',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    inStock: true,
    deliveryTime: 'Nach Absprache',
  },

  /* ── DISCORD SERVICES ── */
  {
    id: 'discord-server-setup',
    name: 'Server Setup',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 0,
    badge: null,
    tagline: 'Dein Discord-Server – komplett eingerichtet, strukturiert und einsatzbereit.',
    description: 'Egal ob neuer Server oder Neuaufstellung eines bestehenden: Wir richten deinen Discord-Server professionell ein. Kanalstruktur, Rollensystem, Berechtigungen, Bots, Design – alles aufeinander abgestimmt und sofort nutzbar.',
    features: [
      'Individuelle Kanal- und Kategorienstruktur',
      'Rollen- & Berechtigungssystem',
      'Willkommen- und Verifizierungssystem',
      'Bot-Basis-Setup nach Wahl',
      'Custom Emojis & Server-Banner auf Wunsch',
      'Einweisung nach Übergabe',
    ],
    icon: 'fa-brands fa-discord',
    gradient: 'linear-gradient(135deg, #5865F2 0%, #7c3aed 100%)',
    glowColor: 'rgba(88, 101, 242, 0.4)',
    inStock: true,
    deliveryTime: '2–5 Werktage',
  },
  {
    id: 'discord-full-package',
    name: 'Discord Komplett-Paket',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 0,
    badge: 'Premium',
    tagline: 'Server Setup + Custom Bot + Moderationsstruktur – alles aus einer Hand.',
    description: 'Das Rundum-Paket für alle, die eine skalierbare Community aufbauen wollen. Wir liefern den kompletten Discord-Stack: professioneller Server-Aufbau, ein individuell entwickelter Bot, Community-Guidelines und eine fertige Moderationsstruktur für euer Team.',
    features: [
      'Komplettes Server Setup inklusive',
      'Individuell entwickelter Community Bot',
      'Ticket-System und Moderations-Automatisierungen',
      'Community-Guidelines & Onboarding-System',
      'Team-Onboarding und Moderatoren-Einweisung',
      '30 Tage Support nach Abschluss',
    ],
    icon: 'fa-solid fa-network-wired',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #5865F2 100%)',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    inStock: true,
    deliveryTime: '7–14 Werktage',
  },
  {
    id: 'automation-script',
    name: 'Automation & Skripte',
    category: 'discord',
    categoryName: 'Discord Services',
    price: 0,
    badge: 'Neu',
    tagline: 'Kleine Skripte und Automatisierungen die dir Zeit sparen.',
    description: 'Du hast eine repetitive Aufgabe, die automatisiert werden könnte? Wir entwickeln kleine Python- oder JavaScript-Skripte und Automatisierungen: Datenverarbeitung, APIs verbinden, Webhooks, automatische Berichte, Discord-Webhooks und vieles mehr.',
    features: [
      'Python oder JavaScript nach Wahl',
      'Discord Webhooks und API-Integrationen',
      'Automatische Aufgaben und Scheduler',
      'Datenverarbeitung und einfache APIs',
      'Vollständige Source-Code-Übergabe',
      'Festpreis nach Aufwandsschätzung',
    ],
    icon: 'fa-solid fa-gears',
    gradient: 'linear-gradient(135deg, #10b981 0%, #7c3aed 100%)',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    inStock: true,
    deliveryTime: '2–7 Werktage',
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
