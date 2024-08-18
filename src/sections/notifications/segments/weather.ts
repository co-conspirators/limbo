import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Icon } from 'src/components'
import { NotificationItem } from '../main'

import allConfig from 'src/config'
const config = allConfig.bar.notifications.weather
const colors = config.icon.color

const mapWMOWeatherCode = (code: number, isDay: 0 | 1) => {
	switch (code) {
		// clear sky
		case 0:
			return isDay ? { icon: 'sun', color: colors.day } : { icon: 'moon', color: colors.night }
		// mainly clear, partly cloudy, and overcast
		case 1:
		case 2:
		case 3:
			return isDay ? { icon: 'haze', color: colors.day } : { icon: 'haze-moon', color: colors.night }
		// fog and depositing rime fog
		case 45:
		case 48:
			return { icon: 'cloud-fog', color: colors.fog }
		// drizzle: light, moderate, and dense intensity
		case 51:
		case 53:
		case 55:
			return { icon: 'cloud-rain', color: colors.rain }
		// freezing drizzle: light and dense intensity
		case 56:
		case 57:
			return { icon: 'cloud-snow', color: colors.snow }
		// rain: slight, moderate and heavy intensity
		case 61:
		case 63:
		case 65:
			return { icon: 'cloud-rain', color: colors.rain }
		// freezing rain: light and heavy intensity
		case 66:
		case 67:
			return { icon: 'cloud-snow', color: colors.snow }
		// snow fall: slight, moderate, and heavy intensity
		case 71:
		case 73:
		case 75:
			return { icon: 'snowflake', color: colors.snow }
		// snow grains
		case 77:
			return { icon: 'snowflake', color: colors.snow }
		// rain showers: slight, moderate, and violent
		case 80:
		case 81:
		case 82:
			return { icon: 'cloud-rain', color: colors.rain }
		// snow showers slight and heavy
		case 85:
		case 86:
			return { icon: 'cloud-snow', color: colors.snow }
		// thunderstorm: slight or moderate
		case 95:
			return { icon: 'cloud-bolt', color: colors.cloud }
		// thunderstorm with slight and heavy hail
		case 96:
		case 99:
			return { icon: 'cloud-bolt', color: colors.cloud }
		// unknown
		default:
			return { icon: 'alert-triangle', color: colors.error }
	}
}

export default function Weather() {
	const { unit, lat, lon } = allConfig.general

	const weatherData = Variable(
		{ temperature: '..', weather_code: 0, is_day: 1 },
		{
			poll: [
				10 * 60_000,
				async () => {
					const weather = await Utils.fetch(
						`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,is_day${unit === 'imperial' ? '&temperature_unit=fahrenheit' : ''}`,
					)
						.then((res) => res.json())
						.catch(() => ({
							current: {
								temperature_2m: 'server error',
								apparent_temperature: 'server error',
								weather_code: 100,
								is_day: 1,
							},
						}))

					return weather.current
				},
			],
		},
	)

	const icon = Icon({
		name: weatherData
			.bind('value')
			.as(({ weather_code, is_day }) => mapWMOWeatherCode(weather_code, is_day).icon),
		color: weatherData
			.bind('value')
			.as(({ weather_code, is_day }) => mapWMOWeatherCode(weather_code, is_day).color),
	})

	const label = Widget.Label({
		label: '..',
		valign: Align.END,
		hpack: 'end',
	}).hook(weatherData, (self) => {
		const temperature =
			config.temperature === 'apparent' && weatherData.value.apparent_temperature
				? weatherData.value.apparent_temperature
				: weatherData.value.temperature_2m
		if (typeof temperature === 'number') {
			self.label = `${temperature.toFixed(1)}°C`
		} else if (typeof temperature === 'string') {
			self.label = temperature
		}
	})

	return NotificationItem(icon, label, config)
}
