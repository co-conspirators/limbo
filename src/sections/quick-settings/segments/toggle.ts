import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.toggle

export default function Toggle() {
  return TransparentButton({
    child: Icon(config.icon),
    ...buttonProps,
  })
}
