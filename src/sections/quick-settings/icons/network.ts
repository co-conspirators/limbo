import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import config from 'src/config'

export default function Network() {
  return TransparentButton({
    child: Icon('wifi', { color: config.theme.colours.cyan }),
    ...buttonProps,
  })
}
