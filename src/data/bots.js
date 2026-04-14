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
    hasDashboard: false,
    status: 'online', // online | maintenance | beta
    developer: 'fivozo',
    private: true, // privater Bot – kein Invite, kein Dashboard
  },
  {
    id: 'nexus',
    name: 'Nexus',
    shortDesc: 'Kostenloser All-in-One Bot mit Web-Dashboard.',
    description:
      'Nexus ist vollständig kostenlos und öffentlich zugänglich – ohne Abos, ohne versteckte Kosten. Moderation, Tickets, Welcome-System, Statistiken, Bot-Name und vieles mehr lassen sich bequem über das Web-Dashboard nach eigenen Wünschen anpassen.',
    icon: null,
    color: '#10b981',
    tags: ['Open Source', 'All-in-One', 'Dashboard', 'Moderation', 'Leveling'],
    stats: {
      servers: 1,
      commands: 10,
      uptime: 'N/A',
      version: 'N/A',
    },
    inviteUrl: 'https://discord.com/oauth2/authorize?client_id=REPLACE_ME&scope=bot+applications.commands&permissions=8',
    dashboardUrl: 'https://nexus.team-lazer.de',
    hasDashboard: true,
    status: 'beta',
    developer: 'TEAM LAZER',
    private: false,
  },
]
