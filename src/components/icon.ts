import type { Binding } from 'types/service'
import type { IconProps } from 'types/widgets/icon'

const getIconName = (name: string) =>
  name.includes('ethernet') ? `md-${name}-symbolic` : `tabler-${name}-symbolic`

export function Icon({
  name,
  color,
  css = '',
  ...props
}: Omit<IconProps, 'name'> & {
  name: string | Binding<any, any, string>
  color?: string | Binding<any, any, string>
}) {
  return Widget.Icon({
    icon: typeof name === 'string' ? getIconName(name) : name.as((name) => getIconName(name)),
    size: 16,
    css:
      typeof color === 'string'
        ? `color: ${color};${css}`
        : typeof color === 'object'
          ? color.as((color) => `color: ${color};${css}`)
          : css,
    ...props,
  })
}
