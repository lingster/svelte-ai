
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fileSystem, type FileNode } from '$lib/stores/fileSystem'
  import { buildFilePath, getDefaultFileContent } from '$lib/utils/fileOperations'
  import ContextMenu from './ContextMenu.svelte'
  import FileModal from './FileModal.svelte'
  
  export let node: FileNode
  export let level = 0
  
  const dispatch = createEventDispatcher()
  let isExpanded = true
  
  // Context Menu
  let showContextMenu = false
  let contextMenuX = 0
  let contextMenuY = 0
  let contextMenuNode: FileNode | null = null
  
  // File Modal
  let showFileModal = false
  let fileModalType: 'new-file' | 'new-folder' | 'rename' = 'new-file'
  let fileModalParentPath = '/'
  let fileModalInitialName = ''
  
  function handleClick() {
    if (node.type === 'file') {
      fileSystem.selectFile(node)
      dispatch('select', node)
    } else {
      isExpanded = !isExpanded
    }
  }
  
  function handleContextMenu(event: MouseEvent) {
    event.preventDefault()
    contextMenuX = event.clientX
    contextMenuY = event.clientY
    contextMenuNode = node
    showContextMenu = true
  }
  
  function handleContextMenuAction(event: CustomEvent) {
    const { type, node: targetNode } = event.detail
    
    if (!targetNode) return
    
    switch (type) {
      case 'newFile':
        fileModalType = 'new-file'
        fileModalParentPath = targetNode.path
        fileModalInitialName = ''
        showFileModal = true
        break
        
      case 'newFolder':
        fileModalType = 'new-folder'
        fileModalParentPath = targetNode.path
        fileModalInitialName = ''
        showFileModal = true
        break
        
      case 'rename':
        fileModalType = 'rename'
        fileModalParentPath = targetNode.path
        fileModalInitialName = targetNode.name
        showFileModal = true
        break
        
      case 'delete':
        if (confirm(`Are you sure you want to delete ${targetNode.name}?`)) {
          fileSystem.deleteNode(targetNode.path)
        }
        break
        
      case 'copy':
        if (targetNode.type === 'file' && targetNode.content) {
          navigator.clipboard.writeText(targetNode.content)
        }
        break
    }
  }
  
  function handleFileModalSubmit(event: CustomEvent) {
    const { name, type, parentPath } = event.detail
    
    switch (type) {
      case 'new-file':
        const filePath = buildFilePath(parentPath, name)
        const content = getDefaultFileContent(name)
        fileSystem.createFile(filePath, content)
        break
        
      case 'new-folder':
        const folderPath = buildFilePath(parentPath, name)
        fileSystem.createDirectory(folderPath)
        break
        
      case 'rename':
        if (contextMenuNode) {
          const newPath = buildFilePath(
            parentPath.replace(contextMenuNode.name, ''),
            name
          )
          fileSystem.renameNode(contextMenuNode.path, newPath)
        }
        break
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
    on:contextmenu={handleContextMenu}
  >
    <span class="mr-2">{getIcon(node)}</span>
    <span class="truncate">{node.name}</span>
  </div>
  
  {#if node.type === 'directory' && isExpanded && node.children}
    <div>
      {#each node.children as child (child.path)}
        <svelte:self 
          node={child} 
          level={level + 1} 
          on:select
        />
      {/each}
    </div>
  {/if}
</div>

<ContextMenu
  bind:show={showContextMenu}
  x={contextMenuX}
  y={contextMenuY}
  node={contextMenuNode}
  on:action={handleContextMenuAction}
/>

<FileModal
  bind:show={showFileModal}
  type={fileModalType}
  parentPath={fileModalParentPath}
  initialName={fileModalInitialName}
  on:submit={handleFileModalSubmit}
/>
