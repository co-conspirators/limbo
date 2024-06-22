import { Align, ReliefStyle } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { ButtonProps } from 'types/widgets/button'

const getTransparentButtonCSS = (extraCSS: string) => `
  background: transparent;
  border: none;
  box-shadow: none;
  text-shadow: none;
  -gtk-icon-shadow: none;
  color: inherit;
  ${extraCSS}
`

export const TransparentButton = (props: ButtonProps) =>
  Widget.Button({
    relief: ReliefStyle.NONE,
    valign: Align.CENTER,
    // TODO: super buggy
    //cursor: 'pointer',
    ...props,
    css:
      props.css && typeof props.css === 'object'
        ? props.css.as((css) => getTransparentButtonCSS(css))
        : getTransparentButtonCSS(props.css ?? ''),
  })
