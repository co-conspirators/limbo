import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.dnd

const DnDStatus = Variable(false, {
  poll: [
    10000,
    config.statusCmd,
    (out) => out.split('\n').some((m) => m.includes('do-not-disturb') || m === 'true'),
  ],
})

export default function DnD() {
  return TransparentButton({
    child: Icon({
      name: DnDStatus.bind('value').as((dnd) => (dnd ? config.dndIcon.name : config.icon.name)),
      color: DnDStatus.bind('value').as((dnd) => (dnd ? config.dndIcon.color : config.icon.color)),
    }),
    ...buttonProps,
    onPrimaryClick: () => {
      Utils.execAsync(config.toggleCmd)
      DnDStatus.setValue(!DnDStatus.getValue())
    },
    onScrollUp: () => {
      // pop notification from history
      Utils.execAsync(config.historyCmd)
    },
    onScrollDown: () => {
      // pop notification from history
      Utils.execAsync(config.historyCmd)
    },
  })
}
