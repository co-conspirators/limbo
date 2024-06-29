import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.brightness

const getRampIndex = (brightness: number, rampLength: number) =>
  Math.min(rampLength - 1, Math.floor(rampLength * brightness))

const getNewIcon = (brightness: number) => config.rampIcons[getRampIndex(brightness, config.rampIcons.length)]

const CurrentBrightness = Variable(1, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Brightness'],
    (out) => parseFloat(out.split(/\s/)[1]),
  ],
})

const IconName = Variable(config.rampIcons[0].name, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Brightness'],
    (out) => getNewIcon(parseFloat(out.split(/\s/)[1])).name,
  ],
})

const IconColor = Variable(config.rampIcons[0].color, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Brightness'],
    (out) => getNewIcon(parseFloat(out.split(/\s/)[1])).color,
  ],
})

const updateBrightness = async (step: number) => {
  await Utils.execAsync(
    `busctl --user -- call rs.wl-gammarelay / rs.wl.gammarelay UpdateBrightness d ${step}`,
  ).catch(console.error)

  await Utils.execAsync(`busctl --user get-property rs.wl-gammarelay / rs.wl.gammarelay Brightness`)
    .then((out) => {
      const newBrightness = parseFloat(out.split(/\s/)[1])
      const newIcon = getNewIcon(newBrightness)

      CurrentBrightness.setValue(newBrightness)
      IconName.setValue(newIcon.name)
      IconColor.setValue(newIcon.color)
    })
    .catch(console.error)
}

export default function Brightness() {
  const icon = Icon({
    name: IconName.bind(),
    color: IconColor.bind(),
  }).hook(CurrentBrightness, (self) => {
    self.tooltip_markup = `<b>Brightness</b>: ${Math.round(CurrentBrightness.getValue() * 100)}`
  })

  return TransparentButton({
    child: icon,
    ...buttonProps,
    onScrollUp: async () => {
      // increase brightness
      updateBrightness(config.step)
    },
    onScrollDown: async () => {
      // decrease brightness
      updateBrightness(-config.step)
    },
    ...mouseCommandsToButtonProps(config),
  })
}
