import { Label, TransparentButton } from 'src/components'
import type { TrayItem } from 'types/service/systemtray'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.tray
const ignoredAppsLower = config.ignoredApps.map((app) => app.toLowerCase())

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
    child: Widget.Icon({ icon, css }),
    tooltipMarkup: item.bind('tooltip_markup'),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (_, event) => item.openMenu(event),
  })
}

export function getTrayItems(items: TrayItem[]) {
  const trayItems = items.filter((item) => !ignoredAppsLower.includes(item.title.toLowerCase())).map(Item)
  const trayGap = trayItems.length > 0 ? [Label('|', { css: 'margin: 0px 6px;' })] : []
  return [...trayItems, ...trayGap]
}
