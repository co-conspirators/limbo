import { Section, Icon, TransparentButton } from 'src/components'

import config from 'src/config'

export default function ApplicationLauncher() {
  return Section(
    [
      TransparentButton({
        css: `padding: 0px 8px;`,
        child: Icon('nix-snowflake-white', { size: 18 }),
        onPrimaryClick: () => Utils.exec(config.appLauncher.command),
      }),
    ],
    { margin: 0 },
  )
}
