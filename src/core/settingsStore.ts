import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const Languages = ["en", "it"] as const;
export type Language = typeof Languages[number]
export type SettingsStore = {
  language: Language;
  setLanguage: (language: Language) => void
};

const usePersistedStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set(() => ({ language: language })),
    }),
    {
      name: "nsm-settings-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

const emptyStore = create<SettingsStore>()((set) => ({
  language: 'en',
  setLanguage: (language) => set(() => ({ language: language })),
}));

export const useSettingsStore = (() => {
  const mounted = usePersistedStore();
  return mounted ? mounted : emptyStore;
}) as typeof usePersistedStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("SettingStore", usePersistedStore);
}
