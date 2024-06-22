import { Left, Right, Center } from 'src/modules'

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
    name: `bar-${monitor}`,
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
    background: #1e1e2e;
    color: #f8f8f2;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 14px;
  }
  menu {
    background: #2c2c3f;
  }

  .bar-section-background {
    background-color: #2c2c3f;
    border-radius: 6px;
  }


  .sys-tray-item {
    background: transparent;
    border: none;
    box-shadow: none;
  }
`)
App.config({
  windows: [Bar(0), Bar(1)],
})
