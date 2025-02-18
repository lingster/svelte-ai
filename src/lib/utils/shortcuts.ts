import { browser } from '$app/environment'

type ShortcutHandler = () => void

interface Shortcut {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  handler: ShortcutHandler
}

const shortcuts: Shortcut[] = []

export function registerShortcut(shortcut: Shortcut) {
  shortcuts.push(shortcut)
}

if (browser) {
  window.addEventListener('keydown', (event) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      if (shortcut.key.toLowerCase() !== event.key.toLowerCase()) return false
      if (shortcut.metaKey && !event.metaKey) return false
      if (shortcut.ctrlKey && !event.ctrlKey) return false
      if (shortcut.shiftKey && !event.shiftKey) return false
      if (shortcut.altKey && !event.altKey) return false
      return true
    })
    
    if (matchingShortcut) {
      event.preventDefault()
      matchingShortcut.handler()
    }
  })
}

export function unregisterShortcut(shortcut: Shortcut) {
  const index = shortcuts.findIndex(s => s === shortcut)
  if (index !== -1) {
    shortcuts.splice(index, 1)
  }
}