import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import config from 'src/config'

export default function Toggle() {
  return TransparentButton({
    child: Icon('chevron-down', { color: config.theme.colours.fg }),
    ...buttonProps,
  })
}
