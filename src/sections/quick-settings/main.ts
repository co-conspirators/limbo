import { Section } from 'src/components/layout'
import Battery from './segments/battery'
import Brightness from './segments/brightness'
import Caffeine from './segments/caffeine'
import DnD from './segments/do-not-disturb'
import Mic from './segments/mic'
import Notifs from './segments/notifs'
import Network from './segments/network'
import NightLight from './segments/night-light'
import Toggle from './segments/toggle'
import Volume from './segments/volume'
import { getTrayItems } from './segments/tray'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings

const segments = {
  battery: Battery,
  caffeine: Caffeine,
  brightness: Brightness,
  dnd: DnD,
  mic: Mic,
  notifs: Notifs,
  network: Network,
  'night-light': NightLight,
  toggle: Toggle,
  volume: Volume,
}

const systemTray = await Service.import('systemtray')

export default function QuickSettings() {
  const quickSettings = config.segments
    .filter((segment) => segment !== 'tray')
    .map((segment) => segments[segment]())
  const trayEnabled = config.segments.includes('tray')
  const items = trayEnabled
    ? systemTray.bind('items').as((items) => [...getTrayItems(items), ...quickSettings])
    : quickSettings

  return Section(items, {
    spacing: 0,
    margin: 4,
  })
}
