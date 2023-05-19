import { defineAsyncComponent } from 'vue'
import { registerCustomIconResolver } from 'vuiii'

const icons = import.meta.glob('./components/icons/*.vue', { as: 'component' })

registerCustomIconResolver((name: string) => {
  const key = Object.keys(icons).find((path) => path.endsWith(`/${name}.vue`))

  if (key) {
    return defineAsyncComponent(icons[key] as any)
  }
})