const config = {
  modules: {
    left: ['app-launcher', 'notifications', 'twitch', 'music'],
    center: ['workspaces'],
    right: ['sysmon', 'tray', 'quick-settings', 'clock'],
  },
  appLauncher: {
    command: 'tofi-drun --drun-launch=true',
  },
  notifications: {
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
    github: {
      // Classic token with the 'notifications' scope
      // https://github.com/settings/tokens
      apiToken: '***',
    },
  },
  quickSettings: {
    icons: {
      segments: ['brightness', 'dnd', 'mic', 'volume', 'network', 'battery', 'toggle'],
      dnd: {
        toggleCmd: 'makoctl mode -t do-not-disturb',
        statusCmd: 'makoctl mode',
        historyCmd: 'makoctl restore',
      },
      volume: {
        // volume change step size, 0.05 is 5%
        step: 0.05,
      },
    },
  },
  sysmon: {
    // update interval in ms
    interval: 3000,
    // number of decimal places to round to
    precision: 1,
    onClick: 'hyprctl dispatch exec [float] kitty btop',
    onRightClick: `hyprctl dispatch exec [float] kitty 'fish -c "sudo ps_mem; read -n 1 -p \"echo hey\""'`,
    enabledSegments: ['cpu', 'temp', 'ram'],
    // Use `sensors` to find preferred temperature source, then run
    // $ for i in /sys/class/hwmon/hwmon*/temp*_input; do echo "$(<$(dirname $i)/name): $(cat ${i%_*}_label 2>/dev/null || echo $(basename ${i%_*})) $(readlink -f $i)"; done
    // to find path to desired file
    cpuTempPath: '',
  },
  twitch: {
    channels: ['simply', 'tarik', 'jerma985', 'clintstevens', 'liam'],
    clientId: '***',
    clientSecret: '***',
  },
  theme: {
    font: 'IBM Plex Mono',
    borderRadius: 4,
    colours: {
      fg: '#f0f4ff',
      bg: '#2c2c3f',
      bgAlt: '#1e1e2e',
      blue: '#89b4fa',
      cyan: '#bee4ed',
      green: '#a6e3a1',
      orange: '#fab387',
      pink: '#f5c2e7',
      purple: '#cba6f7',
      red: '#f38ba8',
      yellow: '#f9e2af',
    },
  },
}

export default config
