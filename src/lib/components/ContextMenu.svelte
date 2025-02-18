
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { FileNode } from '$lib/stores/fileSystem'
  
  export let show = false
  export let x = 0
  export let y = 0
  export let node: FileNode | null = null
  
  const dispatch = createEventDispatcher()
  
  let menuElement: HTMLDivElement
  
  // Adjust menu position to stay within viewport
  $: {
    if (menuElement) {
      const rect = menuElement.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width
      }
      
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height
      }
    }
  }
  
  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (show && !menuElement.contains(event.target as Node)) {
      show = false
    }
  }
  
  const fileItems = [
    { id: 'rename', label: 'Rename', icon: '✏️' },
    { id: 'delete', label: 'Delete', icon: '🗑️' },
    { id: 'copy', label: 'Copy', icon: '📋' }
  ]
  
  const directoryItems = [
    { id: 'newFile', label: 'New File', icon: '📄' },
    { id: 'newFolder', label: 'New Folder', icon: '📁' },
    { id: 'rename', label: 'Rename', icon: '✏️' },
    { id: 'delete', label: 'Delete', icon: '🗑️' }
  ]
  
  function handleItemClick(itemId: string) {
    dispatch('action', {
      type: itemId,
      node
    })
    show = false
  }
</script>

<svelte:window on:click={handleClickOutside} />

{#if show}
  <div
    bind:this={menuElement}
    class="absolute bg-gray-800 rounded shadow-lg border border-gray-700 py-1 min-w-[160px] z-50"
    style="left: {x}px; top: {y}px"
  >
    {#each (node?.type === 'directory' ? directoryItems : fileItems) as item}
      <button
        class="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
        on:click={() => handleItemClick(item.id)}
      >
        <span class="w-5">{item.icon}</span>
        <span class="text-gray-200">{item.label}</span>
      </button>
    {/each}
  </div>
{/if}
