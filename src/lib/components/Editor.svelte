
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import loader from '@monaco-editor/loader'
  import { editor } from '$lib/stores/editor'
  import { settings } from '$lib/stores/settings'
  import { getLanguageFromFilename } from '$lib/utils/compiler'
  
  export let content = ''
  export let filename = ''
  export let onChange: (value: string) => void
  
  let editorContainer: HTMLElement
  let autoSaveInterval: number
  
  onMount(async () => {
    const monaco = await loader.init()
    editor.setMonaco(monaco)
    
    const editorInstance = monaco.editor.create(editorContainer, {
      value: content,
      language: getLanguageFromFilename(filename),
      theme: $settings.theme,
      minimap: { enabled: $settings.minimap },
      automaticLayout: true,
      fontSize: $settings.fontSize,
      lineNumbers: $settings.lineNumbers,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      tabSize: $settings.tabSize,
      wordWrap: $settings.wordWrap
    })
    
    editor.setInstance(editorInstance)
    
    // Handle content changes
    editorInstance.onDidChangeModelContent(() => {
      const value = editorInstance.getValue()
      onChange(value)
    })
    
    // Set up auto-save if enabled
    if ($settings.autoSave) {
      autoSaveInterval = window.setInterval(() => {
        const value = editorInstance.getValue()
        onChange(value)
      }, 5000) // Auto-save every 5 seconds
    }
    
    // Apply settings changes
    const unsubscribe = settings.subscribe(newSettings => {
      if (editorInstance) {
        editorInstance.updateOptions({
          theme: newSettings.theme,
          fontSize: newSettings.fontSize,
          tabSize: newSettings.tabSize,
          wordWrap: newSettings.wordWrap,
          minimap: { enabled: newSettings.minimap },
          lineNumbers: newSettings.lineNumbers
        })
        
        // Update auto-save
        if (newSettings.autoSave && !autoSaveInterval) {
          autoSaveInterval = window.setInterval(() => {
            const value = editorInstance.getValue()
            onChange(value)
          }, 5000)
        } else if (!newSettings.autoSave && autoSaveInterval) {
          clearInterval(autoSaveInterval)
          autoSaveInterval = undefined
        }
      }
    })
    
    return () => {
      unsubscribe()
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval)
      }
      editorInstance.dispose()
      editor.reset()
    }
  })
  
  $: if ($editor.instance && content !== $editor.instance.getValue()) {
    $editor.instance.setValue(content)
  }
  
  $: if ($editor.instance && filename) {
    const model = $editor.instance.getModel()
    if (model) {
      $editor.monaco?.editor.setModelLanguage(
        model,
        getLanguageFromFilename(filename)
      )
    }
  }
</script>

<div 
  bind:this={editorContainer}
  class="w-full h-full"
/>

<style>
  div {
    overflow: hidden;
  }
</style>
