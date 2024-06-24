import { Left, Right, Center } from 'src/modules'
import config from './config'

const hyprland = await Service.import('hyprland')

const Bar = (monitor: number) =>
  Widget.Window({
    monitor,
    css: Utils.merge([hyprland.bind('monitors'), hyprland.bind('clients')], (monitors, clients) => ({
      monitors,
      clients,
    })).as((_) => {
      const currentMonitor = _.monitors.find((m) => m.id === monitor)!
      const workspaceId = currentMonitor.activeWorkspace.id
      const tiledWindows = _.clients.filter((c) => c.workspace.id === workspaceId && !c.floating)
      return tiledWindows.length === 0 ? `background: transparent;` : `background: #1e1e2e;`
    }),
    name: `limbo-${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    heightRequest: 40,
    child: Widget.CenterBox({
      start_widget: Left(monitor),
      center_widget: Center(monitor),
      end_widget: Right(monitor),
    }),
  })

App.addIcons(`${App.configDir}/icons`)
App.applyCss(`
  window {
    background: ${config.theme.colours.bg};
    color: ${config.theme.colours.fg};
    font-family: '${config.theme.font}', 'Symbols Nerd Font', monospace;
    font-size: 14px;
		border-radius: 0px;
  }
  menu {
    background: ${config.theme.colours.bg};
  }

  .bar-section-background {
    background-color: ${config.theme.colours.bgAlt};
    border-radius: ${config.theme.borderRadius}px;
  }

  .sys-tray-item {
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .icon {
    background: transparent;
  }
`)
App.config({
  windows: [Bar(0), Bar(1)],
})
