import { Section } from 'src/components/layout'
import Battery from './segments/battery'
import Brightness from './segments/brightness'
import DnD from './segments/do-not-disturb'
import Mic from './segments/mic'
import Network from './segments/network'
import NightLight from './segments/night-light'
import Toggle from './segments/toggle'
import Volume from './segments/volume'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings

const segments = {
  battery: Battery,
  brightness: Brightness,
  dnd: DnD,
  mic: Mic,
  network: Network,
  'night-light': NightLight,
  toggle: Toggle,
  volume: Volume,
}

export default function QuickSettings() {
  return Section(
    config.segments.map((segment) => segments[segment]()),
    { spacing: 12 },
  )
}
