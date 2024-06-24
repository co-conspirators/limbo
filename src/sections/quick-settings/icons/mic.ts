import type { MixerSink } from 'types/@girs/gvc-1.0/gvc-1.0.cjs'
import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps, newVolume } from './utils'

import config from 'src/config'

const audio = await Service.import('audio')

export default function Mic() {
  return TransparentButton({
    child: Icon('microphone', { color: config.theme.colours.orange }),
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
      Utils.execAsync('pavucontrol --tab=4')
    },
    onScrollUp: () => {
      audio.microphone.volume = newVolume(audio.microphone.volume, true)
    },
    onScrollDown: () => {
      audio.microphone.volume = newVolume(audio.microphone.volume, false)
    },
  })
}
