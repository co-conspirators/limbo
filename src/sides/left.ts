import { Side } from 'src/components/layout'
import ApplicationLauncher from 'src/sections/application-launcher'
import Notifications from 'src/sections/notifications'
import Twitch from 'src/sections/twitch'
import Music from 'src/sections/music'

export default function LeftSide() {
  return Side('start', [ApplicationLauncher(), Notifications(), Twitch(), Music()])
}
