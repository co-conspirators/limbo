import { Section } from 'src/components/layout'
import Battery from './icons/battery'
import Brightness from './icons/brightness'
import DnD from './icons/do-not-disturb'
import Mic from './icons/mic'
import Network from './icons/network'
import Toggle from './icons/toggle'
import Volume from './icons/volume'

import config from 'src/config'

const segments = {
  battery: Battery,
  brightness: Brightness,
  dnd: DnD,
  mic: Mic,
  network: Network,
  toggle: Toggle,
  volume: Volume,
}

export default function QuickSettings() {
  return Section(
    config.quickSettings.icons.segments.map((segment) => segments[segment]()),
    { spacing: 12 },
  )
}
