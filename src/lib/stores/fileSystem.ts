import { writable } from 'svelte/store'

export type FileType = 'file' | 'directory'

export interface FileNode {
  name: string
  type: FileType
  content?: string
  children?: FileNode[]
  path: string
}

export interface FileSystemState {
  root: FileNode
  currentFile: string | null
  selectedFile: FileNode | null
}

const initialState: FileSystemState = {
  root: {
    name: 'root',
    type: 'directory',
    path: '/',
    children: []
  },
  currentFile: null,
  selectedFile: null
}

function createFileSystemStore() {
  const { subscribe, set, update } = writable<FileSystemState>(initialState)

  return {
    subscribe,
    createFile: (path: string, content: string = '') => 
      update(state => {
        const pathParts = path.split('/').filter(Boolean)
        let current = state.root
        
        // Navigate to parent directory
        for (let i = 0; i < pathParts.length - 1; i++) {
          const dir = current.children?.find(child => 
            child.name === pathParts[i] && child.type === 'directory'
          )
          if (!dir) return state
          current = dir
        }

        // Create new file
        const fileName = pathParts[pathParts.length - 1]
        if (!current.children) current.children = []
        
        current.children.push({
          name: fileName,
          type: 'file',
          content,
          path
        })

        return state
      }),

    createDirectory: (path: string) =>
      update(state => {
        const pathParts = path.split('/').filter(Boolean)
        let current = state.root
        
        for (const part of pathParts) {
          if (!current.children) current.children = []
          
          let dir = current.children.find(child => 
            child.name === part && child.type === 'directory'
          )
          
          if (!dir) {
            dir = {
              name: part,
              type: 'directory',
              path: `${current.path}${part}/`,
              children: []
            }
            current.children.push(dir)
          }
          
          current = dir
        }

        return state
      }),

    selectFile: (file: FileNode | null) =>
      update(state => ({ ...state, selectedFile: file })),

    updateFileContent: (path: string, content: string) =>
      update(state => {
        const pathParts = path.split('/').filter(Boolean)
        let current = state.root
        
        // Navigate to file
        for (let i = 0; i < pathParts.length - 1; i++) {
          const dir = current.children?.find(child => 
            child.name === pathParts[i] && child.type === 'directory'
          )
          if (!dir) return state
          current = dir
        }

        const file = current.children?.find(child =>
          child.name === pathParts[pathParts.length - 1] && child.type === 'file'
        )
        
        if (file) {
          file.content = content
        }

        return state
      })
  }
}

export const fileSystem = createFileSystemStore()