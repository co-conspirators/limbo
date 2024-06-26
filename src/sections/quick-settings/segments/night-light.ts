import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.nightLight

const getNextTemp = (temp: number) => (temp === config.dayTemp ? config.nightTemp : config.dayTemp)
const getNewIcon = (temp: number) => (temp === config.dayTemp ? config.dayIcon : config.nightIcon)

const currentTemp = Variable(config.dayTemp, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Temperature'],
    (out) => parseInt(out.split(/\s/)[1]),
  ],
})

const IconName = Variable(config.dayIcon.name, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Temperature'],
    (out) => getNewIcon(parseInt(out.split(/\s/)[1])).name,
  ],
})

const IconColor = Variable(config.dayIcon.color, {
  poll: [
    1_000,
    ['busctl', '--user', 'get-property', 'rs.wl-gammarelay', '/', 'rs.wl.gammarelay', 'Temperature'],
    (out) => getNewIcon(parseInt(out.split(/\s/)[1])).color,
  ],
})

export default function NightLight() {
  const icon = Icon({
    name: IconName.bind(),
    color: IconColor.bind(),
  })

  return TransparentButton({
    child: icon,
    onPrimaryClick: () => {
      const temp = getNextTemp(currentTemp.getValue())
      const newIcon = getNewIcon(temp)

      IconName.setValue(newIcon.name)
      IconColor.setValue(newIcon.color)

      Utils.execAsync(`busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Temperature q ${temp}`)
    },
    ...mouseCommandsToButtonProps(config),
    ...buttonProps,
  })
}
