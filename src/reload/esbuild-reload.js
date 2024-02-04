export const esbuildReload = () => {
  new EventSource('/esbuild').addEventListener('change', () => location.reload())
}
