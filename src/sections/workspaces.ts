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
    css: 'padding: 4px;',
    child: Widget.EventBox({
      child: Widget.Box({
        css: state.as(
          ({ active, hasWindows }) => `
          background-color: ${active || hasWindows ? '#A4B9EF' : '#585B70'};
          border-radius: 5px;
          transition: min-width 0.1s linear;
          min-width: ${active ? 26 : 10}px;
          margin: 7px 3px; /* HACK: to get the right size */
        `,
        ),
      }),
    }),
  })
}

export default function Workspaces(monitor: number) {
  return Section(Array.from({ length: 6 }, (_, i) => WorkspaceDot(i + (monitor * 6 + 1))))
}
