import { create } from 'zustand'

interface AppSettings {
    theme: 'dark' | 'light'
    toggleTheme: () => void
}

export const useAppSettings = create<AppSettings>((set) => ({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}))
