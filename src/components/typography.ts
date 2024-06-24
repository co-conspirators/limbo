import type { Binding } from 'types/service'
import type { LabelProps } from 'types/widgets/label'

export function Label(text: string | Binding<any, any, string>, props: LabelProps = {}) {
  return Widget.Label({
    label: text,
    ...props,
  })
}
