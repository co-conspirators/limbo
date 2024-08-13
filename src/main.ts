import { Left, Right, Center } from 'src/modules'
import allConfig from './config'
const config = allConfig.bar

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
    background: ${config.theme.bg};
    color: ${config.theme.fg};
    font-family: '${allConfig.theme.font}', 'Symbols Nerd Font', monospace;
    font-size: 14px;
		border-radius: 0px;
  }
  menu {
    background: ${config.theme.bg};
  }

  .bar-section-background {
    background-color: ${config.theme.sectionBg};
    border-radius: ${allConfig.theme.borderRadius}px;
  }

  .sys-tray-item {
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .icon {
    background: transparent;
  }

  .transparent-button {
    padding: 0px 8px;
    margin: 0px;
  }
`)

App.config({
  windows: hyprland.monitors.map((m) => Bar(m.id)),
})
