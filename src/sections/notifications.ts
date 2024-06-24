import { Icon, Row, Section, TransparentButton } from 'src/components'
import type { Label } from 'types/widgets/label'
import type BaseIcon from 'types/widgets/icon'

import config from 'src/config'

const colours = config.theme.colours

const NotificationItem = (icon: BaseIcon<unknown>, label: Label<unknown>, onPrimaryClick: () => any) =>
  TransparentButton({
    css: `padding: 0;`,
    child: Row([icon, label], { spacing: 6 }),
    onPrimaryClick,
  })

const NotificationLabel = (pollMS: number, get: () => Promise<any>) => {
  const label = Widget.Label({ label: '..', css: `color: ${colours.fg}` }).poll(pollMS, async () => {
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

// clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day and partly-cloudy-night
const weatherIconMapping = {
  'clear-day': 'sun',
  'clear-night': 'moon',
  rain: 'cloud-rain',
  snow: 'snowflake',
  sleet: 'cloud-snow',
  wind: 'wind',
  fog: 'cloud-fog',
  cloudy: 'cloud',
  'partly-cloudy-day': 'haze',
  'partly-cloudy-night': 'haze-moon',
}
const weatherIconColorMapping = {
  'clear-day': colours.yellow,
  'clear-night': colours.blue,
  rain: colours.blue,
  snow: colours.fg,
  sleet: colours.fg,
  wind: colours.fg,
  fog: colours.bgAlt,
  cloudy: colours.bgAlt,
  'partly-cloudy-day': colours.yellow,
  'partly-cloudy-night': colours.blue,
}

const Weather = () => {
  const { unit, location, lat, lon, apiToken } = config.notifications.weather

  const weatherData = Variable(
    { icon: 'clear-day', temperature: '..' },
    {
      poll: [
        10 * 60_000,
        async () => {
          const weather = await Utils.fetch(
            `https://api.pirateweather.net/forecast/${apiToken}/${lat},${lon}?units=${unit}`,
          ).then((res) => res.json())
          return weather.currently
        },
      ],
    },
  )

  const icon = Icon(
    weatherData.bind('value').as(({ icon }) => weatherIconMapping[icon]),
    { color: weatherData.bind('value').as(({ icon }) => weatherIconColorMapping[icon]) },
  )

  const label = NotificationLabel(10 * 60_000, async () => {
    const weather = await Utils.fetch(
      `https://api.pirateweather.net/forecast/${apiToken}/${lat},${lon}?units=${unit}`,
    ).then((res) => res.json())
    return `${weather.currently.temperature.toFixed(1)}°C`
  })

  return NotificationItem(icon, label, () =>
    Utils.execAsync(`xdg-open https://merrysky.net/forecast/${location.replace(',', '/')}`),
  )
}

const Todos = () => {
  const icon = Icon('checkbox', { color: colours.red })
  const label = NotificationLabel(30_000, async () => {
    const tasks = await Utils.fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: { Authorization: `Bearer ${config.notifications.todoist.apiToken}` },
    }).then((res) => res.json())
    const today = new Date(new Date().toISOString().slice(0, 10))
    const todayTasks = tasks.filter((task: any) => task.due && new Date(task.due.date) <= today)
    return todayTasks.length
  })
  return NotificationItem(icon, label, () => Utils.execAsync('xdg-open https://todoist.com'))
}

const Github = () => {
  const icon = Icon('brand-github', { color: colours.fg })
  const label = NotificationLabel(15_000, async () => {
    const notifications = await Utils.fetch('https://api.github.com/notifications', {
      headers: {
        Authorization: `Bearer ${config.notifications.github.apiToken}`,
        Accept: 'application/vnd.github+json',
        'X-Github-Api-Version': '2022-11-28',
        'User-Agent': 'AGS',
      },
    }).then((res) => res.json())
    return notifications.length
  })
  return NotificationItem(icon, label, () => Utils.execAsync('xdg-open https://github.com/notifications'))
}

export default function Notifications() {
  return Section([Row([Weather(), Todos(), Github()], { spacing: 16 })])
}
