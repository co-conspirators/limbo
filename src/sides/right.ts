import { Row, Section, Side } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'
import SysTray from 'src/sections/tray'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const time = Variable('', {
  poll: [
    1000,
    () => {
      const now = new Date()
      const isAM = now.getHours() < 12
      const hour = [0, 12].includes(now.getHours()) ? 12 : now.getHours() % 12
      const day = days[now.getDay()]
      return `${day} ${hour}:${String(now.getMinutes()).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
    },
  ],
})

export default function RightSide() {
  return Side('end', [
    Section([SysTray()], { margin: 4 }),
    Section(
      [
        Icon('sun'),
        Icon('bell'),
        Icon('mic'),
        Icon('volume-2'),
        Icon('wifi'),
        Row([Icon('f-battery-charging'), Label('81%', '#FAE3B0')]),
        Icon('chevron-down'),
      ],
      { spacing: 20 },
    ),
    Section([
      Icon('clock'),
      Widget.Label({
        hpack: 'end',
        label: time.bind(),
      }),
    ]),
  ])
}
