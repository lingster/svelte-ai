
<script lang="ts">
  import { ideMode } from '$lib/stores/ideMode'
  import { createEventDispatcher } from 'svelte'
  
  const dispatch = createEventDispatcher()
  
  function handleNewProject() {
    dispatch('newProject')
  }
  
  function handleCompile() {
    dispatch('compile')
  }
</script>

<div class="flex items-center gap-4 px-4 py-2 bg-gray-800 border-b border-gray-700">
  <button
    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
    on:click={handleNewProject}
  >
    New Project
  </button>
  
  <button
    class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
    on:click={handleCompile}
  >
    Compile & Run
  </button>
  
  <div class="flex items-center gap-2 ml-auto">
    <span class="text-sm text-gray-300">Mode:</span>
    <button
      class="px-3 py-1 rounded text-sm"
      class:bg-blue-600={$ideMode === 'edit'}
      class:hover:bg-blue-700={$ideMode === 'edit'}
      class:bg-green-600={$ideMode === 'run'}
      class:hover:bg-green-700={$ideMode === 'run'}
      on:click={() => ideMode.toggleMode()}
    >
      {$ideMode === 'edit' ? 'Edit' : 'Run'}
    </button>
  </div>
</div>
