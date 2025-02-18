import { writable } from 'svelte/store'

export interface EditorSettings {
  theme: 'vs-dark' | 'vs-light'
  fontSize: number
  tabSize: number
  wordWrap: 'on' | 'off'
  minimap: boolean
  lineNumbers: 'on' | 'off'
  formatOnSave: boolean
  autoSave: boolean
}

const defaultSettings: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  minimap: true,
  lineNumbers: 'on',
  formatOnSave: true,
  autoSave: true
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<EditorSettings>(defaultSettings)
  
  return {
    subscribe,
    update,
    set,
    updateSetting: <K extends keyof EditorSettings>(
      key: K,
      value: EditorSettings[K]
    ) => {
      update(settings => ({
        ...settings,
        [key]: value
      }))
    },
    reset: () => set(defaultSettings)
  }
}

export const settings = createSettingsStore()