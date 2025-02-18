
<script lang="ts">
  import { onMount } from 'svelte'
  
  export let compiledCode = ''
  let iframe: HTMLIFrameElement
  
  $: if (iframe && compiledCode) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin: 0; }
          </style>
        </head>
        <body>
          <div id="app"></div>
          <script type="module">
            ${compiledCode}
          </script>
        </body>
      </html>
    `
    
    iframe.srcdoc = html
  }
  
  onMount(() => {
    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) {
        console.log('Preview message:', event.data)
      }
    })
  })
</script>

<iframe
  title="Preview"
  bind:this={iframe}
  class="w-full h-full border-0"
  sandbox="allow-scripts allow-popups allow-modals allow-forms allow-same-origin"
/>
