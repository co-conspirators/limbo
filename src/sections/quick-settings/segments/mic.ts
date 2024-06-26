import type { MixerSink } from 'types/@girs/gvc-1.0/gvc-1.0.cjs'
import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps, newVolume } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.mic

const audio = await Service.import('audio')

const IconName = Variable(config.icon.name)
const MicIconColor = Variable(config.icon.color)

export default function Mic() {
  const icon = Icon({
    name: IconName.bind(),
    color: MicIconColor.bind(),
  }).hook(
    audio.microphone,
    (self) => {
      const isMuted = audio.microphone.is_muted

      self.tooltip_markup =
        `<b>Device:</b> ${audio.microphone.description}\n` +
        (isMuted ? '<b>Muted</b>' : `<b>Volume:</b> ${Math.round(audio.microphone.volume * 100)}%`)

      if (isMuted) {
        IconName.setValue(config.muteIcon.name)
        MicIconColor.setValue(config.muteIcon.color)
      } else {
        IconName.setValue(config.icon.name)
        MicIconColor.setValue(config.icon.color)
      }
    },
    'changed',
  )

  return TransparentButton({
    child: icon,
    ...buttonProps,
    onPrimaryClick: () => {
      audio.microphone.is_muted = !audio.microphone.is_muted
    },
    onMiddleClick: () => {
      // switch to the next audio input device
      const currentInput = audio.control.get_default_source() as MixerSink
      const inputs = audio.control.get_sources()
      const currentIndex = inputs.indexOf(currentInput)
      const nextIndex = (currentIndex + 1) % inputs.length
      audio.control.set_default_source(inputs[nextIndex])
    },
    onSecondaryClick: () => {
      // open pavucontrol
      config.onSecondaryClick && Utils.execAsync(config.onSecondaryClick)
    },
    onScrollUp: () => {
      audio.microphone.volume = newVolume(audio.microphone.volume, true)
    },
    onScrollDown: () => {
      audio.microphone.volume = newVolume(audio.microphone.volume, false)
    },
  })
}
