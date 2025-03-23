import defaultConfig from './config.default'
import userConfig from '../user-config'
import { configDir } from './utils/env'
import { getFileNames } from './utils/fs'

// FIXME: currently, merging arrays isn't fully working
// if a source array is shorter than the target array, the result will be
// the source array with the elements of the target array past the length of the source array
// appended to it.
// ie., if the source array is [1, 2, 3] and the target array is [9, 8, 7, 6], the result will be [1, 2, 3, 6]
// @liam pls fix
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
function getConfig(): Config {
  const configFiles = getFileNames(configDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => `${configDir}/${file}`)
  const configs = configFiles.map((file) => JSON.parse(Utils.readFile(file)))
  return [...configs, userConfig].reduce((acc, config) => deepMerge(acc, config), defaultConfig)
}

export default getConfig()

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
	| 'battery'
	| 'clock'
	| 'music'
  | 'notifications'
	| 'quick-settings'
	| 'sysmon'
	| 'todo'
  | 'twitch'
  | 'workspaces'
type Modules = {
  left: ModuleName[]
  center: ModuleName[]
  right: ModuleName[]
}

export type MouseCommands = {
  onClicked?: string
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

type Battery = {
  rampIcons: Icon[]
  chargingIcon: Icon
  fullThreshold: number
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
        error: string
      }
    }
    text?: Text
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
    | 'caffeine'
    | 'dnd'
    | 'mic'
    | 'notifs'
    | 'volume'
    | 'network'
    | 'battery'
    | 'toggle'
  )[]
  nightLight: {
    offIcon: Icon
    onIcon: Icon
    forcedIcon: Icon
    dayTemp: number
    nightTemp: number
    fadeDurationMinutes: number
  } & MouseCommands
  tray: {
    ignoredApps: string[]
    appIconMappings: Record<string, Icon>
    sortFunction: (a: { title: string }, b: { title: string }) => number
  }
  brightness: {
    /** Ramp for the brightness from max to min */
    rampIcons: Icon[]
    /** Brightness change step size, 0.05 is 5% */
    step: number
  } & MouseCommands
  caffeine: {
    icon: Icon
    activeIcon: Icon

    toggleCmd: string
  } & MouseCommands
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
  notifs: {
    icon: Icon
    notifsIcon: Icon

    openCmd: string
    statusCmd: string
    toggleCmd: string
  }
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
		battery: Battery
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
