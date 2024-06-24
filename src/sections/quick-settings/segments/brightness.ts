import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.brightness

export default function Brightness() {
  return TransparentButton({
    child: Icon(config.rampIcons[0]),
    ...buttonProps,
    cursor: 'ns-resize',
    // onScrollUp: () => {
    //   // increase brightness
    // },
    // onScrollDown: () => {
    //   // decrease brightness
    // },
  })
}
