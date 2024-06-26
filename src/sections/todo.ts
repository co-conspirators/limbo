import { Align } from 'types/@girs/gtk-3.0/gtk-3.0.cjs'
import { Row, Section } from 'src/components/layout'
import { Icon } from 'src/components/icon'
import { TransparentButton } from 'src/components'
import { testCache } from 'src/utils/fs'
import { cacheDir } from 'src/utils/env'

import allConfig from 'src/config'
const config = allConfig.bar.todo

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

const getNextTask = async () => {
  try {
    const tasks: Task[] = await Utils.fetch('https://api.todoist.com/rest/v2/tasks', {
      headers: { Authorization: `Bearer ${allConfig.bar.notifications.todoist.apiToken}` },
    }).then((res) => res.json())
    const nextTask = tasks
      .filter((task) => task.due && !task.due.is_recurring && new Date(task.due.date) <= new Date())
      .at(-1)

    if (!nextTask)
      return {
        id: '',
        content: 'No tasks due today',
      }

    return nextTask
  } catch (err) {
    console.error(err)
    return {
      id: '',
      content: 'err',
    }
  }
}

const completeTask = async (id: string, undo = false) => {
  try {
    const url = `https://api.todoist.com/rest/v2/tasks/${id}/${undo ? 'reopen' : 'close'}`
    const status = await Utils.fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${allConfig.bar.notifications.todoist.apiToken}` },
    }).then((res) => res.status)

    return status === 204
  } catch (err) {
    console.error(err)
  }
}

const PrevTaskID = Variable('')
const TaskID = Variable('')
const TaskContent = Variable('...', {
  poll: [
    60_000,
    async () => {
      const nextTask = await getNextTask()
      TaskID.setValue(nextTask.id)
      return nextTask.content
    },
  ],
})

export default function Todo() {
  return Section([
    TransparentButton({
      css: `padding: 0;`,
      child: Row(
        [
          Icon(config.icon),
          Widget.Label({
            valign: Align.END,
            label: TaskContent.bind(),
          }),
        ],
        {
          spacing: 6,
        },
      ),
      onPrimaryClick: () =>
        Utils.execAsync('xdg-open https://todoist.com/app/task/' + TaskID.getValue()).catch(console.error),
      onSecondaryClick: async () => {
        // play sound on task completion
        const soundUrl = config.soundUrl
        const filename = soundUrl.split('#')[0].split('?')[0].split('/').pop()
        const cachedSoundFile = `${cacheDir}/todo-sound/${filename}`

        if (!filename) {
          console.error('Failed to parse sound filename')
        } else {
          // if the file is not cached, download it
          if (!(await testCache(filename))) {
            await Utils.execAsync(['curl', '--create-dirs', '--output', cachedSoundFile, soundUrl]).catch(
              console.error,
            )
          }

          // finally, play the sound
          Utils.execAsync(['paplay', '-p', cachedSoundFile]).catch(console.error)
        }

        // complete task with API
        await completeTask(TaskID.getValue())

        // update task content
        PrevTaskID.setValue(TaskID.getValue())
        const { id, content } = await getNextTask()
        TaskID.setValue(id)
        TaskContent.setValue(content)
      },
      onMiddleClick: async () => {
        if (!PrevTaskID.getValue()) return

        // undo task completion with API
        await completeTask(PrevTaskID.getValue(), true)

        // update task content
        const { id, content } = await getNextTask()
        TaskID.setValue(id)
        TaskContent.setValue(content)

        // unset PrevTaskID
        PrevTaskID.setValue('')
      },
    }),
  ])
}
