import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Row, Section } from 'src/components/layout'
import { Icon } from 'src/components/icon'
import { Label, TransparentButton } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.clock

const AltTime = Variable(false)

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// TODO: support 12/24 hour time
const formatDate = (date: Date, alt: boolean) => {
  const isAM = date.getHours() < 12
  const hour = [0, 12].includes(date.getHours()) ? 12 : date.getHours() % 12
  const day = days[date.getDay()]
  const month = months[date.getMonth()]
  const longDay = longDays[date.getDay()]
  return alt
    ? `${longDay}, ${month} ${String(date.getDate()).padStart(2, '0')} ${hour}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
    : `${day} ${hour}:${String(date.getMinutes()).padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
}

const time = Variable('', {
  poll: [1_000, () => formatDate(new Date(), AltTime.getValue())],
})

export default function Time() {
  return Section(
    [
      TransparentButton({
        onPrimaryClick: () => {
          AltTime.setValue(!AltTime.getValue())
          time.setValue(formatDate(new Date(), AltTime.getValue()))
        },
        child: Row([
          Icon(config.icon),
          Label(time.bind(), {
            label: time.bind(),
            valign: Align.END,
            hpack: 'end',
          }),
        ]),
      }),
    ],
    {
      margin: 4,
      spacing: 0,
    },
  )
}
