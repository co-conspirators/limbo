import type { MouseCommands } from 'src/config'
import { Align, ReliefStyle } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import type { ButtonProps } from 'types/widgets/button'

const getTransparentButtonCSS = (extraCSS: string) => `
  background: transparent;
  border: none;
  box-shadow: none;
  text-shadow: none;
  -gtk-icon-shadow: none;
  -gtk-icon-effect: none;
  color: inherit;

  ${extraCSS}
`

export const TransparentButton = (props: ButtonProps) =>
  Widget.Button({
    className: 'transparent-button',
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

const handlerKeys: (keyof MouseCommands)[] = [
  'onClicked',
  'onPrimaryClick',
  'onSecondaryClick',
  'onMiddleClick',
  'onScrollUp',
  'onScrollDown',
] as const
export const mouseCommandsToButtonProps = (handlers: MouseCommands) =>
  Object.fromEntries(
    Object.entries(handlers)
      .filter(([key, handler]) => handlerKeys.includes(key as keyof MouseCommands) && handler !== undefined)
      .map(([key, handler]) => [key, () => Utils.execAsync(handler)]),
  )
