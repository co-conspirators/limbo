import { NotificationItem, NotificationLabel } from '../main'
import { Icon } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.notifications.github

export default function Github() {
  const icon = Icon(config.icon)
  const label = NotificationLabel(15_000, async () => {
    const notifications = await Utils.fetch('https://api.github.com/notifications', {
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        Accept: 'application/vnd.github+json',
        'X-Github-Api-Version': '2022-11-28',
        'User-Agent': 'AGS',
      },
    }).then((res) => res.json())
    return notifications.length
  })
  return NotificationItem(icon, label, config)
}
