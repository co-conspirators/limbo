import { Row, Section } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'

export default function QuickSettings() {
  return Section(
    [
      Icon('sun'),
      Icon('bell'),
      Icon('mic'),
      Icon('volume-2'),
      Icon('wifi'),
      Row([Icon('f-battery-charging'), Label('81%', '#FAE3B0')]),
      Icon('chevron-down'),
    ],
    { spacing: 16 },
  )
}
