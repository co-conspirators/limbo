import { Label, Row, TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import config from 'src/config'

export default function Battery() {
  return TransparentButton({
    child: Row([
      Icon('battery-charging', { color: config.theme.colours.green }),
      Label('81%', { css: `color: ${config.theme.colours.green}` }),
    ]),
    ...buttonProps,
  })
}
