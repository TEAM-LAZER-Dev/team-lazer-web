// TEAM LAZER – Bot data
// Edit this file to update bot listings

export const BOTS = [
  {
    id: 'tl-hub',
    name: 'TEAM LAZER Hub',
    shortDesc: 'Der offizielle Community-Bot von TEAM LAZER.',
    description:
      'Der TEAM LAZER Hub Bot ist das Herzstück unserer Community. Moderation, Willkommensnachrichten, Tickets, Rollen-Verwaltung und vieles mehr – alles in einem Bot.',
    icon: null, // set to '/images/bots/hub.webp'
    color: '#7c3aed',
    tags: ['Moderation', 'Utility', 'Tickets', 'Willkommen'],
    stats: {
      servers: 5,
      commands: 24,
      uptime: '99.8%',
      version: 'v2.1',
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=REPLACE_ME&scope=bot+applications.commands&permissions=8',
    dashboardUrl: 'https://dashboard.team-lazer.de',
    hasDashboard: true,
    status: 'online', // online | maintenance | beta
    developer: 'fivozo',
  },
  {
    id: 'tl-stats',
    name: 'TL Stats',
    shortDesc: 'Server-Statistiken und Aktivitäts-Tracking.',
    description:
      'TL Stats trackt die Aktivität auf deinem Discord-Server. Nachrichten, Voice-Stunden, Command-Nutzung – alles übersichtlich im Dashboard.',
    icon: null,
    color: '#10b981',
    tags: ['Statistiken', 'Tracking', 'Dashboard'],
    stats: {
      servers: 3,
      commands: 12,
      uptime: '99.5%',
      version: 'v1.4',
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=REPLACE_ME&scope=bot+applications.commands&permissions=8',
    dashboardUrl: 'https://stats.team-lazer.de',
    hasDashboard: true,
    status: 'beta',
    developer: 'fivozo',
  },
  {
    id: 'tl-music',
    name: 'TL Music',
    shortDesc: 'Musik in deinen Voice-Channel streamen.',
    description:
      'TL Music spielt Musik direkt in deinen Voice-Channel. YouTube, Spotify, SoundCloud – einfach den Link posten und loslegen.',
    icon: null,
    color: '#f59e0b',
    tags: ['Musik', 'YouTube', 'Spotify'],
    stats: {
      servers: 2,
      commands: 18,
      uptime: '98.9%',
      version: 'v1.0',
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=REPLACE_ME&scope=bot+applications.commands&permissions=8',
    dashboardUrl: null,
    hasDashboard: false,
    status: 'beta',
    developer: 'fivozo',
  },
]
