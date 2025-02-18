import { writable } from 'svelte/store'
import type * as Monaco from 'monaco-editor'

export interface EditorState {
  instance: Monaco.editor.IStandaloneCodeEditor | null
  monaco: typeof Monaco | null
  isReady: boolean
}

const initialState: EditorState = {
  instance: null,
  monaco: null,
  isReady: false
}

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>(initialState)

  return {
    subscribe,
    setInstance: (editor: Monaco.editor.IStandaloneCodeEditor) =>
      update(state => ({ ...state, instance: editor })),
    setMonaco: (monaco: typeof Monaco) =>
      update(state => ({ ...state, monaco, isReady: true })),
    reset: () => set(initialState)
  }
}

export const editor = createEditorStore()