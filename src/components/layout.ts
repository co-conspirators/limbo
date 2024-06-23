import type Gtk from 'types/@girs/gtk-3.0/gtk-3.0'
import { Align, Orientation } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { Binding } from 'types/service'

export function Side(side: 'start' | 'center' | 'end', children: Gtk.Widget[]) {
  return Widget.Box({
    hpack: side,
    children,
    className: 'bar-side',
    spacing: 12,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
  })
}

export function Section(
  children: Gtk.Widget[],
  {
    margin = 12,
    spacing = 8,
    css = '',
  }: {
    margin?: number
    css?: string
    spacing?: number
  } = {},
) {
  const Section = Widget.Box({
    css,
    children,
    className: 'bar-section',
    orientation: Orientation.HORIZONTAL,
    valign: Align.FILL,
    spacing,
    marginLeft: margin,
    marginRight: margin,
  })
  const Background = Widget.Box({
    children: [Section],
    className: 'bar-section-background',
  })
  return Background
}

export function Row(
  children: Gtk.Widget[] | Binding<any, any, Gtk.Widget[]>,
  { spacing = 8 }: { spacing?: number } = {},
) {
  return Widget.Box({
    children,
    orientation: Orientation.HORIZONTAL,
    valign: Align.CENTER,
    spacing,
  })
}
