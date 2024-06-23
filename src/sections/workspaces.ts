import { Section, TransparentButton } from 'src/components'

const hyprland = await Service.import('hyprland')

function WorkspaceDot(workspaceId: number) {
  const hasWindows = hyprland
    .bind('workspaces')
    .as((workspaces) => (workspaces.find((workspace) => workspace.id === workspaceId)?.windows ?? 0) > 0)

  const activeWorkspaces = hyprland
    .bind('monitors')
    .as((monitors) => monitors.map((monitor) => monitor.activeWorkspace.id))
  const active = activeWorkspaces.as((activeWorkspaces) => activeWorkspaces.some((ws) => ws === workspaceId))

  const state = Utils.merge([active, hasWindows], (active, hasWindows) => ({ active, hasWindows }))

  return TransparentButton({
    onPrimaryClick: () => hyprland.message(`dispatch workspace ${workspaceId}`),
    onScrollUp: () => hyprland.message(`dispatch workspace m-1`),
    onScrollDown: () => hyprland.message(`dispatch workspace m+1`),
    css: 'padding: 4px;',
    child: Widget.Box({
      css: state.as(
        ({ active, hasWindows }) => `
          background-color: ${active || hasWindows ? '#A4B9EF' : '#585B70'};
          border-radius: 5px;
          transition: all 0.1s ease-in-out;
          min-width: ${active ? 22 : 10}px;
          margin: 7px ${active ? 3 : 8}px; /* HACK: to get the right size */
        `,
      ),
    }),
  })
}

export default function Workspaces(monitor: number) {
  return Section(
    [
      Widget.Fixed({
        widthRequest: 180,
        setup(self) {
          const width = self.width_request
          const widthPerDot = width / 6
          const height = self.get_allocated_height()
          const dots = Array.from({ length: 6 }, (_, i) => WorkspaceDot(i + 1 + monitor * 6))
          for (const [i, dot] of dots.entries()) {
            const dotHeight = dot.height_request
            const x = widthPerDot * i
            const y = (height - dotHeight) / 2
            self.put(dot, x, y)
          }
        },
      }),
    ],
    {
      margin: 0,
      spacing: 0,
      css: 'padding: 0px 4px',
    },
  )
}
