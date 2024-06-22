import type { Binding } from 'types/service'

export function Label(text: string | Binding<any, any, string>, color?: string) {
  return Widget.Label({
    label: text,
    ...(color && { css: `color: ${color};` }),
  })
}
