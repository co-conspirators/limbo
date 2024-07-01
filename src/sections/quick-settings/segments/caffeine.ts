import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.caffeine

const CaffeineStatus = Variable(false, {
  poll: [1000, `bash -c '${config.statusCmd}'`, (out) => out !== 'false'],
})

export default function Caffeine() {
  return TransparentButton({
    child: Icon({
      name: CaffeineStatus.bind('value').as((c) => (c ? config.activeIcon.name : config.icon.name)),
      color: CaffeineStatus.bind('value').as((c) => (c ? config.activeIcon.color : config.icon.color)),
    }),
    ...buttonProps,
    onClicked: () => {
      Utils.execAsync(`bash -c '${config.toggleCmd}'`)
      CaffeineStatus.setValue(!CaffeineStatus.getValue())
    },
    ...mouseCommandsToButtonProps(config),
  })
}
