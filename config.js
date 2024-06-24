const entry = App.configDir + '/src/main.ts'
const outdir = `${Utils.exec('pwd')}/build`

try {
  await Utils.execAsync([
    'bun',
    'build',
    entry,
    '--outdir',
    outdir,
    '--external',
    'resource://*',
    '--external',
    'gi://*',
    '--external',
    '../user-config',
  ])
  await import(`file://${outdir}/main.js`)
} catch (error) {
  console.error(error)
}
