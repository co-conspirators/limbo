import { TransparentButton } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import config from 'src/config'

const DnDIcon = Variable('bell', {
  poll: [
    10000,
    config.quickSettings.icons.dnd.statusCmd,
    (out) => (out.split('\n').some((m) => m.includes('do-not-disturb')) ? 'bell-off' : 'bell'),
  ],
})

const DnDColour = Variable(config.theme.colours.orange, {
  poll: [
    10000,
    config.quickSettings.icons.dnd.statusCmd,
    (out) =>
      out.split('\n').some((m) => m.includes('do-not-disturb'))
        ? config.theme.colours.blue
        : config.theme.colours.pink,
  ],
})

export default function DnD() {
  return TransparentButton({
    child: Icon(DnDIcon.bind(), { color: DnDColour.bind() }),
    ...buttonProps,
    onPrimaryClick: () => {
      Utils.execAsync(config.quickSettings.icons.dnd.toggleCmd)
      DnDIcon.setValue(DnDIcon.getValue() === 'bell' ? 'bell-off' : 'bell')
      DnDColour.setValue(
        DnDIcon.getValue() === 'bell' ? config.theme.colours.pink : config.theme.colours.blue,
      )
    },
    onScrollUp: () => {
      // pop notification from history
      Utils.execAsync(config.quickSettings.icons.dnd.historyCmd)
    },
    onScrollDown: () => {
      // pop notification from history
      Utils.execAsync(config.quickSettings.icons.dnd.historyCmd)
    },
  })
}
