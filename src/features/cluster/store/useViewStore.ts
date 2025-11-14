import { create } from 'zustand'

interface ViewMode {
    clusterView: '2D' | '3D'
    toggleView: () => void
}

export const useViewStore = create<ViewMode>((set) => ({
    clusterView: '2D',
    toggleView: () => set((state) => ({ clusterView: state.clusterView === '2D' ? '3D' : '2D' })),
}))
