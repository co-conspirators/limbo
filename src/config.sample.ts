const config = {
  appLauncher: {
    command: 'tofi-drun --drun-launch=true',
  },
  weather: {
    // 'si' or 'us'
    unit: 'si',
    // Formatted like 'City,CC'
    location: 'Toronto,CA',
    // Get from https://www.latlong.net/
    lat: 43.65189,
    lon: -79.381706,
    // Get from http://pirateweather.net/en/latest/
    apiToken: '***',
  },
  todoist: {
    // https://app.todoist.com/app/settings/integrations/developer
    apiToken: '***',
  },
  github: {
    // Classic token with the 'notifications' scope
    // https://github.com/settings/tokens
    apiToken: '***',
  },
  twitch: {
    channels: ['simply', 'tarik', 'jerma985', 'clintstevens', 'liam'],
    clientId: '***',
    clientSecret: '***',
  },
  modules: {
    left: ['app-launcher', 'notifications', 'twitch', 'music'],
    center: ['workspaces'],
    right: ['tray', 'quick-settings', 'clock'],
  },
}

export default config
