export const exists = (path: string) =>
  Utils.readFileAsync(path)
    .then(() => true)
    .catch(() => false)
export const existsSync = (path: string) => {
  try {
    Utils.readFile(path)
    return true
  } catch {
    return false
  }
}
