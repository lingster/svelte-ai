
<script lang="ts">
  import { SplitPane } from 'svelte-splitpane'
  import { fileSystem, type FileNode } from '$lib/stores/fileSystem'
  import { ideMode } from '$lib/stores/ideMode'
  import { compileSvelteCode } from '$lib/utils/compiler'
  import FileTree from './FileTree.svelte'
  import Editor from './Editor.svelte'
  import Preview from './Preview.svelte'
  import Toolbar from './Toolbar.svelte'
  
  let compiledCode = ''
  
  function handleFileSelect(event: CustomEvent<FileNode>) {
    const file = event.detail
    if (file.type === 'file') {
      fileSystem.selectFile(file)
    }
  }
  
  async function handleCompile() {
    if ($fileSystem.selectedFile?.content) {
      try {
        compiledCode = await compileSvelteCode($fileSystem.selectedFile.content)
        ideMode.setMode('run')
      } catch (error) {
        console.error('Compilation failed:', error)
        // TODO: Show error in UI
      }
    }
  }
  
  function handleNewProject() {
    // Create a new SvelteKit project structure
    const projectStructure = {
      'src/routes/+page.svelte': `
<script lang="ts">
  let count = 0
  
  function increment() {
    count += 1
  }
</script>

<main class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Welcome to SvelteKit</h1>
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded"
    on:click={increment}
  >
    Count is {count}
  </button>
</main>
      `,
      'src/routes/+layout.svelte': `
<script>
  import "../app.css"
</script>

<slot />
      `,
      'src/app.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;
      `
    }
    
    // Create the project files
    Object.entries(projectStructure).forEach(([path, content]) => {
      fileSystem.createFile(path, content)
    })
  }
  
  function handleContentChange(content: string) {
    if ($fileSystem.selectedFile) {
      fileSystem.updateFileContent($fileSystem.selectedFile.path, content)
    }
  }
</script>

<div class="h-screen flex flex-col">
  <Toolbar
    on:newProject={handleNewProject}
    on:compile={handleCompile}
  />
  
  <div class="flex-1 overflow-hidden">
    <SplitPane
      type="horizontal"
      leftPaneSize="20"
      minLeftPaneSize={15}
      maxLeftPaneSize={30}
    >
      <div slot="left" class="h-full bg-gray-800 overflow-y-auto">
        <FileTree
          node={$fileSystem.root}
          on:select={handleFileSelect}
        />
      </div>
      
      <div slot="right" class="h-full">
        {#if $ideMode === 'edit' && $fileSystem.selectedFile}
          <Editor
            content={$fileSystem.selectedFile.content || ''}
            filename={$fileSystem.selectedFile.name}
            onChange={handleContentChange}
          />
        {:else if $ideMode === 'run'}
          <Preview {compiledCode} />
        {:else}
          <div class="flex items-center justify-center h-full text-gray-500">
            Select a file to edit or create a new project
          </div>
        {/if}
      </div>
    </SplitPane>
  </div>
</div>
