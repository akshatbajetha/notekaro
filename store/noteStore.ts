import { create } from "zustand";

export const useNoteIdStore = create((set) => ({
  selectedNoteId: "",
  setSelectedNoteId: (newSelectedNoteId: string) =>
    set({ selectedNoteId: newSelectedNoteId }),
}));
