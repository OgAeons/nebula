import { create } from 'zustand'

interface AppSettings {
    theme: 'dark' | 'light'
    clusterView: '2D' | '3D'
    toggleView: () => void
    toggleTheme: () => void
}

export const useAppSettings = create<AppSettings>((set) => ({
    theme: 'dark',
    clusterView: '2D',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    toggleView: () => set((state) => ({ clusterView: state.clusterView === '2D' ? '3D' : '2D' })),
}))
