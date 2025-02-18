import type { FileNode } from '$lib/stores/fileSystem'

export async function createSvelteKitProject(root: string = '/') {
  const baseFiles = {
    'package.json': `{
  "name": "svelte-app",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "svelte": "^4.2.7",
    "svelte-check": "^3.6.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.3",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}`,
    'tsconfig.json': `{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true,
    "strict": true
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
}`,
    'vite.config.ts': `import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()]
})`,
    'svelte.config.js': `import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  preprocess: vitePreprocess()
}

export default config`,
    'src/app.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`,
    'src/routes/+layout.svelte': `<script lang="ts">
  import '../app.css'
</script>

<slot />`,
    'src/routes/+page.svelte': `<script lang="ts">
  let greeting = 'Welcome to SvelteKit'
</script>

<main class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{greeting}</h1>
  <p class="text-gray-600">
    Visit <a href="https://kit.svelte.dev" class="text-blue-500 hover:underline">kit.svelte.dev</a> 
    to read the documentation
  </p>
</main>`,
    'src/app.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}`,
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
}`,
    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}`
  }

  return baseFiles
}

export function validateFileName(name: string): boolean {
  // Check if name is empty or contains invalid characters
  if (!name || /[<>:"/\\|?*\x00-\x1F]/.test(name)) {
    return false
  }
  
  // Check if name starts or ends with a period or space
  if (/^[\s.]|[\s.]$/.test(name)) {
    return false
  }
  
  // Check reserved Windows filenames
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ]
  
  if (reservedNames.includes(name.toUpperCase())) {
    return false
  }
  
  return true
}

export function getDefaultFileContent(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'svelte':
      return `<script lang="ts">
  // Your script goes here
</script>

<main>
  <!-- Your content goes here -->
</main>

<style>
  /* Your styles go here */
</style>`
    
    case 'ts':
      return `// TypeScript code goes here`
    
    case 'js':
      return `// JavaScript code goes here`
    
    case 'css':
      return `/* CSS styles go here */`
    
    case 'json':
      return `{
  
}`
    
    default:
      return ''
  }
}

export function findParentDirectory(node: FileNode, path: string): FileNode | null {
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return null
  
  let current = node
  for (let i = 0; i < parts.length - 1; i++) {
    const child = current.children?.find(c => c.name === parts[i] && c.type === 'directory')
    if (!child) return null
    current = child
  }
  
  return current
}

export function buildFilePath(parentPath: string, fileName: string): string {
  return `${parentPath}${parentPath.endsWith('/') ? '' : '/'}${fileName}`
}