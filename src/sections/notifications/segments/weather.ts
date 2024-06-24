import { Icon } from 'src/components'
import { NotificationItem, NotificationLabel } from '../main'

import allConfig from 'src/config'
const config = allConfig.bar.notifications.weather

const weatherIconMapping = {
  'clear-day': 'sun',
  'clear-night': 'moon',
  'partly-cloudy-day': 'haze',
  'partly-cloudy-night': 'haze-moon',
  rain: 'cloud-rain',
  snow: 'snowflake',
  sleet: 'cloud-snow',
  wind: 'wind',
  fog: 'cloud-fog',
  cloudy: 'cloud',
}
const colors = config.icon.color
const weatherIconColorMapping = {
  'clear-day': colors.day,
  'clear-night': colors.night,
  'partly-cloudy-day': colors.day,
  'partly-cloudy-night': colors.night,
  rain: colors.rain,
  snow: colors.snow,
  sleet: colors.snow,
  wind: colors.wind,
  fog: colors.fog,
  cloudy: colors.cloud,
}

export default function Weather() {
  const { unit, lat, lon } = allConfig.general
  const apiToken = config.apiToken

  const weatherData = Variable(
    { icon: 'clear-day', temperature: '..' },
    {
      poll: [
        10 * 60_000,
        async () => {
          const weather = await Utils.fetch(
            `https://api.pirateweather.net/forecast/${apiToken}/${lat},${lon}?units=${unit === 'metric' ? 'si' : 'us'}`,
          ).then((res) => res.json())
          return weather.currently
        },
      ],
    },
  )

  const icon = Icon({
    name: weatherData.bind('value').as(({ icon }) => weatherIconMapping[icon]),
    color: weatherData.bind('value').as(({ icon }) => weatherIconColorMapping[icon]),
  })

  const label = NotificationLabel(10 * 60_000, async () => {
    const weather = await Utils.fetch(
      `https://api.pirateweather.net/forecast/${apiToken}/${lat},${lon}?units=${unit}`,
    ).then((res) => res.json())
    return `${weather.currently.temperature.toFixed(1)}°C`
  })

  return NotificationItem(icon, label, config)
}
