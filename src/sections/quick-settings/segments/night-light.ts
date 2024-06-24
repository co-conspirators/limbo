import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.nightLight

export default function NightLight() {
  return TransparentButton({
    ...mouseCommandsToButtonProps(config),
    child: Icon(config.icon),
    ...buttonProps,
  })
}
