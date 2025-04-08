import { create } from "zustand";

export const useNoteIdStore = create((set) => ({
  selectedNoteId: "",
  selectedNoteTitle: "",
  setSelectedNoteId: (newSelectedNoteId: string) =>
    set({ selectedNoteId: newSelectedNoteId }),
  setSelectedNoteTitle: (newSelectedNoteTitle: string) =>
    set({ selectedNoteTitle: newSelectedNoteTitle }),
}));
