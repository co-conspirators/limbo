import { Side } from 'src/components/layout'
import Workspaces from 'src/sections/workspaces'

export default function Center(monitor: number) {
  return Side('center', [Workspaces(monitor)])
}
