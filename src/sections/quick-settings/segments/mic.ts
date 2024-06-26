import type { MixerSink } from 'types/@girs/gvc-1.0/gvc-1.0.cjs'
import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps, newVolume } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.mic

const audio = await Service.import('audio')

export default function Mic() {
  return TransparentButton({
    child: Icon(config.icon),
    ...buttonProps,
    onPrimaryClick: () => {
      audio.microphone.is_muted = !audio.microphone.is_muted
    },
    // onPrimaryClick: () => (audio.microphone.is_muted = !audio.microphone.is_muted),
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
