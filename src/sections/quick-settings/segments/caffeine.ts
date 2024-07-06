import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
import { Subprocess } from 'types/@girs/gio-2.0/gio-2.0.cjs'
const config = allConfig.bar.quickSettings.caffeine

const CaffeineProc = Variable<Subprocess | undefined>(undefined)

export default function Caffeine() {
  return TransparentButton({
    child: Icon({
      name: CaffeineProc.bind('value').as((c) => (c ? config.activeIcon.name : config.icon.name)),
      color: CaffeineProc.bind('value').as((c) => (c ? config.activeIcon.color : config.icon.color)),
    }),
    ...buttonProps,
    onClicked: () => {
      const proc = CaffeineProc.getValue()
      if (proc) {
        proc.force_exit()
        CaffeineProc.setValue(undefined)
      } else {
        CaffeineProc.setValue(Utils.subprocess([config.toggleCmd]))
      }
    },
    ...mouseCommandsToButtonProps(config),
  })
}
