import { Section, Icon, TransparentButton } from 'src/components'

export default function ApplicationLauncher() {
  return Section(
    [
      TransparentButton({
        child: Icon('nix-snowflake-white', 18),
        onPrimaryClick: () => Utils.exec('tofi-drun --drun-launch=true'),
      }),
    ],
    { margin: 0 },
  )
}
