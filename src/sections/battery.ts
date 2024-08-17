import type Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Row, Section } from 'src/components/layout'
import { Icon } from 'src/components/icon'
import { Label, TransparentButton, mouseCommandsToButtonProps } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.battery
const rampIcons = config.rampIcons.reverse()

const battery = await Service.import('battery')

const IconName = Variable(rampIcons[0].name)
const IconColor = Variable(rampIcons[0].color)

const setIcon = ({ name, color }: { name: string; color: string }) => {
	IconName.setValue(name)
	IconColor.setValue(color)
}

const getRampIndex = (percent: number, rampLength: number) =>
	Math.min(rampLength - 1, Math.floor(rampLength * (percent / 100)))

const getCountdown = (seconds: number) => {
	if (seconds === 0) return '...'
	const parts = {
		d: Math.floor(seconds / (60 * 60 * 24)),
		h: Math.floor((seconds / (60 * 60)) % 24),
		m: Math.floor((seconds / 60) % 60),
	}

	return Object.keys(parts)
		.map((key) => (parts[key] ? `${parts[key].toString().padStart(key === 'm' ? 2 : 0, '0')}${key}` : null))
		.filter((s) => s !== null)
		.join(' ')
}

export default function Battery() {
	const icon = Icon({
		name: IconName.bind(),
		color: IconColor.bind(),
	}).hook(
		battery,
		() => {
			setIcon(
				battery.charging
					? config.chargingIcon
					: battery.charged
						? rampIcons[rampIcons.length - 1]
						: rampIcons[getRampIndex(battery.percent, rampIcons.length)],
			)
		},
		'changed',
	)
	return Section(
		[
			TransparentButton({
				...mouseCommandsToButtonProps(config),
				child: Row([
					icon,
					Label('', {
						valign: Align.END,
						hpack: 'end',
					}).hook(battery, (self: Gtk.Label) => (self.label = `${battery.percent}%`), 'changed'),
				]),
			}),
		],
		{
			margin: 4,
			spacing: 0,
		},
	).hook(
		battery,
		(self) => {
			self.tooltip_markup = `<b>Time Until ${battery.charging ? 'Full' : 'Empty'}:</b> ${getCountdown(battery.time_remaining)}`
		},
		'changed',
	)
}
