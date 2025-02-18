
<script lang="ts">
  import { writable } from 'svelte/store'
  
  export const errors = writable<Array<{
    message: string
    line?: number
    column?: number
    severity: 'error' | 'warning'
  }>>([])
  
  export let isVisible = false
</script>

<div 
  class="border-t border-gray-700 bg-gray-800"
  class:hidden={!isVisible || $errors.length === 0}
>
  <div class="px-4 py-2 border-b border-gray-700 flex items-center">
    <h3 class="font-medium text-white">Problems</h3>
    <span class="ml-2 px-2 py-0.5 bg-red-600 rounded-full text-xs text-white">
      {$errors.length}
    </span>
    <button 
      class="ml-auto text-gray-400 hover:text-white"
      on:click={() => errors.set([])}
    >
      Clear
    </button>
  </div>
  
  <div class="max-h-32 overflow-y-auto">
    {#each $errors as error}
      <div class="px-4 py-2 border-b border-gray-700 flex items-start gap-2">
        <span class={error.severity === 'error' ? 'text-red-500' : 'text-yellow-500'}>
          {error.severity === 'error' ? '⚠️' : '⚡'}
        </span>
        <div class="flex-1">
          <p class="text-white">{error.message}</p>
          {#if error.line}
            <p class="text-sm text-gray-400">
              Line {error.line}{#if error.column}, Column {error.column}{/if}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
