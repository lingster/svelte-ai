import * as esbuild from 'esbuild-wasm'

let initialized = false

export async function initializeCompiler() {
  if (!initialized) {
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.19.0/esbuild.wasm'
    })
    initialized = true
  }
}

export async function compileSvelteCode(code: string) {
  await initializeCompiler()
  
  try {
    const result = await esbuild.transform(code, {
      loader: 'jsx',
      format: 'esm',
      target: 'es2020'
    })
    
    return result.code
  } catch (error) {
    console.error('Compilation error:', error)
    throw error
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function getLanguageFromFilename(filename: string): string {
  const ext = getFileExtension(filename)
  
  switch (ext) {
    case 'svelte':
      return 'svelte'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    default:
      return 'plaintext'
  }
}