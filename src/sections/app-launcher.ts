import { Section, Icon, TransparentButton } from 'src/components'

import config from 'src/config'

export default function ApplicationLauncher() {
  return Section(
    [
      TransparentButton({
        child: Icon('nix-snowflake-white', 18),
        onPrimaryClick: () => Utils.exec(config.appLauncher.command),
      }),
    ],
    { margin: 0 },
  )
}
