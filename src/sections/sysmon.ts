import type Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Row, Section } from 'src/components/layout'
import { Label } from 'src/components/typography'
import { Icon } from 'src/components/icon'
import { TransparentButton, mouseCommandsToButtonProps } from 'src/components'

import allConfig from 'src/config'
const config = allConfig.bar.sysmon

const idleToUsage = (usage: string) => (100 - parseFloat(usage)).toFixed(config.precision) + '%'

const formatSize = (sizeInKB: string) => {
  const sizeInBytes = parseInt(sizeInKB) * 1024
  const sizeInGiB = sizeInBytes / (1024 * 1024 * 1024)
  return sizeInGiB >= 1
    ? `${sizeInGiB.toFixed(config.precision)} GiB`
    : `${(sizeInGiB * 1024).toFixed(config.precision)} MiB`
}

export const cpu = Variable('', {
  poll: [
    config.probeIntervalMs,
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
  poll: [config.probeIntervalMs, 'cat ' + config.cpu.tempPath, (out) => out.slice(0, -3) + '°'],
})

export const ram = Variable('', {
  poll: [
    config.probeIntervalMs,
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
    config.probeIntervalMs,
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
  const segments: Gtk.Widget[] = []

  for (const segment of config.segments) {
    switch (segment) {
      case 'cpu':
        segments.push(Row([Icon(config.cpu.icon), Label(cpu.bind(), labelProps)], rowProps))
        break
      case 'temp':
        segments.push(Row([Icon(config.temp.icon), Label(temp.bind(), labelProps)], rowProps))
        break
      case 'ram':
        segments.push(Row([Icon(config.ram.icon), Label(ram.bind(), labelProps)], rowProps))
        break
    }
  }

  return Section(
    [
      TransparentButton({
        ...mouseCommandsToButtonProps(config),
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
