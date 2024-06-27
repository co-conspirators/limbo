import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'
import { Icon } from 'src/components/icon'
import { buttonProps } from './utils'

import allConfig from 'src/config'
const config = allConfig.bar.quickSettings.network

const network = await Service.import('network')

const IconName = Variable(config.ethernetIcon.name)
const IconColour = Variable(config.ethernetIcon.color)

export default function Network() {
  const icon = Icon({ name: IconName.bind(), color: IconColour.bind() }).hook(network, (self) => {
    const conn = network.primary === 'wired' ? network.wired : network.wifi

    switch (conn.internet) {
      case 'connected':
        IconName.setValue(network.primary === 'wired' ? config.ethernetIcon.name : config.rampIcons[0].name)
        break
      case 'connecting':
        IconName.setValue('loader')
        break
      case 'disconnected':
        IconName.setValue(network.primary === 'wired' ? config.ethernetOffIcon.name : config.offIcon.name)
        break
      default:
        IconName.setValue('network-off')
    }

    self.tooltip_markup = network.primary
  })

  return TransparentButton({
    ...mouseCommandsToButtonProps(config),
    child: icon,
    ...buttonProps,
  })
}
