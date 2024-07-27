import { create } from 'zustand';

export const useContextApi = create((set) => ({
    font: '',
    setFont: (newFont) => set({ font: newFont }),
}));
