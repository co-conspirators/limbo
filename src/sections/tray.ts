import type { TrayItem } from 'types/service/systemtray'

import { Section } from 'src/components/layout'
import { Icon, TransparentButton } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.tray
const ignoredAppsLower = config.ignoredApps.map((app) => app.toLowerCase())

const systemTray = await Service.import('systemtray')

const Item = (item: TrayItem) => {
  const binding = Utils.merge([item.bind('title'), item.bind('icon')], (title, icon) => ({
    title: title.toLowerCase(),
    icon,
  }))
  const icon = binding.as(({ title, icon }) => {
    const appIcon = config.appIconMappings[title]
    if (appIcon) return `tabler-${appIcon.name}-symbolic`
    return icon
  })
  const css = binding.as(({ title }) => {
    const appIcon = config.appIconMappings[title]
    if (appIcon) return `color: ${appIcon.color}`
    return ''
  })

  return TransparentButton({
    css: `padding: 0px 8px;`,
    child: Widget.Icon({ icon, css }),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
  })
}

export default function Tray() {
  return Section(
    [
      Widget.Box({
        children: systemTray
          .bind('items')
          .as((items) =>
            items.filter((item) => !ignoredAppsLower.includes(item.title.toLowerCase())).map(Item),
          ),
      }),
    ],
    { margin: 4 },
  )
}
