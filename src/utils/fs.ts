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
