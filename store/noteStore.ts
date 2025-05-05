import { create } from "zustand";

export interface Note {
  id: string;
  title?: string;
  content?: string;
}

interface NotesState {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  updateNoteTitle: (noteId: string, title: string) => void;
  updateNoteContent: (noteId: string, content: string) => void; // Added
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  updateNoteTitle: (noteId, title) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId ? { ...note, title } : note
      ),
    })),
  updateNoteContent: (noteId, content) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === noteId && note.content !== content
          ? { ...note, content }
          : note
      ),
    })),
}));
