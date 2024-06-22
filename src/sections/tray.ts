import { ReliefStyle } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { TrayItem } from 'types/service/systemtray'

import { Section } from 'src/components/layout'

const systemtray = await Service.import('systemtray')

const SysTrayItem = (item: TrayItem) =>
  Widget.Button({
    className: 'sys-tray-item',
    relief: ReliefStyle.NONE,
    child: Widget.Icon({ size: 16 }).bind('icon', item, 'icon'),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
  })

export default function SysTray() {
  return Section(
    [
      Widget.Box({
        children: systemtray.bind('items').as((i) => i.map(SysTrayItem)),
      }),
    ],
    { margin: 4 },
  )
}
