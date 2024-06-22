import { Align, Orientation } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { BoxProps } from 'types/widgets/box'

export function BarSection(props: BoxProps, backgroundProps?: BoxProps) {
  const Section = Widget.Box({
    className: 'bar-section',
    orientation: Orientation.HORIZONTAL,
    valign: Align.CENTER,
    spacing: props.spacing ?? 8,
    marginLeft: props.margin ?? 12,
    marginRight: props.margin ?? 12,
    ...props,
  })
  const Background = Widget.Box({
    children: [Section],
    className: 'bar-section-background',
    ...backgroundProps,
  })
  return Background
}
