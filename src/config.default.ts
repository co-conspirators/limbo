import type { Config } from './config'

const theme = {
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
}

const config: Config = {
  general: {
    timeFormat: '12h',
    unit: 'metric',
    lat: 0,
    lon: 0,
    debug: false,
  },
  theme: {
    font: 'IBM Plex Mono',
    borderRadius: 6,
  },
  bar: {
    theme: {
      bg: theme.base,
      sectionBg: theme.core,
      fg: theme.text,
    },
    modules: {
      left: ['app-launcher', 'notifications', 'twitch', 'music'],
      center: ['workspaces'],
      right: ['sysmon', 'quick-settings', 'clock'],
    },
    appLauncher: {
      icon: { name: 'nix-snowflake-white', color: theme.text },
      onPrimaryClick: 'tofi-drun',
    },
    clock: {
      icon: { name: 'clock', color: theme.text },
    },
    notifications: {
      segments: ['weather', 'todoist', 'github'],
      weather: {
        temperature: 'apparent',
        icon: {
          color: {
            day: theme.yellow,
            night: theme.blue,
            rain: theme.blue,
            snow: theme.text,
            fog: theme.text,
            wind: theme.text,
            cloud: theme.text,
          },
        },
        onPrimaryClick: 'xdg-open https://merrysky.net',
        apiToken: '',
      },
      todoist: {
        icon: {
          name: 'checkbox',
          color: theme.red,
        },
        apiToken: '',
      },
      github: {
        icon: {
          name: 'brand-github',
          color: theme.text,
        },
        onPrimaryClick: 'xdg-open https://github.com/notifications',
        apiToken: '',
      },
    },
    quickSettings: {
      segments: ['tray', 'night-light', 'dnd', 'mic', 'volume', 'network', 'toggle'],
      tray: {
        ignoredApps: [],
        appIconMappings: {},
        sortFunction: (a: { title: string }, b: { title: string }) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      },
      nightLight: {
        dayTemp: 6500,
        nightTemp: 4000,
        fadeDurationMinutes: 30,
        offIcon: {
          name: 'moon-off',
          color: theme.yellow,
        },
        onIcon: {
          name: 'moon',
          color: theme.yellow,
        },
        forcedIcon: {
          name: 'moon-stars',
          color: theme.yellow,
        },
      },
      dnd: {
        icon: {
          name: 'bell',
          color: theme.red,
        },
        dndIcon: {
          name: 'bell-off',
          color: theme.red,
        },
        toggleCmd: 'dunstctl set-paused toggle',
        statusCmd: 'dunstctl is-paused',
        historyCmd: 'dunstctl history-pop',
        dismissCmd: 'dunstctl close',
      },
      mic: {
        icon: {
          name: 'microphone',
          color: theme.pink,
        },
        muteIcon: {
          name: 'microphone-off',
          color: theme.red,
        },
        onSecondaryClick: 'pavucontrol --tab=4',
      },
      volume: {
        rampIcons: [
          { name: 'volume-3', color: theme.flamingo },
          { name: 'volume-2', color: theme.flamingo },
          { name: 'volume', color: theme.flamingo },
        ],
        muteIcon: {
          name: 'volume-off',
          color: theme.red,
        },
        headphonesRamp: [
          { name: 'headphones-off', color: theme.flamingo },
          { name: 'headphones', color: theme.flamingo },
        ],
        headphonesMute: {
          name: 'headphones-off',
          color: theme.red,
        },
        step: 0.05,
        onSecondaryClick: 'pavucontrol --tab=3',
      },
      network: {
        rampIcons: [
          { name: 'wifi', color: theme.blue },
          { name: 'wifi-2', color: theme.blue },
          { name: 'wifi-1', color: theme.blue },
        ],
        offIcon: {
          name: 'wifi-off',
          color: theme.red,
        },
        ethernetIcon: {
          name: 'network',
          color: theme.sky,
        },
        ethernetOffIcon: {
          name: 'network-off',
          color: theme.red,
        },
      },
      battery: {
        rampIcons: [
          { name: 'battery-4', color: theme.green },
          { name: 'battery-3', color: theme.green },
          { name: 'battery-2', color: theme.green },
          { name: 'battery-1', color: theme.yellow },
          { name: 'battery', color: theme.red },
        ],
        chargingIcon: {
          name: 'battery-charging',
          color: theme.yellow,
        },
      },
      brightness: {
        rampIcons: [
          { name: 'brightness-up', color: theme.yellow },
          { name: 'brightness-half', color: theme.yellow },
          { name: 'brightness-down', color: theme.yellow },
        ],
        step: 0.05,
      },
      toggle: {
        icon: {
          name: 'chevron-down',
          color: theme.text,
        },
        openIcon: {
          name: 'chevron-up',
          color: theme.text,
        },
      },
    },
    sysmon: {
      probeIntervalMs: 3000,
      precision: 1,
      onPrimaryClick: 'hyprctl dispatch exec [float] kitty btop',
      segments: ['cpu', 'temp', 'ram'],
      cpu: {
        icon: {
          name: 'cpu',
          color: theme.lavender,
        },
      },
      ram: {
        icon: {
          name: 'cpu-2',
          color: theme.pink,
        },
      },
      temp: {
        icon: {
          name: 'temperature',
          color: theme.red,
        },
        path: '',
      },
    },
    todo: {
      soundUrl: 'https://todoist.b-cdn.net/assets/sounds/d8040624c9c7c88aa730f73faa60cf39.mp3',
      icon: {
        name: 'square',
        color: theme.red,
      },
    },
    twitch: {
      icon: {
        name: 'brand-twitch',
        color: '#DDB6F2',
      },
      channels: [],
      clientId: '',
      clientSecret: '',
    },
    workspaces: {
      monitors: [{ workspaces: [1, 2, 3, 4, 5, 6] }, { workspaces: [7, 8, 9, 10, 11, 12] }],
      color: {
        active: theme.blue,
        hasWindows: theme.blue,
        normal: theme.surface2,
      },
    },
  },
}
export default config
