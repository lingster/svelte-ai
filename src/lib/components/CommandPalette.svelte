
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'
  
  export let isVisible = false
  
  const dispatch = createEventDispatcher()
  
  interface Command {
    id: string
    title: string
    shortcut?: string
    category: string
  }
  
  const commands: Command[] = [
    { id: 'new-project', title: 'New Project', shortcut: '⌘N', category: 'Project' },
    { id: 'compile-run', title: 'Compile and Run', shortcut: '⌘R', category: 'Run' },
    { id: 'toggle-preview', title: 'Toggle Preview', shortcut: '⌘P', category: 'View' },
    { id: 'format-code', title: 'Format Code', shortcut: '⇧⌘F', category: 'Edit' },
  ]
  
  let searchTerm = ''
  let selectedIndex = 0
  
  $: filteredCommands = commands
    .filter(cmd => 
      cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  
  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = (selectedIndex + 1) % filteredCommands.length
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex = selectedIndex - 1 < 0 
          ? filteredCommands.length - 1 
          : selectedIndex - 1
        break
      case 'Enter':
        event.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
    }
  }
  
  function executeCommand(command: Command) {
    dispatch('execute', command)
    close()
  }
  
  function close() {
    searchTerm = ''
    selectedIndex = 0
    dispatch('close')
  }
</script>

{#if isVisible}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32"
    transition:fade
    on:click={close}
  >
    <div
      class="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl"
      transition:scale
      on:click|stopPropagation
    >
      <input
        type="text"
        class="w-full bg-transparent px-4 py-3 text-white border-b border-gray-700 focus:outline-none"
        placeholder="Type a command or search..."
        bind:value={searchTerm}
        on:keydown={handleKeydown}
        autofocus
      />
      
      <div class="max-h-96 overflow-y-auto">
        {#each filteredCommands as command, i}
          <button
            class="w-full px-4 py-2 flex items-center gap-4 hover:bg-gray-700 text-left"
            class:bg-gray-700={i === selectedIndex}
            on:click={() => executeCommand(command)}
          >
            <div class="flex-1">
              <div class="text-white">{command.title}</div>
              <div class="text-sm text-gray-400">{command.category}</div>
            </div>
            {#if command.shortcut}
              <div class="text-sm text-gray-400">{command.shortcut}</div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
