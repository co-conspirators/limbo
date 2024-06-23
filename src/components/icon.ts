import type { Binding } from 'types/service'
import type { IconProps } from 'types/widgets/icon'

export function Icon(
  name: string | Binding<any, any, string>,
  { color, css = '', ...props }: IconProps & { color?: string | Binding<any, any, string> } = {},
) {
  return Widget.Icon({
    icon: typeof name === 'string' ? `tabler-${name}-symbolic` : name.as((name) => `tabler-${name}-symbolic`),
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
