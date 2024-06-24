import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import config from 'src/config'

export default function Brightness() {
  return TransparentButton({
    child: Icon('sun', { color: config.theme.colours.yellow }),
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
