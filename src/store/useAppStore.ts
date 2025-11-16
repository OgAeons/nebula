import { create } from 'zustand'
import sample from "../data/sample.json"

export interface BasicNode {
    id: string
    label: string
}

interface AppStore {
    // app theme
    theme: 'dark' | 'light'
    toggleTheme: () => void
    
    // select and clear node
    selectedNodeId: string | null
    selectNode: (id: string) => void
    clearSelection: () => void

    // data
    nodes: BasicNode[]
}

export const useAppStore = create<AppStore>((set) => ({
    // app theme state
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

    // select and clear node state
    selectedNodeId: null,
    selectNode: (id) => set({ selectedNodeId: id}),
    clearSelection: () => set({ selectedNodeId: null}),

    // data state
    nodes: sample as BasicNode[],
}))
