import { Side } from 'src/components/layout'

import AppLauncher from 'src/sections/app-launcher'
import Clock from 'src/sections/clock'
import Music from 'src/sections/music'
import Notifications from 'src/sections/notifications'
import QuickSettings from 'src/sections/quick-settings'
import Sysmon from 'src/sections/sysmon'
import Tray from 'src/sections/tray'
import Twitch from 'src/sections/twitch'
import Workspaces from 'src/sections/workspaces'

import config from 'src/config'

// mapping of strings to modules
const modules = {
  'app-launcher': AppLauncher,
  clock: Clock,
  music: Music,
  notifications: Notifications,
  'quick-settings': QuickSettings,
  sysmon: Sysmon,
  tray: Tray,
  twitch: Twitch,
  workspaces: Workspaces,
}

export function Left(monitor: number) {
  return Side(
    'start',
    config.modules.left.map((module: string) => modules[module](monitor)),
  )
}

export function Center(monitor: number) {
  return Side(
    'center',
    config.modules.center.map((module: string) => modules[module](monitor)),
  )
}

export function Right(monitor: number) {
  return Side(
    'end',
    config.modules.right.map((module: string) => modules[module](monitor)),
  )
}
