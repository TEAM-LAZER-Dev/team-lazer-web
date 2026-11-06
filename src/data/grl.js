// Inhalte der GRL-Seite. Alles stammt aus dem GRL-Discord (info, first-steps, news, regelwerke-turniere, grl-info).
// Bei Änderungen im Discord hier nachziehen. Was nicht belegt ist, steht hier nicht.

export const STAGES = [
  {
    id: 'join', mock: 'join', label: 'Beitritt',
    title: 'Server beitreten',
    text: 'Komm auf den Discord, lies die Regeln und akzeptiere sie. Danach sind die Kanäle für dich offen.',
  },
  {
    id: 'rank', mock: 'rank', label: 'Ranking',
    title: 'Ranking beantragen',
    text: 'Für Turniere brauchst du ein gültiges GRL-Ranking. Du beantragst es im Ticket-System und reichst dort deine Activision ID und deinen Twitch-Link ein.',
  },
  {
    id: 'signup', mock: 'signup', label: 'Turnier',
    title: 'Zum Turnier anmelden',
    text: 'Mit Ranking meldest du dich für die nächsten Turniere an. Das Ranking sorgt dafür, dass die Teams möglichst fair zusammengestellt werden.',
  },
  {
    id: 'result', mock: 'result', label: 'Ergebnis',
    title: 'Spielen & Ergebnis einreichen',
    text: 'Nach der Runde reicht dein Team die Nachweise ein – je nach Regelwerk Scoreboard und Placement. Fehlt ein Nachweis, kann die Runde nicht gewertet werden.',
  },
  {
    id: 'champs', mock: 'champs', label: 'Champs',
    title: 'Aufsteigen',
    text: 'Die Gewinner landen bei den Champs. Dazu gibt es Statistiken, Player Cards und die Hall of Fame.',
  },
]

export const ARENA = {
  Systeme: ['Single Elimination', 'Double Elimination', 'Schweizer System', 'Round Robin'],
  Modi: ['TKR (Time Killrace)', 'Killrace', 'Total Of', 'Matchpoint', 'David vs Goliath'],
  Teamformate: ['Fair Wheel', 'Normal Wheel', 'Regular', 'Draft', 'Draft mit Cap', 'Draft CoED', 'Trio Oddmann Killrace'],
}

export const MULTIPLAYER = [
  { big: 'S&D', title: 'Search & Destroy', text: '1vs1 bis 4vs4' },
  { big: 'HP', title: 'Hardpoint', text: '2vs2 bis 4vs4' },
  { big: 'ELO', title: 'Eigene MP-Elo', text: 'Siege gegen Stärkere zählen mehr – unabhängig von den Warzone-Rängen.' },
]

// Wochenrückblick aus dem Kanal #news (Stand: 26.10. – 01.11.2026)
export const WEEK = {
  label: 'Wochenrückblick · 26.10. – 01.11.2026',
  items: [
    { v: 6, l: 'Turniere' },
    { v: 41, l: 'Teams' },
    { v: 47, l: 'Spieler' },
    { v: 7142, l: 'Kills' },
  ],
}

export const RULES = [
  {
    id: 'tkr', name: 'TKR', full: 'Time KillRace', icon: 'fa-solid fa-stopwatch',
    points: [
      'Cheats, Glitches, VPN und vergleichbare Tools sind verboten. ExitLag mit Standort Deutschland ist erlaubt.',
      'Gespielt wird als Trio oder Squad in einer Squad-Public-Lobby.',
      'Pro Runde zählen Scoreboard und Placement als Nachweis.',
    ],
  },
  {
    id: 'killrace', name: 'Killrace', full: 'Killrace-Regelwerk', icon: 'fa-solid fa-skull',
    points: [
      'Public Lobbys, Wertung pro Map.',
      'Mindestens ein Spieler pro Team streamt durchgehend auf Twitch mit öffentlicher VOD.',
      'Der Host wechselt nach jeder Runde.',
    ],
  },
  {
    id: 'custom', name: 'Custom-Lobby', full: 'Custom-Lobby-Regelwerk', icon: 'fa-solid fa-gears',
    points: [
      'Sniper, Schrotflinten und Raketenwerfer sind komplett verboten.',
      'Platzierung und Kills müssen auf dem Nachweis klar erkennbar sein.',
      'Bei verbotenen Inhalten gibt es für die Runde 0 Punkte.',
    ],
  },
]

// Öffentliche Kanäle des Servers (Stand 06.11.2026). desc nur dort, wo der Inhalt belegt ist.
export const CHANNELS = [
  {
    cat: 'START',
    list: [
      { e: '📜', n: 'regeln' },
      { e: '📰', n: 'ankündigungen' },
      { e: '🗞️', n: 'news', desc: 'Neuigkeiten und der wöchentliche Rückblick: Turniere, Teams, Spieler und Kills der Woche.' },
      { e: '👋', n: 'willkommen' },
      { e: '📚', n: 'grl-info', desc: 'Alles Wichtige an einem Ort: Erste Schritte, Turniere, Ranking, Regelwerke, FAQ und Ticketsystem.' },
      { e: '📡', n: 'live-ankündigungen' },
      { e: '🔗', n: 'partner', desc: 'Partner-Server der GRL – darunter der TEAM LAZER Discord.' },
    ],
  },
  {
    cat: 'WICHTIG',
    list: [
      { e: '📌', n: 'info', desc: 'Willkommen bei der German Rising League: Warzone-Turniere, eigenes Ranking, TKR- und Killrace-Events, Statistiken, Player Cards und Hall of Fame.' },
      { e: '🚀', n: 'first-steps', desc: 'Community-Regeln und der Weg ins erste Turnier: erst Ranking beantragen, dann anmelden.' },
      { e: '🎮', n: 'modi-erklärungen', desc: 'Erklärungen zu Turniersystemen, Spielmodi und Teamformaten.' },
      { e: '📖', n: 'regelwerke-turniere', desc: 'Die Regelwerke für TKR, Killrace und Custom-Lobby.' },
    ],
  },
  {
    cat: 'COMMUNITY',
    list: [
      { e: '💬', n: 'laberecke' },
      { e: '🔎', n: 'spielersuche', desc: 'Mitspieler und Teams finden.' },
      { e: '🏆', n: 'leaderboard', desc: 'Die Rangliste der gerankten Spieler.' },
      { e: '📸', n: 'medien' },
      { e: '🕹️', n: 'rising-stars-bestenliste', desc: 'GRL Rising: das eigene Jump ’n’ Run mit 50 Leveln in 5 Welten – hier steht die Bestenliste.' },
      { e: '👑', n: 'champs', desc: 'Hier werden die Gewinner der Turniere festgehalten.' },
      { e: '📰', n: 'grl-times', desc: 'THE GRL TIMES – die Zeitung zu den Turnieren.' },
      { e: '💡', n: 'vorschläge' },
    ],
  },
  {
    cat: 'SUPPORT',
    list: [
      { e: '🎫', n: 'ticket-erstellen', desc: 'Ranking-Antrag, Support oder Feedback – der Bot führt dich per Ticket durch.' },
      { e: '🔊', n: 'Eigenen-Talk-erstellen', voice: true, desc: 'Mit einem Klick einen eigenen Voice-Raum erstellen.' },
    ],
  },
]
