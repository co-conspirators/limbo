import { Side } from 'src/components/layout'

import AppLauncher from 'src/sections/app-launcher'
import Battery, { enabled as batteryEnabled } from 'src/sections/battery'
import Clock from 'src/sections/clock'
import Music from 'src/sections/music'
import Notifications from 'src/sections/notifications/main'
import QuickSettings from 'src/sections/quick-settings/main'
import Sysmon from 'src/sections/sysmon'
import Todo from 'src/sections/todo'
import Twitch from 'src/sections/twitch'
import Workspaces from 'src/sections/workspaces'

import allConfig from 'src/config'
const config = allConfig.bar.modules

// mapping of strings to modules
const modules = {
  'app-launcher': AppLauncher,
  battery: Battery,
  clock: Clock,
  music: Music,
  notifications: Notifications,
  'quick-settings': QuickSettings,
  sysmon: Sysmon,
  todo: Todo,
  twitch: Twitch,
  workspaces: Workspaces,
}

const moduleConditions = {
  battery: batteryEnabled,
}

function getEnabledModules(monitor: number, moduleNames: string[]) {
  return moduleNames
    .filter((module) => moduleConditions[module]?.(monitor) ?? true)
    .map((module) => modules[module](monitor))
}

export function Left(monitor: number) {
  return Side('start', getEnabledModules(monitor, config.left))
}

export function Center(monitor: number) {
  return Side('center', getEnabledModules(monitor, config.center))
}

export function Right(monitor: number) {
  return Side('end', getEnabledModules(monitor, config.right))
}
