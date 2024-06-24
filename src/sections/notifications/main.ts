import { Row, Section, TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import type { Label } from 'types/widgets/label'
import type BaseIcon from 'types/widgets/icon'

import type { MouseCommands } from 'src/config'
import Weather from './segments/weather'
import Todos from './segments/todos'
import Github from './segments/github'

export const NotificationItem = (
  icon: BaseIcon<unknown>,
  label: Label<unknown>,
  mouseCommands: MouseCommands,
) =>
  TransparentButton({
    css: `padding: 0;`,
    child: Row([icon, label], { spacing: 6 }),
    ...mouseCommandsToButtonProps(mouseCommands),
  })

export const NotificationLabel = (pollMS: number, get: () => Promise<any>) => {
  const label = Widget.Label({
    label: '..',
  }).poll(pollMS, async () => {
    try {
      const count = await get()
      label.label = String(count)
    } catch (err) {
      console.error(err)
      label.label = 'err'
    }
  })
  return label
}

export default function Notifications() {
  return Section([Row([Weather(), Todos(), Github()], { spacing: 16 })])
}
