import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  // Financial Parameters
  currency: 'BRL' | 'USD' | 'EUR';
  defaultTaxRate: number; // e.g. 6 for 6%
  defaultMarkup: number; // e.g. 30 for 30%
  workHoursPerMonth: number; // e.g. 160

  // Workspace Engineering
  magneticSnap: boolean;
  zoomSensitivity: 'low' | 'normal' | 'high';
  accentColor: 'yellow' | 'red' | 'green' | 'blue' | 'white';

  // Actions
  setCurrency: (currency: 'BRL' | 'USD' | 'EUR') => void;
  setDefaultTaxRate: (rate: number) => void;
  setDefaultMarkup: (markup: number) => void;
  setWorkHoursPerMonth: (hours: number) => void;
  setMagneticSnap: (snap: boolean) => void;
  setZoomSensitivity: (sensitivity: 'low' | 'normal' | 'high') => void;
  setAccentColor: (color: 'yellow' | 'red' | 'green' | 'blue' | 'white') => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      // Default Values
      currency: 'BRL',
      defaultTaxRate: 6,
      defaultMarkup: 30,
      workHoursPerMonth: 160,
      
      magneticSnap: true,
      zoomSensitivity: 'normal',
      accentColor: 'white', // Default text-white for tools

      // Setters
      setCurrency: (currency) => set({ currency }),
      setDefaultTaxRate: (defaultTaxRate) => set({ defaultTaxRate }),
      setDefaultMarkup: (defaultMarkup) => set({ defaultMarkup }),
      setWorkHoursPerMonth: (workHoursPerMonth) => set({ workHoursPerMonth }),
      setMagneticSnap: (magneticSnap) => set({ magneticSnap }),
      setZoomSensitivity: (zoomSensitivity) => set({ zoomSensitivity }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: '33xl-config-storage',
    }
  )
);
