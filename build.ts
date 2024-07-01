await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: './build',
  external: ['resource://*', 'gi://*', '../user-config'],
})
