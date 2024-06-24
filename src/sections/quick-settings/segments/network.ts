import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.network

export default function Network() {
  return TransparentButton({
    child: Icon(config.rampIcons[0]),
    ...buttonProps,
  })
}
