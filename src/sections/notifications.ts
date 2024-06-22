import { Icon, Row, Section, TransparentButton } from 'src/components'
import type { Binding } from 'types/service'
import type { Label } from 'types/widgets/label'
import config from 'src/config'

const NotificationItem = (
  icon: string | Binding<any, any, string>,
  label: Label<unknown>,
  onPrimaryClick: () => any,
) =>
  TransparentButton({
    css: `padding: 0;`,
    child: Row([Icon(icon), label], { spacing: 6 }),
    onPrimaryClick,
  })

const NotificationLabel = (pollMS: number, get: () => Promise<any>) => {
  const label = Widget.Label('..').poll(pollMS, async () => {
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

const Weather = () => {
  const { unit, location, lat, lon, apiToken } = config.weather

  const label = NotificationLabel(10 * 60_000, async () => {
    const weather = await Utils.fetch(
      `https://api.pirateweather.net/forecast/${apiToken}/${lat},${lon}?units=${unit}`,
    ).then((res) => res.json())
    return weather.currently.temperature.toFixed(1)
  })

  return NotificationItem('cloud-drizzle', label, () =>
    Utils.execAsync(`xdg-open https://merrysky.net/forecast/${location.replace(',', '/')}`),
  )
}

const Todos = () => {
  const label = NotificationLabel(30_000, async () => {
    const tasks = await Utils.fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: { Authorization: `Bearer ${config.todoist.apiToken}` },
    }).then((res) => res.json())
    const todayTasks = tasks.filter(
      (task: any) => task.due && task.due.date === new Date().toISOString().slice(0, 10),
    )
    return todayTasks.length
  })
  return NotificationItem('check-square', label, () => Utils.execAsync('xdg-open https://todoist.com'))
}

const Github = () => {
  const label = NotificationLabel(15_000, async () => {
    const notifications = await Utils.fetch('https://api.github.com/notifications', {
      headers: {
        Authorization: `Bearer ${config.github.apiToken}`,
        Accept: 'application/vnd.github+json',
        'X-Github-Api-Version': '2022-11-28',
        'User-Agent': 'AGS',
      },
    }).then((res) => res.json())
    return notifications.length
  })
  return NotificationItem('github', label, () => Utils.execAsync('xdg-open https://github.com/notifications'))
}

export default function Notifications() {
  return Section([Row([Weather(), Todos(), Github()], { spacing: 16 })])
}
