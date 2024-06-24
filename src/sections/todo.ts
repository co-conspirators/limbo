import { Row, Section } from 'src/components/layout'
import { Icon } from 'src/components/icon'
import { TransparentButton } from 'src/components'

import config from 'src/config'
import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'

type Task = {
  id: string
  assigner_id: string | null
  assignee_id: string | null
  section_id: string | null
  parent_id: string | null
  order: number
  content: string
  description: string
  is_completed: boolean
  labels: string[]
  priority: number
  comment_count: number
  creator_id: string
  created_at: string
  due: {
    date: string
    string: string
    lang: string
    is_recurring: boolean
  }
  url: string
  duration: null
}

const OpenURL = Variable('https://todoist.com')

const TodoLabel = (pollMS: number, get: () => Promise<any>) => {
  const label = Widget.Label({
    valign: Align.END,
    label: '...',
    css: `color: ${config.theme.colours.fg}`,
  }).poll(pollMS, async () => {
    try {
      const count = await get()
      label.label = String(count)
    } catch (err) {
      console.error(err)
      label.label = 'err'
    }
  })

  return label
}

export default function Todo() {
  const label = TodoLabel(60_000, async () => {
    const tasks: Task[] = await Utils.fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: { Authorization: `Bearer ${config.notifications.todoist.apiToken}` },
    }).then((res) => res.json())
    const nextTask = tasks
      .filter((task) => task.due && !task.due.is_recurring && new Date(task.due.date) <= new Date())
      .at(-1)

    if (!nextTask) return 'No tasks due today'

    OpenURL.setValue(nextTask.url)
    return nextTask.content
  })

  return Section([
    TransparentButton({
      css: `padding: 0;`,
      cursor: 'pointer',
      child: Row([Icon('square', { color: config.theme.colours.cyan }), label], { spacing: 6 }),
      onPrimaryClick: () => Utils.execAsync('xdg-open ' + OpenURL.getValue()).catch(console.error),
    }),
  ])
}
