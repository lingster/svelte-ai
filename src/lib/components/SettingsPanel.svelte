
<script lang="ts">
  import { settings, type EditorSettings } from '$lib/stores/settings'
  import { fade, slide } from 'svelte/transition'
  
  export let isVisible = false
  
  const themeOptions = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'vs-light', label: 'Light' }
  ]
  
  const fontSizeOptions = Array.from({ length: 8 }, (_, i) => ({
    value: i + 12,
    label: `${i + 12}px`
  }))
  
  const tabSizeOptions = [2, 4, 8].map(size => ({
    value: size,
    label: size.toString()
  }))
  
  function handleReset() {
    settings.reset()
  }
</script>

{#if isVisible}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    transition:fade
    on:click={() => isVisible = false}
  >
    <div
      class="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl"
      transition:slide
      on:click|stopPropagation
    >
      <div class="px-6 py-4 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">Editor Settings</h2>
      </div>
      
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- Theme -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              Theme
            </label>
            <select
              class="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              bind:value={$settings.theme}
            >
              {#each themeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
          
          <!-- Font Size -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              Font Size
            </label>
            <select
              class="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              bind:value={$settings.fontSize}
            >
              {#each fontSizeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
          
          <!-- Tab Size -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">
              Tab Size
            </label>
            <select
              class="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 text-white"
              bind:value={$settings.tabSize}
            >
              {#each tabSizeOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
          
          <!-- Toggles -->
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 bg-gray-700 rounded border-gray-600"
                bind:checked={$settings.wordWrap}
              />
              <span class="text-sm text-gray-300">Word Wrap</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 bg-gray-700 rounded border-gray-600"
                bind:checked={$settings.minimap}
              />
              <span class="text-sm text-gray-300">Show Minimap</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 bg-gray-700 rounded border-gray-600"
                bind:checked={$settings.formatOnSave}
              />
              <span class="text-sm text-gray-300">Format on Save</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                class="w-4 h-4 bg-gray-700 rounded border-gray-600"
                bind:checked={$settings.autoSave}
              />
              <span class="text-sm text-gray-300">Auto Save</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-700 flex justify-end space-x-4">
        <button
          class="px-4 py-2 text-gray-300 hover:text-white"
          on:click={handleReset}
        >
          Reset to Defaults
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          on:click={() => isVisible = false}
        >
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
