
<script lang="ts">
  import { fileSystem, type FileNode } from '$lib/stores/fileSystem'
  import { createEventDispatcher } from 'svelte'
  
  export let node: FileNode
  export let level = 0
  
  const dispatch = createEventDispatcher()
  let isExpanded = true
  
  function handleClick() {
    if (node.type === 'file') {
      fileSystem.selectFile(node)
      dispatch('select', node)
    } else {
      isExpanded = !isExpanded
    }
  }
  
  function getIcon(node: FileNode): string {
    if (node.type === 'directory') {
      return isExpanded ? '📂' : '📁'
    }
    
    const ext = node.name.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'svelte':
        return '🔥'
      case 'ts':
      case 'tsx':
        return '📘'
      case 'js':
      case 'jsx':
        return '📜'
      case 'css':
        return '🎨'
      case 'json':
        return '📋'
      default:
        return '📄'
    }
  }
</script>

<div class="select-none">
  <div
    class="flex items-center hover:bg-gray-700 cursor-pointer px-2 py-1"
    style="padding-left: {level * 1.5}rem"
    on:click={handleClick}
  >
    <span class="mr-2">{getIcon(node)}</span>
    <span class="truncate">{node.name}</span>
  </div>
  
  {#if node.type === 'directory' && isExpanded && node.children}
    <div>
      {#each node.children as child (child.path)}
        <svelte:self node={child} level={level + 1} on:select />
      {/each}
    </div>
  {/if}
</div>
