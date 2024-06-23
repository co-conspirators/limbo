import { Section } from 'src/components/layout'
import { Icon } from 'src/components/icon'

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

export default function Time() {
  return Section([
    Icon('clock'),
    Widget.Label({
      hpack: 'end',
      label: time.bind(),
    }),
  ])
}
