
<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade, scale } from 'svelte/transition'
  import { validateFileName } from '$lib/utils/fileOperations'
  
  export let show = false
  export let type: 'new-file' | 'new-folder' | 'rename' = 'new-file'
  export let parentPath = '/'
  export let initialName = ''
  
  const dispatch = createEventDispatcher()
  
  let name = initialName
  let error = ''
  
  $: title = {
    'new-file': 'New File',
    'new-folder': 'New Folder',
    'rename': 'Rename'
  }[type]
  
  function handleSubmit() {
    if (!name) {
      error = 'Name cannot be empty'
      return
    }
    
    if (!validateFileName(name)) {
      error = 'Invalid file name'
      return
    }
    
    dispatch('submit', { name, type, parentPath })
    close()
  }
  
  function close() {
    show = false
    name = initialName
    error = ''
  }
</script>

{#if show}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade
    on:click={close}
  >
    <div
      class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      transition:scale
      on:click|stopPropagation
    >
      <div class="px-6 py-4 border-b border-gray-700">
        <h3 class="text-lg font-medium text-white">{title}</h3>
      </div>
      
      <form on:submit|preventDefault={handleSubmit}>
        <div class="px-6 py-4">
          <label class="block">
            <span class="text-gray-300">Name</span>
            <input
              type="text"
              bind:value={name}
              class="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white"
              placeholder={type === 'new-folder' ? 'Folder name' : 'File name'}
              autofocus
            />
          </label>
          
          {#if error}
            <p class="mt-2 text-red-500 text-sm">{error}</p>
          {/if}
        </div>
        
        <div class="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
          <button
            type="button"
            class="px-4 py-2 text-gray-300 hover:text-white"
            on:click={close}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {type === 'rename' ? 'Rename' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
