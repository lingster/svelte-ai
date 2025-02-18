import { writable } from 'svelte/store'

export type IDEMode = 'edit' | 'run'

function createIDEModeStore() {
  const { subscribe, set } = writable<IDEMode>('edit')

  return {
    subscribe,
    setMode: (mode: IDEMode) => set(mode),
    toggleMode: () => set(curr => curr === 'edit' ? 'run' : 'edit')
  }
}

export const ideMode = createIDEModeStore()