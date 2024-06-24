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
    crust: '#11111b',
    mantle: '#181825',
    base: '#1e1e2e',
    core: '#2c2c3f',

    surface0: '#313244',
    surface1: '#45475a',
    surface2: '#585b70',

    overlay0: '#6c7086',
    overlay1: '#7f849c',
    overlay2: '#9399b2',

    subtext0: '#a6adc8',
    subtext1: '#bac2de',
    subtext2: '#cdd6f4',
    text: '#f0f4ff',

    primary: '#89b4fa',
    primaryDark: '#5f8cfb',

    lavender: '#b4befe',
    lavenderDark: '#7f8cfe',

    blue: '#89b4fa',
    blueDark: '#5f8cfb',

    sapphire: '#74c7ec',
    sapphireDark: '#4a9edc',

    sky: '#89dceb',
    skyDark: '#5f9edc',

    teal: '#94e2d5',
    tealDark: '#5fb9a8',

    green: '#a6e3a1',
    greenDark: '#5fbf6b',

    yellow: '#f9e2af',
    yellowDark: '#f5c77b',

    peach: '#fab387',
    peachDark: '#f5a87b',

    maroon: '#eba0ac',
    maroonDark: '#c97b84',

    red: '#f38ba8',
    redDark: '#c97b84',

    mauve: '#cba6f7',
    mauveDark: '#a17be3',

    pink: '#f5c2e7',

    flamingo: '#f2cdcd',

    rosewater: '#f5e0dc',

    cyan: '#bee4ed',

    borderRadius: 4,
  },
}

export default config
