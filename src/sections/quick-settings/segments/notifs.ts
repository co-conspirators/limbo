import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.notifs

const DnDStatus = Variable(false, {
  poll: [
    1000,
    config.statusCmd,
    (out) => out.split('\n').some((m) => m.includes('do-not-disturb') || m === 'true'),
  ],
})

export default function Notifs() {
  return TransparentButton({
    child: Icon({
      name: DnDStatus.bind('value').as((dnd) => (dnd ? config.notifsIcon.name : config.icon.name)),
      color: DnDStatus.bind('value').as((dnd) => (dnd ? config.notifsIcon.color : config.icon.color)),
    }),
    ...buttonProps,
    onPrimaryClick: () => {
      Utils.execAsync(config.openCmd)
    },
    onSecondaryClick: () => {
      Utils.execAsync(config.toggleCmd)
      DnDStatus.setValue(!DnDStatus.getValue())
    },
  })
}
