import defaultConfig from './config.default'
import userConfig from '../user-config'

/// Merge default and user config

function deepMerge(
  target: Record<PropertyKey, any>,
  source: Record<PropertyKey, any>,
): Record<PropertyKey, any> {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]))
    }
  }
  return { ...target, ...source }
}
export default deepMerge(defaultConfig, userConfig) as Config

/// Types

type General = {
  timeFormat: '12h' | '24h'
  unit: 'metric' | 'imperial'
  /** Get from https://www.latlong.net/ */
  lat: number
  /** Get from https://www.latlong.net/ */
  lon: number

  debug: boolean
}

type Theme = {
  font: string
  borderRadius: number
}

type BarTheme = {
  bg: string
  sectionBg: string
  fg: string
}

type ModuleName =
  | 'app-launcher'
  | 'notifications'
  | 'twitch'
  | 'music'
  | 'workspaces'
  | 'sysmon'
  | 'quick-settings'
  | 'clock'
type Modules = {
  left: ModuleName[]
  center: ModuleName[]
  right: ModuleName[]
}

export type MouseCommands = {
  onPrimaryClick?: string
  onMiddleClick?: string
  onSecondaryClick?: string
  onScrollUp?: string
  onScrollDown?: string
}
type Icon = {
  name: string
  color: string
}
type Text = {
  color?: string
}

type AppLauncher = {
  icon: Icon
} & MouseCommands

/** See the general section for timeFormat */
type Clock = {
  icon: Icon
}

type Notifications = {
  segments: ('weather' | 'todoist' | 'github')[]
  weather: {
    temperature: 'apparent' | 'exact'
    icon: {
      color: {
        day: string
        night: string
        rain: string
        snow: string
        fog: string
        wind: string
        cloud: string
      }
    }
    text?: Text
    /** Get from http://pirateweather.net/en/latest/ */
    apiToken: string
  } & MouseCommands
  todoist: {
    icon: Icon
    text?: Text
    /** Get from https://todoist.com/prefs/integrations */
    apiToken: string
  } & MouseCommands
  github: {
    icon: Icon
    text?: Text
    /** Classic token with the 'notifications' scope */
    apiToken: string
  } & MouseCommands
}

type QuickSettings = {
  segments: (
    | 'tray'
    | 'night-light'
    | 'brightness'
    | 'dnd'
    | 'mic'
    | 'volume'
    | 'network'
    | 'battery'
    | 'toggle'
  )[]
  nightLight: {
    dayIcon: Icon
    nightIcon: Icon
    dayTemp: number
    nightTemp: number
  } & MouseCommands
  tray: {
    ignoredApps: string[]
    appIconMappings: Record<string, Icon>
  }
  brightness: {
    /** Ramp for the brightness from max to min */
    rampIcons: Icon[]
    /** Brightness change step size, 0.05 is 5% */
    step: number
  }
  dnd: {
    icon: Icon
    dndIcon: Icon

    toggleCmd: string
    statusCmd: string
    historyCmd: string
    dismissCmd: string
  }
  mic: {
    icon: Icon
    muteIcon: Icon
  } & Pick<MouseCommands, 'onSecondaryClick'>
  volume: {
    /** Ramp for the volume from max to min */
    rampIcons: Icon[]
    muteIcon: Icon
    headphonesMute: Icon
    headphonesRamp: Icon[]
    /** Volume change step size, 0.05 is 5% */
    step: number
  } & Pick<MouseCommands, 'onSecondaryClick'>
  network: {
    /** Ramp for the network strength from max to min */
    rampIcons: Icon[]
    offIcon: Icon
    ethernetIcon: Icon
    ethernetOffIcon: Icon
  } & MouseCommands
  battery: {
    /** Ramp for the battery level from max to min */
    rampIcons: Icon[]
    chargingIcon: Icon
  }
  toggle: { icon: Icon; openIcon: Icon }
}

type SysMon = {
  segments: ('cpu' | 'temp' | 'ram')[]
  /** Update interval in ms */
  probeIntervalMs: number
  /** number of decimal places to round to */
  precision: number
  cpu: {
    icon: Icon
    text?: Text
    /**
     * Use `sensors` to find preferred temperature source, then run
     * for i in /sys/class/hwmon/hwmon*\/temp*_input; do echo "$(<$(dirname $i)/name): $(cat ${i%_*}_label 2>/dev/null || echo $(basename ${i%_*})) $(readlink -f $i)"; done
     * to find path to desired file
     **/
  }
  temp: {
    icon: Icon
    text?: Text
    path: string
  }
  ram: {
    icon: Icon
    text?: Text
  }
} & MouseCommands

type Todo = {
  soundUrl: string
  icon: Icon
}
type Twitch = {
  icon: Icon
  channels: string[]
  // TODO: docs
  clientId: string
  clientSecret: string
}

type Workspaces = {
  monitors: { workspaces: number[] }[]
  color: {
    active: string
    hasWindows: string
    normal: string
  }
}

export type Config = {
  general: General
  theme: Theme

  bar: {
    theme: BarTheme
    modules: Modules
    appLauncher: AppLauncher
    clock: Clock
    notifications: Notifications
    quickSettings: QuickSettings
    sysmon: SysMon
    todo: Todo
    twitch: Twitch
    workspaces: Workspaces
  }
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
export type UserConfig = DeepPartial<Config>
