import { NotificationItem, NotificationLabel } from '../main'
import { Icon } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.notifications.todoist

export default function Todos() {
  const icon = Icon(config.icon)
  const label = NotificationLabel(30_000, async () => {
    const tasks = await Utils.fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: { Authorization: `Bearer ${config.apiToken}` },
    }).then((res) => res.json())
    const today = new Date(new Date().toISOString().slice(0, 10))
    const todayTasks = tasks.filter((task: any) => task.due && new Date(task.due.date) <= today)
    return todayTasks.length
  })
  return NotificationItem(icon, label, config)
}
