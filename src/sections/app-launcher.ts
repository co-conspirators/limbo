import { Section, Icon, TransparentButton, mouseCommandsToButtonProps } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.appLauncher

export default function ApplicationLauncher() {
  return Section(
    [
      TransparentButton({
        css: `padding: 0px 8px;`,
        child: Icon({ ...config.icon, size: 18 }),
        ...mouseCommandsToButtonProps(config),
      }),
    ],
    { margin: 0 },
  )
}
