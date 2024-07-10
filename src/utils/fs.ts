import Gio from 'gi://Gio'
import type { FileInfo } from 'types/@girs/gio-2.0/gio-2.0.cjs'

import { cacheDir } from './env'

export const exists = (path: string) =>
  Utils.readFileAsync(path)
    .then(() => true)
    .catch(() => false)
export const existsSync = (path: string) => {
  try {
    return Boolean(Utils.readFile(path))
  } catch {
    return false
  }
}

export const dirname = (path: string) => path.split('/').slice(0, -1).join('/')

export const testCache = (path: string) => exists(cacheDir + path)
export const testCacheSync = (path: string) => existsSync(cacheDir + path)

export const getFileNames = (directoryPath: string) => {
  const dir = Gio.File.new_for_path(directoryPath)
  const fileNames: string[] = []

  try {
    let enumerator = dir.enumerate_children(
      'standard::name,standard::type',
      Gio.FileQueryInfoFlags.NONE,
      null,
    )
    let info: FileInfo | null
    while ((info = enumerator.next_file(null)) !== null) {
      if (info.get_file_type() === Gio.FileType.REGULAR) {
        fileNames.push(info.get_name())
      }
    }
    enumerator.close(null)
  } catch (e: any) {
    log('Error reading directory: ' + e.message)
  }

  return fileNames
}
