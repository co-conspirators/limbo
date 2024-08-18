import type { MixerSink } from 'types/@girs/gvc-1.0/gvc-1.0.cjs'
import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps, newVolume } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.volume

const audio = await Service.import('audio')

const IconName = Variable(config.rampIcons[0].name)
const IconColor = Variable(config.rampIcons[0].color)

const setIcon = ({ name, color }: { name: string; color: string }) => {
	IconName.setValue(name)
	IconColor.setValue(color)
}

const getRampIndex = (volume: number, rampLength: number) =>
  Math.min(rampLength - 1, Math.floor(rampLength * volume))

export default function Volume() {
  const icon = Icon({
    name: IconName.bind(),
    color: IconColor.bind(),
  }).hook(
    audio.speaker,
    (self) => {
      const isMuted = audio.speaker.is_muted
      const volume = audio.speaker.volume
      const isHeadphones = audio.speaker.icon_name?.includes('headset')

      const rampIcons = isHeadphones ? config.headphonesRamp : config.rampIcons
      const muteIcon = isHeadphones ? config.headphonesMute : config.muteIcon

      self.tooltip_markup =
        `<b>Device:</b> ${audio.speaker.description}\n` +
        (isMuted ? '<b>Muted</b>' : `<b>Volume:</b> ${Math.round(volume * 100)}%`)

      if (isMuted) {
				setIcon(muteIcon)
      } else {
        const restOfRamp = rampIcons.slice(1)
        const rampIndex = getRampIndex(volume, restOfRamp.length)
        const currIcon = volume === 0 ? config.rampIcons[0] : restOfRamp[rampIndex]
				setIcon(currIcon)
      }
    },
    'changed',
  )

  return TransparentButton({
    child: icon,
    ...buttonProps,
    onPrimaryClick: () => {
      audio.speaker.is_muted = !audio.speaker.is_muted
    },
    onMiddleClick: () => {
      // switch to the next audio output device
      const currentOutput = audio.control.get_default_sink() as MixerSink
      const outputs = audio.control.get_sinks()
      const currentIndex = outputs.indexOf(currentOutput)
      const nextIndex = (currentIndex + 1) % outputs.length
      audio.control.set_default_sink(outputs[nextIndex])
    },
    onSecondaryClick: () => {
      // open pavucontrol
      config.onSecondaryClick && Utils.execAsync(config.onSecondaryClick)
    },
    onScrollUp: () => {
      audio.speaker.volume = newVolume(audio.speaker.volume, true)
    },
    onScrollDown: () => {
      audio.speaker.volume = newVolume(audio.speaker.volume, false)
    },
  })
}
