import { writable } from 'svelte/store'
import { findParentDirectory } from '$lib/utils/fileOperations'

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
        
        // Check if file already exists
        const existingFile = current.children.find(child => child.name === fileName)
        if (existingFile) {
          existingFile.content = content
        } else {
          current.children.push({
            name: fileName,
            type: 'file',
            content,
            path
          })
        }

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

    deleteNode: (path: string) =>
      update(state => {
        const pathParts = path.split('/').filter(Boolean)
        const parentPath = pathParts.slice(0, -1).join('/')
        const nodeName = pathParts[pathParts.length - 1]
        
        const parent = findParentDirectory(state.root, path)
        if (!parent || !parent.children) return state
        
        const index = parent.children.findIndex(child => child.name === nodeName)
        if (index !== -1) {
          parent.children.splice(index, 1)
          
          // If deleted node was selected, clear selection
          if (state.selectedFile?.path === path) {
            state.selectedFile = null
          }
        }
        
        return state
      }),

    renameNode: (oldPath: string, newPath: string) =>
      update(state => {
        const oldParts = oldPath.split('/').filter(Boolean)
        const newParts = newPath.split('/').filter(Boolean)
        const oldName = oldParts[oldParts.length - 1]
        const newName = newParts[newParts.length - 1]
        
        const parent = findParentDirectory(state.root, oldPath)
        if (!parent || !parent.children) return state
        
        const node = parent.children.find(child => child.name === oldName)
        if (node) {
          node.name = newName
          node.path = newPath
          
          // Update paths of all children if it's a directory
          if (node.type === 'directory' && node.children) {
            const updateChildPaths = (children: FileNode[], oldPrefix: string, newPrefix: string) => {
              for (const child of children) {
                child.path = child.path.replace(oldPrefix, newPrefix)
                if (child.type === 'directory' && child.children) {
                  updateChildPaths(child.children, oldPrefix, newPrefix)
                }
              }
            }
            
            updateChildPaths(node.children, oldPath, newPath)
          }
          
          // Update selection if renamed node was selected
          if (state.selectedFile?.path === oldPath) {
            state.selectedFile = node
          }
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
      }),
      
    reset: () => set(initialState)
  }
}

export const fileSystem = createFileSystemStore()