import { Row, Section } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'

export default function QuickSettings() {
  return Section(
    [
      Icon('sun', { color: '#FAE3B0' }),
      Icon('bell', { color: '#F28FAD' }),
      Icon('microphone', { color: '#F5C2E7' }),
      Icon('volume', { color: '#F2CDCD' }),
      Icon('wifi', { color: '#96CDFB' }),
      Row([Icon('battery-charging', { color: '#FAE3B0' }), Label('81%', '#FAE3B0')]),
      Icon('chevron-down'),
    ],
    { spacing: 16 },
  )
}
