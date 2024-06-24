import type { MixerSink } from 'types/@girs/gvc-1.0/gvc-1.0.cjs'
import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps, newVolume } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.volume

const audio = await Service.import('audio')

export default function Volume() {
  return TransparentButton({
    child: Icon(config.rampIcons[0]),
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
      Utils.execAsync('pavucontrol --tab=3')
    },
    onScrollUp: () => {
      audio.speaker.volume = newVolume(audio.speaker.volume, true)
    },
    onScrollDown: () => {
      audio.speaker.volume = newVolume(audio.speaker.volume, false)
    },
  })
}
