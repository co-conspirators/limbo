import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Row, Section } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'
import { TransparentButton } from 'src/components'

import config from 'src/config'

const interval = config.sysmon.interval
const precision = config.sysmon.precision

const idleToUsage = (usage: string) => (100 - parseFloat(usage)).toFixed(precision) + '%'

const formatSize = (sizeInKB: string) => {
  const sizeInBytes = parseInt(sizeInKB) * 1024
  const sizeInGiB = sizeInBytes / (1024 * 1024 * 1024)
  return sizeInGiB >= 1
    ? `${sizeInGiB.toFixed(precision)} GiB`
    : `${(sizeInGiB * 1024).toFixed(precision)} MiB`
}

export const cpu = Variable('', {
  poll: [
    interval,
    'top -bn1',
    (out: string) =>
      idleToUsage(
        // @ts-expect-error - out really shouldn't be undefined lol
        out
          .split('\n')
          .find((line) => line.includes('Cpu(s)'))
          .split(',')[3]
          .split(/\s/)[1],
      ),
  ],
})

export const temp = Variable('', {
  poll: [interval, 'cat ' + config.sysmon.cpuTempPath, (out) => out.slice(0, -3) + '°'],
})

export const ram = Variable('', {
  poll: [
    interval,
    'free',
    (out) =>
      formatSize(
        // @ts-expect-error - out really shouldn't be undefined lol
        out
          .split('\n')
          .find((line) => line.includes('Mem:'))
          .split(/\s+/)[2],
      ),
  ],
})

export const uptime = Variable('', {
  poll: [
    interval,
    'uptime',
    (out: string) =>
      '<b>Uptime:</b> ' +
      out
        .split(',')[0]
        .split('up')[1]
        .trim()
        .replace(' days', 'd')
        .replace(/(\d+):(\d+)/, '$1h $2m'),
  ],
})

const labelProps = {
  valign: Align.END,
}
const rowProps = {
  spacing: 6,
}

export default function Sysmon() {
  const segments: any[] = []

  for (const segment of config.sysmon.enabledSegments) {
    switch (segment) {
      case 'cpu':
        segments.push(
          Row([Icon('cpu', { color: config.theme.mauveDark }), Label(cpu.bind(), labelProps)], rowProps),
        )
        break
      case 'temp':
        segments.push(
          Row(
            [Icon('temperature', { color: config.theme.redDark }), Label(temp.bind(), labelProps)],
            rowProps,
          ),
        )
        break
      case 'ram':
        segments.push(
          Row([Icon('cpu-2', { color: config.theme.pink }), Label(ram.bind(), labelProps)], rowProps),
        )
        break
    }
  }

  return Section(
    [
      TransparentButton({
        onPrimaryClick: () => Utils.execAsync(config.sysmon.onClick),
        onSecondaryClick: () => Utils.execAsync(config.sysmon.onRightClick),
        cursor: 'pointer',
        tooltip_markup: uptime.bind(),
        child: Widget.Box({
          children: segments,
          spacing: 8,
        }),
      }),
    ],
    {
      margin: 4,
      spacing: 0,
    },
  )
}
