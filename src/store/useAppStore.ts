import { create } from 'zustand'
import type { AnalyzedData } from '../utils/analyzeData'

// types
export interface AppStore {
    // Data state
    rawNodes: any[]
    allColumns: string[]
    numericColumns: string[]
    categoricalColumns: string[]

    // Node Selection state
    isLoading: boolean
    selectedNodeId: string | null

    // User Column selection state
    selectedLabel: string | null
    selectedFeatures: string[]

    kNeighbours: number

    // app theme
    theme: 'dark' | 'light'

    //Actions
    selectNode: (id: string) => void
    clearSelection: () => void
    setAnalyzedData: (data: AnalyzedData) => void
    setSelectedLabel: (column: string) => void
    setSelectedFeatures: (columns: string[]) => void
    setKNeighbours: (k: number) => void
    toggleTheme: () => void
}

export const useAppStore = create<AppStore>((set) => ({
    // Data state
    rawNodes: [],
    allColumns: [],
    numericColumns: [],
    categoricalColumns: [],

    // Node Selection state
    isLoading: false,
    selectedNodeId: null,

    // User Column selection state
    selectedLabel: null,
    selectedFeatures: [],

    kNeighbours: 5,

    // app theme state
    theme: 'dark',

    // Actions
    selectNode: (id) => set({ selectedNodeId: id }),
    clearSelection: () => set({ selectedNodeId: null }),
    setSelectedLabel: (column) => set({ selectedLabel: column }),
    setSelectedFeatures: (columns) => set({ selectedFeatures: columns }),
    setKNeighbours: (k) => set({ kNeighbours: k }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    setAnalyzedData: (data) => {
        set({
            rawNodes: data.rawNodes,
            allColumns: data.allColumns,
            numericColumns: data.numericColumns,
            categoricalColumns: data.categoricalColumns,
            selectedLabel: data.defaultLabel,
            selectedFeatures: [],
            isLoading: false,
            selectedNodeId: null
        })
    }
}))