import { Row, Section } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'

import config from 'src/config'

const colours = config.theme.colours

export default function QuickSettings() {
  return Section(
    [
      Icon('sun', { color: colours.yellow }),
      Icon('bell', { color: colours.pink }),
      Icon('microphone', { color: colours.orange }),
      Icon('volume', { color: colours.red }),
      Icon('wifi', { color: colours.cyan }),
      Row([
        Icon('battery-charging', { color: colours.green }),
        Label('81%', { css: `color: ${colours.green}` }),
      ]),
      Icon('chevron-down'),
    ],
    { spacing: 16 },
  )
}
