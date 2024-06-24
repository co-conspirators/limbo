import { Label, Row, TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.battery

export default function Battery() {
  return TransparentButton({
    child: Row([Icon(config.rampIcons[0]), Label('81%', { css: `color: ${config.rampIcons[0].color}` })]),
    ...buttonProps,
  })
}
