import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.nightLight

enum StateEnum {
  Off = 'off',
  On = 'on',
  Forced = 'forced',
}
const State = Variable<StateEnum>(StateEnum.On)

const setTemp = (temp: number) =>
  Utils.execAsync(
    `busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Temperature q ${Math.round(temp)}`,
  )

let count = 0
const updateGammaRelay = async () => {
  count++
  console.log('updateGammaRelay', count)
  const state = State.getValue()
  if (state === StateEnum.Off) return setTemp(config.dayTemp)
  if (state === StateEnum.Forced) return setTemp(config.nightTemp)

  const now = new Date()

  const fadeDurationMinutes = 30

  const sunset = new Date()
  sunset.setHours(20, 0, 0)
  if (now > sunset) {
    const minutesSinceSunset = (now.getTime() - sunset.getTime()) / 60000
    const sunsetWeight = Math.min(1, Math.max(0, minutesSinceSunset / fadeDurationMinutes))

    const temp = config.dayTemp * (1 - sunsetWeight) + config.nightTemp * sunsetWeight
    return setTemp(temp)
  }

  const sunrise = new Date()
  sunrise.setHours(8, 0, 0)
  if (now > sunrise) {
    const minutesSinceSunrise = (now.getTime() - sunrise.getTime()) / 60000
    const sunriseWeight = Math.min(1, Math.max(0, minutesSinceSunrise / fadeDurationMinutes))

    const temp = config.nightTemp * (1 - sunriseWeight) + config.dayTemp * sunriseWeight
    return setTemp(temp)
  }

  return setTemp(config.nightTemp)
}

export default function NightLight() {
  const IconConfig = State.bind('value').as((state) => {
    if (state === StateEnum.Off) return config.offIcon
    if (state === StateEnum.On) return config.onIcon
    if (state === StateEnum.Forced) return config.forcedIcon
    throw new Error('Invalid state')
  })
  const icon = Icon({
    name: IconConfig.as((c) => c.name),
    color: IconConfig.as((c) => c.color),
  })

  return TransparentButton({
    child: icon,
    onClicked: () => {
      const state = State.getValue()
      if (state === StateEnum.Off) State.setValue(StateEnum.On)
      else if (state === StateEnum.On) State.setValue(StateEnum.Forced)
      else if (state === StateEnum.Forced) State.setValue(StateEnum.Off)
      else throw new Error('Invalid state')
    },
    ...mouseCommandsToButtonProps(config),
    ...buttonProps,
  })
    .poll(30_000, updateGammaRelay)
    .hook(State, updateGammaRelay)
}
