
<script lang="ts">
  import { editor } from '$lib/stores/editor'
  import { fileSystem } from '$lib/stores/fileSystem'
  
  let cursorPosition = { line: 1, column: 1 }
  
  $: if ($editor.instance) {
    $editor.instance.onDidChangeCursorPosition((e) => {
      cursorPosition = {
        line: e.position.lineNumber,
        column: e.position.column
      }
    })
  }
</script>

<div class="flex items-center px-2 py-1 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
  <div class="flex items-center gap-4">
    {#if $fileSystem.selectedFile}
      <span>
        {$fileSystem.selectedFile.name}
      </span>
      <span>
        Ln {cursorPosition.line}, Col {cursorPosition.column}
      </span>
    {/if}
  </div>
  
  <div class="ml-auto flex items-center gap-4">
    {#if $fileSystem.selectedFile}
      <span>
        {getLanguageFromFilename($fileSystem.selectedFile.name)}
      </span>
    {/if}
  </div>
</div>
